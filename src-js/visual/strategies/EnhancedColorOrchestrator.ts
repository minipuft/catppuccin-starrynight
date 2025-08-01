/**
 * EnhancedColorOrchestrator - Lightweight Color Processing Coordinator
 * 
 * Coordinates color processing through registered strategies with the unified event system.
 * Provides a bridge between the OKLAB integration and existing visual strategy systems.
 * 
 * Philosophy: "Orchestrating color consciousness through strategic coordination - 
 * unifying musical OKLAB processing with visual strategy execution."
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import { SettingsManager } from '@/ui/managers/SettingsManager';
import { PerformanceAnalyzer } from '@/core/performance/PerformanceAnalyzer';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import type { 
  ColorContext, 
  ColorResult, 
  IColorOrchestrator, 
  StrategySelectionCriteria 
} from '@/types/colorStrategy';
import { BackgroundStrategyRegistry } from './BackgroundStrategyRegistry';
import { BackgroundStrategySelector } from './BackgroundStrategySelector';

interface OrchestratorStatus {
  isProcessing: boolean;
  currentStrategy?: string;
  queueSize: number;
}

export class EnhancedColorOrchestrator implements IColorOrchestrator {
  private settingsManager: SettingsManager;
  private performanceAnalyzer: PerformanceAnalyzer;
  private strategyRegistry: BackgroundStrategyRegistry;
  private strategySelector: BackgroundStrategySelector;
  
  private status: OrchestratorStatus = {
    isProcessing: false,
    queueSize: 0
  };
  
  private processingQueue: ColorContext[] = [];
  private selectionCriteria: StrategySelectionCriteria;

  constructor(settingsManager?: SettingsManager, performanceAnalyzer?: PerformanceAnalyzer) {
    this.settingsManager = settingsManager || new SettingsManager();
    this.performanceAnalyzer = performanceAnalyzer || new PerformanceAnalyzer();
    this.strategyRegistry = new BackgroundStrategyRegistry(this.settingsManager);
    this.strategySelector = new BackgroundStrategySelector(this.settingsManager);
    
    // Default selection criteria
    this.selectionCriteria = {
      performance: 'medium',
      quality: 'enhanced',
      deviceCapabilities: {
        hasWebGL: true,
        memoryMB: 4096,
        isMobile: false
      },
      userPreferences: {
        harmonicMode: 'cosmic',
        intensity: 0.8,
        enableAdvancedBlending: true
      }
    };
  }

  /**
   * Initialize orchestrator with event bus and strategy registry
   */
  async initialize(): Promise<void> {
    try {
      // Initialize components (PerformanceAnalyzer doesn't have initialize method)
      // this.performanceAnalyzer is ready to use after construction
      
      Y3K?.debug?.log('EnhancedColorOrchestrator', 'Color orchestrator initialized');
    } catch (error) {
      Y3K?.debug?.error('EnhancedColorOrchestrator', 'Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Process color extraction event
   */
  async handleColorExtraction(context: ColorContext): Promise<void> {
    // Add to processing queue
    this.processingQueue.push(context);
    this.status.queueSize = this.processingQueue.length;
    
    // Process if not already processing
    if (!this.status.isProcessing) {
      await this.processQueue();
    }
  }

  /**
   * Process the color processing queue
   */
  private async processQueue(): Promise<void> {
    if (this.status.isProcessing || this.processingQueue.length === 0) {
      return;
    }
    
    this.status.isProcessing = true;
    
    try {
      while (this.processingQueue.length > 0) {
        const context = this.processingQueue.shift()!;
        this.status.queueSize = this.processingQueue.length;
        
        await this.processColorContext(context);
      }
    } catch (error) {
      Y3K?.debug?.error('EnhancedColorOrchestrator', 'Queue processing failed:', error);
    } finally {
      this.status.isProcessing = false;
      delete this.status.currentStrategy;
      this.status.queueSize = 0;
    }
  }

  /**
   * Process individual color context
   */
  private async processColorContext(context: ColorContext): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Select optimal strategy
      const strategy = this.strategyRegistry.selectStrategy(this.selectionCriteria);
      
      if (!strategy) {
        Y3K?.debug?.warn('EnhancedColorOrchestrator', 'No suitable strategy found, using fallback processing');
        await this.applyFallbackProcessing(context);
        return;
      }
      
      this.status.currentStrategy = strategy.getStrategyName();
      
      // Process colors through selected strategy
      const result = await strategy.processColors(context);
      
      const processingTime = performance.now() - startTime;
      
      // Emit harmonized event
      unifiedEventBus.emitSync('colors:harmonized', {
        processedColors: result.processedColors,
        accentHex: result.accentHex,
        accentRgb: result.accentRgb,
        strategies: [strategy.getStrategyName()],
        processingTime,
        trackUri: context.trackUri
      });
      
      Y3K?.debug?.log('EnhancedColorOrchestrator', 'Color processing completed', {
        strategy: strategy.getStrategyName(),
        processingTime: `${processingTime.toFixed(2)}ms`,
        trackUri: context.trackUri
      });
      
    } catch (error) {
      Y3K?.debug?.error('EnhancedColorOrchestrator', 'Color processing failed:', error);
      await this.applyFallbackProcessing(context);
    }
  }

  /**
   * Apply fallback color processing when strategies fail
   */
  private async applyFallbackProcessing(context: ColorContext): Promise<void> {
    const fallbackColors = {
      primary: '#cba6f7', // Catppuccin mauve
      secondary: '#f5c2e7', // Catppuccin pink
      accent: '#cba6f7'
    };
    
    unifiedEventBus.emitSync('colors:harmonized', {
      processedColors: { ...context.rawColors, ...fallbackColors },
      accentHex: fallbackColors.accent,
      accentRgb: '203,166,247',
      strategies: ['fallback'],
      processingTime: 0,
      trackUri: context.trackUri
    });
  }

  /**
   * Get current processing status
   */
  getStatus(): OrchestratorStatus {
    return { ...this.status };
  }

  /**
   * Set strategy selection criteria
   */
  setSelectionCriteria(criteria: StrategySelectionCriteria): void {
    this.selectionCriteria = { ...criteria };
    Y3K?.debug?.log('EnhancedColorOrchestrator', 'Selection criteria updated', criteria);
  }

  /**
   * Get strategy registry for external access
   */
  getStrategyRegistry(): BackgroundStrategyRegistry {
    return this.strategyRegistry;
  }

  /**
   * Destroy orchestrator and clean up resources
   */
  destroy(): void {
    this.processingQueue = [];
    this.status.isProcessing = false;
    this.status.queueSize = 0;
    delete this.status.currentStrategy;
    
    Y3K?.debug?.log('EnhancedColorOrchestrator', 'Color orchestrator destroyed');
  }
}