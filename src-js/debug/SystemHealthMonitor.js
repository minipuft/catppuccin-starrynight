// ===================================================================
// 🏥 YEAR 3000 SYSTEM HEALTH MONITOR - Phase 3
// ===================================================================
// Long-term health monitoring and automatic recovery for visual systems

import { elementExists } from "./SpotifyDOMSelectors.js";

export class SystemHealthMonitor {
  constructor() {
    this.registeredSystems = new Map();
    this.healthHistory = new Map();
    this.alerts = [];
    this.monitoringActive = false;
    this.checkInterval = null;
    this.recoveryAttempts = new Map();

    // Configuration
    this.config = {
      checkIntervalMs: 10000, // Check every 10 seconds
      healthRetentionHours: 24, // Keep 24 hours of health data
      maxRecoveryAttempts: 3,
      alertThreshold: 3, // Alert after 3 consecutive failures
    };
  }

  // === SYSTEM REGISTRATION ===

  registerSystem(systemName, systemInstance, options = {}) {
    const systemData = {
      name: systemName,
      instance: systemInstance,
      registeredAt: Date.now(),
      options: {
        criticalLevel: options.criticalLevel || "MEDIUM", // LOW, MEDIUM, HIGH, CRITICAL
        requiredSelectors: options.requiredSelectors || [],
        healthCheckMethod: options.healthCheckMethod || null,
        recoveryMethod: options.recoveryMethod || null,
        ...options,
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

    // Start monitoring if this is the first system
    if (this.registeredSystems.size === 1 && !this.monitoringActive) {
      this.startMonitoring();
    }

    return systemData;
  }

  unregisterSystem(systemName) {
    if (this.registeredSystems.has(systemName)) {
      this.registeredSystems.delete(systemName);
      this.healthHistory.delete(systemName);
      this.recoveryAttempts.delete(systemName);

      console.log(`🏥 [SystemHealthMonitor] Unregistered ${systemName}`);

      // Stop monitoring if no systems remain
      if (this.registeredSystems.size === 0) {
        this.stopMonitoring();
      }
    }
  }

  // === MONITORING CONTROL ===

  startMonitoring() {
    if (this.monitoringActive) return;

    console.log("🏥 [SystemHealthMonitor] Starting health monitoring...");
    this.monitoringActive = true;

    this.checkInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.checkIntervalMs);

    // Initial health check
    this.performHealthChecks();
  }

  stopMonitoring() {
    if (!this.monitoringActive) return;

    console.log("🏥 [SystemHealthMonitor] Stopping health monitoring...");
    this.monitoringActive = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // === HEALTH CHECKING ===

  async performHealthChecks() {
    const timestamp = Date.now();
    const results = new Map();

    // Check each registered system
    for (const [systemName, systemData] of this.registeredSystems) {
      try {
        const healthResult = await this.checkSystemHealth(
          systemName,
          systemData
        );
        results.set(systemName, healthResult);

        // Update system status
        systemData.lastHealthCheck = timestamp;
        systemData.status = healthResult.status;

        // Track failures
        if (
          healthResult.status === "FAILING" ||
          healthResult.status === "ERROR"
        ) {
          systemData.consecutiveFailures++;
          systemData.totalFailures++;
        } else {
          systemData.consecutiveFailures = 0;
        }

        // Store health history
        this.updateHealthHistory(systemName, healthResult);

        // Check for alerts
        this.checkForAlerts(systemName, systemData, healthResult);

        // Attempt recovery if needed
        if (
          healthResult.status === "FAILING" &&
          systemData.options.recoveryMethod
        ) {
          await this.attemptRecovery(systemName, systemData);
        }
      } catch (error) {
        console.error(
          `🏥 [SystemHealthMonitor] Health check failed for ${systemName}:`,
          error
        );

        const errorResult = {
          status: "ERROR",
          timestamp: timestamp,
          error: error.message,
          checks: {},
        };

        results.set(systemName, errorResult);
        this.updateHealthHistory(systemName, errorResult);
      }
    }

    // Clean up old history
    this.cleanupHealthHistory();

    return results;
  }

  async checkSystemHealth(systemName, systemData) {
    const timestamp = Date.now();
    const healthResult = {
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

    // Check 1: System Instance Availability
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

    // Check 2: Initialization Status
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

    // Check 3: Required Methods
    if (instance) {
      const requiredMethods = ["updateAnimation", "destroy"];
      totalChecks++;

      const missingMethods = requiredMethods.filter(
        (method) => typeof instance[method] !== "function"
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

    // Check 4: Required DOM Selectors
    if (
      systemData.options.requiredSelectors &&
      systemData.options.requiredSelectors.length > 0
    ) {
      totalChecks++;
      const missingSelectors = [];

      systemData.options.requiredSelectors.forEach((selector) => {
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

    // Check 5: Custom Health Check
    if (
      instance &&
      systemData.options.healthCheckMethod &&
      typeof instance[systemData.options.healthCheckMethod] === "function"
    ) {
      totalChecks++;
      try {
        const customResult = await instance[
          systemData.options.healthCheckMethod
        ]();
        if (customResult && customResult.healthy !== false) {
          healthResult.checks.customHealth = {
            status: "PASS",
            message: "Custom health check passed",
          };
          passedChecks++;
        } else {
          healthResult.checks.customHealth = {
            status: "FAIL",
            message: customResult?.message || "Custom health check failed",
          };
          if (customResult?.issues) {
            healthResult.issues.push(...customResult.issues);
          }
        }
      } catch (error) {
        healthResult.checks.customHealth = {
          status: "ERROR",
          message: `Custom health check error: ${error.message}`,
        };
        healthResult.issues.push(
          `Custom health check failed: ${error.message}`
        );
      }
    }

    // Calculate overall health score and status
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

  updateHealthHistory(systemName, healthResult) {
    const history = this.healthHistory.get(systemName) || [];

    history.push({
      timestamp: healthResult.timestamp,
      status: healthResult.status,
      score: healthResult.score,
      issueCount: healthResult.issues ? healthResult.issues.length : 0,
    });

    // Limit history size (24 hours worth at 10-second intervals = ~8640 entries)
    const maxEntries = Math.ceil(
      (this.config.healthRetentionHours * 60 * 60 * 1000) /
        this.config.checkIntervalMs
    );
    if (history.length > maxEntries) {
      history.splice(0, history.length - maxEntries);
    }

    this.healthHistory.set(systemName, history);
  }

  cleanupHealthHistory() {
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

  checkForAlerts(systemName, systemData, healthResult) {
    const criticalLevel = systemData.options.criticalLevel;
    const consecutiveFailures = systemData.consecutiveFailures;

    // Alert conditions based on critical level
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

    // Special alert for critical systems that go down
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

  createAlert(alertData) {
    // Avoid duplicate alerts
    const existingAlert = this.alerts.find(
      (alert) =>
        alert.type === alertData.type &&
        alert.systemName === alertData.systemName &&
        alert.timestamp > Date.now() - 5 * 60 * 1000 // Within last 5 minutes
    );

    if (existingAlert) return;

    this.alerts.push(alertData);

    // Log alert
    const severityIcon =
      alertData.severity === "CRITICAL"
        ? "🚨"
        : alertData.severity === "HIGH"
        ? "⚠️"
        : "🔔";
    console.warn(
      `${severityIcon} [SystemHealthMonitor] ALERT: ${alertData.message}`
    );

    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts.splice(0, this.alerts.length - 50);
    }
  }

  mapCriticalLevelToSeverity(criticalLevel) {
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

  async attemptRecovery(systemName, systemData) {
    const recoveryAttempts = this.recoveryAttempts.get(systemName) || 0;

    if (recoveryAttempts >= this.config.maxRecoveryAttempts) {
      console.warn(
        `🏥 [SystemHealthMonitor] Max recovery attempts reached for ${systemName}`
      );
      return false;
    }

    console.log(
      `🔄 [SystemHealthMonitor] Attempting recovery for ${systemName} (attempt ${
        recoveryAttempts + 1
      })`
    );

    try {
      const instance = systemData.instance;
      const recoveryMethod = systemData.options.recoveryMethod;

      if (typeof instance[recoveryMethod] === "function") {
        await instance[recoveryMethod]();

        this.recoveryAttempts.set(systemName, recoveryAttempts + 1);

        console.log(
          `✅ [SystemHealthMonitor] Recovery attempt completed for ${systemName}`
        );
        return true;
      } else {
        console.warn(
          `🏥 [SystemHealthMonitor] Recovery method ${recoveryMethod} not found on ${systemName}`
        );
        return false;
      }
    } catch (error) {
      console.error(
        `❌ [SystemHealthMonitor] Recovery failed for ${systemName}:`,
        error
      );
      this.recoveryAttempts.set(systemName, recoveryAttempts + 1);
      return false;
    }
  }

  // === REPORTING ===

  getHealthReport() {
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
      },
      recentAlerts: this.alerts.slice(-10),
      systemDetails: {},
    };

    this.registeredSystems.forEach((systemData, systemName) => {
      const status = systemData.status || "UNKNOWN";
      report.systemsByStatus[status]++;

      const history = this.healthHistory.get(systemName) || [];
      const recentHistory = history.slice(-10);

      report.systemDetails[systemName] = {
        status: status,
        consecutiveFailures: systemData.consecutiveFailures,
        totalFailures: systemData.totalFailures,
        lastCheck: systemData.lastHealthCheck,
        criticalLevel: systemData.options.criticalLevel,
        recentHistory: recentHistory,
      };
    });

    return report;
  }

  logHealthReport() {
    const report = this.getHealthReport();

    console.group("🏥 [SystemHealthMonitor] Health Report");
    console.log(`📊 Total Systems: ${report.totalSystems}`);
    console.log(`✅ Healthy: ${report.systemsByStatus.HEALTHY}`);
    console.log(`⚠️ Warning: ${report.systemsByStatus.WARNING}`);
    console.log(`🔶 Degraded: ${report.systemsByStatus.DEGRADED}`);
    console.log(`❌ Failing: ${report.systemsByStatus.FAILING}`);
    console.log(`🚨 Critical: ${report.systemsByStatus.CRITICAL}`);

    if (report.recentAlerts.length > 0) {
      console.group(`🔔 Recent Alerts (${report.recentAlerts.length})`);
      report.recentAlerts.forEach((alert) => {
        console.log(
          `• ${alert.message} (${new Date(
            alert.timestamp
          ).toLocaleTimeString()})`
        );
      });
      console.groupEnd();
    }

    console.groupEnd();
    return report;
  }

  // === CLEANUP ===

  destroy() {
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
  window.SystemHealthMonitor = new SystemHealthMonitor();
}
