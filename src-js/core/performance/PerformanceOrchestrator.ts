/**
 * PerformanceOrchestrator - Phase 3.2.1 Central Performance Coordination Hub
 * 
 * Philosophy: "In the Year 3000, performance orchestration becomes a living consciousness
 * that breathes with organic efficiency, coordinating all systems to maintain perfect 
 * 60fps harmony while adapting to device capabilities with biological intelligence."
 * 
 * Core Responsibilities:
 * - 60fps guarantee across all visual systems
 * - Quality scaling coordination with consciousness awareness
 * - Transition optimization with pre-computation and caching
 * - Performance budget enforcement with adaptive scaling
 * - Device-aware optimization with graceful degradation
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import { PerformanceAnalyzer } from '@/core/performance/PerformanceAnalyzer';
import { AdaptivePerformanceSystem } from '@/core/performance/AdaptivePerformanceSystem';
import { DeviceCapabilityDetector } from '@/core/performance/DeviceCapabilityDetector';
import { PerformanceBudgetManager } from '@/core/performance/PerformanceBudgetManager';
import { PerformanceAwareLerpCoordinator } from '@/core/performance/PerformanceAwareLerpCoordinator';
import { UnifiedCSSConsciousnessController } from '@/core/css/UnifiedCSSConsciousnessController';
import { GlobalEventBus } from '@/core/events/EventBus';
import type { IManagedSystem, HealthCheckResult } from '@/types/systems';
import type { Year3000Config } from '@/types/models';

// ============================================================================
// PERFORMANCE ORCHESTRATION INTERFACES
// ============================================================================

export interface PerformanceBudget {
  frameTimeMs: number;        // Maximum frame time (16.67ms for 60fps)
  memoryLimitMB: number;     // Memory usage limit
  cpuTimeSliceMs: number;    // CPU time budget per frame
  gpuUtilizationPercent: number; // Maximum GPU utilization
  transitionBudgetMs: number; // Budget for transitions
}

export interface QualityLevel {
  level: 'minimal' | 'low' | 'medium' | 'high' | 'ultra';
  targetFPS: number;
  memoryBudgetMB: number;
  cpuBudgetPercent: number;
  features: {
    webgl: boolean;
    particles: boolean;
    shaders: boolean;
    blur: boolean;
    shadows: boolean;
    animations: boolean;
  };
}

export interface QualityScalingCapable {
  setQualityLevel(level: QualityLevel): void;
  getPerformanceImpact(): PerformanceMetrics;
  reduceQuality(amount: number): void;
  increaseQuality(amount: number): void;
  getQualityCapabilities(): QualityCapability[];
}

export interface QualityCapability {
  name: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  canToggle: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsageMB: number;
  cpuUsagePercent: number;
  gpuUsagePercent: number;
  renderTime: number;
  timestamp: number;
}

export interface TransitionPlan {
  id: string;
  fromState: string;
  toState: string;
  estimatedDuration: number;
  precomputedFrames?: any[];
  optimizations: TransitionOptimization[];
  priority: 'low' | 'normal' | 'high' | 'critical';
}

export interface TransitionOptimization {
  type: 'precompute' | 'cache' | 'merge' | 'skip' | 'reduce';
  target: string;
  savings: number; // estimated ms saved
}

export interface PerformanceState {
  currentFPS: number;
  targetFPS: number;
  qualityLevel: QualityLevel;
  activeOptimizations: string[];
  systemHealth: 'excellent' | 'good' | 'degraded' | 'critical';
  budgetStatus: 'within' | 'warning' | 'exceeded';
}

// ============================================================================
// PERFORMANCE ORCHESTRATOR IMPLEMENTATION
// ============================================================================

export class PerformanceOrchestrator implements IManagedSystem {
  public initialized = false;
  
  // Core dependencies
  private config: Year3000Config;
  private performanceAnalyzer: PerformanceAnalyzer;
  private adaptivePerformanceSystem: AdaptivePerformanceSystem;
  private deviceCapabilityDetector: DeviceCapabilityDetector;
  private budgetManager: PerformanceBudgetManager;
  private lerpCoordinator: PerformanceAwareLerpCoordinator | null = null;
  private cssController: UnifiedCSSConsciousnessController | null = null;
  private eventBus: typeof GlobalEventBus;
  
  // Performance state management
  private currentPerformanceBudget: PerformanceBudget;
  private currentQualityLevel: QualityLevel;
  private registeredSystems = new Map<string, QualityScalingCapable>();
  private performanceState: PerformanceState;
  
  // Frame rate management
  private frameRateMonitor: {
    frameTimes: number[];
    lastFrameTime: number;
    consecutiveDrops: number;
    targetFPS: number;
    criticalThreshold: number;
  };
  
  // Quality scaling management
  private qualityLevels: Map<string, QualityLevel>;
  private systemQualityOverrides = new Map<string, Partial<QualityLevel>>();
  
  // Transition management
  private transitionCache = new Map<string, TransitionPlan>();
  private activeTransitions = new Set<string>();
  private transitionOptimizer: TransitionOptimizer;
  
  // Monitoring intervals
  private performanceMonitorInterval: number | null = null;
  private qualityAdjustmentInterval: number | null = null;
  
  constructor(
    config: Year3000Config,
    performanceAnalyzer: PerformanceAnalyzer,
    adaptivePerformanceSystem: AdaptivePerformanceSystem,
    deviceCapabilityDetector: DeviceCapabilityDetector,
    budgetManager: PerformanceBudgetManager
  ) {
    this.config = config;
    this.performanceAnalyzer = performanceAnalyzer;
    this.adaptivePerformanceSystem = adaptivePerformanceSystem;
    this.deviceCapabilityDetector = deviceCapabilityDetector;
    this.budgetManager = budgetManager;
    this.eventBus = GlobalEventBus;
    
    // Initialize performance budgets
    this.currentPerformanceBudget = this.createPerformanceBudget();
    
    // Initialize quality levels
    this.qualityLevels = this.createQualityLevels();
    this.currentQualityLevel = this.determineInitialQualityLevel();
    
    // Initialize frame rate monitoring
    this.frameRateMonitor = {
      frameTimes: [],
      lastFrameTime: performance.now(),
      consecutiveDrops: 0,
      targetFPS: 60,
      criticalThreshold: 30
    };
    
    // Initialize performance state
    this.performanceState = {
      currentFPS: 0,
      targetFPS: 60,
      qualityLevel: this.currentQualityLevel,
      activeOptimizations: [],
      systemHealth: 'good',
      budgetStatus: 'within'
    };
    
    // Initialize transition optimizer
    this.transitionOptimizer = new TransitionOptimizer(this);
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('PerformanceOrchestrator', 'Performance orchestrator initialized', {
        targetFPS: this.frameRateMonitor.targetFPS,
        qualityLevel: this.currentQualityLevel.level,
        memoryBudget: this.currentPerformanceBudget.memoryLimitMB
      });
    }
  }
  
  // ========================================================================
  // IMANAGEDYSTEM INTERFACE IMPLEMENTATION
  // ========================================================================
  
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Initialize dependencies
      await this.deviceCapabilityDetector.initialize();
      await this.adaptivePerformanceSystem.initialize();
      
      // Get CSS controller reference
      this.cssController = UnifiedCSSConsciousnessController.getInstance();
      
      // Initialize LERP coordinator
      this.lerpCoordinator = new PerformanceAwareLerpCoordinator();
      await this.lerpCoordinator.initialize();
      
      // Subscribe to events
      this.subscribeToEvents();
      
      // Start performance monitoring
      this.startPerformanceMonitoring();
      
      // Apply initial optimizations
      await this.applyInitialOptimizations();
      
      this.initialized = true;
      
      // Emit initialization event
      this.eventBus.emit('performance:orchestrator-initialized', {
        qualityLevel: this.currentQualityLevel,
        budget: this.currentPerformanceBudget
      });
      
      if (YEAR3000_CONFIG.enableDebug) {
        Y3K?.debug?.log('PerformanceOrchestrator', 'Performance orchestrator fully initialized');
      }
      
    } catch (error) {
      Y3K?.debug?.error('PerformanceOrchestrator', 'Initialization failed:', error);
      throw error;
    }
  }
  
  public updateAnimation(deltaTime: number): void {
    // Update frame rate monitoring
    this.updateFrameRateMonitoring(deltaTime);
    
    // Update LERP coordinator with current performance state
    if (this.lerpCoordinator?.initialized) {
      this.lerpCoordinator.updateAnimation(deltaTime);
      this.updateLerpCoordinatorPerformanceState();
    }
    
    // Check if performance intervention is needed
    if (this.shouldInterventForPerformance()) {
      this.performPerformanceIntervention();
    }
  }
  
  public async healthCheck(): Promise<HealthCheckResult> {
    const metrics = await this.getCurrentMetrics();
    const registeredSystemCount = this.registeredSystems.size;
    const activeTransitionCount = this.activeTransitions.size;
    
    const isHealthy = 
      metrics.fps >= this.frameRateMonitor.criticalThreshold &&
      metrics.memoryUsageMB < this.currentPerformanceBudget.memoryLimitMB &&
      this.performanceState.budgetStatus !== 'exceeded';
    
    return {
      system: 'PerformanceOrchestrator',
      healthy: isHealthy,
      ok: isHealthy,
      details: isHealthy ? 
        'Performance orchestration operating within targets' : 
        `Performance issues detected: FPS=${metrics.fps}, Memory=${metrics.memoryUsageMB}MB`,
      metrics: {
        currentFPS: metrics.fps,
        targetFPS: this.frameRateMonitor.targetFPS,
        qualityLevel: this.currentQualityLevel.level,
        registeredSystems: registeredSystemCount,
        activeTransitions: activeTransitionCount,
        budgetStatus: this.performanceState.budgetStatus,
        consecutiveFrameDrops: this.frameRateMonitor.consecutiveDrops
      }
    };
  }
  
  public destroy(): void {
    // Stop monitoring intervals
    if (this.performanceMonitorInterval) {
      clearInterval(this.performanceMonitorInterval);
      this.performanceMonitorInterval = null;
    }
    
    if (this.qualityAdjustmentInterval) {
      clearInterval(this.qualityAdjustmentInterval);
      this.qualityAdjustmentInterval = null;
    }
    
    // Destroy LERP coordinator
    if (this.lerpCoordinator) {
      this.lerpCoordinator.destroy();
      this.lerpCoordinator = null;
    }
    
    // Clear transition cache
    this.transitionCache.clear();
    this.activeTransitions.clear();
    
    // Unregister all systems
    this.registeredSystems.clear();
    
    this.initialized = false;
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('PerformanceOrchestrator', 'Performance orchestrator destroyed');
    }
  }
  
  // ========================================================================
  // PUBLIC API - 60FPS GUARANTEE SYSTEM
  // ========================================================================
  
  /**
   * Enforce 60fps across all registered systems
   */
  public maintain60FPS(): void {
    const currentFPS = this.performanceAnalyzer.getMedianFPS() || 0;
    this.performanceState.currentFPS = currentFPS;
    
    if (currentFPS < this.frameRateMonitor.targetFPS) {
      const deficit = this.frameRateMonitor.targetFPS - currentFPS;
      this.handleFrameRateDeficit(deficit);
    } else if (currentFPS > this.frameRateMonitor.targetFPS && this.currentQualityLevel.level !== 'ultra') {
      // Opportunity to increase quality
      this.considerQualityIncrease();
    }
  }
  
  /**
   * Enforce frame budgets across all systems
   */
  public enforceFrameBudgets(): void {
    const currentFrameTime = this.performanceAnalyzer.getAverageTime('render') || 16.67;
    const budgetExceeded = currentFrameTime > this.currentPerformanceBudget.frameTimeMs;
    
    this.performanceState.budgetStatus = budgetExceeded ? 'exceeded' : 'within';
    
    if (budgetExceeded) {
      const overage = currentFrameTime - this.currentPerformanceBudget.frameTimeMs;
      Y3K?.debug?.warn('PerformanceOrchestrator', `Frame budget exceeded by ${overage.toFixed(2)}ms`);
      
      // Implement budget enforcement
      this.enforceFrameBudgetViolation(overage);
    }
  }
  
  // ========================================================================
  // PUBLIC API - QUALITY SCALING COORDINATION
  // ========================================================================
  
  /**
   * Register a system for quality scaling coordination
   */
  public registerSystem(systemName: string, system: QualityScalingCapable): void {
    this.registeredSystems.set(systemName, system);
    
    // Apply current quality level to new system
    system.setQualityLevel(this.currentQualityLevel);
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('PerformanceOrchestrator', `Registered system for quality scaling: ${systemName}`);
    }
  }
  
  /**
   * Coordinate quality scaling across all systems
   */
  public coordinateQualityScaling(deviceTier: string): QualityLevel {
    const newQualityLevel = this.selectQualityLevelForDevice(deviceTier);
    
    if (newQualityLevel.level !== this.currentQualityLevel.level) {
      this.applyQualityLevel(newQualityLevel);
    }
    
    return newQualityLevel;
  }
  
  /**
   * Update quality settings across all systems
   */
  public updateSystemQualitySettings(settings: Partial<QualityLevel>): void {
    const updatedQuality = { ...this.currentQualityLevel, ...settings };
    this.applyQualityLevel(updatedQuality);
  }
  
  // ========================================================================
  // PUBLIC API - TRANSITION OPTIMIZATION
  // ========================================================================
  
  /**
   * Optimize transition between states
   */
  public optimizeTransition(fromState: string, toState: string): TransitionPlan {
    const transitionKey = `${fromState}->${toState}`;
    
    // Check cache first
    if (this.transitionCache.has(transitionKey)) {
      return this.transitionCache.get(transitionKey)!;
    }
    
    // Create new transition plan
    const plan = this.transitionOptimizer.createTransitionPlan(fromState, toState);
    this.transitionCache.set(transitionKey, plan);
    
    return plan;
  }
  
  /**
   * Preload transition assets for smoother performance
   */
  public preloadTransitionAssets(transitions: TransitionPlan[]): void {
    for (const transition of transitions) {
      this.transitionOptimizer.preloadTransition(transition);
    }
  }
  
  // ========================================================================
  // PUBLIC API - PERFORMANCE STATE ACCESS
  // ========================================================================
  
  public getPerformanceState(): PerformanceState {
    return { ...this.performanceState };
  }
  
  public getCurrentQualityLevel(): QualityLevel {
    return { ...this.currentQualityLevel };
  }
  
  public getPerformanceBudget(): PerformanceBudget {
    return { ...this.currentPerformanceBudget };
  }
  
  public async getCurrentMetrics(): Promise<PerformanceMetrics> {
    const currentFPS = this.performanceAnalyzer.getMedianFPS() || 0;
    const frameTime = currentFPS > 0 ? 1000 / currentFPS : 1000;
    
    return {
      fps: currentFPS,
      frameTime: frameTime,
      memoryUsageMB: this.getMemoryUsage(),
      cpuUsagePercent: this.getCPUUsage(),
      gpuUsagePercent: this.getGPUUsage(),
      renderTime: this.performanceAnalyzer.getAverageTime('render') || 16.67,
      timestamp: performance.now()
    };
  }

  /**
   * Get LERP coordinator for external access
   */
  public getLerpCoordinator(): PerformanceAwareLerpCoordinator | null {
    return this.lerpCoordinator;
  }
  
  // ========================================================================
  // PRIVATE IMPLEMENTATION
  // ========================================================================
  
  private createPerformanceBudget(): PerformanceBudget {
    const deviceCapabilities = this.deviceCapabilityDetector.deviceCapabilities;
    const memoryTier = deviceCapabilities?.memory.level || 'medium';
    
    return {
      frameTimeMs: 16.67, // 60fps target
      memoryLimitMB: this.getMemoryLimitForTier(memoryTier),
      cpuTimeSliceMs: 10,
      gpuUtilizationPercent: 40,
      transitionBudgetMs: 5
    };
  }
  
  private createQualityLevels(): Map<string, QualityLevel> {
    return new Map([
      ['minimal', {
        level: 'minimal',
        targetFPS: 30,
        memoryBudgetMB: 15,
        cpuBudgetPercent: 15,
        features: {
          webgl: false,
          particles: false,
          shaders: false,
          blur: false,
          shadows: false,
          animations: true
        }
      }],
      ['low', {
        level: 'low',
        targetFPS: 45,
        memoryBudgetMB: 25,
        cpuBudgetPercent: 20,
        features: {
          webgl: false,
          particles: false,
          shaders: false,
          blur: true,
          shadows: false,
          animations: true
        }
      }],
      ['medium', {
        level: 'medium',
        targetFPS: 60,
        memoryBudgetMB: 35,
        cpuBudgetPercent: 25,
        features: {
          webgl: true,
          particles: true,
          shaders: false,
          blur: true,
          shadows: true,
          animations: true
        }
      }],
      ['high', {
        level: 'high',
        targetFPS: 60,
        memoryBudgetMB: 45,
        cpuBudgetPercent: 30,
        features: {
          webgl: true,
          particles: true,
          shaders: true,
          blur: true,
          shadows: true,
          animations: true
        }
      }],
      ['ultra', {
        level: 'ultra',
        targetFPS: 60,
        memoryBudgetMB: 50,
        cpuBudgetPercent: 35,
        features: {
          webgl: true,
          particles: true,
          shaders: true,
          blur: true,
          shadows: true,
          animations: true
        }
      }]
    ]);
  }
  
  private determineInitialQualityLevel(): QualityLevel {
    const deviceCapabilities = this.deviceCapabilityDetector.deviceCapabilities;
    
    if (!deviceCapabilities) {
      return this.qualityLevels.get('medium')!;
    }
    
    const tier = deviceCapabilities.overall;
    switch (tier) {
      case 'high':
        return this.qualityLevels.get('high')!;
      case 'medium':
        return this.qualityLevels.get('medium')!;
      case 'low':
        return this.qualityLevels.get('low')!;
      default:
        return this.qualityLevels.get('minimal')!;
    }
  }
  
  private selectQualityLevelForDevice(deviceTier: string): QualityLevel {
    return this.qualityLevels.get(deviceTier) || this.qualityLevels.get('medium')!;
  }
  
  private applyQualityLevel(qualityLevel: QualityLevel): void {
    this.currentQualityLevel = qualityLevel;
    this.performanceState.qualityLevel = qualityLevel;
    this.frameRateMonitor.targetFPS = qualityLevel.targetFPS;
    
    // Apply to all registered systems
    for (const [systemName, system] of this.registeredSystems) {
      try {
        system.setQualityLevel(qualityLevel);
      } catch (error) {
        Y3K?.debug?.error('PerformanceOrchestrator', `Failed to apply quality level to ${systemName}:`, error);
      }
    }
    
    // Update CSS variables
    if (this.cssController) {
      this.cssController.updatePerformanceVariables({
        'quality.level': qualityLevel.level === 'minimal' ? 0 : 
                       qualityLevel.level === 'low' ? 0.25 :
                       qualityLevel.level === 'medium' ? 0.5 :
                       qualityLevel.level === 'high' ? 0.75 : 1.0,
        'fps.target': qualityLevel.targetFPS,
        'frame.budget': 1000 / qualityLevel.targetFPS,
        'optimization.level': qualityLevel.level === 'minimal' ? 3 :
                            qualityLevel.level === 'low' ? 2 :
                            qualityLevel.level === 'medium' ? 1 : 0
      });
    }
    
    // Emit quality change event
    this.eventBus.emit('performance:quality-changed', {
      oldLevel: this.performanceState.qualityLevel,
      newLevel: qualityLevel,
      reason: 'orchestrator-coordination'
    });
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('PerformanceOrchestrator', `Quality level changed to: ${qualityLevel.level}`);
    }
  }
  
  private updateFrameRateMonitoring(deltaTime: number): void {
    const currentTime = performance.now();
    const frameTime = currentTime - this.frameRateMonitor.lastFrameTime;
    
    this.frameRateMonitor.frameTimes.push(frameTime);
    if (this.frameRateMonitor.frameTimes.length > 60) {
      this.frameRateMonitor.frameTimes.shift();
    }
    
    // Calculate current FPS
    const avgFrameTime = this.frameRateMonitor.frameTimes.reduce((a, b) => a + b, 0) / this.frameRateMonitor.frameTimes.length;
    const currentFPS = 1000 / avgFrameTime;
    this.performanceState.currentFPS = currentFPS;
    
    // Check for frame drops
    if (frameTime > (1000 / this.frameRateMonitor.targetFPS) * 1.5) {
      this.frameRateMonitor.consecutiveDrops++;
    } else {
      this.frameRateMonitor.consecutiveDrops = 0;
    }
    
    this.frameRateMonitor.lastFrameTime = currentTime;
  }
  
  private shouldInterventForPerformance(): boolean {
    return (
      this.frameRateMonitor.consecutiveDrops >= 3 ||
      this.performanceState.currentFPS < this.frameRateMonitor.criticalThreshold ||
      this.performanceState.budgetStatus === 'exceeded'
    );
  }
  
  private performPerformanceIntervention(): void {
    // Immediate intervention for critical performance issues
    const currentQualityIndex = Array.from(this.qualityLevels.keys()).indexOf(this.currentQualityLevel.level);
    
    if (currentQualityIndex > 0) {
      const qualityKeys = Array.from(this.qualityLevels.keys());
      const lowerQualityKey = qualityKeys[currentQualityIndex - 1];
      if (!lowerQualityKey) return;
      
      const lowerQuality = this.qualityLevels.get(lowerQualityKey);
      if (!lowerQuality) return;
      
      Y3K?.debug?.warn('PerformanceOrchestrator', `Performance intervention: reducing quality to ${lowerQuality.level}`);
      this.applyQualityLevel(lowerQuality);
      
      // Add to active optimizations
      this.performanceState.activeOptimizations.push(`quality-reduced-to-${lowerQuality.level}`);
    }
  }
  
  private handleFrameRateDeficit(deficit: number): void {
    // Calculate required optimization level
    const optimizationLevel = deficit / this.frameRateMonitor.targetFPS;
    
    if (optimizationLevel > 0.3) {
      // Significant deficit - reduce quality
      this.performPerformanceIntervention();
    } else if (optimizationLevel > 0.1) {
      // Minor deficit - selective optimizations
      this.applySelectiveOptimizations(optimizationLevel);
    }
  }
  
  private considerQualityIncrease(): void {
    // Only consider quality increase if performance has been stable
    if (this.frameRateMonitor.consecutiveDrops === 0 && this.performanceState.budgetStatus === 'within') {
      const currentQualityIndex = Array.from(this.qualityLevels.keys()).indexOf(this.currentQualityLevel.level);
      
      if (currentQualityIndex < this.qualityLevels.size - 1) {
        const qualityKeys = Array.from(this.qualityLevels.keys());
        const higherQualityKey = qualityKeys[currentQualityIndex + 1];
        if (!higherQualityKey) return;
        
        const higherQuality = this.qualityLevels.get(higherQualityKey);
        if (!higherQuality) return;
        
        // Test higher quality briefly
        setTimeout(() => {
          this.applyQualityLevel(higherQuality);
        }, 1000);
      }
    }
  }
  
  private applySelectiveOptimizations(level: number): void {
    // Apply incremental optimizations based on level
    const optimizations = [];
    
    if (level > 0.15) {
      optimizations.push('reduce-particle-density');
    }
    
    if (level > 0.2) {
      optimizations.push('disable-shadows');
    }
    
    if (level > 0.25) {
      optimizations.push('reduce-blur-quality');
    }
    
    this.performanceState.activeOptimizations = optimizations;
    
    // Apply optimizations to registered systems
    for (const [systemName, system] of this.registeredSystems) {
      system.reduceQuality(level);
    }
  }
  
  private enforceFrameBudgetViolation(overage: number): void {
    // Implement budget enforcement strategies
    const violationLevel = overage / this.currentPerformanceBudget.frameTimeMs;
    
    if (violationLevel > 0.5) {
      // Severe violation - emergency optimizations
      this.performPerformanceIntervention();
    } else {
      // Moderate violation - selective reductions
      this.applySelectiveOptimizations(violationLevel);
    }
  }
  
  private startPerformanceMonitoring(): void {
    // Monitor performance every 100ms
    this.performanceMonitorInterval = window.setInterval(() => {
      this.maintain60FPS();
      this.enforceFrameBudgets();
      this.updateSystemHealth();
    }, 100);
    
    // Quality adjustment check every 5 seconds
    this.qualityAdjustmentInterval = window.setInterval(() => {
      this.evaluateQualityAdjustment();
    }, 5000);
  }
  
  private subscribeToEvents(): void {
    this.eventBus.subscribe('performance:thermal-warning', () => {
      this.handleThermalWarning();
    });
    
    this.eventBus.subscribe('performance:memory-pressure', (data: any) => {
      this.handleMemoryPressure(data.level);
    });
    
    this.eventBus.subscribe('performance:battery-low', () => {
      this.handleBatteryOptimization();
    });
  }
  
  private async applyInitialOptimizations(): Promise<void> {
    // Apply device-specific optimizations
    const deviceCapabilities = this.deviceCapabilityDetector.deviceCapabilities;
    
    if (deviceCapabilities?.memory.level === 'low') {
      this.performanceState.activeOptimizations.push('low-memory-mode');
    }
    
    if (deviceCapabilities?.cpu.level === 'low') {
      this.performanceState.activeOptimizations.push('cpu-conservation');
    }
    
    // Apply initial quality level
    this.applyQualityLevel(this.currentQualityLevel);
  }
  
  private updateSystemHealth(): void {
    const currentFPS = this.performanceState.currentFPS;
    const memoryUsage = this.getMemoryUsage();
    
    if (currentFPS >= this.frameRateMonitor.targetFPS * 0.9 && memoryUsage < this.currentPerformanceBudget.memoryLimitMB * 0.8) {
      this.performanceState.systemHealth = 'excellent';
    } else if (currentFPS >= this.frameRateMonitor.targetFPS * 0.75 && memoryUsage < this.currentPerformanceBudget.memoryLimitMB * 0.9) {
      this.performanceState.systemHealth = 'good';
    } else if (currentFPS >= this.frameRateMonitor.criticalThreshold && memoryUsage < this.currentPerformanceBudget.memoryLimitMB) {
      this.performanceState.systemHealth = 'degraded';
    } else {
      this.performanceState.systemHealth = 'critical';
    }
  }
  
  private evaluateQualityAdjustment(): void {
    // Evaluate if quality should be adjusted based on sustained performance
    const recentPerformance = this.frameRateMonitor.frameTimes.slice(-30);
    const avgRecentFPS = 1000 / (recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length);
    
    if (avgRecentFPS < this.frameRateMonitor.targetFPS * 0.8) {
      // Sustained poor performance - reduce quality
      this.performPerformanceIntervention();
    } else if (avgRecentFPS > this.frameRateMonitor.targetFPS * 1.1) {
      // Sustained good performance - consider quality increase
      this.considerQualityIncrease();
    }
  }
  
  private handleThermalWarning(): void {
    // Reduce performance to manage thermal load
    this.performPerformanceIntervention();
    this.performanceState.activeOptimizations.push('thermal-throttling');
  }
  
  private handleMemoryPressure(level: string): void {
    if (level === 'high') {
      this.performPerformanceIntervention();
      this.performanceState.activeOptimizations.push('memory-pressure-reduction');
    }
  }
  
  private handleBatteryOptimization(): void {
    // Apply battery saving optimizations
    const batteryQuality = this.qualityLevels.get('low')!;
    this.applyQualityLevel(batteryQuality);
    this.performanceState.activeOptimizations.push('battery-optimization');
  }
  
  private getMemoryLimitForTier(tier: string): number {
    switch (tier) {
      case 'high': return 50;
      case 'medium': return 35;
      case 'low': return 25;
      default: return 15;
    }
  }
  
  private getMemoryUsage(): number {
    const memoryInfo = (performance as any).memory;
    return memoryInfo ? memoryInfo.usedJSHeapSize / (1024 * 1024) : 0;
  }
  
  private getCPUUsage(): number {
    // Estimate CPU usage based on frame times
    const avgFrameTime = this.frameRateMonitor.frameTimes.reduce((a, b) => a + b, 0) / this.frameRateMonitor.frameTimes.length;
    return Math.min(100, (avgFrameTime / 16.67) * 20); // Rough estimation
  }
  
  private getGPUUsage(): number {
    // GPU usage estimation (simplified)
    return this.currentQualityLevel.features.webgl ? 30 : 5;
  }
  
  /**
   * Update LERP coordinator with current performance state
   */
  private updateLerpCoordinatorPerformanceState(): void {
    if (!this.lerpCoordinator?.initialized) return;
    
    const currentFPS = this.performanceAnalyzer.getMedianFPS() || 0;
    const frameTime = currentFPS > 0 ? 1000 / currentFPS : 1000;
    
    // Create performance context for LERP coordinator
    const performanceContext = {
      currentFPS,
      targetFPS: this.frameRateMonitor.targetFPS,
      frameTimeMs: frameTime,
      frameBudgetMs: this.currentPerformanceBudget.frameTimeMs,
      qualityLevel: this.currentQualityLevel.level,
      qualityScore: this.calculateQualityScore(),
      deviceTier: this.determineDeviceTier(),
      thermalState: this.getThermalState(),
      powerLevel: this.getPowerLevel(),
      memoryPressure: this.getMemoryPressure(),
      cpuUtilization: this.getCPUUsage() / 100,
      memoryUtilization: this.getMemoryUsage() / this.currentPerformanceBudget.memoryLimitMB,
      gpuUtilization: this.getGPUUsage() / 100
    };
    
    this.lerpCoordinator.updatePerformanceState(performanceContext);
  }
  
  /**
   * Calculate overall quality score (0-1)
   */
  private calculateQualityScore(): number {
    const qualityMap = {
      'minimal': 0.1,
      'low': 0.3,
      'medium': 0.5,
      'high': 0.7,
      'ultra': 0.9
    };
    return qualityMap[this.currentQualityLevel.level] || 0.5;
  }
  
  /**
   * Determine device tier based on capabilities
   */
  private determineDeviceTier(): 'minimal' | 'low' | 'medium' | 'high' | 'ultra' {
    const deviceCapabilities = this.deviceCapabilityDetector.deviceCapabilities;
    if (!deviceCapabilities) return 'medium';
    
    switch (deviceCapabilities.overall) {
      case 'high': return 'ultra';
      case 'medium': return 'high';
      case 'low': return 'medium';
      default: return 'low';
    }
  }
  
  /**
   * Get thermal state (simplified - would need actual thermal monitoring)
   */
  private getThermalState(): 'nominal' | 'warm' | 'hot' | 'critical' {
    // Simple heuristic based on performance degradation
    const avgFPS = this.performanceAnalyzer.getMedianFPS() || 60;
    if (avgFPS < this.frameRateMonitor.targetFPS * 0.6) return 'critical';
    if (avgFPS < this.frameRateMonitor.targetFPS * 0.8) return 'hot';
    if (avgFPS < this.frameRateMonitor.targetFPS * 0.9) return 'warm';
    return 'nominal';
  }
  
  /**
   * Get power level (simplified - would need battery API integration)
   */
  private getPowerLevel(): 'high' | 'balanced' | 'battery-saver' {
    // Default to balanced, would integrate with AdaptivePerformanceSystem
    return 'balanced';
  }
  
  /**
   * Get memory pressure level
   */
  private getMemoryPressure(): 'low' | 'medium' | 'high' {
    const memoryUsage = this.getMemoryUsage();
    const memoryLimit = this.currentPerformanceBudget.memoryLimitMB;
    
    const utilizationRatio = memoryUsage / memoryLimit;
    if (utilizationRatio > 0.8) return 'high';
    if (utilizationRatio > 0.6) return 'medium';
    return 'low';
  }
}

// ============================================================================
// TRANSITION OPTIMIZER HELPER CLASS
// ============================================================================

class TransitionOptimizer {
  private orchestrator: PerformanceOrchestrator;
  
  constructor(orchestrator: PerformanceOrchestrator) {
    this.orchestrator = orchestrator;
  }
  
  createTransitionPlan(fromState: string, toState: string): TransitionPlan {
    return {
      id: `transition_${Date.now()}`,
      fromState,
      toState,
      estimatedDuration: this.estimateTransitionDuration(fromState, toState),
      optimizations: this.generateOptimizations(fromState, toState),
      priority: this.determineTransitionPriority(fromState, toState)
    };
  }
  
  preloadTransition(transition: TransitionPlan): void {
    // Preload transition assets and precompute frames
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('TransitionOptimizer', `Preloading transition: ${transition.fromState} -> ${transition.toState}`);
    }
  }
  
  private estimateTransitionDuration(fromState: string, toState: string): number {
    // Estimate based on state complexity
    return 300; // ms
  }
  
  private generateOptimizations(fromState: string, toState: string): TransitionOptimization[] {
    return [
      {
        type: 'precompute',
        target: 'transition-frames',
        savings: 5
      },
      {
        type: 'cache',
        target: 'intermediate-states',
        savings: 3
      }
    ];
  }
  
  private determineTransitionPriority(fromState: string, toState: string): 'low' | 'normal' | 'high' | 'critical' {
    // Determine priority based on transition type
    return 'normal';
  }
}