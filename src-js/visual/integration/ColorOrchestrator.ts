/**
 * Color Orchestrator - Strategy Pattern Invoker Implementation
 * 
 * Coordinates event-driven color processing using Strategy pattern.
 * Eliminates circular dependencies by acting as mediator between
 * color extraction and color processing systems.
 * 
 * Architecture:
 * - Strategy Pattern: Multiple color processing algorithms
 * - Observer Pattern: Event-driven coordination via GlobalEventBus
 * - Adapter Pattern: Clean interface between systems
 * - Mediator Pattern: Coordinates strategy selection and execution
 */

import { GlobalEventBus } from "@/core/events/EventBus";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type { 
  IColorOrchestrator,
  IColorStrategyRegistry,
  IColorProcessor,
  ColorContext,
  ColorResult,
  StrategySelectionCriteria,
  ColorExtractedEvent,
  ColorHarmonizedEvent
} from "@/types/colorStrategy";

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
    
    Y3K?.debug?.log("ColorStrategyRegistry", `Registered strategy: ${name}`);
  }

  /**
   * Select best strategy for given criteria
   */
  selectStrategy(criteria: StrategySelectionCriteria): IColorProcessor | null {
    // Strategy selection algorithm based on performance and quality requirements
    
    // High performance, low quality -> prefer lightweight strategies
    if (criteria.performance === 'high' && criteria.quality === 'basic') {
      for (const strategy of this.strategies.values()) {
        const strategyName = strategy.getStrategyName().toLowerCase();
        if (strategyName.includes('lightweight') || strategyName.includes('fast')) {
          return strategy;
        }
      }
    }
    
    // High quality, low performance constraints -> prefer advanced strategies
    if (criteria.quality === 'premium' && criteria.performance === 'low') {
      for (const strategy of this.strategies.values()) {
        const strategyName = strategy.getStrategyName().toLowerCase();
        if (strategyName.includes('harmony') || strategyName.includes('advanced')) {
          return strategy;
        }
      }
    }
    
    // Mobile device optimization
    if (criteria.deviceCapabilities?.isMobile) {
      for (const strategy of this.strategies.values()) {
        const strategyName = strategy.getStrategyName().toLowerCase();
        if (strategyName.includes('mobile') || strategyName.includes('optimized')) {
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
      defaultStrategy: this.defaultStrategy?.getStrategyName() || null
    };
  }
}

// ============================================================================
// Color Orchestrator Implementation  
// ============================================================================

/**
 * Main color orchestrator implementing Strategy Invoker pattern
 */
export class ColorOrchestrator implements IColorOrchestrator {
  private registry: ColorStrategyRegistry;
  private selectionCriteria: StrategySelectionCriteria;
  private isInitialized = false;
  private processingQueue: ColorContext[] = [];
  private isProcessing = false;
  private currentStrategy: string | null = null;
  
  // Performance tracking
  private processedCount = 0;
  private totalProcessingTime = 0;
  private lastProcessingTime = 0;

  constructor() {
    this.registry = new ColorStrategyRegistry();
    
    // Default selection criteria
    this.selectionCriteria = {
      performance: 'medium',
      quality: 'enhanced',
      deviceCapabilities: {
        hasWebGL: Boolean(window.WebGLRenderingContext),
        memoryMB: this.estimateMemoryMB(),
        isMobile: this.detectMobile()
      },
      userPreferences: {
        harmonicMode: 'catppuccin',
        intensity: 0.8,
        enableAdvancedBlending: true
      }
    };

    Y3K?.debug?.log("ColorOrchestrator", "Color orchestrator created");
  }

  /**
   * Initialize orchestrator with event bus and strategy registry
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      Y3K?.debug?.warn("ColorOrchestrator", "Already initialized");
      return;
    }

    try {
      // Subscribe to color extraction events
      GlobalEventBus.subscribe('colors/extracted', this.handleColorExtractionEvent.bind(this));
      
      // Register default strategies (ColorHarmonyEngine will register itself)
      await this.registerDefaultStrategies();
      
      this.isInitialized = true;
      
      Y3K?.debug?.log("ColorOrchestrator", "Color orchestrator initialized", {
        strategies: this.registry.getStatus().strategyCount,
        criteria: this.selectionCriteria
      });
      
    } catch (error) {
      Y3K?.debug?.error("ColorOrchestrator", "Initialization failed:", error);
      throw error;
    }
  }

  /**
   * Handle color extraction event from GlobalEventBus
   */
  private async handleColorExtractionEvent(event: any): Promise<void> {
    if (event.type !== 'colors/extracted') return;
    
    const context = event.payload as ColorContext;
    await this.handleColorExtraction(context);
  }

  /**
   * Process color extraction event using Strategy pattern
   */
  async handleColorExtraction(context: ColorContext): Promise<void> {
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
      Y3K?.debug?.error("ColorOrchestrator", "Queue processing failed:", error);
    } finally {
      this.isProcessing = false;
      this.currentStrategy = null;
    }
  }

  /**
   * Process a single color context using selected strategy
   */
  private async processColorContext(context: ColorContext): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Select appropriate strategy
      const strategy = this.selectStrategy(context);
      if (!strategy) {
        Y3K?.debug?.warn("ColorOrchestrator", "No strategy available for context", context);
        return;
      }
      
      this.currentStrategy = strategy.getStrategyName();
      
      // Check if strategy can process this context
      if (!strategy.canProcess(context)) {
        Y3K?.debug?.warn("ColorOrchestrator", `Strategy ${this.currentStrategy} cannot process context`);
        return;
      }
      
      // Process colors using selected strategy
      const result = await strategy.processColors(context);
      
      // Track performance
      const endTime = performance.now();
      this.lastProcessingTime = endTime - startTime;
      this.totalProcessingTime += this.lastProcessingTime;
      this.processedCount++;
      
      // Emit processed result
      // Note: Strategy implementations should emit 'colors/harmonized' events themselves
      // This ensures proper separation of concerns
      
      Y3K?.debug?.log("ColorOrchestrator", "Color processing completed", {
        strategy: this.currentStrategy,
        processingTime: this.lastProcessingTime,
        trackUri: context.trackUri
      });
      
    } catch (error) {
      const endTime = performance.now();
      this.lastProcessingTime = endTime - startTime;
      
      Y3K?.debug?.error("ColorOrchestrator", "Color processing failed:", {
        error: error,
        strategy: this.currentStrategy,
        trackUri: context.trackUri
      });
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
        contextualCriteria.performance = 'high';
        contextualCriteria.quality = 'basic';
      }
      
      if (context.performanceHints.enableAdvancedBlending) {
        contextualCriteria.quality = 'premium';
      }
    }
    
    // Music data influences quality requirements
    if (context.musicData) {
      // High energy music might benefit from more vibrant processing
      if (context.musicData.energy && context.musicData.energy > 0.8) {
        contextualCriteria.quality = 'premium';
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
    
    Y3K?.debug?.log("ColorOrchestrator", "Default strategies registration completed");
  }

  /**
   * Get current processing status
   */
  getStatus(): {
    isProcessing: boolean;
    currentStrategy?: string;
    queueSize: number;
  } {
    return {
      isProcessing: this.isProcessing,
      ...(this.currentStrategy ? { currentStrategy: this.currentStrategy } : {}),
      queueSize: this.processingQueue.length
    };
  }

  /**
   * Set strategy selection criteria
   */
  setSelectionCriteria(criteria: StrategySelectionCriteria): void {
    this.selectionCriteria = { ...this.selectionCriteria, ...criteria };
    
    Y3K?.debug?.log("ColorOrchestrator", "Selection criteria updated", criteria);
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
      averageProcessingTime: this.processedCount > 0 ? this.totalProcessingTime / this.processedCount : 0,
      lastProcessingTime: this.lastProcessingTime,
      totalProcessingTime: this.totalProcessingTime
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
      return (memoryInfo.jsHeapSizeLimit - memoryInfo.usedJSHeapSize) / (1024 * 1024);
    }
    
    // Fallback estimation based on device type
    return this.detectMobile() ? 256 : 1024;
  }

  /**
   * Detect if running on mobile device
   */
  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    // Unsubscribe from events
    GlobalEventBus.unsubscribe('colors/extracted', this.handleColorExtractionEvent.bind(this));
    
    // Clear processing queue
    this.processingQueue = [];
    this.isProcessing = false;
    this.isInitialized = false;
    
    Y3K?.debug?.log("ColorOrchestrator", "Color orchestrator destroyed");
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/**
 * Global singleton instance for color orchestration
 */
export const globalColorOrchestrator = new ColorOrchestrator();