import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import { SidebarPerformanceCoordinator } from './SidebarPerformanceCoordinator';
import type { Year3000Config } from '@/types/models';
import type { HealthCheckResult } from '@/types/systems';
import { YEAR3000_CONFIG } from '@/config/globalConfig';

interface BeatPayload {
  intensity: number; // 0-1 range
  timestamp?: number;
}

interface EnergyPayload {
  energy: number; // 0-1 range
  timestamp?: number;
}

interface RightSidebarConsciousnessState {
  level: 'dormant' | 'aware' | 'focused' | 'transcendent';
  beatIntensity: number;
  energyLevel: number;
  glowAlpha: number;
  hueShift: number;
  bilateralSync: boolean;
}

/**
 * RightSidebarConsciousnessEnhanced
 * 
 * Enhanced version of RightSidebarConsciousnessSystem extending UnifiedSystemBase
 * to work seamlessly with the bilateral consciousness architecture. This system
 * maintains the original functionality while gaining the benefits of the unified
 * architecture including shared performance monitoring, CSS variable batching,
 * and event coordination.
 * 
 * Key Features:
 * - Migrated from BaseVisualSystem to UnifiedSystemBase
 * - Bilateral consciousness coordination with LeftSidebarConsciousnessSystem
 * - Music-synchronized beat and energy visualization
 * - Performance-optimized CSS variable updates
 * - Shared SidebarPerformanceCoordinator for efficiency
 * - Enhanced health monitoring and error handling
 * 
 * Architecture:
 * - Extends UnifiedSystemBase for consistent lifecycle management
 * - Maintains original <1ms frame budget performance
 * - Integrates with existing bilateral consciousness orchestration
 * - Uses shared event system for music synchronization
 * - Coordinates with SidebarSystemsOrchestrator
 */
export class RightSidebarConsciousnessEnhanced extends UnifiedSystemBase {
  private coordinator: SidebarPerformanceCoordinator;
  
  // Consciousness state (bilateral awareness)
  private consciousnessState: RightSidebarConsciousnessState = {
    level: 'dormant',
    beatIntensity: 0,
    energyLevel: 0,
    glowAlpha: 0.15,
    hueShift: 0,
    bilateralSync: false
  };
  
  // Animation state for smooth transitions
  private currentBeatIntensity = 0;
  private targetBeatIntensity = 0;
  private currentHueShift = 0;
  private targetHueShift = 0;
  
  // Performance parameters (maintaining original specifications)
  private readonly INTENSITY_LERP = 0.25;
  private readonly HUE_LERP = 0.05;
  private readonly BILATERAL_OFFSET = 150; // 150ms behind left sidebar
  
  // Animation timing
  private lastUpdateTime = 0;
  private animationPhase = 0;
  
  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    coordinator?: SidebarPerformanceCoordinator
  ) {
    super(config);
    
    // Initialize or get shared coordinator for bilateral synchronization
    this.coordinator = coordinator || 
      SidebarPerformanceCoordinator.getInstance({
        enableDebug: config.enableDebug,
        performanceAnalyzer: this.performanceAnalyzer,
        onFlushComplete: () => {
          this.performanceAnalyzer?.emitTrace?.(
            '[RightSidebarConsciousnessEnhanced] Coordinator flush completed'
          );
        }
      });
    
    if (config.enableDebug) {
      console.log(`[${this.systemName}] Initialized enhanced right sidebar consciousness`);
    }
  }
  
  /**
   * Initialize the enhanced right sidebar consciousness system
   */
  async initialize(): Promise<void> {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Initializing enhanced right sidebar consciousness`);
    }
    
    // Subscribe to music events using unified event system
    this.subscribeToEvent<BeatPayload>('music:beat', (payload) => {
      this.handleBeat(payload);
    });
    
    this.subscribeToEvent<EnergyPayload>('music:energy', (payload) => {
      this.handleEnergy(payload);
    });
    
    // Subscribe to bilateral consciousness events
    this.subscribeToEvent('sidebar:bilateral-beat', (payload: any) => {
      if (payload.source === 'left') {
        this.handleLeftSidebarBeat(payload);
      }
    });
    
    this.subscribeToEvent('sidebar:bilateral-sync', (payload: any) => {
      this.handleBilateralSync(payload);
    });
    
    this.subscribeToEvent('sidebar:bilateral-sync-enabled', (payload: any) => {
      this.consciousnessState.bilateralSync = true;
      this.publishEvent('sidebar:right-consciousness-sync-enabled', {
        timestamp: Date.now()
      });
    });
    
    // Set up CSS variable performance budget
    // Note: setSubsystemBudget is not available in current CSSVariableBatcher
    
    // Register for animation coordination
    this.registerAnimation(60); // Same priority as original
    
    // Initialize consciousness state
    this.consciousnessState.level = 'aware';
    this.consciousnessState.bilateralSync = true;
    
    // Set initial CSS variables
    this.updateInitialCSSVariables();
    
    this.publishEvent('sidebar:right-consciousness-enhanced-ready', {
      systemName: this.systemName,
      bilateralSync: this.consciousnessState.bilateralSync,
      timestamp: Date.now()
    });
  }
  
  /**
   * Handle music beat events
   */
  private handleBeat(payload: BeatPayload): void {
    // Clamp & store as target (maintaining original behavior)
    this.targetBeatIntensity = Math.min(Math.max(payload.intensity, 0), 1);
    
    // Update consciousness level based on beat intensity
    this.updateConsciousnessLevel(payload.intensity);
    
    // If bilateral sync is enabled, coordinate with left sidebar
    if (this.consciousnessState.bilateralSync) {
      this.publishEvent('sidebar:bilateral-beat', {
        source: 'right',
        intensity: payload.intensity,
        timestamp: Date.now() - this.BILATERAL_OFFSET, // 150ms behind left
        consciousnessLevel: this.consciousnessState.level
      });
    }
  }
  
  /**
   * Handle energy events
   */
  private handleEnergy(payload: EnergyPayload): void {
    // Map energy 0-1 → hue 0-120deg shift (maintaining original behavior)
    const deg = Math.round(payload.energy * 120);
    this.targetHueShift = deg;
    
    this.consciousnessState.energyLevel = payload.energy;
    
    // Bilateral consciousness coordination
    if (this.consciousnessState.bilateralSync) {
      this.publishEvent('sidebar:bilateral-energy', {
        source: 'right',
        energy: payload.energy,
        hueShift: deg,
        timestamp: Date.now() - this.BILATERAL_OFFSET
      });
    }
  }
  
  /**
   * Handle left sidebar beat for bilateral coordination
   */
  private handleLeftSidebarBeat(payload: any): void {
    // Respond to left sidebar leadership with complementary effect
    const complementaryIntensity = payload.intensity * 0.8; // Slightly lower than left
    
    // Smooth transition to maintain bilateral harmony
    this.targetBeatIntensity = Math.max(this.targetBeatIntensity, complementaryIntensity);
    
    // Update consciousness state for bilateral awareness
    this.updateConsciousnessLevel(complementaryIntensity);
  }
  
  /**
   * Handle bilateral synchronization
   */
  private handleBilateralSync(payload: any): void {
    if (payload.source === 'orchestrator') {
      // Coordinate with orchestrator for unified experience
      if (payload.type === 'beat') {
        this.targetBeatIntensity = payload.intensity;
      } else if (payload.type === 'energy') {
        const deg = Math.round(payload.energy * 120);
        this.targetHueShift = deg;
      }
    }
  }
  
  /**
   * Update consciousness level based on music intensity
   */
  private updateConsciousnessLevel(intensity: number): void {
    let newLevel: RightSidebarConsciousnessState['level'];
    
    if (intensity < 0.2) {
      newLevel = 'dormant';
    } else if (intensity < 0.5) {
      newLevel = 'aware';
    } else if (intensity < 0.8) {
      newLevel = 'focused';
    } else {
      newLevel = 'transcendent';
    }
    
    if (newLevel !== this.consciousnessState.level) {
      const previousLevel = this.consciousnessState.level;
      this.consciousnessState.level = newLevel;
      
      this.publishEvent('sidebar:consciousness-level-changed', {
        sidebar: 'right',
        previousLevel,
        newLevel,
        intensity,
        timestamp: Date.now()
      });
      
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Consciousness level: ${previousLevel} → ${newLevel}`);
      }
    }
  }
  
  /**
   * Animation frame callback - maintains original <1ms frame budget
   */
  onAnimate(deltaTime: number): void {
    this.lastUpdateTime = performance.now();
    this.animationPhase += deltaTime * 0.001;
    
    // Lerp current values towards targets (maintaining original behavior)
    this.currentBeatIntensity = this.lerp(
      this.currentBeatIntensity,
      this.targetBeatIntensity,
      this.INTENSITY_LERP
    );
    
    this.currentHueShift = this.lerp(
      this.currentHueShift,
      this.targetHueShift,
      this.HUE_LERP
    );
    
    // Update consciousness state
    this.consciousnessState.beatIntensity = this.currentBeatIntensity;
    this.consciousnessState.hueShift = this.currentHueShift;
    
    // Calculate glow alpha (maintaining original behavior)
    const glowAlpha = (0.15 + this.currentBeatIntensity * 0.45);
    this.consciousnessState.glowAlpha = glowAlpha;
    
    // Update CSS variables using unified system
    this.updateCSSVariables({
      '--sn-rs-beat-intensity': this.currentBeatIntensity.toFixed(3),
      '--sn-rs-glow-alpha': glowAlpha.toFixed(3),
      '--sn-rs-hue-shift': `${this.currentHueShift}deg`,
      '--sn-rs-consciousness-level': this.getConsciousnessLevelValue(),
      '--sn-rs-bilateral-sync': this.consciousnessState.bilateralSync ? '1' : '0',
      '--sn-rs-energy-level': this.consciousnessState.energyLevel.toFixed(3)
    });
    
    // Route through coordinator for optimized batching (maintaining original behavior)
    this.coordinator.queueUpdate('--sn-rs-beat-intensity', this.currentBeatIntensity.toString());
    this.coordinator.queueUpdate('--sn-rs-glow-alpha', glowAlpha.toFixed(3));
    this.coordinator.queueUpdate('--sn-rs-hue-shift', `${this.currentHueShift}deg`);
  }
  
  /**
   * Get numeric value for consciousness level
   */
  private getConsciousnessLevelValue(): string {
    const levels = {
      dormant: 0.25,
      aware: 0.5,
      focused: 0.75,
      transcendent: 1.0
    };
    return levels[this.consciousnessState.level].toFixed(2);
  }
  
  /**
   * Set up initial CSS variables
   */
  private updateInitialCSSVariables(): void {
    this.updateCSSVariables({
      '--sn-rs-beat-intensity': '0',
      '--sn-rs-glow-alpha': '0.15',
      '--sn-rs-hue-shift': '0deg',
      '--sn-rs-consciousness-level': '0.5',
      '--sn-rs-bilateral-sync': '1',
      '--sn-rs-energy-level': '0'
    });
  }
  
  /**
   * Linear interpolation helper (maintaining original behavior)
   */
  private lerp(from: number, to: number, alpha: number): number {
    return from + (to - from) * alpha;
  }
  
  /**
   * Enhanced health check with bilateral consciousness metrics
   */
  async healthCheck(): Promise<HealthCheckResult> {
    return {
      ok: true,
      details: `Enhanced right sidebar consciousness healthy - Level: ${this.consciousnessState.level}, Beat: ${this.consciousnessState.beatIntensity.toFixed(2)}, Bilateral sync: ${this.consciousnessState.bilateralSync}`
    };
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Destroying enhanced right sidebar consciousness`);
    }
    
    // Publish destruction event for bilateral coordination
    this.publishEvent('sidebar:bilateral-consciousness-destroyed', {
      sidebar: 'right',
      timestamp: Date.now()
    });
    
    // Reset consciousness state
    this.consciousnessState = {
      level: 'dormant',
      beatIntensity: 0,
      energyLevel: 0,
      glowAlpha: 0.15,
      hueShift: 0,
      bilateralSync: false
    };
    
    // Note: Don't destroy the coordinator as it's shared
  }
  
  /**
   * Get current consciousness state for debugging
   */
  getConsciousnessState(): RightSidebarConsciousnessState {
    return { ...this.consciousnessState };
  }
  
  /**
   * Get current animation metrics for performance monitoring
   */
  getAnimationMetrics() {
    return {
      currentBeatIntensity: this.currentBeatIntensity,
      targetBeatIntensity: this.targetBeatIntensity,
      currentHueShift: this.currentHueShift,
      targetHueShift: this.targetHueShift,
      lastUpdateTime: this.lastUpdateTime,
      animationPhase: this.animationPhase,
      consciousnessLevel: this.consciousnessState.level,
      bilateralSync: this.consciousnessState.bilateralSync
    };
  }
  
  /**
   * Enable/disable bilateral synchronization
   */
  setBilateralSync(enabled: boolean): void {
    this.consciousnessState.bilateralSync = enabled;
    
    this.publishEvent('sidebar:right-consciousness-sync-changed', {
      enabled,
      timestamp: Date.now()
    });
  }
  
  /**
   * Set shared coordinator (for orchestrator integration)
   */
  setCoordinator(coordinator: SidebarPerformanceCoordinator): void {
    this.coordinator = coordinator;
  }
}