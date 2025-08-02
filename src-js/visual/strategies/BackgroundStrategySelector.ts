/**
 * BackgroundStrategySelector - Intelligent Strategy Selection for Background Systems
 * 
 * Implements sophisticated strategy selection logic that considers device capabilities,
 * user preferences, music context, and consciousness levels to optimize background
 * processing strategies for the best performance and visual experience.
 * 
 * Philosophy: "The right strategy at the right time - consciousness-aware selection
 * that adapts to the user's device, preferences, and musical journey."
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import { DeviceCapabilityDetector } from '@/core/performance/DeviceCapabilityDetector';
import { SettingsManager } from '@/ui/managers/SettingsManager';
import type { 
  IColorProcessor, 
  ColorContext, 
  StrategySelectionCriteria 
} from '@/types/colorStrategy';

// Import strategy implementations
import { DynamicCatppuccinStrategy } from './DynamicCatppuccinStrategy';
import { LivingGradientStrategy } from './LivingGradientStrategy';
import { WebGLGradientStrategy } from './WebGLGradientStrategy';
import { DepthLayeredStrategy } from './DepthLayeredStrategy';

interface BackgroundStrategySelectionCriteria extends StrategySelectionCriteria {
  backgroundType?: 'dynamic-accent' | 'living-gradient' | 'webgl' | 'depth-layered' | 'auto';
  settingsContext: {
    dynamicAccentEnabled: boolean;
    gradientIntensity: string;
    webglEnabled: boolean;
    visualGuideMode: string;
    depthLayersEnabled: boolean;
    consciousnessLevel: number;
    breathingAnimationEnabled: boolean;
  };
  musicContext?: {
    energy: number;
    tempo: number;
    genre: string;
    valence?: number;
  };
  deviceContext: {
    supportsWebGL: boolean;
    performanceLevel: 'low' | 'medium' | 'high';
    memoryCapacity: number;
    isMobile: boolean;
  };
}

interface StrategyMetrics {
  name: string;
  priority: number;
  estimatedProcessingTime: number;
  memoryImpact: number;
  qualityScore: number;
  compatibilityScore: number;
}

export class BackgroundStrategySelector {
  private deviceDetector: DeviceCapabilityDetector;
  private settingsManager: SettingsManager;
  
  // Strategy instances (lazy-loaded)
  private strategyInstances = new Map<string, IColorProcessor>();
  
  // Strategy metadata for selection decisions
  private strategyMetadata = new Map<string, StrategyMetrics>();
  
  constructor(settingsManager?: SettingsManager) {
    this.settingsManager = settingsManager || new SettingsManager();
    this.deviceDetector = new DeviceCapabilityDetector();
    
    // Initialize strategy metadata
    this.initializeStrategyMetadata();
    
    Y3K?.debug?.log('BackgroundStrategySelector', 'Strategy selector initialized');
  }

  /**
   * Initialize metadata for all available strategies
   */
  private initializeStrategyMetadata(): void {
    this.strategyMetadata.set('dynamic-catppuccin', {
      name: 'dynamic-catppuccin',
      priority: 10, // Highest priority - core accent system
      estimatedProcessingTime: 5,
      memoryImpact: 2,
      qualityScore: 9,
      compatibilityScore: 10 // Always compatible
    });
    
    this.strategyMetadata.set('living-gradient', {
      name: 'living-gradient',
      priority: 8, // High priority - foundation layer
      estimatedProcessingTime: 8,
      memoryImpact: 3,
      qualityScore: 8,
      compatibilityScore: 9 // Compatible with most devices
    });
    
    this.strategyMetadata.set('webgl-gradient', {
      name: 'webgl-gradient',
      priority: 6, // Medium-high priority - performance dependent
      estimatedProcessingTime: 12,
      memoryImpact: 7,
      qualityScore: 10,
      compatibilityScore: 6 // Requires WebGL support
    });
    
    this.strategyMetadata.set('depth-layered', {
      name: 'depth-layered',
      priority: 7, // Medium-high priority - consciousness enhancement
      estimatedProcessingTime: 15,
      memoryImpact: 5,
      qualityScore: 9,
      compatibilityScore: 7 // Requires moderate device capabilities
    });
  }

  /**
   * Select optimal strategies based on comprehensive criteria analysis
   */
  selectStrategies(
    context: ColorContext, 
    criteria: BackgroundStrategySelectionCriteria
  ): IColorProcessor[] {
    const startTime = performance.now();
    const selectedStrategies: IColorProcessor[] = [];
    
    try {
      // Build device context if not provided
      const deviceContext = criteria.deviceContext || this.buildDeviceContext();
      
      // Build settings context if not provided
      const settingsContext = criteria.settingsContext || this.buildSettingsContext();
      
      // Strategy selection logic
      const strategyDecisions = this.analyzeStrategyCompatibility(
        context, 
        { ...criteria, deviceContext, settingsContext }
      );
      
      // Apply strategy selection rules
      for (const decision of strategyDecisions) {
        if (decision.shouldInclude) {
          const strategy = this.getOrCreateStrategy(decision.strategyName);
          if (strategy && strategy.canProcess(context)) {
            selectedStrategies.push(strategy);
          }
        }
      }
      
      // Ensure we have at least one strategy (fallback to living gradient)
      if (selectedStrategies.length === 0) {
        const fallbackStrategy = this.getOrCreateStrategy('living-gradient');
        if (fallbackStrategy?.canProcess(context)) {
          selectedStrategies.push(fallbackStrategy);
        }
      }
      
      const processingTime = performance.now() - startTime;
      
      Y3K?.debug?.log('BackgroundStrategySelector', 'Strategy selection completed', {
        selectedCount: selectedStrategies.length,
        strategies: selectedStrategies.map(s => s.getStrategyName()),
        processingTime,
        deviceLevel: deviceContext.performanceLevel,
        visualGuideMode: settingsContext.visualGuideMode
      });
      
      return selectedStrategies;
      
    } catch (error) {
      Y3K?.debug?.error('BackgroundStrategySelector', 'Strategy selection failed:', error);
      
      // Emergency fallback - return living gradient strategy
      const fallbackStrategy = this.getOrCreateStrategy('living-gradient');
      return fallbackStrategy ? [fallbackStrategy] : [];
    }
  }

  /**
   * Analyze strategy compatibility and selection logic
   */
  private analyzeStrategyCompatibility(
    context: ColorContext,
    criteria: BackgroundStrategySelectionCriteria
  ): Array<{ strategyName: string; shouldInclude: boolean; reason: string; score: number }> {
    const decisions: Array<{ strategyName: string; shouldInclude: boolean; reason: string; score: number }> = [];
    
    // Dynamic Catppuccin Strategy Analysis
    const dynamicScore = this.scoreDynamicCatppuccinStrategy(criteria);
    decisions.push({
      strategyName: 'dynamic-catppuccin',
      shouldInclude: criteria.settingsContext.dynamicAccentEnabled && dynamicScore > 0.5,
      reason: criteria.settingsContext.dynamicAccentEnabled 
        ? `Dynamic accent enabled (score: ${dynamicScore.toFixed(2)})` 
        : 'Dynamic accent disabled in settings',
      score: dynamicScore
    });
    
    // Living Gradient Strategy Analysis
    const livingScore = this.scoreLivingGradientStrategy(criteria);
    decisions.push({
      strategyName: 'living-gradient',
      shouldInclude: livingScore > 0.3, // Almost always include as foundation
      reason: `Living gradient foundation (score: ${livingScore.toFixed(2)})`,
      score: livingScore
    });
    
    // WebGL Gradient Strategy Analysis
    const webglScore = this.scoreWebGLGradientStrategy(criteria);
    decisions.push({
      strategyName: 'webgl-gradient',
      shouldInclude: criteria.settingsContext.webglEnabled && 
                    criteria.deviceContext.supportsWebGL && 
                    criteria.deviceContext.performanceLevel !== 'low' &&
                    webglScore > 0.6,
      reason: `WebGL capabilities (score: ${webglScore.toFixed(2)}, device: ${criteria.deviceContext.performanceLevel})`,
      score: webglScore
    });
    
    // Depth Layered Strategy Analysis
    const depthScore = this.scoreDepthLayeredStrategy(criteria);
    decisions.push({
      strategyName: 'depth-layered',
      shouldInclude: criteria.settingsContext.depthLayersEnabled && 
                    criteria.settingsContext.consciousnessLevel > 0.4 &&
                    criteria.deviceContext.performanceLevel !== 'low' &&
                    depthScore > 0.5,
      reason: `Depth consciousness (score: ${depthScore.toFixed(2)}, consciousness: ${criteria.settingsContext.consciousnessLevel})`,
      score: depthScore
    });
    
    return decisions;
  }

  /**
   * Score Dynamic Catppuccin Strategy compatibility
   */
  private scoreDynamicCatppuccinStrategy(criteria: BackgroundStrategySelectionCriteria): number {
    let score = 0.8; // Base score
    
    // Settings boost
    if (criteria.settingsContext.dynamicAccentEnabled) score += 0.2;
    
    // Music responsiveness boost
    if (criteria.musicContext?.energy && criteria.musicContext.energy > 0.7) {
      score += 0.1;
    }
    
    // Visual guide mode compatibility
    const visualModes = ['cosmic', 'cinematic', 'ethereal', 'natural'];
    if (visualModes.includes(criteria.settingsContext.visualGuideMode)) {
      score += 0.1;
    }
    
    // Device compatibility (always good)
    score += 0.1;
    
    return Math.min(1.0, score);
  }

  /**
   * Score Living Gradient Strategy compatibility
   */
  private scoreLivingGradientStrategy(criteria: BackgroundStrategySelectionCriteria): number {
    let score = 0.9; // High base score - foundation layer
    
    // Breathing animation boost
    if (criteria.settingsContext.breathingAnimationEnabled) score += 0.1;
    
    // Consciousness level boost
    score += criteria.settingsContext.consciousnessLevel * 0.2;
    
    // Music context boost
    if (criteria.musicContext?.valence !== undefined) {
      score += 0.05; // Slight boost for music awareness
    }
    
    // Device compatibility
    if (criteria.deviceContext.performanceLevel === 'high') score += 0.05;
    
    return Math.min(1.0, score);
  }

  /**
   * Score WebGL Gradient Strategy compatibility
   */
  private scoreWebGLGradientStrategy(criteria: BackgroundStrategySelectionCriteria): number {
    let score = 0.0;
    
    // WebGL support required
    if (!criteria.deviceContext.supportsWebGL) return 0.0;
    if (!criteria.settingsContext.webglEnabled) return 0.0;
    
    score = 0.6; // Base score for WebGL-capable devices
    
    // Performance level boost
    switch (criteria.deviceContext.performanceLevel) {
      case 'high': score += 0.3; break;
      case 'medium': score += 0.2; break;
      case 'low': score = 0.0; return 0.0; // Don't use on low-end devices
    }
    
    // Memory capacity consideration
    if (criteria.deviceContext.memoryCapacity > 4000) score += 0.1; // 4GB+
    if (criteria.deviceContext.memoryCapacity > 8000) score += 0.1; // 8GB+
    
    // High consciousness level boost
    if (criteria.settingsContext.consciousnessLevel > 0.7) score += 0.1;
    
    // High-energy music boost
    if (criteria.musicContext?.energy && criteria.musicContext.energy > 0.8) {
      score += 0.1;
    }
    
    // Mobile penalty
    if (criteria.deviceContext.isMobile) score -= 0.2;
    
    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Score Depth Layered Strategy compatibility
   */
  private scoreDepthLayeredStrategy(criteria: BackgroundStrategySelectionCriteria): number {
    let score = 0.0;
    
    // Depth layers must be enabled
    if (!criteria.settingsContext.depthLayersEnabled) return 0.0;
    
    score = 0.5; // Base score
    
    // Consciousness level is critical
    score += criteria.settingsContext.consciousnessLevel * 0.4;
    
    // Performance level consideration
    switch (criteria.deviceContext.performanceLevel) {
      case 'high': score += 0.2; break;
      case 'medium': score += 0.1; break;
      case 'low': score = 0.0; return 0.0; // Don't use on low-end devices
    }
    
    // Visual guide mode boost
    if (['cosmic', 'cinematic'].includes(criteria.settingsContext.visualGuideMode)) {
      score += 0.2;
    }
    
    // Music tempo consideration (slower music = better depth perception)
    if (criteria.musicContext?.tempo && criteria.musicContext.tempo < 100) {
      score += 0.1;
    }
    
    // Memory capacity
    if (criteria.deviceContext.memoryCapacity > 6000) score += 0.1; // 6GB+
    
    // Mobile penalty
    if (criteria.deviceContext.isMobile) score -= 0.15;
    
    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Build device context from current device capabilities
   */
  private buildDeviceContext(): BackgroundStrategySelectionCriteria['deviceContext'] {
    const memoryMB = (window.navigator as any).deviceMemory ? (window.navigator as any).deviceMemory * 1024 : 4096; // Default 4GB
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return {
      supportsWebGL: (this.deviceDetector as any).hasWebGLSupport ? (this.deviceDetector as any).hasWebGLSupport() : false,
      performanceLevel: this.deviceDetector.recommendPerformanceQuality() as 'low' | 'medium' | 'high',
      memoryCapacity: memoryMB,
      isMobile
    };
  }

  /**
   * Build settings context from settings manager
   */
  private buildSettingsContext(): BackgroundStrategySelectionCriteria['settingsContext'] {
    try {
      return {
        dynamicAccentEnabled: this.settingsManager.get('sn-dynamic-accent-enabled' as any) ?? true,
        gradientIntensity: this.settingsManager.get('sn-gradient-intensity' as any) ?? 'balanced',
        webglEnabled: this.settingsManager.get('sn-webgl-enabled' as any) ?? true,
        visualGuideMode: this.settingsManager.get('sn-visual-guide-mode' as any) ?? 'cosmic',
        depthLayersEnabled: this.settingsManager.get('sn-depth-enabled' as any) ?? true,
        consciousnessLevel: this.settingsManager.get('sn-consciousness-level' as any) ?? 0.8,
        breathingAnimationEnabled: this.settingsManager.get('sn-breathing-enabled' as any) ?? true
      };
    } catch (error) {
      Y3K?.debug?.warn('BackgroundStrategySelector', 'Failed to load settings, using defaults:', error);
      
      // Return safe defaults
      return {
        dynamicAccentEnabled: true,
        gradientIntensity: 'balanced',
        webglEnabled: true,
        visualGuideMode: 'cosmic',
        depthLayersEnabled: true,
        consciousnessLevel: 0.8,
        breathingAnimationEnabled: true
      };
    }
  }

  /**
   * Get or create strategy instance (lazy loading)
   */
  private getOrCreateStrategy(strategyName: string): IColorProcessor | null {
    // Check if we already have this strategy instance
    if (this.strategyInstances.has(strategyName)) {
      return this.strategyInstances.get(strategyName)!;
    }
    
    // Create new strategy instance
    let strategy: IColorProcessor | null = null;
    
    try {
      switch (strategyName) {
        case 'dynamic-catppuccin':
          strategy = new DynamicCatppuccinStrategy(this.settingsManager);
          break;
          
        case 'living-gradient':
          strategy = new LivingGradientStrategy(this.settingsManager);
          break;
          
        case 'webgl-gradient':
          strategy = new WebGLGradientStrategy(this.settingsManager);
          break;
          
        case 'depth-layered':
          strategy = new DepthLayeredStrategy(this.settingsManager);
          break;
          
        default:
          Y3K?.debug?.warn('BackgroundStrategySelector', `Unknown strategy: ${strategyName}`);
          return null;
      }
      
      if (strategy) {
        this.strategyInstances.set(strategyName, strategy);
        Y3K?.debug?.log('BackgroundStrategySelector', `Created strategy instance: ${strategyName}`);
      }
      
    } catch (error) {
      Y3K?.debug?.error('BackgroundStrategySelector', `Failed to create strategy ${strategyName}:`, error);
      return null;
    }
    
    return strategy;
  }

  /**
   * Get estimated total processing time for selected strategies
   */
  getEstimatedProcessingTime(strategies: IColorProcessor[], context: ColorContext): number {
    return strategies.reduce((total, strategy) => {
      return total + strategy.getEstimatedProcessingTime(context);
    }, 0);
  }

  /**
   * Get strategy metadata for debugging
   */
  getStrategyMetadata(strategyName: string): StrategyMetrics | null {
    return this.strategyMetadata.get(strategyName) || null;
  }

  /**
   * Get all available strategy names
   */
  getAvailableStrategyNames(): string[] {
    return Array.from(this.strategyMetadata.keys());
  }

  /**
   * Update strategy selection criteria (for runtime adjustments)
   */
  updateSelectionCriteria(updates: Partial<BackgroundStrategySelectionCriteria>): void {
    // This would be used by the ColorOrchestrator to update selection criteria
    // based on runtime conditions, user preference changes, etc.
    Y3K?.debug?.log('BackgroundStrategySelector', 'Strategy selection criteria updated:', updates);
  }

  /**
   * Cleanup strategy instances
   */
  destroy(): void {
    // Cleanup any strategy instances that support cleanup
    this.strategyInstances.forEach((strategy, name) => {
      if ('destroy' in strategy && typeof strategy.destroy === 'function') {
        try {
          (strategy as any).destroy();
        } catch (error) {
          Y3K?.debug?.warn('BackgroundStrategySelector', `Error destroying strategy ${name}:`, error);
        }
      }
    });
    
    this.strategyInstances.clear();
    this.strategyMetadata.clear();
    
    Y3K?.debug?.log('BackgroundStrategySelector', 'Strategy selector destroyed');
  }
}