// ===================================================================
// 🛠️ YEAR 3000 UNIFIED DEBUG INTERFACE - Phase 3
// ===================================================================
// Centralized debugging, monitoring, and testing interface for all
// Year 3000 visual systems and DOM targeting

import {
  testPhase2Systems,
  validateSpotifyDOM,
} from "./SpotifyDOMSelectors.js";
import { SystemIntegrationTester } from "./SystemIntegrationTester.js";

export class Year3000DebugInterface {
  constructor() {
    this.systems = new Map();
    this.monitors = new Map();
    this.testResults = new Map();
    this.isDebugMode = false;
    this.integrationTester = new SystemIntegrationTester();
    this.performanceHistory = [];

    // Auto-register systems when they become available
    this.setupSystemAutoRegistration();
  }

  // === SYSTEM REGISTRATION ===

  registerSystem(name, systemInstance) {
    if (this.systems.has(name)) {
      console.warn(
        `🛠️ [Year3000Debug] System ${name} already registered, updating...`
      );
    }

    this.systems.set(name, {
      instance: systemInstance,
      registeredAt: Date.now(),
      status: "REGISTERED",
      lastHealthCheck: null,
    });

    console.log(`🛠️ [Year3000Debug] Registered system: ${name}`);
    return true;
  }

  setupSystemAutoRegistration() {
    // Check for systems in global scope periodically
    if (typeof window !== "undefined") {
      this.autoRegisterInterval = setInterval(() => {
        this.scanForSystems();
      }, 2000);
    }
  }

  scanForSystems() {
    const expectedSystems = [
      "BehavioralPredictionEngine",
      "DimensionalNexusSystem",
      "DataGlyphSystem",
      "SidebarConsciousnessSystem",
      "BeatSyncVisualSystem",
    ];

    expectedSystems.forEach((systemName) => {
      if (!this.systems.has(systemName)) {
        // Try to find system in common locations
        let systemInstance = null;

        if (window.Year3000System && window.Year3000System[systemName]) {
          systemInstance = window.Year3000System[systemName];
        } else if (window[systemName]) {
          systemInstance = window[systemName];
        }

        if (systemInstance) {
          this.registerSystem(systemName, systemInstance);
        }
      }
    });
  }

  // === UNIFIED TESTING INTERFACE ===

  async runAllTests() {
    console.group("🧪 [Year3000Debug] Running All Tests");

    const testResults = {
      timestamp: Date.now(),
      domValidation: null,
      selectorTests: null,
      integrationTests: null,
      systemHealth: null,
      recommendations: [],
    };

    try {
      // Step 1: DOM Validation
      console.log("📋 Step 1: DOM Validation...");
      testResults.domValidation = validateSpotifyDOM();

      // Step 2: Phase 2 Selector Tests
      console.log("🎯 Step 2: Phase 2 Selector Tests...");
      testResults.selectorTests = testPhase2Systems();

      // Step 3: Integration Testing
      console.log("🔗 Step 3: Integration Testing...");
      testResults.integrationTests =
        await this.integrationTester.runFullIntegrationTest();

      // Step 4: System Health Check
      console.log("🏥 Step 4: System Health Check...");
      testResults.systemHealth = this.runSystemHealthCheck();

      // Step 5: Generate Recommendations
      testResults.recommendations =
        this.generateUnifiedRecommendations(testResults);

      // Store results
      this.testResults.set("latest", testResults);

      console.log("✅ All tests completed successfully!");
      console.groupEnd();

      return testResults;
    } catch (error) {
      console.error("❌ Test suite failed:", error);
      console.groupEnd();
      throw error;
    }
  }

  runSystemHealthCheck() {
    const healthResults = {
      totalSystems: this.systems.size,
      healthySystems: 0,
      warningSystems: 0,
      failingSystems: 0,
      details: {},
    };

    this.systems.forEach((systemData, systemName) => {
      const health = this.checkSystemHealth(systemName, systemData);
      healthResults.details[systemName] = health;

      switch (health.status) {
        case "HEALTHY":
          healthResults.healthySystems++;
          break;
        case "WARNING":
          healthResults.warningSystems++;
          break;
        case "FAILING":
          healthResults.failingSystems++;
          break;
      }
    });

    return healthResults;
  }

  checkSystemHealth(systemName, systemData) {
    const health = {
      name: systemName,
      status: "UNKNOWN",
      lastCheck: Date.now(),
      issues: [],
      metrics: {},
    };

    try {
      const instance = systemData.instance;

      // Check if system is initialized
      if (!instance) {
        health.status = "FAILING";
        health.issues.push("System instance not available");
        return health;
      }

      // Check if system has initialize method and is initialized
      if (typeof instance.initialize === "function") {
        // Check initialization status if available
        if (instance.initialized === false) {
          health.status = "WARNING";
          health.issues.push("System not yet initialized");
        }
      }

      // Check if system has required methods
      const requiredMethods = ["updateAnimation", "destroy"];
      const missingMethods = requiredMethods.filter(
        (method) => typeof instance[method] !== "function"
      );

      if (missingMethods.length > 0) {
        health.status = "WARNING";
        health.issues.push(`Missing methods: ${missingMethods.join(", ")}`);
      }

      // If no issues found, system is healthy
      if (health.issues.length === 0) {
        health.status = "HEALTHY";
      }
    } catch (error) {
      health.status = "FAILING";
      health.issues.push(`Health check error: ${error.message}`);
    }

    return health;
  }

  generateUnifiedRecommendations(testResults) {
    const recommendations = [];

    // From DOM validation
    if (testResults.domValidation && testResults.domValidation.missing > 0) {
      recommendations.push({
        priority: "HIGH",
        category: "DOM_VALIDATION",
        message: `${testResults.domValidation.missing} modern selectors not found`,
        action: "Check if Spotify UI has changed or update selectors",
      });
    }

    // From integration tests
    if (
      testResults.integrationTests &&
      testResults.integrationTests.summary.overallHealth < 70
    ) {
      recommendations.push({
        priority: "HIGH",
        category: "INTEGRATION",
        message: `Integration health is ${testResults.integrationTests.summary.overallHealth}% (below 70%)`,
        action: "Review failing systems and update selectors",
      });
    }

    // From system health
    if (
      testResults.systemHealth &&
      testResults.systemHealth.failingSystems > 0
    ) {
      recommendations.push({
        priority: "CRITICAL",
        category: "SYSTEM_HEALTH",
        message: `${testResults.systemHealth.failingSystems} systems are failing`,
        action: "Check system initialization and error logs",
      });
    }

    return recommendations;
  }

  // === INTERACTIVE DEBUG COMMANDS ===

  enableDebugMode() {
    this.isDebugMode = true;
    console.log("🛠️ [Year3000Debug] Debug mode enabled");

    // Enable debug mode on all registered systems
    this.systems.forEach((systemData, systemName) => {
      try {
        if (systemData.instance && systemData.instance.config) {
          systemData.instance.config.enableDebug = true;
        }
      } catch (error) {
        console.warn(
          `🛠️ [Year3000Debug] Could not enable debug on ${systemName}:`,
          error
        );
      }
    });
  }

  disableDebugMode() {
    this.isDebugMode = false;
    console.log("🛠️ [Year3000Debug] Debug mode disabled");

    // Disable debug mode on all registered systems
    this.systems.forEach((systemData, systemName) => {
      try {
        if (systemData.instance && systemData.instance.config) {
          systemData.instance.config.enableDebug = false;
        }
      } catch (error) {
        console.warn(
          `🛠️ [Year3000Debug] Could not disable debug on ${systemName}:`,
          error
        );
      }
    });
  }

  getSystemStatus() {
    console.group("🏥 [Year3000Debug] System Status Report");

    if (this.systems.size === 0) {
      console.log("⚠️ No systems registered");
      console.groupEnd();
      return;
    }

    this.systems.forEach((systemData, systemName) => {
      const health = this.checkSystemHealth(systemName, systemData);
      const statusIcon =
        health.status === "HEALTHY"
          ? "✅"
          : health.status === "WARNING"
          ? "⚠️"
          : "❌";

      console.log(`${statusIcon} ${systemName}: ${health.status}`);

      if (health.issues.length > 0) {
        health.issues.forEach((issue) => {
          console.log(`   • ${issue}`);
        });
      }
    });

    console.groupEnd();
  }

  testSystem(systemName) {
    const systemData = this.systems.get(systemName);
    if (!systemData) {
      console.error(`🛠️ [Year3000Debug] System ${systemName} not found`);
      return false;
    }

    console.group(`🧪 [Year3000Debug] Testing ${systemName}`);

    try {
      const instance = systemData.instance;

      // Run system-specific tests if available
      if (typeof instance.testUpdatedSelectors === "function") {
        console.log("🎯 Running selector tests...");
        const selectorResults = instance.testUpdatedSelectors();
        console.log("📊 Selector test results:", selectorResults);
      }

      if (typeof instance.simulateHighlighting === "function") {
        console.log("🌟 Running simulation tests...");
        instance.simulateHighlighting();
      }

      console.log("✅ System test completed");
      console.groupEnd();
      return true;
    } catch (error) {
      console.error(`❌ System test failed:`, error);
      console.groupEnd();
      return false;
    }
  }

  // === PERFORMANCE MONITORING ===

  startPerformanceMonitoring() {
    console.log("📊 [Year3000Debug] Starting performance monitoring...");

    this.performanceInterval = setInterval(() => {
      this.collectPerformanceMetrics();
    }, 5000);
  }

  stopPerformanceMonitoring() {
    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
      this.performanceInterval = null;
      console.log("📊 [Year3000Debug] Performance monitoring stopped");
    }
  }

  collectPerformanceMetrics() {
    const metrics = {
      timestamp: Date.now(),
      memory: performance.memory
        ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit,
          }
        : null,
      systemCount: this.systems.size,
      domElementCount: document.querySelectorAll("*").length,
    };

    this.performanceHistory.push(metrics);

    // Keep only last 20 measurements
    if (this.performanceHistory.length > 20) {
      this.performanceHistory.shift();
    }

    // Warn about memory issues
    if (metrics.memory && metrics.memory.used > metrics.memory.total * 0.8) {
      console.warn(
        `🚨 [Year3000Debug] High memory usage: ${(
          metrics.memory.used /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
    }
  }

  getPerformanceReport() {
    if (!this.performanceHistory || this.performanceHistory.length === 0) {
      console.log("📊 [Year3000Debug] No performance data available");
      return null;
    }

    const latest = this.performanceHistory[this.performanceHistory.length - 1];
    const oldest = this.performanceHistory[0];

    const report = {
      currentMemory: latest.memory
        ? (latest.memory.used / 1024 / 1024).toFixed(2) + "MB"
        : "N/A",
      memoryTrend:
        latest.memory && oldest.memory
          ? ((latest.memory.used - oldest.memory.used) / 1024 / 1024).toFixed(
              2
            ) + "MB change"
          : "N/A",
      systemCount: latest.systemCount,
      domElements: latest.domElementCount,
    };

    console.log("📊 [Year3000Debug] Performance Report:", report);
    return report;
  }

  // === HELPER FUNCTIONS ===

  getRegisteredSystems() {
    return Array.from(this.systems.keys());
  }

  getLastTestResults() {
    return this.testResults.get("latest") || null;
  }

  cleanup() {
    if (this.autoRegisterInterval) {
      clearInterval(this.autoRegisterInterval);
    }

    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
    }

    console.log("🛠️ [Year3000Debug] Debug interface cleaned up");
  }
}

// Create global instance
if (typeof window !== "undefined") {
  window.Year3000Debug = new Year3000DebugInterface();

  // Convenient global functions
  window.testAllSystems = () => window.Year3000Debug.runAllTests();
  window.checkSystemStatus = () => window.Year3000Debug.getSystemStatus();
  window.enableDebug = () => window.Year3000Debug.enableDebugMode();
  window.disableDebug = () => window.Year3000Debug.disableDebugMode();
  window.testSystem = (name) => window.Year3000Debug.testSystem(name);
  window.performanceReport = () => window.Year3000Debug.getPerformanceReport();
}
