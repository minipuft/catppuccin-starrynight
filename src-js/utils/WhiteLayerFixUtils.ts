/**
 * WhiteLayerFixUtils - Utility functions for fixing white layer interference
 * Part of the Year 3000 System diagnostic pipeline
 *
 * Provides quick fixes for white layer issues:
 * - Disable chromatic aberration system
 * - Fix screen blend modes
 * - Reset WebGL contexts
 * - Apply emergency white layer suppression
 */

import { Y3KDebug } from "@/debug/UnifiedDebugManager";

export class WhiteLayerFixUtils {
  /**
   * Immediately disable the chromatic aberration system
   */
  static disableAberrationSystem(): void {
    const aberrationCanvas = document.querySelector(
      'canvas[style*="mix-blend-mode"]'
    ) as HTMLCanvasElement;

    if (aberrationCanvas) {
      aberrationCanvas.style.display = "none";
      Y3KDebug?.debug?.log(
        "WhiteLayerFixUtils",
        "Disabled chromatic aberration system"
      );
    }
  }

  /**
   * Enable the chromatic aberration system with safer settings
   */
  static enableAberrationSystemSafe(): void {
    const aberrationCanvas = document.querySelector(
      'canvas[style*="mix-blend-mode"]'
    ) as HTMLCanvasElement;

    if (aberrationCanvas) {
      aberrationCanvas.style.display = "block";
      aberrationCanvas.style.mixBlendMode = "overlay";
      aberrationCanvas.style.opacity = "0.4";
      Y3KDebug?.debug?.log(
        "WhiteLayerFixUtils",
        "Enabled chromatic aberration system with safe settings"
      );
    }
  }

  /**
   * Fix all screen blend modes to use safer alternatives
   */
  static fixScreenBlendModes(): void {
    const screenBlendElements = document.querySelectorAll(
      '[style*="mix-blend-mode: screen"]'
    );

    screenBlendElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;

      // Keep first screen blend mode but reduce opacity, change others to overlay
      if (index === 0) {
        htmlElement.style.opacity = "0.5";
      } else {
        htmlElement.style.mixBlendMode = "overlay";
        htmlElement.style.opacity = "0.7";
      }
    });

    Y3KDebug?.debug?.log(
      "WhiteLayerFixUtils",
      `Fixed ${screenBlendElements.length} screen blend modes`
    );
  }

  /**
   * Reset all WebGL contexts to prevent white renders
   */
  static resetWebGLContexts(): void {
    const webglCanvases = document.querySelectorAll("canvas");
    let resetCount = 0;

    webglCanvases.forEach((canvas) => {
      const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
      if (gl) {
        // Set clear color to transparent
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        resetCount++;
      }
    });

    Y3KDebug?.debug?.log(
      "WhiteLayerFixUtils",
      `Reset ${resetCount} WebGL contexts`
    );
  }

  /**
   * Apply emergency white layer suppression
   */
  static applyEmergencyWhiteLayerFix(): void {
    document.body.classList.add("sn-white-layer-emergency");

    // Hide elements with white backgrounds
    const whiteElements = document.querySelectorAll(
      '[style*="background: white"], [style*="background-color: white"], [style*="background-color: #fff"]'
    );

    whiteElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.background = "transparent";
      htmlElement.style.backgroundColor = "transparent";
    });

    Y3KDebug?.debug?.log(
      "WhiteLayerFixUtils",
      "Applied emergency white layer suppression"
    );
  }

  /**
   * Remove emergency white layer suppression
   */
  static removeEmergencyWhiteLayerFix(): void {
    document.body.classList.remove("sn-white-layer-emergency");
    Y3KDebug?.debug?.log(
      "WhiteLayerFixUtils",
      "Removed emergency white layer suppression"
    );
  }

  /**
   * Quick fix for all known white layer issues
   */
  static quickFixAllWhiteLayerIssues(): void {
    // Fix chromatic aberration
    this.enableAberrationSystemSafe();

    // Fix screen blend modes
    this.fixScreenBlendModes();

    // Reset WebGL contexts
    this.resetWebGLContexts();

    // Apply z-index fixes
    this.applyZIndexFixes();

    Y3KDebug?.debug?.log("WhiteLayerFixUtils", "Applied all white layer fixes");
  }

  /**
   * Apply z-index fixes to ensure proper layering
   */
  static applyZIndexFixes(): void {
    // Ensure gradient layers have proper z-index
    const gradientElements = document.querySelectorAll(
      ".sn-webgl-gradient, .sn-css-gradient"
    );
    gradientElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.zIndex = "-10";
    });

    // Fix depth background container
    const depthContainer = document.querySelector(
      ".sn-depth-background-container"
    ) as HTMLElement;
    if (depthContainer) {
      depthContainer.style.zIndex = "-20";
    }

    // Fix aberration canvas z-index
    const aberrationCanvas = document.querySelector(
      'canvas[style*="mix-blend-mode"]'
    ) as HTMLCanvasElement;
    if (aberrationCanvas) {
      aberrationCanvas.style.zIndex = "-5";
    }

    Y3KDebug?.debug?.log("WhiteLayerFixUtils", "Applied z-index fixes");
  }

  /**
   * Diagnostic function to check for white layer issues
   */
  static diagnoseWhiteLayerIssues(): {
    aberrationSystem: boolean;
    screenBlendModes: boolean;
    webglContextFailures: boolean;
    whiteBackgrounds: boolean;
    zIndexConflicts: boolean;
  } {
    const aberrationCanvas = document.querySelector(
      'canvas[style*="mix-blend-mode: screen"]'
    );
    const screenBlendElements = document.querySelectorAll(
      '[style*="mix-blend-mode: screen"]'
    );
    const whiteBackgrounds = document.querySelectorAll(
      '[style*="background: white"], [style*="background-color: white"]'
    );

    let webglFailures = 0;
    const webglCanvases = document.querySelectorAll("canvas");
    webglCanvases.forEach((canvas) => {
      const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
      if (!gl || gl.isContextLost()) {
        webglFailures++;
      }
    });

    const diagnosis = {
      aberrationSystem: !!aberrationCanvas,
      screenBlendModes: screenBlendElements.length > 1,
      webglContextFailures: webglFailures > 0,
      whiteBackgrounds: whiteBackgrounds.length > 0,
      zIndexConflicts: false, // TODO: Implement z-index conflict detection
    };

    Y3KDebug?.debug?.log(
      "WhiteLayerFixUtils",
      "White layer diagnosis:",
      diagnosis
    );

    return diagnosis;
  }

  /**
   * Monitor for white layer issues and auto-fix if needed
   */
  static startWhiteLayerMonitoring(): void {
    const monitor = () => {
      const diagnosis = this.diagnoseWhiteLayerIssues();

      // Auto-fix critical issues
      if (diagnosis.aberrationSystem && diagnosis.screenBlendModes) {
        this.fixScreenBlendModes();
      }

      if (diagnosis.webglContextFailures) {
        this.resetWebGLContexts();
      }

      // Check again in 10 seconds
      setTimeout(monitor, 10000);
    };

    monitor();
    Y3KDebug?.debug?.log(
      "WhiteLayerFixUtils",
      "Started white layer monitoring"
    );
  }
}

// Export convenience functions
export const disableAberration = WhiteLayerFixUtils.disableAberrationSystem;
export const enableAberrationSafe =
  WhiteLayerFixUtils.enableAberrationSystemSafe;
export const fixScreenBlends = WhiteLayerFixUtils.fixScreenBlendModes;
export const resetWebGL = WhiteLayerFixUtils.resetWebGLContexts;
export const emergencyWhiteFix = WhiteLayerFixUtils.applyEmergencyWhiteLayerFix;
export const quickFixAll = WhiteLayerFixUtils.quickFixAllWhiteLayerIssues;
export const diagnoseWhiteLayers = WhiteLayerFixUtils.diagnoseWhiteLayerIssues;
export const startWhiteLayerMonitoring =
  WhiteLayerFixUtils.startWhiteLayerMonitoring;
