/**
 * NotificationManager - Handles notifications using Spicetify.UI.showNotification()
 * Provides enhanced notification system with semantic colors and variants
 */

import type { SemanticColor } from "../../../types/spicetify";
import { SemanticColorManager } from "./SemanticColorManager";

declare const Spicetify: any;

export interface NotificationConfig {
  enableDebug?: boolean;
  defaultTimeout?: number;
  useSemanticColors?: boolean;
  enableVariants?: boolean;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

export interface NotificationOptions {
  type?: NotificationType;
  timeout?: number;
  isHTML?: boolean;
  variant?: 'bass' | 'forte' | 'brio' | 'canon' | 'cello';
  semanticColor?: SemanticColor;
  icon?: string;
  persistent?: boolean;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'bass' | 'forte' | 'brio';
  }>;
}

export class NotificationManager {
  private config: NotificationConfig;
  private semanticColorManager: SemanticColorManager | null = null;
  private notificationQueue: Array<{ message: string; options: NotificationOptions }> = [];
  private initialized: boolean = false;
  private spicetifyAvailable: boolean = false;

  // Type to semantic color mapping
  private static readonly TYPE_COLOR_MAP: Record<NotificationType, SemanticColor> = {
    info: 'textAnnouncement',
    success: 'textPositive',
    warning: 'textWarning',
    error: 'textNegative',
    system: 'textBase'
  };

  // Type to default timeout mapping (in milliseconds)
  private static readonly TYPE_TIMEOUT_MAP: Record<NotificationType, number> = {
    info: 4000,
    success: 3000,
    warning: 5000,
    error: 7000,
    system: 4000
  };

  constructor(config: NotificationConfig = {}) {
    this.config = {
      enableDebug: false,
      defaultTimeout: 4000,
      useSemanticColors: true,
      enableVariants: true,
      ...config
    };

    this.checkSpicetifyAvailability();
  }

  public initialize(semanticColorManager?: SemanticColorManager): void {
    this.semanticColorManager = semanticColorManager || null;
    this.checkSpicetifyAvailability();
    this.initialized = true;

    // Process any queued notifications
    this.processQueue();

    if (this.config.enableDebug) {
      console.log("📢 [NotificationManager] Initialized", {
        spicetifyAvailable: this.spicetifyAvailable,
        semanticColorManager: !!this.semanticColorManager,
        queuedNotifications: this.notificationQueue.length
      });
    }
  }

  public async showNotification(message: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.initialized) {
      if (this.config.enableDebug) {
        console.warn("[NotificationManager] Not initialized, queuing notification");
      }
      this.notificationQueue.push({ message, options });
      return;
    }

    if (!this.spicetifyAvailable) {
      if (this.config.enableDebug) {
        console.warn("[NotificationManager] Spicetify not available, falling back to console");
        console.log(`[StarryNight] ${options.type?.toUpperCase() || 'INFO'}: ${message}`);
      }
      return;
    }

    try {
      const processedOptions = await this.processNotificationOptions(options);
      const enhancedMessage = await this.enhanceMessage(message, processedOptions);

      // Use Spicetify's notification system
      Spicetify.UI.showNotification(enhancedMessage, processedOptions.type === 'error', processedOptions.timeout);

      if (this.config.enableDebug) {
        console.log(`[NotificationManager] Shown: ${message}`, processedOptions);
      }

      // Call onClose callback if provided
      if (processedOptions.onClose) {
        setTimeout(processedOptions.onClose, processedOptions.timeout || this.config.defaultTimeout || 4000);
      }

    } catch (error) {
      if (this.config.enableDebug) {
        console.error("[NotificationManager] Failed to show notification:", error);
      }
      // Fallback to console
      console.log(`[StarryNight] ${options.type?.toUpperCase() || 'INFO'}: ${message}`);
    }
  }

  // Convenience methods for different notification types
  public info(message: string, options: Omit<NotificationOptions, 'type'> = {}): Promise<void> {
    return this.showNotification(message, { ...options, type: 'info' });
  }

  public success(message: string, options: Omit<NotificationOptions, 'type'> = {}): Promise<void> {
    return this.showNotification(message, { ...options, type: 'success' });
  }

  public warning(message: string, options: Omit<NotificationOptions, 'type'> = {}): Promise<void> {
    return this.showNotification(message, { ...options, type: 'warning' });
  }

  public error(message: string, options: Omit<NotificationOptions, 'type'> = {}): Promise<void> {
    return this.showNotification(message, { ...options, type: 'error' });
  }

  public system(message: string, options: Omit<NotificationOptions, 'type'> = {}): Promise<void> {
    return this.showNotification(message, { ...options, type: 'system' });
  }

  // Theme-specific notifications
  public colorHarmonyUpdate(message: string): Promise<void> {
    return this.info(message, {
      icon: '🎨',
      timeout: 2000,
      variant: 'brio'
    });
  }

  public systemInitialized(systemName: string): Promise<void> {
    return this.success(`${systemName} initialized`, {
      icon: '🌟',
      timeout: 2000,
      variant: 'forte'
    });
  }

  public performanceWarning(message: string): Promise<void> {
    return this.warning(message, {
      icon: '⚡',
      timeout: 5000,
      variant: 'brio'
    });
  }

  public settingsChanged(settingName: string, value: any): Promise<void> {
    return this.info(`${settingName}: ${value}`, {
      icon: '⚙️',
      timeout: 2000,
      variant: 'forte'
    });
  }

  private async processNotificationOptions(options: NotificationOptions): Promise<NotificationOptions> {
    const processed: NotificationOptions = {
      type: 'info',
      timeout: this.config.defaultTimeout,
      isHTML: false,
      variant: 'brio',
      persistent: false,
      ...options
    };

    // Set timeout based on type if not specified
    if (!options.timeout && processed.type) {
      processed.timeout = NotificationManager.TYPE_TIMEOUT_MAP[processed.type];
    }

    // Apply semantic color if enabled
    if (this.config.useSemanticColors && this.semanticColorManager && processed.type) {
      processed.semanticColor = NotificationManager.TYPE_COLOR_MAP[processed.type];
    }

    return processed;
  }

  private async enhanceMessage(message: string, options: NotificationOptions): Promise<string> {
    let enhancedMessage = message;

    // Add icon if provided
    if (options.icon) {
      enhancedMessage = `${options.icon} ${enhancedMessage}`;
    }

    // Apply variant styling if enabled and HTML is supported
    if (this.config.enableVariants && options.variant && options.isHTML) {
      enhancedMessage = `<span class="sn-text-${options.variant}">${enhancedMessage}</span>`;
    }

    // Apply semantic color if available
    if (options.semanticColor && this.semanticColorManager && options.isHTML) {
      try {
        const color = await this.semanticColorManager.getSemanticColor(options.semanticColor);
        enhancedMessage = `<span style="color: ${color};">${enhancedMessage}</span>`;
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn("[NotificationManager] Failed to apply semantic color:", error);
        }
      }
    }

    return enhancedMessage;
  }

  private checkSpicetifyAvailability(): void {
    this.spicetifyAvailable = !!(
      typeof Spicetify !== 'undefined' &&
      Spicetify.UI &&
      typeof Spicetify.UI.showNotification === 'function'
    );
  }

  private processQueue(): void {
    if (!this.spicetifyAvailable) return;

    const queue = [...this.notificationQueue];
    this.notificationQueue = [];

    queue.forEach(({ message, options }) => {
      this.showNotification(message, options);
    });
  }

  public isAvailable(): boolean {
    return this.spicetifyAvailable;
  }

  public getQueueLength(): number {
    return this.notificationQueue.length;
  }

  public clearQueue(): void {
    this.notificationQueue = [];
  }

  public destroy(): void {
    this.clearQueue();
    this.semanticColorManager = null;
    this.initialized = false;
  }
}