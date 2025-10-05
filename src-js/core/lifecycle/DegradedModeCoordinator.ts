/**
 * DegradedModeCoordinator - Progressive Enhancement Orchestration
 *
 * Coordinates the transition from degraded mode (visual-only) to full mode
 * when Spicetify APIs become available. Monitors API availability and triggers
 * system upgrades when required dependencies are detected.
 *
 * Degraded mode allows the theme to provide basic visual functionality even
 * when Spicetify's JavaScript APIs haven't loaded yet, ensuring graceful
 * degradation and progressive enhancement.
 *
 * @architecture Progressive enhancement coordination
 * @see ProgressiveAPILoader for API detection utilities
 * @see ThemeLifecycleCoordinator for system lifecycle management
 */

import type { SpicetifyAPIs } from "./ProgressiveAPILoader";
import { getCurrentAPIStatus } from "./ProgressiveAPILoader";

export interface ProgressiveEnhancementConfig {
  /** Maximum upgrade attempts before stopping monitoring */
  maxUpgradeAttempts?: number;
  /** Interval between upgrade checks in milliseconds */
  upgradeCheckInterval?: number;
  /** Enable debug logging */
  enableDebug?: boolean;
  /** Callback when APIs become available */
  onAPIsAvailable?: (apis: SpicetifyAPIs) => Promise<void>;
  /** Callback for periodic status updates */
  onStatusUpdate?: (attemptCount: number, apis: SpicetifyAPIs) => void;
}

export interface UpgradeContext {
  /** Available Spicetify APIs */
  availableAPIs: SpicetifyAPIs;
  /** Whether transitioning from degraded mode */
  fromDegradedMode: boolean;
  /** Timestamp of upgrade initiation */
  upgradeTimestamp: number;
}

/**
 * DegradedModeCoordinator - Manages progressive enhancement
 */
export class DegradedModeCoordinator {
  private upgradeInterval: number | null = null;
  private upgradeAttempts = 0;
  private config: Required<ProgressiveEnhancementConfig>;
  private songChangeHandler: (() => void) | null = null;

  constructor(config: ProgressiveEnhancementConfig = {}) {
    this.config = {
      maxUpgradeAttempts: config.maxUpgradeAttempts ?? 30, // 5 minutes at 10s intervals
      upgradeCheckInterval: config.upgradeCheckInterval ?? 10000, // 10 seconds
      enableDebug: config.enableDebug ?? false,
      onAPIsAvailable: config.onAPIsAvailable ?? (async () => {}),
      onStatusUpdate: config.onStatusUpdate ?? (() => {}),
    };
  }

  /**
   * Start monitoring for API availability and trigger upgrade when ready
   */
  public startMonitoring(): void {
    if (this.config.enableDebug) {
      console.log(
        "🔄 [DegradedModeCoordinator] Starting progressive enhancement monitoring..."
      );
    }

    // Check immediately on start
    this.checkForUpgrade();

    // Set up periodic checking
    this.upgradeInterval = window.setInterval(
      () => this.checkForUpgrade(),
      this.config.upgradeCheckInterval
    );

    // Set up Spicetify event listeners
    this.setupSpicetifyEventListeners();

    // Auto-cleanup after max attempts
    setTimeout(
      () => this.stopMonitoring(),
      this.config.maxUpgradeAttempts * this.config.upgradeCheckInterval
    );
  }

  /**
   * Stop monitoring for API availability
   */
  public stopMonitoring(): void {
    if (this.upgradeInterval !== null) {
      clearInterval(this.upgradeInterval);
      this.upgradeInterval = null;

      if (this.config.enableDebug) {
        console.log(
          `⏰ [DegradedModeCoordinator] Monitoring ended after ${
            this.upgradeAttempts
          } attempts (${
            (this.upgradeAttempts * this.config.upgradeCheckInterval) / 1000
          }s)`
        );
      }
    }

    this.cleanupSpicetifyEventListeners();
  }

  /**
   * Check if APIs are available and trigger upgrade if ready
   */
  private checkForUpgrade(): void {
    this.upgradeAttempts++;

    // Get current API status
    const { available, degradedMode } = getCurrentAPIStatus();

    // Trigger status update callback
    this.config.onStatusUpdate(this.upgradeAttempts, available);

    // Check if required APIs are now available
    const hasRequiredAPIs = available.player && available.platform;

    if (hasRequiredAPIs && !degradedMode) {
      if (this.config.enableDebug) {
        console.log(
          "✅ [DegradedModeCoordinator] Required APIs now available - upgrading to full mode!"
        );
      }

      // Stop monitoring
      this.stopMonitoring();

      // Trigger upgrade
      this.triggerUpgrade(available)
        .then(() => {
          if (this.config.enableDebug) {
            console.log(
              "🌟 [DegradedModeCoordinator] Successfully upgraded to full mode!"
            );
          }

          // Update global debug object
          if ((window as any).Y3K) {
            (window as any).Y3K.mode = "full";
            (window as any).Y3K.availableAPIs = available;
          }
        })
        .catch((error) => {
          console.error(
            "❌ [DegradedModeCoordinator] Failed to upgrade to full mode:",
            error
          );
        });

      return;
    }

    // Stop checking after max attempts
    if (this.upgradeAttempts >= this.config.maxUpgradeAttempts) {
      this.stopMonitoring();
      return;
    }

    // Log progress periodically
    if (this.upgradeAttempts % 5 === 0 && this.config.enableDebug) {
      console.log(
        `🔄 [DegradedModeCoordinator] Still monitoring... (attempt ${this.upgradeAttempts}/${this.config.maxUpgradeAttempts})`
      );
      console.log("🔄 [DegradedModeCoordinator] Current API status:", {
        player: !!available.player,
        platform: !!available.platform,
        menu: !!available.menu,
        react: !!available.react,
        reactDOM: !!available.reactDOM,
      });
    }
  }

  /**
   * Trigger the upgrade to full mode
   */
  private async triggerUpgrade(availableAPIs: SpicetifyAPIs): Promise<void> {
    if (this.config.enableDebug) {
      console.log("🚀 [DegradedModeCoordinator] Beginning upgrade to full mode...");
    }

    // Call the upgrade callback
    await this.config.onAPIsAvailable(availableAPIs);
  }

  /**
   * Set up Spicetify event listeners to detect when platform is ready
   */
  private setupSpicetifyEventListeners(): void {
    this.songChangeHandler = () => {
      if (this.config.enableDebug) {
        console.log(
          "🎵 [DegradedModeCoordinator] Spicetify ready event detected - checking for upgrade..."
        );
      }
      this.checkForUpgrade();
    };

    // Listen for song changes as an indicator of Spicetify being ready
    if ((window as any).Spicetify?.Player) {
      (window as any).Spicetify.Player.addEventListener?.(
        "songchange",
        this.songChangeHandler
      );
    }
  }

  /**
   * Clean up Spicetify event listeners
   */
  private cleanupSpicetifyEventListeners(): void {
    if (this.songChangeHandler && (window as any).Spicetify?.Player) {
      (window as any).Spicetify.Player.removeEventListener?.(
        "songchange",
        this.songChangeHandler
      );
      this.songChangeHandler = null;
    }
  }

  /**
   * Get current monitoring status
   */
  public getMonitoringStatus(): {
    isMonitoring: boolean;
    attempts: number;
    maxAttempts: number;
  } {
    return {
      isMonitoring: this.upgradeInterval !== null,
      attempts: this.upgradeAttempts,
      maxAttempts: this.config.maxUpgradeAttempts,
    };
  }
}

/**
 * Create upgrade context for theme lifecycle coordinator
 */
export function createUpgradeContext(
  availableAPIs: SpicetifyAPIs,
  fromDegradedMode: boolean
): UpgradeContext {
  return {
    availableAPIs,
    fromDegradedMode,
    upgradeTimestamp: Date.now(),
  };
}
