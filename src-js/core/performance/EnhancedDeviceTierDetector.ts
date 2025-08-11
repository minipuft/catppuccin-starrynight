/**
 * Enhanced Device Tier Detector
 * 
 * Focuses on giving most modern devices the full experience.
 * Only very budget/old devices get restrictions.
 */

import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { PerformanceTier } from "./SimpleTierBasedPerformanceSystem";

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

export interface TierDetectionResult {
  tier: PerformanceTier;
  confidence: number; // 0-1
  reasoning: string[];
  capabilities: DeviceCapabilities;
}

export class EnhancedDeviceTierDetector {
  /**
   * Detect device performance tier with focus on giving most users full experience
   */
  public static detectTier(): TierDetectionResult {
    const capabilities = this._analyzeDeviceCapabilities();
    const reasoning: string[] = [];
    
    let tier: PerformanceTier = 'medium'; // Default to full experience
    let confidence = 0.8; // Default confidence
    
    // High Tier Detection: True high-end devices only
    if (this._isHighTierDevice(capabilities, reasoning)) {
      tier = 'high';
      confidence = 0.9;
    }
    // Low Tier Detection: Only very budget/old devices
    else if (this._isLowTierDevice(capabilities, reasoning)) {
      tier = 'low';
      confidence = 0.85;
    }
    // Medium Tier: Most modern devices (default)
    else {
      reasoning.push('Standard modern device - full experience enabled');
      reasoning.push(`${capabilities.memory}GB RAM, ${capabilities.cores} cores, WebGL2: ${capabilities.webgl2}`);
    }
    
    const result: TierDetectionResult = {
      tier,
      confidence,
      reasoning,
      capabilities
    };
    
    Y3KDebug?.debug?.log("EnhancedDeviceTierDetector", "Tier detection complete", result);
    
    return result;
  }

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

  private static _isHighTierDevice(capabilities: DeviceCapabilities, reasoning: string[]): boolean {
    const { memory, cores, webgl2, hardwareInfo } = capabilities;
    
    // Primary high-end criteria
    const hasHighEndSpecs = memory >= 8 && cores >= 6 && webgl2;
    
    if (!hasHighEndSpecs) {
      return false;
    }
    
    // Additional high-end indicators
    const indicators = [];
    
    if (memory >= 16) indicators.push('16+GB RAM');
    if (cores >= 8) indicators.push('8+ CPU cores');
    if (hardwareInfo.hasPerformanceIndicators) indicators.push('Performance GPU detected');
    if (hardwareInfo.isHighEnd) indicators.push('High-end hardware signatures');
    
    // Need at least 2 high-end indicators beyond base specs
    if (indicators.length >= 2) {
      reasoning.push('High-end device detected');
      reasoning.push(`Specs: ${memory}GB RAM, ${cores} cores, WebGL2: ${webgl2}`);
      reasoning.push(`Indicators: ${indicators.join(', ')}`);
      return true;
    }
    
    // Gaming/workstation detection
    if (this._isGamingOrWorkstation(capabilities)) {
      reasoning.push('Gaming/workstation device detected');
      reasoning.push(`High-performance device indicators found`);
      return true;
    }
    
    return false;
  }

  private static _isLowTierDevice(capabilities: DeviceCapabilities, reasoning: string[]): boolean {
    const { memory, cores, webgl2, hardwareInfo } = capabilities;
    
    // Very restrictive low-tier criteria - only truly limited devices
    const reasons = [];
    
    // Memory restrictions (very low memory only)
    if (memory < 4) {
      reasons.push(`Low memory: ${memory}GB`);
    }
    
    // CPU restrictions (very few cores only)
    if (cores < 4) {
      reasons.push(`Few CPU cores: ${cores}`);
    }
    
    // WebGL restrictions (no WebGL2 support)
    if (!webgl2) {
      reasons.push('No WebGL2 support');
    }
    
    // Old device detection
    if (hardwareInfo.isOldDevice) {
      reasons.push('Legacy device detected');
    }
    
    // Mobile with very limited specs
    if (hardwareInfo.isMobile && memory <= 4 && cores <= 4) {
      reasons.push('Resource-constrained mobile device');
    }
    
    // Need multiple limiting factors for low tier
    if (reasons.length >= 2) {
      reasoning.push('Budget/legacy device detected - enabling performance optimizations');
      reasoning.push(...reasons);
      return true;
    }
    
    return false;
  }

  private static _estimateMemory(): number {
    // Conservative memory estimation for devices without deviceMemory API
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('mobile') || ua.includes('android')) {
      return 4; // Most mobile devices have at least 4GB now
    }
    
    if (ua.includes('ipad') || ua.includes('tablet')) {
      return 6; // iPads typically have good specs
    }
    
    return 8; // Desktop default - most desktops have 8GB+
  }

  private static _estimateCores(): number {
    // Conservative core estimation
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('mobile')) {
      return 4; // Most modern mobile devices have 4+ cores
    }
    
    return 4; // Safe desktop default
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
    
    // Hardware indicators
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
    
    // Old browser versions that indicate legacy hardware
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
    
    // GPU/Performance indicators in user agent
    const indicators = [
      'nvidia',
      'amd',
      'geforce',
      'radeon',
      'quadro',
      'gaming',
      'performance'
    ];
    
    return indicators.some(indicator => ua.includes(indicator));
  }

  private static _isGamingOrWorkstation(capabilities: DeviceCapabilities): boolean {
    const { userAgent, memory, cores } = capabilities;
    const ua = userAgent.toLowerCase();
    
    // Gaming device indicators
    const gamingIndicators = [
      ua.includes('gaming'),
      ua.includes('rog'), // ASUS ROG
      ua.includes('msi'),
      ua.includes('alienware'),
      ua.includes('predator'), // Acer Predator
      memory >= 16 && cores >= 8
    ];
    
    return gamingIndicators.some(Boolean);
  }

  /**
   * Get a human-readable description of the device capabilities
   */
  public static getDeviceDescription(capabilities: DeviceCapabilities): string {
    const { memory, cores, webgl2, hardwareInfo } = capabilities;
    
    let description = `${memory}GB RAM, ${cores} CPU cores`;
    
    if (webgl2) description += ', WebGL2';
    if (hardwareInfo.isHighEnd) description += ', High-end hardware';
    if (hardwareInfo.isMobile) description += ', Mobile device';
    if (hardwareInfo.hasPerformanceIndicators) description += ', Performance GPU';
    
    return description;
  }
}