/**
 * WebGL System Interface for Unified Controller Integration
 * 
 * This interface defines the contract that WebGL systems must implement
 * to work with the UnifiedWebGLController's simplified approach.
 */

import type { WebGLQuality } from "./UnifiedWebGLController";

export interface WebGLSystemInterface {
  /**
   * Set enabled/disabled state for this WebGL system
   * @param enabled - Whether the system should be active
   */
  setEnabled(enabled: boolean): void;

  /**
   * Set quality level for this WebGL system
   * @param quality - Simple 3-tier quality level
   */
  setQuality(quality: WebGLQuality): void;

  /**
   * Check if this system is currently enabled
   */
  isEnabled(): boolean;

  /**
   * Check if this system is capable of running (device supports it)
   */
  isCapable(): boolean;

  /**
   * Get current quality level
   */
  getQuality(): WebGLQuality;

  /**
   * Get system name for debugging
   */
  getSystemName(): string;
}

/**
 * Quality mapping utilities for systems that need to translate
 * simple quality levels to their specific parameters
 */
export class WebGLQualityMapper {
  /**
   * Map quality level to animation density (0.0 - 1.0)
   */
  static getAnimationDensity(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 0.3;
      case 'medium': return 0.7;
      case 'high': return 1.0;
    }
  }

  /**
   * Map quality level to update frequency (Hz)
   */
  static getUpdateFrequency(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 30;
      case 'medium': return 45;
      case 'high': return 60;
    }
  }

  /**
   * Map quality level to shader complexity (0.0 - 1.0)
   */
  static getShaderComplexity(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 0.4;
      case 'medium': return 0.7;
      case 'high': return 1.0;
    }
  }

  /**
   * Map quality level to particle count multiplier
   */
  static getParticleMultiplier(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 0.3;
      case 'medium': return 0.6;
      case 'high': return 1.0;
    }
  }

  /**
   * Check if corridor effects should be enabled at this quality level
   */
  static shouldEnableCorridorEffects(quality: WebGLQuality): boolean {
    return quality === 'medium' || quality === 'high';
  }

  /**
   * Check if advanced features should be enabled at this quality level
   */
  static shouldEnableAdvancedFeatures(quality: WebGLQuality): boolean {
    return quality === 'high';
  }

  /**
   * Get CSS mix-blend-mode based on quality level
   */
  static getBlendMode(quality: WebGLQuality): string {
    switch (quality) {
      case 'low': return 'normal';
      case 'medium': return 'screen';
      case 'high': return 'screen';
    }
  }

  /**
   * Get frame throttling based on quality level (ms between frames)
   */
  static getFrameThrottling(quality: WebGLQuality): number {
    switch (quality) {
      case 'low': return 33; // ~30fps
      case 'medium': return 22; // ~45fps
      case 'high': return 16; // ~60fps
    }
  }
}