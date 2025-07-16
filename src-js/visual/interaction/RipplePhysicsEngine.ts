/**
 * Ripple Physics Engine - Natural movement simulation for organic ripple effects
 * Provides realistic physics behaviors aligned with Year 3000 System vision
 */

import type { 
  CoordinatePoint, 
  RipplePhysicsConfig, 
  RippleConfig,
  RippleVariant 
} from './types';

export class RipplePhysicsEngine {
  private config: RipplePhysicsConfig;
  private containerBounds: DOMRect | null = null;
  private windNoise: { x: number; y: number; time: number } = { x: 0, y: 0, time: 0 };
  
  // Physics constants
  private static readonly DEFAULT_CONFIG: RipplePhysicsConfig = {
    gravity: 9.8,
    windForce: { x: 0, y: 0 },
    turbulence: 0.1,
    boundaryBehavior: 'fade',
    enableCollisions: false
  };

  // Variant-specific physics properties
  private static readonly VARIANT_PHYSICS: Record<RippleVariant, Partial<RipplePhysicsConfig>> = {
    stardust: {
      gravity: 2.0,
      turbulence: 0.3,
      boundaryBehavior: 'wrap'
    },
    constellation: {
      gravity: 0.5,
      turbulence: 0.05,
      boundaryBehavior: 'bounce'
    },
    wave: {
      gravity: 0,
      turbulence: 0.15,
      boundaryBehavior: 'absorb'
    },
    nebula: {
      gravity: 1.0,
      turbulence: 0.8,
      boundaryBehavior: 'fade'
    },
    aurora: {
      gravity: 0,
      turbulence: 0.2,
      boundaryBehavior: 'wrap'
    },
    classic: {
      gravity: 0,
      turbulence: 0,
      boundaryBehavior: 'fade'
    }
  };

  constructor(config?: Partial<RipplePhysicsConfig>) {
    this.config = { ...RipplePhysicsEngine.DEFAULT_CONFIG, ...config };
    this.initializeWindNoise();
  }

  /**
   * Initialize wind noise for organic movement
   */
  private initializeWindNoise(): void {
    this.windNoise = {
      x: Math.random() * Math.PI * 2,
      y: Math.random() * Math.PI * 2,
      time: Date.now()
    };
  }

  /**
   * Update physics state for a ripple effect
   */
  updateRipplePhysics(
    rippleConfig: RippleConfig,
    currentPosition: CoordinatePoint,
    currentVelocity: CoordinatePoint,
    deltaTime: number
  ): {
    newPosition: CoordinatePoint;
    newVelocity: CoordinatePoint;
    shouldDestroy: boolean;
  } {
    const variantConfig = this.getVariantPhysicsConfig(rippleConfig.variant);
    const forces = this.calculateForces(rippleConfig, currentPosition, currentVelocity);
    
    // Apply forces to velocity
    const newVelocity = {
      x: currentVelocity.x + (forces.x * deltaTime * 0.001),
      y: currentVelocity.y + (forces.y * deltaTime * 0.001)
    };

    // Apply velocity damping
    const damping = this.calculateDamping(rippleConfig.variant);
    newVelocity.x *= damping;
    newVelocity.y *= damping;

    // Update position
    const newPosition = {
      x: currentPosition.x + (newVelocity.x * deltaTime * 0.001),
      y: currentPosition.y + (newVelocity.y * deltaTime * 0.001)
    };

    // Check boundaries and apply boundary behavior
    const boundaryResult = this.handleBoundaries(
      newPosition,
      newVelocity,
      rippleConfig,
      variantConfig.boundaryBehavior || 'fade'
    );

    return {
      newPosition: boundaryResult.position,
      newVelocity: boundaryResult.velocity,
      shouldDestroy: boundaryResult.shouldDestroy
    };
  }

  /**
   * Calculate all forces acting on a ripple
   */
  private calculateForces(
    rippleConfig: RippleConfig,
    position: CoordinatePoint,
    velocity: CoordinatePoint
  ): CoordinatePoint {
    const forces = { x: 0, y: 0 };
    const variantConfig = this.getVariantPhysicsConfig(rippleConfig.variant);

    // Gravity force
    forces.y += variantConfig.gravity || 0;

    // Wind force with noise
    const windForce = this.calculateWindForce(rippleConfig.variant);
    forces.x += windForce.x;
    forces.y += windForce.y;

    // Turbulence (random organic movement)
    const turbulence = this.calculateTurbulence(rippleConfig.variant, position);
    forces.x += turbulence.x;
    forces.y += turbulence.y;

    // Variant-specific forces
    const variantForces = this.calculateVariantSpecificForces(rippleConfig, position, velocity);
    forces.x += variantForces.x;
    forces.y += variantForces.y;

    // Musical forces (if available)
    const musicalForces = this.calculateMusicalForces(rippleConfig, position);
    forces.x += musicalForces.x;
    forces.y += musicalForces.y;

    return forces;
  }

  /**
   * Calculate wind force with organic noise
   */
  private calculateWindForce(variant: RippleVariant): CoordinatePoint {
    const time = (Date.now() - this.windNoise.time) * 0.001;
    
    // Generate organic wind patterns using multiple sine waves
    const windX = 
      Math.sin(this.windNoise.x + time * 0.5) * 2 +
      Math.sin(this.windNoise.x * 1.7 + time * 0.3) * 1 +
      Math.sin(this.windNoise.x * 2.3 + time * 0.8) * 0.5;
      
    const windY = 
      Math.cos(this.windNoise.y + time * 0.4) * 1.5 +
      Math.cos(this.windNoise.y * 1.3 + time * 0.6) * 0.8 +
      Math.cos(this.windNoise.y * 2.1 + time * 0.2) * 0.3;

    // Apply variant-specific wind sensitivity
    const sensitivity = this.getWindSensitivity(variant);
    
    return {
      x: windX * sensitivity + this.config.windForce.x,
      y: windY * sensitivity + this.config.windForce.y
    };
  }

  /**
   * Calculate turbulence for organic movement
   */
  private calculateTurbulence(variant: RippleVariant, position: CoordinatePoint): CoordinatePoint {
    const variantConfig = this.getVariantPhysicsConfig(variant);
    const turbulenceStrength = variantConfig.turbulence || 0;
    
    if (turbulenceStrength === 0) {
      return { x: 0, y: 0 };
    }

    // Use position-based noise for consistent but varied turbulence
    const noiseX = this.perlinNoise(position.x * 0.01, position.y * 0.01, Date.now() * 0.0001);
    const noiseY = this.perlinNoise(position.x * 0.01 + 100, position.y * 0.01 + 100, Date.now() * 0.0001);

    return {
      x: noiseX * turbulenceStrength * 10,
      y: noiseY * turbulenceStrength * 10
    };
  }

  /**
   * Calculate variant-specific forces
   */
  private calculateVariantSpecificForces(
    rippleConfig: RippleConfig,
    position: CoordinatePoint,
    velocity: CoordinatePoint
  ): CoordinatePoint {
    const forces = { x: 0, y: 0 };
    const time = Date.now() - rippleConfig.timestamp;

    switch (rippleConfig.variant) {
      case 'stardust':
        // Gentle upward drift with sparkle motion
        forces.y -= 5;
        forces.x += Math.sin(time * 0.001) * 2;
        break;

      case 'constellation':
        // Stable, minimal movement with slight orbital motion
        const orbitRadius = 2;
        const orbitSpeed = 0.0005;
        forces.x += Math.cos(time * orbitSpeed) * orbitRadius;
        forces.y += Math.sin(time * orbitSpeed) * orbitRadius;
        break;

      case 'wave':
        // Wave-like propagation force
        const waveForce = Math.sin(time * 0.002) * 3;
        forces.x += waveForce;
        forces.y += waveForce * 0.3;
        break;

      case 'nebula':
        // Swirling, cloud-like motion
        const swirl = time * 0.001;
        forces.x += Math.sin(swirl) * 4;
        forces.y += Math.cos(swirl * 1.3) * 3;
        break;

      case 'aurora':
        // Flowing, ribbon-like movement
        const flow = time * 0.0008;
        forces.x += Math.sin(flow * 2) * 6;
        forces.y += Math.sin(flow) * 2;
        break;
    }

    return forces;
  }

  /**
   * Calculate musical forces based on beat/tempo
   */
  private calculateMusicalForces(
    rippleConfig: RippleConfig,
    position: CoordinatePoint
  ): CoordinatePoint {
    // This would integrate with MusicSyncService - placeholder for now
    const forces = { x: 0, y: 0 };
    
    if (rippleConfig.type === 'beat') {
      // Beat ripples get rhythmic forces
      const beatPhase = Date.now() * 0.002; // Approximate 120 BPM
      forces.x += Math.sin(beatPhase) * rippleConfig.intensity * 3;
      forces.y += Math.cos(beatPhase * 1.5) * rippleConfig.intensity * 2;
    }

    return forces;
  }

  /**
   * Calculate damping based on variant
   */
  private calculateDamping(variant: RippleVariant): number {
    const dampingMap: Record<RippleVariant, number> = {
      stardust: 0.98,   // Minimal damping for floating effect
      constellation: 0.95, // Moderate damping for stability
      wave: 0.92,       // Higher damping for natural decay
      nebula: 0.96,     // Low damping for flowing motion
      aurora: 0.94,     // Moderate damping for flowing ribbons
      classic: 0.90     // Higher damping for traditional behavior
    };

    return dampingMap[variant];
  }

  /**
   * Handle boundary collisions and behaviors
   */
  private handleBoundaries(
    position: CoordinatePoint,
    velocity: CoordinatePoint,
    rippleConfig: RippleConfig,
    boundaryBehavior: string
  ): {
    position: CoordinatePoint;
    velocity: CoordinatePoint;
    shouldDestroy: boolean;
  } {
    if (!this.containerBounds) {
      return { position, velocity, shouldDestroy: false };
    }

    const { left, top, right, bottom } = this.containerBounds;
    const size = rippleConfig.size;
    let newPosition = { ...position };
    let newVelocity = { ...velocity };
    let shouldDestroy = false;

    // Check boundaries
    const isOutOfBounds = 
      newPosition.x - size < left ||
      newPosition.x + size > right ||
      newPosition.y - size < top ||
      newPosition.y + size > bottom;

    if (isOutOfBounds) {
      switch (boundaryBehavior) {
        case 'wrap':
          if (newPosition.x - size < left) newPosition.x = right - size;
          if (newPosition.x + size > right) newPosition.x = left + size;
          if (newPosition.y - size < top) newPosition.y = bottom - size;
          if (newPosition.y + size > bottom) newPosition.y = top + size;
          break;

        case 'bounce':
          if (newPosition.x - size < left || newPosition.x + size > right) {
            newVelocity.x *= -0.8; // Energy loss on bounce
          }
          if (newPosition.y - size < top || newPosition.y + size > bottom) {
            newVelocity.y *= -0.8;
          }
          // Clamp position within bounds
          newPosition.x = Math.max(left + size, Math.min(right - size, newPosition.x));
          newPosition.y = Math.max(top + size, Math.min(bottom - size, newPosition.y));
          break;

        case 'absorb':
          // Slow down near boundaries
          const fadeZone = size * 2;
          const distanceToEdge = Math.min(
            newPosition.x - left,
            right - newPosition.x,
            newPosition.y - top,
            bottom - newPosition.y
          );
          
          if (distanceToEdge < fadeZone) {
            const slowFactor = distanceToEdge / fadeZone;
            newVelocity.x *= slowFactor;
            newVelocity.y *= slowFactor;
          }
          
          if (distanceToEdge <= 0) {
            shouldDestroy = true;
          }
          break;

        case 'fade':
        default:
          shouldDestroy = true;
          break;
      }
    }

    return { position: newPosition, velocity: newVelocity, shouldDestroy };
  }

  /**
   * Get wind sensitivity for variant
   */
  private getWindSensitivity(variant: RippleVariant): number {
    const sensitivityMap: Record<RippleVariant, number> = {
      stardust: 1.5,    // High sensitivity for sparkle effect
      constellation: 0.3, // Low sensitivity for stability
      wave: 0.8,        // Moderate sensitivity
      nebula: 1.2,      // High sensitivity for cloud movement
      aurora: 1.0,      // Moderate sensitivity for flowing
      classic: 0.0      // No wind sensitivity
    };

    return sensitivityMap[variant];
  }

  /**
   * Get variant-specific physics configuration
   */
  private getVariantPhysicsConfig(variant: RippleVariant): RipplePhysicsConfig {
    const variantOverrides = RipplePhysicsEngine.VARIANT_PHYSICS[variant] || {};
    return { ...this.config, ...variantOverrides };
  }

  /**
   * Simple Perlin noise implementation for organic movement
   */
  private perlinNoise(x: number, y: number, z: number): number {
    // Simplified noise function - in production, consider using a proper noise library
    const hash = (n: number) => {
      n = Math.sin(n * 12.9898) * 43758.5453;
      return n - Math.floor(n);
    };

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);

    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    // Simplified gradient calculations
    const aaa = hash(xi + hash(yi + hash(zi)));
    const aba = hash(xi + hash(yi + 1 + hash(zi)));
    const aab = hash(xi + hash(yi + hash(zi + 1)));
    const abb = hash(xi + hash(yi + 1 + hash(zi + 1)));
    const baa = hash(xi + 1 + hash(yi + hash(zi)));
    const bba = hash(xi + 1 + hash(yi + 1 + hash(zi)));
    const bab = hash(xi + 1 + hash(yi + hash(zi + 1)));
    const bbb = hash(xi + 1 + hash(yi + 1 + hash(zi + 1)));

    const x1 = lerp(aaa, baa, u);
    const x2 = lerp(aba, bba, u);
    const y1 = lerp(x1, x2, v);

    const x3 = lerp(aab, bab, u);
    const x4 = lerp(abb, bbb, u);
    const y2 = lerp(x3, x4, v);

    return (lerp(y1, y2, w) - 0.5) * 2; // Scale to -1 to 1
  }

  /**
   * Update container bounds for boundary calculations
   */
  updateContainerBounds(bounds: DOMRect): void {
    this.containerBounds = bounds;
  }

  /**
   * Update physics configuration
   */
  updateConfig(config: Partial<RipplePhysicsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Apply musical context to physics
   */
  updateMusicalContext(bpm?: number, intensity?: number, energy?: number): void {
    if (bpm) {
      // Adjust wind force based on tempo
      const tempoModifier = Math.min(2.0, bpm / 120); // Normalize around 120 BPM
      this.config.windForce = {
        x: this.config.windForce.x * tempoModifier,
        y: this.config.windForce.y * tempoModifier
      };
    }

    if (intensity !== undefined) {
      // Adjust turbulence based on intensity
      this.config.turbulence = Math.min(1.0, intensity * 0.5);
    }

    if (energy !== undefined) {
      // Adjust gravity based on energy
      this.config.gravity = energy > 0.7 ? 15 : 5;
    }
  }

  /**
   * Reset physics engine state
   */
  reset(): void {
    this.config = { ...RipplePhysicsEngine.DEFAULT_CONFIG };
    this.initializeWindNoise();
  }
}