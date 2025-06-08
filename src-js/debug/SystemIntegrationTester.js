// ===================================================================
// 🔧 YEAR 3000 UNIFIED DEBUG INTERFACE - Phase 3
// ===================================================================
// Comprehensive testing framework and debug utilities for validating
// all visual systems integration and providing developer tools

import { YEAR3000_CONFIG } from "../config/globalConfig.js";
import { Year3000Utilities } from "../utils/Year3000Utilities.js";
import {
  GRAVITY_WELL_TARGETS,
  MODERN_SELECTORS,
  ORBITAL_ELEMENTS,
  elementExists,
  findElementsWithFallback,
} from "./SpotifyDOMSelectors.js";

export class SystemIntegrationTester {
  constructor() {
    this.testResults = {};
    this.performanceMetrics = {};
    this.systemStatus = {};
    this.domObserver = null;
    this.testInProgress = false;
  }

  // ===================================================================
  // 🎨 QUICK DEBUG UTILITIES (from Year3000Debug)
  // ===================================================================

  testGradients() {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log("🧪 [StarryNight Debug] Testing gradient application...");
    }
    if (globalThis.year3000System?.updateColorsFromCurrentTrack) {
      globalThis.year3000System.updateColorsFromCurrentTrack();
    } else {
      console.warn(
        "[StarryNight Debug] year3000System.updateColorsFromCurrentTrack not available."
      );
    }

    const root = Year3000Utilities.getRootStyle();
    if (!root) {
      console.warn(
        "[StarryNight Debug] Root element not found for testGradients."
      );
      return { gradientVars: {}, rgbValidation: {} };
    }

    const gradientVars = {
      primary: root.getPropertyValue("--sn-gradient-primary").trim(),
      secondary: root.getPropertyValue("--sn-gradient-secondary").trim(),
      accent: root.getPropertyValue("--sn-gradient-accent").trim(),
      primaryRgb: root.getPropertyValue("--sn-gradient-primary-rgb").trim(),
      secondaryRgb: root.getPropertyValue("--sn-gradient-secondary-rgb").trim(),
      accentRgb: root.getPropertyValue("--sn-gradient-accent-rgb").trim(),
      opacity: root.getPropertyValue("--sn-gradient-opacity").trim(),
      blur: root.getPropertyValue("--sn-gradient-blur").trim(),
    };

    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        "🎨 [StarryNight Debug] Current gradient variables:",
        gradientVars
      );
    }

    const rgbValidation = {
      primaryRgbValid: /^\d+,\d+,\d+$/.test(gradientVars.primaryRgb),
      secondaryRgbValid: /^\d+,\d+,\d+$/.test(gradientVars.secondaryRgb),
      accentRgbValid: /^\d+,\d+,\d+$/.test(gradientVars.accentRgb),
    };

    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        "✅ [StarryNight Debug] RGB Format Validation:",
        rgbValidation
      );
    }
    return { gradientVars, rgbValidation };
  }

  logCurrentVariables() {
    const rootStyle = Year3000Utilities.getRootStyle();
    if (!rootStyle) {
      console.warn(
        "[StarryNight Debug] Root element style not found for logCurrentVariables."
      );
      return { hexVars: {}, rgbVars: {}, allVariables: {} };
    }
    const variables = {};
    const allCssRules = [];
    try {
      for (const styleSheet of document.styleSheets) {
        // Ensure cssRules are accessible (might be blocked by CORS for external stylesheets)
        if (
          styleSheet.href &&
          !styleSheet.href.startsWith(window.location.origin)
        ) {
          if (YEAR3000_CONFIG?.enableDebug) {
            // console.log(`[StarryNight Debug] Skipping stylesheet from different origin: ${styleSheet.href}`);
          }
          continue;
        }
        try {
          if (styleSheet.cssRules) {
            for (const rule of styleSheet.cssRules) {
              if (rule.style) {
                // Check if rule has a style object (e.g. CSSStyleRule)
                allCssRules.push(rule);
              }
            }
          }
        } catch (e) {
          if (YEAR3000_CONFIG?.enableDebug) {
            // console.warn(`[StarryNight Debug] Could not access rules for stylesheet ${styleSheet.href || 'inline'}:`, e.message);
          }
        }
      }
    } catch (e) {
      console.error("[StarryNight Debug] Error iterating stylesheets:", e);
    }

    // Iterate over known variables from :root, and also try to find others.
    // This approach is more robust than iterating styleSheet.cssRules[0].style which assumes :root is the first rule.
    const rootElement = document.documentElement;
    const computedRootStyle = getComputedStyle(rootElement);

    for (let i = 0; i < computedRootStyle.length; i++) {
      const propName = computedRootStyle[i];
      if (propName.startsWith("--spice-") || propName.startsWith("--sn-")) {
        variables[propName] = computedRootStyle
          .getPropertyValue(propName)
          .trim();
      }
    }

    // Fallback for properties potentially not caught by computedStyle iteration but present in rules
    // This part is less reliable due to CSSOM limitations for enumerating all custom properties.
    // The computedStyle approach above is generally preferred.
    // We'll stick to the computedStyle results for now.

    const hexVars = Object.keys(variables).filter(
      (key) => !key.includes("-rgb")
    );
    const rgbVars = Object.keys(variables).filter((key) =>
      key.includes("-rgb")
    );

    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        "🎨 [StarryNight Debug] Hex Variables:",
        hexVars.reduce((obj, key) => {
          obj[key] = variables[key];
          return obj;
        }, {})
      );
      console.log(
        "🧮 [StarryNight Debug] RGB Variables:",
        rgbVars.reduce((obj, key) => {
          obj[key] = variables[key];
          return obj;
        }, {})
      );
    }

    return {
      hexVars: hexVars.reduce((obj, key) => {
        obj[key] = variables[key];
        return obj;
      }, {}),
      rgbVars: rgbVars.reduce((obj, key) => {
        obj[key] = variables[key];
        return obj;
      }, {}),
      allVariables: variables,
    };
  }

  testHexToRgb(hex) {
    const rgb = Year3000Utilities.hexToRgb(hex);
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        `🔄 [StarryNight Debug] ${hex} → RGB(${rgb?.r}, ${rgb?.g}, ${rgb?.b}) → "${rgb?.r},${rgb?.g},${rgb?.b}"`
      );
    }
    return rgb;
  }

  validateRgbVariables() {
    const requiredRgbVars = [
      "--sn-gradient-primary-rgb",
      "--sn-gradient-secondary-rgb",
      "--sn-gradient-accent-rgb",
      "--spice-rgb-main",
      "--spice-rgb-base",
      "--spice-rgb-player",
      "--spice-rgb-sidebar",
      "--spice-rgb-accent",
      "--spice-rgb-button", // Added from notes
      "--spice-rgb-surface0",
      "--spice-rgb-surface1",
      "--spice-rgb-text", // Added from notes
    ];

    const root = Year3000Utilities.getRootStyle();
    if (!root) {
      console.warn(
        "[StarryNight Debug] Root element not found for validateRgbVariables."
      );
      return {};
    }
    const validation = {};

    requiredRgbVars.forEach((varName) => {
      const value = root.getPropertyValue(varName).trim();
      validation[varName] = {
        present: !!value,
        value: value,
        validFormat: /^\d+,\d+,\d+$/.test(value),
      };
    });

    if (YEAR3000_CONFIG?.enableDebug) {
      console.table(validation);
    }
    return validation;
  }

  resetColors() {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log("🔄 [StarryNight Debug] Resetting colors to defaults...");
    }
    if (globalThis.year3000System?.resetToDefaults) {
      globalThis.year3000System.resetToDefaults();
    } else {
      console.warn(
        "[StarryNight Debug] year3000System.resetToDefaults not available."
      );
    }
  }

  extractColors() {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        "🎨 [StarryNight Debug] Extracting colors from current track..."
      );
    }
    if (globalThis.year3000System?.updateColorsFromCurrentTrack) {
      globalThis.year3000System.updateColorsFromCurrentTrack();
    } else {
      console.warn(
        "[StarryNight Debug] year3000System.updateColorsFromCurrentTrack not available."
      );
    }
  }

  getReport() {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log("📊 [StarryNight Debug] Generating system report...");
    }
    if (globalThis.year3000System?.getSystemReport) {
      return globalThis.year3000System.getSystemReport();
    } else {
      console.warn(
        "[StarryNight Debug] year3000System.getSystemReport not available."
      );
      return { error: "getSystemReport not available" };
    }
  }

  // Add a helper to get a specific CSS variable's value directly
  getCssVariable(varName) {
    const rootStyle = Year3000Utilities.getRootStyle();
    if (!rootStyle) {
      console.warn(
        `[StarryNight Debug] Root element style not found for getCssVariable: ${varName}.`
      );
      return null;
    }
    const value = rootStyle.getPropertyValue(varName).trim();
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(`[StarryNight Debug] CSS Variable ${varName}: '${value}'`);
    }
    return value;
  }

  // ===================================================================
  // 🧪 COMPREHENSIVE INTEGRATION TESTING
  // ===================================================================

  async runFullIntegrationTest() {
    console.group(
      "🧪 [SystemIntegrationTester] Phase 3 - Full Integration Test"
    );

    this.testInProgress = true;
    this.testResults = {
      startTime: Date.now(),
      domValidation: null,
      systemTests: {},
      crossSystemTests: {},
      performanceTests: {},
      errors: [],
    };

    try {
      // Step 1: DOM Validation
      console.log("📋 Step 1: Validating DOM structure...");
      this.testResults.domValidation = await this.validateDOMStructure();

      // Step 2: Individual System Testing
      console.log("🎯 Step 2: Testing individual systems...");
      this.testResults.systemTests = await this.testAllVisualSystems();

      // Step 3: Cross-System Integration Testing
      console.log("🔗 Step 3: Testing cross-system integration...");
      this.testResults.crossSystemTests =
        await this.testCrossSystemIntegration();

      // Step 4: Performance Testing
      console.log("⚡ Step 4: Performance testing...");
      this.testResults.performanceTests = await this.testSystemPerformance();

      // Step 5: Generate Comprehensive Report
      console.log("📊 Step 5: Generating integration report...");
      const report = this.generateIntegrationReport();

      this.testResults.endTime = Date.now();
      this.testResults.duration =
        this.testResults.endTime - this.testResults.startTime;

      console.log("✅ Integration test completed successfully!");
      console.groupEnd();

      return report;
    } catch (error) {
      this.testResults.errors.push({
        type: "FATAL_ERROR",
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
      });

      console.error("❌ Integration test failed:", error);
      console.groupEnd();
      throw error;
    } finally {
      this.testInProgress = false;
    }
  }

  // === DOM STRUCTURE VALIDATION ===

  async validateDOMStructure() {
    const domValidation = {
      modernSelectorsFound: 0,
      modernSelectorsMissing: 0,
      legacySelectorsStillPresent: 0,
      criticalElementsMissing: [],
      recommendations: [],
    };

    // Test modern selectors
    Object.entries(MODERN_SELECTORS).forEach(([key, selector]) => {
      if (elementExists(selector)) {
        domValidation.modernSelectorsFound++;
      } else {
        domValidation.modernSelectorsMissing++;

        // Check if this is a critical element
        const isCritical =
          GRAVITY_WELL_TARGETS.primary.includes(selector) ||
          GRAVITY_WELL_TARGETS.secondary.includes(selector);

        if (isCritical) {
          domValidation.criticalElementsMissing.push({
            name: key,
            selector: selector,
            impact: "HIGH",
          });
        }
      }
    });

    // Check for legacy selectors still present
    const legacySelectors = [
      ".main-nowPlayingWidget-nowPlaying",
      ".main-navBar-navBar",
      ".main-search-searchBar",
      ".main-topBar-topBar",
      ".main-queue-queue",
    ];

    legacySelectors.forEach((selector) => {
      if (elementExists(selector)) {
        domValidation.legacySelectorsStillPresent++;
        domValidation.recommendations.push({
          type: "LEGACY_SELECTOR_FOUND",
          selector: selector,
          message: `Legacy selector ${selector} still exists - systems may have redundant targeting`,
        });
      }
    });

    return domValidation;
  }

  // === SYSTEM TESTING ===

  async testAllVisualSystems() {
    const systemTests = {};

    const systemsToTest = [
      "BehavioralPredictionEngine",
      "DimensionalNexusSystem",
      "DataGlyphSystem",
    ];

    for (const systemName of systemsToTest) {
      systemTests[systemName] = await this.testIndividualSystem(systemName);
    }

    return systemTests;
  }

  async testIndividualSystem(systemName) {
    const systemTest = {
      name: systemName,
      status: "UNKNOWN",
      targetsFound: 0,
      targetsMissing: 0,
      selectors: [],
      errors: [],
    };

    try {
      // Test system-specific selectors
      const selectorTest = await this.testSystemSelectors(systemName);
      systemTest.targetsFound = selectorTest.found;
      systemTest.targetsMissing = selectorTest.missing;
      systemTest.selectors = selectorTest.details;

      // Determine system status
      if (systemTest.targetsMissing === 0) {
        systemTest.status = "HEALTHY";
      } else if (systemTest.targetsFound > systemTest.targetsMissing) {
        systemTest.status = "DEGRADED";
      } else {
        systemTest.status = "FAILING";
      }
    } catch (error) {
      systemTest.status = "ERROR";
      systemTest.errors.push({
        type: "TEST_ERROR",
        message: error.message,
      });
    }

    return systemTest;
  }

  async testSystemSelectors(systemName) {
    const selectorTest = {
      found: 0,
      missing: 0,
      details: [],
    };

    // Define expected selectors per system
    const systemSelectors = this.getExpectedSelectorsForSystem(systemName);

    systemSelectors.forEach(({ name, selector, importance }) => {
      const elements = findElementsWithFallback(selector);
      const found = elements.length > 0;

      selectorTest.details.push({
        name: name,
        selector: selector,
        found: found,
        count: elements.length,
        importance: importance,
      });

      if (found) {
        selectorTest.found++;
      } else {
        selectorTest.missing++;
      }
    });

    return selectorTest;
  }

  getExpectedSelectorsForSystem(systemName) {
    const commonSelectors = [
      {
        name: "Left Sidebar",
        selector: MODERN_SELECTORS.leftSidebar,
        importance: "HIGH",
      },
      {
        name: "Now Playing Bar",
        selector: MODERN_SELECTORS.nowPlayingBar,
        importance: "HIGH",
      },
      {
        name: "Track Rows",
        selector: ORBITAL_ELEMENTS.trackRows,
        importance: "MEDIUM",
      },
    ];

    const systemSpecificSelectors = {
      BehavioralPredictionEngine: [
        ...commonSelectors,
        {
          name: "Play Button",
          selector: MODERN_SELECTORS.playButton,
          importance: "HIGH",
        },
        {
          name: "Like Button",
          selector: MODERN_SELECTORS.likeButton,
          importance: "MEDIUM",
        },
      ],
      DimensionalNexusSystem: [
        {
          name: "Left Sidebar",
          selector: MODERN_SELECTORS.leftSidebar,
          importance: "CRITICAL",
        },
        {
          name: "Modal Container",
          selector: MODERN_SELECTORS.modal,
          importance: "MEDIUM",
        },
      ],
      DataGlyphSystem: [
        {
          name: "Nav Links",
          selector: ORBITAL_ELEMENTS.navLinks,
          importance: "HIGH",
        },
        {
          name: "Cards",
          selector: ORBITAL_ELEMENTS.cards,
          importance: "MEDIUM",
        },
      ],
    };

    return systemSpecificSelectors[systemName] || commonSelectors;
  }

  // === CROSS-SYSTEM INTEGRATION TESTING ===

  async testCrossSystemIntegration() {
    const crossSystemTests = {
      sharedElementConflicts: [],
      performanceImpacts: [],
    };

    // Test shared element usage
    crossSystemTests.sharedElementConflicts = this.testSharedElementUsage();

    return crossSystemTests;
  }

  testSharedElementUsage() {
    const conflicts = [];

    // Track which elements are targeted by multiple systems
    const criticalSelectors = [
      MODERN_SELECTORS.leftSidebar,
      MODERN_SELECTORS.nowPlayingBar,
      ORBITAL_ELEMENTS.trackRows,
    ];

    criticalSelectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        // Check for signs of multiple system modifications
        const classes = Array.from(element.classList);
        const systemPrefixes = classes.filter(
          (cls) =>
            cls.startsWith("sn-") ||
            cls.startsWith("year3000-") ||
            cls.startsWith("gravity-")
        );

        if (systemPrefixes.length > 3) {
          conflicts.push({
            selector: selector,
            element: element,
            systemClasses: systemPrefixes,
            severity: "POTENTIAL_CONFLICT",
            message: `Element has ${systemPrefixes.length} system-specific classes`,
          });
        }
      }
    });

    return conflicts;
  }

  // === PERFORMANCE TESTING ===

  async testSystemPerformance() {
    const performanceTests = {
      domQuerySpeed: await this.testDOMQueryPerformance(),
      memoryUsage: this.testMemoryUsage(),
    };

    return performanceTests;
  }

  async testDOMQueryPerformance() {
    const tests = [];
    const selectors = Object.values(MODERN_SELECTORS);

    // Test query speed for all modern selectors
    const iterations = 100;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      selectors.forEach((selector) => {
        document.querySelectorAll(selector);
      });
    }

    const endTime = performance.now();
    const averageTime = (endTime - startTime) / iterations;

    tests.push({
      test: "Modern Selectors Query Speed",
      iterations: iterations,
      totalTime: endTime - startTime,
      averageTime: averageTime,
      status:
        averageTime < 5 ? "GOOD" : averageTime < 15 ? "ACCEPTABLE" : "SLOW",
    });

    return tests;
  }

  testMemoryUsage() {
    const memoryTests = [];

    if (performance.memory) {
      memoryTests.push({
        test: "JavaScript Heap Usage",
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        percentage: (
          (performance.memory.usedJSHeapSize /
            performance.memory.totalJSHeapSize) *
          100
        ).toFixed(2),
        status:
          performance.memory.usedJSHeapSize <
          performance.memory.totalJSHeapSize * 0.8
            ? "GOOD"
            : "HIGH",
      });
    }

    return memoryTests;
  }

  // === REPORTING ===

  generateIntegrationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      duration: this.testResults.duration,
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations(),
      fullResults: this.testResults,
    };

    this.logFormattedReport(report);
    return report;
  }

  generateSummary() {
    const domValidation = this.testResults.domValidation;
    const systemTests = this.testResults.systemTests;

    const healthySystems = Object.values(systemTests).filter(
      (s) => s.status === "HEALTHY"
    ).length;
    const totalSystems = Object.keys(systemTests).length;

    return {
      overallHealth: this.calculateOverallHealth(),
      modernSelectorsFound: domValidation.modernSelectorsFound,
      modernSelectorsMissing: domValidation.modernSelectorsMissing,
      systemsHealthy: healthySystems,
      systemsTotal: totalSystems,
      criticalIssues: domValidation.criticalElementsMissing.length,
    };
  }

  calculateOverallHealth() {
    const domValidation = this.testResults.domValidation;
    const systemTests = this.testResults.systemTests;

    let score = 100;
    score -= domValidation.modernSelectorsMissing * 5;
    score -= domValidation.criticalElementsMissing.length * 15;

    const unhealthySystems = Object.values(systemTests).filter(
      (s) => s.status === "FAILING" || s.status === "ERROR"
    ).length;
    score -= unhealthySystems * 20;

    return Math.max(0, score);
  }

  generateRecommendations() {
    const recommendations = [];
    const domValidation = this.testResults.domValidation;
    const systemTests = this.testResults.systemTests;

    if (domValidation.criticalElementsMissing.length > 0) {
      recommendations.push({
        priority: "HIGH",
        type: "CRITICAL_ELEMENTS",
        message: `${domValidation.criticalElementsMissing.length} critical elements are missing`,
        action: "Update Spotify or check for UI changes",
      });
    }

    Object.entries(systemTests).forEach(([systemName, test]) => {
      if (test.status === "FAILING" || test.status === "ERROR") {
        recommendations.push({
          priority: "HIGH",
          type: "SYSTEM_FAILURE",
          system: systemName,
          message: `${systemName} is not functioning properly`,
          action: "Check system initialization and selector updates",
        });
      }
    });

    return recommendations;
  }

  logFormattedReport(report) {
    console.group("📊 System Integration Test Report");

    console.log(`🕒 Test Duration: ${report.duration}ms`);
    console.log(`📈 Overall Health: ${report.summary.overallHealth}%`);
    console.log(
      `🎯 Systems Healthy: ${report.summary.systemsHealthy}/${report.summary.systemsTotal}`
    );
    console.log(
      `🔍 Modern Selectors: ${report.summary.modernSelectorsFound} found, ${report.summary.modernSelectorsMissing} missing`
    );

    if (report.recommendations.length > 0) {
      console.group("🚨 Recommendations");
      report.recommendations.forEach((rec) => {
        console.log(
          `${rec.priority === "HIGH" ? "🔴" : "🟡"} ${rec.type}: ${rec.message}`
        );
        console.log(`   Action: ${rec.action}`);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }
}

// ===================================================================
// 🌟 UNIFIED YEAR3000 DEBUG INTERFACE EXPORT
// ===================================================================

// Create unified debug interface that includes both simple utilities and comprehensive testing
export const Year3000Debug = {
  // Quick debug utilities (direct methods for console convenience)
  testGradients: () => new SystemIntegrationTester().testGradients(),
  logCurrentVariables: () =>
    new SystemIntegrationTester().logCurrentVariables(),
  testHexToRgb: (hex) => new SystemIntegrationTester().testHexToRgb(hex),
  validateRgbVariables: () =>
    new SystemIntegrationTester().validateRgbVariables(),
  resetColors: () => new SystemIntegrationTester().resetColors(),
  extractColors: () => new SystemIntegrationTester().extractColors(),
  getReport: () => new SystemIntegrationTester().getReport(),
  getCssVariable: (varName) =>
    new SystemIntegrationTester().getCssVariable(varName),

  // Comprehensive testing
  runFullIntegrationTest: () =>
    new SystemIntegrationTester().runFullIntegrationTest(),

  // Get instance for advanced usage
  getInstance: () => new SystemIntegrationTester(),
};

// Create global instance for easy access
if (typeof window !== "undefined") {
  window.SystemIntegrationTester = new SystemIntegrationTester();
  window.Year3000Debug = Year3000Debug;
  window.runIntegrationTest = () =>
    window.SystemIntegrationTester.runFullIntegrationTest();
}
