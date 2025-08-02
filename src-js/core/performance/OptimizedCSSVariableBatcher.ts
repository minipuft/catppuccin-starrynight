/**
 * OptimizedUnifiedCSSConsciousnessController - Enhanced CSS Variable Batching with Performance Budgets
 * 
 * Extends the base UnifiedCSSConsciousnessController with advanced performance optimizations:
 * - Automatic performance budget monitoring
 * - Intelligent batching strategy selection
 * - Adaptive throttling based on system performance
 * - Priority-based variable processing
 */

import { UnifiedCSSConsciousnessController } from '../css/UnifiedCSSConsciousnessController';
import { UnifiedPerformanceCoordinator } from './UnifiedPerformanceCoordinator';
import type { Year3000Config } from '@/types/models';
import { PerformanceAnalyzer } from './PerformanceAnalyzer';
import { PerformanceBudgetManager } from './PerformanceBudgetManager';

export interface OptimizedBatcherConfig {
  // Base configuration
  batchIntervalMs: number;
  maxBatchSize: number;
  enableDebug: boolean;
  
  // Performance optimization configuration
  enableAdaptiveThrottling: boolean;
  performanceAnalyzer?: PerformanceAnalyzer;
  budgetManager?: PerformanceBudgetManager;
  
  // Variable priority system
  priorityMappings: {
    critical: string[];    // Applied immediately
    high: string[];        // High priority batch
    normal: string[];      // Normal priority batch
    low: string[];         // Low priority batch
  };
  
  // Adaptive thresholds
  thresholds: {
    excellentFPS: number;  // Above this: use faster batching
    goodFPS: number;       // Above this: use normal batching
    poorFPS: number;       // Below this: use slower batching
  };
}

export class OptimizedUnifiedCSSConsciousnessController extends UnifiedCSSConsciousnessController {
  private optimizedConfig: OptimizedBatcherConfig;
  private performanceAnalyzer?: PerformanceAnalyzer;
  private budgetManager?: PerformanceBudgetManager;
  
  // Performance tracking
  private lastFPSCheck: number = 0;
  private currentPerformanceLevel: 'excellent' | 'good' | 'poor' = 'good';
  private adaptiveThrottleLevel: number = 1;
  
  // Priority queues
  private priorityQueues: Map<string, Map<string, { property: string; value: string; timestamp: number }>> = new Map();
  
  constructor(
    year3000Config: Year3000Config,
    performanceCoordinator: UnifiedPerformanceCoordinator,
    optimizedConfig: Partial<OptimizedBatcherConfig> = {}
  ) {
    // Call parent constructor with required dependencies
    super(year3000Config, performanceCoordinator);
    
    // Extended configuration for optimization
    this.optimizedConfig = {
      batchIntervalMs: 16,
      maxBatchSize: 50,
      enableDebug: year3000Config.enableDebug,
      enableAdaptiveThrottling: true,
      priorityMappings: {
        critical: ['--sn-rs-glow-alpha', '--sn-rs-beat-intensity', '--sn-rs-hue-shift'],
        high: ['--sn-gradient-primary', '--sn-gradient-secondary', '--sn-gradient-accent'],
        normal: ['--sn-gradient-', '--sn-rs-'],
        low: ['--sn-debug-', '--sn-dev-']
      },
      thresholds: {
        excellentFPS: 55,  // 55+ FPS = excellent
        goodFPS: 45,       // 45+ FPS = good
        poorFPS: 30        // <30 FPS = poor
      },
      ...optimizedConfig,
    };
    
    // Handle exactOptionalPropertyTypes by conditional assignment
    if (optimizedConfig.performanceAnalyzer) {
      this.performanceAnalyzer = optimizedConfig.performanceAnalyzer;
    }
    if (optimizedConfig.budgetManager) {
      this.budgetManager = optimizedConfig.budgetManager;
    }
    
    // Initialize priority queues
    this.initializePriorityQueues();
    
    // Start adaptive monitoring if enabled
    if (this.optimizedConfig.enableAdaptiveThrottling) {
      this.startAdaptiveMonitoring();
    }
  }
  
  /**
   * Initialize priority queues for different variable types
   */
  private initializePriorityQueues(): void {
    this.priorityQueues.set('critical', new Map());
    this.priorityQueues.set('high', new Map());
    this.priorityQueues.set('normal', new Map());
    this.priorityQueues.set('low', new Map());
  }
  
  /**
   * Start adaptive performance monitoring
   */
  private startAdaptiveMonitoring(): void {
    setInterval(() => {
      this.updatePerformanceLevel();
      this.adjustBatchingStrategy();
    }, 1000); // Check every second
  }
  
  /**
   * Update current performance level based on FPS
   */
  private updatePerformanceLevel(): void {
    if (!this.performanceAnalyzer) return;
    
    const currentFPS = this.performanceAnalyzer.getMedianFPS(3);
    const { excellentFPS, goodFPS, poorFPS } = this.optimizedConfig.thresholds;
    
    const previousLevel = this.currentPerformanceLevel;
    
    if (currentFPS >= excellentFPS) {
      this.currentPerformanceLevel = 'excellent';
    } else if (currentFPS >= goodFPS) {
      this.currentPerformanceLevel = 'good';
    } else if (currentFPS < poorFPS) {
      this.currentPerformanceLevel = 'poor';
    }
    
    // Log performance level changes
    if (previousLevel !== this.currentPerformanceLevel && this.optimizedConfig.enableDebug) {
      console.log(`🎨 [OptimizedUnifiedCSSConsciousnessController] Performance level changed: ${previousLevel} → ${this.currentPerformanceLevel} (${currentFPS} FPS)`);
    }
  }
  
  /**
   * Adjust batching strategy based on performance level
   */
  private adjustBatchingStrategy(): void {
    let newBatchInterval: number;
    let newMaxBatchSize: number;
    
    switch (this.currentPerformanceLevel) {
      case 'excellent':
        newBatchInterval = Math.max(8, this.optimizedConfig.batchIntervalMs / 2);
        newMaxBatchSize = Math.min(100, this.optimizedConfig.maxBatchSize * 2);
        this.adaptiveThrottleLevel = 0.5; // Less throttling
        break;
      case 'good':
        newBatchInterval = this.optimizedConfig.batchIntervalMs;
        newMaxBatchSize = this.optimizedConfig.maxBatchSize;
        this.adaptiveThrottleLevel = 1; // Normal throttling
        break;
      case 'poor':
        newBatchInterval = this.optimizedConfig.batchIntervalMs * 2;
        newMaxBatchSize = Math.max(10, this.optimizedConfig.maxBatchSize / 2);
        this.adaptiveThrottleLevel = 2; // More throttling
        break;
    }
    
    // Update configuration
    this.updateConfig({
      batchIntervalMs: newBatchInterval,
      maxBatchSize: newMaxBatchSize,
    });
  }
  
  /**
   * Enhanced queueCSSVariableUpdate with priority handling
   */
  public override queueCSSVariableUpdate(
    property: string,
    value: string,
    element: HTMLElement = document.documentElement
  ): void {
    // Determine priority level
    const priority = this.determineVariablePriority(property);
    
    // Handle critical variables immediately
    if (priority === 'critical') {
      this.applyCriticalUpdate(property, value, element);
      return;
    }
    
    // Queue non-critical variables by priority
    const priorityQueue = this.priorityQueues.get(priority);
    if (priorityQueue) {
      const key = `${property}:${element.tagName || 'ROOT'}`;
      priorityQueue.set(key, {
        property,
        value,
        timestamp: performance.now()
      });
    }
    
    // Schedule priority-based flush
    this.scheduleOptimizedFlush(priority);
  }
  
  /**
   * Determine variable priority based on configured mappings
   */
  private determineVariablePriority(property: string): string {
    const { priorityMappings } = this.optimizedConfig;
    
    // Check exact matches first
    for (const [priority, variables] of Object.entries(priorityMappings)) {
      if (variables.includes(property)) {
        return priority;
      }
    }
    
    // Check prefix matches
    for (const [priority, variables] of Object.entries(priorityMappings)) {
      for (const variable of variables) {
        if (property.startsWith(variable)) {
          return priority;
        }
      }
    }
    
    return 'normal'; // Default priority
  }
  
  /**
   * Apply critical updates immediately
   */
  private applyCriticalUpdate(property: string, value: string, element: HTMLElement): void {
    try {
      if (this.performanceAnalyzer) {
        this.performanceAnalyzer.timeOperation('cssVariableUpdate', () => {
          element.style.setProperty(property, value);
        });
      } else {
        element.style.setProperty(property, value);
      }
    } catch (error) {
      console.error(`🎨 [OptimizedUnifiedCSSConsciousnessController] Critical update failed for ${property}:`, error);
    }
  }
  
  /**
   * Schedule optimized flush based on priority
   */
  private scheduleOptimizedFlush(priority: string): void {
    const delay = this.getFlushDelay(priority);
    
    // Use base class scheduling for now, but with adaptive delay
    setTimeout(() => {
      this.flushPriorityQueue(priority);
    }, delay);
  }
  
  /**
   * Get flush delay based on priority and performance level
   */
  private getFlushDelay(priority: string): number {
    const baseDelay = this.optimizedConfig.batchIntervalMs;
    const adaptiveMultiplier = this.adaptiveThrottleLevel;
    
    switch (priority) {
      case 'critical':
        return 0; // Immediate
      case 'high':
        return Math.max(4, baseDelay * 0.5 * adaptiveMultiplier);
      case 'normal':
        return baseDelay * adaptiveMultiplier;
      case 'low':
        return baseDelay * 2 * adaptiveMultiplier;
      default:
        return baseDelay * adaptiveMultiplier;
    }
  }
  
  /**
   * Flush a specific priority queue
   */
  private flushPriorityQueue(priority: string): void {
    const queue = this.priorityQueues.get(priority);
    if (!queue || queue.size === 0) return;
    
    const updates = Array.from(queue.values());
    queue.clear();
    
    // Process updates in batch
    for (const update of updates) {
      super.queueCSSVariableUpdate(update.property, update.value, null, 'normal', update.timestamp.toString());
    }
  }
  
  /**
   * Get optimization metrics
   */
  public getOptimizationMetrics(): {
    performanceLevel: string;
    adaptiveThrottleLevel: number;
    queueSizes: Record<string, number>;
    budgetViolations?: Map<string, number>;
  } {
    const queueSizes: Record<string, number> = {};
    for (const [priority, queue] of this.priorityQueues) {
      queueSizes[priority] = queue.size;
    }
    
    const result: any = {
      performanceLevel: this.currentPerformanceLevel,
      adaptiveThrottleLevel: this.adaptiveThrottleLevel,
      queueSizes,
    };
    
    const budgetViolations = this.performanceAnalyzer?.getBudgetViolations();
    if (budgetViolations) {
      result.budgetViolations = budgetViolations;
    }
    
    return result;
  }
  
  /**
   * Force flush all priority queues
   */
  public flushAllQueues(): void {
    for (const priority of ['critical', 'high', 'normal', 'low']) {
      this.flushPriorityQueue(priority);
    }
    
    // Also flush the base batcher
    this.flushUpdates();
  }
  
  /**
   * Update priority mappings
   */
  public updatePriorityMappings(mappings: Partial<OptimizedBatcherConfig['priorityMappings']>): void {
    this.optimizedConfig.priorityMappings = {
      ...this.optimizedConfig.priorityMappings,
      ...mappings,
    };
  }
  
  /**
   * Cleanup and destroy
   */
  public override destroy(): void {
    // Clear all priority queues
    for (const queue of this.priorityQueues.values()) {
      queue.clear();
    }
    this.priorityQueues.clear();
    
    // Call parent destroy
    super.destroy();
  }
}