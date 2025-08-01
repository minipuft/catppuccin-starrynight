/**
 * Performance Budget Manager - Centralized budget tracking and optimization
 * 
 * Manages performance budgets across all Year 3000 systems and provides
 * automatic performance optimizations when budgets are exceeded.
 */

import { PerformanceAnalyzer } from './PerformanceAnalyzer';
import { UnifiedCSSConsciousnessController } from '@/core/css/UnifiedCSSConsciousnessController';

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
  private performanceAnalyzer: PerformanceAnalyzer;
  private cssConsciousnessController: UnifiedCSSConsciousnessController | null = null;
  
  // Optimization state
  private optimizationLevel: 'none' | 'conservative' | 'aggressive' = 'none';
  private disabledFeatures: Set<string> = new Set();
  
  constructor(
    config: Partial<PerformanceBudgetConfig> = {},
    performanceAnalyzer: PerformanceAnalyzer
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
    performanceAnalyzer?: PerformanceAnalyzer
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
  public registerUnifiedCSSConsciousnessController(batcher: UnifiedCSSConsciousnessController): void {
    this.cssConsciousnessController = batcher;
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
   */
  private checkBudgets(): void {
    const violations = this.performanceAnalyzer.getBudgetViolations();
    const healthScore = this.performanceAnalyzer.calculateHealthScore();
    
    let totalViolations = 0;
    for (const [operation, count] of violations) {
      totalViolations += count;
      
      if (count >= this.config.autoOptimize.violationThreshold) {
        this.optimizeOperation(operation);
      }
    }
    
    // Check if we need to escalate optimization level
    if (totalViolations >= this.config.autoOptimize.violationThreshold * 2) {
      this.escalateOptimization();
    }
    
    // Check if we can recover from optimizations
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
    if (!this.cssConsciousnessController) return;
    
    // Increase batch interval to reduce update frequency
    this.cssConsciousnessController.updateConfig({
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
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.updateConfig({
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
    budgetViolations: Map<string, number>;
    healthScore: number;
  } {
    return {
      level: this.optimizationLevel,
      disabledFeatures: Array.from(this.disabledFeatures),
      budgetViolations: this.performanceAnalyzer.getBudgetViolations(),
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
    this.cssConsciousnessController = null;
    PerformanceBudgetManager.instance = null;
  }
}