/**
 * QualityScalingManager - Phase 3.2.2 Unified Quality Scaling Integration
 * 
 * Philosophy: "In the consciousness of the Year 3000, quality scaling becomes 
 * an organic adaptation - like a living cell adjusting its metabolism to 
 * environmental conditions while preserving its essential functions."
 * 
 * Core Responsibilities:
 * - Unified quality scaling across all visual systems
 * - Consciousness-aware quality adaptation
 * - Granular feature toggling with performance impact analysis
 * - Quality level caching and interpolation
 * - Device-specific quality profiles
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import { PerformanceAnalyzer } from '@/core/performance/PerformanceAnalyzer';
import { DeviceCapabilityDetector } from '@/core/performance/DeviceCapabilityDetector';
import { PerformanceAwareLerpCoordinator } from '@/core/performance/PerformanceAwareLerpCoordinator';
import { GlobalEventBus } from '@/core/events/EventBus';
import type { QualityLevel, QualityScalingCapable, QualityCapability } from '@/core/performance/PerformanceOrchestrator';
import type { Year3000Config } from '@/types/models';

// ============================================================================
// QUALITY SCALING INTERFACES
// ============================================================================

export interface QualityProfile {
  name: string;
  displayName: string;
  description: string;
  levels: QualityLevel[];
  deviceRequirements: {
    minMemoryGB: number;
    minCPUCores: number;
    requiresWebGL: boolean;
    requiresGPU: boolean;
  };
}

export interface QualityFeature {
  id: string;
  name: string;
  description: string;
  category: 'visual' | 'performance' | 'effects' | 'animation';
  impact: {
    cpu: number;      // 0-1 CPU impact
    memory: number;   // 0-1 Memory impact
    gpu: number;      // 0-1 GPU impact
    battery: number;  // 0-1 Battery impact
  };
  dependencies: string[]; // Other features this depends on
  conflicts: string[];    // Features that conflict with this one
  enabled: boolean;
  quality: number;        // 0-1 quality contribution
}

export interface QualityAdjustment {
  systemName: string;
  feature: string;
  oldValue: any;
  newValue: any;
  performanceGain: number; // estimated ms saved per frame
  qualityLoss: number;     // 0-1 quality impact
  timestamp: number;
}

export interface QualityMetrics {
  overallQuality: number;     // 0-1 current quality score
  performanceImpact: number;  // 0-1 performance cost
  enabledFeatures: number;    // count of enabled features
  availableFeatures: number;  // count of total features
  deviceUtilization: {
    cpu: number;
    memory: number;
    gpu: number;
  };
  recentAdjustments: QualityAdjustment[];
}

// ============================================================================
// QUALITY SCALING MANAGER IMPLEMENTATION
// ============================================================================

export class QualityScalingManager {
  private config: Year3000Config;
  private performanceAnalyzer: PerformanceAnalyzer;
  private deviceCapabilityDetector: DeviceCapabilityDetector;
  private lerpCoordinator: PerformanceAwareLerpCoordinator | null = null;
  private eventBus: typeof GlobalEventBus;
  
  // Quality management state
  private qualityProfiles = new Map<string, QualityProfile>();
  private qualityFeatures = new Map<string, QualityFeature>();
  private registeredSystems = new Map<string, QualityScalingCapable>();
  private systemQualityStates = new Map<string, QualityLevel>();
  
  // Current quality state
  private currentProfile: QualityProfile | null = null;
  private currentQualityLevel: QualityLevel | null = null;
  private qualityMetrics: QualityMetrics;
  
  // Quality adjustment history
  private adjustmentHistory: QualityAdjustment[] = [];
  private lastQualityCheck = 0;
  private qualityCheckInterval = 2000; // 2 seconds
  
  // Performance thresholds for automatic adjustments
  private performanceThresholds = {
    excellent: { minFPS: 58, maxFrameTime: 17 },
    good: { minFPS: 50, maxFrameTime: 20 },
    degraded: { minFPS: 40, maxFrameTime: 25 },
    critical: { minFPS: 30, maxFrameTime: 33 }
  };
  
  constructor(
    config: Year3000Config,
    performanceAnalyzer: PerformanceAnalyzer,
    deviceCapabilityDetector: DeviceCapabilityDetector
  ) {
    this.config = config;
    this.performanceAnalyzer = performanceAnalyzer;
    this.deviceCapabilityDetector = deviceCapabilityDetector;
    this.eventBus = GlobalEventBus;
    
    // Initialize quality metrics
    this.qualityMetrics = {
      overallQuality: 0.5,
      performanceImpact: 0.3,
      enabledFeatures: 0,
      availableFeatures: 0,
      deviceUtilization: { cpu: 0, memory: 0, gpu: 0 },
      recentAdjustments: []
    };
    
    // Initialize quality profiles and features
    this.initializeQualityProfiles();
    this.initializeQualityFeatures();
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('QualityScalingManager', 'Quality scaling manager initialized', {
        profiles: this.qualityProfiles.size,
        features: this.qualityFeatures.size
      });
    }
  }
  
  // ========================================================================
  // PUBLIC API - LERP COORDINATOR INTEGRATION
  // ========================================================================
  
  /**
   * Set the LERP coordinator for performance-aware quality scaling
   */
  public setLerpCoordinator(coordinator: PerformanceAwareLerpCoordinator): void {
    this.lerpCoordinator = coordinator;
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('QualityScalingManager', 'LERP coordinator integrated for performance-aware scaling');
    }
  }

  // ========================================================================
  // PUBLIC API - SYSTEM REGISTRATION
  // ========================================================================
  
  /**
   * Register a system for quality scaling management
   */
  public registerSystem(systemName: string, system: QualityScalingCapable): void {
    this.registeredSystems.set(systemName, system);
    
    // Get system capabilities
    const capabilities = system.getQualityCapabilities();
    this.integrateSystemCapabilities(systemName, capabilities);
    
    // Apply current quality level if available
    if (this.currentQualityLevel) {
      system.setQualityLevel(this.currentQualityLevel);
      this.systemQualityStates.set(systemName, this.currentQualityLevel);
    }
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('QualityScalingManager', `Registered system: ${systemName}`, {
        capabilities: capabilities.length
      });
    }
  }
  
  /**
   * Unregister a system from quality scaling
   */
  public unregisterSystem(systemName: string): void {
    this.registeredSystems.delete(systemName);
    this.systemQualityStates.delete(systemName);
    
    // Remove system-specific features
    const systemFeatures = Array.from(this.qualityFeatures.entries())
      .filter(([id, feature]) => id.startsWith(systemName))
      .map(([id]) => id);
    
    for (const featureId of systemFeatures) {
      this.qualityFeatures.delete(featureId);
    }
    
    this.updateQualityMetrics();
  }
  
  // ========================================================================
  // PUBLIC API - QUALITY LEVEL MANAGEMENT
  // ========================================================================
  
  /**
   * Set quality level for all registered systems
   */
  public setGlobalQualityLevel(qualityLevel: QualityLevel): void {
    this.currentQualityLevel = qualityLevel;
    
    const adjustments: QualityAdjustment[] = [];
    
    // Apply to all registered systems
    for (const [systemName, system] of this.registeredSystems) {
      try {
        const oldLevel = this.systemQualityStates.get(systemName);
        system.setQualityLevel(qualityLevel);
        this.systemQualityStates.set(systemName, qualityLevel);
        
        // Record adjustment
        adjustments.push({
          systemName,
          feature: 'global-quality-level',
          oldValue: oldLevel?.level || 'unknown',
          newValue: qualityLevel.level,
          performanceGain: this.estimatePerformanceGain(oldLevel, qualityLevel),
          qualityLoss: this.estimateQualityLoss(oldLevel, qualityLevel),
          timestamp: performance.now()
        });
        
      } catch (error) {
        Y3K?.debug?.error('QualityScalingManager', `Failed to set quality level for ${systemName}:`, error);
      }
    }
    
    // Update adjustment history
    this.adjustmentHistory.push(...adjustments);
    this.trimAdjustmentHistory();
    
    // Update metrics
    this.updateQualityMetrics();
    
    // Emit quality change event
    this.eventBus.emit('quality:level-changed', {
      newLevel: qualityLevel,
      affectedSystems: Array.from(this.registeredSystems.keys()),
      adjustments
    });
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('QualityScalingManager', `Global quality level set to: ${qualityLevel.level}`, {
        systemsAffected: adjustments.length
      });
    }
  }
  
  /**
   * Set quality level for a specific system
   */
  public setSystemQualityLevel(systemName: string, qualityLevel: QualityLevel): void {
    const system = this.registeredSystems.get(systemName);
    if (!system) {
      Y3K?.debug?.warn('QualityScalingManager', `System not found: ${systemName}`);
      return;
    }
    
    const oldLevel = this.systemQualityStates.get(systemName);
    
    try {
      system.setQualityLevel(qualityLevel);
      this.systemQualityStates.set(systemName, qualityLevel);
      
      // Record adjustment
      const adjustment: QualityAdjustment = {
        systemName,
        feature: 'system-quality-level',
        oldValue: oldLevel?.level || 'unknown',
        newValue: qualityLevel.level,
        performanceGain: this.estimatePerformanceGain(oldLevel, qualityLevel),
        qualityLoss: this.estimateQualityLoss(oldLevel, qualityLevel),
        timestamp: performance.now()
      };
      
      this.adjustmentHistory.push(adjustment);
      this.trimAdjustmentHistory();
      
      // Update metrics
      this.updateQualityMetrics();
      
      if (YEAR3000_CONFIG.enableDebug) {
        Y3K?.debug?.log('QualityScalingManager', `Quality level set for ${systemName}: ${qualityLevel.level}`);
      }
      
    } catch (error) {
      Y3K?.debug?.error('QualityScalingManager', `Failed to set quality level for ${systemName}:`, error);
    }
  }
  
  // ========================================================================
  // PUBLIC API - CONSCIOUSNESS-AWARE ADAPTATION
  // ========================================================================
  
  /**
   * Adapt quality based on consciousness state and performance
   */
  public adaptToConsciousnessState(consciousnessIntensity: number, musicEnergy: number): void {
    const currentTime = performance.now();
    
    // Don't adapt too frequently
    if (currentTime - this.lastQualityCheck < this.qualityCheckInterval) {
      return;
    }
    
    this.lastQualityCheck = currentTime;
    
    // Get current performance metrics
    const currentFPS = this.performanceAnalyzer.getMedianFPS() || 0;
    const frameTime = this.performanceAnalyzer.getAverageTime('render') || 16.67;
    
    // Determine performance tier
    const performanceTier = this.getPerformanceTier(currentFPS, frameTime);
    
    // Calculate desired quality based on consciousness and performance
    const desiredQuality = this.calculateConsciousnessAwareQuality(
      consciousnessIntensity,
      musicEnergy,
      performanceTier
    );
    
    // Coordinate with LERP system for musical consciousness integration
    if (this.lerpCoordinator?.initialized) {
      this.coordinateLerpConsciousness(consciousnessIntensity, musicEnergy, performanceTier);
    }
    
    // Apply quality adjustments if needed
    if (this.shouldAdjustQuality(desiredQuality)) {
      this.applyConsciousnessQualityAdjustment(desiredQuality, consciousnessIntensity, musicEnergy);
    }
  }
  
  /**
   * Reduce quality across all systems with intelligent prioritization
   */
  public reduceQualityIntelligently(targetReduction: number): QualityAdjustment[] {
    const adjustments: QualityAdjustment[] = [];
    let remainingReduction = targetReduction;
    
    // Get features sorted by impact/quality ratio (best candidates for reduction)
    const reductionCandidates = this.getQualityReductionCandidates();
    
    for (const candidate of reductionCandidates) {
      if (remainingReduction <= 0) break;
      
      const system = this.registeredSystems.get(candidate.systemName);
      if (!system) continue;
      
      try {
        // Apply quality reduction to this feature
        const reductionAmount = Math.min(remainingReduction, candidate.maxReduction);
        system.reduceQuality(reductionAmount);
        
        const adjustment: QualityAdjustment = {
          systemName: candidate.systemName,
          feature: candidate.featureName,
          oldValue: candidate.currentValue,
          newValue: candidate.reducedValue,
          performanceGain: candidate.performanceGain,
          qualityLoss: candidate.qualityLoss,
          timestamp: performance.now()
        };
        
        adjustments.push(adjustment);
        remainingReduction -= reductionAmount;
        
      } catch (error) {
        Y3K?.debug?.error('QualityScalingManager', `Failed to reduce quality for ${candidate.systemName}:`, error);
      }
    }
    
    // Update adjustment history and metrics
    this.adjustmentHistory.push(...adjustments);
    this.trimAdjustmentHistory();
    this.updateQualityMetrics();
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('QualityScalingManager', `Intelligent quality reduction applied`, {
        targetReduction,
        actualReduction: targetReduction - remainingReduction,
        adjustments: adjustments.length
      });
    }
    
    return adjustments;
  }
  
  /**
   * Increase quality where performance allows
   */
  public increaseQualityOpportunistically(): QualityAdjustment[] {
    const adjustments: QualityAdjustment[] = [];
    
    // Only increase quality if performance is good
    const currentFPS = this.performanceAnalyzer.getMedianFPS() || 0;
    const frameTime = this.performanceAnalyzer.getAverageTime('render') || 16.67;
    
    if (currentFPS < this.performanceThresholds.good.minFPS) {
      return adjustments; // Performance not good enough for quality increases
    }
    
    // Get features that can be safely increased
    const improvementCandidates = this.getQualityImprovementCandidates();
    
    for (const candidate of improvementCandidates) {
      const system = this.registeredSystems.get(candidate.systemName);
      if (!system) continue;
      
      try {
        system.increaseQuality(candidate.improvementAmount);
        
        const adjustment: QualityAdjustment = {
          systemName: candidate.systemName,
          feature: candidate.featureName,
          oldValue: candidate.currentValue,
          newValue: candidate.improvedValue,
          performanceGain: -candidate.performanceCost, // negative because it costs performance
          qualityLoss: -candidate.qualityGain, // negative because it's a gain
          timestamp: performance.now()
        };
        
        adjustments.push(adjustment);
        
      } catch (error) {
        Y3K?.debug?.error('QualityScalingManager', `Failed to increase quality for ${candidate.systemName}:`, error);
      }
    }
    
    // Update adjustment history and metrics
    this.adjustmentHistory.push(...adjustments);
    this.trimAdjustmentHistory();
    this.updateQualityMetrics();
    
    return adjustments;
  }
  
  // ========================================================================
  // PUBLIC API - METRICS AND STATE ACCESS
  // ========================================================================
  
  public getQualityMetrics(): QualityMetrics {
    return { ...this.qualityMetrics };
  }
  
  public getCurrentQualityLevel(): QualityLevel | null {
    return this.currentQualityLevel ? { ...this.currentQualityLevel } : null;
  }
  
  public getSystemQualityState(systemName: string): QualityLevel | null {
    const state = this.systemQualityStates.get(systemName);
    return state ? { ...state } : null;
  }
  
  public getQualityProfiles(): QualityProfile[] {
    return Array.from(this.qualityProfiles.values());
  }
  
  public getQualityFeatures(): QualityFeature[] {
    return Array.from(this.qualityFeatures.values());
  }
  
  public getRecentAdjustments(limit: number = 20): QualityAdjustment[] {
    return this.adjustmentHistory.slice(-limit);
  }
  
  // ========================================================================
  // PRIVATE IMPLEMENTATION
  // ========================================================================
  
  private initializeQualityProfiles(): void {
    // Minimal Quality Profile
    this.qualityProfiles.set('minimal', {
      name: 'minimal',
      displayName: 'Minimal Quality',
      description: 'Optimized for low-end devices with essential features only',
      levels: [{
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
      deviceRequirements: {
        minMemoryGB: 2,
        minCPUCores: 2,
        requiresWebGL: false,
        requiresGPU: false
      }
    });
    
    // Balanced Quality Profile
    this.qualityProfiles.set('balanced', {
      name: 'balanced',
      displayName: 'Balanced Quality',
      description: 'Optimal balance between quality and performance',
      levels: [{
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
      deviceRequirements: {
        minMemoryGB: 4,
        minCPUCores: 4,
        requiresWebGL: true,
        requiresGPU: false
      }
    });
    
    // High Quality Profile
    this.qualityProfiles.set('high', {
      name: 'high',
      displayName: 'High Quality',
      description: 'Maximum visual fidelity for high-end devices',
      levels: [{
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
      }],
      deviceRequirements: {
        minMemoryGB: 8,
        minCPUCores: 6,
        requiresWebGL: true,
        requiresGPU: true
      }
    });
  }
  
  private initializeQualityFeatures(): void {
    // Visual Features
    this.qualityFeatures.set('webgl-rendering', {
      id: 'webgl-rendering',
      name: 'WebGL Rendering',
      description: 'Hardware-accelerated graphics rendering',
      category: 'visual',
      impact: { cpu: 0.2, memory: 0.3, gpu: 0.8, battery: 0.4 },
      dependencies: [],
      conflicts: ['css-fallback'],
      enabled: true,
      quality: 0.4
    });
    
    this.qualityFeatures.set('particle-effects', {
      id: 'particle-effects',
      name: 'Particle Effects',
      description: 'Dynamic particle systems for enhanced visuals',
      category: 'effects',
      impact: { cpu: 0.3, memory: 0.2, gpu: 0.6, battery: 0.3 },
      dependencies: ['webgl-rendering'],
      conflicts: [],
      enabled: true,
      quality: 0.3
    });
    
    this.qualityFeatures.set('advanced-shaders', {
      id: 'advanced-shaders',
      name: 'Advanced Shaders',
      description: 'Complex shader effects for premium visuals',
      category: 'effects',
      impact: { cpu: 0.1, memory: 0.1, gpu: 0.9, battery: 0.5 },
      dependencies: ['webgl-rendering'],
      conflicts: [],
      enabled: false,
      quality: 0.5
    });
    
    this.qualityFeatures.set('blur-effects', {
      id: 'blur-effects',
      name: 'Blur Effects',
      description: 'Gaussian blur and backdrop effects',
      category: 'visual',
      impact: { cpu: 0.4, memory: 0.1, gpu: 0.3, battery: 0.2 },
      dependencies: [],
      conflicts: [],
      enabled: true,
      quality: 0.2
    });
    
    this.qualityFeatures.set('shadow-effects', {
      id: 'shadow-effects',
      name: 'Shadow Effects',
      description: 'Dynamic shadows and depth effects',
      category: 'visual',
      impact: { cpu: 0.3, memory: 0.1, gpu: 0.4, battery: 0.2 },
      dependencies: [],
      conflicts: [],
      enabled: true,
      quality: 0.2
    });
    
    this.qualityFeatures.set('smooth-animations', {
      id: 'smooth-animations',
      name: 'Smooth Animations',
      description: 'High-framerate smooth animations',
      category: 'animation',
      impact: { cpu: 0.2, memory: 0.1, gpu: 0.2, battery: 0.3 },
      dependencies: [],
      conflicts: ['reduced-motion'],
      enabled: true,
      quality: 0.3
    });
  }
  
  private integrateSystemCapabilities(systemName: string, capabilities: QualityCapability[]): void {
    for (const capability of capabilities) {
      const featureId = `${systemName}-${capability.name}`;
      
      this.qualityFeatures.set(featureId, {
        id: featureId,
        name: capability.name,
        description: `System capability: ${capability.name}`,
        category: 'performance',
        impact: this.estimateCapabilityImpact(capability.impact),
        dependencies: [],
        conflicts: [],
        enabled: capability.enabled,
        quality: this.estimateCapabilityQuality(capability.impact)
      });
    }
    
    this.updateQualityMetrics();
  }
  
  private estimateCapabilityImpact(impact: 'low' | 'medium' | 'high' | 'critical'): QualityFeature['impact'] {
    const impactMap = {
      low: { cpu: 0.1, memory: 0.1, gpu: 0.1, battery: 0.1 },
      medium: { cpu: 0.3, memory: 0.2, gpu: 0.3, battery: 0.2 },
      high: { cpu: 0.6, memory: 0.4, gpu: 0.6, battery: 0.4 },
      critical: { cpu: 0.9, memory: 0.7, gpu: 0.8, battery: 0.6 }
    };
    
    return impactMap[impact];
  }
  
  private estimateCapabilityQuality(impact: 'low' | 'medium' | 'high' | 'critical'): number {
    const qualityMap = {
      low: 0.1,
      medium: 0.3,
      high: 0.6,
      critical: 0.8
    };
    
    return qualityMap[impact];
  }
  
  private updateQualityMetrics(): void {
    const enabledFeatures = Array.from(this.qualityFeatures.values()).filter(f => f.enabled);
    const totalFeatures = this.qualityFeatures.size;
    
    // Calculate overall quality score
    const qualityScore = enabledFeatures.reduce((sum, feature) => sum + feature.quality, 0) / Math.max(totalFeatures, 1);
    
    // Calculate performance impact
    const performanceImpact = enabledFeatures.reduce((max, feature) => {
      const featureImpact = Math.max(feature.impact.cpu, feature.impact.memory, feature.impact.gpu);
      return Math.max(max, featureImpact);
    }, 0);
    
    // Update metrics
    this.qualityMetrics = {
      overallQuality: qualityScore,
      performanceImpact,
      enabledFeatures: enabledFeatures.length,
      availableFeatures: totalFeatures,
      deviceUtilization: this.calculateDeviceUtilization(enabledFeatures),
      recentAdjustments: this.adjustmentHistory.slice(-10)
    };
  }
  
  private calculateDeviceUtilization(enabledFeatures: QualityFeature[]): { cpu: number; memory: number; gpu: number } {
    return enabledFeatures.reduce(
      (util, feature) => ({
        cpu: util.cpu + feature.impact.cpu,
        memory: util.memory + feature.impact.memory,
        gpu: util.gpu + feature.impact.gpu
      }),
      { cpu: 0, memory: 0, gpu: 0 }
    );
  }
  
  private getPerformanceTier(fps: number, frameTime: number): 'excellent' | 'good' | 'degraded' | 'critical' {
    if (fps >= this.performanceThresholds.excellent.minFPS && frameTime <= this.performanceThresholds.excellent.maxFrameTime) {
      return 'excellent';
    } else if (fps >= this.performanceThresholds.good.minFPS && frameTime <= this.performanceThresholds.good.maxFrameTime) {
      return 'good';
    } else if (fps >= this.performanceThresholds.degraded.minFPS && frameTime <= this.performanceThresholds.degraded.maxFrameTime) {
      return 'degraded';
    } else {
      return 'critical';
    }
  }
  
  private calculateConsciousnessAwareQuality(
    consciousnessIntensity: number,
    musicEnergy: number,
    performanceTier: string
  ): number {
    // Base quality from performance tier
    const baseQuality = {
      excellent: 0.9,
      good: 0.7,
      degraded: 0.5,
      critical: 0.3
    }[performanceTier] || 0.5;
    
    // Modulate based on consciousness state
    const consciousnessModifier = 0.8 + (consciousnessIntensity * 0.4); // 0.8 to 1.2
    const musicModifier = 0.9 + (musicEnergy * 0.2); // 0.9 to 1.1
    
    return Math.min(1.0, baseQuality * consciousnessModifier * musicModifier);
  }
  
  private shouldAdjustQuality(desiredQuality: number): boolean {
    const currentQuality = this.qualityMetrics.overallQuality;
    const qualityDifference = Math.abs(desiredQuality - currentQuality);
    
    return qualityDifference > 0.1; // Only adjust if difference is significant
  }
  
  private applyConsciousnessQualityAdjustment(
    desiredQuality: number,
    consciousnessIntensity: number,
    musicEnergy: number
  ): void {
    const currentQuality = this.qualityMetrics.overallQuality;
    
    if (desiredQuality > currentQuality) {
      // Increase quality
      this.increaseQualityOpportunistically();
    } else if (desiredQuality < currentQuality) {
      // Reduce quality
      const reductionAmount = currentQuality - desiredQuality;
      this.reduceQualityIntelligently(reductionAmount);
    }
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('QualityScalingManager', `Consciousness-aware quality adjustment`, {
        consciousnessIntensity,
        musicEnergy,
        currentQuality,
        desiredQuality
      });
    }
  }
  
  private getQualityReductionCandidates(): any[] {
    // Return features sorted by impact/quality ratio (best reduction candidates first)
    const candidates = Array.from(this.qualityFeatures.entries())
      .filter(([_, feature]) => feature.enabled)
      .map(([id, feature]) => ({
        systemName: id.split('-')[0],
        featureName: feature.name,
        currentValue: 'enabled',
        reducedValue: 'disabled',
        maxReduction: 0.2,
        performanceGain: Math.max(feature.impact.cpu, feature.impact.memory, feature.impact.gpu) * 10,
        qualityLoss: feature.quality,
        ratio: (Math.max(feature.impact.cpu, feature.impact.memory, feature.impact.gpu) * 10) / feature.quality
      }))
      .sort((a, b) => b.ratio - a.ratio); // Sort by best ratio first
    
    return candidates;
  }
  
  private getQualityImprovementCandidates(): any[] {
    // Return features that can be safely enabled
    return Array.from(this.qualityFeatures.entries())
      .filter(([_, feature]) => !feature.enabled)
      .map(([id, feature]) => ({
        systemName: id.split('-')[0],
        featureName: feature.name,
        currentValue: 'disabled',
        improvedValue: 'enabled',
        improvementAmount: 0.1,
        performanceCost: Math.max(feature.impact.cpu, feature.impact.memory, feature.impact.gpu) * 10,
        qualityGain: feature.quality
      }))
      .filter(candidate => candidate.performanceCost < 5); // Only safe improvements
  }
  
  private estimatePerformanceGain(oldLevel: QualityLevel | undefined, newLevel: QualityLevel): number {
    if (!oldLevel) return 0;
    
    // Estimate based on feature differences
    const oldComplexity = this.calculateLevelComplexity(oldLevel);
    const newComplexity = this.calculateLevelComplexity(newLevel);
    
    return (oldComplexity - newComplexity) * 5; // ms saved per frame
  }
  
  private estimateQualityLoss(oldLevel: QualityLevel | undefined, newLevel: QualityLevel): number {
    if (!oldLevel) return 0;
    
    const oldQuality = this.calculateLevelQuality(oldLevel);
    const newQuality = this.calculateLevelQuality(newLevel);
    
    return Math.max(0, oldQuality - newQuality);
  }
  
  private calculateLevelComplexity(level: QualityLevel): number {
    let complexity = 0;
    
    if (level.features.webgl) complexity += 3;
    if (level.features.particles) complexity += 2;
    if (level.features.shaders) complexity += 4;
    if (level.features.blur) complexity += 1;
    if (level.features.shadows) complexity += 1;
    if (level.features.animations) complexity += 1;
    
    return complexity;
  }
  
  private calculateLevelQuality(level: QualityLevel): number {
    let quality = 0;
    
    if (level.features.webgl) quality += 0.3;
    if (level.features.particles) quality += 0.2;
    if (level.features.shaders) quality += 0.4;
    if (level.features.blur) quality += 0.1;
    if (level.features.shadows) quality += 0.1;
    if (level.features.animations) quality += 0.2;
    
    return Math.min(1.0, quality);
  }
  
  /**
   * Coordinate LERP consciousness with quality scaling
   */
  private coordinateLerpConsciousness(
    consciousnessIntensity: number,
    musicEnergy: number,
    performanceTier: string
  ): void {
    if (!this.lerpCoordinator?.initialized) return;
    
    // Create performance context for LERP coordination
    const currentFPS = this.performanceAnalyzer.getMedianFPS() || 0;
    const frameTime = this.performanceAnalyzer.getAverageTime('render') || 16.67;
    
    const performanceContext = {
      currentFPS,
      targetFPS: 60,
      frameTimeMs: frameTime,
      frameBudgetMs: 16.67,
      qualityLevel: this.currentQualityLevel?.level || 'medium',
      qualityScore: this.qualityMetrics.overallQuality,
      deviceTier: this.determineDeviceTierFromCapabilities(),
      thermalState: this.estimateThermalState(currentFPS),
      powerLevel: 'balanced' as const,
      memoryPressure: this.estimateMemoryPressure(),
      cpuUtilization: this.estimateCPUUtilization(frameTime),
      memoryUtilization: this.qualityMetrics.deviceUtilization.memory,
      gpuUtilization: this.qualityMetrics.deviceUtilization.gpu
    };
    
    // Update LERP coordinator with quality-aware performance context
    this.lerpCoordinator.updatePerformanceState(performanceContext);
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('QualityScalingManager', 'Coordinated LERP consciousness', {
        consciousnessIntensity,
        musicEnergy,
        performanceTier,
        qualityLevel: performanceContext.qualityLevel
      });
    }
  }
  
  /**
   * Determine device tier from capabilities
   */
  private determineDeviceTierFromCapabilities(): 'minimal' | 'low' | 'medium' | 'high' | 'ultra' {
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
   * Estimate thermal state based on FPS performance
   */
  private estimateThermalState(currentFPS: number): 'nominal' | 'warm' | 'hot' | 'critical' {
    if (currentFPS < 30) return 'critical';
    if (currentFPS < 45) return 'hot';
    if (currentFPS < 55) return 'warm';
    return 'nominal';
  }
  
  /**
   * Estimate memory pressure based on quality metrics
   */
  private estimateMemoryPressure(): 'low' | 'medium' | 'high' {
    const memoryUtilization = this.qualityMetrics.deviceUtilization.memory;
    if (memoryUtilization > 0.8) return 'high';
    if (memoryUtilization > 0.6) return 'medium';
    return 'low';
  }
  
  /**
   * Estimate CPU utilization based on frame time
   */
  private estimateCPUUtilization(frameTime: number): number {
    // Simple heuristic: frame time over budget indicates higher CPU usage
    const targetFrameTime = 16.67; // 60fps
    return Math.min(1.0, frameTime / targetFrameTime);
  }
  
  private trimAdjustmentHistory(): void {
    const maxHistory = 100;
    if (this.adjustmentHistory.length > maxHistory) {
      this.adjustmentHistory.splice(0, this.adjustmentHistory.length - maxHistory);
    }
  }
}