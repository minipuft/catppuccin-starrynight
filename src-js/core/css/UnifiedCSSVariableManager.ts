// Consolidates CSS variable management across the entire system:
// - UnifiedCSSVariableManager: High-performance batching and critical variable handling
// - UnifiedCSSVariableManager: Priority-based transactions and variable groups
// - UnifiedCSSVariableManager: Device-aware performance optimization
//
// The unified controller provides visual-effects-driven CSS updates that
// adapt to music, aesthetics, performance constraints, and device capabilities.

import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import {
  UnifiedPerformanceCoordinator,
  type DeviceCapabilities,
  type PerformanceMode,
} from "@/core/performance/UnifiedPerformanceCoordinator";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";

// ===================================================================
// INTERFACES AND TYPES
// ===================================================================

export interface VisualEffectsState {
  musicState?: {
    intensity: number;
    bpm: number;
    rhythmPhase: number;
    animationScale: number;
    energy: number;
    valence: number;
  };
  aestheticState?: {
    harmonyLevel: number;
    evolutionFactor: number;
    colorTemperature: number;
  };
  performanceState?: {
    mode: string;
    deviceTier: string;
    optimizationLevel: number;
  };
  // Animation and UI states
  "hover.pull"?: string;
  "focus.pull"?: string;
  "transition.speed"?: string;
  "field.intensity"?: number;
  "field.animation.rate"?: string;
  "field.sensitivity"?: number;
  "bilateral.sync"?: boolean;
  // Breathing coordination for CSS-first Year 3000 system
  "animation.type"?: string;
  "animation.duration"?: string;
  "animation.intensity"?: number;
  "animation.energy"?: number;
  "animation.sync"?: number;
}

export interface CSSVisualEffectsConfig {
  // Batching configuration (from UnifiedCSSVariableManager)
  batchIntervalMs: number;
  maxBatchSize: number;
  enableDebug: boolean;
  enableSpiceVariableDebug?: boolean; // 🔧 CRITICAL DEBUG: Enable detailed --spice-* variable tracing
  useCssTextFastPath?: boolean;
  autoHijack?: boolean;

  // Performance configuration (from UnifiedCSSVariableManager)
  enableAdaptiveOptimization: boolean;
  enableThermalThrottling: boolean;
  enableBatteryOptimization: boolean;
  enableDeviceTierOptimization: boolean;
  debugPerformanceClasses: boolean;

  // Consciousness configuration (new)
  enableVisualEffectsIntegration: boolean;
  visualEffectsUpdateInterval: number;
  enableMusicVisualEffects: boolean;
  enableAestheticVisualEffects: boolean;
}

interface PendingUpdate {
  element: HTMLElement;
  property: string;
  value: string;
  timestamp: number;
  priority: "low" | "normal" | "high" | "critical";
  source: string;
}

interface CSSVariableTransaction {
  id: string;
  variables: Map<string, string>;
  timestamp: number;
  priority: "low" | "normal" | "high" | "critical";
  completed: boolean;
}

interface PerformanceMetrics {
  totalBatches: number;
  totalUpdates: number;
  totalBatchTime: number;
  maxBatchTime: number;
  averageBatchSize: number;
  overBudgetBatches: number;
  conflictResolutions: number;
  transactionCount: number;
  visualEffectsUpdates: number;
}

// ===================================================================
// CRITICAL VARIABLES (from UnifiedCSSVariableManager)
// ===================================================================

const CRITICAL_NOW_PLAYING_VARS = new Set<string>([
  // Legacy variables (Phase 1 migration)
  "--sn-beat-pulse-intensity",
  "--sn-animation-scale",
  "--sn-accent-hex",
  "--sn-accent-rgb",

  // New namespaced variables (Phase 2+)
  "--sn.music.beat.pulse.intensity",
  "--sn.music.animation.scale",
  "--sn.music.rhythm.phase",
  "--sn.music.spectrum.phase",
  "--sn.color.accent.hex",
  "--sn.color.accent.rgb",
  "--sn.bg.webgl.ready",
  "--sn.bg.active-backend",
]);

// ===================================================================
// UNIFIED CSS CONSCIOUSNESS CONTROLLER
// ===================================================================

/**
 * UnifiedCSSVariableManager - Phase 2.1 System Consolidation
 *
 * Combines functionality from:
 * - UnifiedCSSVariableManager: High-performance CSS variable batching
 * - UnifiedCSSVariableManager: Priority-based variable management
 * - UnifiedCSSVariableManager: Device-aware performance optimization
 *
 * Adds visual-effects-driven CSS updates that respond to:
 * - Music and rhythm analysis
 * - Aesthetic harmony calculations
 * - Performance and device constraints
 * - User interaction patterns
 *
 * @architecture Phase 2.1 of visual system consolidation
 * @performance Target: 60fps updates with <5ms CSS batch processing
 */
export class UnifiedCSSVariableManager implements IManagedSystem {
  public initialized: boolean = false;

  // Core dependencies
  private config: AdvancedSystemConfig | Year3000Config;
  private cssConfig: CSSVisualEffectsConfig;
  private performanceCoordinator: UnifiedPerformanceCoordinator;
  private eventBus: typeof unifiedEventBus;

  // === BATCHING LAYER (from UnifiedCSSVariableManager) ===
  private cssVariableQueue: Map<string, PendingUpdate> = new Map();
  private batchUpdateTimer: number | null = null;
  private rafHandle: number | null = null;
  private microtaskScheduled: boolean = false;

  // === MANAGEMENT LAYER (from UnifiedCSSVariableManager) ===
  private pendingTransactions: Map<string, CSSVariableTransaction> = new Map();
  private transactionCounter = 0;
  private updateQueue: Map<string, PendingUpdate> = new Map();
  private flushTimer: NodeJS.Timeout | null = null;

  // === PERFORMANCE LAYER (from UnifiedCSSVariableManager) ===
  private currentDeviceCapabilities: DeviceCapabilities | null = null;
  private currentPerformanceMode: PerformanceMode | null = null;
  private lastCSSUpdate = 0;
  private cssUpdateThrottle = 100; // Update CSS at most every 100ms
  private appliedClasses: Set<string> = new Set();

  // === CONSCIOUSNESS LAYER (new integration) ===
  private visualEffectsState: VisualEffectsState | null = null;
  private visualEffectsUpdateTimer: NodeJS.Timeout | null = null;
  private lastVisualEffectsUpdate = 0;

  // Performance tracking
  private performanceMetrics: PerformanceMetrics = {
    totalBatches: 0,
    totalUpdates: 0,
    totalBatchTime: 0,
    maxBatchTime: 0,
    averageBatchSize: 0,
    overBudgetBatches: 0,
    conflictResolutions: 0,
    transactionCount: 0,
    visualEffectsUpdates: 0,
  };

  // Native setProperty reference for fast-path writes
  private static nativeSetProperty?: typeof CSSStyleDeclaration.prototype.setProperty;
  private static hijackEnabled = false;

  // Priority weights for conflict resolution
  private readonly PRIORITY_WEIGHTS = {
    low: 1,
    normal: 2,
    high: 3,
    critical: 4,
  };

  constructor(
    config: AdvancedSystemConfig | Year3000Config,
    performanceCoordinator: UnifiedPerformanceCoordinator
  ) {
    this.config = config;
    this.performanceCoordinator = performanceCoordinator;
    this.eventBus = unifiedEventBus;

    // Initialize configuration with defaults
    this.cssConfig = {
      // Batching configuration
      batchIntervalMs: 0, // 0 = coalesced; scheduling handled via rAF/microtask
      maxBatchSize: 50,
      enableDebug: config.enableDebug,
      useCssTextFastPath: false,
      autoHijack: true,

      // Performance configuration
      enableAdaptiveOptimization: true,
      enableThermalThrottling: true,
      enableBatteryOptimization: true,
      enableDeviceTierOptimization: true,
      debugPerformanceClasses: config.enableDebug,

      // Consciousness configuration
      enableVisualEffectsIntegration: true,
      visualEffectsUpdateInterval: 16, // 60fps
      enableMusicVisualEffects: true,
      enableAestheticVisualEffects: true,
    };

    // Get initial device capabilities and performance mode
    this.currentDeviceCapabilities =
      this.performanceCoordinator.getDeviceCapabilities();
    this.currentPerformanceMode =
      this.performanceCoordinator.getCurrentPerformanceMode();

    // Note: Singleton pattern removed - instances managed through SystemCoordinator

    if (this.config.enableDebug) {
      console.log(
        "🌌 [UnifiedCSSVariableManager] Created with visual-effects-driven CSS management"
      );
    }
  }

  // Deprecated getInstance() method removed - use dependency injection through SystemCoordinator
  // or getGlobalOptimizedCSSController() for simple utility usage

  // ===================================================================
  // IMANAGEDYSTEM INTERFACE IMPLEMENTATION
  // ===================================================================

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Subscribe to events
    this.subscribeToEvents();

    // Apply initial optimizations
    this.applyInitialOptimizations();

    // Start visual-effects integration if enabled
    if (this.cssConfig.enableVisualEffectsIntegration) {
      this.startVisualEffectsIntegration();
    }

    // Enable global hijack if configured
    if (this.cssConfig.autoHijack) {
      this.enableGlobalHijack();
    }

    this.initialized = true;

    if (this.config.enableDebug) {
      console.log(
        "🌌 [UnifiedCSSVariableManager] Initialized with device tier:",
        this.currentDeviceCapabilities?.performanceTier
      );
    }
  }

  public updateAnimation(deltaTime: number): void {
    // Consciousness updates are handled by timer, no per-frame updates needed
    // This keeps the controller lightweight in the animation loop
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const queueSize = this.cssVariableQueue.size + this.updateQueue.size;
    const pendingTransactions = this.pendingTransactions.size;
    const isHealthy = queueSize <= 1000 && pendingTransactions <= 100;

    return {
      system: "UnifiedCSSVariableManager",
      healthy: isHealthy,
      ok: isHealthy,
      details: isHealthy
        ? "CSS visual-effects controller operating normally"
        : "High queue size or pending transactions",
      metrics: {
        queueSize,
        pendingTransactions,
        performanceMetrics: this.performanceMetrics,
        visualEffectsActive: this.visualEffectsState !== null,
        deviceTier: this.currentDeviceCapabilities?.performanceTier,
        performanceMode: this.currentPerformanceMode?.name,
      },
    };
  }

  public destroy(): void {
    // Stop visual-effects integration
    if (this.visualEffectsUpdateTimer) {
      clearTimeout(this.visualEffectsUpdateTimer);
      this.visualEffectsUpdateTimer = null;
    }

    // Clear all timers
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }

    // Flush any pending updates
    this.flushCSSVariableBatch();

    // Remove all applied CSS classes
    for (const className of this.appliedClasses) {
      document.body.classList.remove(className);
    }
    this.appliedClasses.clear();

    // Clear queues
    this.cssVariableQueue.clear();
    this.updateQueue.clear();
    this.pendingTransactions.clear();

    // Note: Singleton pattern removed - cleanup handled by SystemCoordinator

    this.initialized = false;

    if (this.config.enableDebug) {
      console.log("🌌 [UnifiedCSSVariableManager] Destroyed");
    }
  }

  public forceRepaint?(reason?: string): void {
    this.flushCSSVariableBatch();
    if (this.config.enableDebug && reason) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Force repaint: ${reason}`
      );
    }
  }

  // ===================================================================
  // PUBLIC API - UNIFIED CSS VARIABLE OPERATIONS
  // ===================================================================

  /**
   * Queue a CSS variable update with priority and visual-effects awareness
   */
  public queueCSSVariableUpdate(
    property: string,
    value: string,
    element: HTMLElement | null = null,
    priority: "low" | "normal" | "high" | "critical" = "normal",
    source: string = "unknown"
  ): void {
    // ---- FAST-PATH for critical variables ----
    if (CRITICAL_NOW_PLAYING_VARS.has(property)) {
      const styleDecl = (element || document.documentElement).style;
      if (UnifiedCSSVariableManager.nativeSetProperty) {
        UnifiedCSSVariableManager.nativeSetProperty.call(
          styleDecl,
          property,
          value
        );
      } else {
        styleDecl.setProperty(property, value);
      }
      return;
    }

    // ---- Normal batched path ----
    const target = element || document.documentElement;
    const elementKey = element
      ? `element_${element.id || element.className || "unnamed"}`
      : "root";
    const updateKey = `${elementKey}:${property}`;

    const update: PendingUpdate = {
      element: target,
      property,
      value,
      timestamp: performance.now(),
      priority,
      source,
    };

    // Handle conflicts with existing updates
    const existingUpdate = this.cssVariableQueue.get(updateKey);
    if (existingUpdate) {
      if (this.shouldReplaceUpdate(existingUpdate, update)) {
        this.cssVariableQueue.set(updateKey, update);
        this.performanceMetrics.conflictResolutions++;
      }
    } else {
      this.cssVariableQueue.set(updateKey, update);
    }

    this.performanceMetrics.totalUpdates++;

    // Schedule flush based on priority
    this.scheduleFlush(priority);

    // Force flush for critical updates
    if (
      priority === "critical" ||
      this.cssVariableQueue.size >= this.cssConfig.maxBatchSize
    ) {
      this.flushCSSVariableBatch();
    }
  }

  /**
   * Update multiple CSS variables in a transaction
   */
  public updateVariables(
    variables: Record<string, string>,
    priority: "low" | "normal" | "high" | "critical" = "normal",
    source: string = "unknown"
  ): void {
    const transactionId = `tx_${++this.transactionCounter}`;
    const variableMap = new Map(Object.entries(variables));

    const transaction: CSSVariableTransaction = {
      id: transactionId,
      variables: variableMap,
      timestamp: performance.now(),
      priority,
      completed: false,
    };

    this.pendingTransactions.set(transactionId, transaction);

    // Queue all variables from the transaction
    for (const [property, value] of variableMap) {
      this.queueCSSVariableUpdate(
        property,
        value,
        null,
        priority,
        `${source}:${transactionId}`
      );
    }

    this.performanceMetrics.transactionCount++;

    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Transaction ${transactionId} queued with ${variableMap.size} variables`
      );
    }
  }

  /**
   * Update visual-effects-driven CSS variables
   */
  public updateVisualEffectsVariables(
    visualEffectsState: VisualEffectsState
  ): void {
    if (!this.cssConfig.enableVisualEffectsIntegration) return;

    this.visualEffectsState = visualEffectsState;
    this.performanceMetrics.visualEffectsUpdates++;

    const variables: Record<string, string> = {};

    // Music-driven variables
    if (
      visualEffectsState.musicState &&
      this.cssConfig.enableMusicVisualEffects
    ) {
      variables["--sn.music.beat.pulse.intensity"] =
        visualEffectsState.musicState.intensity.toString();
      variables["--sn.music.tempo.bpm"] =
        visualEffectsState.musicState.bpm.toString();
      variables[
        "--sn.music.rhythm.phase"
      ] = `${visualEffectsState.musicState.rhythmPhase}deg`;
      variables["--sn.music.animation.scale"] =
        visualEffectsState.musicState.animationScale.toString();
      variables["--sn.music.energy.level"] =
        visualEffectsState.musicState.energy.toString();
      variables["--sn.music.valence"] =
        visualEffectsState.musicState.valence.toString();
    }

    // Aesthetic visual-effects variables
    if (
      visualEffectsState.aestheticState &&
      this.cssConfig.enableAestheticVisualEffects
    ) {
      variables["--sn.aesthetic.harmony.level"] =
        visualEffectsState.aestheticState.harmonyLevel.toString();
      variables["--sn.aesthetic.evolution.factor"] =
        visualEffectsState.aestheticState.evolutionFactor.toString();
      variables["--sn.color.temperature"] =
        visualEffectsState.aestheticState.colorTemperature.toString();
    }

    // Performance visual-effects variables
    if (visualEffectsState.performanceState) {
      variables["--sn.performance.mode"] =
        visualEffectsState.performanceState.mode;
      variables["--sn.device.tier"] =
        visualEffectsState.performanceState.deviceTier;
      variables["--sn.performance.optimization.level"] =
        visualEffectsState.performanceState.optimizationLevel.toString();
    }

    this.updateVariables(variables, "high", "visual-effects-system");

    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Consciousness state updated with ${
          Object.keys(variables).length
        } variables`
      );
    }
  }

  /**
   * Apply performance-based optimizations
   */
  public applyPerformanceOptimizations(performanceMode: PerformanceMode): void {
    if (!this.cssConfig.enableAdaptiveOptimization) return;

    this.currentPerformanceMode = performanceMode;

    // Update performance-related CSS variables
    const variables: Record<string, string> = {
      "--sn.performance.mode": performanceMode.name,
      "--sn.performance.quality.level": performanceMode.qualityLevel.toString(),
      "--sn.performance.fps.target": performanceMode.frameRate.toString(),
      "--sn.performance.frame.budget": (
        1000 / performanceMode.frameRate
      ).toString(),
      "--sn.performance.optimization.level":
        performanceMode.optimizationLevel.toString(),
      "--sn.performance.blur.quality": performanceMode.blurQuality.toString(),
      "--sn.performance.shadow.quality":
        performanceMode.shadowQuality.toString(),
      "--sn.performance.animation.quality":
        performanceMode.animationQuality.toString(),
      "--sn.performance.effect.quality":
        performanceMode.effectQuality.toString(),
    };

    this.updateVariables(variables, "high", "performance-coordinator");

    // Apply performance mode CSS classes
    this.applyPerformanceModeOptimizations();

    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Performance optimizations applied for mode: ${performanceMode.name}`
      );
    }
  }

  /**
   * Get a CSS variable value
   */
  public getVariable(key: string): string | null {
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(key).trim() || null;
  }

  /**
   * Force immediate flush of all pending updates
   */
  public flushUpdates(): void {
    this.flushCSSVariableBatch();
  }

  /**
   * Optimized CSS variable batch flush with efficient DOM operations
   */
  public flushCSSVariableBatch(): void {
    if (this.cssVariableQueue.size === 0) return;

    const startTime = performance.now();
    const FRAME_BUDGET = 8; // Maximum 8ms per batch to maintain 60fps
    const updates = Array.from(this.cssVariableQueue.values());

    this.cssVariableQueue.clear();
    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
    this.microtaskScheduled = false;

    try {
      // Group updates by element for efficient batching
      const updatesByElement = new Map<HTMLElement, PendingUpdate[]>();

      for (const update of updates) {
        if (!updatesByElement.has(update.element)) {
          updatesByElement.set(update.element, []);
        }
        updatesByElement.get(update.element)!.push(update);
      }

      // Process each element's updates with frame budget checking
      for (const [element, elementUpdates] of updatesByElement.entries()) {
        // Check frame budget before processing each element
        if (performance.now() - startTime > FRAME_BUDGET) {
          // Re-queue remaining updates for next frame
          for (const update of elementUpdates) {
            const updateKey = `${update.element.id || "root"}:${
              update.property
            }`;
            this.cssVariableQueue.set(updateKey, update);
          }
          this.scheduleFlush("high");
          break;
        }

        // Optimized batching: Use cssText for multiple updates, setProperty for single
        if (elementUpdates.length >= 3) {
          // Efficient cssText batching for multiple properties
          this.applyCSSTextBatch(element, elementUpdates);
        } else {
          // Fast path for single/few properties
          for (const update of elementUpdates) {
            if (UnifiedCSSVariableManager.nativeSetProperty) {
              UnifiedCSSVariableManager.nativeSetProperty.call(
                element.style,
                update.property,
                update.value
              );
            } else {
              element.style.setProperty(update.property, update.value);
            }
          }
        }
      }

      const batchTime = performance.now() - startTime;
      this.updatePerformanceMetrics(batchTime, updates.length);

      // Log performance warnings if batch exceeds budget
      if (batchTime > FRAME_BUDGET && this.config.enableDebug) {
        console.warn(
          `🌌 [UnifiedCSSVariableManager] CSS batch exceeded frame budget: ${batchTime.toFixed(
            2
          )}ms (${updates.length} updates)`
        );
      } else if (this.config.enableDebug && Math.random() < 0.05) {
        console.log(
          `🌌 [UnifiedCSSVariableManager] Efficient CSS batch: ${
            updates.length
          } updates in ${batchTime.toFixed(2)}ms`
        );
      }
    } catch (error) {
      console.error(
        "[UnifiedCSSVariableManager] Error in optimized CSS batch processing:",
        error
      );

      // Fallback: apply updates individually with error recovery
      this.applyUpdatesWithFallback(updates);
    }
  }

  /**
   * Optimized cssText batching using efficient string building
   */
  private applyCSSTextBatch(
    element: HTMLElement,
    updates: PendingUpdate[]
  ): void {
    try {
      // Build CSS property map from current cssText
      const currentStyle = element.style.cssText;
      const propertyMap = new Map<string, string>();

      // Parse existing cssText more efficiently
      if (currentStyle) {
        const declarations = currentStyle.split(";");
        for (const declaration of declarations) {
          const colonIndex = declaration.indexOf(":");
          if (colonIndex > 0) {
            const property = declaration.slice(0, colonIndex).trim();
            const value = declaration.slice(colonIndex + 1).trim();
            if (property && value) {
              propertyMap.set(property, value);
            }
          }
        }
      }

      // Apply updates to property map
      for (const update of updates) {
        propertyMap.set(update.property, update.value);
      }

      // Build new cssText efficiently
      const cssDeclarations: string[] = [];
      for (const [property, value] of propertyMap) {
        cssDeclarations.push(`${property}:${value}`);
      }

      // Single DOM write operation
      element.style.cssText = cssDeclarations.join(";");
    } catch (error) {
      // Fallback to individual setProperty calls
      for (const update of updates) {
        try {
          element.style.setProperty(update.property, update.value);
        } catch (e) {
          console.warn(`Failed to apply ${update.property}:`, e);
        }
      }
    }
  }

  /**
   * Fallback update application with error recovery
   */
  private applyUpdatesWithFallback(updates: PendingUpdate[]): void {
    for (const update of updates) {
      try {
        if (UnifiedCSSVariableManager.nativeSetProperty) {
          UnifiedCSSVariableManager.nativeSetProperty.call(
            update.element.style,
            update.property,
            update.value
          );
        } else {
          update.element.style.setProperty(update.property, update.value);
        }
      } catch (e) {
        console.warn(
          `[UnifiedCSSVariableManager] Failed to apply CSS property ${update.property}:`,
          e
        );
      }
    }
  }

  // ===================================================================
  // CONVENIENCE METHODS FOR COMMON CSS UPDATES
  // ===================================================================

  /**
   * Set music synchronization variables
   */
  public setMusicMetrics(metrics: {
    beatIntensity?: number;
    rhythmPhase?: number;
    animationScale?: number;
    spectrumPhase?: number;
    energy?: number;
    valence?: number;
    bpm?: number;
  }): void {
    const variables: Record<string, string> = {};

    if (metrics.beatIntensity !== undefined) {
      variables["--sn.music.beat.pulse.intensity"] =
        metrics.beatIntensity.toString();
    }
    if (metrics.rhythmPhase !== undefined) {
      variables["--sn.music.rhythm.phase"] = `${metrics.rhythmPhase}deg`;
    }
    if (metrics.animationScale !== undefined) {
      variables["--sn.music.animation.scale"] =
        metrics.animationScale.toString();
    }
    if (metrics.spectrumPhase !== undefined) {
      variables["--sn.music.spectrum.phase"] = `${metrics.spectrumPhase}deg`;
    }
    if (metrics.energy !== undefined) {
      variables["--sn.music.energy.level"] = metrics.energy.toString();
    }
    if (metrics.valence !== undefined) {
      variables["--sn.music.valence"] = metrics.valence.toString();
    }
    if (metrics.bpm !== undefined) {
      variables["--sn.music.tempo.bpm"] = metrics.bpm.toString();
    }

    this.updateVariables(variables, "critical", "music-system");
  }

  /**
   * Set color variables
   */
  public setColorTokens(colors: {
    accentHex?: string;
    accentRgb?: string;
    primaryRgb?: string;
    secondaryRgb?: string;
    gradientOpacity?: number;
    gradientBlur?: string;
  }): void {
    const variables: Record<string, string> = {};

    if (colors.accentHex) {
      variables["--sn.color.accent.hex"] = colors.accentHex;
    }
    if (colors.accentRgb) {
      variables["--sn.color.accent.rgb"] = colors.accentRgb;
    }
    if (colors.primaryRgb) {
      variables["--sn.bg.gradient.primary.rgb"] = colors.primaryRgb;
    }
    if (colors.secondaryRgb) {
      variables["--sn.bg.gradient.secondary.rgb"] = colors.secondaryRgb;
    }
    if (colors.gradientOpacity !== undefined) {
      variables["--sn.bg.gradient.opacity"] = colors.gradientOpacity.toString();
    }
    if (colors.gradientBlur) {
      variables["--sn.bg.gradient.blur"] = colors.gradientBlur;
    }

    this.updateVariables(variables, "high", "color-system");
  }

  /**
   * Set performance variables
   */
  public setPerformanceTokens(perf: {
    webglReady?: boolean;
    activeBackend?: string;
    qualityLevel?: string;
    reducedMotion?: boolean;
    gpuAcceleration?: boolean;
  }): void {
    const variables: Record<string, string> = {};

    if (perf.webglReady !== undefined) {
      variables["--sn.bg.webgl.ready"] = perf.webglReady ? "1" : "0";
    }
    if (perf.activeBackend) {
      variables["--sn.bg.active-backend"] = perf.activeBackend;
    }
    if (perf.qualityLevel) {
      variables["--sn.perf.quality.level"] = perf.qualityLevel;
    }
    if (perf.reducedMotion !== undefined) {
      variables["--sn.anim.motion.reduced"] = perf.reducedMotion ? "1" : "0";
    }
    if (perf.gpuAcceleration !== undefined) {
      variables["--sn.perf.gpu.acceleration.enabled"] = perf.gpuAcceleration
        ? "1"
        : "0";
    }

    this.updateVariables(variables, "high", "performance-system");
  }

  /**
   * Direct property setter (convenience API)
   */
  public setProperty(
    property: string,
    value: string,
    element: HTMLElement | null = null
  ): void {
    // 🔧 CRITICAL DEBUG: Add tracing for --spice-* variable changes
    if (
      property.startsWith("--spice-") &&
      this.config.enableSpiceVariableDebug
    ) {
      const caller =
        new Error().stack
          ?.split("\n")[2]
          ?.trim()
          .replace(/^\s*at\s+/, "") || "unknown";
      console.log(
        `🔧 [CSS Debug] Setting ${property} = ${value} (from: ${caller})`
      );
    }

    this.queueCSSVariableUpdate(property, value, element);
  }

  // ===================================================================
  // PERFORMANCE AND DEVICE OPTIMIZATION METHODS
  // ===================================================================

  /**
   * Apply device-specific CSS classes
   */
  public applyDeviceOptimizations(): void {
    if (
      !this.cssConfig.enableDeviceTierOptimization ||
      !this.currentDeviceCapabilities
    )
      return;

    // Remove existing device tier classes
    this.removeClassesByPrefix("device-tier-");
    this.removeClassesByPrefix("device-mobile-");
    this.removeClassesByPrefix("device-gpu-");

    // Apply device tier class
    const tierClass = `device-tier-${this.currentDeviceCapabilities.performanceTier}`;
    this.addCSSClass(tierClass);

    // Apply mobile optimization class
    if (this.currentDeviceCapabilities.isMobile) {
      this.addCSSClass("device-mobile-optimized");
    }

    // Apply GPU acceleration class
    if (this.currentDeviceCapabilities.gpuAcceleration) {
      this.addCSSClass("device-gpu-accelerated");
    } else {
      this.addCSSClass("device-gpu-fallback");
    }

    // Apply memory tier class
    const memoryTier = this.getMemoryTier(
      this.currentDeviceCapabilities.memoryGB
    );
    this.addCSSClass(`device-memory-${memoryTier}`);
  }

  /**
   * Apply performance mode CSS classes
   */
  public applyPerformanceModeOptimizations(): void {
    if (!this.currentPerformanceMode) return;

    // Remove existing performance mode classes
    this.removeClassesByPrefix("performance-mode-");

    // Apply current performance mode class
    const modeClass = `performance-mode-${this.currentPerformanceMode.name}`;
    this.addCSSClass(modeClass);

    // Apply optimization level class
    const optimizationClass = `optimization-level-${this.currentPerformanceMode.optimizationLevel}`;
    this.addCSSClass(optimizationClass);
  }

  /**
   * Get performance report
   */
  public getPerformanceReport() {
    const averageBatchTime =
      this.performanceMetrics.totalBatches > 0
        ? this.performanceMetrics.totalBatchTime /
          this.performanceMetrics.totalBatches
        : 0;

    return {
      enabled: true,
      pendingUpdates: this.cssVariableQueue.size + this.updateQueue.size,
      totalUpdates: this.performanceMetrics.totalUpdates,
      totalBatches: this.performanceMetrics.totalBatches,
      averageBatchSize:
        Math.round(this.performanceMetrics.averageBatchSize * 10) / 10,
      averageBatchTime: Math.round(averageBatchTime * 100) / 100,
      maxBatchTime:
        Math.round(this.performanceMetrics.maxBatchTime * 100) / 100,
      overBudgetBatches: this.performanceMetrics.overBudgetBatches,
      conflictResolutions: this.performanceMetrics.conflictResolutions,
      transactionCount: this.performanceMetrics.transactionCount,
      visualEffectsUpdates: this.performanceMetrics.visualEffectsUpdates,
      visualEffectsActive: this.visualEffectsState !== null,
      deviceTier: this.currentDeviceCapabilities?.performanceTier,
      performanceMode: this.currentPerformanceMode?.name,
    };
  }

  // ===================================================================
  // PRIVATE METHODS
  // ===================================================================

  private subscribeToEvents(): void {
    // Subscribe to performance tier changes
    this.eventBus.subscribe("performance:tier-changed", (payload: any) => {
      this.currentPerformanceMode =
        this.performanceCoordinator.getCurrentPerformanceMode();
      this.applyPerformanceModeOptimizations();
      this.updateCSSPerformanceVariables();
    }, 'UnifiedCSSVariableManager');

    // Subscribe to performance frame events for thermal monitoring
    this.eventBus.subscribe("performance:frame", (payload: any) => {
      if (payload.temperature && payload.temperature > 80) {
        this.applyThermalOptimizations(payload.temperature);
      }
    }, 'UnifiedCSSVariableManager');
  }

  private applyInitialOptimizations(): void {
    try {
      this.applyDeviceOptimizations();
      this.applyPerformanceModeOptimizations();
      this.updateCSSPerformanceVariables();

      // Apply debug classes if enabled
      if (this.cssConfig.debugPerformanceClasses) {
        this.addCSSClass("debug-performance");
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          "[UnifiedCSSVariableManager] Error applying initial optimizations:",
          error
        );
      }
      // Don't throw - allow initialization to continue
    }
  }

  private applyCurrentOptimizations(): void {
    this.applyDeviceOptimizations();
    this.applyPerformanceModeOptimizations();

    // Get current performance metrics and apply optimizations
    const batteryState = this.performanceCoordinator.getBatteryState();
    const thermalState = this.performanceCoordinator.getThermalState();

    if (batteryState) {
      this.applyBatteryOptimizations(batteryState.level, batteryState.charging);
    }

    // Apply thermal state
    const thermalTemp = thermalState.temperature || "normal";
    this.applyThermalOptimizations(thermalTemp);
  }

  private updateCSSPerformanceVariables(): void {
    const now = Date.now();
    if (now - this.lastCSSUpdate < this.cssUpdateThrottle) return;

    this.lastCSSUpdate = now;

    if (!this.currentPerformanceMode || !this.currentDeviceCapabilities) return;

    try {
      // Update performance mode variables with safe property access
      const variables: Record<string, string> = {
        "--sn.performance.mode": this.currentPerformanceMode.name || "balanced",
        "--sn.performance.quality.level":
          (this.currentPerformanceMode.qualityLevel ?? 0.8).toString(),
        "--sn.performance.fps.target":
          (this.currentPerformanceMode.frameRate ?? 60).toString(),
        "--sn.performance.frame.budget": (
          1000 / (this.currentPerformanceMode.frameRate ?? 60)
        ).toString(),
        "--sn.performance.optimization.level":
          (this.currentPerformanceMode.optimizationLevel ?? 1).toString(),
        "--sn.device.tier": this.currentDeviceCapabilities.performanceTier ?? "mid",
        "--sn.device.memory": (this.currentDeviceCapabilities.memoryGB ?? 8).toString(),
        "--sn.device.gpu": (this.currentDeviceCapabilities.gpuAcceleration ?? true)
          ? "1"
          : "0",
        "--sn.device.mobile": (this.currentDeviceCapabilities.isMobile ?? false) ? "1" : "0",
        "--sn.performance.blur.quality":
          (this.currentPerformanceMode.blurQuality ?? 0.8).toString(),
        "--sn.performance.shadow.quality":
          (this.currentPerformanceMode.shadowQuality ?? 0.8).toString(),
        "--sn.performance.animation.quality":
          (this.currentPerformanceMode.animationQuality ?? 0.8).toString(),
        "--sn.performance.effect.quality":
          (this.currentPerformanceMode.effectQuality ?? 0.8).toString(),
      };

      this.updateVariables(variables, "high", "performance-coordinator");
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          "[UnifiedCSSVariableManager] Error updating CSS performance variables:",
          error
        );
      }
    }
  }

  private startVisualEffectsIntegration(): void {
    if (this.visualEffectsUpdateTimer) return;

    const updateVisualEffects = () => {
      const now = performance.now();
      if (
        now - this.lastVisualEffectsUpdate >=
        this.cssConfig.visualEffectsUpdateInterval
      ) {
        this.lastVisualEffectsUpdate = now;

        // Update visual-effects state based on current conditions
        // This would integrate with music analysis, aesthetic calculations, etc.
        // For now, we maintain the existing visual-effects state
        if (this.visualEffectsState) {
          this.updateVisualEffectsVariables(this.visualEffectsState);
        }
      }

      // Schedule next update
      this.visualEffectsUpdateTimer = setTimeout(
        updateVisualEffects,
        this.cssConfig.visualEffectsUpdateInterval
      );
    };

    updateVisualEffects();
  }

  private shouldReplaceUpdate(
    existing: PendingUpdate,
    incoming: PendingUpdate
  ): boolean {
    // Priority-based replacement
    const existingWeight = this.PRIORITY_WEIGHTS[existing.priority];
    const incomingWeight = this.PRIORITY_WEIGHTS[incoming.priority];

    if (incomingWeight > existingWeight) {
      return true;
    }

    if (incomingWeight === existingWeight) {
      // Same priority - use timestamp (newer wins)
      return incoming.timestamp > existing.timestamp;
    }

    return false;
  }

  private scheduleFlush(
    priority: "low" | "normal" | "high" | "critical"
  ): void {
    // Avoid double-scheduling
    if (this.rafHandle !== null || this.microtaskScheduled) {
      return;
    }

    const flushCallback = () => {
      this.rafHandle = null;
      this.microtaskScheduled = false;
      this.flushCSSVariableBatch();
    };

    // Prefer micro-tasks when the page is hidden (background tab)
    if (
      typeof document !== "undefined" &&
      document.visibilityState === "hidden"
    ) {
      this.microtaskScheduled = true;
      queueMicrotask(flushCallback);
    } else if (typeof requestAnimationFrame === "function") {
      this.rafHandle = requestAnimationFrame(flushCallback);
    } else {
      // Fallback for very old browsers
      setTimeout(flushCallback, 0);
    }
  }

  private updatePerformanceMetrics(batchTime: number, batchSize: number): void {
    this.performanceMetrics.totalBatches++;
    this.performanceMetrics.totalBatchTime += batchTime;
    this.performanceMetrics.maxBatchTime = Math.max(
      this.performanceMetrics.maxBatchTime,
      batchTime
    );
    this.performanceMetrics.averageBatchSize =
      (this.performanceMetrics.averageBatchSize *
        (this.performanceMetrics.totalBatches - 1) +
        batchSize) /
      this.performanceMetrics.totalBatches;

    if (batchTime > 8) {
      this.performanceMetrics.overBudgetBatches++;
      if (this.config.enableDebug) {
        console.warn(
          `[UnifiedCSSVariableManager] CSS batch took ${batchTime.toFixed(
            2
          )}ms for ${batchSize} updates`
        );
      }
    }
  }

  private enableGlobalHijack(): void {
    if (UnifiedCSSVariableManager.hijackEnabled) return;

    const original = CSSStyleDeclaration.prototype.setProperty;
    // Retain native setter for critical fast-path writes
    UnifiedCSSVariableManager.nativeSetProperty = original;

    const controllerInstance = this;
    // @ts-ignore
    CSSStyleDeclaration.prototype.setProperty = function (
      prop: string,
      value: string | null,
      priority?: string
    ) {
      // Intercept both legacy --sn- and new --sn. namespaced variables
      if (
        prop &&
        (prop.startsWith("--sn-") || prop.startsWith("--sn.")) &&
        controllerInstance
      ) {
        controllerInstance.queueCSSVariableUpdate(prop, String(value ?? ""));
      } else {
        // @ts-ignore
        original.call(this, prop, value, priority);
      }
    } as typeof CSSStyleDeclaration.prototype.setProperty;

    UnifiedCSSVariableManager.hijackEnabled = true;

    if (this.config.enableDebug) {
      console.log(
        "🌌 [UnifiedCSSVariableManager] Global setProperty hijack enabled (--sn- and --sn. namespaces)"
      );
    }
  }

  private addCSSClass(className: string): void {
    if (!this.appliedClasses.has(className)) {
      document.body.classList.add(className);
      this.appliedClasses.add(className);
    }
  }

  private removeCSSClass(className: string): void {
    if (this.appliedClasses.has(className)) {
      document.body.classList.remove(className);
      this.appliedClasses.delete(className);
    }
  }

  private removeClassesByPrefix(prefix: string): void {
    const classesToRemove = Array.from(this.appliedClasses).filter(
      (className) => className.startsWith(prefix)
    );

    for (const className of classesToRemove) {
      this.removeCSSClass(className);
    }
  }

  private getMemoryTier(memoryGB: number): string {
    if (memoryGB >= 16) return "high";
    if (memoryGB >= 8) return "medium";
    if (memoryGB >= 4) return "low";
    return "minimal";
  }

  private applyThermalOptimizations(thermalState: string): void {
    if (!this.cssConfig.enableThermalThrottling) return;

    // Remove existing thermal classes
    this.removeClassesByPrefix("thermal-");

    // Apply current thermal state class
    const thermalClass = `thermal-${thermalState}`;
    this.addCSSClass(thermalClass);
  }

  private applyBatteryOptimizations(
    batteryLevel: number,
    charging: boolean
  ): void {
    if (!this.cssConfig.enableBatteryOptimization) return;

    // Remove existing battery classes
    this.removeClassesByPrefix("battery-");

    // Apply battery level classes
    if (batteryLevel < 0.2) {
      this.addCSSClass("battery-low");
    } else if (batteryLevel < 0.5) {
      this.addCSSClass("battery-medium");
    } else {
      this.addCSSClass("battery-high");
    }

    // Apply charging state
    if (charging) {
      this.addCSSClass("battery-charging");
    }
  }

  // ===================================================================
  // CONVENIENCE METHODS FROM UNIFIEDCSSVARIABLEMANAGER
  // ===================================================================

  /**
   * Update music system variables (from UnifiedCSSVariableManager)
   */
  public updateMusicVariables(variables: {
    "beat.pulse.intensity"?: number;
    "beat.frequency"?: number;
    "beat.phase"?: number;
    "spectrum.phase"?: number;
    "spectrum.energy"?: number;
    "animation.scale"?: number;
    "animation.sync"?: number;
    "rhythm.phase"?: number;
    "rhythm.intensity"?: number;
    "tempo.bpm"?: number;
    "energy.level"?: number;
    valence?: number;
    danceability?: number;
  }): void {
    const updates: Record<string, string> = {};

    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-music-${key.replace(/\./g, "-")}`; // Convert dots to dashes
        updates[fullKey] = String(value);
      }
    }

    this.updateVariables(updates, "critical", "music-system");
  }

  /**
   * Update color system variables (from UnifiedCSSVariableManager)
   */
  public updateColorVariables(variables: {
    "accent.hex"?: string;
    "accent.rgb"?: string;
    "extracted.primary.rgb"?: string;
    "extracted.secondary.rgb"?: string;
    "extracted.tertiary.rgb"?: string;
    "harmony.blend.intensity"?: number;
    "shift.hue"?: number;
    "shift.saturation"?: number;
    "shift.lightness"?: number;
    "shift.temperature"?: number;
  }): void {
    const updates: Record<string, string> = {};

    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-color-${key.replace(/\./g, "-")}`; // Convert dots to dashes
        updates[fullKey] = String(value);
      }
    }

    this.updateVariables(updates, "high", "color-system");
  }

  /**
   * Update animation system variables (from UnifiedCSSVariableManager)
   */
  public updateAnimationVariables(variables: {
    "duration.fast"?: string;
    "duration.normal"?: string;
    "duration.slow"?: string;
    "duration.animation"?: string;
    "motion.reduced"?: boolean;
    "motion.scale"?: number;
    "frame.budget"?: string;
    "frame.priority"?: string;
    "frame.fps"?: number;
  }): void {
    const updates: Record<string, string> = {};

    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-anim-${key.replace(/\./g, "-")}`; // Convert dots to dashes
        updates[fullKey] =
          typeof value === "boolean" ? (value ? "1" : "0") : String(value);
      }
    }

    this.updateVariables(updates, "normal", "animation-system");
  }

  /**
   * Update performance system variables (from UnifiedCSSVariableManager)
   */
  public updatePerformanceVariables(variables: {
    mode?: string;
    "quality.level"?: number;
    "fps.target"?: number;
    "frame.budget"?: number;
    "optimization.level"?: number;
    "device.tier"?: string;
    "device.memory"?: number;
    "device.gpu"?: number;
    "device.mobile"?: number;
    "thermal.temperature"?: number;
    "thermal.throttle"?: boolean;
    "battery.level"?: number;
    "battery.charging"?: boolean;
    "battery.saver"?: boolean;
    "blur.quality"?: number;
    "shadow.quality"?: number;
    "animation.quality"?: number;
    "effect.quality"?: number;
    "gpu.acceleration.enabled"?: boolean;
  }): void {
    const updates: Record<string, string> = {};

    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-performance-${key.replace(/\./g, "-")}`; // Convert dots to dashes
        updates[fullKey] =
          typeof value === "boolean" ? (value ? "1" : "0") : String(value);
      }
    }

    this.updateVariables(updates, "high", "performance-system");
  }

  /**
   * Update utility system variables (from UnifiedCSSVariableManager)
   */
  public updateUtilityVariables(variables: {
    "debug.enabled"?: boolean;
    "debug.verbose"?: boolean;
    "debug.performance"?: boolean;
    "debug.grid.visible"?: boolean;
    "a11y.contrast.enhanced"?: boolean;
    "a11y.focus.visible"?: boolean;
    "a11y.motion.reduced"?: boolean;
    "a11y.text.size.scale"?: number;
    "feature.webgl.enabled"?: boolean;
    "feature.visual-effects.enabled"?: boolean;
    "feature.music.sync.enabled"?: boolean;
    "feature.animations.enabled"?: boolean;
  }): void {
    const updates: Record<string, string> = {};

    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-${key.replace(/\./g, "-")}`; // Convert dots to dashes
        updates[fullKey] =
          typeof value === "boolean" ? (value ? "1" : "0") : String(value);
      }
    }

    this.updateVariables(updates, "low", "utility-system");
  }

  /**
   * Queue a CSS variable update (from UnifiedCSSVariableManager compatibility)
   */
  public queueUpdate(
    property: string,
    value: string,
    priority: "low" | "normal" | "high" | "critical" = "normal",
    source: string = "unknown"
  ): void {
    this.queueCSSVariableUpdate(property, value, null, priority, source);
  }

  /**
   * Queue multiple CSS variable updates in a transaction (from UnifiedCSSVariableManager)
   */
  public queueTransaction(
    variables: Record<string, string>,
    priority: "low" | "normal" | "high" | "critical" = "normal",
    source: string = "unknown"
  ): string {
    const transactionId = `tx_${++this.transactionCounter}`;
    const variableMap = new Map(Object.entries(variables));

    const transaction: CSSVariableTransaction = {
      id: transactionId,
      variables: variableMap,
      timestamp: performance.now(),
      priority,
      completed: false,
    };

    this.pendingTransactions.set(transactionId, transaction);

    // Queue all variables from the transaction
    for (const [property, value] of variableMap) {
      this.queueUpdate(property, value, priority, `${source}:${transactionId}`);
    }

    this.performanceMetrics.transactionCount++;

    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Transaction ${transactionId} queued with ${variableMap.size} variables`
      );
    }

    return transactionId;
  }

  /**
   * Force immediate flush (from UnifiedCSSVariableManager)
   */
  public forceFlush(): void {
    this.flushCSSVariableBatch();
  }

  /**
   * Register a variable group (from UnifiedCSSVariableManager compatibility)
   */
  public registerVariableGroup(
    name: string,
    priority: "low" | "normal" | "high" | "critical" = "normal",
    batchSize: number = 50,
    flushInterval: number = 16
  ): void {
    // This was part of the old UnifiedCSSVariableManager - now handled internally
    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Variable group registration: ${name} (handled internally)`
      );
    }
  }

  /**
   * Update variables in a specific group (from UnifiedCSSVariableManager compatibility)
   */
  public updateVariableGroup(
    groupName: string,
    variables: Record<string, string>,
    source: string = "unknown"
  ): void {
    // This was part of the old UnifiedCSSVariableManager - now handled via updateVariables
    this.updateVariables(variables, "normal", `group:${groupName}:${source}`);
  }

  /**
   * Update configuration (from CSSVariableBatcher compatibility)
   */
  public updateConfig(newConfig: Partial<CSSVisualEffectsConfig>): void {
    this.cssConfig = { ...this.cssConfig, ...newConfig };

    if (this.config.enableDebug) {
      console.log(
        "🌌 [UnifiedCSSVariableManager] Configuration updated:",
        newConfig
      );
    }
  }

  // ===================================================================
  // LEGACY COMPATIBILITY METHODS
  // ===================================================================

  // For backwards compatibility with UnifiedCSSVariableManager API
  public flushNow(): void {
    this.flushCSSVariableBatch();
  }

  public setBatchingEnabled(enabled: boolean): void {
    // Implementation would control batching behavior
    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Batching ${
          enabled ? "enabled" : "disabled"
        }`
      );
    }
  }

  public addCriticalVariable(variable: string): void {
    CRITICAL_NOW_PLAYING_VARS.add(variable);
    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Added critical variable: ${variable}`
      );
    }
  }

  public removeCriticalVariable(variable: string): void {
    CRITICAL_NOW_PLAYING_VARS.delete(variable);
    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Removed critical variable: ${variable}`
      );
    }
  }

  public isCriticalVariable(variable: string): boolean {
    return CRITICAL_NOW_PLAYING_VARS.has(variable);
  }

  public getCriticalVariables(): string[] {
    return Array.from(CRITICAL_NOW_PLAYING_VARS);
  }

  // ===================================================================
  // SIMPLIFIED COORDINATION PATTERNS (Extracted from SharedVariableCoordination.ts)
  // ===================================================================

  /**
   * Update visual-effects intensity with simplified coordination through UnifiedEventBus
   * Replaces the complex ConsciousnessIntensityCoordinator pattern with a simple subscription-based approach
   */
  public updateVisualEffectsIntensity(
    intensity: number,
    sourceStrategy: string,
    musicEnergy?: number
  ): void {
    // Clamp intensity to valid range
    const clampedIntensity = Math.max(0, Math.min(1, intensity));

    // Set the variable immediately
    this.queueCSSVariableUpdate(
      "--visual-effects-intensity",
      clampedIntensity.toString(),
      null,
      "high",
      `visual-effects-${sourceStrategy}`
    );

    // Emit event for other systems to coordinate
    if (this.eventBus) {
      this.eventBus.emitSync("visual-effects:intensity-changed", {
        intensity: clampedIntensity,
        userEngagement: 0.5, // Default engagement level
        timestamp: Date.now(),
        sourceStrategy,
        musicEnergy: musicEnergy ?? 0,
      });
    }

    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Consciousness intensity updated by ${sourceStrategy}: ${clampedIntensity}`
      );
    }
  }

  /**
   * Update crossfade opacity with simplified coordination through UnifiedEventBus
   * Replaces the complex CrossfadeOpacityCoordinator pattern with a simple subscription-based approach
   */
  public updateCrossfadeOpacity(
    opacity: number,
    sourceStrategy: string,
    webglEnabled: boolean
  ): void {
    // WebGL-aware coordination logic
    let finalOpacity = Math.max(0, Math.min(1, opacity));
    if (!webglEnabled) {
      finalOpacity = 0; // No crossfade needed when WebGL is disabled
    }

    // Set the variable immediately
    this.queueCSSVariableUpdate(
      "--sn-gradient-crossfade-opacity",
      finalOpacity.toString(),
      null,
      "high",
      `crossfade-${sourceStrategy}`
    );

    // Emit event for other systems to coordinate
    if (this.eventBus) {
      this.eventBus.emitSync("gradient:crossfade-changed", {
        opacity: finalOpacity,
        sourceStrategy,
        webglEnabled,
        timestamp: Date.now(),
      });
    }

    if (this.config.enableDebug) {
      console.log(
        `🌌 [UnifiedCSSVariableManager] Crossfade opacity updated by ${sourceStrategy}: ${finalOpacity} (WebGL: ${webglEnabled})`
      );
    }
  }

  /**
   * Subscribe to visual-effects intensity changes from other strategies
   */
  public subscribeToVisualEffectsChanges(
    callback: (data: {
      intensity: number;
      userEngagement: number;
      timestamp: number;
      sourceStrategy?: string;
      musicEnergy?: number;
    }) => void
  ): () => void {
    if (!this.eventBus) {
      console.warn(
        "[UnifiedCSSVariableManager] No UnifiedEventBus available for visual-effects subscriptions"
      );
      return () => {};
    }

    const subscriptionId = this.eventBus.subscribe(
      "visual-effects:intensity-changed",
      callback,
      "UnifiedCSSVariableManager"
    );
    return () => this.eventBus?.unsubscribe(subscriptionId);
  }

  /**
   * Subscribe to crossfade opacity changes from other strategies
   */
  public subscribeToCrossfadeChanges(
    callback: (data: {
      opacity: number;
      sourceStrategy: string;
      webglEnabled: boolean;
      timestamp: number;
    }) => void
  ): () => void {
    if (!this.eventBus) {
      console.warn(
        "[UnifiedCSSVariableManager] No UnifiedEventBus available for crossfade subscriptions"
      );
      return () => {};
    }

    const subscriptionId = this.eventBus.subscribe(
      "gradient:crossfade-changed",
      callback,
      "UnifiedCSSVariableManager"
    );
    return () => this.eventBus?.unsubscribe(subscriptionId);
  }
}
