/**
 * EventMigrationManager - Compatibility Stub
 * 
 * This is a compatibility stub that allows legacy tests to work with the new UnifiedEventBus.
 * The actual event migration functionality has been integrated into UnifiedEventBus directly.
 */

import { UnifiedEventBus } from './UnifiedEventBus';

export class EventMigrationManager {
  private static instance: EventMigrationManager;
  private eventBus: UnifiedEventBus;
  private migrationMetrics = {
    totalLegacyEvents: 0,
    totalUnifiedEvents: 0,
    conversionRate: 0
  };

  private constructor() {
    this.eventBus = UnifiedEventBus.getInstance();
  }

  public static getInstance(): EventMigrationManager {
    if (!EventMigrationManager.instance) {
      EventMigrationManager.instance = new EventMigrationManager();
    }
    return EventMigrationManager.instance;
  }

  /**
   * Compatibility method - maps legacy event names to unified events
   */
  public emitLegacyEvent(eventName: string, data: any): void {
    this.migrationMetrics.totalLegacyEvents++;
    // Map legacy event names to unified event names
    const eventMap: Record<string, string> = {
      'colors-extracted': 'colors:extracted',
      'colors-harmonized': 'colors:harmonized', 
      'colors/extracted': 'colors:extracted',
      'colors/harmonized': 'colors:harmonized',
      'music-sync:beat': 'music:beat',
      'music-sync:energy-changed': 'music:energy',
      'music:now-playing-changed': 'music:track-changed',
      'beat/frame': 'music:beat',
      'beat/intensity': 'music:energy',
      'year3000SystemSettingsChanged': 'settings:changed'
    };

    const unifiedEventName = eventMap[eventName];
    
    if (unifiedEventName && data) {
      // Transform legacy data format to unified format if needed
      let transformedData = this.transformLegacyData(unifiedEventName, data);
      
      try {
        this.eventBus.emit(unifiedEventName as any, transformedData);
        this.migrationMetrics.totalUnifiedEvents++;
        this.migrationMetrics.conversionRate = this.migrationMetrics.totalUnifiedEvents / this.migrationMetrics.totalLegacyEvents;
      } catch (error) {
        // Handle gracefully for test compatibility
        console.warn(`[EventMigrationManager] Failed to emit event ${unifiedEventName}:`, error);
      }
    } else if (!unifiedEventName) {
      console.warn(`[EventMigrationManager] Unknown legacy event: ${eventName}`);
    }
  }

  /**
   * Transform legacy data formats to unified format
   */
  private transformLegacyData(eventName: string, data: any): any {
    switch (eventName) {
      case 'colors:extracted':
        return {
          rawColors: data.colors || data.rawColors || {},
          trackUri: data.trackUri || data.uri || 'unknown',
          timestamp: data.timestamp || Date.now()
        };
        
      case 'colors:harmonized':
        return {
          processedColors: data.colors || data.processedColors || {},
          accentHex: data.accentHex || data.accent || '#000000',
          accentRgb: data.accentRgb || data.rgb || '0,0,0',
          strategies: data.strategies || [],
          processingTime: data.processingTime || 0,
          trackUri: data.trackUri || data.uri || 'unknown'
        };
        
      case 'music:beat':
        return {
          bpm: data.bpm || data.tempo || 120,
          intensity: data.intensity || data.energy || 0.5,
          timestamp: data.timestamp || Date.now(),
          confidence: data.confidence || 0.8
        };
        
      case 'music:energy':
        return {
          energy: data.energy || data.value || 0.5,
          valence: data.valence || 0.5,
          tempo: data.tempo || data.bpm || 120,
          timestamp: data.timestamp || Date.now()
        };
        
      case 'music:track-changed':
        return {
          trackUri: data.trackUri || data.uri || 'unknown',
          artist: data.artist || data.artistName || 'Unknown Artist',
          title: data.title || data.trackName || 'Unknown Title',
          albumArt: data.albumArt || data.imageUrl,
          timestamp: data.timestamp || Date.now()
        };
        
      case 'settings:changed':
        return {
          setting: data.setting || 'unknown',
          value: data.value,
          timestamp: data.timestamp || Date.now()
        };
        
      default:
        return data;
    }
  }

  /**
   * Get migration metrics for monitoring
   */
  public getMetrics(): typeof this.migrationMetrics {
    return { ...this.migrationMetrics };
  }

  /**
   * Compatibility method for cleanup
   */
  public destroy(): void {
    // UnifiedEventBus manages its own lifecycle
    this.migrationMetrics = {
      totalLegacyEvents: 0,
      totalUnifiedEvents: 0,
      conversionRate: 0
    };
  }
}

// Export for compatibility with tests
export default EventMigrationManager;