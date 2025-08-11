/**
 * WebGLDebugCore - Essential WebGL debugging for Year 3000 visual systems
 *
 * Streamlined version of WebGLDebugReporter focusing only on essential
 * WebGL capability detection and error reporting. Integrates with
 * UnifiedDebugManager for consistent debug output.
 *
 * @architecture Simplified from 539 lines to ~150 lines
 * @integration UnifiedDebugManager integration
 * @performance Minimal overhead, on-demand testing only
 */

import { Y3KDebug } from "./UnifiedDebugManager";

export interface WebGLCapabilities {
  webgl2: boolean;
  webgl1: boolean;
  extensions: string[];
  maxTextureSize: number;
  vendor: string;
  renderer: string;
  version: string;
}

export interface WebGLTestResult {
  capabilities: WebGLCapabilities;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  isSpicetifyEnvironment: boolean;
}

export class WebGLDebugCore {
  private static instance: WebGLDebugCore;
  private isSpicetifyEnvironment = false;
  private lastTestResult: WebGLTestResult | null = null;

  private constructor() {
    this.detectSpicetifyEnvironment();
    Y3KDebug.debug.register("WebGLDebugCore", this, "performance");
  }

  public static getInstance(): WebGLDebugCore {
    if (!WebGLDebugCore.instance) {
      WebGLDebugCore.instance = new WebGLDebugCore();
    }
    return WebGLDebugCore.instance;
  }

  private detectSpicetifyEnvironment(): void {
    this.isSpicetifyEnvironment = !!(
      window.Spicetify ||
      document.querySelector(".Root__main-view") ||
      document.querySelector('[data-testid="topbar"]') ||
      navigator.userAgent.includes("Spotify")
    );

    Y3KDebug.debug.log(
      "WebGLDebugCore",
      `Environment: ${this.isSpicetifyEnvironment ? "Spicetify" : "Browser"}`
    );
  }

  /**
   * Test WebGL capabilities and compatibility
   */
  public async testWebGLCapabilities(): Promise<WebGLTestResult> {
    Y3KDebug.debug.log("WebGLDebugCore", "Testing WebGL capabilities...");

    const result: WebGLTestResult = {
      capabilities: {
        webgl2: false,
        webgl1: false,
        extensions: [],
        maxTextureSize: 0,
        vendor: "",
        renderer: "",
        version: "",
      },
      errors: [],
      warnings: [],
      recommendations: [],
      isSpicetifyEnvironment: this.isSpicetifyEnvironment,
    };

    let canvas: HTMLCanvasElement | null = null;

    try {
      // Test canvas creation
      canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
    } catch (error) {
      result.errors.push(`Canvas creation failed: ${error}`);
      return result;
    }

    // Test WebGL2
    try {
      const gl2 = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "default",
      });

      if (gl2) {
        result.capabilities.webgl2 = true;
        result.capabilities.extensions = gl2.getSupportedExtensions() || [];
        result.capabilities.maxTextureSize = gl2.getParameter(
          gl2.MAX_TEXTURE_SIZE
        );
        result.capabilities.vendor = gl2.getParameter(gl2.VENDOR);
        result.capabilities.renderer = gl2.getParameter(gl2.RENDERER);
        result.capabilities.version = gl2.getParameter(gl2.VERSION);

        Y3KDebug.debug.log("WebGLDebugCore", "WebGL2 available", {
          vendor: result.capabilities.vendor,
          renderer: result.capabilities.renderer,
          maxTextureSize: result.capabilities.maxTextureSize,
        });
      }
    } catch (error) {
      result.warnings.push(`WebGL2 test failed: ${error}`);
    }

    // Test WebGL1 as fallback
    if (!result.capabilities.webgl2) {
      try {
        const gl1 = (canvas.getContext("webgl") ||
          canvas.getContext(
            "experimental-webgl"
          )) as WebGLRenderingContext | null;

        if (gl1) {
          result.capabilities.webgl1 = true;
          result.capabilities.extensions = gl1.getSupportedExtensions() || [];
          result.capabilities.maxTextureSize = gl1.getParameter(
            gl1.MAX_TEXTURE_SIZE
          );
          result.capabilities.vendor = gl1.getParameter(gl1.VENDOR);
          result.capabilities.renderer = gl1.getParameter(gl1.RENDERER);
          result.capabilities.version = gl1.getParameter(gl1.VERSION);

          Y3KDebug.debug.log("WebGLDebugCore", "WebGL1 available", {
            vendor: result.capabilities.vendor,
            renderer: result.capabilities.renderer,
          });
        } else {
          result.errors.push("Neither WebGL2 nor WebGL1 is available");
        }
      } catch (error) {
        result.errors.push(`WebGL1 test failed: ${error}`);
      }
    }

    // Test essential extensions
    const essentialExtensions = [
      "OES_standard_derivatives",
      "OES_element_index_uint",
    ];

    essentialExtensions.forEach((ext) => {
      if (!result.capabilities.extensions.includes(ext)) {
        result.warnings.push(`Missing recommended extension: ${ext}`);
      }
    });

    // Generate recommendations
    this.generateRecommendations(result);

    // Clean up
    canvas.remove();

    this.lastTestResult = result;
    return result;
  }

  private generateRecommendations(result: WebGLTestResult): void {
    if (!result.capabilities.webgl2 && !result.capabilities.webgl1) {
      result.recommendations.push(
        "WebGL not supported - visual effects will be disabled"
      );
      return;
    }

    if (!result.capabilities.webgl2) {
      result.recommendations.push(
        "WebGL2 not available - using WebGL1 fallback"
      );
    }

    if (result.capabilities.maxTextureSize < 2048) {
      result.recommendations.push(
        "Low texture size limit - visual quality may be reduced"
      );
    }

    if (result.warnings.length > 0) {
      result.recommendations.push(
        "Some WebGL features missing - check graphics drivers"
      );
    }

    if (result.capabilities.vendor.includes("Software")) {
      result.recommendations.push(
        "Software rendering detected - enable hardware acceleration"
      );
    }
  }

  /**
   * Quick WebGL availability check
   */
  public isWebGLAvailable(): boolean {
    if (this.lastTestResult) {
      return (
        this.lastTestResult.capabilities.webgl2 ||
        this.lastTestResult.capabilities.webgl1
      );
    }

    // Quick test without full capability detection
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    canvas.remove();
    return !!gl;
  }

  /**
   * Get the last test result
   */
  public getLastTestResult(): WebGLTestResult | null {
    return this.lastTestResult;
  }

  /**
   * Log WebGL capabilities to console
   */
  public logCapabilities(): void {
    if (!this.lastTestResult) {
      Y3KDebug.debug.warn(
        "WebGLDebugCore",
        "No test results available - run testWebGLCapabilities() first"
      );
      return;
    }

    const result = this.lastTestResult;

    console.group("🎨 WebGL Capabilities Report");

    console.log(
      `Environment: ${result.isSpicetifyEnvironment ? "Spicetify" : "Browser"}`
    );
    console.log(`WebGL2: ${result.capabilities.webgl2 ? "✅" : "❌"}`);
    console.log(`WebGL1: ${result.capabilities.webgl1 ? "✅" : "❌"}`);

    if (result.capabilities.webgl2 || result.capabilities.webgl1) {
      console.log(`Vendor: ${result.capabilities.vendor}`);
      console.log(`Renderer: ${result.capabilities.renderer}`);
      console.log(`Version: ${result.capabilities.version}`);
      console.log(`Max Texture Size: ${result.capabilities.maxTextureSize}`);
      console.log(
        `Extensions: ${result.capabilities.extensions.length} available`
      );
    }

    if (result.errors.length > 0) {
      console.group("❌ Errors");
      result.errors.forEach((error) => console.error(error));
      console.groupEnd();
    }

    if (result.warnings.length > 0) {
      console.group("⚠️ Warnings");
      result.warnings.forEach((warning) => console.warn(warning));
      console.groupEnd();
    }

    if (result.recommendations.length > 0) {
      console.group("💡 Recommendations");
      result.recommendations.forEach((rec) => console.log(rec));
      console.groupEnd();
    }

    console.groupEnd();
  }

  /**
   * Report WebGL error to unified debug system
   */
  public reportError(error: string, details?: any): void {
    Y3KDebug.debug.error("WebGLDebugCore", error, details);
  }

  /**
   * Destroy the debug core
   */
  public destroy(): void {
    Y3KDebug.debug.unregister("WebGLDebugCore");
    WebGLDebugCore.instance = null as any;
  }
}

// =========================================================================
// GLOBAL EXPORTS
// =========================================================================

// Make WebGL debug core available globally
if (typeof window !== "undefined") {
  (window as any).WebGLDebugCore = WebGLDebugCore;

  // Add convenient global function
  (window as any).testWebGL = () => {
    const core = WebGLDebugCore.getInstance();
    core.testWebGLCapabilities().then(() => core.logCapabilities());
  };
}

export default WebGLDebugCore;
