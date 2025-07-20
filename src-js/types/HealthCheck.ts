// Health Check Types for Organic Consciousness Systems
export interface HealthCheckResult {
  healthy: boolean;
  issues: string[];
  metrics?: Record<string, any>;
}