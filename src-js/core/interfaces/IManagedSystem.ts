// IManagedSystem Interface for Organic Consciousness
import type { HealthCheckResult } from '../../types/HealthCheck';

export interface IManagedSystem {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<HealthCheckResult>;
  destroy(): void;
  forceRepaint?(reason?: string): void;
}