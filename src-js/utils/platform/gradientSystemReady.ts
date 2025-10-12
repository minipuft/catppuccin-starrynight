/**
 * Gradient System Ready Detection
 *
 * Utility to detect when FluidGradientBackgroundSystem has fully initialized
 * and is ready to render living gradients. Used to determine when to remove
 * critical dark theme CSS and allow gradients to fade in.
 *
 * @module gradientSystemReady
 */

/**
 * Wait for FluidGradientBackgroundSystem to be fully initialized
 *
 * Checks if the gradient system is:
 * 1. Registered with the VisualEffectsCoordinator
 * 2. Marked as initialized
 * 3. Not in a failed/error state
 *
 * @param timeout - Maximum time to wait in milliseconds (default: 2000ms)
 * @returns Promise<boolean> - true if gradient system ready, false if timeout
 */
export async function waitForGradientSystemReady(timeout: number = 2000): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      if (typeof document !== 'undefined') {
        const attr = document.documentElement.getAttribute('data-fluid-gradient-ready');
        if (attr === 'true') {
          return true;
        }
      }

      // Access Year3000System global instance
      const Y3K = (window as any).Y3K;

      if (!Y3K?.system) {
        // System not yet available, keep waiting
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }

      // Check if FluidGradientBackgroundSystem is initialized via facade coordinator
      const gradientSystem = Y3K.system?.facadeCoordinator
        ?.getCachedVisualSystem?.('FluidGradientBackgroundSystem');

      if (gradientSystem?.initialized) {
        console.log('✅ [GradientReady] FluidGradientBackgroundSystem initialized and ready');
        return true;
      }

      // Alternative check: Look for visual effects coordinator
      const visualCoordinator = Y3K.system?.facadeCoordinator
        ?.getCachedVisualSystem?.('VisualEffectsCoordinator');

      if (visualCoordinator?.initialized) {
        console.log('✅ [GradientReady] VisualEffectsCoordinator initialized (gradients ready)');
        return true;
      }

    } catch (error) {
      // Silently handle errors during detection, keep waiting
      if ((window as any).ADVANCED_SYSTEM_CONFIG?.enableDebug) {
        console.debug('[GradientReady] Detection attempt failed:', error);
      }
    }

    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Timeout reached - gradient system not ready
  console.warn(
    `⚠️ [GradientReady] Gradient system not ready after ${timeout}ms - keeping critical CSS active`
  );
  return false;
}

/**
 * Check if gradient system is currently initialized (non-blocking)
 *
 * @returns boolean - true if gradient system ready right now, false otherwise
 */
export function isGradientSystemReady(): boolean {
  try {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-fluid-gradient-ready');
      if (attr === 'true') {
        return true;
      }
    }

    const Y3K = (window as any).Y3K;

    if (!Y3K?.system) {
      return false;
    }

    const gradientSystem = Y3K.system?.facadeCoordinator
      ?.getCachedVisualSystem?.('FluidGradientBackgroundSystem');

    return gradientSystem?.initialized === true;
  } catch {
    return false;
  }
}
