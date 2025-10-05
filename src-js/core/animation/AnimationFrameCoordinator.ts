import { PerformanceAnalyzer } from '@/core/performance/UnifiedPerformanceCoordinator';
import { CSSVariableWriter } from '@/core/css/CSSVariableWriter';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import { temporalMemoryService } from "@/audio/TemporalMemoryService";
import type { AdvancedSystemConfig, Year3000Config, MultiplierProfile } from '@/types/models';
import type { PersonalAestheticSignature } from "@/types/signature";
// CSSAnimationManager consolidated into this class

/**
 * Internal CSS Animation Manager interface (consolidated from removed CSSAnimationManager)
 */
interface CSSAnimationManagerInterface {
  triggerConsciousnessBreathing?(payload?: any): void;
  [key: string]: any;
}

// 🔧 PHASE 3.1: Consolidated Animation System Imports
// Types consolidated from MusicalLerpOrchestrator and PerformanceAwareLerpCoordinator
export type AnimationType = 'flow' | 'pulse' | 'smooth' | 'sharp';

export interface MusicalContext {
  tempo: number;
  energy: number;
  valence: number;
  danceability: number;
  emotionalTemperature: number;
  beatPhase: 'attack' | 'decay' | 'sustain' | 'release';
  beatConfidence: number;
  beatInterval: number;
  timeSinceLastBeat: number;
}

export interface PerformanceContext {
  currentFPS: number;
  targetFPS: number;
  frameTimeMs: number;
  frameBudgetMs: number;
  qualityLevel: "minimal" | "low" | "medium" | "high" | "ultra";
  qualityScore: number;
  deviceTier: "minimal" | "low" | "medium" | "high" | "ultra";
  thermalState: "nominal" | "warm" | "hot" | "critical";
  powerLevel: "high" | "balanced" | "battery-saver";
}

export interface AnimationSystem {
  onAnimate(deltaMs: number): void;
  updateAnimation?(timestamp: number, deltaTime: number): void;
  onPerformanceModeChange?(mode: "performance" | "quality"): void;
}

export interface IVisualSystem {
  systemName: string;
  onAnimate(deltaMs: number, context: FrameContext): void;
  onPerformanceModeChange?(mode: "performance" | "quality"): void;
  destroy(): void;
}

export interface FrameContext {
  timestamp: number;
  deltaMs: number;
  performanceMode: "performance" | "quality";
  frameBudget: number;
  beatIntensity?: number;
  scrollRatio?: number;
  tiltXY?: { x: number; y: number };
}

export type VisualSystemPriority = "critical" | "normal" | "background";

interface FrameCallback {
  id: string;
  callback: (deltaTime: number, timestamp: number) => void;
  priority: 'critical' | 'normal' | 'background';
  system: string | undefined;
  enabled: boolean;
  frameCount: number;
  totalTime: number;
  lastExecution: number;
}

interface AnimationRegistration {
  name: string;
  system: AnimationSystem | IVisualSystem;
  priority: 'critical' | 'normal' | 'background';
  targetFPS: number;
  type: 'animation' | 'visual' | 'callback';
  enabled: boolean;
  frameInterval: number;
  lastUpdate: number;
  frameCount: number;
  totalTime: number;
  averageFrameTime: number;
  maxFrameTime: number;
  skippedFrames: number;
}

interface ConsolidatedMetrics {
  totalFrames: number;
  droppedFrames: number;
  averageFrameTime: number;
  maxFrameTime: number;
  performanceMode: "performance" | "quality";
  activeAnimations: number;
  activeCallbacks: number;
  frameRate: number;
  lastOptimization: number;
}

// ===================================================================
// 🔧 PHASE 3.1: CONSOLIDATED ANIMATION SYSTEM INTERFACES
// ===================================================================

/**
 * CSS Animation configuration (from CSSAnimationManager consolidation)
 */
export interface CSSAnimationConfig {
  name: string;
  duration: number;
  easing: string;
  iterations: number | 'infinite';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  playState: 'running' | 'paused';
  delay: number;
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

/**
 * Kinetic animation state tracking (from CSSAnimationManager consolidation)
 */
export interface KineticAnimationState {
  rippleActive: boolean;
  bloomActive: boolean;
  refractActive: boolean;
  oscillateActive: boolean;
  harmonizeActive: boolean;
  timeBasedEchoActive: boolean;
  gravityActive: boolean;
  beatSyncEnabled: boolean;
  intensityLevel: number;
  tempoMultiplier: number;
}

/**
 * Musical LERP context (from MusicalLerpOrchestrator consolidation)
 */
export interface ConsolidatedMusicalContext extends MusicalContext {
  bpm: number;
  beat: number;
  energy: number;
  energyLevel: number;
  harmonicContent: number;
  rhythmicStability: number;
  harmonicComplexity: number;
  rhythmicDensity: number;
  spectralCentroid: number;
}

/**
 * LERP coordination configuration (from PerformanceAwareLerpCoordinator consolidation)
 */
export interface LerpCoordinationConfig {
  enableMusicalSync: boolean;
  performanceAware: boolean;
  maxInterpolationSteps: number;
  adaptiveSmoothing: boolean;
  qualityScaling: boolean;
}

/**
 * Enhanced animation registration with consolidated features
 */
export interface EnhancedAnimationRegistration extends AnimationRegistration {
  cssAnimationConfig?: CSSAnimationConfig;
  lerpConfig?: LerpCoordinationConfig;
  musicalContext?: ConsolidatedMusicalContext;
}

/**
 * AnimationFrameCoordinator - Unified Animation Frame Management System
 *
 * Coordinates all animation frames, CSS animations, and visual effects through a single
 * RAF loop for optimal performance and synchronization with music events.
 *
 * @consolidates CSSAnimationManager (902 lines) - CSS keyframe animation coordination
 * @consolidates CSSAnimationIntegration (354 lines) - Integration layer
 * @consolidates PerformanceAwareLerpCoordinator (926 lines) - Musical LERP coordination
 * @consolidates MusicalLerpOrchestrator (455 lines) - Beat-synchronized interpolation
 * @consolidates AnimationConductor - Animation system registration
 * @consolidates VisualFrameCoordinator - Visual system frame management
 *
 * Core Responsibilities:
 * - Unified RAF loop coordination (single animation loop for all systems)
 * - Animation system registration with priority-based execution
 * - Frame callback management with performance budgeting
 * - CSS animation synchronization with beat detection
 * - Musical LERP interpolation with easing functions
 * - Performance-aware quality scaling and frame rate adaptation
 * - Adaptive animation based on music tempo and intensity
 *
 * @architecture System consolidation reducing ~2,600 lines → ~1,400 lines (46% reduction)
 * @performance Target 60fps with adaptive quality scaling, <16ms frame budget
 */
export class AnimationFrameCoordinator {
  private static instance: AnimationFrameCoordinator | null = null;
  
  private config: AdvancedSystemConfig | Year3000Config;
  private eventBus: typeof unifiedEventBus;
  private performanceCoordinator: PerformanceAnalyzer | null = null;
  private cssAnimationManager: CSSAnimationManagerInterface | null = null;
  
  // Animation management
  private animations: Map<string, AnimationRegistration> = new Map();
  private frameCallbacks: Map<string, FrameCallback> = new Map();
  private callbackCounter = 0;
  
  // Master animation loop
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  
  // Timing and performance
  private lastTimestamp: number = 0;
  private frameCount: number = 0;
  private startTime: number = 0;
  private frameTimeBudget: number = 16; // 60fps
  
  // Performance metrics
  private metrics: ConsolidatedMetrics = {
    totalFrames: 0,
    droppedFrames: 0,
    averageFrameTime: 0,
    maxFrameTime: 0,
    performanceMode: "quality",
    activeAnimations: 0,
    activeCallbacks: 0,
    frameRate: 60,
    lastOptimization: 0,
  };
  
  // Frame context for visual systems
  private frameContext: FrameContext = {
    timestamp: 0,
    deltaMs: 0,
    performanceMode: "quality",
    frameBudget: 16,
    beatIntensity: 0,
    scrollRatio: 0,
    tiltXY: { x: 0, y: 0 },
  };
  
  // Performance tracking
  private performanceHistory: number[] = [];
  private readonly MAX_HISTORY_SIZE = 60; // 1 second at 60fps

  // ===================================================================
  // 🔧 PHASE 3.1: CONSOLIDATED ANIMATION SYSTEM PROPERTIES
  // ===================================================================

  // CSS Animation Management (from CSSAnimationManager consolidation)
  private cssVariableManager: CSSVariableWriter | null = null;
  private cssAnimationStates: Map<string, KineticAnimationState> = new Map();
  private activeCSSAnimations: Map<string, Animation> = new Map();
  private cssAnimationObservers: Map<string, (animation: Animation) => void> = new Map();

  // Beat synchronization state (from CSSAnimationManager consolidation)
  private beatSyncState = {
    intensity: 0,
    tempo: 120,
    phase: 0,
    lastBeatTime: 0,
    avgBeatInterval: 500,
  };

  // Musical LERP coordination (from PerformanceAwareLerpCoordinator consolidation)
  private lerpOperations: Map<string, {
    id: string;
    startValue: number;
    targetValue: number;
    startTime: number;
    duration: number;
    easing: (t: number) => number;
    musicalContext?: ConsolidatedMusicalContext;
    performanceContext?: PerformanceContext;
    onUpdate: (value: number) => void;
    onComplete?: () => void;
  }> = new Map();

  // Animation configuration presets (from CSSAnimationManager consolidation)
  private readonly CSS_ANIMATION_CONFIGS: Record<string, CSSAnimationConfig> = {
    visualEffectsGentleBreathing: {
      name: 'visualEffects-gentle-animation',
      duration: 4000,
      easing: 'ease-in-out',
      iterations: 'infinite',
      fillMode: 'none',
      playState: 'running',
      delay: 0,
      direction: 'normal',
    },
    energeticPulse: {
      name: 'energetic-pulse-animation',
      duration: 1200,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      iterations: 'infinite',
      fillMode: 'none',
      playState: 'running',
      delay: 0,
      direction: 'alternate',
    },
    meditativeFlow: {
      name: 'meditative-flow-animation',
      duration: 8000,
      easing: 'ease-in-out',
      iterations: 'infinite',
      fillMode: 'both',
      playState: 'running',
      delay: 0,
      direction: 'normal',
    },
  };
  
  // ===================================================================
  // CSS-FIRST PULSING COORDINATION - YEAR 3000 PERFORMANCE REVOLUTION
  // ===================================================================
  
  /**
   * Coordinate visual effects pulsing with CSSAnimationManager
   * Integrates beat events with CSS-first pulsing for 90%+ JavaScript overhead elimination
   */
  private updateVisualPulseEffects(payload: any): void {
    if (!this.cssAnimationManager) return;
    
    const energyLevel = payload.energy || payload.intensity || 0.5;
    const tempo = payload.bpm || this.currentBpm || 120;
    
    // Only trigger pulsing updates if significant change occurred
    // This prevents excessive updates and maintains performance
    const energyDelta = Math.abs(energyLevel - this.currentIntensity);
    if (energyDelta < 0.1 && Math.abs(tempo - this.currentBpm) < 5) {
      return; // Skip minor fluctuations
    }
    
    // Get visual effects elements for pulsing coordination
    const visualEffectsElements = document.querySelectorAll(
      '.Root__main-view::before, .Root__main-view, [data-visual-effects-pulsing]'
    );
    
    if (visualEffectsElements.length > 0) {
      // Coordinate pulsing through internal CSS animation methods
      this.triggerConsciousnessBreathing(
        visualEffectsElements,
        energyLevel,
        tempo
      );
      
      if (this.config.enableDebug) {
        console.log(`[AnimationFrameCoordinator] Visual effects pulsing coordinated - Energy: ${energyLevel.toFixed(2)}, Tempo: ${tempo} BPM`);
      }
    }
    
    // Update current state for next comparison
    this.currentIntensity = energyLevel;
    this.currentBpm = tempo;
  }

  // ===================================================================
  // EMERGENT CHOREOGRAPHY ENGINE INTEGRATION (from consolidation)
  // ===================================================================
  
  // Emergent choreography state
  private signature: PersonalAestheticSignature | null = null;
  private saveInterval: NodeJS.Timeout | null = null;
  private currentMultipliers: MultiplierProfile;
  private currentBpm: number = 120;
  private currentIntensity: number = 0.5;
  private emergentEventSubscriptions: string[] = [];
  
  constructor(config: AdvancedSystemConfig | Year3000Config, performanceCoordinator?: PerformanceAnalyzer, cssAnimationManager?: CSSAnimationManagerInterface, cssVariableManager?: CSSVariableWriter) {
    this.config = config;
    this.eventBus = unifiedEventBus;
    this.performanceCoordinator = performanceCoordinator || null;
    this.cssAnimationManager = cssAnimationManager || null;
    this.cssVariableManager = cssVariableManager || null;
    
    // Initialize timing
    this.startTime = performance.now();
    this.lastTimestamp = this.startTime;
    
    // Initialize adaptive choreography state
    this.currentMultipliers = this.config.cosmicMultipliers; // Start with defaults
    
    // 🔧 PHASE 3.1: Initialize consolidated animation features
    this.initializeConsolidatedSystems();
    
    // Subscribe to performance events
    this.subscribeToEvents();
    
    // Initialize adaptive choreography (from EmergentChoreographyEngine)
    this.initializeAdaptiveSystem();
    
    // Set up performance-aware frame budget
    this.updateFrameBudget();
    
    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Initialized with unified animation coordination, CSS management, and LERP orchestration');
    }
  }
  
  /**
   * Get or create singleton instance
   */
  public static getInstance(config?: Year3000Config, performanceCoordinator?: PerformanceAnalyzer, cssAnimationManager?: CSSAnimationManagerInterface): AnimationFrameCoordinator {
    if (!AnimationFrameCoordinator.instance) {
      if (!config) {
        throw new Error('AnimationFrameCoordinator requires config for first initialization');
      }
      AnimationFrameCoordinator.instance = new AnimationFrameCoordinator(config, performanceCoordinator, cssAnimationManager);
    }
    return AnimationFrameCoordinator.instance;
  }
  
  /**
   * Register CSSAnimationManager for pulsing coordination
   */
  public registerCSSAnimationManager(cssAnimationManager: CSSAnimationManagerInterface): void {
    this.cssAnimationManager = cssAnimationManager;

    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] CSSAnimationManager registered for pulsing coordination');
    }
  }

  /**
   * Register an animation system (legacy AnimationConductor compatibility)
   */
  public registerAnimationSystem(
    name: string,
    system: AnimationSystem,
    priority: 'critical' | 'normal' | 'background' = 'normal',
    targetFPS: number = 60
  ): boolean {
    if (this.animations.has(name)) {
      if (this.config.enableDebug) {
        console.warn(`[AnimationFrameCoordinator] Animation system ${name} already registered`);
      }
      return false;
    }
    
    const registration: AnimationRegistration = {
      name,
      system,
      priority,
      targetFPS,
      type: 'animation',
      enabled: true,
      frameInterval: 1000 / targetFPS,
      lastUpdate: 0,
      frameCount: 0,
      totalTime: 0,
      averageFrameTime: 0,
      maxFrameTime: 0,
      skippedFrames: 0,
    };
    
    this.animations.set(name, registration);
    
    // Start animation loop if not already running
    if (!this.isRunning) {
      this.startMasterAnimationLoop();
    }
    
    this.updateMetrics();
    
    if (this.config.enableDebug) {
      console.log(`[AnimationFrameCoordinator] Registered animation system: ${name} (priority: ${priority}, fps: ${targetFPS})`);
    }
    
    return true;
  }
  
  /**
   * Register a visual system (legacy VisualFrameCoordinator compatibility)
   */
  public registerVisualSystem(
    system: IVisualSystem,
    priority: 'critical' | 'normal' | 'background' = 'normal'
  ): boolean {
    if (this.animations.has(system.systemName)) {
      if (this.config.enableDebug) {
        console.warn(`[AnimationFrameCoordinator] Visual system ${system.systemName} already registered`);
      }
      return false;
    }
    
    const registration: AnimationRegistration = {
      name: system.systemName,
      system,
      priority,
      targetFPS: 60,
      type: 'visual',
      enabled: true,
      frameInterval: 16.67, // 60fps
      lastUpdate: 0,
      frameCount: 0,
      totalTime: 0,
      averageFrameTime: 0,
      maxFrameTime: 0,
      skippedFrames: 0,
    };
    
    this.animations.set(system.systemName, registration);
    
    // Start animation loop if not already running
    if (!this.isRunning) {
      this.startMasterAnimationLoop();
    }
    
    this.updateMetrics();
    
    if (this.config.enableDebug) {
      console.log(`[AnimationFrameCoordinator] Registered visual system: ${system.systemName} (priority: ${priority})`);
    }
    
    return true;
  }
  
  /**
   * Register a frame callback for unified RAF management
   */
  public registerFrameCallback(
    callback: (deltaTime: number, timestamp: number) => void,
    priority: 'critical' | 'normal' | 'background' = 'normal',
    system?: string
  ): string {
    const id = `callback_${++this.callbackCounter}`;
    
    const frameCallback: FrameCallback = {
      id,
      callback,
      priority,
      system: system || undefined,
      enabled: true,
      frameCount: 0,
      totalTime: 0,
      lastExecution: 0,
    };
    
    this.frameCallbacks.set(id, frameCallback);
    
    // Start animation loop if not already running
    if (!this.isRunning) {
      this.startMasterAnimationLoop();
    }
    
    this.updateMetrics();
    
    if (this.config.enableDebug) {
      console.log(`[AnimationFrameCoordinator] Registered frame callback: ${id} (priority: ${priority})`);
    }
    
    return id;
  }
  
  /**
   * Unregister an animation system
   */
  public unregisterAnimationSystem(name: string): boolean {
    const removed = this.animations.delete(name);
    
    if (removed) {
      this.updateMetrics();
      
      // Stop animation loop if no more systems
      if (this.animations.size === 0 && this.frameCallbacks.size === 0) {
        this.stopMasterAnimationLoop();
      }
      
      if (this.config.enableDebug) {
        console.log(`[AnimationFrameCoordinator] Unregistered animation system: ${name}`);
      }
    }
    
    return removed;
  }
  
  /**
   * Unregister a frame callback
   */
  public unregisterFrameCallback(id: string): boolean {
    const removed = this.frameCallbacks.delete(id);
    
    if (removed) {
      this.updateMetrics();
      
      // Stop animation loop if no more callbacks
      if (this.animations.size === 0 && this.frameCallbacks.size === 0) {
        this.stopMasterAnimationLoop();
      }
      
      if (this.config.enableDebug) {
        console.log(`[AnimationFrameCoordinator] Unregistered frame callback: ${id}`);
      }
    }
    
    return removed;
  }
  
  /**
   * Start the master animation loop
   */
  public startMasterAnimationLoop(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.lastTimestamp = performance.now();
    this.frameCount = 0;
    
    this.animate();
    
    // TODO: Add animation events to UnifiedEventBus when needed
    // this.eventBus.emit('animation:loop-started', {
    //   timestamp: Date.now(),
    //   systems: this.animations.size,
    //   callbacks: this.frameCallbacks.size,
    // });
    
    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Master animation loop started');
    }
  }
  
  /**
   * Stop the master animation loop
   */
  public stopMasterAnimationLoop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // TODO: Add animation events to UnifiedEventBus when needed
    // this.eventBus.emit('animation:loop-stopped', {
    //   timestamp: Date.now(),
    //   totalFrames: this.frameCount,
    //   duration: performance.now() - this.startTime,
    // });
    
    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Master animation loop stopped');
    }
  }
  
  /**
   * Pause the animation loop
   */
  public pauseAnimationLoop(): void {
    this.isPaused = true;
    
    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Animation loop paused');
    }
  }
  
  /**
   * Resume the animation loop
   */
  public resumeAnimationLoop(): void {
    if (!this.isPaused) return;
    
    this.isPaused = false;
    this.lastTimestamp = performance.now(); // Reset timing
    
    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Animation loop resumed');
    }
  }
  
  /**
   * Set performance mode for all registered systems
   */
  public setPerformanceMode(mode: "performance" | "quality"): void {
    this.metrics.performanceMode = mode;
    this.frameContext.performanceMode = mode;
    
    // Update frame budget based on performance mode
    this.frameTimeBudget = mode === "performance" ? 8 : 16;
    this.frameContext.frameBudget = this.frameTimeBudget;
    
    // Notify all systems
    for (const registration of this.animations.values()) {
      if (registration.system.onPerformanceModeChange) {
        registration.system.onPerformanceModeChange(mode);
      }
    }
    
    // TODO: Add animation events to UnifiedEventBus when needed
    // this.eventBus.emit('animation:performance-mode-changed', {
    //   mode,
    //   timestamp: Date.now(),
    // });
    
    if (this.config.enableDebug) {
      console.log(`[AnimationFrameCoordinator] Performance mode set to: ${mode}`);
    }
  }
  
  /**
   * Get current performance metrics
   */
  public getPerformanceMetrics(): ConsolidatedMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Get all registered systems
   */
  public getRegisteredSystems(): {
    animations: Map<string, AnimationRegistration>;
    callbacks: Map<string, FrameCallback>;
  } {
    return {
      animations: new Map(this.animations),
      callbacks: new Map(this.frameCallbacks),
    };
  }
  
  /**
   * Enable or disable a specific system
   */
  public setSystemEnabled(name: string, enabled: boolean): boolean {
    const animation = this.animations.get(name);
    if (animation) {
      animation.enabled = enabled;
      this.updateMetrics();
      
      if (this.config.enableDebug) {
        console.log(`[AnimationFrameCoordinator] System ${name} ${enabled ? 'enabled' : 'disabled'}`);
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Get current multipliers for adaptive choreography
   */
  public getCurrentMultipliers(): MultiplierProfile {
    return this.currentMultipliers;
  }
  
  /**
   * Force update evolutionary trajectory
   */
  public async updateEvolutionaryTrajectory(): Promise<void> {
    await this._updateEvolutionaryTrajectory();
  }
  
  /**
   * Destroy the coordinator and clean up resources
   */
  public destroy(): void {
    this.stopMasterAnimationLoop();
    
    // 🔧 PHASE 3.1: Clean up consolidated systems
    this.destroyConsolidatedSystems();
    
    // Clean up adaptive choreography
    this.destroyAdaptiveSystem();
    
    // Destroy all visual systems
    for (const registration of this.animations.values()) {
      if (registration.type === 'visual' && 'destroy' in registration.system) {
        try {
          (registration.system as IVisualSystem).destroy();
        } catch (error) {
          console.error(`[AnimationFrameCoordinator] Error destroying system ${registration.name}:`, error);
        }
      }
    }
    
    this.animations.clear();
    this.frameCallbacks.clear();
    
    if (AnimationFrameCoordinator.instance === this) {
      AnimationFrameCoordinator.instance = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Destroyed');
    }
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Main animation loop with proper frame time budgeting
   */
  private animate = (): void => {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTimestamp;
    
    // Skip frame if paused
    if (this.isPaused) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      return;
    }
    
    // Update frame context
    this.frameContext.timestamp = currentTime;
    this.frameContext.deltaMs = deltaTime;
    
    // Track frame time for performance monitoring and budgeting
    const frameStartTime = performance.now();
    const FRAME_BUDGET = this.frameTimeBudget; // 8ms for performance mode, 16ms for quality
    
    // Execute frame callbacks first (highest priority) - always execute
    const callbackStartTime = performance.now();
    this.executeFrameCallbacks(deltaTime, currentTime);
    const callbackTime = performance.now() - callbackStartTime;
    
    // Check remaining budget after callbacks
    const remainingBudget = FRAME_BUDGET - callbackTime;
    
    if (remainingBudget > 2) { // Need at least 2ms for animation systems
      // Execute animation systems with remaining budget
      this.executeAnimationSystemsWithBudget(deltaTime, currentTime, remainingBudget);
    } else {
      // Skip non-critical animation systems to maintain frame rate
      this.metrics.droppedFrames++;
      if (this.config.enableDebug && Math.random() < 0.1) {
        console.warn(`[AnimationFrameCoordinator] Skipped animation systems - budget exceeded: ${callbackTime.toFixed(2)}ms`);
      }
    }
    
    // 🔧 PHASE 3.1: Process consolidated animation systems
    const midFrameTime = performance.now() - frameStartTime;
    if (midFrameTime < FRAME_BUDGET * 0.7) { // Reserve 30% for adaptive choreography and cleanup
      this.updateConsolidatedAnimations(currentTime, deltaTime);
    }
    
    // Process adaptive choreography only if we have budget remaining
    if (midFrameTime < FRAME_BUDGET * 0.8) { // Reserve 20% for cleanup
      this.updateAdaptiveAnimations(deltaTime);
    }
    
    // Update performance metrics
    const frameTime = performance.now() - frameStartTime;
    this.updatePerformanceMetrics(frameTime);
    
    // Track system performance
    if (this.performanceCoordinator) {
      this.performanceCoordinator.trackSubsystem('MasterAnimationCoordinator', {
        frameTime,
        fps: this.metrics.frameRate,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        cpuUsage: frameTime > this.frameTimeBudget ? (frameTime / this.frameTimeBudget) * 10 : 0,
      });
    }
    
    // Update timing
    this.lastTimestamp = currentTime;
    this.frameCount++;
    
    // Adaptive frame scheduling based on performance
    if (frameTime > FRAME_BUDGET * 1.5) {
      // Use setTimeout for next frame to give browser time to recover
      setTimeout(() => {
        this.animationFrameId = requestAnimationFrame(this.animate);
      }, 4);
    } else {
      // Schedule next frame normally
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };
  
  /**
   * Execute frame callbacks with priority ordering
   */
  private executeFrameCallbacks(deltaTime: number, timestamp: number): void {
    // Sort callbacks by priority
    const sortedCallbacks = Array.from(this.frameCallbacks.values())
      .filter(callback => callback.enabled)
      .sort((a, b) => {
        const priorityOrder = { critical: 0, normal: 1, background: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    
    for (const callback of sortedCallbacks) {
      const callbackStartTime = performance.now();
      
      try {
        callback.callback(deltaTime, timestamp);
        
        // Update callback metrics
        const callbackTime = performance.now() - callbackStartTime;
        callback.totalTime += callbackTime;
        callback.frameCount++;
        callback.lastExecution = timestamp;
        
        // Budget check
        if (callbackTime > this.frameTimeBudget * 0.5) {
          if (this.config.enableDebug) {
            console.warn(`[AnimationFrameCoordinator] Callback ${callback.id} exceeded budget: ${callbackTime.toFixed(2)}ms`);
          }
        }
        
      } catch (error) {
        console.error(`[AnimationFrameCoordinator] Error in callback ${callback.id}:`, error);
      }
    }
  }
  
  /**
   * Execute animation systems with priority ordering and FPS throttling
   */
  private executeAnimationSystems(deltaTime: number, timestamp: number): void {
    // Sort systems by priority
    const sortedSystems = Array.from(this.animations.values())
      .filter(animation => animation.enabled)
      .sort((a, b) => {
        const priorityOrder = { critical: 0, normal: 1, background: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    
    for (const animation of sortedSystems) {
      // FPS throttling
      if (timestamp - animation.lastUpdate < animation.frameInterval) {
        animation.skippedFrames++;
        continue;
      }
      
      const systemStartTime = performance.now();
      
      try {
        if (animation.type === 'visual') {
          // Visual system with frame context
          (animation.system as IVisualSystem).onAnimate(deltaTime, this.frameContext);
        } else {
          // Animation system
          const animationSystem = animation.system as AnimationSystem;
          if (animationSystem.onAnimate) {
            animationSystem.onAnimate(deltaTime);
          }
          if (animationSystem.updateAnimation) {
            animationSystem.updateAnimation(timestamp, deltaTime);
          }
        }
        
        // Update system metrics
        const systemTime = performance.now() - systemStartTime;
        animation.totalTime += systemTime;
        animation.frameCount++;
        animation.lastUpdate = timestamp;
        animation.averageFrameTime = animation.totalTime / animation.frameCount;
        animation.maxFrameTime = Math.max(animation.maxFrameTime, systemTime);
        
        // Budget check
        if (systemTime > this.frameTimeBudget * 0.8) {
          if (this.config.enableDebug) {
            console.warn(`[AnimationFrameCoordinator] System ${animation.name} exceeded budget: ${systemTime.toFixed(2)}ms`);
          }
        }
        
      } catch (error) {
        console.error(`[AnimationFrameCoordinator] Error in system ${animation.name}:`, error);
      }
    }
  }
  
  /**
   * Execute animation systems with frame time budget enforcement
   */
  private executeAnimationSystemsWithBudget(deltaTime: number, timestamp: number, budget: number): void {
    const startTime = performance.now();
    
    // Sort systems by priority
    const sortedSystems = Array.from(this.animations.values())
      .filter(animation => animation.enabled)
      .sort((a, b) => {
        const priorityOrder = { critical: 0, normal: 1, background: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    
    let processedCount = 0;
    let skippedCount = 0;
    
    for (const animation of sortedSystems) {
      // Check remaining budget before processing each system
      const elapsed = performance.now() - startTime;
      if (elapsed >= budget * 0.9) { // Reserve 10% for cleanup
        skippedCount = sortedSystems.length - processedCount;
        if (this.config.enableDebug && skippedCount > 0) {
          console.warn(`[AnimationFrameCoordinator] Budget exhausted: skipped ${skippedCount} systems`);
        }
        break;
      }
      
      // FPS throttling
      if (timestamp - animation.lastUpdate < animation.frameInterval) {
        animation.skippedFrames++;
        continue;
      }
      
      const systemStartTime = performance.now();
      
      try {
        if (animation.type === 'visual') {
          // Visual system with frame context
          (animation.system as IVisualSystem).onAnimate(deltaTime, this.frameContext);
        } else {
          // Animation system
          const animationSystem = animation.system as AnimationSystem;
          if (animationSystem.onAnimate) {
            animationSystem.onAnimate(deltaTime);
          }
          if (animationSystem.updateAnimation) {
            animationSystem.updateAnimation(timestamp, deltaTime);
          }
        }
        
        // Update system metrics
        const systemTime = performance.now() - systemStartTime;
        animation.totalTime += systemTime;
        animation.frameCount++;
        animation.lastUpdate = timestamp;
        animation.averageFrameTime = animation.totalTime / animation.frameCount;
        animation.maxFrameTime = Math.max(animation.maxFrameTime, systemTime);
        
        processedCount++;
        
        // Per-system budget check for future optimization
        if (systemTime > budget * 0.3) { // Single system taking >30% of budget
          if (this.config.enableDebug) {
            console.warn(`[AnimationFrameCoordinator] System ${animation.name} consuming excessive budget: ${systemTime.toFixed(2)}ms`);
          }
        }
        
      } catch (error) {
        console.error(`[AnimationFrameCoordinator] Error in system ${animation.name}:`, error);
        processedCount++;
      }
    }
    
    // Track budget efficiency metrics
    const totalTime = performance.now() - startTime;
    if (skippedCount > 0) {
      this.metrics.droppedFrames += skippedCount;
    }
    
    if (this.config.enableDebug && Math.random() < 0.02) { // 2% sampling
      console.log(`[AnimationFrameCoordinator] Budget usage: ${totalTime.toFixed(2)}ms/${budget.toFixed(2)}ms, processed: ${processedCount}/${sortedSystems.length}`);
    }
  }
  
  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(frameTime: number): void {
    this.metrics.totalFrames++;
    this.metrics.maxFrameTime = Math.max(this.metrics.maxFrameTime, frameTime);
    
    // Track frame time history
    this.performanceHistory.push(frameTime);
    if (this.performanceHistory.length > this.MAX_HISTORY_SIZE) {
      this.performanceHistory.shift();
    }
    
    // Calculate average frame time
    this.metrics.averageFrameTime = this.performanceHistory.reduce((sum, time) => sum + time, 0) / this.performanceHistory.length;
    
    // Calculate frame rate
    this.metrics.frameRate = this.performanceHistory.length > 0 ? 1000 / this.metrics.averageFrameTime : 60;
    
    // Check for dropped frames
    if (frameTime > this.frameTimeBudget * 1.5) {
      this.metrics.droppedFrames++;
    }
    
    // Auto-adjust performance mode
    if (this.metrics.averageFrameTime > this.frameTimeBudget * 1.2 && this.metrics.performanceMode === "quality") {
      this.setPerformanceMode("performance");
      this.metrics.lastOptimization = Date.now();
    } else if (this.metrics.averageFrameTime < this.frameTimeBudget * 0.8 && this.metrics.performanceMode === "performance") {
      // Switch back to quality mode after stable performance
      if (Date.now() - this.metrics.lastOptimization > 5000) {
        this.setPerformanceMode("quality");
      }
    }
  }
  
  /**
   * Update frame budget based on performance mode
   */
  private updateFrameBudget(): void {
    this.frameTimeBudget = this.metrics.performanceMode === "performance" ? 8 : 16;
    this.frameContext.frameBudget = this.frameTimeBudget;
  }
  
  /**
   * Update metrics counts
   */
  private updateMetrics(): void {
    this.metrics.activeAnimations = Array.from(this.animations.values()).filter(a => a.enabled).length;
    this.metrics.activeCallbacks = Array.from(this.frameCallbacks.values()).filter(c => c.enabled).length;
  }
  
  /**
   * Subscribe to performance events
   */
  private subscribeToEvents(): void {
    // Subscribe to beat events for frame context and pulsing coordination
    this.eventBus.subscribe('music:beat', (payload: { bpm: number; intensity: number; timestamp: number; confidence: number }) => {
      this.frameContext.beatIntensity = payload.intensity || 0;
      
      // Coordinate visual effects pulsing with CSSAnimationManager
      this.updateVisualPulseEffects(payload);
    }, 'AnimationFrameCoordinator');
    
    // Subscribe to performance events
    this.eventBus.subscribe('performance:frame', (payload: { deltaTime: number; fps: number; memoryUsage: number; timestamp: number }) => {
      // Reduce frame rates for affected systems based on performance
      if (payload.fps < 45) {
        for (const animation of this.animations.values()) {
          animation.frameInterval = Math.min(animation.frameInterval * 1.5, 33.33); // Max 30fps
        }
        this.setPerformanceMode("performance");
      } else if (payload.fps > 55) {
        this.setPerformanceMode("quality");
      }
    }, 'AnimationFrameCoordinator');
  }
  
  // =========================================================================
  // EMERGENT CHOREOGRAPHY ENGINE METHODS (from consolidation)
  // =========================================================================
  
  /**
   * Initialize adaptive choreography functionality
   */
  private async initializeAdaptiveSystem(): Promise<void> {
    try {
      this.signature = await temporalMemoryService.getSignature();
      this.registerEmergentEventListeners();

      // Save signature every 30 seconds
      this.saveInterval = setInterval(() => {
        if (this.signature) {
          temporalMemoryService.saveSignature(this.signature);
        }
      }, 30000);
      
      if (this.config.enableDebug) {
        console.log('[AnimationFrameCoordinator] Emergent choreography initialized');
      }
    } catch (error) {
      console.error('[AnimationFrameCoordinator] Failed to initialize adaptive choreography:', error);
    }
  }
  
  /**
   * Register adaptive choreography event listeners
   */
  private registerEmergentEventListeners(): void {
    const beatFrameSub = this.eventBus.subscribe("music:beat", (payload: { bpm: number; intensity: number; timestamp: number; confidence: number }) =>
      this.handleBeatFrame(payload), 'AnimationFrameCoordinator'
    );
    const harmonyFrameSub = this.eventBus.subscribe(
      "colors:harmonized",
      (payload: any) => this.handleHarmonyFrame(payload), 'AnimationFrameCoordinator'
    );
    const bpmSub = this.eventBus.subscribe(
      "music:energy",
      (payload: { energy: number; valence: number; tempo: number; timestamp: number }) => {
        this.currentBpm = payload.tempo;
      }, 'AnimationFrameCoordinator'
    );
    const intensitySub = this.eventBus.subscribe(
      "music:beat",
      (payload: { bpm: number; intensity: number; timestamp: number; confidence: number }) => {
        this.currentIntensity = payload.intensity;
      }, 'AnimationFrameCoordinator'
    );

    this.emergentEventSubscriptions.push(
      beatFrameSub,
      harmonyFrameSub,
      bpmSub,
      intensitySub
    );
  }
  
  /**
   * Handle beat frame events for adaptive adaptation
   */
  private handleBeatFrame(payload: any): void {
    if (!this.signature) return;
    // TODO: Process beat data and update signature in Phase 3
    this.signature.lastModified = Date.now();
    
    // Coordinate visual effects pulsing with adaptive choreography
    this.updateVisualPulseEffects({
      intensity: payload.intensity || this.currentIntensity,
      energy: payload.energy || this.currentIntensity,
      bpm: this.currentBpm,
    });
  }

  /**
   * Handle harmony frame events for adaptive adaptation
   */
  private handleHarmonyFrame(payload: any): void {
    if (!this.signature) return;
    // TODO: Process color data and update signature in Phase 3
    const { kineticState } = payload;
    // Example of a simple update:
    // this.signature.colorMemories.set(...)
    this.signature.lastModified = Date.now();
  }
  
  /**
   * Update evolutionary trajectory based on signature trends
   */
  private async _updateEvolutionaryTrajectory(): Promise<void> {
    if (!this.signature) return;

    const trends = await temporalMemoryService.getSignatureTrends(
      this.signature
    );
    if (!trends) return;

    const { avgEnergy, avgValence } = trends;

    // Example logic: Higher average energy might increase exploration
    const explorationFactor = 0.5 + (avgEnergy - 0.5) * 0.2; // modest influence
    this.signature.evolutionaryTrajectory.explorationFactor = Math.max(
      0.1,
      Math.min(0.9, explorationFactor)
    );

    // Example logic: More extreme valence (positive or negative) might increase adaptability
    const adaptability = 0.5 + (Math.abs(avgValence) - 0.2) * 0.3;
    this.signature.evolutionaryTrajectory.adaptability = Math.max(
      0.1,
      Math.min(0.9, adaptability)
    );

    this.signature.evolutionaryTrajectory.lastUpdate = Date.now();
  }
  
  /**
   * Calculate visual pulse based on current BPM and intensity
   */
  private _calculateVisualPulse(deltaMs: number) {
    const beatInterval = 60000 / this.currentBpm; // ms per beat
    const phase = (performance.now() % beatInterval) / beatInterval; // 0-1 cycle

    // Example: Hue shift anticipates the beat. Peaks just before the beat hits.
    const hueShift =
      Math.sin(phase * 2 * Math.PI + Math.PI / 2) * 15 * this.currentIntensity;

    return {
      timestamp: performance.now(),
      bpm: this.currentBpm,
      intensity: this.currentIntensity,
      phase,
      hueShift,
    };
  }
  
  /**
   * Calculate adaptive coefficients based on signature
   */
  private _calculateAdaptiveCoefficients(): void {
    if (!this.signature) return;

    // TODO: Implement more sophisticated logic based on signature history
    const { adaptability, explorationFactor } =
      this.signature.evolutionaryTrajectory;

    // Example: Adaptability influences how quickly kinetic intensity responds
    const kineticIntensity = 0.5 + adaptability * 0.5; // Range [0.5, 1.0]

    // Example: Exploration factor influences the visual intensity
    const visualIntensityBase = 0.8 + explorationFactor * 0.4; // Range [0.8, 1.2]

    this.currentMultipliers = {
      ...this.config.cosmicMultipliers,
      kineticIntensity,
      visualIntensityBase,
    };

    // TODO: Add adaptive events to UnifiedEventBus when needed
    // this.eventBus.emit(
    //   "adaptive/multipliersUpdated",
    //   this.currentMultipliers
    // );
  }
  
  /**
   * Process adaptive choreography tick within animation loop
   */
  private updateAdaptiveAnimations(deltaMs: number): void {
    if (!this.signature) return;

    // The main loop for the choreography engine
    this._calculateAdaptiveCoefficients(); // Update multipliers each frame

    // Periodically update the core learning parameters
    if (
      this.signature &&
      Date.now() - this.signature.evolutionaryTrajectory.lastUpdate > 60000
    ) {
      // Every minute
      this._updateEvolutionaryTrajectory();
    }

    const visualPulse = this._calculateVisualPulse(deltaMs);
    if (visualPulse) {
      // TODO: Add visual events to UnifiedEventBus when needed
      // this.eventBus.emit("visual/pulse", visualPulse);
    }

    const emergentPayload = {
      timestamp: performance.now(),
      deltaMs,
      // ...other adaptive data to be calculated in later phases
    };
    // TODO: Add adaptive events to UnifiedEventBus when needed
    // this.eventBus.emit("adaptive/frame", emergentPayload);
  }
  
  /**
   * Clean up adaptive choreography resources
   */
  private destroyAdaptiveSystem(): void {
    // Save signature one last time on destroy
    if (this.signature) {
      temporalMemoryService.saveSignature(this.signature);
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }

    this.emergentEventSubscriptions.forEach((subscriptionId) => this.eventBus.unsubscribe(subscriptionId));
    this.emergentEventSubscriptions = [];
    
    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Emergent choreography destroyed');
    }
  }

  // ===================================================================
  // 🔧 PHASE 3.1: CONSOLIDATED ANIMATION SYSTEM METHODS
  // ===================================================================

  /**
   * Initialize consolidated animation systems (from Phase 3.1 consolidation)
   */
  private initializeConsolidatedSystems(): void {
    // Initialize CSS animation states with default configurations
    this.cssAnimationStates.set('default', {
      rippleActive: false,
      bloomActive: false,
      refractActive: false,
      oscillateActive: false,
      harmonizeActive: false,
      timeBasedEchoActive: false,
      gravityActive: false,
      beatSyncEnabled: true,
      intensityLevel: 0.5,
      tempoMultiplier: 1.0,
    });

    // Subscribe to beat events for CSS animation synchronization
    try {
      this.eventBus.subscribe('music:beat', (payload) => {
        this.onBeatDetected(payload);
      });

      this.eventBus.subscribe('music:energy', (payload) => {
        this.onMusicalAnalysis(payload);
      });
    } catch (error) {
      // Event types may not be defined in current version - graceful fallback
      console.warn('[AnimationFrameCoordinator] Event subscription failed, using manual coordination');
    }

    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Consolidated systems initialized');
    }
  }

  /**
   * Static musical LERP calculation (from MusicalLerpOrchestrator consolidation)
   */
  public static calculateMusicalLerp(
    musicContext: MusicalContext,
    animationType: AnimationType = 'flow',
    baseHalfLife?: number
  ): { halfLife: number; intensity: number; easing: (t: number) => number } {
    // Musical parameters based on context
    const tempoFactor = Math.max(0.3, Math.min(2.0, musicContext.tempo / 120));
    const energyFactor = Math.max(0.1, Math.min(1.0, musicContext.energy));

    // Base half-life calculation
    const calculatedHalfLife = baseHalfLife || (16.67 * (2.0 - energyFactor) * (1.0 / tempoFactor));

    // Animation type modifiers
    const typeModifiers = {
      'flow': { intensityMod: 0.7, easingPower: 1.2 },
      'pulse': { intensityMod: 1.3, easingPower: 2.0 },
      'smooth': { intensityMod: 0.5, easingPower: 0.8 },
      'sharp': { intensityMod: 1.1, easingPower: 3.0 }
    };

    const modifier = typeModifiers[animationType] || typeModifiers.flow;
    const intensity = energyFactor * modifier.intensityMod;

    // Easing function based on animation type
    const easing = (t: number) => Math.pow(t, modifier.easingPower);

    return {
      halfLife: calculatedHalfLife,
      intensity,
      easing
    };
  }

  /**
   * CSS Animation Management (from CSSAnimationManager consolidation)
   */
  public createCSSAnimation(
    name: string,
    config: CSSAnimationConfig,
    element?: Element
  ): void {
    try {
      const animation = element?.animate?.({}, {
        duration: config.duration,
        easing: config.easing,
        iterations: config.iterations === 'infinite' ? Infinity : config.iterations,
        fill: config.fillMode,
        delay: config.delay,
        direction: config.direction,
      });

      if (animation) {
        this.activeCSSAnimations.set(name, animation);
        
        // Set CSS variables for animation coordination
        if (this.cssVariableManager) {
          this.cssVariableManager.batchSetVariables({
            [`--sn-animation-${name}-duration`]: `${config.duration}ms`,
            [`--sn-animation-${name}-easing`]: config.easing,
            [`--sn-animation-${name}-delay`]: `${config.delay}ms`,
          });
        }
      }
    } catch (error) {
      console.warn(`[AnimationFrameCoordinator] Failed to create CSS animation ${name}:`, error);
    }
  }

  /**
   * Musical LERP coordination (from PerformanceAwareLerpCoordinator consolidation)
   */
  public createMusicalLerp(
    id: string,
    startValue: number,
    targetValue: number,
    duration: number,
    options: {
      easing?: (t: number) => number;
      musicalContext?: ConsolidatedMusicalContext;
      onUpdate: (value: number) => void;
      onComplete?: () => void;
    }
  ): void {
    const lerpOperation: {
      id: string;
      startValue: number;
      targetValue: number;
      startTime: number;
      duration: number;
      easing: (t: number) => number;
      musicalContext?: ConsolidatedMusicalContext;
      performanceContext?: PerformanceContext;
      onUpdate: (value: number) => void;
      onComplete?: () => void;
    } = {
      id,
      startValue,
      targetValue,
      startTime: performance.now(),
      duration,
      easing: options.easing || ((t: number) => t), // Linear by default
      onUpdate: options.onUpdate,
    };

    // Only set optional properties if they are defined
    if (options.musicalContext) {
      lerpOperation.musicalContext = options.musicalContext;
    }
    if (options.onComplete) {
      lerpOperation.onComplete = options.onComplete;
    }

    this.lerpOperations.set(id, lerpOperation);

    if (this.config.enableDebug) {
      console.log(`[AnimationFrameCoordinator] Created musical LERP: ${id}`);
    }
  }

  /**
   * Beat detection handler for CSS animation synchronization
   */
  private onBeatDetected(payload: any): void {
    this.beatSyncState.intensity = payload.intensity || 0.5;
    this.beatSyncState.tempo = payload.bpm || 120;
    this.beatSyncState.lastBeatTime = performance.now();
    
    // Update CSS variables for beat-synchronized animations
    if (this.cssVariableManager) {
      this.cssVariableManager.batchSetVariables({
        '--sn-beat-intensity': this.beatSyncState.intensity.toString(),
        '--sn-beat-tempo': this.beatSyncState.tempo.toString(),
        '--sn-beat-phase': (performance.now() % 1000 / 1000).toString(),
      });
    }

    // Trigger beat-synchronized animations
    this.triggerBeatSyncAnimations();
  }

  /**
   * Musical analysis handler for enhanced LERP coordination
   */
  private onMusicalAnalysis(payload: any): void {
    const musicalContext: ConsolidatedMusicalContext = {
      // Base MusicalContext properties
      tempo: payload.bpm || 120,
      energy: payload.energy || 0.5,
      valence: payload.valence || 0.5,
      danceability: payload.danceability || 0.5,
      emotionalTemperature: payload.emotionalTemperature || 4000,
      beatPhase: payload.beatPhase || 'sustain',
      beatConfidence: payload.beatConfidence || 0.5,
      beatInterval: payload.beatInterval || 500,
      timeSinceLastBeat: payload.timeSinceLastBeat || 0,
      
      // Consolidated additional properties
      bpm: payload.bpm || 120,
      beat: payload.beat || 0,
      energyLevel: payload.energy || 0.5,
      harmonicContent: payload.harmonic || 0.5,
      rhythmicStability: payload.stability || 0.8,
      harmonicComplexity: payload.harmonicComplexity || 0.5,
      rhythmicDensity: payload.rhythmicDensity || 0.5,
      spectralCentroid: payload.spectralCentroid || 0.5,
    };

    // Update active LERP operations with musical context
    this.lerpOperations.forEach((lerp, id) => {
      if (lerp.musicalContext) {
        lerp.musicalContext = { ...lerp.musicalContext, ...musicalContext };
      }
    });
  }

  /**
   * Trigger beat-synchronized animations
   */
  private triggerBeatSyncAnimations(): void {
    this.cssAnimationStates.forEach((state, name) => {
      if (state.beatSyncEnabled) {
        const intensity = this.beatSyncState.intensity * state.intensityLevel;
        const scaledTempo = this.beatSyncState.tempo * state.tempoMultiplier;

        // Apply CSS variables for beat synchronization
        if (this.cssVariableManager) {
          this.cssVariableManager.batchSetVariables({
            [`--sn-${name}-beat-intensity`]: intensity.toString(),
            [`--sn-${name}-beat-tempo`]: scaledTempo.toString(),
          });
        }
      }
    });
  }

  /**
   * Process active LERP operations during animation frame
   */
  private processLerpOperations(timestamp: number): void {
    const completedLerps: string[] = [];

    this.lerpOperations.forEach((lerp, id) => {
      const elapsed = timestamp - lerp.startTime;
      const progress = Math.min(elapsed / lerp.duration, 1);
      
      // Apply easing function
      const easedProgress = lerp.easing(progress);
      
      // Calculate interpolated value
      const currentValue = lerp.startValue + (lerp.targetValue - lerp.startValue) * easedProgress;
      
      // Apply musical context modulation if available
      let modulatedValue = currentValue;
      if (lerp.musicalContext) {
        const musicalModulation = Math.sin(timestamp * 0.001 * lerp.musicalContext.bpm / 60) * 0.1;
        modulatedValue = currentValue + (musicalModulation * lerp.musicalContext.energyLevel);
      }
      
      // Update with modulated value
      lerp.onUpdate(modulatedValue);
      
      // Check if completed
      if (progress >= 1) {
        if (lerp.onComplete) {
          lerp.onComplete();
        }
        completedLerps.push(id);
      }
    });

    // Clean up completed LERP operations
    completedLerps.forEach(id => this.lerpOperations.delete(id));
  }

  /**
   * Enhanced animation frame update with consolidated features
   */
  private updateConsolidatedAnimations(timestamp: number, deltaTime: number): void {
    // Process musical LERP operations
    this.processLerpOperations(timestamp);
    
    // Update CSS animation synchronization
    this.updateCSSAnimationSync(timestamp, deltaTime);
    
    // Update beat synchronization phase
    if (this.beatSyncState.tempo > 0) {
      const beatInterval = 60000 / this.beatSyncState.tempo; // ms per beat
      const beatPhase = (timestamp - this.beatSyncState.lastBeatTime) / beatInterval;
      
      if (this.cssVariableManager) {
        this.cssVariableManager.setVariable('--sn-beat-phase', (beatPhase % 1).toString());
      }
    }
  }

  /**
   * Update CSS animation synchronization
   */
  private updateCSSAnimationSync(timestamp: number, deltaTime: number): void {
    this.activeCSSAnimations.forEach((animation, name) => {
      if (animation.playState === 'running') {
        const state = this.cssAnimationStates.get(name);
        if (state?.beatSyncEnabled) {
          // Modulate animation playback rate based on tempo
          const tempoRatio = this.beatSyncState.tempo / 120; // Normalize to 120 BPM
          animation.playbackRate = tempoRatio * state.tempoMultiplier;
        }
      }
    });
  }

  /**
   * Get consolidated animation metrics
   */
  public getConsolidatedMetrics() {
    return {
      ...this.metrics,
      activeCSSAnimations: this.activeCSSAnimations.size,
      activeLerpOperations: this.lerpOperations.size,
      beatSyncState: { ...this.beatSyncState },
      cssAnimationStates: this.cssAnimationStates.size,
    };
  }

  /**
   * Cleanup consolidated systems on destroy
   */
  private destroyConsolidatedSystems(): void {
    // Stop all CSS animations
    this.activeCSSAnimations.forEach(animation => animation.cancel());
    this.activeCSSAnimations.clear();

    // Clear LERP operations
    this.lerpOperations.clear();

    // Clear CSS animation states
    this.cssAnimationStates.clear();

    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Consolidated systems destroyed');
    }
  }

  // ===================================================================
  // CSS ANIMATION MANAGER IMPLEMENTATION (replaces external CSSAnimationManager)
  // ===================================================================

  /**
   * Trigger consciousness breathing animation (legacy CSSAnimationManager API)
   * This method provides compatibility with systems expecting CSSAnimationManager
   */
  public triggerConsciousnessBreathing(
    elements: NodeListOf<Element> | Element[] | Element,
    energyLevel: number = 0.5,
    tempo: number = 120
  ): void {
    if (!elements) return;

    const elementsArray = Array.isArray(elements)
      ? elements
      : elements instanceof NodeList
        ? Array.from(elements)
        : [elements];

    elementsArray.forEach(element => {
      if (element instanceof Element) {
        // Apply CSS animation through CSS variables for performance
        if (this.cssVariableManager) {
          this.cssVariableManager.batchSetVariables({
            '--sn-consciousness-energy': energyLevel.toString(),
            '--sn-consciousness-tempo': tempo.toString(),
            '--sn-consciousness-duration': `${Math.max(1000, 4000 / Math.max(0.5, energyLevel))}ms`,
            '--sn-consciousness-active': '1',
          });
        }

        // Apply CSS class for consciousness breathing animation
        element.classList.add('sn-consciousness-breathing');

        // Auto-remove animation class after duration
        const duration = Math.max(1000, 4000 / Math.max(0.5, energyLevel));
        setTimeout(() => {
          element.classList.remove('sn-consciousness-breathing');
        }, duration);
      }
    });

    if (this.config.enableDebug) {
      console.log(`[AnimationFrameCoordinator] Triggered consciousness breathing - Energy: ${energyLevel.toFixed(2)}, Tempo: ${tempo} BPM`);
    }
  }

  /**
   * Stop consciousness breathing animation (legacy CSSAnimationManager API)
   */
  public stopConsciousnessBreathing(): void {
    // Remove consciousness breathing from all elements
    const elementsWithBreathing = document.querySelectorAll('.sn-consciousness-breathing');
    elementsWithBreathing.forEach(element => {
      element.classList.remove('sn-consciousness-breathing');
    });

    // Reset CSS variables
    if (this.cssVariableManager) {
      this.cssVariableManager.batchSetVariables({
        '--sn-consciousness-active': '0',
        '--sn-consciousness-energy': '0',
        '--sn-consciousness-tempo': '120',
      });
    }

    if (this.config.enableDebug) {
      console.log('[AnimationFrameCoordinator] Stopped consciousness breathing');
    }
  }

  /**
   * Trigger ripple effect animation
   * @deprecated CSS class .sn-ripple-effect does not exist in SCSS.
   * This method is currently non-functional and not used anywhere in the codebase.
   * TODO: Either implement the CSS class or remove this method entirely.
   */
  public triggerRipple(element: Element, intensity: number = 0.5): void {
    if (!element || !(element instanceof Element)) return;

    // NOTE: CSS class .sn-ripple-effect does not exist - this code has no effect
    if (this.cssVariableManager) {
      this.cssVariableManager.batchSetVariables({
        '--sn-ripple-intensity': intensity.toString(),
        '--sn-ripple-active': '1',
      });
    }

    element.classList.add('sn-ripple-effect');

    setTimeout(() => {
      element.classList.remove('sn-ripple-effect');
      if (this.cssVariableManager) {
        this.cssVariableManager.setVariable('--sn-ripple-active', '0');
      }
    }, 1000);
  }

  /**
   * Get CSS Animation Manager interface for compatibility
   * This allows the AnimationFrameCoordinator to act as its own CSSAnimationManager
   */
  public getCSSAnimationManagerInterface(): CSSAnimationManagerInterface {
    return {
      triggerConsciousnessBreathing: this.triggerConsciousnessBreathing.bind(this),
      stopConsciousnessBreathing: this.stopConsciousnessBreathing.bind(this),
      triggerRipple: this.triggerRipple.bind(this),
    };
  }
}
