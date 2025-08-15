/**
 * Shared types for the smooth ripple system aligned with Year 3000 vision
 */

export type RippleType = 'click' | 'beat' | 'selection';

export type RippleVariant = 'stardust' | 'constellation' | 'wave' | 'nebula' | 'aurora' | 'classic';

export interface RippleConfig {
  x: number;
  y: number;
  type: RippleType;
  variant: RippleVariant;
  size: number;
  duration: number;
  color: string;
  intensity: number;
  timestamp: number;
  // Organic properties
  velocity?: CoordinatePoint;
  acceleration?: CoordinatePoint;
  rotation?: number;
  opacity?: number;
  // Physics properties
  mass?: number;
  friction?: number;
  elasticity?: number;
}

export interface RippleCanvasOptions {
  maxConcurrentRipples: number;
  poolSize: number;
  enableDebug: boolean;
  enablePhysics: boolean;
  enableVariants: boolean;
  performanceBudget: number; // milliseconds per frame
}

export interface CoordinatePoint {
  x: number;
  y: number;
}

export interface RippleTypeConfig {
  baseSize: number;
  baseDuration: number;
  intensityMultiplier: number;
  colorSource: 'accent' | 'beat' | 'selection' | 'harmonic';
  zIndex: number;
  defaultVariant: RippleVariant;
  allowedVariants: RippleVariant[];
}

export interface RippleVariantConfig {
  shapeComplexity: number; // 1-10 scale
  particleCount: number;
  trailLength: number;
  smoothness: number; // 0-1 scale, how smooth vs geometric
  animationStyle: 'smooth' | 'bounce' | 'elastic' | 'wave';
  renderMethod: 'css' | 'svg' | 'canvas';
}

export interface RipplePhysicsConfig {
  gravity: number;
  windForce: CoordinatePoint;
  turbulence: number;
  boundaryBehavior: 'wrap' | 'bounce' | 'absorb' | 'fade';
  enableCollisions: boolean;
}

export interface ConstellationPattern {
  name: string;
  points: CoordinatePoint[];
  connections: Array<[number, number]>; // indices of connected points
  luminosity: number[];
  twinkleRate: number;
}

export interface HarmonicColorData {
  primary: string;
  secondary: string;
  accent: string;
  mode: string;
  intensity: number;
}