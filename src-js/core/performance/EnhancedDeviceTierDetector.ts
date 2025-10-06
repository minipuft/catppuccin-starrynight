/**
 * Enhanced Device Tier Detector - Backward Compatibility Layer
 * 
 * This file now provides backward compatibility while delegating all
 * functionality to the enhanced DeviceCapabilityDetector.
 * 
 * Phase 1.2 Consolidation: All enhanced tier detection features have been merged
 * into DeviceCapabilityDetector for reduced code duplication.
 */

import { DeviceCapabilityDetector, type TierDetectionResult } from './DeviceCapabilityDetector';
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type { PerformanceTier } from "./SimpleTierBasedPerformanceSystem";

// Re-export types for backward compatibility
export interface DeviceCapabilities {
  memory: number; // GB
  cores: number;
  webgl: boolean;
  webgl2: boolean;
  userAgent: string;
  platform: string;
  hardwareInfo: {
    isHighEnd: boolean;
    isMobile: boolean;
    isOldDevice: boolean;
    hasPerformanceIndicators: boolean;
  };
}

export { TierDetectionResult };

/**
 * Enhanced Device Tier Detector - Backward Compatibility Wrapper
 * 
 * All functionality now delegated to DeviceCapabilityDetector.
 * This class exists purely for backward compatibility during migration.
 */
export class EnhancedDeviceTierDetector {
  /**
   * Detect device performance tier with focus on giving most users full experience
   * @deprecated Use DeviceCapabilityDetector.detectTier() instead
   */
  public static detectTier(): TierDetectionResult {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(
        '⚠️  [EnhancedDeviceTierDetector] This class is deprecated. ' +
        'Use DeviceCapabilityDetector.detectTier() instead. ' +
        'This compatibility layer will be removed in a future version.'
      );
    }

    // Delegate to enhanced DeviceCapabilityDetector
    const result = DeviceCapabilityDetector.detectTier();
    
    Y3KDebug?.debug?.log("EnhancedDeviceTierDetector", "Compatibility layer - delegating to DeviceCapabilityDetector", result);
    
    return result;
  }

  /**
   * Legacy method compatibility - _analyzeDeviceCapabilities
   * @deprecated Use DeviceCapabilityDetector.detectTier() instead
   */
  private static _analyzeDeviceCapabilities(): DeviceCapabilities {
    const memory = (navigator as any).deviceMemory || this._estimateMemory();
    const cores = navigator.hardwareConcurrency || this._estimateCores();
    const webgl = this._checkWebGLSupport();
    const webgl2 = this._checkWebGL2Support();
    const userAgent = navigator.userAgent;
    const platform = navigator.platform || 'unknown';
    
    return {
      memory,
      cores,
      webgl,
      webgl2,
      userAgent,
      platform,
      hardwareInfo: {
        isHighEnd: this._detectHighEndHardware(memory, cores, userAgent),
        isMobile: this._isMobileDevice(userAgent, platform),
        isOldDevice: this._isOldDevice(userAgent),
        hasPerformanceIndicators: this._hasPerformanceIndicators(userAgent)
      }
    };
  }

  // Legacy helper methods for backward compatibility
  private static _estimateMemory(): number {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android')) return 4;
    if (ua.includes('ipad') || ua.includes('tablet')) return 6;
    return 8;
  }

  private static _estimateCores(): number {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('mobile')) return 4;
    return 4;
  }

  private static _checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const hasWebGL = gl !== null;
      canvas.remove();
      return hasWebGL;
    } catch {
      return false;
    }
  }

  private static _checkWebGL2Support(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      const hasWebGL2 = gl !== null;
      canvas.remove();
      return hasWebGL2;
    } catch {
      return false;
    }
  }

  private static _detectHighEndHardware(memory: number, cores: number, userAgent: string): boolean {
    const ua = userAgent.toLowerCase();
    const indicators = [
      ua.includes('gaming'),
      ua.includes('nvidia'),
      ua.includes('amd'),
      ua.includes('geforce'),
      ua.includes('radeon'),
      memory >= 16,
      cores >= 8
    ];
    return indicators.filter(Boolean).length >= 2;
  }

  private static _isMobileDevice(userAgent: string, platform: string): boolean {
    const ua = userAgent.toLowerCase();
    const p = platform.toLowerCase();
    return (
      ua.includes('mobile') ||
      ua.includes('android') ||
      ua.includes('iphone') ||
      ua.includes('ipad') ||
      p.includes('arm') ||
      'ontouchstart' in window
    );
  }

  private static _isOldDevice(userAgent: string): boolean {
    const ua = userAgent.toLowerCase();
    const oldBrowsers = [
      /chrome\/[1-6]\d\./, // Chrome < 70
      /firefox\/[1-5]\d\./, // Firefox < 60
      /safari\/[1-9]\./, // Very old Safari
      /msie|trident/, // Internet Explorer
    ];
    return oldBrowsers.some(pattern => pattern.test(ua));
  }

  private static _hasPerformanceIndicators(userAgent: string): boolean {
    const ua = userAgent.toLowerCase();
    const indicators = [
      'nvidia', 'amd', 'geforce', 'radeon', 'quadro', 'gaming', 'performance'
    ];
    return indicators.some(indicator => ua.includes(indicator));
  }

  /**
   * Get device description string for debugging and logging
   * @deprecated Use DeviceCapabilityDetector.getDeviceInfo() instead
   */
  public static getDeviceDescription(capabilities: DeviceCapabilities): string {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(
        '⚠️  [EnhancedDeviceTierDetector] getDeviceDescription is deprecated. ' +
        'Use DeviceCapabilityDetector.getDeviceInfo() instead.'
      );
    }

    const { memory, cores, platform, hardwareInfo } = capabilities;
    const deviceType = hardwareInfo.isMobile ? 'Mobile' : 'Desktop';
    const qualifiers = [];
    
    if (hardwareInfo.isHighEnd) qualifiers.push('High-End');
    if (hardwareInfo.isOldDevice) qualifiers.push('Legacy');
    
    return `${deviceType} Device (${memory}GB RAM, ${cores} cores, ${platform})${qualifiers.length ? ` [${qualifiers.join(', ')}]` : ''}`;
  }
}

// ===================================================================
// MIGRATION HELPERS
// ===================================================================

/**
 * Migration helper: Create TierDetectionResult using DeviceCapabilityDetector
 */
export function createTierDetectionFromCapabilities(): TierDetectionResult {
  return DeviceCapabilityDetector.detectTier();
}

/**
 * Deprecation warning for direct usage
 */
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️  [EnhancedDeviceTierDetector] This class is deprecated. ' +
    'Use DeviceCapabilityDetector.detectTier() instead. ' +
    'This compatibility layer will be removed in a future version.'
  );
}