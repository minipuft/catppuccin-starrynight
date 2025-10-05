/**
 * EventSystemMonitor - Event System Health Monitoring & Performance Analysis
 *
 * Monitors the unified event system in real-time, providing comprehensive
 * diagnostics, performance metrics, health checks, and debugging tools for
 * the event-driven architecture.
 *
 */

import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import { colorEventOrchestrator } from "./ColorEventRouter";
import { EventName, unifiedEventBus } from "./UnifiedEventBus";

interface EventFlowMetrics {
  eventName: EventName;
  totalEmissions: number;
  totalSubscriptions: number;
  averageProcessingTime: number;
  lastEmissionTime: number;
  peakEmissionsPerSecond: number;
  errorCount: number;
  healthScore: number; // 0-100
}

interface SystemHealth {
  systemName: string;
  isResponding: boolean;
  averageResponseTime: number;
  errorRate: number;
  lastHealthCheck: number;
  subscriptionCount: number;
  memoryUsage: number;
  status: "healthy" | "warning" | "critical" | "offline";
}

interface EventFlowDiagnostics {
  totalEvents: number;
  eventsPerSecond: number;
  averageLatency: number;
  systemLoad: number;
  memoryUsage: number;
  healthySystems: number;
  totalSystems: number;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
}

interface EventTrace {
  eventName: EventName;
  timestamp: number;
  source: string;
  data: any;
  processingTime: number;
  subscribers: string[];
  errors?: string[];
}

export class EventSystemMonitor {
  private static instance: EventSystemMonitor | null = null;

  // Monitoring data
  private eventMetrics = new Map<EventName, EventFlowMetrics>();
  private systemHealth = new Map<string, SystemHealth>();
  private eventTraces: EventTrace[] = [];
  private maxTraceHistory = 1000;

  // Performance monitoring
  private monitoringActive = false;
  private monitoringInterval: number | null = null;
  private healthCheckInterval: number | null = null;

  // Diagnostic thresholds
  private readonly THRESHOLDS = {
    maxProcessingTime: 100, // ms
    maxEventsPerSecond: 50,
    maxErrorRate: 0.05, // 5%
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
    maxSystemLoad: 0.8, // 80%
  };

  // Event interceptors for tracing
  private originalEmit: any;
  private originalSubscribe: any;

  private constructor() {
    this.setupEventInterceptors();
    Y3KDebug?.debug?.log(
      "EventSystemMonitor",
      "Event system monitoring initialized"
    );
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): EventSystemMonitor {
    if (!EventSystemMonitor.instance) {
      EventSystemMonitor.instance = new EventSystemMonitor();
    }
    return EventSystemMonitor.instance;
  }

  /**
   * Start comprehensive monitoring
   */
  public startMonitoring(): void {
    if (this.monitoringActive) return;

    this.monitoringActive = true;

    // Start metrics collection
    this.monitoringInterval = window.setInterval(() => {
      this.collectMetrics();
    }, 1000); // Every second

    // Start health checks
    this.healthCheckInterval = window.setInterval(() => {
      this.performHealthChecks();
    }, 5000); // Every 5 seconds

    Y3KDebug?.debug?.log("EventSystemMonitor", "Event monitoring started");
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    if (!this.monitoringActive) return;

    this.monitoringActive = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    Y3KDebug?.debug?.log("EventSystemMonitor", "Event monitoring stopped");
  }

  /**
   * Setup event interceptors for detailed tracing
   */
  private setupEventInterceptors(): void {
    // Intercept emit calls
    this.originalEmit = unifiedEventBus.emit.bind(unifiedEventBus);
    (unifiedEventBus as any).emit = async (eventName: EventName, data: any) => {
      const startTime = performance.now();
      const trace: EventTrace = {
        eventName,
        timestamp: Date.now(),
        source: this.getEventSource(),
        data: this.sanitizeEventData(data),
        processingTime: 0,
        subscribers: [],
      };

      try {
        // Get current subscribers
        const subscriptions = unifiedEventBus.getActiveSubscriptions();
        trace.subscribers = subscriptions
          .filter((sub) => sub.eventName === eventName)
          .map((sub) => sub.subscriberName);

        // Call original emit
        await this.originalEmit(eventName, data);

        trace.processingTime = performance.now() - startTime;

        // Update metrics
        this.updateEventMetrics(eventName, trace.processingTime);
      } catch (error) {
        trace.errors = [
          error instanceof Error ? error.message : "Unknown error",
        ];
        trace.processingTime = performance.now() - startTime;

        // Update error metrics
        this.updateEventMetrics(eventName, trace.processingTime, true);
      }

      // Store trace
      this.addEventTrace(trace);
    };

    // Intercept subscribe calls
    this.originalSubscribe = unifiedEventBus.subscribe.bind(unifiedEventBus);
    (unifiedEventBus as any).subscribe = (
      eventName: EventName,
      handler: any,
      subscriberName: string,
      options?: any
    ) => {
      const subscriptionId = this.originalSubscribe(
        eventName,
        handler,
        subscriberName,
        options
      );

      // Update system health tracking
      this.updateSystemSubscriptions(subscriberName);

      return subscriptionId;
    };
  }

  /**
   * Collect real-time metrics
   */
  private collectMetrics(): void {
    try {
      // Get unified event bus metrics
      const busMetrics = unifiedEventBus.getMetrics();

      // Get color orchestrator metrics
      const colorMetrics = colorEventOrchestrator.getMetrics();

      // Update system load calculation based on all metrics
      this.calculateSystemLoad(busMetrics, colorMetrics);
    } catch (error) {
      Y3KDebug?.debug?.error(
        "EventSystemMonitor",
        "Error collecting metrics:",
        error
      );
    }
  }

  /**
   * Perform health checks on all systems
   */
  private async performHealthChecks(): Promise<void> {
    try {
      // Check unified event bus health
      await this.checkEventBusHealth();

      // Check color orchestrator health
      await this.checkColorOrchestratorHealth();

      // Migration manager was removed - no longer needed

      // Analyze overall system health
      this.analyzeSystemHealth();
    } catch (error) {
      Y3KDebug?.debug?.error(
        "EventSystemMonitor",
        "Error performing health checks:",
        error
      );
    }
  }

  /**
   * Check event bus health
   */
  private async checkEventBusHealth(): Promise<void> {
    const startTime = performance.now();

    try {
      const metrics = unifiedEventBus.getMetrics();
      const responseTime = performance.now() - startTime;

      const health: SystemHealth = {
        systemName: "UnifiedEventBus",
        isResponding: true,
        averageResponseTime: responseTime,
        errorRate: 0, // Would need to track from metrics
        lastHealthCheck: Date.now(),
        subscriptionCount: metrics.activeSubscriptions,
        memoryUsage: metrics.memoryUsage,
        status: this.calculateHealthStatus(
          responseTime,
          0,
          metrics.memoryUsage
        ),
      };

      this.systemHealth.set("UnifiedEventBus", health);
    } catch (error) {
      this.systemHealth.set("UnifiedEventBus", {
        systemName: "UnifiedEventBus",
        isResponding: false,
        averageResponseTime: 0,
        errorRate: 1.0,
        lastHealthCheck: Date.now(),
        subscriptionCount: 0,
        memoryUsage: 0,
        status: "offline",
      });
    }
  }

  /**
   * Check color orchestrator health
   */
  private async checkColorOrchestratorHealth(): Promise<void> {
    const startTime = performance.now();

    try {
      const metrics = colorEventOrchestrator.getMetrics();
      const processingState = colorEventOrchestrator.getProcessingState();
      const responseTime = performance.now() - startTime;

      const errorRate =
        metrics.totalExtractions > 0
          ? metrics.errorCount / metrics.totalExtractions
          : 0;

      const health: SystemHealth = {
        systemName: "ColorEventOrchestrator",
        isResponding: true,
        averageResponseTime: metrics.averageProcessingTime,
        errorRate,
        lastHealthCheck: Date.now(),
        subscriptionCount: 0, // Would need to track
        memoryUsage: 0, // Would need to measure
        status: this.calculateHealthStatus(responseTime, errorRate, 0),
      };

      this.systemHealth.set("ColorEventOrchestrator", health);
    } catch (error) {
      this.systemHealth.set("ColorEventOrchestrator", {
        systemName: "ColorEventOrchestrator",
        isResponding: false,
        averageResponseTime: 0,
        errorRate: 1.0,
        lastHealthCheck: Date.now(),
        subscriptionCount: 0,
        memoryUsage: 0,
        status: "offline",
      });
    }
  }

  // EventMigrationManager was removed - no longer needed

  /**
   * Calculate health status based on metrics
   */
  private calculateHealthStatus(
    responseTime: number,
    errorRate: number,
    memoryUsage: number
  ): "healthy" | "warning" | "critical" | "offline" {
    if (
      responseTime > this.THRESHOLDS.maxProcessingTime * 2 ||
      errorRate > 0.2
    ) {
      return "critical";
    }

    if (
      responseTime > this.THRESHOLDS.maxProcessingTime ||
      errorRate > this.THRESHOLDS.maxErrorRate ||
      memoryUsage > this.THRESHOLDS.maxMemoryUsage
    ) {
      return "warning";
    }

    return "healthy";
  }

  /**
   * Update event metrics
   */
  private updateEventMetrics(
    eventName: EventName,
    processingTime: number,
    isError = false
  ): void {
    let metrics = this.eventMetrics.get(eventName);

    if (!metrics) {
      metrics = {
        eventName,
        totalEmissions: 0,
        totalSubscriptions: 0,
        averageProcessingTime: 0,
        lastEmissionTime: 0,
        peakEmissionsPerSecond: 0,
        errorCount: 0,
        healthScore: 100,
      };
      this.eventMetrics.set(eventName, metrics);
    }

    metrics.totalEmissions++;
    metrics.lastEmissionTime = Date.now();

    if (isError) {
      metrics.errorCount++;
    }

    // Update average processing time
    metrics.averageProcessingTime =
      (metrics.averageProcessingTime * (metrics.totalEmissions - 1) +
        processingTime) /
      metrics.totalEmissions;

    // Calculate health score
    metrics.healthScore = this.calculateEventHealthScore(metrics);
  }

  /**
   * Calculate event health score
   */
  private calculateEventHealthScore(metrics: EventFlowMetrics): number {
    let score = 100;

    // Penalize high processing times
    if (metrics.averageProcessingTime > this.THRESHOLDS.maxProcessingTime) {
      score -= 30;
    }

    // Penalize high error rates
    const errorRate =
      metrics.totalEmissions > 0
        ? metrics.errorCount / metrics.totalEmissions
        : 0;
    if (errorRate > this.THRESHOLDS.maxErrorRate) {
      score -= 40;
    }

    // Penalize stale events
    const timeSinceLastEmission = Date.now() - metrics.lastEmissionTime;
    if (timeSinceLastEmission > 300000) {
      // 5 minutes
      score -= 20;
    }

    return Math.max(0, score);
  }

  /**
   * Add event trace
   */
  private addEventTrace(trace: EventTrace): void {
    this.eventTraces.push(trace);

    // Maintain trace history limit
    if (this.eventTraces.length > this.maxTraceHistory) {
      this.eventTraces.shift();
    }
  }

  /**
   * Get current event source (simplified)
   */
  private getEventSource(): string {
    const stack = new Error().stack;
    if (stack) {
      const lines = stack.split("\n");
      for (let i = 2; i < Math.min(lines.length, 6); i++) {
        const line = lines[i];
        if (
          line &&
          !line.includes("EventSystemMonitor") &&
          !line.includes("UnifiedEventBus")
        ) {
          const match = line.match(/at\s+(.+?)\s+/);
          if (match && match[1]) {
            return match[1];
          }
        }
      }
    }
    return "Unknown";
  }

  /**
   * Sanitize event data for logging
   */
  private sanitizeEventData(data: any): any {
    try {
      // Create a copy and remove sensitive data
      const sanitized = JSON.parse(JSON.stringify(data));

      // Remove large objects that might cause memory issues
      if (sanitized && typeof sanitized === "object") {
        Object.keys(sanitized).forEach((key) => {
          if (
            typeof sanitized[key] === "string" &&
            sanitized[key].length > 1000
          ) {
            sanitized[key] = `[Large String: ${sanitized[key].length} chars]`;
          }
        });
      }

      return sanitized;
    } catch {
      return "[Unserializable Data]";
    }
  }

  /**
   * Update system subscription tracking
   */
  private updateSystemSubscriptions(subscriberName: string): void {
    const health = this.systemHealth.get(subscriberName);
    if (health) {
      health.subscriptionCount++;
    } else {
      this.systemHealth.set(subscriberName, {
        systemName: subscriberName,
        isResponding: true,
        averageResponseTime: 0,
        errorRate: 0,
        lastHealthCheck: Date.now(),
        subscriptionCount: 1,
        memoryUsage: 0,
        status: "healthy",
      });
    }
  }

  /**
   * Calculate system load
   */
  private calculateSystemLoad(
    busMetrics: any,
    colorMetrics: any
  ): void {
    // Simplified system load calculation
    const eventsPerSecond = busMetrics.eventsPerSecond || 0;
    const load = Math.min(
      eventsPerSecond / this.THRESHOLDS.maxEventsPerSecond,
      1.0
    );

    // Store load for diagnostics
    (this as any).currentSystemLoad = load;
  }

  /**
   * Analyze overall system health
   */
  private analyzeSystemHealth(): void {
    const healthySystems = Array.from(this.systemHealth.values()).filter(
      (h) => h.status === "healthy"
    ).length;
    const totalSystems = this.systemHealth.size;

    // Update diagnostics
    (this as any).lastSystemHealth = {
      healthySystems,
      totalSystems,
      healthPercentage:
        totalSystems > 0 ? (healthySystems / totalSystems) * 100 : 0,
    };
  }

  /**
   * Get comprehensive diagnostics
   */
  public getDiagnostics(): EventFlowDiagnostics {
    const busMetrics = unifiedEventBus.getMetrics();
    const colorMetrics = colorEventOrchestrator.getMetrics();

    const healthySystems = Array.from(this.systemHealth.values()).filter(
      (h) => h.status === "healthy"
    ).length;
    const totalSystems = this.systemHealth.size;

    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Analyze for issues
    Array.from(this.systemHealth.values()).forEach((health) => {
      if (health.status === "critical") {
        criticalIssues.push(`${health.systemName} is in critical state`);
      } else if (health.status === "warning") {
        warnings.push(`${health.systemName} performance degraded`);
      }
    });

    // Migration complete - no additional recommendations needed from migration system

    return {
      totalEvents: busMetrics.totalEvents,
      eventsPerSecond: busMetrics.eventsPerSecond,
      averageLatency: this.calculateAverageLatency(),
      systemLoad: (this as any).currentSystemLoad || 0,
      memoryUsage: busMetrics.memoryUsage,
      healthySystems,
      totalSystems,
      criticalIssues,
      warnings,
      recommendations,
    };
  }

  /**
   * Calculate average latency across all events
   */
  private calculateAverageLatency(): number {
    const metrics = Array.from(this.eventMetrics.values());
    if (metrics.length === 0) return 0;

    const totalLatency = metrics.reduce(
      (sum, m) => sum + m.averageProcessingTime,
      0
    );
    return totalLatency / metrics.length;
  }

  /**
   * Get event flow analysis
   */
  public getEventFlowAnalysis(): EventFlowMetrics[] {
    return Array.from(this.eventMetrics.values()).sort(
      (a, b) => b.totalEmissions - a.totalEmissions
    );
  }

  /**
   * Get system health report
   */
  public getSystemHealthReport(): SystemHealth[] {
    return Array.from(this.systemHealth.values()).sort((a, b) => {
      const statusOrder = { healthy: 0, warning: 1, critical: 2, offline: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }

  /**
   * Get recent event traces
   */
  public getRecentEventTraces(limit = 50): EventTrace[] {
    return this.eventTraces
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get event traces for specific event type
   */
  public getEventTraces(eventName: EventName, limit = 50): EventTrace[] {
    return this.eventTraces
      .filter((trace) => trace.eventName === eventName)
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Generate performance report
   */
  public generatePerformanceReport(): string {
    const diagnostics = this.getDiagnostics();
    const eventAnalysis = this.getEventFlowAnalysis();
    const systemHealth = this.getSystemHealthReport();

    let report = `# Unified Event System Performance Report\n\n`;

    report += `## System Overview\n`;
    report += `- Total Events: ${diagnostics.totalEvents}\n`;
    report += `- Events/Second: ${diagnostics.eventsPerSecond.toFixed(2)}\n`;
    report += `- Average Latency: ${diagnostics.averageLatency.toFixed(2)}ms\n`;
    report += `- System Load: ${(diagnostics.systemLoad * 100).toFixed(1)}%\n`;
    report += `- Memory Usage: ${(
      diagnostics.memoryUsage /
      1024 /
      1024
    ).toFixed(2)}MB\n`;
    report += `- Healthy Systems: ${diagnostics.healthySystems}/${diagnostics.totalSystems}\n\n`;

    if (diagnostics.criticalIssues.length > 0) {
      report += `## 🚨 Critical Issues\n`;
      diagnostics.criticalIssues.forEach((issue) => {
        report += `- ${issue}\n`;
      });
      report += `\n`;
    }

    if (diagnostics.warnings.length > 0) {
      report += `## ⚠️ Warnings\n`;
      diagnostics.warnings.forEach((warning) => {
        report += `- ${warning}\n`;
      });
      report += `\n`;
    }

    report += `## Top Events by Activity\n`;
    eventAnalysis.slice(0, 10).forEach((metrics) => {
      report += `- \`${metrics.eventName}\`: ${
        metrics.totalEmissions
      } emissions, ${metrics.averageProcessingTime.toFixed(2)}ms avg, ${
        metrics.healthScore
      }/100 health\n`;
    });

    report += `\n## System Health Status\n`;
    systemHealth.forEach((health) => {
      const statusEmoji = {
        healthy: "✅",
        warning: "⚠️",
        critical: "🚨",
        offline: "❌",
      };
      report += `- ${statusEmoji[health.status]} \`${health.systemName}\`: ${
        health.status
      } (${health.averageResponseTime.toFixed(2)}ms response)\n`;
    });

    if (diagnostics.recommendations.length > 0) {
      report += `\n## 💡 Recommendations\n`;
      diagnostics.recommendations.forEach((rec) => {
        report += `- ${rec}\n`;
      });
    }

    return report;
  }

  /**
   * Destroy diagnostics and clean up
   */
  public destroy(): void {
    this.stopMonitoring();

    // Restore original methods
    if (this.originalEmit) {
      (unifiedEventBus as any).emit = this.originalEmit;
    }

    if (this.originalSubscribe) {
      (unifiedEventBus as any).subscribe = this.originalSubscribe;
    }

    // Clear data
    this.eventMetrics.clear();
    this.systemHealth.clear();
    this.eventTraces = [];

    Y3KDebug?.debug?.log(
      "EventSystemMonitor",
      "Event system monitoring destroyed"
    );

    EventSystemMonitor.instance = null;
  }
}

// Export singleton instance
export const eventSystemMonitor = EventSystemMonitor.getInstance();
