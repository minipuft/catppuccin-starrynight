/**
 * Performance Budget Manager - Centralized budget tracking and optimization
 * 
 * Manages performance budgets across all Year 3000 systems and provides
 * automatic performance optimizations when budgets are exceeded.
 */

import { SimplePerformanceCoordinator } from './SimplePerformanceCoordinator';
import { UnifiedCSSVariableManager } from '@/core/css/UnifiedCSSVariableManager';

export interface PerformanceBudgetConfig {
  // System-wide budgets (in milliseconds)
  budgets: {
    animationFrame: number;
    cssVariableUpdate: number;
    domObservation: number;
    audioAnalysis: number;
    visualEffects: number;
    userInteraction: number;
  };
  
  // Auto-optimization thresholds
  autoOptimize: {
    enabled: boolean;
    violationThreshold: number; // Number of violations before optimization
    recoveryThreshold: number; // Performance score to re-enable features
  };
  
  enableDebug: boolean;
}

export class PerformanceBudgetManager {
  private static instance: PerformanceBudgetManager | null = null;
  
  private config: PerformanceBudgetConfig;
  private performanceAnalyzer: SimplePerformanceCoordinator;
  private cssVariableManager: UnifiedCSSVariableManager | null = null;
  
  // Optimization state
  private optimizationLevel: 'none' | 'conservative' | 'aggressive' = 'none';
  private disabledFeatures: Set<string> = new Set();
  
  constructor(
    config: Partial<PerformanceBudgetConfig> = {},
    performanceAnalyzer: SimplePerformanceCoordinator
  ) {
    this.config = {
      budgets: {
        animationFrame: 16.67, // 60 FPS
        cssVariableUpdate: 2,
        domObservation: 5,
        audioAnalysis: 10,
        visualEffects: 8,
        userInteraction: 100,
      },
      autoOptimize: {
        enabled: true,
        violationThreshold: 5,
        recoveryThreshold: 80,
      },
      enableDebug: false,
      ...config,
    };
    
    this.performanceAnalyzer = performanceAnalyzer;
    
    // Set up budget monitoring
    this.setupBudgetMonitoring();
  }
  
  public static getInstance(
    config?: Partial<PerformanceBudgetConfig>,
    performanceAnalyzer?: SimplePerformanceCoordinator
  ): PerformanceBudgetManager {
    if (!PerformanceBudgetManager.instance && performanceAnalyzer) {
      PerformanceBudgetManager.instance = new PerformanceBudgetManager(
        config,
        performanceAnalyzer
      );
    }
    return PerformanceBudgetManager.instance!;
  }
  
  /**
   * Register CSS Variable Batcher for optimization
   */
  public registerUnifiedCSSVariableManager(batcher: UnifiedCSSVariableManager): void {
    this.cssVariableManager = batcher;
  }
  
  /**
   * Set up automatic budget monitoring and optimization
   */
  private setupBudgetMonitoring(): void {
    if (!this.config.autoOptimize.enabled) return;
    
    // Monitor performance every 5 seconds
    setInterval(() => {
      this.checkBudgets();
    }, 5000);
  }
  
  /**
   * Check budget violations and trigger optimizations
   * Note: Tier-based system doesn't generate budget violations, 
   * so this primarily monitors health score
   */
  private checkBudgets(): void {
    const healthScore = this.performanceAnalyzer.calculateHealthScore();
    
    // No budget violations in tier-based system, but monitor health
    // Check if we can recover from optimizations based on health score
    if (healthScore >= this.config.autoOptimize.recoveryThreshold) {
      this.recoverOptimizations();
    }
  }
  
  /**
   * Optimize a specific operation that's violating budget
   */
  private optimizeOperation(operation: string): void {
    if (this.disabledFeatures.has(operation)) return;
    
    switch (operation) {
      case 'cssVariableUpdate':
        this.optimizeCSSVariableUpdates();
        break;
      case 'domObservation':
        this.optimizeDOMObservation();
        break;
      case 'visualEffects':
        this.optimizeVisualEffects();
        break;
      case 'audioAnalysis':
        this.optimizeAudioAnalysis();
        break;
    }
    
    this.disabledFeatures.add(operation);
    
    if (this.config.enableDebug) {
      console.log(`🎯 [PerformanceBudgetManager] Optimized ${operation} due to budget violations`);
    }
  }
  
  /**
   * Optimize CSS variable updates
   */
  private optimizeCSSVariableUpdates(): void {
    if (!this.cssVariableManager) return;
    
    // Increase batch interval to reduce update frequency
    this.cssVariableManager.updateConfig({
      batchIntervalMs: 32, // Reduce to 30 FPS
      maxBatchSize: 25,    // Smaller batches
    });
  }
  
  /**
   * Optimize DOM observation
   */
  private optimizeDOMObservation(): void {
    // Emit event for DOM observers to reduce frequency
    document.dispatchEvent(new CustomEvent('year3000:optimize-dom-observation', {
      detail: { level: this.optimizationLevel }
    }));
  }
  
  /**
   * Optimize visual effects
   */
  private optimizeVisualEffects(): void {
    // Emit event for visual systems to reduce quality
    document.dispatchEvent(new CustomEvent('year3000:optimize-visual-effects', {
      detail: { level: this.optimizationLevel }
    }));
  }
  
  /**
   * Optimize audio analysis
   */
  private optimizeAudioAnalysis(): void {
    // Emit event for audio systems to reduce analysis frequency
    document.dispatchEvent(new CustomEvent('year3000:optimize-audio-analysis', {
      detail: { level: this.optimizationLevel }
    }));
  }
  
  /**
   * Escalate optimization level
   */
  private escalateOptimization(): void {
    if (this.optimizationLevel === 'none') {
      this.optimizationLevel = 'conservative';
    } else if (this.optimizationLevel === 'conservative') {
      this.optimizationLevel = 'aggressive';
    }
    
    if (this.config.enableDebug) {
      console.log(`🎯 [PerformanceBudgetManager] Escalated to ${this.optimizationLevel} optimization`);
    }
  }
  
  /**
   * Recover from optimizations when performance improves
   */
  private recoverOptimizations(): void {
    if (this.optimizationLevel === 'none') return;
    
    // Gradually recover features
    this.disabledFeatures.clear();
    
    // Reset CSS variable batcher to normal settings
    if (this.cssVariableManager) {
      this.cssVariableManager.updateConfig({
        batchIntervalMs: 16,
        maxBatchSize: 50,
      });
    }
    
    // Emit recovery events
    document.dispatchEvent(new CustomEvent('year3000:recover-optimizations', {
      detail: { previousLevel: this.optimizationLevel }
    }));
    
    this.optimizationLevel = 'none';
    
    if (this.config.enableDebug) {
      console.log('🎯 [PerformanceBudgetManager] Recovered from optimizations');
    }
  }
  
  /**
   * Get current optimization status
   */
  public getOptimizationStatus(): {
    level: string;
    disabledFeatures: string[];
    budgetViolations: string[];
    healthScore: number;
  } {
    return {
      level: this.optimizationLevel,
      disabledFeatures: Array.from(this.disabledFeatures),
      budgetViolations: [], // Tier-based system doesn't generate budget violations
      healthScore: this.performanceAnalyzer.calculateHealthScore(),
    };
  }
  
  /**
   * Manually trigger optimization for testing
   */
  public manualOptimize(operation: string): void {
    this.optimizeOperation(operation);
  }
  
  /**
   * Manually recover from optimizations
   */
  public manualRecover(): void {
    this.recoverOptimizations();
  }
  
  /**
   * Update performance budgets
   */
  public updateBudgets(budgets: Partial<PerformanceBudgetConfig['budgets']>): void {
    this.config.budgets = { ...this.config.budgets, ...budgets };
    
    // Update performance analyzer budgets
    for (const [operation, budget] of Object.entries(budgets)) {
      this.performanceAnalyzer.updateBudget(operation, budget);
    }
  }
  
  /**
   * Destroy and cleanup
   */
  public destroy(): void {
    this.disabledFeatures.clear();
    this.cssVariableManager = null;
    PerformanceBudgetManager.instance = null;
  }
}