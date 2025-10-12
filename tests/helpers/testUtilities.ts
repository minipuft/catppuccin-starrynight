import { IManagedSystem } from "@/core/system/IManagedSystem";

/**
 * Wait for system initialization with timeout
 */
export async function waitForSystemInitialization(
  system: IManagedSystem,
  timeout: number = 5000
): Promise<void> {
  const start = Date.now();

  while (!system.initialized) {
    if (Date.now() - start > timeout) {
      throw new Error(`System initialization timeout after ${timeout}ms`);
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

/**
 * Verify health check returns valid result
 */
export async function assertHealthy(
  system: IManagedSystem,
  expectedStatus?: string
): Promise<void> {
  const health = await system.healthCheck();

  expect(health).toBeDefined();
  expect(health.system).toBeDefined();
  expect(health.healthy).toBe(true);
  expect(health.ok).toBe(true);

  if (expectedStatus) {
    expect(health.status).toBe(expectedStatus);
  }
}

/**
 * Clean up systems after tests
 */
export async function cleanupSystems(...systems: (IManagedSystem | undefined | null)[]): Promise<void> {
  for (const system of systems) {
    if (system && system.destroy) {
      await system.destroy();
    }
  }
}
