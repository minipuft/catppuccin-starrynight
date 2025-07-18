# Unified System Architecture - Examples

## Overview

This document provides comprehensive examples for implementing systems using the unified architecture. Each example demonstrates best practices, common patterns, and performance optimization techniques.

**Architecture Version**: 2.0.0  
**Examples Updated**: July 2025

## Table of Contents

1. [Basic System Implementation](#basic-system-implementation)
2. [Music-Reactive System](#music-reactive-system)
3. [Performance-Optimized System](#performance-optimized-system)
4. [Memory-Efficient System](#memory-efficient-system)
5. [CSS Animation System](#css-animation-system)
6. [Event-Driven System](#event-driven-system)
7. [Complex Multi-System Integration](#complex-multi-system-integration)
8. [Testing Examples](#testing-examples)

## Basic System Implementation

### Simple Visual System

```typescript
import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { HealthCheckResult } from '@/types/systems';

/**
 * Basic visual system that demonstrates core unified architecture patterns
 */
export class BasicVisualSystem extends UnifiedSystemBase {
  private isActive = false;
  private animationValue = 0;
  
  /**
   * Initialize the system
   */
  async initialize(): Promise<void> {
    // Always call parent initialize first
    await super.initialize();
    
    // Register for 60fps animations
    this.registerAnimation(60);
    
    // Subscribe to system events
    this.subscribeToEvent('system:activate', () => {
      this.isActive = true;
    });
    
    this.subscribeToEvent('system:deactivate', () => {
      this.isActive = false;
    });
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Basic visual system initialized`);
    }
  }
  
  /**
   * Animation frame callback
   */
  onAnimate(deltaTime: number): void {
    if (!this.isActive) return;
    
    // Update animation value
    this.animationValue += deltaTime * 0.001; // Increment by time
    
    // Keep value in range [0, 1]
    if (this.animationValue > 1) {
      this.animationValue = 0;
    }
    
    // Update CSS variables
    this.cssVariableManager.queueUpdate(
      '--basic-animation-value',
      this.animationValue.toString(),
      'normal'
    );
  }
  
  /**
   * System health check
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.isInitialized && this.animationValue >= 0 && this.animationValue <= 1;
    
    return {
      ok: isHealthy,
      details: isHealthy 
        ? 'Basic visual system healthy'
        : `System unhealthy: initialized=${this.isInitialized}, value=${this.animationValue}`
    };
  }
  
  /**
   * Handle performance mode changes
   */
  onPerformanceModeChange(mode: "performance" | "quality"): void {
    if (mode === "performance") {
      // Reduce animation frequency in performance mode
      this.registerAnimation(30);
    } else {
      // Full quality mode
      this.registerAnimation(60);
    }
  }
  
  /**
   * Cleanup resources
   */
  destroy(): void {
    this.isActive = false;
    this.animationValue = 0;
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Basic visual system destroyed`);
    }
    
    // Always call parent destroy last
    super.destroy();
  }
}
```

### Integration with Year3000System

```typescript
// In Year3000System.ts
import { BasicVisualSystem } from './BasicVisualSystem';

export class Year3000System {
  public basicVisualSystem: BasicVisualSystem | null = null;
  
  async _initializeBasicVisualSystem(): Promise<void> {
    try {
      this.basicVisualSystem = new BasicVisualSystem(this.YEAR3000_CONFIG);
      await this.basicVisualSystem.initialize();
      
      // Register with unified registry
      this.unifiedSystemIntegration?.getRegistry().register(
        'BasicVisualSystem',
        this.basicVisualSystem,
        [] // No dependencies
      );
      
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log('✅ BasicVisualSystem initialized');
      }
    } catch (error) {
      console.error('❌ BasicVisualSystem initialization failed:', error);
    }
  }
}
```

## Music-Reactive System

### Advanced Music Visualizer

```typescript
import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { HealthCheckResult } from '@/types/systems';

interface MusicState {
  beatIntensity: number;
  energy: number;
  tempo: number;
  genre: string;
  timestamp: number;
}

/**
 * Music-reactive system that responds to audio analysis
 */
export class MusicVisualizerSystem extends UnifiedSystemBase {
  private musicState: MusicState = {
    beatIntensity: 0,
    energy: 0.5,
    tempo: 120,
    genre: 'unknown',
    timestamp: 0
  };
  
  private targetIntensity = 0;
  private targetEnergy = 0.5;
  private smoothedIntensity = 0;
  private smoothedEnergy = 0.5;
  
  // Performance optimization
  private lastUpdateTime = 0;
  private updateInterval = 16; // ~60fps
  
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Subscribe to music events
    this.subscribeToEvent('music:beat', (payload: any) => {
      this.handleBeatEvent(payload);
    });
    
    this.subscribeToEvent('music:energy', (payload: any) => {
      this.handleEnergyEvent(payload);
    });
    
    this.subscribeToEvent('music:tempo', (payload: any) => {
      this.handleTempoEvent(payload);
    });
    
    this.subscribeToEvent('music:genre', (payload: any) => {
      this.handleGenreEvent(payload);
    });
    
    // Register for high-frequency updates
    this.registerAnimation(60);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Music visualizer initialized`);
    }
  }
  
  private handleBeatEvent(payload: any): void {
    this.targetIntensity = Math.min(Math.max(payload.intensity || 0, 0), 1);
    this.musicState.beatIntensity = this.targetIntensity;
    this.musicState.timestamp = payload.timestamp || Date.now();
  }
  
  private handleEnergyEvent(payload: any): void {
    this.targetEnergy = Math.min(Math.max(payload.energy || 0.5, 0), 1);
    this.musicState.energy = this.targetEnergy;
  }
  
  private handleTempoEvent(payload: any): void {
    this.musicState.tempo = Math.min(Math.max(payload.tempo || 120, 60), 200);
  }
  
  private handleGenreEvent(payload: any): void {
    this.musicState.genre = payload.genre || 'unknown';
  }
  
  onAnimate(deltaTime: number): void {
    const now = performance.now();
    
    // Throttle updates for performance
    if (now - this.lastUpdateTime < this.updateInterval) {
      return;
    }
    
    this.lastUpdateTime = now;
    
    // Smooth interpolation for natural feel
    const lerpFactor = Math.min(deltaTime / 100, 0.5); // Adaptive lerp
    
    this.smoothedIntensity = this.lerp(
      this.smoothedIntensity,
      this.targetIntensity,
      lerpFactor
    );
    
    this.smoothedEnergy = this.lerp(
      this.smoothedEnergy,
      this.targetEnergy,
      lerpFactor * 0.5 // Slower energy changes
    );
    
    // Update CSS variables with priority
    this.updateVisualVariables();
    
    // Record performance metrics
    this.recordMusicMetrics();
  }
  
  private updateVisualVariables(): void {
    // Critical: Beat intensity for immediate feedback
    this.cssVariableManager.queueUpdate(
      '--music-beat-intensity',
      this.smoothedIntensity.toString(),
      'critical'
    );
    
    // Normal: Energy level for ambient effects
    this.cssVariableManager.queueUpdate(
      '--music-energy-level',
      this.smoothedEnergy.toString(),
      'normal'
    );
    
    // Background: Tempo-based effects
    const tempoMultiplier = this.musicState.tempo / 120; // Normalize to 120 BPM
    this.cssVariableManager.queueUpdate(
      '--music-tempo-multiplier',
      tempoMultiplier.toString(),
      'background'
    );
    
    // Batch genre-specific updates
    this.cssVariableManager.queueGroupUpdate('music-genre', {
      '--music-genre': this.musicState.genre,
      '--music-genre-rock': this.musicState.genre === 'rock' ? '1' : '0',
      '--music-genre-electronic': this.musicState.genre === 'electronic' ? '1' : '0',
      '--music-genre-classical': this.musicState.genre === 'classical' ? '1' : '0'
    }, 'background');
  }
  
  private recordMusicMetrics(): void {
    this.performanceCoordinator.recordMetric(
      'music-beat-intensity',
      this.smoothedIntensity,
      'music'
    );
    
    this.performanceCoordinator.recordMetric(
      'music-energy-level',
      this.smoothedEnergy,
      'music'
    );
    
    this.performanceCoordinator.recordMetric(
      'music-tempo',
      this.musicState.tempo,
      'music'
    );
  }
  
  onPerformanceModeChange(mode: "performance" | "quality"): void {
    if (mode === "performance") {
      // Reduce update frequency
      this.updateInterval = 33; // ~30fps
      this.registerAnimation(30);
    } else {
      // Full quality
      this.updateInterval = 16; // ~60fps
      this.registerAnimation(60);
    }
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.isInitialized && 
                     this.smoothedIntensity >= 0 && 
                     this.smoothedIntensity <= 1 &&
                     this.smoothedEnergy >= 0 && 
                     this.smoothedEnergy <= 1;
    
    return {
      ok: isHealthy,
      details: isHealthy 
        ? 'Music visualizer healthy'
        : `Music visualizer unhealthy: intensity=${this.smoothedIntensity}, energy=${this.smoothedEnergy}`
    };
  }
  
  destroy(): void {
    this.musicState = {
      beatIntensity: 0,
      energy: 0.5,
      tempo: 120,
      genre: 'unknown',
      timestamp: 0
    };
    
    super.destroy();
  }
  
  // Utility methods
  private lerp(from: number, to: number, alpha: number): number {
    return from + (to - from) * alpha;
  }
  
  // Public API for external access
  public getMusicState(): MusicState {
    return { ...this.musicState };
  }
  
  public getVisualizationData(): {
    intensity: number;
    energy: number;
    tempo: number;
    genre: string;
  } {
    return {
      intensity: this.smoothedIntensity,
      energy: this.smoothedEnergy,
      tempo: this.musicState.tempo,
      genre: this.musicState.genre
    };
  }
}
```

## Performance-Optimized System

### Adaptive Performance System

```typescript
import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { HealthCheckResult } from '@/types/systems';

interface PerformanceLevel {
  detailLevel: number;
  updateFrequency: number;
  effectsEnabled: boolean;
  particleCount: number;
}

/**
 * Performance-optimized system with adaptive quality
 */
export class AdaptivePerformanceSystem extends UnifiedSystemBase {
  private performanceLevels: Record<string, PerformanceLevel> = {
    ultra: { detailLevel: 5, updateFrequency: 60, effectsEnabled: true, particleCount: 1000 },
    high: { detailLevel: 4, updateFrequency: 60, effectsEnabled: true, particleCount: 500 },
    medium: { detailLevel: 3, updateFrequency: 45, effectsEnabled: true, particleCount: 250 },
    low: { detailLevel: 2, updateFrequency: 30, effectsEnabled: false, particleCount: 100 },
    minimal: { detailLevel: 1, updateFrequency: 15, effectsEnabled: false, particleCount: 50 }
  };
  
  private currentLevel: PerformanceLevel = this.performanceLevels.high;
  private frameTimeHistory: number[] = [];
  private lastOptimization = 0;
  private optimizationCooldown = 2000; // 2 seconds
  
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Subscribe to performance events
    this.subscribeToEvent('performance:threshold-exceeded', (payload: any) => {
      this.handlePerformanceThreshold(payload);
    });
    
    this.subscribeToEvent('performance:optimization-requested', (payload: any) => {
      this.handleOptimizationRequest(payload);
    });
    
    // Start with high quality
    this.setPerformanceLevel('high');
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Adaptive performance system initialized`);
    }
  }
  
  private handlePerformanceThreshold(payload: any): void {
    const now = Date.now();
    if (now - this.lastOptimization < this.optimizationCooldown) {
      return; // Too soon to optimize again
    }
    
    switch (payload.severity) {
      case 'warning':
        this.degradePerformance(1);
        break;
      case 'critical':
        this.degradePerformance(2);
        break;
    }
    
    this.lastOptimization = now;
  }
  
  private handleOptimizationRequest(payload: any): void {
    const levelMap = {
      'mild': 1,
      'moderate': 2,
      'aggressive': 3
    };
    
    this.degradePerformance(levelMap[payload.level] || 1);
  }
  
  private degradePerformance(steps: number): void {
    const levels = Object.keys(this.performanceLevels);
    const currentIndex = levels.findIndex(level => 
      this.performanceLevels[level] === this.currentLevel
    );
    
    const newIndex = Math.min(currentIndex + steps, levels.length - 1);
    const newLevelName = levels[newIndex];
    
    this.setPerformanceLevel(newLevelName);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Performance degraded to ${newLevelName}`);
    }
  }
  
  private setPerformanceLevel(levelName: string): void {
    const level = this.performanceLevels[levelName];
    if (!level) return;
    
    this.currentLevel = level;
    this.registerAnimation(level.updateFrequency);
    
    // Update CSS variables for performance level
    this.cssVariableManager.queueGroupUpdate('performance-level', {
      '--performance-detail-level': level.detailLevel.toString(),
      '--performance-effects-enabled': level.effectsEnabled ? '1' : '0',
      '--performance-particle-count': level.particleCount.toString()
    }, 'critical');
  }
  
  onAnimate(deltaTime: number): void {
    const frameStart = performance.now();
    
    // Adaptive rendering based on performance level
    this.renderContent(deltaTime);
    
    // Track frame time
    const frameTime = performance.now() - frameStart;
    this.trackFrameTime(frameTime);
    
    // Auto-optimize if needed
    this.autoOptimize();
  }
  
  private renderContent(deltaTime: number): void {
    // Base rendering
    this.renderBase(deltaTime);
    
    // Conditional rendering based on performance level
    if (this.currentLevel.detailLevel >= 2) {
      this.renderMediumDetail(deltaTime);
    }
    
    if (this.currentLevel.detailLevel >= 3) {
      this.renderHighDetail(deltaTime);
    }
    
    if (this.currentLevel.detailLevel >= 4) {
      this.renderUltraDetail(deltaTime);
    }
    
    if (this.currentLevel.effectsEnabled) {
      this.renderEffects(deltaTime);
    }
  }
  
  private renderBase(deltaTime: number): void {
    // Essential rendering that always happens
    this.cssVariableManager.queueUpdate(
      '--base-animation-time',
      (Date.now() * 0.001).toString(),
      'critical'
    );
  }
  
  private renderMediumDetail(deltaTime: number): void {
    // Medium detail rendering
    this.cssVariableManager.queueUpdate(
      '--medium-detail-offset',
      (Math.sin(Date.now() * 0.002) * 0.5 + 0.5).toString(),
      'normal'
    );
  }
  
  private renderHighDetail(deltaTime: number): void {
    // High detail rendering
    const time = Date.now() * 0.001;
    this.cssVariableManager.queueBatch({
      '--high-detail-wave1': (Math.sin(time) * 0.5 + 0.5).toString(),
      '--high-detail-wave2': (Math.cos(time * 1.5) * 0.5 + 0.5).toString(),
      '--high-detail-wave3': (Math.sin(time * 2) * 0.5 + 0.5).toString()
    }, 'normal');
  }
  
  private renderUltraDetail(deltaTime: number): void {
    // Ultra detail rendering
    const time = Date.now() * 0.001;
    const complexValue = Math.sin(time) * Math.cos(time * 1.5) * Math.sin(time * 2);
    
    this.cssVariableManager.queueUpdate(
      '--ultra-detail-complex',
      (complexValue * 0.5 + 0.5).toString(),
      'background'
    );
  }
  
  private renderEffects(deltaTime: number): void {
    // Special effects rendering
    this.cssVariableManager.queueUpdate(
      '--effects-intensity',
      (Math.random() * 0.2 + 0.8).toString(),
      'background'
    );
  }
  
  private trackFrameTime(frameTime: number): void {
    this.frameTimeHistory.push(frameTime);
    
    // Keep only last 60 frames
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }
    
    // Record performance metric
    this.performanceCoordinator.recordMetric(
      'frame-time',
      frameTime,
      'performance'
    );
  }
  
  private autoOptimize(): void {
    if (this.frameTimeHistory.length < 30) return;
    
    const avgFrameTime = this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length;
    const targetFrameTime = 1000 / this.currentLevel.updateFrequency;
    
    // If frame time is consistently high, degrade performance
    if (avgFrameTime > targetFrameTime * 1.5) {
      this.degradePerformance(1);
    }
    
    // If frame time is consistently low, we could improve performance
    if (avgFrameTime < targetFrameTime * 0.5) {
      this.improvePerformance();
    }
  }
  
  private improvePerformance(): void {
    const now = Date.now();
    if (now - this.lastOptimization < this.optimizationCooldown * 2) {
      return; // Wait longer before improving
    }
    
    const levels = Object.keys(this.performanceLevels);
    const currentIndex = levels.findIndex(level => 
      this.performanceLevels[level] === this.currentLevel
    );
    
    if (currentIndex > 0) {
      const newLevelName = levels[currentIndex - 1];
      this.setPerformanceLevel(newLevelName);
      
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Performance improved to ${newLevelName}`);
      }
    }
    
    this.lastOptimization = now;
  }
  
  onPerformanceModeChange(mode: "performance" | "quality"): void {
    if (mode === "performance") {
      this.setPerformanceLevel('low');
    } else {
      this.setPerformanceLevel('high');
    }
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    const avgFrameTime = this.frameTimeHistory.length > 0 
      ? this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length
      : 0;
    
    const isHealthy = this.isInitialized && avgFrameTime < 50; // Less than 50ms per frame
    
    return {
      ok: isHealthy,
      details: isHealthy 
        ? `Performance system healthy (avg frame time: ${avgFrameTime.toFixed(2)}ms)`
        : `Performance issues detected (avg frame time: ${avgFrameTime.toFixed(2)}ms)`
    };
  }
  
  destroy(): void {
    this.frameTimeHistory = [];
    super.destroy();
  }
  
  // Public API
  public getCurrentPerformanceLevel(): PerformanceLevel {
    return { ...this.currentLevel };
  }
  
  public getFrameTimeStats(): {
    average: number;
    min: number;
    max: number;
    current: number;
  } {
    if (this.frameTimeHistory.length === 0) {
      return { average: 0, min: 0, max: 0, current: 0 };
    }
    
    const avg = this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length;
    const min = Math.min(...this.frameTimeHistory);
    const max = Math.max(...this.frameTimeHistory);
    const current = this.frameTimeHistory[this.frameTimeHistory.length - 1];
    
    return { average: avg, min, max, current };
  }
}
```

## Memory-Efficient System

### Object Pool System

```typescript
import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { HealthCheckResult } from '@/types/systems';

interface PooledObject {
  id: number;
  active: boolean;
  reset(): void;
  update(deltaTime: number): void;
  destroy(): void;
}

class Particle implements PooledObject {
  id: number;
  active: boolean = false;
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  life: number = 1;
  maxLife: number = 1;
  
  constructor(id: number) {
    this.id = id;
  }
  
  reset(): void {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 1;
    this.maxLife = 1;
  }
  
  spawn(x: number, y: number, vx: number, vy: number, life: number): void {
    this.active = true;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
  }
  
  update(deltaTime: number): void {
    if (!this.active) return;
    
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.life -= deltaTime;
    
    if (this.life <= 0) {
      this.active = false;
    }
  }
  
  destroy(): void {
    this.reset();
  }
}

/**
 * Memory-efficient system using object pooling
 */
export class MemoryEfficientParticleSystem extends UnifiedSystemBase {
  private particlePool: Particle[] = [];
  private activeParticles: Particle[] = [];
  private inactiveParticles: Particle[] = [];
  
  private maxParticles: number = 1000;
  private spawnRate: number = 10; // particles per second
  private lastSpawn: number = 0;
  private nextParticleId: number = 0;
  
  // Memory monitoring
  private memoryUsage: number = 0;
  private memoryHistory: number[] = [];
  
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Pre-allocate particle pool
    this.initializeParticlePool();
    
    // Subscribe to memory events
    this.subscribeToEvent('memory:cleanup-requested', () => {
      this.performMemoryCleanup();
    });
    
    this.registerAnimation(60);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Memory-efficient particle system initialized with ${this.maxParticles} particles`);
    }
  }
  
  private initializeParticlePool(): void {
    // Pre-allocate all particles
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = new Particle(this.nextParticleId++);
      this.particlePool.push(particle);
      this.inactiveParticles.push(particle);
    }
    
    this.updateMemoryUsage();
  }
  
  private getParticleFromPool(): Particle | null {
    if (this.inactiveParticles.length === 0) {
      return null; // Pool exhausted
    }
    
    const particle = this.inactiveParticles.pop()!;
    this.activeParticles.push(particle);
    return particle;
  }
  
  private returnParticleToPool(particle: Particle): void {
    particle.reset();
    
    // Remove from active list
    const index = this.activeParticles.indexOf(particle);
    if (index !== -1) {
      this.activeParticles.splice(index, 1);
    }
    
    // Return to inactive list
    this.inactiveParticles.push(particle);
  }
  
  private spawnParticle(): void {
    const particle = this.getParticleFromPool();
    if (!particle) return;
    
    // Spawn at random position with random velocity
    particle.spawn(
      Math.random() * 800,
      Math.random() * 600,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      Math.random() * 2000 + 1000 // 1-3 seconds
    );
  }
  
  onAnimate(deltaTime: number): void {
    const now = performance.now();
    
    // Spawn new particles
    if (now - this.lastSpawn > 1000 / this.spawnRate) {
      this.spawnParticle();
      this.lastSpawn = now;
    }
    
    // Update active particles
    this.updateParticles(deltaTime);
    
    // Update visual representation
    this.updateVisualState();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Record performance metrics
    this.recordSystemMetrics();
  }
  
  private updateParticles(deltaTime: number): void {
    // Update particles in reverse order for safe removal
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const particle = this.activeParticles[i];
      particle.update(deltaTime);
      
      if (!particle.active) {
        this.returnParticleToPool(particle);
      }
    }
  }
  
  private updateVisualState(): void {
    // Update particle count
    this.cssVariableManager.queueUpdate(
      '--particle-count',
      this.activeParticles.length.toString(),
      'normal'
    );
    
    // Update particle positions (batch update for performance)
    if (this.activeParticles.length > 0) {
      const positions = this.activeParticles.map(p => `${p.x},${p.y}`).join('|');
      this.cssVariableManager.queueUpdate(
        '--particle-positions',
        positions,
        'background'
      );
    }
  }
  
  private monitorMemoryUsage(): void {
    // Calculate estimated memory usage
    const particleSize = 64; // Estimated bytes per particle
    const currentUsage = this.particlePool.length * particleSize;
    
    this.memoryUsage = currentUsage;
    this.memoryHistory.push(currentUsage);
    
    // Keep only last 100 measurements
    if (this.memoryHistory.length > 100) {
      this.memoryHistory.shift();
    }
    
    // Record memory metric
    this.performanceCoordinator.recordMetric(
      'particle-memory-usage',
      currentUsage,
      'memory'
    );
  }
  
  private recordSystemMetrics(): void {
    this.performanceCoordinator.recordMetric(
      'active-particles',
      this.activeParticles.length,
      'system'
    );
    
    this.performanceCoordinator.recordMetric(
      'pool-utilization',
      this.activeParticles.length / this.maxParticles,
      'system'
    );
  }
  
  private performMemoryCleanup(): void {
    // Remove excess inactive particles if pool is too large
    const targetPoolSize = Math.floor(this.maxParticles * 0.8);
    
    if (this.inactiveParticles.length > targetPoolSize) {
      const excess = this.inactiveParticles.length - targetPoolSize;
      const removedParticles = this.inactiveParticles.splice(0, excess);
      
      // Remove from main pool
      removedParticles.forEach(particle => {
        const index = this.particlePool.indexOf(particle);
        if (index !== -1) {
          this.particlePool.splice(index, 1);
        }
        particle.destroy();
      });
      
      this.updateMemoryUsage();
      
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Cleaned up ${excess} particles`);
      }
    }
  }
  
  private updateMemoryUsage(): void {
    const particleSize = 64;
    this.memoryUsage = this.particlePool.length * particleSize;
  }
  
  onPerformanceModeChange(mode: "performance" | "quality"): void {
    if (mode === "performance") {
      // Reduce particle count and spawn rate
      this.maxParticles = 500;
      this.spawnRate = 5;
      
      // Clean up excess particles
      this.performMemoryCleanup();
    } else {
      // Restore full particle count
      this.maxParticles = 1000;
      this.spawnRate = 10;
      
      // Expand pool if needed
      this.expandParticlePool();
    }
  }
  
  private expandParticlePool(): void {
    const currentSize = this.particlePool.length;
    const needed = this.maxParticles - currentSize;
    
    if (needed > 0) {
      for (let i = 0; i < needed; i++) {
        const particle = new Particle(this.nextParticleId++);
        this.particlePool.push(particle);
        this.inactiveParticles.push(particle);
      }
      
      this.updateMemoryUsage();
      
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Expanded pool by ${needed} particles`);
      }
    }
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    const poolUtilization = this.activeParticles.length / this.maxParticles;
    const memoryMB = this.memoryUsage / (1024 * 1024);
    
    const isHealthy = this.isInitialized && 
                     poolUtilization < 0.95 && // Pool not exhausted
                     memoryMB < 10; // Less than 10MB
    
    return {
      ok: isHealthy,
      details: isHealthy 
        ? `Particle system healthy (${this.activeParticles.length}/${this.maxParticles} particles, ${memoryMB.toFixed(2)}MB)`
        : `Particle system issues (utilization: ${(poolUtilization * 100).toFixed(1)}%, memory: ${memoryMB.toFixed(2)}MB)`
    };
  }
  
  destroy(): void {
    // Clean up all particles
    this.activeParticles.forEach(particle => particle.destroy());
    this.inactiveParticles.forEach(particle => particle.destroy());
    this.particlePool.forEach(particle => particle.destroy());
    
    this.activeParticles = [];
    this.inactiveParticles = [];
    this.particlePool = [];
    this.memoryHistory = [];
    
    this.memoryUsage = 0;
    
    super.destroy();
  }
  
  // Public API
  public getPoolStats(): {
    totalParticles: number;
    activeParticles: number;
    inactiveParticles: number;
    poolUtilization: number;
    memoryUsage: number;
  } {
    return {
      totalParticles: this.particlePool.length,
      activeParticles: this.activeParticles.length,
      inactiveParticles: this.inactiveParticles.length,
      poolUtilization: this.activeParticles.length / this.maxParticles,
      memoryUsage: this.memoryUsage
    };
  }
  
  public forceSpawn(count: number): void {
    for (let i = 0; i < count; i++) {
      this.spawnParticle();
    }
  }
  
  public clearAllParticles(): void {
    this.activeParticles.forEach(particle => {
      this.returnParticleToPool(particle);
    });
  }
}
```

## CSS Animation System

### Advanced CSS Animation Manager

```typescript
import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { HealthCheckResult } from '@/types/systems';

interface AnimationSequence {
  name: string;
  duration: number;
  steps: AnimationStep[];
  loop: boolean;
  priority: 'critical' | 'normal' | 'background';
}

interface AnimationStep {
  progress: number; // 0-1
  properties: Record<string, string>;
  easing?: string;
}

/**
 * Advanced CSS animation system with sequencing and choreography
 */
export class CSSAnimationChoreoSystem extends UnifiedSystemBase {
  private sequences: Map<string, AnimationSequence> = new Map();
  private activeAnimations: Map<string, {
    sequence: AnimationSequence;
    startTime: number;
    currentStep: number;
    progress: number;
  }> = new Map();
  
  private cssKeyframes: Map<string, string> = new Map();
  private animationTime: number = 0;
  
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Register predefined animation sequences
    this.registerBuiltinSequences();
    
    // Subscribe to animation events
    this.subscribeToEvent('animation:start', (payload: any) => {
      this.startAnimation(payload.name, payload.options);
    });
    
    this.subscribeToEvent('animation:stop', (payload: any) => {
      this.stopAnimation(payload.name);
    });
    
    this.subscribeToEvent('music:beat', (payload: any) => {
      this.handleMusicBeat(payload);
    });
    
    this.registerAnimation(60);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] CSS animation choreography system initialized`);
    }
  }
  
  private registerBuiltinSequences(): void {
    // Pulse animation
    this.registerSequence({
      name: 'pulse',
      duration: 1000,
      loop: true,
      priority: 'normal',
      steps: [
        { progress: 0, properties: { '--pulse-scale': '1', '--pulse-opacity': '1' } },
        { progress: 0.5, properties: { '--pulse-scale': '1.1', '--pulse-opacity': '0.8' }, easing: 'ease-out' },
        { progress: 1, properties: { '--pulse-scale': '1', '--pulse-opacity': '1' }, easing: 'ease-in' }
      ]
    });
    
    // Glow animation
    this.registerSequence({
      name: 'glow',
      duration: 2000,
      loop: true,
      priority: 'background',
      steps: [
        { progress: 0, properties: { '--glow-intensity': '0.3', '--glow-spread': '0px' } },
        { progress: 0.5, properties: { '--glow-intensity': '0.8', '--glow-spread': '10px' }, easing: 'ease-out' },
        { progress: 1, properties: { '--glow-intensity': '0.3', '--glow-spread': '0px' }, easing: 'ease-in' }
      ]
    });
    
    // Beat sync animation
    this.registerSequence({
      name: 'beat-sync',
      duration: 200,
      loop: false,
      priority: 'critical',
      steps: [
        { progress: 0, properties: { '--beat-scale': '1', '--beat-brightness': '1' } },
        { progress: 0.3, properties: { '--beat-scale': '1.05', '--beat-brightness': '1.2' }, easing: 'ease-out' },
        { progress: 1, properties: { '--beat-scale': '1', '--beat-brightness': '1' }, easing: 'ease-in' }
      ]
    });
    
    // Ambient wave animation
    this.registerSequence({
      name: 'ambient-wave',
      duration: 5000,
      loop: true,
      priority: 'background',
      steps: [
        { progress: 0, properties: { '--wave-offset': '0deg', '--wave-amplitude': '0.5' } },
        { progress: 0.25, properties: { '--wave-offset': '90deg', '--wave-amplitude': '0.8' }, easing: 'ease-in-out' },
        { progress: 0.5, properties: { '--wave-offset': '180deg', '--wave-amplitude': '1' }, easing: 'ease-in-out' },
        { progress: 0.75, properties: { '--wave-offset': '270deg', '--wave-amplitude': '0.8' }, easing: 'ease-in-out' },
        { progress: 1, properties: { '--wave-offset': '360deg', '--wave-amplitude': '0.5' }, easing: 'ease-in-out' }
      ]
    });
  }
  
  private handleMusicBeat(payload: any): void {
    // Trigger beat-sync animation on music beats
    if (payload.intensity > 0.5) {
      this.startAnimation('beat-sync', {
        intensity: payload.intensity,
        duration: Math.max(100, 300 - payload.intensity * 100)
      });
    }
  }
  
  public registerSequence(sequence: AnimationSequence): void {
    this.sequences.set(sequence.name, sequence);
    
    // Generate CSS keyframes
    const keyframes = this.generateKeyframes(sequence);
    this.cssKeyframes.set(sequence.name, keyframes);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Registered animation sequence: ${sequence.name}`);
    }
  }
  
  private generateKeyframes(sequence: AnimationSequence): string {
    const keyframeName = `sn-anim-${sequence.name}`;
    let keyframeCSS = `@keyframes ${keyframeName} {\\n`;
    
    sequence.steps.forEach(step => {
      const percentage = (step.progress * 100).toFixed(1);
      keyframeCSS += `  ${percentage}% {\\n`;
      
      Object.entries(step.properties).forEach(([prop, value]) => {
        keyframeCSS += `    ${prop}: ${value};\\n`;
      });
      
      keyframeCSS += `  }\\n`;
    });
    
    keyframeCSS += `}`;
    
    return keyframeCSS;
  }
  
  public startAnimation(name: string, options: any = {}): void {
    const sequence = this.sequences.get(name);
    if (!sequence) {
      console.warn(`[${this.systemName}] Unknown animation sequence: ${name}`);
      return;
    }
    
    const animation = {
      sequence,
      startTime: this.animationTime,
      currentStep: 0,
      progress: 0
    };
    
    this.activeAnimations.set(name, animation);
    
    // Modify sequence based on options
    if (options.duration) {
      sequence.duration = options.duration;
    }
    
    if (options.intensity && options.intensity !== 1) {
      // Scale animation properties by intensity
      this.scaleSequenceByIntensity(sequence, options.intensity);
    }
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Started animation: ${name}`);
    }
  }
  
  private scaleSequenceByIntensity(sequence: AnimationSequence, intensity: number): void {
    sequence.steps.forEach(step => {
      Object.entries(step.properties).forEach(([prop, value]) => {
        if (prop.includes('scale') || prop.includes('intensity') || prop.includes('amplitude')) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            step.properties[prop] = (numValue * intensity).toString();
          }
        }
      });
    });
  }
  
  public stopAnimation(name: string): void {
    this.activeAnimations.delete(name);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Stopped animation: ${name}`);
    }
  }
  
  onAnimate(deltaTime: number): void {
    this.animationTime += deltaTime;
    
    // Update active animations
    this.updateActiveAnimations();
    
    // Apply animation values to CSS variables
    this.applyAnimationValues();
  }
  
  private updateActiveAnimations(): void {
    for (const [name, animation] of this.activeAnimations) {
      const elapsed = this.animationTime - animation.startTime;
      const progress = Math.min(elapsed / animation.sequence.duration, 1);
      
      // Update animation progress
      animation.progress = progress;
      
      // Find current step
      const currentStep = this.findCurrentStep(animation.sequence, progress);
      animation.currentStep = currentStep;
      
      // Check if animation is complete
      if (progress >= 1) {
        if (animation.sequence.loop) {
          // Restart looping animation
          animation.startTime = this.animationTime;
          animation.progress = 0;
          animation.currentStep = 0;
        } else {
          // Remove completed animation
          this.activeAnimations.delete(name);
        }
      }
    }
  }
  
  private findCurrentStep(sequence: AnimationSequence, progress: number): number {
    for (let i = 0; i < sequence.steps.length - 1; i++) {
      if (progress >= sequence.steps[i].progress && progress < sequence.steps[i + 1].progress) {
        return i;
      }
    }
    return sequence.steps.length - 1;
  }
  
  private applyAnimationValues(): void {
    const priorityMap = { critical: 0, normal: 1, background: 2 };
    const animationsByPriority = new Map<number, Map<string, string>>();
    
    // Collect all animation values by priority
    for (const [name, animation] of this.activeAnimations) {
      const priority = priorityMap[animation.sequence.priority];
      if (!animationsByPriority.has(priority)) {
        animationsByPriority.set(priority, new Map());
      }
      
      const values = this.interpolateAnimationValues(animation);
      const priorityValues = animationsByPriority.get(priority)!;
      
      Object.entries(values).forEach(([prop, value]) => {
        priorityValues.set(prop, value);
      });
    }
    
    // Apply values in priority order
    for (const [priority, values] of animationsByPriority) {
      const priorityName = ['critical', 'normal', 'background'][priority] as 'critical' | 'normal' | 'background';
      
      if (values.size > 0) {
        const valueObject = Object.fromEntries(values);
        this.cssVariableManager.queueBatch(valueObject, priorityName);
      }
    }
  }
  
  private interpolateAnimationValues(animation: any): Record<string, string> {
    const { sequence, progress } = animation;
    const currentStepIndex = this.findCurrentStep(sequence, progress);
    
    if (currentStepIndex >= sequence.steps.length - 1) {
      return sequence.steps[sequence.steps.length - 1].properties;
    }
    
    const currentStep = sequence.steps[currentStepIndex];
    const nextStep = sequence.steps[currentStepIndex + 1];
    
    const stepProgress = (progress - currentStep.progress) / (nextStep.progress - currentStep.progress);
    
    const interpolatedValues: Record<string, string> = {};
    
    // Interpolate numeric values
    Object.keys(currentStep.properties).forEach(prop => {
      const currentValue = currentStep.properties[prop];
      const nextValue = nextStep.properties[prop];
      
      const currentNum = parseFloat(currentValue);
      const nextNum = parseFloat(nextValue);
      
      if (!isNaN(currentNum) && !isNaN(nextNum)) {
        const interpolated = this.lerp(currentNum, nextNum, stepProgress);
        interpolatedValues[prop] = interpolated.toString();
      } else {
        // Non-numeric values - use current value
        interpolatedValues[prop] = currentValue;
      }
    });
    
    return interpolatedValues;
  }
  
  private lerp(from: number, to: number, alpha: number): number {
    return from + (to - from) * alpha;
  }
  
  onPerformanceModeChange(mode: "performance" | "quality"): void {
    if (mode === "performance") {
      // Reduce animation frequency and complexity
      this.registerAnimation(30);
      
      // Stop background animations
      for (const [name, animation] of this.activeAnimations) {
        if (animation.sequence.priority === 'background') {
          this.stopAnimation(name);
        }
      }
    } else {
      // Restore full animation quality
      this.registerAnimation(60);
      
      // Restart ambient animations
      this.startAnimation('ambient-wave');
      this.startAnimation('glow');
    }
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    const activeCount = this.activeAnimations.size;
    const registeredCount = this.sequences.size;
    
    const isHealthy = this.isInitialized && activeCount < 20; // Reasonable animation count
    
    return {
      ok: isHealthy,
      details: isHealthy 
        ? `Animation system healthy (${activeCount} active, ${registeredCount} registered)`
        : `Too many active animations (${activeCount})`
    };
  }
  
  destroy(): void {
    this.activeAnimations.clear();
    this.sequences.clear();
    this.cssKeyframes.clear();
    
    super.destroy();
  }
  
  // Public API
  public getActiveAnimations(): string[] {
    return Array.from(this.activeAnimations.keys());
  }
  
  public getRegisteredSequences(): string[] {
    return Array.from(this.sequences.keys());
  }
  
  public getAnimationProgress(name: string): number {
    const animation = this.activeAnimations.get(name);
    return animation ? animation.progress : 0;
  }
  
  public isAnimationActive(name: string): boolean {
    return this.activeAnimations.has(name);
  }
}
```

## Event-Driven System

### Event Orchestration System

```typescript
import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { HealthCheckResult } from '@/types/systems';

interface EventRule {
  id: string;
  eventPattern: string | RegExp;
  condition?: (payload: any) => boolean;
  action: (payload: any) => void;
  priority: number;
  enabled: boolean;
  executionCount: number;
  lastExecution: number;
}

interface EventMetrics {
  totalEvents: number;
  eventsByType: Map<string, number>;
  averageProcessingTime: number;
  errorCount: number;
  lastError?: Error;
}

/**
 * Event-driven system that orchestrates complex event patterns
 */
export class EventOrchestrationSystem extends UnifiedSystemBase {
  private eventRules: Map<string, EventRule> = new Map();
  private eventMetrics: EventMetrics = {
    totalEvents: 0,
    eventsByType: new Map(),
    averageProcessingTime: 0,
    errorCount: 0
  };
  
  private eventQueue: Array<{
    eventName: string;
    payload: any;
    timestamp: number;
    priority: number;
  }> = [];
  
  private processingTimes: number[] = [];
  private maxQueueSize: number = 1000;
  
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Register built-in event rules
    this.registerBuiltinRules();
    
    // Subscribe to all events for orchestration
    this.subscribeToAllEvents();
    
    // Register for processing events
    this.registerAnimation(60);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Event orchestration system initialized`);
    }
  }
  
  private registerBuiltinRules(): void {
    // Music beat synchronization
    this.registerEventRule({
      id: 'music-beat-sync',
      eventPattern: 'music:beat',
      condition: (payload) => payload.intensity > 0.6,
      action: (payload) => {
        this.publishEvent('visual:beat-highlight', {
          intensity: payload.intensity,
          timestamp: Date.now()
        });
      },
      priority: 1,
      enabled: true,
      executionCount: 0,
      lastExecution: 0
    });
    
    // Performance monitoring
    this.registerEventRule({
      id: 'performance-warning',
      eventPattern: /^performance:.*$/,
      condition: (payload) => payload.severity === 'warning',
      action: (payload) => {
        this.publishEvent('system:performance-warning', {
          metric: payload.metric,
          value: payload.value,
          threshold: payload.threshold,
          timestamp: Date.now()
        });
      },
      priority: 2,
      enabled: true,
      executionCount: 0,
      lastExecution: 0
    });
    
    // System health monitoring
    this.registerEventRule({
      id: 'system-health-check',
      eventPattern: 'system:health-check',
      condition: (payload) => !payload.result.ok,
      action: (payload) => {
        this.publishEvent('system:health-issue', {
          systemName: payload.systemName,
          details: payload.result.details,
          timestamp: Date.now()
        });
      },
      priority: 3,
      enabled: true,
      executionCount: 0,
      lastExecution: 0
    });
    
    // Memory management
    this.registerEventRule({
      id: 'memory-cleanup',
      eventPattern: 'memory:threshold-exceeded',
      condition: (payload) => payload.usage > 0.8,
      action: (payload) => {
        this.publishEvent('system:memory-cleanup', {
          currentUsage: payload.usage,
          timestamp: Date.now()
        });
      },
      priority: 4,
      enabled: true,
      executionCount: 0,
      lastExecution: 0
    });
    
    // User interaction cascades
    this.registerEventRule({
      id: 'user-interaction-cascade',
      eventPattern: /^user:.*$/,
      condition: (payload) => payload.type === 'click' || payload.type === 'hover',
      action: (payload) => {
        this.publishEvent('visual:user-feedback', {
          type: payload.type,
          position: payload.position,
          timestamp: Date.now()
        });
      },
      priority: 5,
      enabled: true,
      executionCount: 0,
      lastExecution: 0
    });
  }
  
  private subscribeToAllEvents(): void {
    // Subscribe to a wide range of events
    const eventPatterns = [
      'music:*',
      'performance:*',
      'system:*',
      'user:*',
      'visual:*',
      'animation:*',
      'memory:*'
    ];
    
    eventPatterns.forEach(pattern => {
      this.subscribeToEvent(pattern, (payload: any) => {
        this.handleEvent(pattern, payload);
      });
    });
  }
  
  private handleEvent(eventName: string, payload: any): void {
    const startTime = performance.now();
    
    try {
      // Queue event for processing
      this.queueEvent(eventName, payload);
      
      // Update metrics
      this.updateEventMetrics(eventName, performance.now() - startTime);
      
    } catch (error) {
      this.handleEventError(eventName, error as Error);
    }
  }
  
  private queueEvent(eventName: string, payload: any): void {
    // Check queue size
    if (this.eventQueue.length >= this.maxQueueSize) {
      // Remove oldest event
      this.eventQueue.shift();
    }
    
    // Determine priority based on event type
    const priority = this.getEventPriority(eventName);
    
    this.eventQueue.push({
      eventName,
      payload,
      timestamp: Date.now(),
      priority
    });
    
    // Sort by priority (lower number = higher priority)
    this.eventQueue.sort((a, b) => a.priority - b.priority);
  }
  
  private getEventPriority(eventName: string): number {
    if (eventName.startsWith('user:')) return 1;
    if (eventName.startsWith('performance:')) return 2;
    if (eventName.startsWith('system:')) return 3;
    if (eventName.startsWith('music:')) return 4;
    if (eventName.startsWith('visual:')) return 5;
    return 6;
  }
  
  onAnimate(deltaTime: number): void {
    // Process event queue
    this.processEventQueue();
    
    // Update performance metrics
    this.updatePerformanceMetrics();
    
    // Clean up old data
    this.performMaintenance();
  }
  
  private processEventQueue(): void {
    const maxProcessingTime = 5; // 5ms per frame
    const startTime = performance.now();
    
    while (this.eventQueue.length > 0 && 
           (performance.now() - startTime) < maxProcessingTime) {
      
      const event = this.eventQueue.shift()!;
      this.processEvent(event);
    }
  }
  
  private processEvent(event: any): void {
    const processingStart = performance.now();
    
    try {
      // Find matching rules
      const matchingRules = this.findMatchingRules(event.eventName);
      
      // Execute rules in priority order
      matchingRules.forEach(rule => {
        this.executeRule(rule, event);
      });
      
      // Record processing time
      const processingTime = performance.now() - processingStart;
      this.processingTimes.push(processingTime);
      
      // Keep only last 100 measurements
      if (this.processingTimes.length > 100) {
        this.processingTimes.shift();
      }
      
    } catch (error) {
      this.handleEventError(event.eventName, error as Error);
    }
  }
  
  private findMatchingRules(eventName: string): EventRule[] {
    const matchingRules: EventRule[] = [];
    
    for (const rule of this.eventRules.values()) {
      if (!rule.enabled) continue;
      
      let matches = false;
      
      if (typeof rule.eventPattern === 'string') {
        matches = rule.eventPattern === eventName || 
                 rule.eventPattern.endsWith('*') && 
                 eventName.startsWith(rule.eventPattern.slice(0, -1));
      } else {
        matches = rule.eventPattern.test(eventName);
      }
      
      if (matches) {
        matchingRules.push(rule);
      }
    }
    
    // Sort by priority
    return matchingRules.sort((a, b) => a.priority - b.priority);
  }
  
  private executeRule(rule: EventRule, event: any): void {
    try {
      // Check condition if present
      if (rule.condition && !rule.condition(event.payload)) {
        return;
      }
      
      // Execute action
      rule.action(event.payload);
      
      // Update rule metrics
      rule.executionCount++;
      rule.lastExecution = Date.now();
      
    } catch (error) {
      console.error(`[${this.systemName}] Error executing rule ${rule.id}:`, error);
      this.eventMetrics.errorCount++;
      this.eventMetrics.lastError = error as Error;
    }
  }
  
  private updateEventMetrics(eventName: string, processingTime: number): void {
    this.eventMetrics.totalEvents++;
    
    const eventType = eventName.split(':')[0];
    const currentCount = this.eventMetrics.eventsByType.get(eventType) || 0;
    this.eventMetrics.eventsByType.set(eventType, currentCount + 1);
    
    // Update average processing time
    const totalTime = this.eventMetrics.averageProcessingTime * (this.eventMetrics.totalEvents - 1) + processingTime;
    this.eventMetrics.averageProcessingTime = totalTime / this.eventMetrics.totalEvents;
  }
  
  private updatePerformanceMetrics(): void {
    this.performanceCoordinator.recordMetric(
      'event-queue-size',
      this.eventQueue.length,
      'events'
    );
    
    this.performanceCoordinator.recordMetric(
      'event-processing-time',
      this.eventMetrics.averageProcessingTime,
      'events'
    );
    
    this.performanceCoordinator.recordMetric(
      'event-error-rate',
      this.eventMetrics.errorCount / Math.max(this.eventMetrics.totalEvents, 1),
      'events'
    );
  }
  
  private performMaintenance(): void {
    // Reset metrics periodically
    if (this.eventMetrics.totalEvents > 10000) {
      this.eventMetrics.totalEvents = 0;
      this.eventMetrics.eventsByType.clear();
      this.eventMetrics.averageProcessingTime = 0;
      this.eventMetrics.errorCount = 0;
    }
    
    // Clean up old processing times
    if (this.processingTimes.length > 100) {
      this.processingTimes = this.processingTimes.slice(-100);
    }
  }
  
  private handleEventError(eventName: string, error: Error): void {
    this.eventMetrics.errorCount++;
    this.eventMetrics.lastError = error;
    
    console.error(`[${this.systemName}] Error processing event ${eventName}:`, error);
    
    // Publish error event
    this.publishEvent('system:event-error', {
      eventName,
      error: error.message,
      timestamp: Date.now()
    });
  }
  
  // Public API
  public registerEventRule(rule: EventRule): void {
    this.eventRules.set(rule.id, rule);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Registered event rule: ${rule.id}`);
    }
  }
  
  public unregisterEventRule(ruleId: string): void {
    this.eventRules.delete(ruleId);
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Unregistered event rule: ${ruleId}`);
    }
  }
  
  public enableRule(ruleId: string): void {
    const rule = this.eventRules.get(ruleId);
    if (rule) {
      rule.enabled = true;
    }
  }
  
  public disableRule(ruleId: string): void {
    const rule = this.eventRules.get(ruleId);
    if (rule) {
      rule.enabled = false;
    }
  }
  
  public getEventMetrics(): EventMetrics {
    return {
      ...this.eventMetrics,
      eventsByType: new Map(this.eventMetrics.eventsByType)
    };
  }
  
  public getRuleMetrics(): Map<string, {
    executionCount: number;
    lastExecution: number;
    enabled: boolean;
  }> {
    const metrics = new Map();
    
    for (const [id, rule] of this.eventRules) {
      metrics.set(id, {
        executionCount: rule.executionCount,
        lastExecution: rule.lastExecution,
        enabled: rule.enabled
      });
    }
    
    return metrics;
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    const queueSize = this.eventQueue.length;
    const errorRate = this.eventMetrics.errorCount / Math.max(this.eventMetrics.totalEvents, 1);
    
    const isHealthy = this.isInitialized && 
                     queueSize < 500 && 
                     errorRate < 0.05; // Less than 5% error rate
    
    return {
      ok: isHealthy,
      details: isHealthy 
        ? `Event orchestration healthy (queue: ${queueSize}, error rate: ${(errorRate * 100).toFixed(1)}%)`
        : `Event orchestration issues (queue: ${queueSize}, error rate: ${(errorRate * 100).toFixed(1)}%)`
    };
  }
  
  destroy(): void {
    this.eventRules.clear();
    this.eventQueue = [];
    this.processingTimes = [];
    this.eventMetrics = {
      totalEvents: 0,
      eventsByType: new Map(),
      averageProcessingTime: 0,
      errorCount: 0
    };
    
    super.destroy();
  }
}
```

## Testing Examples

### Comprehensive System Testing

```typescript
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { BasicVisualSystem } from './BasicVisualSystem';
import { YEAR3000_CONFIG } from '@/config/globalConfig';

describe('BasicVisualSystem', () => {
  let system: BasicVisualSystem;
  let mockConfig: any;
  
  beforeEach(() => {
    mockConfig = {
      ...YEAR3000_CONFIG,
      enableDebug: false
    };
    
    system = new BasicVisualSystem(mockConfig);
  });
  
  afterEach(() => {
    if (system.isInitialized) {
      system.destroy();
    }
  });
  
  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await system.initialize();
      
      expect(system.isInitialized).toBe(true);
      expect(system.systemName).toBe('BasicVisualSystem');
    });
    
    it('should register for animations after initialization', async () => {
      const registerSpy = jest.spyOn(system as any, 'registerAnimation');
      
      await system.initialize();
      
      expect(registerSpy).toHaveBeenCalledWith(60);
    });
  });
  
  describe('animation', () => {
    beforeEach(async () => {
      await system.initialize();
    });
    
    it('should not animate when inactive', () => {
      const initialValue = (system as any).animationValue;
      
      system.onAnimate(16.67);
      
      expect((system as any).animationValue).toBe(initialValue);
    });
    
    it('should animate when active', () => {
      // Activate system
      system.publishEvent('system:activate', {});
      
      const initialValue = (system as any).animationValue;
      
      system.onAnimate(16.67);
      
      expect((system as any).animationValue).toBeGreaterThan(initialValue);
    });
    
    it('should wrap animation value at 1', () => {
      system.publishEvent('system:activate', {});
      
      // Set value close to 1
      (system as any).animationValue = 0.99;
      
      system.onAnimate(100); // Large delta time
      
      expect((system as any).animationValue).toBeLessThan(1);
    });
  });
  
  describe('health check', () => {
    it('should report healthy when initialized', async () => {
      await system.initialize();
      
      const health = await system.healthCheck();
      
      expect(health.ok).toBe(true);
      expect(health.details).toContain('healthy');
    });
    
    it('should report unhealthy when not initialized', async () => {
      const health = await system.healthCheck();
      
      expect(health.ok).toBe(false);
      expect(health.details).toContain('unhealthy');
    });
  });
  
  describe('performance mode', () => {
    beforeEach(async () => {
      await system.initialize();
    });
    
    it('should reduce animation frequency in performance mode', () => {
      const registerSpy = jest.spyOn(system as any, 'registerAnimation');
      
      system.onPerformanceModeChange('performance');
      
      expect(registerSpy).toHaveBeenCalledWith(30);
    });
    
    it('should restore full frequency in quality mode', () => {
      const registerSpy = jest.spyOn(system as any, 'registerAnimation');
      
      // First set to performance mode
      system.onPerformanceModeChange('performance');
      registerSpy.mockClear();
      
      // Then back to quality
      system.onPerformanceModeChange('quality');
      
      expect(registerSpy).toHaveBeenCalledWith(60);
    });
  });
  
  describe('event handling', () => {
    beforeEach(async () => {
      await system.initialize();
    });
    
    it('should activate on system:activate event', () => {
      expect((system as any).isActive).toBe(false);
      
      system.publishEvent('system:activate', {});
      
      expect((system as any).isActive).toBe(true);
    });
    
    it('should deactivate on system:deactivate event', () => {
      // First activate
      system.publishEvent('system:activate', {});
      expect((system as any).isActive).toBe(true);
      
      // Then deactivate
      system.publishEvent('system:deactivate', {});
      
      expect((system as any).isActive).toBe(false);
    });
  });
  
  describe('destruction', () => {
    it('should clean up properly', async () => {
      await system.initialize();
      
      system.destroy();
      
      expect(system.isInitialized).toBe(false);
      expect((system as any).isActive).toBe(false);
      expect((system as any).animationValue).toBe(0);
    });
  });
});

// Integration test example
describe('System Integration', () => {
  let musicSystem: MusicVisualizerSystem;
  let animationSystem: CSSAnimationChoreoSystem;
  let eventSystem: EventOrchestrationSystem;
  
  beforeEach(async () => {
    musicSystem = new MusicVisualizerSystem(YEAR3000_CONFIG);
    animationSystem = new CSSAnimationChoreoSystem(YEAR3000_CONFIG);
    eventSystem = new EventOrchestrationSystem(YEAR3000_CONFIG);
    
    await musicSystem.initialize();
    await animationSystem.initialize();
    await eventSystem.initialize();
  });
  
  afterEach(() => {
    musicSystem.destroy();
    animationSystem.destroy();
    eventSystem.destroy();
  });
  
  it('should coordinate music and animation systems', () => {
    // Simulate music beat
    musicSystem.publishEvent('music:beat', {
      intensity: 0.8,
      timestamp: Date.now()
    });
    
    // Process events
    eventSystem.onAnimate(16.67);
    
    // Check that animation was triggered
    expect(animationSystem.isAnimationActive('beat-sync')).toBe(true);
  });
  
  it('should handle performance degradation across systems', () => {
    // Trigger performance warning
    musicSystem.publishEvent('performance:threshold-exceeded', {
      severity: 'warning',
      metric: 'frame-time',
      value: 20,
      threshold: 16.67
    });
    
    // Process events
    eventSystem.onAnimate(16.67);
    
    // Check that systems adapted
    const musicState = musicSystem.getVisualizationData();
    expect(musicState).toBeDefined();
    
    const animationStats = animationSystem.getActiveAnimations();
    expect(animationStats.length).toBeLessThan(5); // Background animations stopped
  });
});

// Performance test example
describe('Performance Tests', () => {
  let system: AdaptivePerformanceSystem;
  
  beforeEach(async () => {
    system = new AdaptivePerformanceSystem(YEAR3000_CONFIG);
    await system.initialize();
  });
  
  afterEach(() => {
    system.destroy();
  });
  
  it('should maintain 60fps under normal load', () => {
    const startTime = performance.now();
    
    // Simulate 1 second of animation
    for (let i = 0; i < 60; i++) {
      system.onAnimate(16.67);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Should complete 60 frames in reasonable time
    expect(totalTime).toBeLessThan(100); // Less than 100ms for 60 frames
  });
  
  it('should degrade performance under high load', () => {
    // Simulate high load
    system.publishEvent('performance:threshold-exceeded', {
      severity: 'critical',
      metric: 'frame-time',
      value: 50,
      threshold: 16.67
    });
    
    const performanceLevel = system.getCurrentPerformanceLevel();
    expect(performanceLevel.updateFrequency).toBeLessThan(60);
  });
});
```

---

**Examples Version**: 2.0.0  
**Last Updated**: July 2025  
**Maintainer**: Catppuccin StarryNight Team