/**
 * WhiteLayerDiagnosticSystem - White Layer Interference Diagnostic & Fix System
 * Part of the Year 3000 System performance pipeline
 *
 * Diagnoses and fixes white layer interference issues:
 * - Chromatic aberration white texture issues
 * - Mix blend mode screen effects causing white bleeding
 * - WebGL context failure white renders
 * - Z-index conflicts and layering issues
 */

import { getGlobalUnifiedCSSManager, UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";

interface WhiteLayerDiagnostics {
  aberrationSystem: boolean;
  screenBlendModes: boolean;
  webglContextFailures: boolean;
  zIndexConflicts: boolean;
  backDropFilterIssues: boolean;
  whiteTextureIssues: boolean;
}

interface DiagnosticResult {
  system: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  fix: string;
  implemented: boolean;
}

/**
 * WhiteLayerDiagnosticSystem diagnoses and fixes white layer interference
 * - Identifies sources of white layer bleeding
 * - Provides targeted fixes for each issue
 * - Monitors for white layer interference patterns
 * - Implements prevention strategies
 */
export class WhiteLayerDiagnosticSystem {
  private cssController: UnifiedCSSVariableManager | null;
  private diagnostics: WhiteLayerDiagnostics;
  private diagnosticResults: DiagnosticResult[];
  private monitoringInterval: number | null = null;
  private lastDiagnosticCheck = 0;

  constructor() {
    // Initialize CSS Consciousness Controller if available
    const cssController = getGlobalUnifiedCSSManager();
    if (cssController) {
      this.cssController = cssController;
    } else {
      Y3KDebug?.debug?.warn(
        "WhiteLayerDiagnosticSystem",
        "UnifiedCSSVariableManager not available, CSS visual-effects disabled"
      );
      this.cssController = null;
    }

    // Initialize diagnostics
    this.diagnostics = {
      aberrationSystem: false,
      screenBlendModes: false,
      webglContextFailures: false,
      zIndexConflicts: false,
      backDropFilterIssues: false,
      whiteTextureIssues: false,
    };

    this.diagnosticResults = [];

    // Start monitoring
    this.startDiagnosticMonitoring();

    Y3KDebug?.debug?.log(
      "WhiteLayerDiagnosticSystem",
      "White layer diagnostic system initialized"
    );
  }

  private startDiagnosticMonitoring(): void {
    // Monitor for white layer issues every 5 seconds
    this.monitoringInterval = window.setInterval(() => {
      this.runDiagnostics();
    }, 5000);
  }

  private runDiagnostics(): void {
    const currentTime = performance.now();

    // Don't run diagnostics too frequently
    if (currentTime - this.lastDiagnosticCheck < 5000) return;
    this.lastDiagnosticCheck = currentTime;

    // Clear previous results
    this.diagnosticResults = [];

    // Run all diagnostic checks
    this.checkAberrationSystem();
    this.checkScreenBlendModes();
    this.checkWebGLContextFailures();
    this.checkZIndexConflicts();
    this.checkBackdropFilterIssues();
    this.checkWhiteTextureIssues();

    // Apply fixes for critical issues
    this.applyAutomaticFixes();

    // Update diagnostic status
    this.updateDiagnosticStatus();
  }

  private checkAberrationSystem(): void {
    // Check if aberration system is creating white layers
    const aberrationCanvas = document.querySelector(
      'canvas[style*="mix-blend-mode: screen"]'
    );

    if (aberrationCanvas) {
      this.diagnostics.aberrationSystem = true;
      this.diagnosticResults.push({
        system: "AberrationCanvas",
        issue: "White pixel texture with screen blend mode",
        severity: "critical",
        description:
          "Chromatic aberration creates white pixel texture and uses screen blend mode, causing white layer interference",
        fix: "Replace white texture with transparent, change blend mode to overlay",
        implemented: false,
      });
    }
  }

  private checkScreenBlendModes(): void {
    // Check for multiple screen blend modes that can cause white bleeding
    const screenBlendElements = document.querySelectorAll(
      '[style*="mix-blend-mode: screen"]'
    );

    if (screenBlendElements.length > 1) {
      this.diagnostics.screenBlendModes = true;
      this.diagnosticResults.push({
        system: "MultipleScreenBlends",
        issue: "Multiple screen blend modes causing white bleeding",
        severity: "high",
        description: `Found ${screenBlendElements.length} elements using screen blend mode, causing additive white bleeding`,
        fix: "Replace screen blend modes with overlay or multiply",
        implemented: false,
      });
    }
  }

  private checkWebGLContextFailures(): void {
    // Check for WebGL context failures that might render white
    const webglCanvases = document.querySelectorAll("canvas");
    let failedContexts = 0;

    webglCanvases.forEach((canvas) => {
      const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
      if (!gl || gl.isContextLost()) {
        failedContexts++;
      }
    });

    if (failedContexts > 0) {
      this.diagnostics.webglContextFailures = true;
      this.diagnosticResults.push({
        system: "WebGLContexts",
        issue: "WebGL context failures causing white renders",
        severity: "high",
        description: `${failedContexts} WebGL contexts failed or lost, potentially causing white renders`,
        fix: "Implement proper WebGL error handling and fallbacks",
        implemented: false,
      });
    }
  }

  private checkZIndexConflicts(): void {
    // Check for z-index conflicts that might show white layers
    const highZIndexElements = document.querySelectorAll('[style*="z-index"]');
    const zIndexValues: number[] = [];

    highZIndexElements.forEach((element) => {
      const style = window.getComputedStyle(element);
      const zIndex = parseInt(style.zIndex);
      if (!isNaN(zIndex) && zIndex > 0) {
        zIndexValues.push(zIndex);
      }
    });

    // Check for conflicting z-index values
    const sortedZIndex = zIndexValues.sort((a, b) => a - b);
    const hasConflicts = sortedZIndex.some(
      (val, idx) => idx > 0 && val === sortedZIndex[idx - 1]
    );

    if (hasConflicts) {
      this.diagnostics.zIndexConflicts = true;
      this.diagnosticResults.push({
        system: "ZIndexConflicts",
        issue: "Z-index conflicts causing layer interference",
        severity: "medium",
        description:
          "Multiple elements have conflicting z-index values, causing white layer interference",
        fix: "Reorganize z-index hierarchy to prevent conflicts",
        implemented: false,
      });
    }
  }

  private checkBackdropFilterIssues(): void {
    // Check for backdrop-filter elements that might cause white bleeding
    const backdropElements = document.querySelectorAll(
      '[style*="backdrop-filter"]'
    );

    if (backdropElements.length > 0) {
      // Check if backdrop-filter is supported
      const testElement = document.createElement("div");
      testElement.style.backdropFilter = "blur(1px)";

      if (!testElement.style.backdropFilter) {
        this.diagnostics.backDropFilterIssues = true;
        this.diagnosticResults.push({
          system: "BackdropFilter",
          issue: "Unsupported backdrop-filter causing white fallbacks",
          severity: "medium",
          description:
            "Backdrop-filter not supported, causing white fallback renders",
          fix: "Implement backdrop-filter fallbacks with proper transparency",
          implemented: false,
        });
      }
    }
  }

  private checkWhiteTextureIssues(): void {
    // Check for elements with white backgrounds that might interfere
    const whiteBackgrounds = document.querySelectorAll(
      '[style*="background: white"], [style*="background-color: white"], [style*="background-color: #fff"]'
    );

    if (whiteBackgrounds.length > 0) {
      this.diagnostics.whiteTextureIssues = true;
      this.diagnosticResults.push({
        system: "WhiteBackgrounds",
        issue: "White background elements interfering with gradients",
        severity: "low",
        description: `Found ${whiteBackgrounds.length} elements with white backgrounds that might interfere with gradients`,
        fix: "Replace white backgrounds with transparent or themed colors",
        implemented: false,
      });
    }
  }

  private applyAutomaticFixes(): void {
    // Apply automatic fixes for critical issues
    this.diagnosticResults.forEach((result) => {
      if (result.severity === "critical" && !result.implemented) {
        switch (result.system) {
          case "AberrationCanvas":
            this.fixAberrationSystem();
            result.implemented = true;
            break;

          case "MultipleScreenBlends":
            this.fixScreenBlendModes();
            result.implemented = true;
            break;
        }
      }
    });
  }

  private fixAberrationSystem(): void {
    // Fix aberration system white texture issue
    const aberrationCanvas = document.querySelector(
      'canvas[style*="mix-blend-mode: screen"]'
    ) as HTMLCanvasElement;

    if (aberrationCanvas) {
      // Change blend mode from screen to overlay
      aberrationCanvas.style.mixBlendMode = "overlay";

      // Try to get the WebGL context and replace white texture
      const gl =
        aberrationCanvas.getContext("webgl") ||
        aberrationCanvas.getContext("webgl2");
      if (gl) {
        // Create transparent texture instead of white
        const transparentPixel = new Uint8Array([0, 0, 0, 0]); // Transparent black
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          1,
          1,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          transparentPixel
        );
      }

      Y3KDebug?.debug?.log(
        "WhiteLayerDiagnosticSystem",
        "Fixed aberration system white texture issue"
      );
    }
  }

  private fixScreenBlendModes(): void {
    // Fix multiple screen blend modes causing white bleeding
    const screenBlendElements = document.querySelectorAll(
      '[style*="mix-blend-mode: screen"]'
    );

    screenBlendElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;

      // Keep first screen blend mode, change others to overlay
      if (index > 0) {
        htmlElement.style.mixBlendMode = "overlay";
      } else {
        // Reduce opacity of primary screen blend mode
        htmlElement.style.opacity = "0.6";
      }
    });

    Y3KDebug?.debug?.log(
      "WhiteLayerDiagnosticSystem",
      "Fixed multiple screen blend modes"
    );
  }

  private updateDiagnosticStatus(): void {
    // Update CSS variables for diagnostic status
    const criticalIssues = this.diagnosticResults.filter(
      (r) => r.severity === "critical"
    ).length;
    const highIssues = this.diagnosticResults.filter(
      (r) => r.severity === "high"
    ).length;
    const totalIssues = this.diagnosticResults.length;

    // Update CSS variables (if controller is available)
    if (this.cssController) {
      this.cssController.queueCSSVariableUpdate(
        "--sn-white-layer-critical-issues",
        criticalIssues.toString()
      );

      this.cssController.queueCSSVariableUpdate(
        "--sn-white-layer-high-issues",
        highIssues.toString()
      );

      this.cssController.queueCSSVariableUpdate(
        "--sn-white-layer-total-issues",
        totalIssues.toString()
      );

      this.cssController.queueCSSVariableUpdate(
        "--sn-white-layer-status",
        criticalIssues > 0 ? "critical" : highIssues > 0 ? "warning" : "ok"
      );
    }
  }

  // Public API
  public getDiagnostics(): WhiteLayerDiagnostics {
    return { ...this.diagnostics };
  }

  public getDiagnosticResults(): DiagnosticResult[] {
    return [...this.diagnosticResults];
  }

  public forceFixAberrationSystem(): void {
    this.fixAberrationSystem();
  }

  public forceFixScreenBlendModes(): void {
    this.fixScreenBlendModes();
  }

  public disableAberrationSystem(): void {
    // Disable aberration system entirely
    const aberrationCanvas = document.querySelector(
      'canvas[style*="mix-blend-mode"]'
    ) as HTMLCanvasElement;

    if (aberrationCanvas) {
      aberrationCanvas.style.display = "none";
      Y3KDebug?.debug?.log(
        "WhiteLayerDiagnosticSystem",
        "Disabled aberration system"
      );
    }
  }

  public enableAberrationSystem(): void {
    // Re-enable aberration system with fixes
    const aberrationCanvas = document.querySelector(
      'canvas[style*="mix-blend-mode"]'
    ) as HTMLCanvasElement;

    if (aberrationCanvas) {
      aberrationCanvas.style.display = "block";
      aberrationCanvas.style.mixBlendMode = "overlay"; // Use safer blend mode
      aberrationCanvas.style.opacity = "0.6"; // Reduce intensity
      Y3KDebug?.debug?.log(
        "WhiteLayerDiagnosticSystem",
        "Enabled aberration system with fixes"
      );
    }
  }

  public runFullDiagnostic(): DiagnosticResult[] {
    this.runDiagnostics();
    return this.getDiagnosticResults();
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    Y3KDebug?.debug?.log(
      "WhiteLayerDiagnosticSystem",
      "White layer diagnostic system destroyed"
    );
  }
}
