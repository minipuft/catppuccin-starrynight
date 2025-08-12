/**
 * WebGL Gradient Background Adapter
 * 
 * Adapts the existing WebGLGradientBackgroundSystem to work with 
 * the simplified UnifiedWebGLController approach while maintaining
 * all existing functionality.
 */

import { WebGLGradientBackgroundSystem } from "../background/WebGLRenderer";
import type { WebGLSystemInterface } from "@/core/webgl/WebGLSystemInterface";
import type { WebGLQuality } from "@/core/webgl/UnifiedWebGLController";
import { WebGLQualityMapper } from "@/core/webgl/WebGLSystemInterface";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";

export class WebGLGradientAdapter implements WebGLSystemInterface {
  private system: WebGLGradientBackgroundSystem;
  private enabled = false;
  private quality: WebGLQuality = 'medium';

  constructor(system: WebGLGradientBackgroundSystem) {
    this.system = system;
    Y3KDebug?.debug?.log("WebGLGradientAdapter", "Created adapter for WebGL gradient system");
  }

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    
    this.enabled = enabled;
    
    if (enabled) {
      // Enable the system and apply current quality
      this._enableSystem();
    } else {
      // Disable the system
      this._disableSystem();
    }
    
    Y3KDebug?.debug?.log("WebGLGradientAdapter", `WebGL gradient ${enabled ? 'enabled' : 'disabled'}`);
  }

  setQuality(quality: WebGLQuality): void {
    if (this.quality === quality) return;
    
    this.quality = quality;
    
    // Apply quality settings if system is enabled
    if (this.enabled) {
      this._applyQualitySettings();
    }
    
    Y3KDebug?.debug?.log("WebGLGradientAdapter", `Quality set to ${quality}`);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isCapable(): boolean {
    // Check if WebGL is available on this device
    return this._checkWebGLCapability();
  }

  getQuality(): WebGLQuality {
    return this.quality;
  }

  getSystemName(): string {
    return "WebGL Gradient Background";
  }

  private _enableSystem(): void {
    try {
      // Map simplified settings to the existing system's settings format
      const intensityMapping = this._mapQualityToIntensity(this.quality);
      
      // Enable the system through the existing SettingsManager approach
      if (this.system['settingsManager']) {
        // Set the flow gradient intensity setting
        this.system['settingsManager'].set('sn-gradient-intensity', intensityMapping);
        
        // Force WebGL enabled
        this.system['settingsManager'].set('sn-webgl-enabled', 'true');
      }
      
      // If system wasn't initialized, initialize it
      if (!this.system.initialized) {
        this.system.initialize();
      }
      
      // Apply quality-specific settings
      this._applyQualitySettings();
      
    } catch (error) {
      Y3KDebug?.debug?.warn("WebGLGradientAdapter", "Failed to enable system:", error);
    }
  }

  private _disableSystem(): void {
    try {
      if (this.system['settingsManager']) {
        // Disable flow gradient
        this.system['settingsManager'].set('sn-gradient-intensity', 'disabled');
      }
      
      // Call the system's disable/destroy methods if available
      if (typeof (this.system as any)['disable'] === 'function') {
        (this.system as any)['disable']();
      } else if (typeof this.system.destroy === 'function') {
        this.system.destroy();
      }
      
    } catch (error) {
      Y3KDebug?.debug?.warn("WebGLGradientAdapter", "Failed to disable system:", error);
    }
  }

  private _applyQualitySettings(): void {
    try {
      const settings = this.system['settings'];
      if (!settings) return;

      // Apply quality-based parameters
      settings.flowStrength = this._getFlowStrength(this.quality);
      settings.noiseScale = this._getNoiseScale(this.quality);
      settings.corridorIntensity = this._getColorIntensity(this.quality);
      
      // Apply update frequency
      const updateFrequency = WebGLQualityMapper.getUpdateFrequency(this.quality);
      if ((this.system as any)['updateFrequency'] !== undefined) {
        (this.system as any)['updateFrequency'] = updateFrequency;
      }
      
      // Force a repaint if the system supports it
      if (typeof this.system.forceRepaint === 'function') {
        this.system.forceRepaint(`quality-change-${this.quality}`);
      }
      
    } catch (error) {
      Y3KDebug?.debug?.warn("WebGLGradientAdapter", "Failed to apply quality settings:", error);
    }
  }

  private _mapQualityToIntensity(quality: WebGLQuality): 'disabled' | 'minimal' | 'balanced' | 'intense' {
    switch (quality) {
      case 'low': return 'minimal';
      case 'medium': return 'balanced';
      case 'high': return 'intense';
      default: return 'balanced';
    }
  }

  private _getFlowStrength(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 0.3;
      case 'medium': return 0.7;
      case 'high': return 1.0;
      default: return 0.7;
    }
  }

  private _getAnimationSpeed(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 0.5;
      case 'medium': return 0.8;
      case 'high': return 1.2;
      default: return 0.8;
    }
  }

  private _getNoiseScale(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 1.5;
      case 'medium': return 2.0;
      case 'high': return 2.8;
      default: return 2.0;
    }
  }

  private _getColorIntensity(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 0.6;
      case 'medium': return 0.8;
      case 'high': return 1.0;
      default: return 0.8;
    }
  }

  private _checkWebGLCapability(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      canvas.remove();
      return gl !== null;
    } catch {
      return false;
    }
  }
}