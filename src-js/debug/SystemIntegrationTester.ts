// ===================================================================
// 🔧 YEAR 3000 UNIFIED DEBUG INTERFACE - Phase 3
// ===================================================================
// Comprehensive testing framework and debug utilities for validating
// all visual systems integration and providing developer tools

import { YEAR3000_CONFIG } from "../config/globalConfig";
import * as Year3000Utilities from "../utils/Year3000Utilities";
import {
  GRAVITY_WELL_TARGETS,
  MODERN_SELECTORS,
  ORBITAL_ELEMENTS,
  elementExists,
  findElementsWithFallback,
} from "./SpotifyDOMSelectors";

declare global {
  interface Window {
    SystemIntegrationTester: SystemIntegrationTester;
    Year3000Debug: any;
    runIntegrationTest: () => Promise<any>;
  }
}

interface TestResults {
  startTime?: number;
  domValidation: any;
  systemTests: { [key: string]: any };
  crossSystemTests: { [key: string]: any };
  performanceTests: { [key: string]: any };
  errors: any[];
  endTime?: number;
  duration?: number;
}

export class SystemIntegrationTester {
  private testResults: Partial<TestResults>;
  private performanceMetrics: { [key: string]: any };
  private systemStatus: { [key: string]: any };
  private domObserver: MutationObserver | null;
  private testInProgress: boolean;

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

  public testGradients(): {
    gradientVars: { [key: string]: string };
    rgbValidation: { [key: string]: boolean };
  } {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log("🧪 [StarryNight Debug] Testing gradient application...");
    }
    if ((globalThis as any).year3000System?.updateColorsFromCurrentTrack) {
      (globalThis as any).year3000System.updateColorsFromCurrentTrack();
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

    const computedStyle = getComputedStyle(root);
    const gradientVars = {
      primary: computedStyle.getPropertyValue("--sn-gradient-primary").trim(),
      secondary: computedStyle
        .getPropertyValue("--sn-gradient-secondary")
        .trim(),
      accent: computedStyle.getPropertyValue("--sn-gradient-accent").trim(),
      primaryRgb: computedStyle
        .getPropertyValue("--sn-gradient-primary-rgb")
        .trim(),
      secondaryRgb: computedStyle
        .getPropertyValue("--sn-gradient-secondary-rgb")
        .trim(),
      accentRgb: computedStyle
        .getPropertyValue("--sn-gradient-accent-rgb")
        .trim(),
      opacity: computedStyle.getPropertyValue("--sn-gradient-opacity").trim(),
      blur: computedStyle.getPropertyValue("--sn-gradient-blur").trim(),
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

  public logCurrentVariables(): {
    hexVars: { [key: string]: string };
    rgbVars: { [key: string]: string };
    allVariables: { [key: string]: string };
  } {
    const rootStyle = Year3000Utilities.getRootStyle();
    if (!rootStyle) {
      console.warn(
        "[StarryNight Debug] Root element style not found for logCurrentVariables."
      );
      return { hexVars: {}, rgbVars: {}, allVariables: {} };
    }
    const variables: { [key: string]: string } = {};

    const rootElement = document.documentElement;
    const computedRootStyle = getComputedStyle(rootElement);

    for (let i = 0; i < computedRootStyle.length; i++) {
      const propName = computedRootStyle[i];
      if (
        propName &&
        (propName.startsWith("--spice-") || propName.startsWith("--sn-"))
      ) {
        variables[propName] = computedRootStyle
          .getPropertyValue(propName)
          .trim();
      }
    }

    const hexVars = Object.keys(variables)
      .filter((key) => !key.includes("-rgb"))
      .reduce((obj, key) => {
        obj[key] = variables[key]!;
        return obj;
      }, {} as { [key: string]: string });

    const rgbVars = Object.keys(variables)
      .filter((key) => key.includes("-rgb"))
      .reduce((obj, key) => {
        obj[key] = variables[key]!;
        return obj;
      }, {} as { [key: string]: string });

    if (YEAR3000_CONFIG?.enableDebug) {
      console.log("🎨 [StarryNight Debug] Hex Variables:", hexVars);
      console.log("🧮 [StarryNight Debug] RGB Variables:", rgbVars);
    }

    return {
      hexVars,
      rgbVars,
      allVariables: variables,
    };
  }

  public testHexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const rgb = Year3000Utilities.hexToRgb(hex);
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        `🔄 [StarryNight Debug] ${hex} → RGB(${rgb?.r}, ${rgb?.g}, ${rgb?.b}) → "${rgb?.r},${rgb?.g},${rgb?.b}"`
      );
    }
    return rgb;
  }

  public validateRgbVariables(): { [key: string]: any } {
    const requiredRgbVars = [
      "--sn-gradient-primary-rgb",
      "--sn-gradient-secondary-rgb",
      "--sn-gradient-accent-rgb",
      "--spice-rgb-main",
      "--spice-rgb-base",
      "--spice-rgb-player",
      "--spice-rgb-sidebar",
      "--spice-rgb-accent",
      "--spice-rgb-button",
      "--spice-rgb-surface0",
      "--spice-rgb-surface1",
      "--spice-rgb-text",
    ];

    const root = Year3000Utilities.getRootStyle();
    if (!root) {
      console.warn(
        "[StarryNight Debug] Root element not found for validateRgbVariables."
      );
      return {};
    }
    const validation: { [key: string]: any } = {};
    const computedStyle = getComputedStyle(root);

    requiredRgbVars.forEach((varName) => {
      const value = computedStyle.getPropertyValue(varName).trim();
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

  public resetColors(): void {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log("🔄 [StarryNight Debug] Resetting colors to defaults...");
    }
    if ((globalThis as any).year3000System?.resetToDefaults) {
      (globalThis as any).year3000System.resetToDefaults();
    } else {
      console.warn(
        "[StarryNight Debug] year3000System.resetToDefaults not available."
      );
    }
  }

  public extractColors(): void {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        "🎨 [StarryNight Debug] Extracting colors from current track..."
      );
    }
    if ((globalThis as any).year3000System?.updateColorsFromCurrentTrack) {
      (globalThis as any).year3000System.updateColorsFromCurrentTrack();
    } else {
      console.warn(
        "[StarryNight Debug] year3000System.updateColorsFromCurrentTrack not available."
      );
    }
  }

  public getReport(): any {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log("📊 [StarryNight Debug] Generating system report...");
    }
    if ((globalThis as any).year3000System?.getSystemReport) {
      return (globalThis as any).year3000System.getSystemReport();
    } else {
      console.warn(
        "[StarryNight Debug] year3000System.getSystemReport not available."
      );
      return { error: "getSystemReport not available" };
    }
  }

  public getCssVariable(varName: string): string | null {
    const rootElement = Year3000Utilities.getRootStyle();
    if (!rootElement) {
      console.warn(
        `[StarryNight Debug] Root element style not found for getCssVariable: ${varName}.`
      );
      return null;
    }
    const value = getComputedStyle(rootElement)
      .getPropertyValue(varName)
      .trim();
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(`[StarryNight Debug] CSS Variable ${varName}: '${value}'`);
    }
    return value;
  }

  // ===================================================================
  // 🧪 COMPREHENSIVE INTEGRATION TESTING
  // ===================================================================

  public async runFullIntegrationTest(): Promise<any> {
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
      console.log("📋 Step 1: Validating DOM structure...");
      this.testResults.domValidation = await this.validateDOMStructure();

      console.log("🎯 Step 2: Testing individual systems...");
      this.testResults.systemTests = await this.testAllVisualSystems();

      console.log("🔗 Step 3: Testing cross-system integration...");
      this.testResults.crossSystemTests =
        await this.testCrossSystemIntegration();

      console.log("⚡ Step 4: Performance testing...");
      this.testResults.performanceTests = await this.testSystemPerformance();

      console.log("📊 Step 5: Generating integration report...");
      const report = this.generateIntegrationReport();

      this.testResults.endTime = Date.now();
      this.testResults.duration =
        (this.testResults.endTime || 0) - (this.testResults.startTime || 0);

      console.log("✅ Integration test completed successfully!");
      console.groupEnd();

      return report;
    } catch (error: any) {
      this.testResults.errors!.push({
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

  private async validateDOMStructure(): Promise<any> {
    const domValidation = {
      modernSelectorsFound: 0,
      modernSelectorsMissing: 0,
      legacySelectorsStillPresent: 0,
      criticalElementsMissing: [] as any[],
      recommendations: [] as any[],
    };

    Object.entries(MODERN_SELECTORS).forEach(([key, selector]) => {
      if (elementExists(selector)) {
        domValidation.modernSelectorsFound++;
      } else {
        domValidation.modernSelectorsMissing++;
        if (
          GRAVITY_WELL_TARGETS.primary?.includes(selector) ||
          GRAVITY_WELL_TARGETS.secondary?.includes(selector)
        ) {
          domValidation.criticalElementsMissing.push({
            name: key,
            selector: selector,
            impact: "HIGH",
          });
        }
      }
    });

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

  private async testAllVisualSystems(): Promise<{ [key: string]: any }> {
    const systemTests: { [key: string]: any } = {};
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

  private async testIndividualSystem(systemName: string): Promise<any> {
    const systemTest = {
      name: systemName,
      status: "UNKNOWN",
      targetsFound: 0,
      targetsMissing: 0,
      selectors: [] as any[],
      errors: [] as any[],
    };

    try {
      const selectorTest = await this.testSystemSelectors(systemName);
      systemTest.targetsFound = selectorTest.found;
      systemTest.targetsMissing = selectorTest.missing;
      systemTest.selectors = selectorTest.details;

      if (systemTest.targetsMissing === 0) {
        systemTest.status = "HEALTHY";
      } else if (systemTest.targetsFound > systemTest.targetsMissing) {
        systemTest.status = "DEGRADED";
      } else {
        systemTest.status = "FAILING";
      }
    } catch (error: any) {
      systemTest.status = "ERROR";
      systemTest.errors.push({
        type: "TEST_ERROR",
        message: error.message,
      });
    }

    return systemTest;
  }

  private async testSystemSelectors(systemName: string): Promise<any> {
    const selectorTest = {
      found: 0,
      missing: 0,
      details: [] as any[],
    };

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

  private getExpectedSelectorsForSystem(
    systemName: string
  ): { name: string; selector: string; importance: string }[] {
    const commonSelectors = [
      {
        name: "Left Sidebar",
        selector: MODERN_SELECTORS.leftSidebar ?? "",
        importance: "HIGH",
      },
      {
        name: "Now Playing Bar",
        selector: MODERN_SELECTORS.nowPlayingBar ?? "",
        importance: "HIGH",
      },
      {
        name: "Track Rows",
        selector: ORBITAL_ELEMENTS.trackRows ?? "",
        importance: "MEDIUM",
      },
    ];

    const systemSpecificSelectors: {
      [key: string]: { name: string; selector: string; importance: string }[];
    } = {
      BehavioralPredictionEngine: [
        ...commonSelectors,
        {
          name: "Play Button",
          selector: MODERN_SELECTORS.playButton ?? "",
          importance: "HIGH",
        },
        {
          name: "Like Button",
          selector: MODERN_SELECTORS.likeButton ?? "",
          importance: "MEDIUM",
        },
      ],
      DimensionalNexusSystem: [
        {
          name: "Left Sidebar",
          selector: MODERN_SELECTORS.leftSidebar ?? "",
          importance: "CRITICAL",
        },
        {
          name: "Modal Container",
          selector: MODERN_SELECTORS.modal ?? "",
          importance: "MEDIUM",
        },
      ],
      DataGlyphSystem: [
        {
          name: "Nav Links",
          selector: ORBITAL_ELEMENTS.navLinks ?? "",
          importance: "HIGH",
        },
        {
          name: "Cards",
          selector: ORBITAL_ELEMENTS.cards ?? "",
          importance: "MEDIUM",
        },
      ],
    };

    return systemSpecificSelectors[systemName] || commonSelectors;
  }

  // === CROSS-SYSTEM INTEGRATION TESTING ===

  private async testCrossSystemIntegration(): Promise<any> {
    const crossSystemTests = {
      sharedElementConflicts: this.testSharedElementUsage(),
      performanceImpacts: [],
    };
    return crossSystemTests;
  }

  private testSharedElementUsage(): any[] {
    const conflicts: any[] = [];
    const criticalSelectors = [
      MODERN_SELECTORS.leftSidebar,
      MODERN_SELECTORS.nowPlayingBar,
      ORBITAL_ELEMENTS.trackRows,
    ];

    criticalSelectors.forEach((selector) => {
      if (!selector) return;
      const element = document.querySelector(selector);
      if (element) {
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

  private async testSystemPerformance(): Promise<any> {
    return {
      domQuerySpeed: await this.testDOMQueryPerformance(),
      memoryUsage: this.testMemoryUsage(),
    };
  }

  private async testDOMQueryPerformance(): Promise<any[]> {
    const tests: any[] = [];
    const selectors = Object.values(MODERN_SELECTORS);
    const iterations = 100;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      selectors.forEach((selector) => {
        if (selector) document.querySelectorAll(selector);
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

  private testMemoryUsage(): any[] {
    const memoryTests: any[] = [];
    const memory = (performance as any).memory;

    if (memory) {
      memoryTests.push({
        test: "JavaScript Heap Usage",
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (
          (memory.usedJSHeapSize / memory.totalJSHeapSize) *
          100
        ).toFixed(2),
        status:
          memory.usedJSHeapSize < memory.totalJSHeapSize * 0.8
            ? "GOOD"
            : "HIGH",
      });
    }

    return memoryTests;
  }

  // === REPORTING ===

  private generateIntegrationReport(): any {
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

  private generateSummary(): any {
    const domValidation = this.testResults.domValidation;
    const systemTests = this.testResults.systemTests;
    const healthySystems = Object.values(systemTests || {}).filter(
      (s: any) => s.status === "HEALTHY"
    ).length;
    const totalSystems = Object.keys(systemTests || {}).length;

    return {
      overallHealth: this.calculateOverallHealth(),
      modernSelectorsFound: domValidation?.modernSelectorsFound,
      modernSelectorsMissing: domValidation?.modernSelectorsMissing,
      systemsHealthy: healthySystems,
      systemsTotal: totalSystems,
      criticalIssues: domValidation?.criticalElementsMissing.length,
    };
  }

  private calculateOverallHealth(): number {
    const domValidation = this.testResults.domValidation;
    const systemTests = this.testResults.systemTests;

    let score = 100;
    if (domValidation) {
      score -= domValidation.modernSelectorsMissing * 5;
      score -= domValidation.criticalElementsMissing.length * 15;
    }
    if (systemTests) {
      const unhealthySystems = Object.values(systemTests).filter(
        (s: any) => s.status === "FAILING" || s.status === "ERROR"
      ).length;
      score -= unhealthySystems * 20;
    }

    return Math.max(0, score);
  }

  private generateRecommendations(): any[] {
    const recommendations: any[] = [];
    const domValidation = this.testResults.domValidation;
    const systemTests = this.testResults.systemTests;

    if (domValidation?.criticalElementsMissing.length > 0) {
      recommendations.push({
        priority: "HIGH",
        type: "CRITICAL_ELEMENTS",
        message: `${domValidation.criticalElementsMissing.length} critical elements are missing`,
        action: "Update Spotify or check for UI changes",
      });
    }

    if (systemTests) {
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
    }

    return recommendations;
  }

  private logFormattedReport(report: any): void {
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
      report.recommendations.forEach((rec: any) => {
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

export const Year3000Debug = {
  testGradients: (): any => new SystemIntegrationTester().testGradients(),
  logCurrentVariables: (): any =>
    new SystemIntegrationTester().logCurrentVariables(),
  testHexToRgb: (hex: string): any =>
    new SystemIntegrationTester().testHexToRgb(hex),
  validateRgbVariables: (): any =>
    new SystemIntegrationTester().validateRgbVariables(),
  resetColors: (): void => new SystemIntegrationTester().resetColors(),
  extractColors: (): void => new SystemIntegrationTester().extractColors(),
  getReport: (): any => new SystemIntegrationTester().getReport(),
  getCssVariable: (varName: string): any =>
    new SystemIntegrationTester().getCssVariable(varName),
  runFullIntegrationTest: (): Promise<any> =>
    new SystemIntegrationTester().runFullIntegrationTest(),
  getInstance: (): SystemIntegrationTester => new SystemIntegrationTester(),
};

if (typeof window !== "undefined") {
  window.SystemIntegrationTester = new SystemIntegrationTester();
  window.Year3000Debug = Year3000Debug;
  window.runIntegrationTest = () =>
    window.SystemIntegrationTester.runFullIntegrationTest();
}
