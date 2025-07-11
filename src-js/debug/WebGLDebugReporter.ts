/**
 * WebGL Debug Reporter
 * Comprehensive debugging system for WebGL initialization in Spicetify environment
 */

import { Y3K } from "./SystemHealthMonitor";

export interface WebGLCapabilities {
  webgl2: boolean;
  webgl1: boolean;
  extensions: string[];
  maxTextureSize: number;
  maxRenderbufferSize: number;
  vendor: string;
  renderer: string;
  version: string;
  contextAttributes: WebGLContextAttributes | null;
}

export interface WebGLDebugStep {
  step: string;
  success: boolean;
  error?: string | undefined;
  details?: any;
  timestamp: number;
}

export enum WebGLErrorType {
  CONTEXT_CREATION_FAILED = "CONTEXT_CREATION_FAILED",
  SHADER_COMPILATION_FAILED = "SHADER_COMPILATION_FAILED",
  DOM_SELECTOR_MISSING = "DOM_SELECTOR_MISSING",
  PERFORMANCE_THRESHOLD_EXCEEDED = "PERFORMANCE_THRESHOLD_EXCEEDED",
  SPICETIFY_ENVIRONMENT_ISSUE = "SPICETIFY_ENVIRONMENT_ISSUE",
  CANVAS_CREATION_FAILED = "CANVAS_CREATION_FAILED",
  TEXTURE_CREATION_FAILED = "TEXTURE_CREATION_FAILED",
  PROGRAM_LINKING_FAILED = "PROGRAM_LINKING_FAILED",
}

export class WebGLDebugReporter {
  private static instance: WebGLDebugReporter;
  private debugSteps: WebGLDebugStep[] = [];
  private capabilities: WebGLCapabilities | null = null;
  private isSpicetifyEnvironment = false;
  private debugPanel: HTMLElement | null = null;

  private constructor() {
    this.detectSpicetifyEnvironment();
    this.createDebugPanel();
  }

  public static getInstance(): WebGLDebugReporter {
    if (!WebGLDebugReporter.instance) {
      WebGLDebugReporter.instance = new WebGLDebugReporter();
    }
    return WebGLDebugReporter.instance;
  }

  private detectSpicetifyEnvironment(): void {
    // Check for Spicetify-specific markers
    this.isSpicetifyEnvironment = !!(
      window.Spicetify ||
      document.querySelector(".Root__main-view") ||
      document.querySelector('[data-testid="topbar"]') ||
      navigator.userAgent.includes("Spotify")
    );

    this.logStep("Environment Detection", true, undefined, {
      isSpicetify: this.isSpicetifyEnvironment,
      userAgent: navigator.userAgent,
      hasSpicetifyGlobal: !!window.Spicetify,
      hasSpotifyDOM: !!document.querySelector(".Root__main-view"),
    });
  }

  private createDebugPanel(): void {
    // Only create debug panel if debug mode is enabled
    if (
      typeof window !== "undefined" &&
      (window as any).YEAR3000_CONFIG?.enableDebug
    ) {
      this.debugPanel = document.createElement("div");
      this.debugPanel.id = "webgl-debug-panel";
      this.debugPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        max-height: 400px;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 11px;
        z-index: 9999;
        overflow-y: auto;
        display: none;
        border: 1px solid #444;
      `;

      const header = document.createElement("div");
      header.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px; color: #4CAF50;">
          WebGL Debug Report
        </div>
        <div style="font-size: 10px; color: #888; margin-bottom: 10px;">
          Spicetify Environment: ${this.isSpicetifyEnvironment ? "YES" : "NO"}
        </div>
      `;

      this.debugPanel.appendChild(header);

      // Add keyboard shortcut to toggle panel
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "W") {
          this.toggleDebugPanel();
        }
      });

      document.body.appendChild(this.debugPanel);
    }
  }

  public logStep(
    step: string,
    success: boolean,
    error?: string,
    details?: any
  ): void {
    const debugStep: WebGLDebugStep = {
      step,
      success,
      error,
      details,
      timestamp: Date.now(),
    };

    this.debugSteps.push(debugStep);

    // Log to console
    const logLevel = success ? "info" : "error";
    const message = `[WebGL Debug] ${step}: ${success ? "SUCCESS" : "FAILED"}`;

    if (Y3K?.debug) {
      if (success) {
        Y3K.debug.log("WebGLDebugReporter", message, { error, details });
      } else {
        Y3K.debug.error("WebGLDebugReporter", message, { error, details });
      }
    } else {
      console[logLevel](message, { error, details });
    }

    // Update debug panel
    this.updateDebugPanel();
  }

  public async testWebGLCapabilities(): Promise<WebGLCapabilities> {
    this.logStep("Starting WebGL Capability Test", true);

    const capabilities: WebGLCapabilities = {
      webgl2: false,
      webgl1: false,
      extensions: [],
      maxTextureSize: 0,
      maxRenderbufferSize: 0,
      vendor: "",
      renderer: "",
      version: "",
      contextAttributes: null,
    };

    // Test canvas creation
    let canvas: HTMLCanvasElement | null = null;
    try {
      canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      this.logStep("Canvas Creation", true);
    } catch (error) {
      this.logStep(
        "Canvas Creation",
        false,
        error instanceof Error ? error.message : "Unknown error"
      );
      return capabilities;
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
        capabilities.webgl2 = true;
        capabilities.extensions = gl2.getSupportedExtensions() || [];
        capabilities.maxTextureSize = gl2.getParameter(gl2.MAX_TEXTURE_SIZE);
        capabilities.maxRenderbufferSize = gl2.getParameter(
          gl2.MAX_RENDERBUFFER_SIZE
        );
        capabilities.vendor = gl2.getParameter(gl2.VENDOR);
        capabilities.renderer = gl2.getParameter(gl2.RENDERER);
        capabilities.version = gl2.getParameter(gl2.VERSION);
        capabilities.contextAttributes = gl2.getContextAttributes();

        this.logStep("WebGL2 Context Creation", true, undefined, {
          vendor: capabilities.vendor,
          renderer: capabilities.renderer,
          version: capabilities.version,
          maxTextureSize: capabilities.maxTextureSize,
          extensionCount: capabilities.extensions.length,
        });
      } else {
        this.logStep("WebGL2 Context Creation", false, "Context is null");
      }
    } catch (error) {
      this.logStep(
        "WebGL2 Context Creation",
        false,
        error instanceof Error ? error.message : "Unknown error"
      );
    }

    // Test WebGL1 as fallback
    if (!capabilities.webgl2) {
      try {
        const gl1 = (canvas.getContext("webgl") ||
          canvas.getContext(
            "experimental-webgl"
          )) as WebGLRenderingContext | null;
        if (gl1) {
          capabilities.webgl1 = true;
          capabilities.extensions = gl1.getSupportedExtensions() || [];
          capabilities.maxTextureSize = gl1.getParameter(gl1.MAX_TEXTURE_SIZE);
          capabilities.maxRenderbufferSize = gl1.getParameter(
            gl1.MAX_RENDERBUFFER_SIZE
          );
          capabilities.vendor = gl1.getParameter(gl1.VENDOR);
          capabilities.renderer = gl1.getParameter(gl1.RENDERER);
          capabilities.version = gl1.getParameter(gl1.VERSION);
          capabilities.contextAttributes = gl1.getContextAttributes();

          this.logStep("WebGL1 Context Creation", true, undefined, {
            vendor: capabilities.vendor,
            renderer: capabilities.renderer,
            version: capabilities.version,
            maxTextureSize: capabilities.maxTextureSize,
            extensionCount: capabilities.extensions.length,
          });
        } else {
          this.logStep("WebGL1 Context Creation", false, "Context is null");
        }
      } catch (error) {
        this.logStep(
          "WebGL1 Context Creation",
          false,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    // Test specific extensions needed for our shader
    const requiredExtensions = [
      "OES_standard_derivatives",
      "OES_element_index_uint",
      "WEBGL_color_buffer_float",
    ];

    for (const ext of requiredExtensions) {
      const hasExtension = capabilities.extensions.includes(ext);
      this.logStep(
        `Extension: ${ext}`,
        hasExtension,
        hasExtension ? undefined : "Not supported"
      );
    }

    // Test shader compilation (simple test)
    await this.testShaderCompilation(canvas);

    this.capabilities = capabilities;
    canvas.remove();

    this.logStep(
      "WebGL Capability Test Complete",
      true,
      undefined,
      capabilities
    );
    return capabilities;
  }

  private async testShaderCompilation(
    canvas: HTMLCanvasElement
  ): Promise<void> {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return;

    // Test simple vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Test simple fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      void main() {
        gl_Color = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;

    try {
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      if (!vertexShader) {
        this.logStep(
          "Vertex Shader Creation",
          false,
          "Failed to create vertex shader"
        );
        return;
      }

      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.compileShader(vertexShader);

      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(vertexShader);
        this.logStep(
          "Vertex Shader Compilation",
          false,
          error || "Unknown compilation error"
        );
        return;
      }

      this.logStep("Vertex Shader Compilation", true);

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      if (!fragmentShader) {
        this.logStep(
          "Fragment Shader Creation",
          false,
          "Failed to create fragment shader"
        );
        return;
      }

      gl.shaderSource(fragmentShader, fragmentShaderSource);
      gl.compileShader(fragmentShader);

      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(fragmentShader);
        this.logStep(
          "Fragment Shader Compilation",
          false,
          error || "Unknown compilation error"
        );
        return;
      }

      this.logStep("Fragment Shader Compilation", true);

      // Test program linking
      const program = gl.createProgram();
      if (!program) {
        this.logStep("Program Creation", false, "Failed to create program");
        return;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(program);
        this.logStep(
          "Program Linking",
          false,
          error || "Unknown linking error"
        );
        return;
      }

      this.logStep("Program Linking", true);

      // Cleanup
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
    } catch (error) {
      this.logStep(
        "Shader Compilation Test",
        false,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  public testDOMSelectors(): void {
    const selectors = [
      ".main-view-container__scroll-node",
      ".main-view-container",
      ".Root__main-view",
      "body",
      "html",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      this.logStep(
        `DOM Selector: ${selector}`,
        !!element,
        element ? undefined : "Element not found"
      );
    }
  }

  public reportError(
    type: WebGLErrorType,
    message: string,
    details?: any
  ): void {
    this.logStep(`ERROR: ${type}`, false, message, details);

    // Also log to Y3K system
    if (Y3K?.debug) {
      Y3K.debug.error("WebGLDebugReporter", `${type}: ${message}`, details);
    }
  }

  public getCapabilities(): WebGLCapabilities | null {
    return this.capabilities;
  }

  public getDebugSteps(): WebGLDebugStep[] {
    return [...this.debugSteps];
  }

  public clearDebugSteps(): void {
    this.debugSteps = [];
    this.updateDebugPanel();
  }

  private updateDebugPanel(): void {
    if (!this.debugPanel) return;

    const content = this.debugPanel.querySelector(".debug-content");
    if (content) {
      content.remove();
    }

    const debugContent = document.createElement("div");
    debugContent.className = "debug-content";

    // Show last 10 steps
    const recentSteps = this.debugSteps.slice(-10);
    for (const step of recentSteps) {
      const stepDiv = document.createElement("div");
      stepDiv.style.cssText = `
        margin: 4px 0;
        padding: 4px;
        border-left: 2px solid ${step.success ? "#4CAF50" : "#f44336"};
        background: ${
          step.success ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)"
        };
        font-size: 10px;
      `;

      stepDiv.innerHTML = `
        <div style="font-weight: bold; color: ${
          step.success ? "#4CAF50" : "#f44336"
        };">
          ${step.success ? "✓" : "✗"} ${step.step}
        </div>
        ${
          step.error
            ? `<div style="color: #f44336; font-size: 9px;">${step.error}</div>`
            : ""
        }
      `;

      debugContent.appendChild(stepDiv);
    }

    this.debugPanel.appendChild(debugContent);
  }

  public toggleDebugPanel(): void {
    if (!this.debugPanel) return;

    const isVisible = this.debugPanel.style.display !== "none";
    this.debugPanel.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
      this.updateDebugPanel();
    }
  }

  public showDebugPanel(): void {
    if (!this.debugPanel) return;
    this.debugPanel.style.display = "block";
    this.updateDebugPanel();
  }

  public hideDebugPanel(): void {
    if (!this.debugPanel) return;
    this.debugPanel.style.display = "none";
  }

  public generateDebugReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        isSpicetify: this.isSpicetifyEnvironment,
        userAgent: navigator.userAgent,
        hasSpicetifyGlobal: !!window.Spicetify,
        hasSpotifyDOM: !!document.querySelector(".Root__main-view"),
      },
      capabilities: this.capabilities,
      debugSteps: this.debugSteps,
    };

    return JSON.stringify(report, null, 2);
  }
}

// Global access for debugging
if (typeof window !== "undefined") {
  (window as any).WebGLDebugReporter = WebGLDebugReporter;
}
