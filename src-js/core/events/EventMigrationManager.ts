/**
 * EventMigrationManager - Legacy Event System Migration
 * 
 * Manages the transition from the fragmented event system to the unified event bus,
 * providing backwards compatibility while gradually migrating all systems to the
 * new unified architecture.
 * 
 * Philosophy: "Bridge the old with the new - a gentle transition that preserves
 * the past while embracing the future, ensuring no system is left behind in the
 * journey toward unified consciousness."
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import { unifiedEventBus, EventData } from './UnifiedEventBus';

interface LegacyEventMapping {
  legacyEvent: string;
  unifiedEvent: string;
  transform?: (legacyData: any) => any;
  deprecated?: boolean;
  removalVersion?: string;
}

interface MigrationMetrics {
  totalLegacyEvents: number;
  totalUnifiedEvents: number;
  conversionRate: number;
  deprecatedEventsUsed: number;
  systemsMigrated: number;
  systemsPending: number;
}

export class EventMigrationManager {
  private static instance: EventMigrationManager | null = null;
  
  // Legacy event mappings
  private eventMappings: LegacyEventMapping[] = [
    // Color processing events
    {
      legacyEvent: 'colors-extracted',
      unifiedEvent: 'colors:extracted',
      transform: (data) => ({
        rawColors: data.colors || data.rawColors || {},
        trackUri: data.trackUri || data.uri || 'unknown',
        timestamp: data.timestamp || Date.now(),
        musicData: data.musicData
      })
    },
    {
      legacyEvent: 'colors-harmonized',
      unifiedEvent: 'colors:harmonized',
      transform: (data) => ({
        processedColors: data.colors || data.processedColors || {},
        accentHex: data.accentHex || data.accent || '#cba6f7',
        accentRgb: data.accentRgb || data.rgb || '203,166,247',
        strategies: data.strategies || ['unknown'],
        processingTime: data.processingTime || 0,
        trackUri: data.trackUri || data.uri || 'unknown'
      })
    },
    {
      legacyEvent: 'colors/extracted',
      unifiedEvent: 'colors:extracted',
      transform: (data) => ({
        rawColors: data.colors || data.rawColors || {},
        trackUri: data.trackUri || data.uri || 'unknown',
        timestamp: data.timestamp || Date.now(),
        musicData: data.musicData
      })
    },
    {
      legacyEvent: 'colors/harmonized',
      unifiedEvent: 'colors:harmonized',
      transform: (data) => ({
        processedColors: data.colors || data.processedColors || {},
        accentHex: data.accentHex || data.accent || '#cba6f7',
        accentRgb: data.accentRgb || data.rgb || '203,166,247',
        strategies: data.strategies || ['unknown'],
        processingTime: data.processingTime || 0,
        trackUri: data.trackUri || data.uri || 'unknown'
      })
    },
    
    // Music sync events
    {
      legacyEvent: 'music-sync:beat',
      unifiedEvent: 'music:beat',
      transform: (data) => ({
        bpm: data.bpm || data.tempo || 120,
        intensity: data.intensity || data.energy || 0.5,
        timestamp: data.timestamp || Date.now(),
        confidence: data.confidence || 0.8
      })
    },
    {
      legacyEvent: 'music-sync:energy-changed',
      unifiedEvent: 'music:energy',
      transform: (data) => ({
        energy: data.energy || 0.5,
        valence: data.valence || 0.5,
        tempo: data.tempo || data.bpm || 120,
        timestamp: data.timestamp || Date.now()
      })
    },
    {
      legacyEvent: 'beat/frame',
      unifiedEvent: 'music:beat',
      transform: (data) => ({
        bpm: data.bpm || 120,
        intensity: data.intensity || 0.5,
        timestamp: data.timestamp || Date.now(),
        confidence: data.confidence || 0.8
      })
    },
    {
      legacyEvent: 'beat/bpm',
      unifiedEvent: 'music:beat',
      transform: (data) => ({
        bpm: data.bpm || data.value || 120,
        intensity: data.intensity || 0.5,
        timestamp: data.timestamp || Date.now(),
        confidence: data.confidence || 0.8
      })
    },
    {
      legacyEvent: 'beat/intensity',
      unifiedEvent: 'music:energy',
      transform: (data) => ({
        energy: data.intensity || data.energy || 0.5,
        valence: data.valence || 0.5,
        tempo: data.tempo || 120,
        timestamp: data.timestamp || Date.now()
      })
    },
    
    // Settings events
    {
      legacyEvent: 'year3000SystemSettingsChanged',
      unifiedEvent: 'settings:changed',
      transform: (data) => ({
        settingKey: data.setting || data.key || 'unknown',
        oldValue: data.oldValue,
        newValue: data.newValue || data.value,
        timestamp: data.timestamp || Date.now()
      })
    },
    {
      legacyEvent: 'year3000ArtisticModeChanged',
      unifiedEvent: 'settings:visual-guide-changed',
      transform: (data) => ({
        oldMode: data.oldMode || data.from || 'cosmic',
        newMode: data.newMode || data.to || data.mode || 'cosmic',
        timestamp: data.timestamp || Date.now()
      })
    },
    
    // Performance events
    {
      legacyEvent: 'colorharmony/frame',
      unifiedEvent: 'performance:frame',
      transform: (data) => ({
        deltaTime: data.deltaTime || 16,
        fps: data.fps || 60,
        memoryUsage: data.memoryUsage || 0,
        timestamp: data.timestamp || Date.now()
      }),
      deprecated: true,
      removalVersion: '2.0.0'
    },
    
    // System lifecycle events
    {
      legacyEvent: 'music-state-change',
      unifiedEvent: 'music:state-changed',
      transform: (data) => ({
        isPlaying: data.isPlaying || data.playing || false,
        position: data.position || data.currentTime || 0,
        duration: data.duration || data.totalTime || 0,
        timestamp: data.timestamp || Date.now()
      })
    },

    // Additional GlobalEventBus events that need migration
    {
      legacyEvent: 'music:now-playing-changed',
      unifiedEvent: 'music:track-changed',
      transform: (data) => ({
        trackUri: data.trackUri || 'unknown',
        albumArt: data.albumArt,
        artist: data.artist || 'Unknown Artist',
        title: data.title || 'Unknown Title',
        timestamp: data.timestamp || Date.now()
      })
    },
    {
      legacyEvent: 'music:beat',
      unifiedEvent: 'music:beat',
      transform: (data) => data // Pass through as-is for unified events
    },
    {
      legacyEvent: 'music:energy',
      unifiedEvent: 'music:energy',
      transform: (data) => data // Pass through as-is for unified events
    },
    {
      legacyEvent: 'music:genre-change',
      unifiedEvent: 'music:energy', // Map to closest unified event
      transform: (data) => ({
        energy: data.energy || 0.5,
        valence: data.valence || 0.5,
        tempo: data.tempo || 120,
        timestamp: data.timestamp || Date.now()
      })
    },
    {
      legacyEvent: 'user:scroll',
      unifiedEvent: 'user:scroll',
      transform: (data) => data // Pass through as-is
    },
    {
      legacyEvent: 'colorConsciousnessUpdate',
      unifiedEvent: 'colors:harmonized',
      transform: (data) => ({
        processedColors: data.colors || {},
        accentHex: data.accentHex || '#cba6f7',
        accentRgb: data.accentRgb || '203,166,247',
        strategies: ['ColorConsciousness'],
        processingTime: 0,
        trackUri: data.trackUri || 'unknown'
      })
    },
    {
      legacyEvent: 'emotionalMoment',
      unifiedEvent: 'consciousness:intensity-changed',
      transform: (data) => ({
        intensity: data.intensity || 0.5,
        userEngagement: data.userEngagement || 0.5,
        timestamp: data.timestamp || Date.now()
      })
    },
    {
      legacyEvent: 'gentleTransition',
      unifiedEvent: 'consciousness:field-updated',
      transform: (data) => ({
        rhythmicPulse: data.rhythmicPulse || 0.5,
        musicalFlow: data.musicalFlow || { x: 0, y: 0 },
        energyResonance: data.energyResonance || 0.5,
        depthPerception: data.depthPerception || 0.5,
        breathingCycle: data.breathingCycle || 0.5
      })
    }
  ];
  
  // Migration metrics
  private metrics: MigrationMetrics = {
    totalLegacyEvents: 0,
    totalUnifiedEvents: 0,
    conversionRate: 0,
    deprecatedEventsUsed: 0,
    systemsMigrated: 0,
    systemsPending: 0
  };
  
  // Legacy event listeners for DOM events
  private legacyDOMListeners = new Map<string, EventListener>();
  
  // Legacy GlobalEventBus compatibility (if it exists)
  private globalEventBusCompatibility = false;

  private constructor() {
    this.setupLegacyEventBridge();
    this.setupGlobalEventBusCompatibility();
    
    Y3K?.debug?.log('EventMigrationManager', 'Event migration manager initialized', {
      mappingsCount: this.eventMappings.length,
      deprecatedMappings: this.eventMappings.filter(m => m.deprecated).length
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): EventMigrationManager {
    if (!EventMigrationManager.instance) {
      EventMigrationManager.instance = new EventMigrationManager();
    }
    return EventMigrationManager.instance;
  }

  /**
   * Setup legacy DOM event bridge
   */
  private setupLegacyEventBridge(): void {
    this.eventMappings.forEach(mapping => {
      // Create DOM event listener
      const listener: EventListener = (event: Event) => {
        const customEvent = event as CustomEvent;
        this.handleLegacyDOMEvent(mapping, customEvent.detail);
      };
      
      this.legacyDOMListeners.set(mapping.legacyEvent, listener);
      document.addEventListener(mapping.legacyEvent, listener);
      
      Y3K?.debug?.log('EventMigrationManager', `Legacy DOM listener registered: ${mapping.legacyEvent} -> ${mapping.unifiedEvent}`);
    });
  }

  /**
   * Setup GlobalEventBus compatibility if it exists
   */
  private setupGlobalEventBusCompatibility(): void {
    try {
      // Check for GlobalEventBus in multiple locations
      let globalEventBus = (window as any).GlobalEventBus;
      
      // If not on window, try to import it
      if (!globalEventBus) {
        try {
          const { GlobalEventBus: ImportedGlobalEventBus } = require('@/core/events/EventBus');
          globalEventBus = ImportedGlobalEventBus;
        } catch (importError) {
          // Import failed, try accessing from globalThis
          globalEventBus = (globalThis as any).GlobalEventBus;
        }
      }
      
      if (globalEventBus && typeof globalEventBus.subscribe === 'function') {
        this.globalEventBusCompatibility = true;
        this.setupGlobalEventBusSubscriptions(globalEventBus);
        Y3K?.debug?.log('EventMigrationManager', 'GlobalEventBus compatibility enabled');
      }
    } catch (error) {
      Y3K?.debug?.log('EventMigrationManager', 'GlobalEventBus not found - DOM-only compatibility mode');
    }
  }

  /**
   * Setup GlobalEventBus subscriptions
   */
  private setupGlobalEventBusSubscriptions(globalEventBus: any): void {
    this.eventMappings.forEach(mapping => {
      if (mapping.legacyEvent.includes('/')) {
        // This looks like a GlobalEventBus event
        try {
          globalEventBus.subscribe(mapping.legacyEvent, (data: any) => {
            this.handleLegacyGlobalEvent(mapping, data);
          });
          
          Y3K?.debug?.log('EventMigrationManager', `GlobalEventBus listener registered: ${mapping.legacyEvent} -> ${mapping.unifiedEvent}`);
        } catch (error) {
          Y3K?.debug?.warn('EventMigrationManager', `Failed to register GlobalEventBus listener for ${mapping.legacyEvent}:`, error);
        }
      }
    });
  }

  /**
   * Handle legacy DOM events
   */
  private handleLegacyDOMEvent(mapping: LegacyEventMapping, data: any): void {
    try {
      this.metrics.totalLegacyEvents++;
      
      // Log deprecated event usage
      if (mapping.deprecated) {
        this.metrics.deprecatedEventsUsed++;
        Y3K?.debug?.warn('EventMigrationManager', `Deprecated event used: ${mapping.legacyEvent}`, {
          removalVersion: mapping.removalVersion,
          useInstead: mapping.unifiedEvent
        });
      }
      
      // Transform data if transformer exists
      const transformedData = mapping.transform ? mapping.transform(data) : data;
      
      // Emit unified event
      (unifiedEventBus as any).emit(mapping.unifiedEvent, transformedData);
      
      this.metrics.totalUnifiedEvents++;
      this.updateConversionRate();
      
      Y3K?.debug?.log('EventMigrationManager', `Legacy event converted: ${mapping.legacyEvent} -> ${mapping.unifiedEvent}`, {
        originalData: data,
        transformedData
      });
      
    } catch (error) {
      Y3K?.debug?.error('EventMigrationManager', `Failed to convert legacy event ${mapping.legacyEvent}:`, error);
    }
  }

  /**
   * Handle legacy GlobalEventBus events
   */
  private handleLegacyGlobalEvent(mapping: LegacyEventMapping, data: any): void {
    try {
      this.metrics.totalLegacyEvents++;
      
      // Transform data if transformer exists
      const transformedData = mapping.transform ? mapping.transform(data) : data;
      
      // Emit unified event
      (unifiedEventBus as any).emit(mapping.unifiedEvent, transformedData);
      
      this.metrics.totalUnifiedEvents++;
      this.updateConversionRate();
      
      Y3K?.debug?.log('EventMigrationManager', `GlobalEventBus event converted: ${mapping.legacyEvent} -> ${mapping.unifiedEvent}`);
      
    } catch (error) {
      Y3K?.debug?.error('EventMigrationManager', `Failed to convert GlobalEventBus event ${mapping.legacyEvent}:`, error);
    }
  }

  /**
   * Provide legacy event emission compatibility
   */
  public emitLegacyEvent(eventName: string, data: any): void {
    try {
      // Find mapping for this legacy event
      const mapping = this.eventMappings.find(m => m.legacyEvent === eventName);
      
      if (mapping) {
        // Use the mapping to emit unified event
        const transformedData = mapping.transform ? mapping.transform(data) : data;
        (unifiedEventBus as any).emit(mapping.unifiedEvent, transformedData);
        
        Y3K?.debug?.log('EventMigrationManager', `Legacy event emitted through unified bus: ${eventName} -> ${mapping.unifiedEvent}`);
      } else {
        // Emit as legacy DOM event for backwards compatibility
        document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
        
        Y3K?.debug?.warn('EventMigrationManager', `Unmapped legacy event emitted as DOM event: ${eventName}`);
      }
      
    } catch (error) {
      Y3K?.debug?.error('EventMigrationManager', `Failed to emit legacy event ${eventName}:`, error);
    }
  }

  /**
   * Register a new system as migrated
   */
  public registerMigratedSystem(systemName: string): void {
    this.metrics.systemsMigrated++;
    
    Y3K?.debug?.log('EventMigrationManager', `System migrated to unified events: ${systemName}`, {
      totalMigrated: this.metrics.systemsMigrated
    });
  }

  /**
   * Register a system as pending migration
   */
  public registerPendingSystem(systemName: string): void {
    this.metrics.systemsPending++;
    
    Y3K?.debug?.log('EventMigrationManager', `System pending migration: ${systemName}`, {
      totalPending: this.metrics.systemsPending
    });
  }

  /**
   * Add custom event mapping
   */
  public addEventMapping(mapping: LegacyEventMapping): void {
    this.eventMappings.push(mapping);
    
    // Setup listener for new mapping
    const listener: EventListener = (event: Event) => {
      const customEvent = event as CustomEvent;
      this.handleLegacyDOMEvent(mapping, customEvent.detail);
    };
    
    this.legacyDOMListeners.set(mapping.legacyEvent, listener);
    document.addEventListener(mapping.legacyEvent, listener);
    
    Y3K?.debug?.log('EventMigrationManager', `Custom event mapping added: ${mapping.legacyEvent} -> ${mapping.unifiedEvent}`);
  }

  /**
   * Remove event mapping (for systems that have been fully migrated)
   */
  public removeEventMapping(legacyEventName: string): boolean {
    const index = this.eventMappings.findIndex(m => m.legacyEvent === legacyEventName);
    
    if (index !== -1) {
      const mapping = this.eventMappings[index];
      this.eventMappings.splice(index, 1);
      
      // Remove DOM listener
      const listener = this.legacyDOMListeners.get(legacyEventName);
      if (listener) {
        document.removeEventListener(legacyEventName, listener);
        this.legacyDOMListeners.delete(legacyEventName);
      }
      
      Y3K?.debug?.log('EventMigrationManager', `Event mapping removed: ${legacyEventName} (system fully migrated)`);
      return true;
    }
    
    return false;
  }

  /**
   * Update conversion rate
   */
  private updateConversionRate(): void {
    const totalEvents = this.metrics.totalLegacyEvents;
    this.metrics.conversionRate = totalEvents > 0 ? 
      (this.metrics.totalUnifiedEvents / totalEvents) * 100 : 0;
  }

  /**
   * Get migration metrics
   */
  public getMetrics(): MigrationMetrics {
    return { ...this.metrics };
  }

  /**
   * Get list of deprecated events still being used
   */
  public getDeprecatedEventsReport(): Array<{
    eventName: string;
    unifiedEquivalent: string;
    removalVersion?: string;
    usageCount: number;
  }> {
    return this.eventMappings
      .filter(m => m.deprecated)
      .map(m => ({
        eventName: m.legacyEvent,
        unifiedEquivalent: String(m.unifiedEvent),
        ...(m.removalVersion && { removalVersion: m.removalVersion }),
        usageCount: 0 // Would need to track usage per event
      }));
  }

  /**
   * Get migration progress report
   */
  public getMigrationReport(): {
    totalMappings: number;
    deprecatedMappings: number;
    conversionRate: number;
    systemsMigrated: number;
    systemsPending: number;
    migrationProgress: number;
  } {
    const totalSystems = this.metrics.systemsMigrated + this.metrics.systemsPending;
    const migrationProgress = totalSystems > 0 ? 
      (this.metrics.systemsMigrated / totalSystems) * 100 : 0;
    
    return {
      totalMappings: this.eventMappings.length,
      deprecatedMappings: this.eventMappings.filter(m => m.deprecated).length,
      conversionRate: this.metrics.conversionRate,
      systemsMigrated: this.metrics.systemsMigrated,
      systemsPending: this.metrics.systemsPending,
      migrationProgress
    };
  }

  /**
   * Generate migration guide for a specific system
   */
  public generateMigrationGuide(systemName: string, currentEvents: string[]): string {
    let guide = `# Event Migration Guide for ${systemName}\n\n`;
    
    guide += `## Current Events Used\n`;
    currentEvents.forEach(eventName => {
      const mapping = this.eventMappings.find(m => m.legacyEvent === eventName);
      if (mapping) {
        guide += `- \`${eventName}\` → \`${String(mapping.unifiedEvent)}\``;
        if (mapping.deprecated) {
          guide += ` ⚠️ **DEPRECATED** (will be removed in ${mapping.removalVersion || 'future version'})`;
        }
        guide += `\n`;
      } else {
        guide += `- \`${eventName}\` → ❌ **NO MAPPING FOUND** - needs custom migration\n`;
      }
    });
    
    guide += `\n## Migration Steps\n`;
    guide += `1. Replace \`document.addEventListener\` with \`unifiedEventBus.subscribe\`\n`;
    guide += `2. Replace \`document.dispatchEvent\` with \`unifiedEventBus.emit\`\n`;
    guide += `3. Update event names to use unified naming convention\n`;
    guide += `4. Update event data structures to match unified interfaces\n`;
    guide += `5. Register system as migrated: \`eventMigrationManager.registerMigratedSystem('${systemName}')\`\n`;
    
    return guide;
  }

  /**
   * Destroy migration manager and clean up all listeners
   */
  public destroy(): void {
    // Remove all DOM event listeners
    this.legacyDOMListeners.forEach((listener, eventName) => {
      document.removeEventListener(eventName, listener);
    });
    this.legacyDOMListeners.clear();
    
    // Clear mappings
    this.eventMappings = [];
    
    // Reset metrics
    this.metrics = {
      totalLegacyEvents: 0,
      totalUnifiedEvents: 0,
      conversionRate: 0,
      deprecatedEventsUsed: 0,
      systemsMigrated: 0,
      systemsPending: 0
    };
    
    Y3K?.debug?.log('EventMigrationManager', 'Event migration manager destroyed');
    
    EventMigrationManager.instance = null;
  }
}

// Export singleton instance
export const eventMigrationManager = EventMigrationManager.getInstance();