import { UnifiedPerformanceCoordinator } from '@/core/performance/UnifiedPerformanceCoordinator';
import { GlobalEventBus } from '@/core/events/EventBus';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import { temporalMemoryService } from "@/audio/TemporalMemoryService";
import type { Year3000Config, MultiplierProfile } from '@/types/models';
import type { PersonalAestheticSignature } from "@/types/signature";

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

/**
 * EnhancedMasterAnimationCoordinator - Phase 4 System Consolidation
 * 
 * Consolidates all animation coordination into a single unified system:
 * - Merges AnimationConductor and VisualFrameCoordinator functionality
 * - Integrates EmergentChoreographyEngine music-driven adaptation logic
 * - Provides unified animation registration and frame callback management
 * - Integrates with UnifiedPerformanceCoordinator for performance-aware coordination
 * - Eliminates redundant RAF loops throughout the system
 * - Handles music-driven multiplier calculations and adaptive coefficients
 * 
 * @architecture Phase 4 of system consolidation
 * @performance Target: 5-10% animation performance improvement
 * @emergent Integrates emergent choreography engine functionality
 */
export class EnhancedMasterAnimationCoordinator {
  private static instance: EnhancedMasterAnimationCoordinator | null = null;
  
  private config: Year3000Config;
  private eventBus: typeof GlobalEventBus;
  private performanceCoordinator: UnifiedPerformanceCoordinator | null = null;
  
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
  // EMERGENT CHOREOGRAPHY ENGINE INTEGRATION (from consolidation)
  // ===================================================================
  
  // Emergent choreography state
  private signature: PersonalAestheticSignature | null = null;
  private saveInterval: NodeJS.Timeout | null = null;
  private currentMultipliers: MultiplierProfile;
  private currentBpm: number = 120;
  private currentIntensity: number = 0.5;
  private emergentEventSubscriptions: (() => void)[] = [];
  
  constructor(config: Year3000Config, performanceCoordinator?: UnifiedPerformanceCoordinator) {
    this.config = config;
    this.eventBus = GlobalEventBus;
    this.performanceCoordinator = performanceCoordinator || null;
    
    // Initialize timing
    this.startTime = performance.now();
    this.lastTimestamp = this.startTime;
    
    // Initialize emergent choreography state
    this.currentMultipliers = this.config.cosmicMultipliers; // Start with defaults
    
    // Subscribe to performance events
    this.subscribeToEvents();
    
    // Initialize emergent choreography (from EmergentChoreographyEngine)
    this.initializeEmergentChoreography();
    
    // Set up performance-aware frame budget
    this.updateFrameBudget();
    
    if (this.config.enableDebug) {
      console.log('[EnhancedMasterAnimationCoordinator] Initialized with unified animation coordination and emergent choreography');
    }
  }
  
  /**
   * Get or create singleton instance
   */
  public static getInstance(config?: Year3000Config, performanceCoordinator?: UnifiedPerformanceCoordinator): EnhancedMasterAnimationCoordinator {
    if (!EnhancedMasterAnimationCoordinator.instance) {
      if (!config) {
        throw new Error('EnhancedMasterAnimationCoordinator requires config for first initialization');
      }
      EnhancedMasterAnimationCoordinator.instance = new EnhancedMasterAnimationCoordinator(config, performanceCoordinator);
    }
    return EnhancedMasterAnimationCoordinator.instance;
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
        console.warn(`[EnhancedMasterAnimationCoordinator] Animation system ${name} already registered`);
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
      console.log(`[EnhancedMasterAnimationCoordinator] Registered animation system: ${name} (priority: ${priority}, fps: ${targetFPS})`);
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
        console.warn(`[EnhancedMasterAnimationCoordinator] Visual system ${system.systemName} already registered`);
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
      console.log(`[EnhancedMasterAnimationCoordinator] Registered visual system: ${system.systemName} (priority: ${priority})`);
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
      console.log(`[EnhancedMasterAnimationCoordinator] Registered frame callback: ${id} (priority: ${priority})`);
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
        console.log(`[EnhancedMasterAnimationCoordinator] Unregistered animation system: ${name}`);
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
        console.log(`[EnhancedMasterAnimationCoordinator] Unregistered frame callback: ${id}`);
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
    
    // Emit start event
    this.eventBus.publish('animation:loop-started', {
      timestamp: Date.now(),
      systems: this.animations.size,
      callbacks: this.frameCallbacks.size,
    });
    
    if (this.config.enableDebug) {
      console.log('[EnhancedMasterAnimationCoordinator] Master animation loop started');
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
    
    // Emit stop event
    this.eventBus.publish('animation:loop-stopped', {
      timestamp: Date.now(),
      totalFrames: this.frameCount,
      duration: performance.now() - this.startTime,
    });
    
    if (this.config.enableDebug) {
      console.log('[EnhancedMasterAnimationCoordinator] Master animation loop stopped');
    }
  }
  
  /**
   * Pause the animation loop
   */
  public pauseAnimationLoop(): void {
    this.isPaused = true;
    
    if (this.config.enableDebug) {
      console.log('[EnhancedMasterAnimationCoordinator] Animation loop paused');
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
      console.log('[EnhancedMasterAnimationCoordinator] Animation loop resumed');
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
    
    this.eventBus.publish('animation:performance-mode-changed', {
      mode,
      timestamp: Date.now(),
    });
    
    if (this.config.enableDebug) {
      console.log(`[EnhancedMasterAnimationCoordinator] Performance mode set to: ${mode}`);
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
        console.log(`[EnhancedMasterAnimationCoordinator] System ${name} ${enabled ? 'enabled' : 'disabled'}`);
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Get current multipliers for emergent choreography
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
    
    // Clean up emergent choreography
    this.destroyEmergentChoreography();
    
    // Destroy all visual systems
    for (const registration of this.animations.values()) {
      if (registration.type === 'visual' && 'destroy' in registration.system) {
        try {
          (registration.system as IVisualSystem).destroy();
        } catch (error) {
          console.error(`[EnhancedMasterAnimationCoordinator] Error destroying system ${registration.name}:`, error);
        }
      }
    }
    
    this.animations.clear();
    this.frameCallbacks.clear();
    
    if (EnhancedMasterAnimationCoordinator.instance === this) {
      EnhancedMasterAnimationCoordinator.instance = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[EnhancedMasterAnimationCoordinator] Destroyed');
    }
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Main animation loop
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
    
    // Track frame time for performance monitoring
    const frameStartTime = performance.now();
    
    // Execute frame callbacks first (highest priority)
    this.executeFrameCallbacks(deltaTime, currentTime);
    
    // Execute animation systems
    this.executeAnimationSystems(deltaTime, currentTime);
    
    // Process emergent choreography tick (integrated from EmergentChoreographyEngine)
    this.processEmergentTick(deltaTime);
    
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
    
    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.animate);
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
            console.warn(`[EnhancedMasterAnimationCoordinator] Callback ${callback.id} exceeded budget: ${callbackTime.toFixed(2)}ms`);
          }
        }
        
      } catch (error) {
        console.error(`[EnhancedMasterAnimationCoordinator] Error in callback ${callback.id}:`, error);
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
            console.warn(`[EnhancedMasterAnimationCoordinator] System ${animation.name} exceeded budget: ${systemTime.toFixed(2)}ms`);
          }
        }
        
      } catch (error) {
        console.error(`[EnhancedMasterAnimationCoordinator] Error in system ${animation.name}:`, error);
      }
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
    // Subscribe to beat events for frame context
    this.eventBus.subscribe('music:beat', (payload: any) => {
      this.frameContext.beatIntensity = payload.intensity || 0;
    });
    
    // Subscribe to performance events
    this.eventBus.subscribe('performance:throttle-updates', (payload: any) => {
      // Reduce frame rates for affected systems
      for (const animation of this.animations.values()) {
        if (animation.name === payload.subsystem || payload.subsystem === '*') {
          animation.frameInterval = Math.min(animation.frameInterval * 1.5, 33.33); // Max 30fps
        }
      }
    });
    
    this.eventBus.subscribe('performance:reduce-quality', (payload: any) => {
      this.setPerformanceMode("performance");
    });
  }
  
  // =========================================================================
  // EMERGENT CHOREOGRAPHY ENGINE METHODS (from consolidation)
  // =========================================================================
  
  /**
   * Initialize emergent choreography functionality
   */
  private async initializeEmergentChoreography(): Promise<void> {
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
        console.log('[EnhancedMasterAnimationCoordinator] Emergent choreography initialized');
      }
    } catch (error) {
      console.error('[EnhancedMasterAnimationCoordinator] Failed to initialize emergent choreography:', error);
    }
  }
  
  /**
   * Register emergent choreography event listeners
   */
  private registerEmergentEventListeners(): void {
    const beatFrameSub = this.eventBus.subscribe("beat/frame", (payload) =>
      this.handleBeatFrame(payload)
    );
    const harmonyFrameSub = this.eventBus.subscribe(
      "colorharmony/frame",
      (payload) => this.handleHarmonyFrame(payload)
    );
    const bpmSub = this.eventBus.subscribe(
      "beat/bpm",
      (payload: { bpm: number }) => {
        this.currentBpm = payload.bpm;
      }
    );
    const intensitySub = this.eventBus.subscribe(
      "beat/intensity",
      (payload: { intensity: number }) => {
        this.currentIntensity = payload.intensity;
      }
    );

    this.emergentEventSubscriptions.push(
      beatFrameSub,
      harmonyFrameSub,
      bpmSub,
      intensitySub
    );
  }
  
  /**
   * Handle beat frame events for emergent adaptation
   */
  private handleBeatFrame(payload: any): void {
    if (!this.signature) return;
    // TODO: Process beat data and update signature in Phase 3
    this.signature.lastModified = Date.now();
  }

  /**
   * Handle harmony frame events for emergent adaptation
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

    this.eventBus.publish(
      "emergent/multipliersUpdated",
      this.currentMultipliers
    );
  }
  
  /**
   * Process emergent choreography tick within animation loop
   */
  private processEmergentTick(deltaMs: number): void {
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
      this.eventBus.publish("visual/pulse", visualPulse);
    }

    const emergentPayload = {
      timestamp: performance.now(),
      deltaMs,
      // ...other emergent data to be calculated in later phases
    };
    this.eventBus.publish("emergent/frame", emergentPayload);
  }
  
  /**
   * Clean up emergent choreography resources
   */
  private destroyEmergentChoreography(): void {
    // Save signature one last time on destroy
    if (this.signature) {
      temporalMemoryService.saveSignature(this.signature);
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }

    this.emergentEventSubscriptions.forEach((unsubscribe) => unsubscribe());
    this.emergentEventSubscriptions = [];
    
    if (this.config.enableDebug) {
      console.log('[EnhancedMasterAnimationCoordinator] Emergent choreography destroyed');
    }
  }
}