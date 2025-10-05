/**
 * ColorEventCoordinator - Color Event Handling and Loop Prevention
 *
 * Coordinates color harmonization events from the ColorHarmonyEngine and manages
 * event loop prevention to avoid infinite recursion. Provides centralized event
 * processing with built-in safety mechanisms.
 *
 * Key responsibilities:
 * - Handle colors:harmonized events from event bus
 * - Prevent event loops through processing chain tracking
 * - Cache recent events to avoid duplicate processing
 * - Apply colors via facade system delegation
 *
 * @architecture Event coordination with loop prevention
 * @see ColorHarmonyEngine for color harmonization
 * @see unifiedEventBus for event system
 */

import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";

export interface ColorEventState {
  processedEvents: Map<string, number>;
  isProcessingColorEvent: boolean;
  eventTimeout: number | null;
}

export interface ProcessingState {
  isProcessingSongChange: boolean;
  lastProcessedTrackUri: string | null;
  lastProcessingTime: number;
  processingChain: string[];
  eventLoopDetected: boolean;
}

export interface ColorEventConfig {
  /** Maximum processing chain length before loop detection */
  maxChainLength?: number;
  /** Processing timeout in milliseconds */
  processingTimeout?: number;
  /** Event cache TTL in milliseconds */
  colorEventCacheTTL?: number;
  /** Enable debug logging */
  enableDebug?: boolean;
  /** Callback to apply colors to the system */
  onApplyColors?: (
    processedColors: Record<string, string>,
    accentHex: string,
    accentRgb: string
  ) => void;
}

/**
 * ColorEventCoordinator - Manages color event processing with loop prevention
 */
export class ColorEventCoordinator {
  private config: Required<ColorEventConfig>;
  private colorEventState: ColorEventState;
  private processingState: ProcessingState;
  private subscriptionId: string | null = null;

  constructor(config: ColorEventConfig = {}) {
    this.config = {
      maxChainLength: config.maxChainLength ?? 10,
      processingTimeout: config.processingTimeout ?? 5000,
      colorEventCacheTTL: config.colorEventCacheTTL ?? 2000,
      enableDebug: config.enableDebug ?? false,
      onApplyColors: config.onApplyColors ?? (() => {}),
    };

    this.colorEventState = {
      processedEvents: new Map<string, number>(),
      isProcessingColorEvent: false,
      eventTimeout: null,
    };

    this.processingState = {
      isProcessingSongChange: false,
      lastProcessedTrackUri: null,
      lastProcessingTime: 0,
      processingChain: [],
      eventLoopDetected: false,
    };
  }

  /**
   * Start listening for color harmonization events
   */
  public startListening(): void {
    try {
      unifiedEventBus.subscribe(
        "colors:harmonized",
        (data: any) => {
          this.handleColorHarmonizedEvent(data);
        },
        "ColorEventCoordinator"
      );

      this.subscriptionId = "ColorEventCoordinator";

      if (this.config.enableDebug) {
        console.log(
          "🎨 [ColorEventCoordinator] Subscribed to colors:harmonized events"
        );
      }
    } catch (error) {
      console.error(
        "[ColorEventCoordinator] Failed to subscribe to colors:harmonized events:",
        error
      );
    }
  }

  /**
   * Stop listening for color harmonization events
   */
  public stopListening(): void {
    if (this.subscriptionId) {
      try {
        unifiedEventBus.unsubscribe(this.subscriptionId);
        this.subscriptionId = null;

        if (this.config.enableDebug) {
          console.log(
            "🎨 [ColorEventCoordinator] Unsubscribed from colors:harmonized events"
          );
        }
      } catch (error) {
        console.error(
          "[ColorEventCoordinator] Failed to unsubscribe from colors:harmonized events:",
          error
        );
      }
    }

    // Clean up state
    this.resetColorEventState();
    this.resetProcessingState();
  }

  /**
   * Handle colors:harmonized event from ColorHarmonyEngine
   * Enhanced with loop prevention and recursion protection
   */
  private handleColorHarmonizedEvent(data: any): void {
    // Loop Prevention - Check if already processing
    if (this.colorEventState.isProcessingColorEvent) {
      if (this.config.enableDebug) {
        console.warn(
          "🔄 [ColorEventCoordinator] Already processing color event - skipping to prevent recursion"
        );
      }
      return;
    }

    // Generate event context hash for caching
    const eventContext = JSON.stringify(data).substring(0, 100);
    const eventHash = this.generateEventHash(eventContext);
    const now = Date.now();

    // Check event cache to prevent duplicate processing
    if (this.colorEventState.processedEvents.has(eventHash)) {
      const lastProcessed = this.colorEventState.processedEvents.get(eventHash)!;
      if (now - lastProcessed < this.config.colorEventCacheTTL) {
        if (this.config.enableDebug) {
          console.warn(
            "🔄 [ColorEventCoordinator] Event recently processed - skipping duplicate"
          );
        }
        return;
      }
    }

    // Set processing state and cache event
    this.colorEventState.isProcessingColorEvent = true;
    this.colorEventState.processedEvents.set(eventHash, now);

    // Set safety timeout
    this.colorEventState.eventTimeout = window.setTimeout(() => {
      if (this.config.enableDebug) {
        console.warn(
          "🔄 [ColorEventCoordinator] Color event processing timeout - resetting state"
        );
      }
      this.resetColorEventState();
    }, this.config.processingTimeout);

    try {
      // Add to processing chain for loop detection
      this.processingState.processingChain.push("handleColorHarmonizedEvent");

      // Check for processing chain overflow
      if (
        this.processingState.processingChain.length > this.config.maxChainLength
      ) {
        this.processingState.eventLoopDetected = true;
        console.error(
          "🔄 [ColorEventCoordinator] CRITICAL: Event loop detected - chain length exceeded",
          this.processingState.processingChain
        );
        this.resetProcessingState();
        return;
      }

      // Extract color data from event
      let processedColors: Record<string, string> = {};
      let accentHex = "#37416b"; // Default Catppuccin fallback
      let accentRgb = "166,173,200";
      let strategies: string[] = [];
      let processingTime = 0;

      // Handle unified event format
      if (data.eventType === "colors/harmonized" && data.payload) {
        processedColors = data.payload.colors || {};
        accentHex = data.payload.accent?.hex || accentHex;
        accentRgb = data.payload.accent?.rgb || accentRgb;
        strategies = data.payload.metadata?.strategies || [];
        processingTime = data.payload.metadata?.processingTime || 0;
      }
      // Handle direct data format
      else if (data.type === "colors/harmonized") {
        return; // Legacy format, skip processing
      } else {
        if (this.config.enableDebug) {
          console.warn(
            "🎨 [ColorEventCoordinator] Unrecognized colors:harmonized event format:",
            data
          );
        }
        return;
      }

      if (this.config.enableDebug) {
        console.log("🎨 [ColorEventCoordinator] Processing colors:harmonized event:", {
          strategies: strategies,
          processingTime: processingTime,
          colorsCount: Object.keys(processedColors).length,
          accentHex: accentHex,
          accentRgb: accentRgb,
          chainLength: this.processingState.processingChain.length,
        });
      }

      // Apply colors via callback
      this.config.onApplyColors(processedColors, accentHex, accentRgb);
    } catch (error) {
      console.error(
        "[ColorEventCoordinator] Failed to handle colors:harmonized event:",
        error
      );
    } finally {
      // Always clean up processing state
      this.resetColorEventState();

      // Remove from processing chain
      const chainIndex = this.processingState.processingChain.indexOf(
        "handleColorHarmonizedEvent"
      );
      if (chainIndex > -1) {
        this.processingState.processingChain.splice(chainIndex, 1);
      }
    }
  }

  /**
   * Generate simple hash for event caching
   */
  private generateEventHash(context: string): string {
    let hash = 0;
    for (let i = 0; i < context.length; i++) {
      const char = context.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Reset color event processing state
   */
  private resetColorEventState(): void {
    this.colorEventState.isProcessingColorEvent = false;

    if (this.colorEventState.eventTimeout) {
      clearTimeout(this.colorEventState.eventTimeout);
      this.colorEventState.eventTimeout = null;
    }

    // Clean up old cache entries (older than TTL)
    const now = Date.now();
    for (const [hash, timestamp] of this.colorEventState.processedEvents.entries()) {
      if (now - timestamp > this.config.colorEventCacheTTL) {
        this.colorEventState.processedEvents.delete(hash);
      }
    }
  }

  /**
   * Reset processing state after loop detection or timeout
   */
  private resetProcessingState(): void {
    this.processingState.isProcessingSongChange = false;
    this.processingState.processingChain = [];
    this.processingState.eventLoopDetected = false;
    this.processingState.lastProcessingTime = Date.now();

    if (this.config.enableDebug) {
      console.log("🔄 [ColorEventCoordinator] Processing state reset");
    }
  }

  /**
   * Get current processing state (for debugging/monitoring)
   */
  public getProcessingState(): Readonly<ProcessingState> {
    return { ...this.processingState };
  }

  /**
   * Get current color event state (for debugging/monitoring)
   */
  public getColorEventState(): {
    isProcessing: boolean;
    cachedEventsCount: number;
    chainLength: number;
  } {
    return {
      isProcessing: this.colorEventState.isProcessingColorEvent,
      cachedEventsCount: this.colorEventState.processedEvents.size,
      chainLength: this.processingState.processingChain.length,
    };
  }

  /**
   * Update configuration at runtime
   */
  public updateConfig(config: Partial<ColorEventConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }
}
