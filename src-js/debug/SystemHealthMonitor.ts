// ===================================================================
// 🏥 YEAR 3000 SYSTEM HEALTH MONITOR - Phase 3
// ===================================================================
// Long-term health monitoring and automatic recovery for visual systems

import type { IManagedSystem } from "@/types/systems";
import { elementExists } from "./SpotifyDOMSelectors";
import { YEAR3000_CONFIG } from "@/config/globalConfig";

type CriticalLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type SystemStatus =
  | "REGISTERED"
  | "HEALTHY"
  | "WARNING"
  | "DEGRADED"
  | "FAILING"
  | "CRITICAL"
  | "ERROR"
  | "UNKNOWN";
type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface SystemOptions {
  criticalLevel?: CriticalLevel;
  requiredSelectors?: string[];
  healthCheckMethod?: string;
  recoveryMethod?: string;
}

interface SystemData {
  name: string;
  instance: IManagedSystem;
  registeredAt: number;
  options: {
    criticalLevel: CriticalLevel;
    requiredSelectors: string[];
    healthCheckMethod: string | null;
    recoveryMethod: string | null;
  };
  lastHealthCheck: number | null;
  consecutiveFailures: number;
  totalFailures: number;
  status: SystemStatus;
}

interface HealthResult {
  systemName: string;
  timestamp: number;
  status: SystemStatus;
  score: number;
  checks: { [key: string]: any };
  issues: string[];
  recommendations: string[];
  error?: string;
}

interface HealthHistoryEntry {
  timestamp: number;
  status: SystemStatus;
  score: number;
  issueCount: number;
  issues: string[];
  recommendations: string[];
}

interface Alert {
  type: string;
  systemName: string;
  severity: AlertSeverity;
  message: string;
  timestamp: number;
  healthResult: HealthResult;
  systemData: SystemData;
}

interface MonitorConfig {
  checkIntervalMs: number;
  healthRetentionHours: number;
  maxRecoveryAttempts: number;
  alertThreshold: number;
}

const statusColors: { [key in SystemStatus]: string } = {
  HEALTHY: "#a6e3a1",
  WARNING: "#f9e2af",
  DEGRADED: "#fab387",
  FAILING: "#f38ba8",
  ERROR: "#f38ba8",
  CRITICAL: "#f38ba8",
  REGISTERED: "#cdd6f4",
  UNKNOWN: "#9399b2",
};

export class SystemHealthMonitor {
  private registeredSystems: Map<string, SystemData> = new Map();
  private healthHistory: Map<string, HealthResult[]> = new Map();
  private alerts: Alert[] = [];
  private monitoringActive: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private recoveryAttempts: Map<string, number> = new Map();

  private config: MonitorConfig;

  private static getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      HEALTHY: "var(--spice-green, #a6e3a1)",
      WARNING: "var(--spice-yellow, #f9e2af)",
      DEGRADED: "var(--spice-peach, #fab387)",
      FAILING: "var(--spice-red, #f38ba8)",
      ERROR: "var(--spice-red, #f38ba8)",
      UNKNOWN: "var(--spice-text, #cdd6f4)",
      CRITICAL: "var(--spice-red, #f38ba8)",
      REGISTERED: "var(--spice-blue, #89b4fa)",
    };
    return statusColors[status] || "var(--spice-text, #cdd6f4)";
  }

  constructor() {
    this.config = {
      checkIntervalMs: 10000,
      healthRetentionHours: 24,
      maxRecoveryAttempts: 3,
      alertThreshold: 3,
    };
  }

  // === SYSTEM REGISTRATION ===

  public registerSystem(
    systemName: string,
    systemInstance: IManagedSystem,
    options: SystemOptions = {}
  ): SystemData {
    const systemData: SystemData = {
      name: systemName,
      instance: systemInstance,
      registeredAt: Date.now(),
      options: {
        criticalLevel: options.criticalLevel || "MEDIUM",
        requiredSelectors: options.requiredSelectors || [],
        healthCheckMethod: options.healthCheckMethod || null,
        recoveryMethod: options.recoveryMethod || null,
      },
      lastHealthCheck: null,
      consecutiveFailures: 0,
      totalFailures: 0,
      status: "REGISTERED",
    };

    this.registeredSystems.set(systemName, systemData);
    this.healthHistory.set(systemName, []);

    console.log(
      `🏥 [SystemHealthMonitor] Registered ${systemName} (${systemData.options.criticalLevel} priority)`
    );

    if (this.registeredSystems.size === 1 && !this.monitoringActive) {
      this.startMonitoring();
    }

    return systemData;
  }

  public unregisterSystem(systemName: string): void {
    if (this.registeredSystems.has(systemName)) {
      this.registeredSystems.delete(systemName);
      this.healthHistory.delete(systemName);
      this.recoveryAttempts.delete(systemName);

      console.log(`🏥 [SystemHealthMonitor] Unregistered ${systemName}`);

      if (this.registeredSystems.size === 0) {
        this.stopMonitoring();
      }
    }
  }

  // === MONITORING CONTROL ===

  public startMonitoring(): void {
    if (this.monitoringActive) return;

    console.log("🏥 [SystemHealthMonitor] Starting health monitoring...");
    this.monitoringActive = true;

    this.checkInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.checkIntervalMs);

    this.performHealthChecks();
  }

  public stopMonitoring(): void {
    if (!this.monitoringActive) return;

    console.log("🏥 [SystemHealthMonitor] Stopping health monitoring...");
    this.monitoringActive = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // === HEALTH CHECKING ===

  public async performHealthChecks(): Promise<Map<string, HealthResult>> {
    const timestamp = Date.now();
    const results = new Map<string, HealthResult>();

    for (const [systemName, systemData] of this.registeredSystems) {
      try {
        const healthResult = await this.checkSystemHealth(
          systemName,
          systemData
        );
        results.set(systemName, healthResult);

        systemData.lastHealthCheck = timestamp;
        systemData.status = healthResult.status;

        if (
          healthResult.status === "FAILING" ||
          healthResult.status === "ERROR"
        ) {
          systemData.consecutiveFailures++;
          systemData.totalFailures++;
        } else {
          systemData.consecutiveFailures = 0;
        }

        this.updateHealthHistory(systemName, healthResult);
        this.checkForAlerts(systemName, systemData, healthResult);

        if (
          healthResult.status === "FAILING" &&
          systemData.options.recoveryMethod
        ) {
          await this.attemptRecovery(systemName, systemData);
        }
      } catch (error: any) {
        console.error(
          `🏥 [SystemHealthMonitor] Health check failed for ${systemName}:`,
          error
        );

        const errorResult: HealthResult = {
          systemName,
          status: "ERROR",
          timestamp: timestamp,
          error: error.message,
          checks: {},
          issues: [],
          recommendations: [],
          score: 0,
        };

        results.set(systemName, errorResult);
        this.updateHealthHistory(systemName, errorResult);
      }
    }

    this.cleanupHealthHistory();

    return results;
  }

  private async checkSystemHealth(
    systemName: string,
    systemData: SystemData
  ): Promise<HealthResult> {
    const timestamp = Date.now();
    const healthResult: HealthResult = {
      systemName: systemName,
      timestamp: timestamp,
      status: "UNKNOWN",
      score: 0,
      checks: {},
      issues: [],
      recommendations: [],
    };

    const instance = systemData.instance;
    let totalChecks = 0;
    let passedChecks = 0;

    totalChecks++;
    if (instance) {
      healthResult.checks.instanceAvailable = {
        status: "PASS",
        message: "System instance is available",
      };
      passedChecks++;
    } else {
      healthResult.checks.instanceAvailable = {
        status: "FAIL",
        message: "System instance not available",
      };
      healthResult.issues.push("System instance is null or undefined");
    }

    if (instance) {
      totalChecks++;
      if (typeof instance.initialize === "function") {
        if (instance.initialized !== false) {
          healthResult.checks.initialization = {
            status: "PASS",
            message: "System appears to be initialized",
          };
          passedChecks++;
        } else {
          healthResult.checks.initialization = {
            status: "FAIL",
            message: "System not initialized",
          };
          healthResult.issues.push(
            "System initialize() method exists but system not initialized"
          );
        }
      } else {
        healthResult.checks.initialization = {
          status: "SKIP",
          message: "No initialize method found",
        };
      }
    }

    if (instance) {
      const requiredMethods = ["updateAnimation", "destroy"];
      totalChecks++;
      const missingMethods = requiredMethods.filter(
        (method) => typeof (instance as any)[method] !== "function"
      );

      if (missingMethods.length === 0) {
        healthResult.checks.requiredMethods = {
          status: "PASS",
          message: "All required methods present",
        };
        passedChecks++;
      } else {
        healthResult.checks.requiredMethods = {
          status: "FAIL",
          message: `Missing methods: ${missingMethods.join(", ")}`,
        };
        healthResult.issues.push(
          `Missing required methods: ${missingMethods.join(", ")}`
        );
      }
    }

    if (
      systemData.options.requiredSelectors &&
      systemData.options.requiredSelectors.length > 0
    ) {
      totalChecks++;
      const missingSelectors: string[] = [];
      systemData.options.requiredSelectors.forEach((selector: string) => {
        if (!elementExists(selector)) {
          missingSelectors.push(selector);
        }
      });

      if (missingSelectors.length === 0) {
        healthResult.checks.requiredSelectors = {
          status: "PASS",
          message: "All required DOM elements found",
        };
        passedChecks++;
      } else {
        healthResult.checks.requiredSelectors = {
          status: "FAIL",
          message: `Missing DOM elements: ${missingSelectors.length}/${systemData.options.requiredSelectors.length}`,
        };
        healthResult.issues.push(
          `Required DOM elements not found: ${missingSelectors.join(", ")}`
        );
        healthResult.recommendations.push(
          "Check if Spotify UI has changed or selectors need updating"
        );
      }
    }

    // === CUSTOM HEALTH CHECK ===
    try {
      const customCheckResult = await systemData.instance.healthCheck();
      healthResult.checks["customHealthCheck"] = {
        passed: customCheckResult.ok,
        details: customCheckResult.details,
      };
      if (!customCheckResult.ok) {
        healthResult.issues.push(
          `Custom health check failed: ${
            customCheckResult.details || "No details provided"
          }`
        );
      }
    } catch (error: any) {
      healthResult.checks["customHealthCheck"] = {
        passed: false,
        error: error.message,
      };
      healthResult.issues.push(
        `Custom health check threw an error: ${error.message}`
      );
    }

    healthResult.score =
      totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

    if (healthResult.score >= 90) {
      healthResult.status = "HEALTHY";
    } else if (healthResult.score >= 70) {
      healthResult.status = "WARNING";
    } else if (healthResult.score >= 50) {
      healthResult.status = "DEGRADED";
    } else if (healthResult.score > 0) {
      healthResult.status = "FAILING";
    } else {
      healthResult.status = "CRITICAL";
    }

    return healthResult;
  }

  // === HEALTH HISTORY MANAGEMENT ===

  private updateHealthHistory(
    systemName: string,
    healthResult: HealthResult
  ): void {
    const history = this.healthHistory.get(systemName) || [];
    history.push(healthResult);
    const maxEntries = Math.ceil(
      (this.config.healthRetentionHours * 60 * 60 * 1000) /
        this.config.checkIntervalMs
    );
    if (history.length > maxEntries) {
      history.splice(0, history.length - maxEntries);
    }
    this.healthHistory.set(systemName, history);
  }

  private cleanupHealthHistory(): void {
    const cutoffTime =
      Date.now() - this.config.healthRetentionHours * 60 * 60 * 1000;
    this.healthHistory.forEach((history, systemName) => {
      const cleanedHistory = history.filter(
        (entry) => entry.timestamp > cutoffTime
      );
      this.healthHistory.set(systemName, cleanedHistory);
    });
  }

  // === ALERTING ===

  private checkForAlerts(
    systemName: string,
    systemData: SystemData,
    healthResult: HealthResult
  ): void {
    const criticalLevel = systemData.options.criticalLevel;
    const consecutiveFailures = systemData.consecutiveFailures;

    let alertThreshold = this.config.alertThreshold;
    if (criticalLevel === "CRITICAL") alertThreshold = 1;
    else if (criticalLevel === "HIGH") alertThreshold = 2;
    else if (criticalLevel === "LOW") alertThreshold = 5;

    if (consecutiveFailures >= alertThreshold) {
      this.createAlert({
        type: "SYSTEM_HEALTH_DEGRADED",
        systemName: systemName,
        severity: this.mapCriticalLevelToSeverity(criticalLevel),
        message: `${systemName} has failed ${consecutiveFailures} consecutive health checks`,
        timestamp: Date.now(),
        healthResult: healthResult,
        systemData: systemData,
      });
    }

    if (criticalLevel === "CRITICAL" && healthResult.status === "CRITICAL") {
      this.createAlert({
        type: "CRITICAL_SYSTEM_DOWN",
        systemName: systemName,
        severity: "CRITICAL",
        message: `Critical system ${systemName} is completely non-functional`,
        timestamp: Date.now(),
        healthResult: healthResult,
        systemData: systemData,
      });
    }
  }

  private createAlert(alertData: Alert): void {
    const existingAlert = this.alerts.find(
      (alert) =>
        alert.type === alertData.type &&
        alert.systemName === alertData.systemName &&
        alert.timestamp > Date.now() - 5 * 60 * 1000
    );
    if (existingAlert) return;

    this.alerts.push(alertData);

    const severityIcon =
      alertData.severity === "CRITICAL"
        ? "🚨"
        : alertData.severity === "HIGH"
        ? "⚠️"
        : "🔔";
    console.warn(
      `${severityIcon} [SystemHealthMonitor] ALERT: ${alertData.message}`
    );
    if (this.alerts.length > 50) {
      this.alerts.splice(0, this.alerts.length - 50);
    }
  }

  private mapCriticalLevelToSeverity(
    criticalLevel: CriticalLevel
  ): AlertSeverity {
    switch (criticalLevel) {
      case "CRITICAL":
        return "CRITICAL";
      case "HIGH":
        return "HIGH";
      case "MEDIUM":
        return "MEDIUM";
      case "LOW":
        return "LOW";
      default:
        return "MEDIUM";
    }
  }

  // === RECOVERY ===

  private async attemptRecovery(
    systemName: string,
    systemData: SystemData
  ): Promise<boolean> {
    const recoveryMethodName = systemData.options.recoveryMethod;
    if (!recoveryMethodName) {
      return false;
    }

    const attempts = this.recoveryAttempts.get(systemName) || 0;
    if (attempts >= this.config.maxRecoveryAttempts) {
      console.warn(
        `🏥 [SystemHealthMonitor] Max recovery attempts reached for ${systemName}.`
      );
      return false;
    }

    console.log(
      `🏥 [SystemHealthMonitor] Attempting recovery for ${systemName} (Attempt ${
        attempts + 1
      })...`
    );
    this.recoveryAttempts.set(systemName, attempts + 1);

    try {
      const dynamicInstance: any = systemData.instance;
      if (typeof dynamicInstance[recoveryMethodName] === "function") {
        await dynamicInstance[recoveryMethodName]();
        console.log(
          `🏥 [SystemHealthMonitor] Recovery successful for ${systemName}.`
        );
        systemData.consecutiveFailures = 0;
        return true;
      } else {
        console.error(
          `🏥 [SystemHealthMonitor] Recovery failed: Method '${recoveryMethodName}' not found on ${systemName}.`
        );
        return false;
      }
    } catch (error: any) {
      console.error(
        `🏥 [SystemHealthMonitor] Recovery failed for ${systemName}:`,
        error
      );
      return false;
    }
  }

  // === REPORTING ===

  public getHealthReport(): any {
    const report = {
      timestamp: Date.now(),
      monitoringActive: this.monitoringActive,
      totalSystems: this.registeredSystems.size,
      systemsByStatus: {
        HEALTHY: 0,
        WARNING: 0,
        DEGRADED: 0,
        FAILING: 0,
        CRITICAL: 0,
        UNKNOWN: 0,
        REGISTERED: 0,
        ERROR: 0,
      },
      recentAlerts: this.alerts.slice(-10),
      systemDetails: {} as { [key: string]: any },
    };

    this.registeredSystems.forEach((systemData, systemName) => {
      const status = systemData.status || "UNKNOWN";
      report.systemsByStatus[status]++;
      const history = this.healthHistory.get(systemName) || [];
      report.systemDetails[systemName] = {
        status: status,
        consecutiveFailures: systemData.consecutiveFailures,
        totalFailures: systemData.totalFailures,
        lastCheck: systemData.lastHealthCheck,
        criticalLevel: systemData.options.criticalLevel,
        recentHistory: history.slice(-10),
      };
    });
    return report;
  }

  public logHealthReport(): any {
    const report = this.getHealthReport();
    console.groupCollapsed(
      `%c🏥 [SystemHealthMonitor] Health Report - ${new Date().toLocaleTimeString()}`,
      "color: #cdd6f4; font-weight: bold;"
    );

    const summary = this.getHealthSummary();
    console.log(
      `%cOverall Status: ${summary.overallStatus}`,
      `color: ${SystemHealthMonitor.getStatusColor(
        summary.overallStatus
      )}; font-weight: bold;`
    );
    console.log(
      `Summary: ${summary.healthy} Healthy, ${summary.warning} Warning, ${summary.failing} Failing`
    );

    this.registeredSystems.forEach((systemData, systemName) => {
      const latestResult = this.getLatestHealthResult(systemName);
      if (!latestResult) return;

      const statusColor = SystemHealthMonitor.getStatusColor(
        latestResult.status
      );
      console.log(
        `%c● ${systemName} - ${latestResult.status}`,
        `color: ${statusColor}; font-weight: bold;`
      );
      console.log(
        `%c  Score: ${latestResult.score?.toFixed(0)}/100`,
        "color: #999"
      );
      if (systemData.consecutiveFailures > 0) {
        console.log(
          `%c  Consecutive Failures: ${systemData.consecutiveFailures}`,
          "color: #f9e2af"
        );
      }
      if (latestResult.issues && latestResult.issues.length > 0) {
        console.log("%c  Issues:", "color: #f38ba8; font-weight: bold;");
        latestResult.issues.forEach((issue: string) => {
          console.log(`%c    - ${issue}`, "color: #f38ba8");
        });
      }
      if (
        latestResult.recommendations &&
        latestResult.recommendations.length > 0
      ) {
        console.log(
          "%c  Recommendations:",
          "color: #89b4fa; font-weight: bold;"
        );
        latestResult.recommendations.forEach((rec: string) => {
          console.log(`%c    - ${rec}`, "color: #89b4fa");
        });
      }
    });

    console.groupEnd();
    return report;
  }

  public getLatestHealthResult(systemName: string): HealthResult | undefined {
    const history = this.healthHistory.get(systemName);
    return history && history.length > 0
      ? history[history.length - 1]
      : undefined;
  }

  public getHealthSummary() {
    let healthy = 0;
    let warning = 0;
    let failing = 0;

    this.registeredSystems.forEach((_, systemName) => {
      const latestResult = this.getLatestHealthResult(systemName);
      if (latestResult) {
        switch (latestResult.status) {
          case "HEALTHY":
            healthy++;
            break;
          case "WARNING":
          case "DEGRADED":
            warning++;
            break;
          case "FAILING":
          case "ERROR":
          case "CRITICAL":
            failing++;
            break;
        }
      }
    });

    const overallStatus: SystemStatus =
      failing > 0
        ? "FAILING"
        : warning > 0
        ? "WARNING"
        : healthy > 0
        ? "HEALTHY"
        : "UNKNOWN";

    return {
      healthy,
      warning,
      failing,
      overallStatus,
      total: this.registeredSystems.size,
    };
  }

  // === CLEANUP ===

  public destroy(): void {
    this.stopMonitoring();
    this.registeredSystems.clear();
    this.healthHistory.clear();
    this.alerts = [];
    this.recoveryAttempts.clear();
    console.log("🏥 [SystemHealthMonitor] Destroyed and cleaned up");
  }
}

// Create global instance
if (typeof window !== "undefined") {
  (window as any).SystemHealthMonitor = new SystemHealthMonitor();
}

// ===================================================================
// 🌟 Y3K DEBUG INTERFACE EXPORT
// ===================================================================
// Export Y3K debug interface that other systems expect to import

export const Y3K = {
  debug: {
    log: (component: string, message: string, ...args: any[]) => {
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(`[${component}] ${message}`, ...args);
      }
    },
    error: (component: string, message: string, error?: any) => {
      console.error(`[${component}] ${message}`, error);
    },
    warn: (component: string, message: string, ...args: any[]) => {
      console.warn(`[${component}] ${message}`, ...args);
    }
  }
};
