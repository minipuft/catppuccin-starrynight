/**
 * UnifiedWebGLController - Simplified WebGL Management System
 * 
 * Replaces the complex continuous quality scaling approach with a simple,
 * developer-friendly unified controller that manages all WebGL effects together.
 * 
 * Key Philosophy:
 * - WebGL enabled -> All WebGL effects work together
 * - WebGL disabled -> CSS fallbacks only
 * - Simple 3-tier quality system instead of 0-100 scaling
 * - Single source of truth for WebGL state
 */

import { Y3KDebug } from "@/debug/DebugCoordinator";
import { unifiedEventBus } from "@/core/events/EventBus";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";

export type WebGLQuality = 'low' | 'medium' | 'high';
export type WebGLState = 'disabled' | 'css-fallback' | 'webgl-active';

export interface WebGLSystemReference {
  system: any; // The actual system instance
  name: string;
  priority: number; // For initialization order
}

export interface WebGLControllerConfig {
  enabled: boolean;
  quality: WebGLQuality;
  forceEnabled: boolean; // Override device capability detection
  allowPerformanceAdjustment: boolean; // Allow performance system to adjust quality
}

/**
 * Unified WebGL Controller
 * 
 * Manages all WebGL effects as a cohesive unit:
 * - WebGL Background System
 * - Flow Gradient Effects
 * - Corridor Effects
 * - Performance-aware quality scaling
 */
export class UnifiedWebGLController implements IManagedSystem {
  public initialized = false;
  private config: WebGLControllerConfig;
  private currentState: WebGLState = 'disabled';
  private deviceCapabilities: DeviceCapabilityDetector;
  
  // Registered WebGL systems (ordered by priority)
  private webglSystems = new Map<string, WebGLSystemReference>();
  
  // Performance monitoring
  private lastStateChange = 0;
  private stateChangeHistory: Array<{ state: WebGLState; quality: WebGLQuality; timestamp: number }> = [];
  
  // User preference tracking
  private userExplicitlyDisabled = false;
  private userExplicitQuality: WebGLQuality | null = null;

  constructor(deviceCapabilities: DeviceCapabilityDetector) {
    this.deviceCapabilities = deviceCapabilities;
    
    // Initialize with sensible defaults
    this.config = {
      enabled: true,
      quality: 'medium',
      forceEnabled: false,
      allowPerformanceAdjustment: true
    };
    
    Y3KDebug?.debug?.log("UnifiedWebGLController", "Initialized with unified WebGL management");
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Ensure device capabilities are available
    if (!this.deviceCapabilities.isInitialized) {
      await this.deviceCapabilities.initialize();
    }
    
    // Load settings from SettingsManager
    await this._loadSettings();
    
    // Determine initial state based on device capabilities and user preferences
    await this._determineInitialState();
    
    // Set up event listeners
    this._setupEventListeners();
    
    // Apply initial configuration to registered systems
    this._applyStateToAllSystems();
    
    this.initialized = true;
    
    Y3KDebug?.debug?.log("UnifiedWebGLController", "Initialization complete", {
      state: this.currentState,
      quality: this.config.quality,
      systemCount: this.webglSystems.size
    });
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    if (!this.initialized) {
      return {
        healthy: false,
        details: "Not initialized",
        system: "UnifiedWebGLController"
      };
    }
    
    // Check registered systems health
    const systemIssues: string[] = [];
    for (const [name, ref] of this.webglSystems) {
      if (ref.system.healthCheck) {
        try {
          const health = await ref.system.healthCheck();
          if (!health.healthy) {
            systemIssues.push(`${name}: ${health.details || 'unhealthy'}`);
          }
        } catch (error) {
          systemIssues.push(`${name}: health check failed`);
        }
      }
    }
    
    const recentStateChanges = this.stateChangeHistory
      .filter(change => Date.now() - change.timestamp < 30000).length;
      
    if (systemIssues.length > 0 || recentStateChanges > 3) {
      return {
        healthy: true, // Still working, but with issues
        details: `Issues detected: ${systemIssues.join(', ')}`,
        issues: systemIssues,
        system: "UnifiedWebGLController"
      };
    }
    
    return {
      healthy: true,
      details: "All WebGL systems operating normally",
      system: "UnifiedWebGLController"
    };
  }

  public destroy(): void {
    // Disable all WebGL systems
    this._setState('disabled');
    
    // Clear all registered systems
    this.webglSystems.clear();
    
    // Clean up event listeners
    unifiedEventBus.unsubscribe("settings:changed");
    unifiedEventBus.unsubscribe("system:state-changed");
    
    this.initialized = false;
    
    Y3KDebug?.debug?.log("UnifiedWebGLController", "Destroyed - all WebGL systems disabled");
  }

  public updateAnimation(deltaTime: number): void {
    // Forward animation updates to active WebGL systems
    if (this.currentState === 'webgl-active') {
      for (const [name, ref] of this.webglSystems) {
        if (ref.system.updateAnimation) {
          try {
            ref.system.updateAnimation(deltaTime);
          } catch (error) {
            Y3KDebug?.debug?.warn("UnifiedWebGLController", `Animation update failed for ${name}:`, error);
          }
        }
      }
    }
  }

  // =============================================================================
  // PUBLIC API - Simple Developer Interface
  // =============================================================================

  /**
   * Enable all WebGL effects
   */
  public enable(): void {
    this.userExplicitlyDisabled = false;
    this.config.enabled = true;
    this._determineAndApplyState();
    this._saveSettings();
    
    Y3KDebug?.debug?.log("UnifiedWebGLController", "WebGL enabled by user");
  }

  /**
   * Disable all WebGL effects (fallback to CSS)
   */
  public disable(): void {
    this.userExplicitlyDisabled = true;
    this.config.enabled = false;
    this._setState('css-fallback');
    this._saveSettings();
    
    Y3KDebug?.debug?.log("UnifiedWebGLController", "WebGL disabled by user");
  }

  /**
   * Set quality level for all WebGL effects
   */
  public setQuality(quality: WebGLQuality): void {
    this.userExplicitQuality = quality;
    this.config.quality = quality;
    this._applyQualityToAllSystems();
    this._saveSettings();
    
    Y3KDebug?.debug?.log("UnifiedWebGLController", `Quality set to ${quality} by user`);
  }

  /**
   * Check if WebGL is currently enabled and active
   */
  public isEnabled(): boolean {
    return this.currentState === 'webgl-active';
  }

  /**
   * Check if WebGL is available (device supports it)
   */
  public isAvailable(): boolean {
    const profile = this.deviceCapabilities.getSpicetifyProfile();
    return (profile as any)?.webglCapabilities?.available || false;
  }

  /**
   * Get current WebGL state
   */
  public getState(): WebGLState {
    return this.currentState;
  }

  /**
   * Get current quality level
   */
  public getQuality(): WebGLQuality {
    return this.config.quality;
  }

  /**
   * Force enable WebGL (override device capability detection)
   */
  public forceEnable(force: boolean = true): void {
    this.config.forceEnabled = force;
    this._determineAndApplyState();
    this._saveSettings();
    
    Y3KDebug?.debug?.log("UnifiedWebGLController", `Force enable set to ${force}`);
  }

  // =============================================================================
  // SYSTEM REGISTRATION
  // =============================================================================

  /**
   * Register a WebGL system for unified management
   */
  public registerSystem(name: string, system: any, priority: number = 0): void {
    this.webglSystems.set(name, {
      system,
      name,
      priority
    });
    
    // Apply current state to newly registered system
    if (this.initialized) {
      this._applyStateToSystem(name, system);
    }
    
    Y3KDebug?.debug?.log("UnifiedWebGLController", `System registered: ${name} (priority: ${priority})`);
  }

  /**
   * Unregister a WebGL system
   */
  public unregisterSystem(name: string): void {
    const systemRef = this.webglSystems.get(name);
    if (systemRef) {
      // Disable the system before removing it
      if (systemRef.system.setEnabled) {
        systemRef.system.setEnabled(false);
      }
      
      this.webglSystems.delete(name);
      Y3KDebug?.debug?.log("UnifiedWebGLController", `System unregistered: ${name}`);
    }
  }

  // =============================================================================
  // PERFORMANCE SYSTEM INTEGRATION
  // =============================================================================

  /**
   * Called by performance system to suggest quality adjustment
   */
  public suggestQualityAdjustment(suggestedQuality: WebGLQuality, reason: string): void {
    if (!this.config.allowPerformanceAdjustment) {
      Y3KDebug?.debug?.log("UnifiedWebGLController", `Performance adjustment ignored (not allowed): ${reason}`);
      return;
    }
    
    // Don't override explicit user quality choice
    if (this.userExplicitQuality !== null) {
      Y3KDebug?.debug?.log("UnifiedWebGLController", `Performance adjustment ignored (user set explicit quality): ${reason}`);
      return;
    }
    
    if (this.config.quality !== suggestedQuality) {
      const oldQuality = this.config.quality;
      this.config.quality = suggestedQuality;
      this._applyQualityToAllSystems();
      
      Y3KDebug?.debug?.log("UnifiedWebGLController", `Quality adjusted by performance system: ${oldQuality} → ${suggestedQuality} (${reason})`);
    }
  }

  /**
   * Called by performance system to temporarily disable WebGL
   */
  public performanceDisable(reason: string): void {
    if (!this.config.allowPerformanceAdjustment || this.userExplicitlyDisabled === false) {
      return;
    }
    
    if (this.currentState === 'webgl-active') {
      this._setState('css-fallback');
      Y3KDebug?.debug?.log("UnifiedWebGLController", `WebGL disabled by performance system: ${reason}`);
    }
  }

  /**
   * Called by performance system to re-enable WebGL when performance improves
   */
  public performanceEnable(reason: string): void {
    if (!this.config.allowPerformanceAdjustment || this.userExplicitlyDisabled) {
      return;
    }
    
    if (this.currentState === 'css-fallback' && this.config.enabled) {
      this._determineAndApplyState();
      Y3KDebug?.debug?.log("UnifiedWebGLController", `WebGL re-enabled by performance system: ${reason}`);
    }
  }

  // =============================================================================
  // PRIVATE IMPLEMENTATION
  // =============================================================================

  private async _loadSettings(): Promise<void> {
    try {
      // Load simplified settings
      const webglEnabled = localStorage.getItem('sn-webgl-enabled');
      const webglQuality = localStorage.getItem('sn-webgl-quality') as WebGLQuality;
      const webglForceEnabled = localStorage.getItem('sn-webgl-force-enabled');

      if (webglEnabled !== null) {
        this.config.enabled = webglEnabled === 'true';
        if (webglEnabled === 'false') {
          this.userExplicitlyDisabled = true;
        }
      }

      if (webglQuality && ['low', 'medium', 'high'].includes(webglQuality)) {
        this.config.quality = webglQuality;
        this.userExplicitQuality = webglQuality;
      }

      if (webglForceEnabled !== null) {
        this.config.forceEnabled = webglForceEnabled === 'true';
      }

      Y3KDebug?.debug?.log("UnifiedWebGLController", "Settings loaded", this.config);
    } catch (error) {
      Y3KDebug?.debug?.warn("UnifiedWebGLController", "Failed to load settings:", error);
    }
  }

  private _saveSettings(): void {
    try {
      localStorage.setItem('sn-webgl-enabled', this.config.enabled.toString());
      localStorage.setItem('sn-webgl-quality', this.config.quality);
      localStorage.setItem('sn-webgl-force-enabled', this.config.forceEnabled.toString());
    } catch (error) {
      Y3KDebug?.debug?.warn("UnifiedWebGLController", "Failed to save settings:", error);
    }
  }

  private async _determineInitialState(): Promise<void> {
    if (!this.config.enabled || this.userExplicitlyDisabled) {
      this._setState('css-fallback');
      return;
    }

    // Check device capabilities
    if (this.config.forceEnabled || this.isAvailable()) {
      this._setState('webgl-active');
    } else {
      this._setState('css-fallback');
    }
  }

  private _determineAndApplyState(): void {
    if (!this.config.enabled || this.userExplicitlyDisabled) {
      this._setState('css-fallback');
    } else if (this.config.forceEnabled || this.isAvailable()) {
      this._setState('webgl-active');
    } else {
      this._setState('css-fallback');
    }
  }

  private _setState(newState: WebGLState): void {
    if (this.currentState === newState) return;

    const oldState = this.currentState;
    this.currentState = newState;
    this.lastStateChange = Date.now();

    // Record state change for health monitoring
    this.stateChangeHistory.push({
      state: newState,
      quality: this.config.quality,
      timestamp: this.lastStateChange
    });

    // Keep only recent history
    if (this.stateChangeHistory.length > 20) {
      this.stateChangeHistory = this.stateChangeHistory.slice(-20);
    }

    // Apply state to all systems
    this._applyStateToAllSystems();

    // Emit performance tier change event (WebGL state affects performance)
    unifiedEventBus.emit("performance:tier-changed", {
      tier: newState as any,
      previousTier: oldState as any,
      timestamp: this.lastStateChange
    });

    Y3KDebug?.debug?.log("UnifiedWebGLController", `State changed: ${oldState} → ${newState}`);
  }

  private _applyStateToAllSystems(): void {
    // Get systems in priority order
    const sortedSystems = Array.from(this.webglSystems.entries())
      .sort(([, a], [, b]) => b.priority - a.priority);

    for (const [name, ref] of sortedSystems) {
      this._applyStateToSystem(name, ref.system);
    }
  }

  private _applyStateToSystem(name: string, system: any): void {
    try {
      const isWebGLActive = this.currentState === 'webgl-active';
      
      // Apply enabled/disabled state
      if (system.setEnabled) {
        system.setEnabled(isWebGLActive);
      }
      
      // Apply quality settings if WebGL is active
      if (isWebGLActive && system.setQuality) {
        system.setQuality(this.config.quality);
      }
      
      // For corridor effects, only enable at medium/high quality
      if (name === 'corridor-effects' && system.setEnabled) {
        const shouldEnableCorridors = isWebGLActive && 
          (this.config.quality === 'medium' || this.config.quality === 'high');
        system.setEnabled(shouldEnableCorridors);
      }
      
    } catch (error) {
      Y3KDebug?.debug?.warn("UnifiedWebGLController", `Failed to apply state to ${name}:`, error);
    }
  }

  private _applyQualityToAllSystems(): void {
    if (this.currentState !== 'webgl-active') return;

    for (const [name, ref] of this.webglSystems) {
      try {
        if (ref.system.setQuality) {
          ref.system.setQuality(this.config.quality);
        }
        
        // Special handling for corridor effects
        if (name === 'corridor-effects') {
          const shouldEnable = this.config.quality === 'medium' || this.config.quality === 'high';
          if (ref.system.setEnabled) {
            ref.system.setEnabled(shouldEnable);
          }
        }
      } catch (error) {
        Y3KDebug?.debug?.warn("UnifiedWebGLController", `Failed to apply quality to ${name}:`, error);
      }
    }
    
    // Emit performance tier change event (quality affects performance)
    unifiedEventBus.emit("performance:tier-changed", {
      tier: this.config.quality as any,
      previousTier: this.config.quality as any,
      timestamp: Date.now()
    });
  }

  private _setupEventListeners(): void {
    // Listen for settings changes
    unifiedEventBus.subscribe("settings:changed", (data) => {
      if (data.settingKey === 'sn-webgl-enabled') {
        this.config.enabled = data.newValue === 'true';
        this.userExplicitlyDisabled = data.newValue === 'false';
        this._determineAndApplyState();
      } else if (data.settingKey === 'sn-webgl-quality') {
        this.setQuality(data.newValue as WebGLQuality);
      } else if (data.settingKey === 'sn-webgl-force-enabled') {
        this.config.forceEnabled = data.newValue === 'true';
        this._determineAndApplyState();
      }
    });

    // Listen for performance tier changes
    unifiedEventBus.subscribe("performance:tier-changed", (data) => {
      // Map tier to quality if needed
      const qualityFromTier = data.tier === "excellent" ? "high" : 
                            data.tier === "good" ? "medium" : "low";
      if (qualityFromTier !== this.config.quality) {
        this.setQuality(qualityFromTier as any);
      }
    });
  }
}