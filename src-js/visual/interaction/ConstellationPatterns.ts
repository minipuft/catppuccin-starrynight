/**
 * Constellation Patterns - Stardust algorithms and celestial arrangements
 * Creates organic star formations that align with Year 3000 System vision
 */

import type { ConstellationPattern, CoordinatePoint } from './types';

export class ConstellationPatterns {
  private static readonly GOLDEN_RATIO = 1.618033988749;
  private static readonly PHI = (1 + Math.sqrt(5)) / 2;

  // Pre-defined constellation patterns inspired by real celestial objects
  private static readonly PATTERN_TEMPLATES: Record<string, Omit<ConstellationPattern, 'name'>> = {
    // Big Dipper inspired
    ursa: {
      points: [
        { x: 0.2, y: 0.3 }, { x: 0.35, y: 0.25 }, { x: 0.5, y: 0.2 },
        { x: 0.65, y: 0.15 }, { x: 0.75, y: 0.4 }, { x: 0.6, y: 0.55 },
        { x: 0.45, y: 0.6 }
      ],
      connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
      luminosity: [0.8, 0.9, 1.0, 0.85, 0.7, 0.6, 0.75],
      twinkleRate: 0.3
    },

    // Orion inspired
    hunter: {
      points: [
        { x: 0.3, y: 0.15 }, { x: 0.7, y: 0.15 }, // shoulders
        { x: 0.45, y: 0.4 }, { x: 0.5, y: 0.45 }, { x: 0.55, y: 0.4 }, // belt
        { x: 0.35, y: 0.7 }, { x: 0.65, y: 0.7 }, // legs
        { x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 } // arms
      ],
      connections: [
        [0, 7], [7, 2], [2, 3], [3, 4], [4, 1], [1, 8],
        [2, 5], [4, 6]
      ],
      luminosity: [0.9, 0.9, 0.95, 1.0, 0.95, 0.7, 0.7, 0.6, 0.6],
      twinkleRate: 0.2
    },

    // Cassiopeia inspired
    crown: {
      points: [
        { x: 0.15, y: 0.4 }, { x: 0.35, y: 0.2 }, { x: 0.5, y: 0.5 },
        { x: 0.65, y: 0.15 }, { x: 0.85, y: 0.35 }
      ],
      connections: [[0, 1], [1, 2], [2, 3], [3, 4]],
      luminosity: [0.8, 0.9, 0.85, 1.0, 0.75],
      twinkleRate: 0.4
    },

    // Spiral galaxy inspired
    spiral: {
      points: [],
      connections: [],
      luminosity: [],
      twinkleRate: 0.6
    },

    // Globular cluster inspired
    cluster: {
      points: [],
      connections: [],
      luminosity: [],
      twinkleRate: 0.8
    }
  };

  /**
   * Generate a constellation pattern based on type and parameters
   */
  static generatePattern(
    type: string,
    centerX: number,
    centerY: number,
    radius: number,
    musicContext?: {
      intensity?: number;
      bpm?: number;
      harmonicMode?: string;
    }
  ): ConstellationPattern {
    const template = this.PATTERN_TEMPLATES[type];
    
    if (!template) {
      return this.generateRandomPattern(centerX, centerY, radius, musicContext);
    }

    // Special handling for generated patterns
    if (type === 'spiral') {
      return this.generateSpiralPattern(centerX, centerY, radius, musicContext);
    }
    
    if (type === 'cluster') {
      return this.generateClusterPattern(centerX, centerY, radius, musicContext);
    }

    // Transform template to absolute coordinates
    const absolutePoints = template.points.map(point => ({
      x: centerX + (point.x - 0.5) * radius * 2,
      y: centerY + (point.y - 0.5) * radius * 2
    }));

    // Apply musical context modifications
    let modifiedLuminosity = [...template.luminosity];
    let modifiedTwinkleRate = template.twinkleRate;

    if (musicContext) {
      modifiedLuminosity = this.applyMusicalLuminosity(modifiedLuminosity, musicContext);
      modifiedTwinkleRate = this.applyMusicalTwinkle(modifiedTwinkleRate, musicContext);
    }

    return {
      name: type,
      points: absolutePoints,
      connections: template.connections,
      luminosity: modifiedLuminosity,
      twinkleRate: modifiedTwinkleRate
    };
  }

  /**
   * Generate random organic constellation pattern
   */
  private static generateRandomPattern(
    centerX: number,
    centerY: number,
    radius: number,
    musicContext?: { intensity?: number; bpm?: number; harmonicMode?: string }
  ): ConstellationPattern {
    const starCount = 5 + Math.floor(Math.random() * 8); // 5-12 stars
    const points: CoordinatePoint[] = [];
    const connections: Array<[number, number]> = [];
    const luminosity: number[] = [];

    // Generate star positions using organic algorithms
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2;
      const distance = radius * (0.3 + Math.random() * 0.7);
      
      // Add organic variation
      const organicX = Math.sin(angle * 3) * radius * 0.2;
      const organicY = Math.cos(angle * 2) * radius * 0.15;
      
      points.push({
        x: centerX + Math.cos(angle) * distance + organicX,
        y: centerY + Math.sin(angle) * distance + organicY
      });

      luminosity.push(0.5 + Math.random() * 0.5);
    }

    // Generate connections using proximity and aesthetic rules
    connections.push(...this.generateOrganicConnections(points, radius));

    return {
      name: 'organic',
      points,
      connections,
      luminosity,
      twinkleRate: 0.3 + Math.random() * 0.4
    };
  }

  /**
   * Generate spiral galaxy pattern
   */
  private static generateSpiralPattern(
    centerX: number,
    centerY: number,
    radius: number,
    musicContext?: { intensity?: number; bpm?: number; harmonicMode?: string }
  ): ConstellationPattern {
    const points: CoordinatePoint[] = [];
    const connections: Array<[number, number]> = [];
    const luminosity: number[] = [];
    
    const armCount = 2; // Two-armed spiral
    const starsPerArm = 8;
    
    for (let arm = 0; arm < armCount; arm++) {
      const armOffset = (arm / armCount) * Math.PI * 2;
      
      for (let i = 0; i < starsPerArm; i++) {
        const t = i / (starsPerArm - 1);
        const angle = armOffset + t * Math.PI * 4; // Two full rotations
        const distance = t * radius;
        
        // Spiral equation: r = a * θ
        const spiralX = centerX + Math.cos(angle) * distance;
        const spiralY = centerY + Math.sin(angle) * distance;
        
        // Add noise for organic feel
        const noise = this.perlinNoise(spiralX * 0.01, spiralY * 0.01, 0) * 20;
        
        points.push({
          x: spiralX + noise,
          y: spiralY + noise
        });
        
        // Luminosity decreases from center
        luminosity.push(1.0 - t * 0.6);
        
        // Connect adjacent stars in the same arm
        if (i > 0) {
          connections.push([arm * starsPerArm + i - 1, arm * starsPerArm + i]);
        }
      }
    }

    return {
      name: 'spiral',
      points,
      connections,
      luminosity,
      twinkleRate: 0.1
    };
  }

  /**
   * Generate globular cluster pattern
   */
  private static generateClusterPattern(
    centerX: number,
    centerY: number,
    radius: number,
    musicContext?: { intensity?: number; bpm?: number; harmonicMode?: string }
  ): ConstellationPattern {
    const points: CoordinatePoint[] = [];
    const connections: Array<[number, number]> = [];
    const luminosity: number[] = [];
    
    const starCount = 15 + Math.floor(Math.random() * 20); // Dense cluster
    
    for (let i = 0; i < starCount; i++) {
      // Use normal distribution for clustering around center
      const distance = this.normalRandom() * radius * 0.6;
      const angle = Math.random() * Math.PI * 2;
      
      points.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance
      });
      
      // Central stars are brighter
      const distanceFromCenter = distance / radius;
      luminosity.push(Math.max(0.3, 1.0 - distanceFromCenter));
    }

    // Connect nearby stars
    connections.push(...this.generateOrganicConnections(points, radius * 0.3));

    return {
      name: 'cluster',
      points,
      connections,
      luminosity,
      twinkleRate: 0.7
    };
  }

  /**
   * Generate organic connections between stars
   */
  private static generateOrganicConnections(
    points: CoordinatePoint[],
    maxDistance: number
  ): Array<[number, number]> {
    const connections: Array<[number, number]> = [];
    
    for (let i = 0; i < points.length; i++) {
      let connectionsFromThisStar = 0;
      const maxConnectionsPerStar = 3;
      
      for (let j = i + 1; j < points.length; j++) {
        if (connectionsFromThisStar >= maxConnectionsPerStar) break;
        
        const point1 = points[i];
        const point2 = points[j];
        if (!point1 || !point2) continue;
        
        const distance = this.calculateDistance(point1, point2);
        
        if (distance < maxDistance) {
          // Probability decreases with distance
          const probability = 1 - (distance / maxDistance);
          
          if (Math.random() < probability * 0.7) {
            connections.push([i, j]);
            connectionsFromThisStar++;
          }
        }
      }
    }
    
    return connections;
  }

  /**
   * Apply musical context to luminosity
   */
  private static applyMusicalLuminosity(
    baseLuminosity: number[],
    musicContext: { intensity?: number; bpm?: number; harmonicMode?: string }
  ): number[] {
    return baseLuminosity.map(lum => {
      let modified = lum;
      
      if (musicContext.intensity !== undefined) {
        // Higher intensity makes stars brighter
        modified *= (0.7 + musicContext.intensity * 0.6);
      }
      
      if (musicContext.bpm !== undefined) {
        // Fast tempo adds variation
        const tempoFactor = Math.min(1.3, musicContext.bpm / 120);
        modified *= (0.8 + Math.random() * 0.4 * tempoFactor);
      }
      
      return Math.min(1.0, modified);
    });
  }

  /**
   * Apply musical context to twinkle rate
   */
  private static applyMusicalTwinkle(
    baseTwinkleRate: number,
    musicContext: { intensity?: number; bpm?: number; harmonicMode?: string }
  ): number {
    let modified = baseTwinkleRate;
    
    if (musicContext.bpm !== undefined) {
      // Sync twinkle with tempo
      const tempoModifier = musicContext.bpm / 120;
      modified *= tempoModifier;
    }
    
    if (musicContext.intensity !== undefined) {
      // Higher intensity increases twinkle
      modified *= (0.5 + musicContext.intensity);
    }
    
    return Math.min(2.0, modified);
  }

  /**
   * Generate constellation based on harmonic mode
   */
  static generateHarmonicConstellation(
    centerX: number,
    centerY: number,
    radius: number,
    harmonicMode: string,
    musicContext?: { intensity?: number; bpm?: number }
  ): ConstellationPattern {
    const patterns: Record<string, string> = {
      monochromatic: 'cluster',
      complementary: 'ursa',
      triadic: 'hunter',
      analogous: 'spiral',
      tetradic: 'crown'
    };
    
    const patternType = patterns[harmonicMode] || 'organic';
    return this.generatePattern(patternType, centerX, centerY, radius, {
      ...musicContext,
      harmonicMode
    });
  }

  /**
   * Generate fibonacci spiral constellation
   */
  static generateFibonacciSpiral(
    centerX: number,
    centerY: number,
    radius: number,
    starCount: number = 13
  ): ConstellationPattern {
    const points: CoordinatePoint[] = [];
    const connections: Array<[number, number]> = [];
    const luminosity: number[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const angle = i * this.GOLDEN_RATIO * Math.PI * 2;
      const distance = Math.sqrt(i / starCount) * radius;
      
      points.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance
      });
      
      luminosity.push(0.8 + Math.random() * 0.2);
      
      // Connect in fibonacci sequence
      if (i > 0) {
        connections.push([i - 1, i]);
      }
    }
    
    return {
      name: 'fibonacci',
      points,
      connections,
      luminosity,
      twinkleRate: 0.2
    };
  }

  /**
   * Generate constellation with beat synchronization
   */
  static generateBeatSyncConstellation(
    centerX: number,
    centerY: number,
    radius: number,
    beatIntensity: number,
    bpm?: number
  ): ConstellationPattern {
    const basePattern = this.generatePattern('ursa', centerX, centerY, radius);
    
    // Modify based on beat intensity
    const pulseRadius = radius * (1 + beatIntensity * 0.3);
    const modifiedPoints = basePattern.points.map(point => {
      const angle = Math.atan2(point.y - centerY, point.x - centerX);
      const distance = this.calculateDistance(point, { x: centerX, y: centerY });
      const newDistance = distance * (pulseRadius / radius);
      
      return {
        x: centerX + Math.cos(angle) * newDistance,
        y: centerY + Math.sin(angle) * newDistance
      };
    });
    
    return {
      ...basePattern,
      name: 'beat-sync',
      points: modifiedPoints,
      twinkleRate: bpm ? (bpm / 60) : basePattern.twinkleRate
    };
  }

  /**
   * Utility functions
   */
  private static calculateDistance(p1: CoordinatePoint, p2: CoordinatePoint): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  private static normalRandom(): number {
    // Box-Muller transform for normal distribution
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }

  private static perlinNoise(x: number, y: number, z: number): number {
    // Simplified noise function for organic variation
    const hash = (n: number) => {
      n = Math.sin(n * 12.9898) * 43758.5453;
      return n - Math.floor(n);
    };

    return (hash(x * 127.1 + y * 311.7 + z * 74.7) - 0.5) * 2;
  }

  /**
   * Get available constellation types
   */
  static getAvailablePatterns(): string[] {
    return Object.keys(this.PATTERN_TEMPLATES);
  }

  /**
   * Get pattern complexity (for performance budgeting)
   */
  static getPatternComplexity(patternType: string): number {
    const complexityMap: Record<string, number> = {
      crown: 1,
      ursa: 2,
      hunter: 3,
      spiral: 4,
      cluster: 5,
      fibonacci: 3,
      organic: 2
    };
    
    return complexityMap[patternType] || 2;
  }
}