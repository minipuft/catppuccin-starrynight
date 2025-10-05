/**
 * UnifiedEventBus - Single Source of Truth for All Theme Events
 *
 * Replaces the fragmented event system with a unified, efficient event pipeline
 * that eliminates duplication, provides type safety, and ensures proper cleanup.
 *
 * Architecture: Unified event coordination for all theme systems with type safety,
 * performance optimization, and proper resource management.
 */

import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import { VisualEffectsState } from "@/types/colorTypes";

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
    cssVariables?: Record<string, string>; // 🔧 PHASE 2: Complete CSS variable set from pure processor (optional for backward compat)
    accentHex: string;
    accentRgb: string;
    strategies: string[];
    processingTime: number;
    trackUri: string;
    timestamp?: number; // 🔧 PHASE 2: Event timestamp for tracking (optional for backward compat)
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
    strategies?: string[]; // 🔧 PHASE 2: Optional processing strategies
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

  // Music Analysis Events
  "music:emotion-analyzed": {
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
        smoothFlow: number;
        cinematicDepth: number;
        visualEffectsResonance: number;
      };
    };
    colorTemperature: number;
    visualEffectsLevel: number;
    smoothFlow: number;
    cinematicDepth: number;
    timestamp: number;
  };

  "music:emotional-context-updated": {
    primaryEmotion: string;
    emotionIntensity: number;
    colorTemperature: number;
    valence: number;
    arousal: number;
    dominance: number;
    smoothFlow: number;
    cinematicDepth: number;
    visualEffectsResonance: number;
  };

  // Settings Events
  "settings:changed": {
    settingKey: string;
    oldValue: string | number | boolean;
    newValue: string | number | boolean;
    timestamp: number;
  };

  "settings:visual-guide-changed": {
    oldMode: string;
    newMode: string;
    timestamp: number;
  };

  "settings:visual-effects-level-changed": {
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

  // Visual Effects Events
  "visual-effects:field-updated": {
    rhythmicPulse: number;
    musicalFlow: { x: number; y: number };
    energyResonance: number;
    depthPerception: number;
    pulsingCycle: number;
  };

  "visual-effects:choreography": {
    eventType: string;
    payload: VisualEffectsState;
    participants: string[];
  };

  "visual-effects:intensity-changed": {
    intensity: number;
    userEngagement: number;
    timestamp: number;
    sourceStrategy?: string;
    musicEnergy?: number;
  };

  "music:dramatic-peak-detected": {
    intensity: number;
    type?: string;
    timestamp: number;
  };

  // Cross-system visual effects coordination events
  "visual-effects:coordination": {
    source: string;
    state: VisualEffectsState;
    timestamp: number;
  };

  "music:beat-sync": {
    source: string;
    beatPhase: number;
    lastBeatTime: number;
    timestamp: number;
  };

  "music:dramatic-sync": {
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

  "visual-effects-ui:initialized": {
    registeredSystems: number;
    adaptationState: VisualEffectsState;
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
    metadata?: Record<string, string | number>;
  };

  "user:calm-mode-detected": {
    confidence: number;
    duration: number;
    timestamp: number;
  };

  /** @deprecated Use user:calm-mode-detected instead */
  "user:meditation-detected": {
    confidence: number;
    duration: number;
    timestamp: number;
  };

  // System Lifecycle Events
  "system:initialized": {
    systemName: string;
    timestamp: number;
    metadata?: Record<string, string | number>;
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

  // Visual Effects State Events (modernized technical terminology)
  "visual-effects:state-updated": {
    type: string;
    payload: {
      palette: string[];
      visualEffectsLevel: number;
      emotionalTemperature: number;
      spatialAwareness: number;
      intensityLevel: number;
      volumetricDepth: number;
      dataStreamIntensity: number;
      timeBasedMemoryDepth: number;
      enhancedResonance: number;
      paletteGeneration: number;
      timeBasedPatternCount: number;
      fullDynamicState: VisualEffectsState;
      
      // Legacy compatibility aliases
      /** @deprecated Use spatialAwareness instead */
      multidimensionalAwareness?: number;
      /** @deprecated Use intensityLevel instead */
      transcendenceLevel?: number;
      /** @deprecated Use timeBasedMemoryDepth instead */
      temporalMemoryDepth?: number;
      /** @deprecated Use enhancedResonance instead */
      cosmicResonance?: number;
      /** @deprecated Use timeBasedPatternCount instead */
      temporalPatternCount?: number;
      /** @deprecated Use fullDynamicState instead */
      fullConsciousnessState?: VisualEffectsState;
    };
  };

  "visual-effects:layered-stream": {
    type: string;
  };

  /** @deprecated Use visual-effects:layered-stream instead */
  "visual-effects:holographic-stream": {
    type: string;
    payload: {
      intensity: number;
      interferencePatterns: number;
      projectionStability: number;
    };
  };

  "visual-effects:temporal-pattern": {
    type: string;
    payload: {
      patterns: Array<{
        patternId: string;
        frequency: number;
        strength: number;
        musicalCorrelation: number;
        visualEffectsSignature?: number;
        transitionSignature?: number;
      }>;
      memoryDepth: number;
    };
  };

  "visual-effects:intensity-high": {
    type: string;
    payload: {
      level: number;
      enhancedAlignment: number;
    };
  };

  /** @deprecated Use visual-effects:intensity-high instead */
  "visual-effects:transcendence-high": {
    type: string;
    payload: {
      level: number;
      /** @deprecated Use enhancedAlignment instead */
      cosmicAlignment: number;
      enhancedAlignment?: number;
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

interface EventSubscription<T extends EventName = EventName> {
  id: string;
  eventName: T;
  handler: EventHandler<T>;
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
  private subscriptions = new Map<EventName, Map<string, EventSubscription<any>>>();

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
    data: EventData<EventName>;
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

    const subscription: EventSubscription<T> = {
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
