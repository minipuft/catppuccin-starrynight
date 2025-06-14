export interface HealthCheckResult {
  ok: boolean;
  details?: string;
  issues?: string[];
}

export interface IManagedSystem {
  initialized: boolean;

  /**
   * Initializes the system, setting up any required resources or listeners.
   */
  initialize(): Promise<void>;

  /**
   * A periodic update tick, primarily for animations.
   * @param deltaTime - The time in milliseconds since the last frame.
   */
  updateAnimation(deltaTime: number): void;

  /**
   * Performs a health check on the system.
   * @returns A promise that resolves with the health check result.
   */
  healthCheck(): Promise<HealthCheckResult>;

  /**
   * Cleans up resources, listeners, and intervals.
   */
  destroy(): void;
}

// Optional mix-in interface for runtime settings updates. Visual systems that
// need to react immediately to StarryNight/Year3000 settings changes can
// implement this. The Year3000System will invoke it whenever the
// `year3000SystemSettingsChanged` event is relayed via its internal handler.
export interface ISettingsResponsiveSystem {
  /**
   * Called by Year3000System each time a user or API mutates a theme setting.
   * @param key   The storage key that changed (e.g. "sn-enable-webgpu")
   * @param value The new value (already validated by SettingsManager)
   */
  applyUpdatedSettings?(key: string, value: any): void;
}
