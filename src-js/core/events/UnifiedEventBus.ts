/**
 * UnifiedEventBus - Single Source of Truth for All Theme Events
 *
 * Replaces the fragmented event system with a unified, efficient event pipeline
 * that eliminates duplication, provides type safety, and ensures proper cleanup.
 *
 * Philosophy: "One river carries all consciousness - a unified flow that connects
 * every system in perfect harmony, eliminating chaos and bringing order to the
 * digital organism."
 */

import { Y3KDebug } from "@/debug/UnifiedDebugManager";

// ============================================================================
// Event Type Definitions with Unified Naming Convention
// ============================================================================

export interface UnifiedEventMap {
  // Color Processing Events
  "colors:extracted": {
    rawColors: Record<string, string>;
    trackUri: string;
    timestamp: number;
    musicData?: {
      energy?: number;
      valence?: number;
      tempo?: number;
      genre?: string;
    };
  };

  "colors:harmonized": {
    processedColors: Record<string, string>;
    accentHex: string;
    accentRgb: string;
    strategies: string[];
    processingTime: number;
    trackUri: string;
    processingMode?: string;
    coordinationMetrics?: {
      detectedGenre?: string;
      emotionalState?: string;
      oklabPreset?: string;
      coordinationStrategy?: string;
      musicInfluenceStrength?: number;
    };
  };

  "colors:applied": {
    cssVariables: Record<string, string>;
    accentHex: string;
    accentRgb: string;
    appliedAt: number;
  };

  // Music Synchronization Events
  "music:beat": {
    bpm: number;
    intensity: number;
    timestamp: number;
    confidence: number;
  };

  "music:energy": {
    energy: number;
    valence: number;
    tempo: number;
    timestamp: number;
  };

  "music:track-changed": {
    trackUri: string;
    albumArt?: string;
    artist: string;
    title: string;
    timestamp: number;
  };

  "music:state-changed": {
    isPlaying: boolean;
    position: number;
    duration: number;
    timestamp: number;
  };

  // Emotion Analysis Events (Year 3000 Consciousness Flow)
  "emotion:analyzed": {
    emotion: {
      primary: string;
      secondary: string[];
      intensity: number;
      confidence: number;
      valence: number;
      arousal: number;
      dominance: number;
      colorTemperature: number;
      timestamp: number;
      duration: number;
      musicalCharacteristics: {
        tempo: number;
        key: number;
        mode: number;
        timeSignature: number;
        energy: number;
        danceability: number;
        acousticness: number;
        instrumentalness: number;
        liveness: number;
        speechiness: number;
        organicFlow: number;
        cinematicDepth: number;
        consciousnessResonance: number;
      };
    };
    colorTemperature: number;
    consciousnessLevel: number;
    organicFlow: number;
    cinematicDepth: number;
    timestamp: number;
  };

  "emotionalColorContext:updated": {
    primaryEmotion: string;
    emotionIntensity: number;
    colorTemperature: number;
    valence: number;
    arousal: number;
    dominance: number;
    organicFlow: number;
    cinematicDepth: number;
    consciousnessResonance: number;
  };

  // Settings Events
  "settings:changed": {
    settingKey: string;
    oldValue: any;
    newValue: any;
    timestamp: number;
  };

  "settings:visual-guide-changed": {
    oldMode: string;
    newMode: string;
    timestamp: number;
  };

  "settings:consciousness-level-changed": {
    oldLevel: number;
    newLevel: number;
    timestamp: number;
  };

  // Performance Events
  "performance:frame": {
    deltaTime: number;
    fps: number;
    memoryUsage: number;
    timestamp: number;
  };

  "performance:threshold-exceeded": {
    metric: "memory" | "cpu" | "gpu" | "frame-rate";
    threshold: number;
    currentValue: number;
    severity: "warning" | "critical";
  };

  "performance:tier-changed": {
    tier: "excellent" | "good" | "degraded" | "critical";
    previousTier: "excellent" | "good" | "degraded" | "critical";
    timestamp: number;
  };

  // Consciousness Events
  "consciousness:field-updated": {
    rhythmicPulse: number;
    musicalFlow: { x: number; y: number };
    energyResonance: number;
    depthPerception: number;
    breathingCycle: number;
  };

  "consciousness:choreography": {
    eventType: string;
    payload: any;
    participants: string[];
  };

  "consciousness:intensity-changed": {
    intensity: number;
    userEngagement: number;
    timestamp: number;
    sourceStrategy?: string;
    musicEnergy?: number;
  };

  "consciousness:dramatic-moment": {
    intensity: number;
    type?: string;
    timestamp: number;
  };

  // Cross-system consciousness coordination events
  "consciousness:coordination": {
    source: string;
    state: any;
    timestamp: number;
  };

  "consciousness:beat-sync": {
    source: string;
    beatPhase: number;
    lastBeatTime: number;
    timestamp: number;
  };

  "consciousness:dramatic-sync": {
    source: string;
    dramaticLevel: number;
    type?: string;
    timestamp: number;
  };

  "gradient:crossfade-changed": {
    opacity: number;
    sourceStrategy: string;
    webglEnabled: boolean;
    timestamp: number;
  };

  "music:energy-changed": {
    energy: number;
    timestamp: number;
  };

  "consciousness-ui:initialized": {
    registeredSystems: number;
    adaptationState: any;
    timestamp: number;
  };

  // User Interaction Events
  "user:scroll": {
    velocity: { x: number; y: number };
    direction: string;
    element: string;
    timestamp: number;
  };

  "user:interaction": {
    type: "click" | "hover" | "focus" | "scroll" | "keyboard";
    element: string;
    timestamp: number;
    metadata?: any;
  };

  "user:meditation-detected": {
    confidence: number;
    duration: number;
    timestamp: number;
  };

  // System Lifecycle Events
  "system:initialized": {
    systemName: string;
    timestamp: number;
    metadata?: any;
  };

  "system:destroyed": {
    systemName: string;
    timestamp: number;
    reason?: string;
  };

  "system:error": {
    systemName: string;
    error: string;
    severity: "warning" | "error" | "critical";
    timestamp: number;
  };

  // 🔧 PHASE 1: Consciousness Events (ColorConsciousnessState migration)
  "consciousness:updated": {
    type: string;
    payload: {
      palette: any[];
      consciousnessLevel: number;
      emotionalTemperature: number;
      multidimensionalAwareness: number;
      transcendenceLevel: number;
      volumetricDepth: number;
      dataStreamIntensity: number;
      temporalMemoryDepth: number;
      cosmicResonance: number;
      paletteGeneration: number;
      temporalPatternCount: number;
      fullConsciousnessState: any;
    };
  };

  "consciousness:holographic-stream": {
    type: string;
    payload: {
      intensity: number;
      interferencePatterns: number;
      projectionStability: number;
    };
  };

  "consciousness:temporal-pattern": {
    type: string;
    payload: {
      patterns: any[];
      memoryDepth: number;
    };
  };

  "consciousness:transcendence-high": {
    type: string;
    payload: {
      level: number;
      cosmicAlignment: number;
    };
  };

  // Performance and Quality Management Events
  "performance:metrics-updated": {
    fps: number;
    frameTime: number;
    memoryUsage: number;
    cpuUsage: number;
    timestamp: number;
  };

  "quality:level-changed": {
    level: number;
    features: {
      corridorEffects: boolean;
      webglFallback: boolean;
      animationDensity: number;
      shaderComplexity: number;
      updateFrequency: number;
    };
    source: "device-detection" | "user-override" | "performance-adaptation";
    timestamp?: number;
  };

  "performance:degradation-detected": {
    severity: "minor" | "moderate" | "severe";
    metrics: {
      fps: number;
      frameTime: number;
      memoryUsage: number;
    };
    timestamp: number;
  };
}

export type EventName = keyof UnifiedEventMap;
export type EventData<T extends EventName> = UnifiedEventMap[T];
export type EventHandler<T extends EventName> = (
  data: EventData<T>
) => void | Promise<void>;

// ============================================================================
// Subscription Management
// ============================================================================

interface EventSubscription {
  id: string;
  eventName: EventName;
  handler: EventHandler<any>;
  subscriberName: string;
  once: boolean;
  createdAt: number;
  lastTriggered?: number;
  triggerCount: number;
}

interface EventMetrics {
  totalEvents: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  eventsPerSecond: number;
  topEvents: Array<{ eventName: EventName; count: number }>;
  memoryUsage: number;
}

// ============================================================================
// UnifiedEventBus Implementation
// ============================================================================

export class UnifiedEventBus {
  private static instance: UnifiedEventBus | null = null;

  // Event subscriptions registry
  private subscriptions = new Map<EventName, Map<string, EventSubscription>>();

  // Event metrics and monitoring
  private eventMetrics: EventMetrics = {
    totalEvents: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    eventsPerSecond: 0,
    topEvents: [],
    memoryUsage: 0,
  };

  // Performance monitoring
  private eventQueue: Array<{
    eventName: EventName;
    data: any;
    timestamp: number;
  }> = [];
  private processingQueue = false;
  private maxQueueSize = 1000;

  // Cleanup management
  private subscriptionCleanupInterval: number | null = null;
  private metricsUpdateInterval: number | null = null;

  private constructor() {
    this.startMetricsMonitoring();
    this.startSubscriptionCleanup();

    Y3KDebug?.debug?.log("UnifiedEventBus", "Unified event bus initialized");
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): UnifiedEventBus {
    if (!UnifiedEventBus.instance) {
      UnifiedEventBus.instance = new UnifiedEventBus();
    }
    return UnifiedEventBus.instance;
  }

  /**
   * Subscribe to an event with type safety
   */
  public subscribe<T extends EventName>(
    eventName: T,
    handler: EventHandler<T>,
    subscriberName: string = "anonymous",
    options: { once?: boolean } = {}
  ): string {
    const subscriptionId = this.generateSubscriptionId();

    // Ensure subscription map exists for this event
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, new Map());
    }

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventName,
      handler,
      subscriberName,
      once: options.once || false,
      createdAt: Date.now(),
      triggerCount: 0,
    };

    this.subscriptions.get(eventName)!.set(subscriptionId, subscription);
    this.eventMetrics.totalSubscriptions++;
    this.eventMetrics.activeSubscriptions++;

    Y3KDebug?.debug?.log(
      "UnifiedEventBus",
      `Subscription added: ${subscriberName} -> ${eventName}`,
      {
        subscriptionId,
        totalSubscriptions: this.eventMetrics.activeSubscriptions,
      }
    );

    return subscriptionId;
  }

  /**
   * Subscribe to an event only once
   */
  public once<T extends EventName>(
    eventName: T,
    handler: EventHandler<T>,
    subscriberName: string = "anonymous"
  ): string {
    return this.subscribe(eventName, handler, subscriberName, { once: true });
  }

  /**
   * Unsubscribe from an event
   */
  public unsubscribe(subscriptionId: string): boolean {
    for (const [eventName, subscriptionMap] of this.subscriptions.entries()) {
      if (subscriptionMap.has(subscriptionId)) {
        const subscription = subscriptionMap.get(subscriptionId)!;
        subscriptionMap.delete(subscriptionId);

        // Clean up empty event maps
        if (subscriptionMap.size === 0) {
          this.subscriptions.delete(eventName);
        }

        this.eventMetrics.activeSubscriptions--;

        Y3KDebug?.debug?.log(
          "UnifiedEventBus",
          `Subscription removed: ${subscription.subscriberName} -> ${eventName}`,
          {
            subscriptionId,
            remainingSubscriptions: this.eventMetrics.activeSubscriptions,
          }
        );

        return true;
      }
    }

    return false;
  }

  /**
   * Unsubscribe all events for a specific subscriber
   */
  public unsubscribeAll(subscriberName: string): number {
    let removedCount = 0;

    for (const [eventName, subscriptionMap] of this.subscriptions.entries()) {
      const toRemove = Array.from(subscriptionMap.values()).filter(
        (sub) => sub.subscriberName === subscriberName
      );

      for (const subscription of toRemove) {
        subscriptionMap.delete(subscription.id);
        removedCount++;
        this.eventMetrics.activeSubscriptions--;
      }

      // Clean up empty event maps
      if (subscriptionMap.size === 0) {
        this.subscriptions.delete(eventName);
      }
    }

    if (removedCount > 0) {
      Y3KDebug?.debug?.log(
        "UnifiedEventBus",
        `Removed ${removedCount} subscriptions for: ${subscriberName}`
      );
    }

    return removedCount;
  }

  /**
   * Emit an event with type safety
   */
  public async emit<T extends EventName>(
    eventName: T,
    data: EventData<T>
  ): Promise<void> {
    const timestamp = Date.now();

    // Add to processing queue if system is busy
    if (this.processingQueue || this.eventQueue.length > 0) {
      if (this.eventQueue.length >= this.maxQueueSize) {
        Y3KDebug?.debug?.warn(
          "UnifiedEventBus",
          `Event queue full, dropping event: ${eventName}`
        );
        return;
      }

      this.eventQueue.push({ eventName, data, timestamp });
      this.processEventQueue();
      return;
    }

    await this.processEvent(eventName, data, timestamp);
  }

  /**
   * Emit an event synchronously (use sparingly)
   */
  public emitSync<T extends EventName>(eventName: T, data: EventData<T>): void {
    const timestamp = Date.now();
    this.processEventSync(eventName, data, timestamp);
  }

  /**
   * Process a single event
   */
  private async processEvent<T extends EventName>(
    eventName: T,
    data: EventData<T>,
    timestamp: number
  ): Promise<void> {
    const subscriptionMap = this.subscriptions.get(eventName);
    if (!subscriptionMap || subscriptionMap.size === 0) {
      return;
    }

    this.eventMetrics.totalEvents++;

    // Create array of handlers to execute
    const handlers: Array<{
      subscription: EventSubscription;
      handler: EventHandler<T>;
    }> = [];
    const toRemove: string[] = [];

    for (const [subscriptionId, subscription] of subscriptionMap.entries()) {
      handlers.push({ subscription, handler: subscription.handler });

      // Mark once-handlers for removal
      if (subscription.once) {
        toRemove.push(subscriptionId);
      }

      // Update subscription metrics
      subscription.lastTriggered = timestamp;
      subscription.triggerCount++;
    }

    // Execute handlers
    const promises = handlers.map(async ({ subscription, handler }) => {
      try {
        await handler(data);
      } catch (error) {
        Y3KDebug?.debug?.error(
          "UnifiedEventBus",
          `Handler error in ${subscription.subscriberName} for ${eventName}:`,
          error
        );

        // Emit system error event
        this.emitSync("system:error", {
          systemName: subscription.subscriberName,
          error: error instanceof Error ? error.message : "Unknown error",
          severity: "error",
          timestamp: Date.now(),
        });
      }
    });

    await Promise.all(promises);

    // Remove once-handlers
    for (const subscriptionId of toRemove) {
      subscriptionMap.delete(subscriptionId);
      this.eventMetrics.activeSubscriptions--;
    }

    // Clean up empty event maps
    if (subscriptionMap.size === 0) {
      this.subscriptions.delete(eventName);
    }

    Y3KDebug?.debug?.log("UnifiedEventBus", `Event processed: ${eventName}`, {
      handlerCount: handlers.length,
      processingTime: Date.now() - timestamp,
    });
  }

  /**
   * Process event synchronously
   */
  private processEventSync<T extends EventName>(
    eventName: T,
    data: EventData<T>,
    timestamp: number
  ): void {
    const subscriptionMap = this.subscriptions.get(eventName);
    if (!subscriptionMap || subscriptionMap.size === 0) {
      return;
    }

    this.eventMetrics.totalEvents++;

    const toRemove: string[] = [];

    for (const [subscriptionId, subscription] of subscriptionMap.entries()) {
      try {
        subscription.handler(data);

        // Update subscription metrics
        subscription.lastTriggered = timestamp;
        subscription.triggerCount++;

        // Mark once-handlers for removal
        if (subscription.once) {
          toRemove.push(subscriptionId);
        }
      } catch (error) {
        Y3KDebug?.debug?.error(
          "UnifiedEventBus",
          `Sync handler error in ${subscription.subscriberName} for ${eventName}:`,
          error
        );
      }
    }

    // Remove once-handlers
    for (const subscriptionId of toRemove) {
      subscriptionMap.delete(subscriptionId);
      this.eventMetrics.activeSubscriptions--;
    }

    // Clean up empty event maps
    if (subscriptionMap.size === 0) {
      this.subscriptions.delete(eventName);
    }
  }

  /**
   * Process queued events
   */
  private async processEventQueue(): Promise<void> {
    if (this.processingQueue) return;

    this.processingQueue = true;

    while (this.eventQueue.length > 0) {
      const queueItem = this.eventQueue.shift()!;
      await this.processEvent(
        queueItem.eventName,
        queueItem.data,
        queueItem.timestamp
      );
    }

    this.processingQueue = false;
  }

  /**
   * Get current event metrics
   */
  public getMetrics(): EventMetrics {
    return { ...this.eventMetrics };
  }

  /**
   * Get all active subscriptions for debugging
   */
  public getActiveSubscriptions(): Array<{
    eventName: EventName;
    subscriberName: string;
    subscriptionId: string;
    createdAt: number;
    triggerCount: number;
  }> {
    const subscriptions: any[] = [];

    for (const [eventName, subscriptionMap] of this.subscriptions.entries()) {
      for (const [subscriptionId, subscription] of subscriptionMap.entries()) {
        subscriptions.push({
          eventName,
          subscriberName: subscription.subscriberName,
          subscriptionId,
          createdAt: subscription.createdAt,
          triggerCount: subscription.triggerCount,
        });
      }
    }

    return subscriptions.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Start metrics monitoring
   */
  private startMetricsMonitoring(): void {
    this.metricsUpdateInterval = window.setInterval(() => {
      this.updateMetrics();
    }, 5000); // Update every 5 seconds
  }

  /**
   * Start subscription cleanup for abandoned subscriptions
   */
  private startSubscriptionCleanup(): void {
    this.subscriptionCleanupInterval = window.setInterval(() => {
      this.cleanupAbandonedSubscriptions();
    }, 60000); // Check every minute
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(): void {
    // Calculate events per second
    const now = Date.now();
    const recentEvents = this.eventMetrics.totalEvents; // Simplified calculation

    // Update top events (simplified implementation)
    const eventCounts = new Map<EventName, number>();

    for (const [eventName, subscriptionMap] of this.subscriptions.entries()) {
      let totalTriggers = 0;
      for (const subscription of subscriptionMap.values()) {
        totalTriggers += subscription.triggerCount;
      }
      eventCounts.set(eventName, totalTriggers);
    }

    this.eventMetrics.topEvents = Array.from(eventCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([eventName, count]) => ({ eventName, count }));

    // Estimate memory usage (rough calculation)
    this.eventMetrics.memoryUsage = this.eventMetrics.activeSubscriptions * 256; // ~256 bytes per subscription
  }

  /**
   * Clean up abandoned subscriptions
   */
  private cleanupAbandonedSubscriptions(): void {
    const cutoffTime = Date.now() - 300000; // 5 minutes
    let cleanedCount = 0;

    for (const [eventName, subscriptionMap] of this.subscriptions.entries()) {
      const toCleanup = Array.from(subscriptionMap.values()).filter(
        (sub) => !sub.lastTriggered && sub.createdAt < cutoffTime
      );

      for (const subscription of toCleanup) {
        subscriptionMap.delete(subscription.id);
        cleanedCount++;
        this.eventMetrics.activeSubscriptions--;
      }

      // Clean up empty event maps
      if (subscriptionMap.size === 0) {
        this.subscriptions.delete(eventName);
      }
    }

    if (cleanedCount > 0) {
      Y3KDebug?.debug?.log(
        "UnifiedEventBus",
        `Cleaned up ${cleanedCount} abandoned subscriptions`
      );
    }
  }

  /**
   * Generate unique subscription ID
   */
  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Destroy the event bus and clean up all resources
   */
  public destroy(): void {
    // Clear all intervals
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
      this.metricsUpdateInterval = null;
    }

    if (this.subscriptionCleanupInterval) {
      clearInterval(this.subscriptionCleanupInterval);
      this.subscriptionCleanupInterval = null;
    }

    // Clear all subscriptions
    this.subscriptions.clear();
    this.eventQueue = [];

    // Reset metrics
    this.eventMetrics = {
      totalEvents: 0,
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      eventsPerSecond: 0,
      topEvents: [],
      memoryUsage: 0,
    };

    Y3KDebug?.debug?.log("UnifiedEventBus", "Unified event bus destroyed");

    UnifiedEventBus.instance = null;
  }
}

// ============================================================================
// Global Instance Export
// ============================================================================

export const unifiedEventBus = UnifiedEventBus.getInstance();
