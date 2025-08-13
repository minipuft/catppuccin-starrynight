/**
 * Color Coordinator - Strategy Pattern Invoker Implementation
 *
 * Coordinates event-driven color processing using Strategy pattern.
 * Eliminates circular dependencies by acting as mediator between
 * color extraction and color processing systems.
 *
 * Architecture:
 * - Strategy Pattern: Multiple color processing algorithms
 * - Observer Pattern: Event-driven coordination via UnifiedEventBus
 * - Adapter Pattern: Clean interface between systems
 * - Mediator Pattern: Coordinates strategy selection and execution
 */

import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type {
  ColorContext,
  ColorResult,
  IColorOrchestrator,
  IColorProcessor,
  IColorStrategyRegistry,
  StrategySelectionCriteria,
} from "@/types/colorStrategy";
import type { IManagedSystem, HealthCheckResult } from "@/types/systems";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import {
  OKLABColorProcessor,
  type EnhancementPreset,
  type OKLABProcessingResult,
} from "@/utils/color/OKLABColorProcessor";
import * as Utils from "@/utils/core/Year3000Utilities";
import { BackgroundStrategySelector } from "@/visual/strategies/BackgroundStrategySelector";

// ============================================================================
// Enhanced Strategy Processing Interfaces
// ============================================================================

interface StrategyProcessingResult {
  strategy: IColorProcessor;
  result: ColorResult;
  processingTime: number;
  success: boolean;
  error?: string;
  oklabData?: OKLABProcessingResult[];
}

interface OrchestrationMetrics {
  totalProcessingTime: number;
  strategiesProcessed: number;
  strategiesSucceeded: number;
  strategiesFailed: number;
  cacheHits: number;
  averageStrategyTime: number;
  memoryUsage: number;
  oklabCoordinations: number;
  oklabProcessingTime: number;
}

interface ColorResultMergeOptions {
  priorityWeighting: boolean;
  conflictResolution: "override" | "merge" | "average";
  preserveMetadata: boolean;
  consciousnessBlending: boolean;
  oklabCoordination: boolean;
}

// ============================================================================
// Strategy Registry Implementation
// ============================================================================

/**
 * Registry for managing color processing strategies
 */
export class ColorStrategyRegistry implements IColorStrategyRegistry {
  private strategies: Map<string, IColorProcessor> = new Map();
  private defaultStrategy: IColorProcessor | null = null;

  /**
   * Register a color processing strategy
   */
  register(strategy: IColorProcessor): void {
    const name = strategy.getStrategyName();
    this.strategies.set(name, strategy);

    // Set first registered strategy as default
    if (!this.defaultStrategy) {
      this.defaultStrategy = strategy;
    }

    Y3KDebug?.debug?.log(
      "ColorStrategyRegistry",
      `Registered strategy: ${name}`
    );
  }

  /**
   * Select best strategy for given criteria
   */
  selectStrategy(criteria: StrategySelectionCriteria): IColorProcessor | null {
    // Strategy selection algorithm based on performance and quality requirements

    // High performance, low quality -> prefer lightweight strategies
    if (criteria.performance === "high" && criteria.quality === "basic") {
      for (const strategy of this.strategies.values()) {
        const strategyName = strategy.getStrategyName().toLowerCase();
        if (
          strategyName.includes("lightweight") ||
          strategyName.includes("fast")
        ) {
          return strategy;
        }
      }
    }

    // High quality, low performance constraints -> prefer advanced strategies
    if (criteria.quality === "premium" && criteria.performance === "low") {
      for (const strategy of this.strategies.values()) {
        const strategyName = strategy.getStrategyName().toLowerCase();
        if (
          strategyName.includes("harmony") ||
          strategyName.includes("advanced")
        ) {
          return strategy;
        }
      }
    }

    // Mobile device optimization
    if (criteria.deviceCapabilities?.isMobile) {
      for (const strategy of this.strategies.values()) {
        const strategyName = strategy.getStrategyName().toLowerCase();
        if (
          strategyName.includes("mobile") ||
          strategyName.includes("optimized")
        ) {
          return strategy;
        }
      }
    }

    // Default strategy selection
    return this.defaultStrategy;
  }

  /**
   * Get all registered strategies
   */
  getStrategies(): IColorProcessor[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Get strategy by name
   */
  getStrategy(name: string): IColorProcessor | null {
    return this.strategies.get(name) || null;
  }

  /**
   * Set default strategy
   */
  setDefaultStrategy(strategy: IColorProcessor): void {
    this.defaultStrategy = strategy;
  }

  /**
   * Get registry status
   */
  getStatus(): {
    strategyCount: number;
    strategies: string[];
    defaultStrategy: string | null;
  } {
    return {
      strategyCount: this.strategies.size,
      strategies: Array.from(this.strategies.keys()),
      defaultStrategy: this.defaultStrategy?.getStrategyName() || null,
    };
  }
}

// ============================================================================
// Color Orchestrator Implementation
// ============================================================================

/**
 * Enhanced Color Orchestrator with Multi-Strategy Coordination
 *
 * Orchestrates multiple background color processing strategies with intelligent
 * selection logic, OKLAB coordination, and performance optimization.
 */
export class ColorCoordinator implements IColorOrchestrator, IManagedSystem {
  public readonly systemName = "ColorCoordinator";
  public initialized = false;
  private registry: ColorStrategyRegistry;
  private selectionCriteria: StrategySelectionCriteria;
  private isInitialized = false;
  private processingQueue: ColorContext[] = [];
  private isProcessing = false;
  private currentStrategy: string | null = null;

  // Enhanced multi-strategy coordination
  private strategySelector: BackgroundStrategySelector;
  private performanceAnalyzer: SimplePerformanceCoordinator | null;
  private deviceDetector: DeviceCapabilityDetector;
  private settingsManager: SettingsManager;

  // OKLAB coordination system
  private oklabProcessor: OKLABColorProcessor;
  private oklabCoordinationEnabled: boolean = true;

  // Phase 4: Recursion prevention
  private processedContexts: Map<string, number> = new Map(); // trackUri -> timestamp
  private readonly CONTEXT_CACHE_TTL = 2000; // 2 seconds to prevent rapid reprocessing
  private readonly MAX_QUEUE_SIZE = 10; // Prevent queue overflow

  // Enhanced result caching for performance
  private resultCache = new Map<string, ColorResult>();
  private cacheMaxSize = 50;
  private cacheTimeoutMs = 300000; // 5 minutes

  // Enhanced performance metrics
  private orchestrationMetrics: OrchestrationMetrics = {
    totalProcessingTime: 0,
    strategiesProcessed: 0,
    strategiesSucceeded: 0,
    strategiesFailed: 0,
    cacheHits: 0,
    averageStrategyTime: 0,
    memoryUsage: 0,
    oklabCoordinations: 0,
    oklabProcessingTime: 0,
  };

  // Legacy performance tracking (maintained for compatibility)
  private processedCount = 0;
  private totalProcessingTime = 0;
  private lastProcessingTime = 0;

  constructor() {
    this.registry = new ColorStrategyRegistry();

    // Initialize enhanced components
    this.settingsManager = new SettingsManager();
    
    // Try to get shared PerformanceAnalyzer from global system first
    const globalSystem = (globalThis as any).year3000System;
    this.performanceAnalyzer = globalSystem?.performanceAnalyzer || 
                               globalSystem?.facadeCoordinator?.getCachedNonVisualSystem?.('SimplePerformanceCoordinator') ||
                               null;
    this.deviceDetector = new DeviceCapabilityDetector();
    this.strategySelector = new BackgroundStrategySelector();
    this.oklabProcessor = new OKLABColorProcessor(YEAR3000_CONFIG.enableDebug);

    // Enhanced default selection criteria with device awareness
    this.selectionCriteria = {
      performance: "medium",
      quality: "enhanced",
      deviceCapabilities: {
        hasWebGL: Boolean(window.WebGLRenderingContext),
        memoryMB: this.estimateMemoryMB(),
        isMobile: this.detectMobile(),
      },
      userPreferences: {
        harmonicMode: "cosmic",
        intensity: 0.8,
        enableAdvancedBlending: true,
      },
    };

    // Update device capabilities
    this.updateDeviceCapabilities();

    Y3KDebug?.debug?.log(
      "ColorOrchestrator",
      "Enhanced color orchestrator created with multi-strategy coordination"
    );
  }

  /**
   * Initialize enhanced orchestrator with event bus and strategy registry
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      Y3KDebug?.debug?.warn("ColorOrchestrator", "Already initialized");
      return;
    }

    try {
      // Subscribe to color extraction events via UnifiedEventBus
      // Phase 3: Fixed event name mismatch - MusicSyncService emits "colors:extracted" not "colors/extracted"
      unifiedEventBus.subscribe(
        "colors:extracted",
        this.handleColorExtractionEvent.bind(this),
        "ColorOrchestrator"
      );

      // Initialize enhanced device capabilities
      this.updateDeviceCapabilities();

      // Load user preferences
      this.loadUserPreferences();

      // Performance monitoring is automatic in SimpleTierBasedPerformanceSystem
      // (no explicit start needed)

      // Register default strategies (ColorHarmonyEngine will register itself)
      await this.registerDefaultStrategies();

      this.isInitialized = true;
      this.initialized = true;

      Y3KDebug?.debug?.log(
        "ColorOrchestrator",
        "Enhanced color orchestrator initialized",
        {
          strategies: this.registry.getStatus().strategyCount,
          criteria: this.selectionCriteria,
          oklabEnabled: this.oklabCoordinationEnabled,
          deviceLevel: this.deviceDetector.recommendPerformanceQuality(),
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorOrchestrator",
        "Enhanced initialization failed:",
        error
      );
      throw error;
    }
  }

  /**
   * Handle color extraction event from UnifiedEventBus
   * Phase 3: Updated to handle UnifiedEventBus events directly (no event.type wrapper)
   */
  private async handleColorExtractionEvent(data: any): Promise<void> {
    // UnifiedEventBus passes data directly, not wrapped in an event object
    const context = data as ColorContext;
    await this.handleColorExtraction(context);
  }

  /**
   * Enhanced color extraction processing with multi-strategy coordination
   * Phase 4: Added recursion prevention, queue overflow protection, and caching
   */
  async handleColorExtraction(context: ColorContext): Promise<void> {
    const now = Date.now();
    const contextKey = context.trackUri || "unknown";

    Y3KDebug?.debug?.log(
      "ColorOrchestrator",
      "🎵 Color Extraction Event Received - WebGL Gradient Entry Point",
      {
        trackUri: contextKey,
        rawColors: context.rawColors,
        colorCount: Object.keys(context.rawColors).length,
        isProcessing: this.isProcessing,
        queueLength: this.processingQueue.length,
        entryPoint: "handleColorExtraction",
      }
    );

    // Phase 4: Prevent recursive processing of the same context
    const lastProcessed = this.processedContexts.get(contextKey);
    if (lastProcessed && now - lastProcessed < this.CONTEXT_CACHE_TTL) {
      Y3KDebug?.debug?.warn(
        "ColorOrchestrator",
        `Skipping recent context to prevent recursion: ${contextKey}`,
        {
          lastProcessed: new Date(lastProcessed).toISOString(),
          timeDiff: now - lastProcessed,
        }
      );
      return;
    }

    // Check cache first for improved performance
    const cacheKey = this.generateCacheKey(context);
    const cachedResult = this.getCachedResult(cacheKey);

    if (cachedResult) {
      this.orchestrationMetrics.cacheHits++;
      await this.applyColorResult(cachedResult);
      Y3KDebug?.debug?.log("ColorOrchestrator", "Using cached color result", {
        cacheKey,
      });
      return;
    }

    // Phase 4: Prevent queue overflow
    if (this.processingQueue.length >= this.MAX_QUEUE_SIZE) {
      Y3KDebug?.debug?.warn(
        "ColorOrchestrator",
        `Queue overflow protection: dropping context ${contextKey}`,
        {
          queueSize: this.processingQueue.length,
          maxSize: this.MAX_QUEUE_SIZE,
        }
      );
      // Remove oldest item to make space
      this.processingQueue.shift();
    }

    // Clean up expired cache entries
    this.cleanupProcessedContexts(now);

    // Add to processing queue
    this.processingQueue.push(context);

    // Process queue if not already processing
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  /**
   * Process the color processing queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.processingQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.processingQueue.length > 0) {
        const context = this.processingQueue.shift()!;
        await this.processColorContext(context);
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorOrchestrator",
        "Queue processing failed:",
        error
      );
    } finally {
      this.isProcessing = false;
      this.currentStrategy = null;
    }
  }

  /**
   * Clean up expired processed context cache entries
   * Phase 4: Prevents memory leaks from recursion prevention cache
   */
  private cleanupProcessedContexts(now: number): void {
    for (const [contextKey, timestamp] of this.processedContexts.entries()) {
      if (now - timestamp > this.CONTEXT_CACHE_TTL) {
        this.processedContexts.delete(contextKey);
      }
    }
  }

  /**
   * Enhanced single color context processing with multi-strategy coordination
   * Phase 4: Added multi-strategy processing, OKLAB coordination, and result merging
   */
  private async processColorContext(context: ColorContext): Promise<void> {
    const startTime = performance.now();
    const contextKey = context.trackUri || "unknown";

    Y3KDebug?.debug?.log(
      "ColorOrchestrator",
      "🎨 Processing Color Context - WebGL Gradient Recovery Debug",
      {
        trackUri: contextKey,
        rawColors: context.rawColors,
        colorCount: Object.keys(context.rawColors).length,
        musicData: context.musicData,
        timestamp: new Date().toISOString(),
      }
    );

    try {
      // Select multiple strategies using BackgroundStrategySelector  
      const selectedStrategies = this.strategySelector.selectStrategies(
        context,
        this.buildStrategySelectionCriteria(context)
      );

      if (selectedStrategies.length === 0) {
        // Fallback to legacy single strategy selection
        const fallbackStrategy = this.selectStrategy(context);
        if (fallbackStrategy) {
          selectedStrategies.push(fallbackStrategy);
        } else {
          throw new Error(
            "No suitable strategies selected for color processing"
          );
        }
      }

      // Process with multiple strategies
      const strategyResults = await this.processWithStrategies(
        context,
        selectedStrategies
      );

      // Apply OKLAB coordination if enabled and multiple strategies succeeded
      if (
        this.oklabCoordinationEnabled &&
        strategyResults.filter((r) => r.success).length > 1
      ) {
        await this.coordinateOKLABProcessing(strategyResults, context);
      }

      // Merge strategy results intelligently
      const finalResult = this.mergeStrategyResults(strategyResults, context);

      // Cache the result for performance
      const cacheKey = this.generateCacheKey(context);
      this.cacheResult(cacheKey, finalResult);

      // Apply the final result
      await this.applyColorResult(finalResult);

      // Phase 4: Mark context as processed to prevent recursion
      this.processedContexts.set(contextKey, Date.now());

      // Update enhanced metrics
      const totalTime = performance.now() - startTime;
      this.updateOrchestrationMetrics(strategyResults, totalTime);

      // Update legacy metrics for compatibility
      this.lastProcessingTime = totalTime;
      this.totalProcessingTime += totalTime;
      this.processedCount++;

      Y3KDebug?.debug?.log(
        "ColorOrchestrator",
        "Enhanced color processing completed",
        {
          strategies: selectedStrategies.map((s) => s.getStrategyName()),
          processingTime: totalTime,
          trackUri: context.trackUri,
          oklabCoordination: this.oklabCoordinationEnabled,
          successfulStrategies: strategyResults.filter((r) => r.success).length,
        }
      );
    } catch (error) {
      const endTime = performance.now();
      this.lastProcessingTime = endTime - startTime;

      Y3KDebug?.debug?.error(
        "ColorOrchestrator",
        "Enhanced color processing failed:",
        {
          error: error,
          strategy: this.currentStrategy,
          trackUri: context.trackUri,
        }
      );

      // Try to apply fallback colors
      await this.applyFallbackColors(context);
    }
  }

  /**
   * Select best strategy for given context
   */
  private selectStrategy(context: ColorContext): IColorProcessor | null {
    // Update selection criteria based on context
    const contextualCriteria = { ...this.selectionCriteria };

    // Performance hints from context
    if (context.performanceHints) {
      if (context.performanceHints.preferLightweight) {
        contextualCriteria.performance = "high";
        contextualCriteria.quality = "basic";
      }

      if (context.performanceHints.enableAdvancedBlending) {
        contextualCriteria.quality = "premium";
      }
    }

    // Music data influences quality requirements
    if (context.musicData) {
      // High energy music might benefit from more vibrant processing
      if (context.musicData.energy && context.musicData.energy > 0.8) {
        contextualCriteria.quality = "premium";
      }
    }

    return this.registry.selectStrategy(contextualCriteria);
  }

  /**
   * Register default strategies (ColorHarmonyEngine will self-register)
   */
  private async registerDefaultStrategies(): Promise<void> {
    // Note: ColorHarmonyEngine and other strategies should register themselves
    // when they are initialized. This method is for any built-in fallback strategies.

    Y3KDebug?.debug?.log(
      "ColorOrchestrator",
      "Default strategies registration completed"
    );
  }

  // ============================================================================
  // Enhanced Multi-Strategy Processing Methods
  // ============================================================================

  /**
   * Process colors with multiple strategies in parallel
   */
  private async processWithStrategies(
    context: ColorContext,
    strategies: IColorProcessor[]
  ): Promise<StrategyProcessingResult[]> {
    const results: StrategyProcessingResult[] = [];

    // Process strategies in parallel for better performance
    const strategyPromises = strategies.map(async (strategy) => {
      const strategyStartTime = performance.now();
      this.currentStrategy = strategy.getStrategyName();

      try {
        const result = await strategy.processColors(context);
        const processingTime = performance.now() - strategyStartTime;

        return {
          strategy,
          result,
          processingTime,
          success: true,
        };
      } catch (error) {
        const processingTime = performance.now() - strategyStartTime;

        Y3KDebug?.debug?.error(
          "ColorOrchestrator",
          `Strategy ${strategy.getStrategyName()} failed:`,
          error
        );

        return {
          strategy,
          result: this.createErrorResult(context, strategy, error),
          processingTime,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    const strategyResults = await Promise.all(strategyPromises);

    return strategyResults;
  }

  /**
   * Merge results from multiple strategies with intelligent conflict resolution
   */
  private mergeStrategyResults(
    strategyResults: StrategyProcessingResult[],
    context: ColorContext
  ): ColorResult {
    const successfulResults = strategyResults.filter((r) => r.success);

    if (successfulResults.length === 0) {
      // All strategies failed - return fallback result
      return this.createFallbackResult(context);
    }

    if (successfulResults.length === 1) {
      // Only one successful result - return it directly
      return successfulResults[0]!.result;
    }

    // Multiple successful results - merge intelligently
    const mergeOptions: ColorResultMergeOptions = {
      priorityWeighting: true,
      conflictResolution: "merge",
      preserveMetadata: true,
      consciousnessBlending: true,
      oklabCoordination: this.oklabCoordinationEnabled,
    };

    return this.performResultMerge(successfulResults, context, mergeOptions);
  }

  /**
   * Perform intelligent merging of multiple color results
   */
  private performResultMerge(
    results: StrategyProcessingResult[],
    context: ColorContext,
    options: ColorResultMergeOptions
  ): ColorResult {
    // Sort results by strategy priority (higher priority first)
    const sortedResults = results.sort((a, b) => {
      const aPriority =
        this.strategySelector.getStrategyMetadata(a.strategy.getStrategyName())
          ?.priority || 0;
      const bPriority =
        this.strategySelector.getStrategyMetadata(b.strategy.getStrategyName())
          ?.priority || 0;
      return bPriority - aPriority;
    });

    // Start with highest priority result as base
    const baseResult = sortedResults[0]!.result;
    const mergedResult: ColorResult = {
      processedColors: { ...baseResult.processedColors },
      accentHex: baseResult.accentHex,
      accentRgb: baseResult.accentRgb,
      metadata: {
        ...baseResult.metadata,
        strategy: "enhanced-orchestrator",
        mergedStrategies: sortedResults.map((r) =>
          r.strategy.getStrategyName()
        ),
        totalProcessingTime: sortedResults.reduce(
          (sum, r) => sum + r.processingTime,
          0
        ),
      },
      context,
    };

    // Merge additional results
    for (let i = 1; i < sortedResults.length; i++) {
      const currentResult = sortedResults[i]!.result;

      // Merge processed colors (avoid conflicts by using namespacing)
      Object.entries(currentResult.processedColors).forEach(([key, value]) => {
        if (options.conflictResolution === "override") {
          // Higher priority strategies override
          if (i === 1) mergedResult.processedColors[key] = value;
        } else if (options.conflictResolution === "merge") {
          // Merge with strategy namespace to avoid conflicts
          const strategyName = currentResult.metadata.strategy;
          mergedResult.processedColors[`${strategyName}-${key}`] = value;
        }
      });

      // Preserve important metadata
      if (options.preserveMetadata) {
        const strategyName = currentResult.metadata.strategy;
        mergedResult.metadata[`${strategyName}-metadata`] =
          currentResult.metadata;
      }
    }

    // Apply consciousness blending if enabled
    if (options.consciousnessBlending) {
      this.applyConsciousnessBlending(mergedResult, sortedResults);
    }

    // Apply OKLAB coordination if enabled
    if (options.oklabCoordination) {
      this.applyOKLABCoordination(mergedResult, sortedResults);
    }

    return mergedResult;
  }

  /**
   * Apply consciousness-aware blending to merged results
   */
  private applyConsciousnessBlending(
    mergedResult: ColorResult,
    strategyResults: StrategyProcessingResult[]
  ): void {
    // Calculate consciousness-weighted average for accent colors
    let totalWeight = 0;
    let weightedR = 0,
      weightedG = 0,
      weightedB = 0;

    strategyResults.forEach((result) => {
      const strategyMetadata = this.strategySelector.getStrategyMetadata(
        result.strategy.getStrategyName()
      );
      const weight = (strategyMetadata?.qualityScore || 5) / 10; // Normalize to 0-1

      const rgb = this.hexToRgb(result.result.accentHex);
      if (rgb) {
        weightedR += rgb.r * weight;
        weightedG += rgb.g * weight;
        weightedB += rgb.b * weight;
        totalWeight += weight;
      }
    });

    if (totalWeight > 0) {
      const avgR = Math.round(weightedR / totalWeight);
      const avgG = Math.round(weightedG / totalWeight);
      const avgB = Math.round(weightedB / totalWeight);

      mergedResult.accentHex = this.rgbToHex(avgR, avgG, avgB);
      mergedResult.accentRgb = `${avgR},${avgG},${avgB}`;

      // Add consciousness blending metadata
      mergedResult.metadata.consciousnessBlending = {
        strategyCount: strategyResults.length,
        totalWeight,
        blendedAccent: mergedResult.accentHex,
      };
    }
  }

  /**
   * Coordinate OKLAB processing across strategies for perceptual uniformity
   */
  private async coordinateOKLABProcessing(
    strategyResults: StrategyProcessingResult[],
    context: ColorContext
  ): Promise<void> {
    const oklabStartTime = performance.now();

    try {
      // Extract and process colors from all successful strategies
      const successfulResults = strategyResults.filter((r) => r.success);
      const allColors: Record<string, string> = {};

      // Collect all unique colors from all strategies
      successfulResults.forEach((result) => {
        Object.entries(result.result.processedColors).forEach(
          ([key, value]) => {
            if (value && value.startsWith("#")) {
              allColors[`${result.strategy.getStrategyName()}-${key}`] = value;
            }
          }
        );
      });

      // Get optimal OKLAB preset based on context
      const preset = this.getOptimalOKLABPreset(context);

      // Process all colors through OKLAB for consistency
      const oklabResults = this.oklabProcessor.processColorPalette(
        allColors,
        preset
      );

      // Store OKLAB data in strategy results for merging
      successfulResults.forEach((result) => {
        const strategyName = result.strategy.getStrategyName();
        result.oklabData = Object.values(oklabResults).filter(
          (oklab) =>
            oklab.originalHex in allColors &&
            Object.keys(allColors).find(
              (key) =>
                key.startsWith(strategyName) &&
                allColors[key] === oklab.originalHex
            )
        );
      });

      const oklabProcessingTime = performance.now() - oklabStartTime;
      this.orchestrationMetrics.oklabCoordinations++;
      this.orchestrationMetrics.oklabProcessingTime += oklabProcessingTime;

      Y3KDebug?.debug?.log(
        "ColorOrchestrator",
        "OKLAB coordination completed",
        {
          strategiesCoordinated: successfulResults.length,
          colorsProcessed: Object.keys(allColors).length,
          preset: preset.name,
          processingTime: oklabProcessingTime,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorOrchestrator",
        "OKLAB coordination failed:",
        error
      );
    }
  }

  /**
   * Apply OKLAB coordination to merged results for perceptual consistency
   */
  private applyOKLABCoordination(
    mergedResult: ColorResult,
    strategyResults: StrategyProcessingResult[]
  ): void {
    try {
      // Collect all OKLAB data from strategies
      const allOKLABData: OKLABProcessingResult[] = [];
      strategyResults.forEach((result) => {
        if (result.oklabData) {
          allOKLABData.push(...result.oklabData);
        }
      });

      if (allOKLABData.length === 0) return;

      // Calculate perceptually uniform accent color from all OKLAB data
      const oklabAccent = this.calculatePerceptuallyUniformAccent(allOKLABData);

      if (oklabAccent) {
        mergedResult.accentHex = oklabAccent.enhancedHex;
        mergedResult.accentRgb = `${oklabAccent.enhancedRgb.r},${oklabAccent.enhancedRgb.g},${oklabAccent.enhancedRgb.b}`;

        // Add OKLAB coordination variables to processed colors
        const oklabCSSVars = this.oklabProcessor.generateCSSVariables(
          oklabAccent,
          "sn-oklab-unified"
        );
        Object.entries(oklabCSSVars).forEach(([key, value]) => {
          mergedResult.processedColors[key] = value;
        });

        // Add OKLAB metadata
        mergedResult.metadata.oklabCoordination = {
          enabled: true,
          strategiesCoordinated: strategyResults.length,
          colorsProcessed: allOKLABData.length,
          perceptualAccent: oklabAccent.enhancedHex,
          lightness: oklabAccent.oklabEnhanced.L,
          chroma: oklabAccent.oklchEnhanced.C,
          hue: oklabAccent.oklchEnhanced.H,
        };
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorOrchestrator",
        "OKLAB coordination application failed:",
        error
      );
    }
  }

  /**
   * Calculate perceptually uniform accent color from OKLAB data
   */
  private calculatePerceptuallyUniformAccent(
    oklabData: OKLABProcessingResult[]
  ): OKLABProcessingResult | null {
    if (oklabData.length === 0) return null;
    if (oklabData.length === 1) return oklabData[0] || null;

    // Calculate weighted average in OKLAB space for perceptual uniformity
    let totalWeight = 0;
    let weightedL = 0,
      weightedA = 0,
      weightedB = 0;

    oklabData.forEach((oklab) => {
      // Weight by chroma (more vibrant colors have higher weight)
      const chroma = Math.sqrt(
        oklab.oklabEnhanced.a ** 2 + oklab.oklabEnhanced.b ** 2
      );
      const weight = Math.max(0.1, chroma); // Minimum weight to include all colors

      weightedL += oklab.oklabEnhanced.L * weight;
      weightedA += oklab.oklabEnhanced.a * weight;
      weightedB += oklab.oklabEnhanced.b * weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) return oklabData[0] || null;

    const avgOklab = {
      L: weightedL / totalWeight,
      a: weightedA / totalWeight,
      b: weightedB / totalWeight,
    };

    // Convert back to RGB and hex
    const avgRgb = Utils.oklabToRgb(avgOklab.L, avgOklab.a, avgOklab.b);
    const avgHex = Utils.rgbToHex(avgRgb.r, avgRgb.g, avgRgb.b);

    // Process the averaged color for consistency
    const preset = OKLABColorProcessor.getPreset("STANDARD");
    return this.oklabProcessor.processColor(avgHex, preset);
  }

  /**
   * Get current processing status with enhanced metrics
   * Phase 4: Added recursion prevention status and orchestration metrics
   */
  getStatus(): {
    isProcessing: boolean;
    currentStrategy?: string;
    queueSize: number;
    processedContextsCount: number;
    maxQueueSize: number;
    contextCacheTTL: number;
    orchestrationMetrics: OrchestrationMetrics;
    oklabCoordinationEnabled: boolean;
  } {
    return {
      isProcessing: this.isProcessing,
      ...(this.currentStrategy
        ? { currentStrategy: this.currentStrategy }
        : {}),
      queueSize: this.processingQueue.length,
      processedContextsCount: this.processedContexts.size,
      maxQueueSize: this.MAX_QUEUE_SIZE,
      contextCacheTTL: this.CONTEXT_CACHE_TTL,
      orchestrationMetrics: { ...this.orchestrationMetrics },
      oklabCoordinationEnabled: this.oklabCoordinationEnabled,
    };
  }

  /**
   * Set strategy selection criteria
   */
  setSelectionCriteria(criteria: StrategySelectionCriteria): void {
    this.selectionCriteria = { ...this.selectionCriteria, ...criteria };

    Y3KDebug?.debug?.log(
      "ColorOrchestrator",
      "Selection criteria updated",
      criteria
    );
  }

  /**
   * Get processing performance metrics
   */
  getPerformanceMetrics(): {
    processedCount: number;
    averageProcessingTime: number;
    lastProcessingTime: number;
    totalProcessingTime: number;
  } {
    return {
      processedCount: this.processedCount,
      averageProcessingTime:
        this.processedCount > 0
          ? this.totalProcessingTime / this.processedCount
          : 0,
      lastProcessingTime: this.lastProcessingTime,
      totalProcessingTime: this.totalProcessingTime,
    };
  }

  /**
   * Register a new color processing strategy
   */
  registerStrategy(strategy: IColorProcessor): void {
    this.registry.register(strategy);
  }

  /**
   * Get strategy registry for advanced operations
   */
  getRegistry(): ColorStrategyRegistry {
    return this.registry;
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Estimate available memory in MB
   */
  private estimateMemoryMB(): number {
    const memoryInfo = (performance as any).memory;
    if (memoryInfo && memoryInfo.usedJSHeapSize && memoryInfo.jsHeapSizeLimit) {
      return (
        (memoryInfo.jsHeapSizeLimit - memoryInfo.usedJSHeapSize) / (1024 * 1024)
      );
    }

    // Fallback estimation based on device type
    return this.detectMobile() ? 256 : 1024;
  }

  /**
   * Detect if running on mobile device
   */
  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  // ============================================================================
  // Enhanced Utility Methods
  // ============================================================================

  /**
   * Build strategy selection criteria based on current context and settings
   */
  private buildStrategySelectionCriteria(context: ColorContext): any {
    return {
      ...this.selectionCriteria,
      settingsContext: {
        dynamicAccentEnabled:
          this.settingsManager.get("sn-dynamic-accent-enabled" as any) ?? true,
        gradientIntensity:
          this.settingsManager.get("sn-gradient-intensity" as any) ??
          "balanced",
        webglEnabled:
          this.settingsManager.get("sn-webgl-enabled" as any) ?? true,
        visualGuideMode:
          this.settingsManager.get("sn-visual-guide-mode" as any) ?? "cosmic",
        depthLayersEnabled:
          this.settingsManager.get("sn-depth-enabled" as any) ?? true,
        consciousnessLevel:
          this.settingsManager.get("sn-consciousness-level" as any) ?? 0.8,
        breathingAnimationEnabled:
          this.settingsManager.get("sn-breathing-enabled" as any) ?? true,
      },
      musicContext: context.musicData,
      deviceContext: {
        supportsWebGL: (this.deviceDetector as any).hasWebGLSupport
          ? (this.deviceDetector as any).hasWebGLSupport()
          : false,
        performanceLevel: this.deviceDetector.recommendPerformanceQuality(),
        memoryCapacity: (window.navigator as any).deviceMemory
          ? (window.navigator as any).deviceMemory * 1024
          : 4096,
        isMobile:
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ),
      },
    };
  }

  /**
   * Get optimal OKLAB preset based on context
   */
  private getOptimalOKLABPreset(context: ColorContext): EnhancementPreset {
    // Determine optimal preset based on music data and user preferences
    const intensity = this.selectionCriteria.userPreferences?.intensity || 0.8;
    const musicEnergy = context.musicData?.energy || 0.5;

    // Calculate combined intensity
    const combinedIntensity = (intensity + musicEnergy) / 2;

    if (combinedIntensity >= 0.8) {
      return OKLABColorProcessor.getPreset("COSMIC");
    } else if (combinedIntensity >= 0.6) {
      return OKLABColorProcessor.getPreset("VIBRANT");
    } else if (combinedIntensity >= 0.4) {
      return OKLABColorProcessor.getPreset("STANDARD");
    } else {
      return OKLABColorProcessor.getPreset("SUBTLE");
    }
  }

  /**
   * 🔧 PHASE 2: Emit color result instead of applying CSS directly
   * ColorStateManager will handle all CSS applications through batching
   */
  private async applyColorResult(result: ColorResult): Promise<void> {
    try {
      // 🔧 PHASE 2: No longer apply CSS directly - emit events instead
      // ColorStateManager is now the single CSS authority

      // Dispatch unified event for ColorStateManager
      unifiedEventBus.emit("colors:harmonized", {
        processedColors: result.processedColors,
        accentHex: result.accentHex || "#cba6f7",
        accentRgb: result.accentRgb || "203,166,247",
        strategies: [result.metadata.strategy],
        processingTime: result.metadata.processingTime,
        trackUri: result.metadata.trackUri,
        coordinationMetrics: {
          detectedGenre: result.metadata.genre || "unknown",
          emotionalState: result.metadata.emotion || "neutral",
          oklabPreset: result.metadata.oklabPreset || "default",
          coordinationStrategy: result.metadata.strategy,
          musicInfluenceStrength: result.metadata.intensity || 0.5,
        },
        processingMode: "orchestrated",
      });

      // Dispatch legacy event for backwards compatibility (temporarily)
      const event = new CustomEvent("colors/harmonized", {
        detail: {
          type: "colors/harmonized",
          payload: {
            ...result,
            cssVariables: result.processedColors,
          },
        },
      });

      document.dispatchEvent(event);
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorOrchestrator",
        "Failed to apply color result:",
        error
      );
    }
  }

  /**
   * Cache management methods
   */
  private generateCacheKey(context: ColorContext): string {
    return `${context.trackUri}-${context.timestamp}-${JSON.stringify(
      context.musicData || {}
    )}`;
  }

  private getCachedResult(cacheKey: string): ColorResult | null {
    return this.resultCache.get(cacheKey) || null;
  }

  private cacheResult(cacheKey: string, result: ColorResult): void {
    // Implement LRU cache
    if (this.resultCache.size >= this.cacheMaxSize) {
      const firstKey = this.resultCache.keys().next().value;
      if (firstKey) this.resultCache.delete(firstKey);
    }

    this.resultCache.set(cacheKey, result);

    // Set cache timeout
    setTimeout(() => {
      this.resultCache.delete(cacheKey);
    }, this.cacheTimeoutMs);
  }

  /**
   * Device capability and preference management
   */
  private updateDeviceCapabilities(): void {
    this.selectionCriteria.deviceCapabilities = {
      hasWebGL: (this.deviceDetector as any).hasWebGLSupport
        ? (this.deviceDetector as any).hasWebGLSupport()
        : false,
      memoryMB: (window.navigator as any).deviceMemory
        ? (window.navigator as any).deviceMemory * 1024
        : 4096,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    };
  }

  private loadUserPreferences(): void {
    try {
      this.selectionCriteria.userPreferences = {
        harmonicMode:
          this.settingsManager.get("sn-visual-guide-mode" as any) ?? "cosmic",
        intensity:
          this.settingsManager.get("sn-consciousness-level" as any) ?? 0.8,
        enableAdvancedBlending:
          this.settingsManager.get("sn-advanced-blending" as any) ?? true,
      };
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "ColorOrchestrator",
        "Failed to load user preferences:",
        error
      );
    }
  }

  /**
   * Error handling and fallback methods
   */
  private createErrorResult(
    context: ColorContext,
    strategy: IColorProcessor,
    error: any
  ): ColorResult {
    return {
      processedColors: context.rawColors,
      accentHex: "#cba6f7", // Fallback mauve
      accentRgb: "203,166,247",
      metadata: {
        strategy: strategy.getStrategyName(),
        processingTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      context,
    };
  }

  private createFallbackResult(context: ColorContext): ColorResult {
    return {
      processedColors: context.rawColors,
      accentHex: "#cba6f7", // Fallback mauve
      accentRgb: "203,166,247",
      metadata: {
        strategy: "fallback",
        processingTime: 0,
        error: "All strategies failed",
      },
      context,
    };
  }

  private async applyFallbackColors(context: ColorContext): Promise<void> {
    const fallbackResult = this.createFallbackResult(context);
    await this.applyColorResult(fallbackResult);
  }

  /**
   * Update orchestration metrics
   */
  private updateOrchestrationMetrics(
    results: StrategyProcessingResult[],
    totalTime: number
  ): void {
    this.orchestrationMetrics.totalProcessingTime += totalTime;
    this.orchestrationMetrics.strategiesProcessed += results.length;
    this.orchestrationMetrics.strategiesSucceeded += results.filter(
      (r) => r.success
    ).length;
    this.orchestrationMetrics.strategiesFailed += results.filter(
      (r) => !r.success
    ).length;

    const successfulTimes = results
      .filter((r) => r.success)
      .map((r) => r.processingTime);
    if (successfulTimes.length > 0) {
      this.orchestrationMetrics.averageStrategyTime =
        successfulTimes.reduce((a, b) => a + b, 0) / successfulTimes.length;
    }
  }

  /**
   * Color utility methods
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1]!, 16),
          g: parseInt(result[2]!, 16),
          b: parseInt(result[3]!, 16),
        }
      : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // ============================================================================
  // Enhanced Public Interface Methods
  // ============================================================================

  /**
   * Get orchestration metrics for monitoring
   */
  getOrchestrationMetrics(): OrchestrationMetrics {
    return { ...this.orchestrationMetrics };
  }

  /**
   * Clear result cache
   */
  clearCache(): void {
    this.resultCache.clear();
    Y3KDebug?.debug?.log("ColorOrchestrator", "Result cache cleared");
  }

  /**
   * Enable or disable OKLAB coordination
   */
  setOKLABCoordinationEnabled(enabled: boolean): void {
    this.oklabCoordinationEnabled = enabled;
    Y3KDebug?.debug?.log(
      "ColorOrchestrator",
      `OKLAB coordination ${enabled ? "enabled" : "disabled"}`
    );
  }

  /**
   * Get OKLAB coordination status
   */
  isOKLABCoordinationEnabled(): boolean {
    return this.oklabCoordinationEnabled;
  }

  /**
   * Get OKLAB processor for external use
   */
  getOKLABProcessor(): OKLABColorProcessor {
    return this.oklabProcessor;
  }

  /**
   * Cleanup resources
   */
  /**
   * IManagedSystem - Update animation loop (delegates to OKLAB processor if needed)
   */
  public updateAnimation(deltaTime: number): void {
    if (!this.initialized) return;

    // Color coordination doesn't typically need animation updates,
    // but we can update performance metrics and process queue if needed
    try {
      // Process any queued color contexts if not currently processing
      if (!this.isProcessing && this.processingQueue.length > 0) {
        // Process queue asynchronously without blocking animation loop
        this.processQueue().catch(error => {
          Y3KDebug?.debug?.error(
            "ColorCoordinator",
            "Queue processing error in animation loop:",
            error
          );
        });
      }

      // Update memory usage metrics
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        this.orchestrationMetrics.memoryUsage = memoryInfo.usedJSHeapSize / (1024 * 1024);
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorCoordinator",
        "Animation update error:",
        error
      );
    }
  }

  /**
   * IManagedSystem - Health check for color coordination system
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    try {
      const metrics = this.getOrchestrationMetrics();
      const strategyStatus = this.registry.getStatus();
      
      let status: "healthy" | "degraded" | "critical" = "healthy";
      const issues: string[] = [];

      // Check initialization status
      if (!this.isInitialized) {
        status = "critical";
        issues.push("System not initialized");
      }

      // Check strategy registry
      if (strategyStatus.strategyCount === 0) {
        status = "critical";
        issues.push("No color processing strategies registered");
      }

      // Check processing queue health
      if (this.processingQueue.length >= this.MAX_QUEUE_SIZE * 0.8) {
        status = status === "critical" ? "critical" : "degraded";
        issues.push(`Processing queue near capacity: ${this.processingQueue.length}/${this.MAX_QUEUE_SIZE}`);
      }

      // Check failure rate
      const totalProcessed = metrics.strategiesSucceeded + metrics.strategiesFailed;
      if (totalProcessed > 0) {
        const failureRate = metrics.strategiesFailed / totalProcessed;
        if (failureRate > 0.5) {
          status = "critical";
          issues.push(`High failure rate: ${(failureRate * 100).toFixed(1)}%`);
        } else if (failureRate > 0.2) {
          status = status === "critical" ? "critical" : "degraded";
          issues.push(`Moderate failure rate: ${(failureRate * 100).toFixed(1)}%`);
        }
      }

      // Check memory usage
      if (metrics.memoryUsage > 100) {
        status = status === "critical" ? "critical" : "degraded";
        issues.push(`High memory usage: ${metrics.memoryUsage.toFixed(1)}MB`);
      }

      const message = issues.length === 0 
        ? `Color coordination system healthy (${strategyStatus.strategyCount} strategies)`
        : `Color coordination issues: ${issues.join(", ")}`;

      return {
        healthy: status === "healthy",
        ok: status !== "critical",
        details: `${message} - Status: ${status}`,
        system: "ColorCoordinator",
        issues,
        metrics: {
          initialized: this.isInitialized,
          strategies: strategyStatus,
          orchestrationMetrics: metrics,
          queueSize: this.processingQueue.length,
          isProcessing: this.isProcessing,
          oklabEnabled: this.oklabCoordinationEnabled,
          status
        }
      };
    } catch (error) {
      return {
        healthy: false,
        ok: false,
        details: `Health check failed: ${error}`,
        system: "ColorCoordinator",
        issues: ["Health check exception"],
        metrics: { error: String(error) }
      };
    }
  }

  /**
   * IManagedSystem - Force repaint/refresh of color coordination
   */
  public forceRepaint(reason?: string): void {
    Y3KDebug?.debug?.log(
      "ColorCoordinator",
      `Force repaint requested${reason ? `: ${reason}` : ""}`
    );

    try {
      // Clear result cache to force fresh processing
      this.clearCache();

      // Clear processed contexts to allow reprocessing
      this.processedContexts.clear();

      // Force reload user preferences
      this.loadUserPreferences();

      // Update device capabilities
      this.updateDeviceCapabilities();

      // Process any pending contexts immediately
      if (this.processingQueue.length > 0 && !this.isProcessing) {
        this.processQueue().catch(error => {
          Y3KDebug?.debug?.error(
            "ColorCoordinator",
            "Force repaint queue processing error:",
            error
          );
        });
      }

      Y3KDebug?.debug?.log(
        "ColorCoordinator",
        "Force repaint completed",
        {
          cacheCleared: true,
          contextsCleared: this.processedContexts.size === 0,
          queueSize: this.processingQueue.length
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorCoordinator",
        "Force repaint error:",
        error
      );
    }
  }

  async destroy(): Promise<void> {
    // Unsubscribe from events
    // Phase 3: Updated to use UnifiedEventBus for proper facade coordination
    unifiedEventBus.unsubscribeAll("ColorOrchestrator");

    // Clear caches and queues
    this.clearCache();
    this.processingQueue = [];
    this.isProcessing = false;
    this.isInitialized = false;
    this.initialized = false;

    // Phase 4: Clear recursion prevention cache
    this.processedContexts.clear();

    // Cleanup strategy selector
    this.strategySelector.destroy();

    Y3KDebug?.debug?.log(
      "ColorOrchestrator",
      "Enhanced color orchestrator destroyed"
    );
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/**
 * Global singleton instance for color orchestration
 */
export const globalColorOrchestrator = new ColorCoordinator();
