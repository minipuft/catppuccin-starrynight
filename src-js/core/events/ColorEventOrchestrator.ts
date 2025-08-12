/**
 * ColorEventOrchestrator - Unified Color Processing Event Pipeline
 *
 * Orchestrates the complete color processing flow using the unified event system,
 * eliminating duplication and providing a single, efficient pipeline for all
 * color-related events throughout the theme.
 *
 * Philosophy: "One river of color consciousness flowing through all systems -
 * from extraction to harmony to application, a seamless stream of chromatic awareness."
 */

import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { ColorContext, ColorResult } from "@/types/colorStrategy";
import { settings } from "@/config";
import {
  MusicalOKLABCoordinator,
  type CoordinationOptions,
  type MusicalColorContext,
} from "@/utils/color/MusicalOKLABCoordinator";
import { BackgroundStrategyRegistry } from "@/visual/strategies/BackgroundStrategyRegistry";
import { BackgroundStrategySelector } from "@/visual/strategies/BackgroundStrategySelector";
import { EnhancedColorOrchestrator } from "@/visual/strategies/EnhancedColorOrchestrator";
import { EventData, unifiedEventBus } from "./UnifiedEventBus";

interface ColorProcessingMetrics {
  totalExtractions: number;
  totalHarmonizations: number;
  totalApplications: number;
  averageProcessingTime: number;
  successRate: number;
  errorCount: number;
  lastProcessingTime: number;
}

interface ColorProcessingState {
  isProcessing: boolean;
  currentTrackUri: string | null;
  lastExtractedColors: Record<string, string> | null;
  lastHarmonizedResult: ColorResult | null;
  lastApplicationTime: number;
  processingQueue: ColorContext[];
}

export class ColorEventOrchestrator {
  private static instance: ColorEventOrchestrator | null = null;

  // Core processing components
  private colorOrchestrator: EnhancedColorOrchestrator;
  private strategySelector: BackgroundStrategySelector;
  private strategyRegistry: BackgroundStrategyRegistry;
  private performanceAnalyzer: SimplePerformanceCoordinator;

  // Unified OKLAB coordination
  private musicalOKLABCoordinator: MusicalOKLABCoordinator;

  // Processing state and metrics
  private processingState: ColorProcessingState = {
    isProcessing: false,
    currentTrackUri: null,
    lastExtractedColors: null,
    lastHarmonizedResult: null,
    lastApplicationTime: 0,
    processingQueue: [],
  };

  private metrics: ColorProcessingMetrics = {
    totalExtractions: 0,
    totalHarmonizations: 0,
    totalApplications: 0,
    averageProcessingTime: 0,
    successRate: 0,
    errorCount: 0,
    lastProcessingTime: 0,
  };

  // Event subscription IDs for cleanup
  private subscriptionIds: string[] = [];

  // Processing timeout to prevent stuck states
  private processingTimeout: number | null = null;
  private readonly PROCESSING_TIMEOUT_MS = 10000; // 10 seconds

  private constructor() {
    // Initialize processing components
    
    // Try to get shared performance coordinator from global system first
    const globalSystem = (globalThis as any).year3000System;
    this.performanceAnalyzer = globalSystem?.performanceAnalyzer || 
                               globalSystem?.facadeCoordinator?.getCachedNonVisualSystem?.('SimplePerformanceCoordinator') ||
                               globalSystem?.facadeCoordinator?.getCachedNonVisualSystem?.('PerformanceAnalyzer');
    
    this.strategyRegistry = new BackgroundStrategyRegistry();
    this.strategySelector = new BackgroundStrategySelector();
    this.colorOrchestrator = new EnhancedColorOrchestrator(
      this.performanceAnalyzer
    );

    // Initialize unified OKLAB coordination
    this.musicalOKLABCoordinator = new MusicalOKLABCoordinator(true);

    // Initialize color orchestrator
    this.initializeColorOrchestrator();

    // Register strategies
    this.registerDefaultStrategies();

    // Setup event subscriptions
    this.setupEventSubscriptions();

    Y3KDebug?.debug?.log(
      "ColorEventOrchestrator",
      "Color event orchestrator initialized"
    );
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ColorEventOrchestrator {
    if (!ColorEventOrchestrator.instance) {
      ColorEventOrchestrator.instance = new ColorEventOrchestrator();
    }
    return ColorEventOrchestrator.instance;
  }

  /**
   * Initialize the color orchestrator
   */
  private async initializeColorOrchestrator(): Promise<void> {
    try {
      await this.colorOrchestrator.initialize();
      Y3KDebug?.debug?.log(
        "ColorEventOrchestrator",
        "Color orchestrator initialized successfully"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Failed to initialize color orchestrator:",
        error
      );
    }
  }

  /**
   * Register default color processing strategies
   */
  private registerDefaultStrategies(): void {
    try {
      // Import and register strategies dynamically to avoid circular dependencies
      import("@/visual/color/ThemeColorController").then(
        ({ DynamicCatppuccinStrategy }) => {
          this.strategyRegistry.register(
            new DynamicCatppuccinStrategy()
          );
        }
      );

      import("@/visual/strategies/LivingGradientStrategy").then(
        ({ LivingGradientStrategy }) => {
          this.strategyRegistry.register(
            new LivingGradientStrategy()
          );
        }
      );

      import("@/visual/strategies/WebGLGradientStrategy").then(
        ({ WebGLGradientStrategy }) => {
          this.strategyRegistry.register(
            new WebGLGradientStrategy()
          );
        }
      );

      import("@/visual/strategies/DepthLayeredStrategy").then(
        ({ DepthLayeredStrategy }) => {
          this.strategyRegistry.register(
            new DepthLayeredStrategy()
          );
        }
      );

      Y3KDebug?.debug?.log(
        "ColorEventOrchestrator",
        "Default strategies registered"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Failed to register default strategies:",
        error
      );
    }
  }

  /**
   * Setup unified event subscriptions
   */
  private setupEventSubscriptions(): void {
    // Color extraction events
    const extractedSub = unifiedEventBus.subscribe(
      "colors:extracted",
      this.handleColorExtraction.bind(this),
      "ColorEventOrchestrator"
    );
    this.subscriptionIds.push(extractedSub);

    // Music events that trigger color processing
    const trackChangedSub = unifiedEventBus.subscribe(
      "music:track-changed",
      this.handleTrackChanged.bind(this),
      "ColorEventOrchestrator"
    );
    this.subscriptionIds.push(trackChangedSub);

    // Settings changes that affect color processing
    const settingsChangedSub = unifiedEventBus.subscribe(
      "settings:changed",
      this.handleSettingsChanged.bind(this),
      "ColorEventOrchestrator"
    );
    this.subscriptionIds.push(settingsChangedSub);

    const visualGuideChangedSub = unifiedEventBus.subscribe(
      "settings:visual-guide-changed",
      this.handleVisualGuideChanged.bind(this),
      "ColorEventOrchestrator"
    );
    this.subscriptionIds.push(visualGuideChangedSub);

    // System error handling
    const systemErrorSub = unifiedEventBus.subscribe(
      "system:error",
      this.handleSystemError.bind(this),
      "ColorEventOrchestrator"
    );
    this.subscriptionIds.push(systemErrorSub);

    Y3KDebug?.debug?.log(
      "ColorEventOrchestrator",
      "Event subscriptions established",
      {
        subscriptionCount: this.subscriptionIds.length,
      }
    );
  }

  /**
   * Handle color extraction events with unified OKLAB coordination
   */
  private async handleColorExtraction(
    data: EventData<"colors:extracted">
  ): Promise<void> {
    const startTime = performance.now();

    try {
      // Prevent duplicate processing
      if (this.processingState.isProcessing) {
        this.processingState.processingQueue.push(
          this.createColorContext(data)
        );
        Y3KDebug?.debug?.log(
          "ColorEventOrchestrator",
          "Color extraction queued - processing in progress"
        );
        return;
      }

      this.processingState.isProcessing = true;
      this.processingState.currentTrackUri = data.trackUri;
      this.processingState.lastExtractedColors = data.rawColors;

      // Set processing timeout
      this.setProcessingTimeout();

      // Create color context
      const colorContext = this.createColorContext(data);

      // Determine processing strategy based on available musical data
      if (this.shouldUseMusicalOKLABCoordination(colorContext)) {
        await this.processWithMusicalOKLABCoordination(colorContext, data);
      } else {
        // Fallback to standard orchestrator
        await this.colorOrchestrator.handleColorExtraction(colorContext);
      }

      // Update metrics
      this.metrics.totalExtractions++;
      this.metrics.lastProcessingTime = performance.now() - startTime;
      this.updateAverageProcessingTime(this.metrics.lastProcessingTime);

      Y3KDebug?.debug?.log(
        "ColorEventOrchestrator",
        "Color extraction processed",
        {
          trackUri: data.trackUri,
          processingTime: this.metrics.lastProcessingTime,
          processingMode: this.shouldUseMusicalOKLABCoordination(colorContext)
            ? "musical-oklab"
            : "standard",
          strategiesUsed: this.colorOrchestrator.getStatus().queueSize,
        }
      );

      // Emit harmonized event (this will be handled by the orchestrator or our unified processor)
      // The orchestrator will emit 'colors:harmonized' when processing is complete
    } catch (error) {
      this.metrics.errorCount++;
      this.calculateSuccessRate();

      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Color extraction processing failed:",
        error
      );

      // Emit system error
      unifiedEventBus.emitSync("system:error", {
        systemName: "ColorEventOrchestrator",
        error:
          error instanceof Error ? error.message : "Color extraction failed",
        severity: "error",
        timestamp: Date.now(),
      });

      // Apply fallback colors
      await this.applyFallbackColors(data);
    } finally {
      this.processingState.isProcessing = false;
      this.clearProcessingTimeout();

      // Process queued items
      if (this.processingState.processingQueue.length > 0) {
        const nextContext = this.processingState.processingQueue.shift()!;
        // Process next item asynchronously
        setTimeout(() => {
          unifiedEventBus.emit("colors:extracted", {
            rawColors: nextContext.rawColors,
            trackUri: nextContext.trackUri,
            timestamp: nextContext.timestamp,
            ...(nextContext.musicData && { musicData: nextContext.musicData }),
          });
        }, 10);
      }
    }
  }

  /**
   * Handle track changed events
   */
  private async handleTrackChanged(
    data: EventData<"music:track-changed">
  ): Promise<void> {
    try {
      // Reset processing state for new track
      this.processingState.currentTrackUri = data.trackUri;
      this.processingState.lastExtractedColors = null;
      this.processingState.lastHarmonizedResult = null;

      Y3KDebug?.debug?.log(
        "ColorEventOrchestrator",
        "Track changed - resetting color processing state",
        {
          newTrackUri: data.trackUri,
          artist: data.artist,
          title: data.title,
        }
      );

      // Clear any queued processing for previous track
      this.processingState.processingQueue =
        this.processingState.processingQueue.filter(
          (context) => context.trackUri === data.trackUri
        );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Error handling track change:",
        error
      );
    }
  }

  /**
   * Handle settings changed events
   */
  private async handleSettingsChanged(
    data: EventData<"settings:changed">
  ): Promise<void> {
    try {
      // Check if setting affects color processing
      const colorAffectingSettings = [
        "sn-dynamic-accent-enabled",
        "sn-gradient-intensity",
        "sn-webgl-enabled",
        "sn-depth-enabled",
        "sn-consciousness-level",
        "sn-breathing-enabled",
      ];

      if (colorAffectingSettings.includes(data.settingKey)) {
        Y3KDebug?.debug?.log(
          "ColorEventOrchestrator",
          "Color-affecting setting changed",
          {
            setting: data.settingKey,
            oldValue: data.oldValue,
            newValue: data.newValue,
          }
        );

        // Update color orchestrator selection criteria
        this.colorOrchestrator.setSelectionCriteria({
          performance: this.getPerformanceLevel(),
          quality: this.getQualityLevel(),
          deviceCapabilities: this.getDeviceCapabilities(),
          userPreferences: this.getUserPreferences(),
        });

        // Reprocess current colors if available
        if (this.processingState.lastExtractedColors) {
          await this.reprocessCurrentColors();
        }
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Error handling settings change:",
        error
      );
    }
  }

  /**
   * Handle visual guide mode changes
   */
  private async handleVisualGuideChanged(
    data: EventData<"settings:visual-guide-changed">
  ): Promise<void> {
    try {
      Y3KDebug?.debug?.log(
        "ColorEventOrchestrator",
        "Visual guide mode changed",
        {
          oldMode: data.oldMode,
          newMode: data.newMode,
        }
      );

      // Update strategy selection based on new visual guide mode
      this.colorOrchestrator.setSelectionCriteria({
        performance: this.getPerformanceLevel(),
        quality: this.getQualityLevel(),
        deviceCapabilities: this.getDeviceCapabilities(),
        userPreferences: {
          ...this.getUserPreferences(),
          harmonicMode: data.newMode,
        },
      });

      // Reprocess current colors with new visual guide
      if (this.processingState.lastExtractedColors) {
        await this.reprocessCurrentColors();
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Error handling visual guide change:",
        error
      );
    }
  }

  /**
   * Handle system errors
   */
  private handleSystemError(data: EventData<"system:error">): void {
    Y3KDebug?.debug?.warn(
      "ColorEventOrchestrator",
      `System error reported by ${data.systemName}:`,
      {
        error: data.error,
        severity: data.severity,
      }
    );

    // If it's a critical error from a color processing system, reset processing state
    if (data.severity === "critical" && data.systemName.includes("Color")) {
      this.processingState.isProcessing = false;
      this.clearProcessingTimeout();

      Y3KDebug?.debug?.log(
        "ColorEventOrchestrator",
        "Reset processing state due to critical error"
      );
    }
  }

  /**
   * Create color context from extraction data
   */
  private createColorContext(
    data: EventData<"colors:extracted">
  ): ColorContext {
    return {
      rawColors: data.rawColors,
      trackUri: data.trackUri,
      timestamp: data.timestamp,
      musicData: data.musicData,
      performanceHints: {
        preferLightweight: this.getPerformanceLevel() === "low",
        enableAdvancedBlending: this.getQualityLevel() === "premium",
        maxProcessingTime: this.getMaxProcessingTime(),
      },
    };
  }

  /**
   * Apply fallback colors when processing fails
   */
  private async applyFallbackColors(
    data: EventData<"colors:extracted">
  ): Promise<void> {
    try {
      const fallbackColors = {
        primary: "#cba6f7", // Catppuccin mauve
        secondary: "#f5c2e7", // Catppuccin pink
        accent: "#cba6f7",
        base: "#1e1e2e",
      };

      // Emit colors applied event
      unifiedEventBus.emitSync("colors:applied", {
        cssVariables: fallbackColors,
        accentHex: fallbackColors.accent,
        accentRgb: "203,166,247",
        appliedAt: Date.now(),
      });

      Y3KDebug?.debug?.log("ColorEventOrchestrator", "Applied fallback colors");
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Failed to apply fallback colors:",
        error
      );
    }
  }

  /**
   * Reprocess current colors with updated settings
   */
  private async reprocessCurrentColors(): Promise<void> {
    if (
      !this.processingState.lastExtractedColors ||
      !this.processingState.currentTrackUri
    ) {
      return;
    }

    try {
      const colorContext = this.createColorContext({
        rawColors: this.processingState.lastExtractedColors,
        trackUri: this.processingState.currentTrackUri,
        timestamp: Date.now(),
      });

      await this.colorOrchestrator.handleColorExtraction(colorContext);

      Y3KDebug?.debug?.log(
        "ColorEventOrchestrator",
        "Reprocessed current colors with updated settings"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Failed to reprocess current colors:",
        error
      );
    }
  }

  /**
   * Set processing timeout to prevent stuck states
   */
  private setProcessingTimeout(): void {
    this.processingTimeout = window.setTimeout(() => {
      Y3KDebug?.debug?.warn(
        "ColorEventOrchestrator",
        "Processing timeout - resetting state"
      );
      this.processingState.isProcessing = false;
      this.metrics.errorCount++;
      this.calculateSuccessRate();
    }, this.PROCESSING_TIMEOUT_MS);
  }

  /**
   * Clear processing timeout
   */
  private clearProcessingTimeout(): void {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
      this.processingTimeout = null;
    }
  }

  /**
   * Update average processing time
   */
  private updateAverageProcessingTime(newTime: number): void {
    const totalProcessed =
      this.metrics.totalExtractions + this.metrics.totalHarmonizations;
    if (totalProcessed === 0) {
      this.metrics.averageProcessingTime = newTime;
    } else {
      this.metrics.averageProcessingTime =
        (this.metrics.averageProcessingTime * (totalProcessed - 1) + newTime) /
        totalProcessed;
    }
  }

  /**
   * Calculate success rate
   */
  private calculateSuccessRate(): void {
    const totalAttempts =
      this.metrics.totalExtractions + this.metrics.errorCount;
    this.metrics.successRate =
      totalAttempts > 0
        ? (this.metrics.totalExtractions / totalAttempts) * 100
        : 0;
  }

  // Helper methods for getting current settings
  private getPerformanceLevel(): "low" | "medium" | "high" {
    try {
      // Map WebGL quality to performance level
      const webglQuality = settings.get("sn-webgl-quality");
      if (webglQuality === "low") return "low";
      if (webglQuality === "high") return "high";
      return "medium";
    } catch {
      return "medium";
    }
  }

  private getQualityLevel(): "basic" | "enhanced" | "premium" {
    try {
      const animationQuality = settings.get("sn-animation-quality");
      if (animationQuality === "low") return "basic";
      if (animationQuality === "high") return "premium";
      return "enhanced";
    } catch {
      return "enhanced";
    }
  }

  private getDeviceCapabilities() {
    return {
      hasWebGL: true, // Simplified
      memoryMB: 4096,
      isMobile: false,
    };
  }

  private getUserPreferences() {
    try {
      const artisticMode = settings.get("sn-artistic-mode");
      return {
        harmonicMode: typeof artisticMode === "string" ? artisticMode : "cosmic",
        intensity: settings.get("sn-gradient-intensity") === "intense" ? 1.0 : 
                  settings.get("sn-gradient-intensity") === "balanced" ? 0.8 : 0.5,
        enableAdvancedBlending: settings.get("sn-webgl-enabled") || true,
      };
    } catch {
      return {
        harmonicMode: "cosmic",
        intensity: 0.8,
        enableAdvancedBlending: true,
      };
    }
  }

  private getMaxProcessingTime(): number {
    const performanceLevel = this.getPerformanceLevel();
    switch (performanceLevel) {
      case "low":
        return 50;
      case "medium":
        return 100;
      case "high":
        return 200;
      default:
        return 100;
    }
  }

  /**
   * Get current processing metrics
   */
  public getMetrics(): ColorProcessingMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current processing state
   */
  public getProcessingState(): ColorProcessingState {
    return { ...this.processingState };
  }

  /**
   * Get strategy registry for external access
   */
  public getStrategyRegistry(): BackgroundStrategyRegistry {
    return this.strategyRegistry;
  }

  /**
   * Force reprocessing of current colors
   */
  public async forceReprocessColors(): Promise<void> {
    await this.reprocessCurrentColors();
  }

  // === MUSICAL OKLAB COORDINATION METHODS ===

  /**
   * Determine if musical OKLAB coordination should be used
   */
  private shouldUseMusicalOKLABCoordination(
    colorContext: ColorContext
  ): boolean {
    // Check if we have musical data available
    if (!colorContext.musicData) {
      return false;
    }

    // Check if we have essential musical properties
    const { energy, valence } = colorContext.musicData;
    if (typeof energy !== "number" || typeof valence !== "number") {
      return false;
    }

    // Check if OKLAB coordination is enabled (assume enabled if using advanced processing)
    const webglEnabled = settings.get("sn-webgl-enabled") ?? true;
    if (!webglEnabled) {
      return false; // Use OKLAB when WebGL/advanced processing is enabled
    }

    return true;
  }

  /**
   * Process colors using musical OKLAB coordination
   */
  private async processWithMusicalOKLABCoordination(
    colorContext: ColorContext,
    extractionData: EventData<"colors:extracted">
  ): Promise<void> {
    try {
      // Create musical color context
      const musicalContext: MusicalColorContext = {
        musicData: colorContext.musicData!,
        rawColors: colorContext.rawColors,
        trackUri: colorContext.trackUri,
        timestamp: colorContext.timestamp,
        harmonicMode: colorContext.harmonicMode || "cosmic",
      };

      // Get coordination options from settings
      const coordinationOptions: CoordinationOptions = {
        // preferGenreOverEmotion is omitted (not available in current settings schema)
        intensityMultiplier: settings.get("sn-gradient-intensity") === "intense" ? 1.5 : 
                           settings.get("sn-gradient-intensity") === "balanced" ? 1.0 : 0.5,
        enableAdvancedBlending: settings.get("sn-webgl-enabled") ?? true,
        enableDebugLogging: false, // Debug logging handled by global debug manager
      };

      // Process through musical OKLAB coordinator
      const musicalResult =
        await this.musicalOKLABCoordinator.coordinateMusicalColors(
          musicalContext,
          coordinationOptions
        );

      // Convert to standard ColorResult for existing systems
      const colorResult = this.musicalOKLABCoordinator.convertToColorResult(
        musicalResult,
        musicalContext
      );

      // Store the result
      this.processingState.lastHarmonizedResult = colorResult;

      // Apply colors to interface
      await this.applyColorResult(colorResult);

      // Emit harmonized event for other systems
      unifiedEventBus.emitSync("colors:harmonized", {
        processedColors: colorResult.processedColors,
        accentHex: colorResult.accentHex,
        accentRgb: colorResult.accentRgb,
        strategies: ["musical-oklab-coordinator"],
        processingTime: colorResult.metadata.processingTime,
        trackUri: colorContext.trackUri,
        processingMode: "musical-oklab-coordination",
        coordinationMetrics: {
          detectedGenre: musicalResult.detectedGenre,
          emotionalState: musicalResult.emotionalResult.primaryEmotion,
          oklabPreset: musicalResult.oklabPreset.name,
          coordinationStrategy: musicalResult.coordinationStrategy,
          musicInfluenceStrength: musicalResult.musicInfluenceStrength,
        },
      });

      // Update metrics
      this.metrics.totalHarmonizations++;

      Y3KDebug?.debug?.log(
        "ColorEventOrchestrator",
        "Musical OKLAB coordination completed",
        {
          genre: musicalResult.detectedGenre,
          emotion: musicalResult.emotionalResult.primaryEmotion,
          strategy: musicalResult.coordinationStrategy,
          preset: musicalResult.oklabPreset.name,
          processingTime: musicalResult.processingTime,
          musicInfluence: musicalResult.musicInfluenceStrength,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Musical OKLAB coordination failed, falling back to standard processing:",
        error
      );

      // Fallback to standard processing
      await this.colorOrchestrator.handleColorExtraction(colorContext);
    }
  }

  /**
   * Apply color result to the interface with enhanced CSS variables
   */
  private async applyColorResult(result: ColorResult): Promise<void> {
    try {
      const root = document.documentElement;

      // Apply all processed colors as CSS variables
      Object.entries(result.processedColors).forEach(([key, value]) => {
        // Convert key to CSS variable format if needed
        const cssVar = key.startsWith("--")
          ? key
          : `--sn-${key.toLowerCase().replace(/_/g, "-")}`;
        root.style.setProperty(cssVar, value || "");
      });

      // Apply accent colors
      root.style.setProperty("--sn-accent-hex", result.accentHex || "#cba6f7");
      root.style.setProperty(
        "--sn-accent-rgb",
        result.accentRgb || "203,166,247"
      );

      // Apply enhanced metadata
      if (result.metadata) {
        root.style.setProperty(
          "--sn-color-processing-strategy",
          result.metadata.strategy || "unknown"
        );
        if (result.metadata.detectedGenre) {
          root.style.setProperty(
            "--sn-detected-genre",
            result.metadata.detectedGenre
          );
        }
        if (result.metadata.emotionalState) {
          root.style.setProperty(
            "--sn-emotional-state",
            result.metadata.emotionalState
          );
        }
        if (result.metadata.oklabPreset) {
          root.style.setProperty(
            "--sn-active-oklab-preset",
            result.metadata.oklabPreset
          );
        }
      }

      this.metrics.totalApplications++;
      this.processingState.lastApplicationTime = Date.now();
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorEventOrchestrator",
        "Failed to apply color result:",
        error
      );
    }
  }

  /**
   * Get musical OKLAB coordinator for external access
   */
  public getMusicalOKLABCoordinator(): MusicalOKLABCoordinator {
    return this.musicalOKLABCoordinator;
  }

  /**
   * Clear musical OKLAB coordination cache
   */
  public clearMusicalOKLABCache(): void {
    this.musicalOKLABCoordinator.clearCache();
    Y3KDebug?.debug?.log(
      "ColorEventOrchestrator",
      "Musical OKLAB coordination cache cleared"
    );
  }

  /**
   * Destroy the orchestrator and clean up resources
   */
  public destroy(): void {
    // Clear processing timeout
    this.clearProcessingTimeout();

    // Unsubscribe from all events
    this.subscriptionIds.forEach((id) => {
      unifiedEventBus.unsubscribe(id);
    });
    this.subscriptionIds = [];

    // Destroy components
    this.colorOrchestrator.destroy();
    this.strategyRegistry.destroy();
    this.strategySelector.destroy();
    this.musicalOKLABCoordinator.clearCache();

    // Clear state
    this.processingState.processingQueue = [];

    Y3KDebug?.debug?.log(
      "ColorEventOrchestrator",
      "Color event orchestrator destroyed"
    );

    ColorEventOrchestrator.instance = null;
  }
}

// Export singleton instance
export const colorEventOrchestrator = ColorEventOrchestrator.getInstance();
