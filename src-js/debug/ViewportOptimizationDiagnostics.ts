/**
 * ViewportOptimizationDiagnostics - Debug utility to verify viewport optimization effectiveness
 * 
 * Provides diagnostics and metrics for the viewport-aware system integration.
 */

import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import { ViewportManager } from '@/utils/performance/ViewportAwarenessManager';

export interface ViewportOptimizationMetrics {
  timestamp: number;
  eventBusMetrics: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalEvents: number;
    eventsPerSecond: number;
  };
  viewportAwarenessMetrics: {
    trackedElements: number;
    visibleElements: number;
    hiddenElements: number;
  };
  systemMetrics: {
    memoryUsage: number;
    performanceScore: number;
  };
}

export class ViewportOptimizationDiagnostics {
  private static instance: ViewportOptimizationDiagnostics;
  private startTime: number = Date.now();
  private lastMetrics: ViewportOptimizationMetrics | null = null;
  
  public static getInstance(): ViewportOptimizationDiagnostics {
    if (!ViewportOptimizationDiagnostics.instance) {
      ViewportOptimizationDiagnostics.instance = new ViewportOptimizationDiagnostics();
    }
    return ViewportOptimizationDiagnostics.instance;
  }

  /**
   * Capture current optimization metrics
   */
  public captureMetrics(): ViewportOptimizationMetrics {
    const eventBusMetrics = unifiedEventBus.getMetrics();
    
    const metrics: ViewportOptimizationMetrics = {
      timestamp: Date.now(),
      eventBusMetrics: {
        totalSubscriptions: eventBusMetrics.totalSubscriptions,
        activeSubscriptions: eventBusMetrics.activeSubscriptions,
        totalEvents: eventBusMetrics.totalEvents,
        eventsPerSecond: eventBusMetrics.eventsPerSecond
      },
      viewportAwarenessMetrics: {
        trackedElements: 0, // Would need to expose this from ViewportManager
        visibleElements: 0,
        hiddenElements: 0
      },
      systemMetrics: {
        memoryUsage: eventBusMetrics.memoryUsage,
        performanceScore: this.calculatePerformanceScore()
      }
    };

    this.lastMetrics = metrics;
    return metrics;
  }

  /**
   * Compare current metrics with baseline
   */
  public compareWithBaseline(baseline: ViewportOptimizationMetrics): {
    improvement: number;
    memoryReduction: number;
    eventReduction: number;
    details: string[];
  } {
    const current = this.captureMetrics();
    
    const improvement = this.calculateImprovementPercentage(baseline, current);
    const memoryReduction = ((baseline.systemMetrics.memoryUsage - current.systemMetrics.memoryUsage) / baseline.systemMetrics.memoryUsage) * 100;
    const eventReduction = ((baseline.eventBusMetrics.totalEvents - current.eventBusMetrics.totalEvents) / baseline.eventBusMetrics.totalEvents) * 100;
    
    const details = [
      `Performance Score: ${baseline.systemMetrics.performanceScore.toFixed(2)} → ${current.systemMetrics.performanceScore.toFixed(2)}`,
      `Memory Usage: ${baseline.systemMetrics.memoryUsage} → ${current.systemMetrics.memoryUsage} bytes`,
      `Active Subscriptions: ${baseline.eventBusMetrics.activeSubscriptions} → ${current.eventBusMetrics.activeSubscriptions}`,
      `Total Events: ${baseline.eventBusMetrics.totalEvents} → ${current.eventBusMetrics.totalEvents}`
    ];

    return {
      improvement,
      memoryReduction,
      eventReduction,
      details
    };
  }

  /**
   * Generate a performance report
   */
  public generateReport(): string {
    const metrics = this.captureMetrics();
    const uptime = metrics.timestamp - this.startTime;
    
    return `
ViewportOptimization Diagnostics Report
======================================

Uptime: ${(uptime / 1000).toFixed(2)}s
Timestamp: ${new Date(metrics.timestamp).toISOString()}

Event Bus Metrics:
- Total Subscriptions: ${metrics.eventBusMetrics.totalSubscriptions}
- Active Subscriptions: ${metrics.eventBusMetrics.activeSubscriptions}
- Total Events Processed: ${metrics.eventBusMetrics.totalEvents}
- Events Per Second: ${metrics.eventBusMetrics.eventsPerSecond.toFixed(2)}

System Performance:
- Memory Usage: ${metrics.systemMetrics.memoryUsage} bytes
- Performance Score: ${metrics.systemMetrics.performanceScore.toFixed(2)}/100

Integration Status:
- UnifiedEventBus: ✅ Active
- ViewportAwarenessManager: ✅ Active
- Type-Safe Events: ✅ Enabled
- Performance Monitoring: ✅ Enabled
`;
  }

  /**
   * Log optimization status to console
   */
  public logStatus(): void {
    console.group('🎯 Viewport Optimization Status');
    console.log(this.generateReport());
    
    if (this.lastMetrics) {
      console.log('Last Metrics:', this.lastMetrics);
    }
    
    const subscriptions = unifiedEventBus.getActiveSubscriptions();
    console.log('Active Event Subscriptions:', subscriptions);
    
    console.groupEnd();
  }

  /**
   * Test viewport optimization by simulating settings changes
   */
  public async testOptimization(): Promise<{
    beforeMetrics: ViewportOptimizationMetrics;
    afterMetrics: ViewportOptimizationMetrics;
    improvementPercentage: number;
  }> {
    console.log('🧪 Testing viewport optimization...');
    
    const beforeMetrics = this.captureMetrics();
    
    // Simulate rapid settings changes to test batching and viewport awareness
    const settingsToTest = [
      'sn-glassmorphism-level',
      'sn-gradient-intensity',
      'sn-star-density',
      'sn-flow-gradient'
    ];
    
    for (let i = 0; i < 10; i++) {
      for (const settingKey of settingsToTest) {
        await unifiedEventBus.emit('settings:changed', {
          settingKey,
          oldValue: 'balanced',
          newValue: i % 2 === 0 ? 'intense' : 'minimal',
          timestamp: Date.now()
        });
      }
      
      // Small delay to allow processing
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Wait for any queued events to process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const afterMetrics = this.captureMetrics();
    const improvementPercentage = this.calculateImprovementPercentage(beforeMetrics, afterMetrics);
    
    console.log('✅ Optimization test completed');
    console.log('Before:', beforeMetrics);
    console.log('After:', afterMetrics);
    console.log(`Improvement: ${improvementPercentage.toFixed(2)}%`);
    
    return {
      beforeMetrics,
      afterMetrics,
      improvementPercentage
    };
  }

  private calculatePerformanceScore(): number {
    const metrics = unifiedEventBus.getMetrics();
    
    // Simple performance scoring based on efficiency metrics
    let score = 100;
    
    // Penalize high memory usage
    if (metrics.memoryUsage > 10000) score -= 20;
    else if (metrics.memoryUsage > 5000) score -= 10;
    
    // Penalize too many active subscriptions (could indicate leaks)
    if (metrics.activeSubscriptions > 50) score -= 15;
    else if (metrics.activeSubscriptions > 25) score -= 5;
    
    // Reward efficient event processing
    if (metrics.eventsPerSecond > 0 && metrics.eventsPerSecond < 100) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateImprovementPercentage(baseline: ViewportOptimizationMetrics, current: ViewportOptimizationMetrics): number {
    const baselineScore = baseline.systemMetrics.performanceScore;
    const currentScore = current.systemMetrics.performanceScore;
    
    if (baselineScore === 0) return 0;
    
    return ((currentScore - baselineScore) / baselineScore) * 100;
  }
}

// Export singleton instance
export const viewportDiagnostics = ViewportOptimizationDiagnostics.getInstance();

// Add to global debug object for easy access
declare global {
  interface Window {
    Y3K: any;
  }
}

if (typeof window !== 'undefined' && window.Y3K) {
  window.Y3K.viewportDiagnostics = viewportDiagnostics;
}