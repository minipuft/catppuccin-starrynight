// ===================================================================
// 🔍 DEVICE CAPABILITY DETECTOR - Year 3000 Performance System
// ===================================================================
// Advanced device capability detection and optimization
// Provides comprehensive hardware and software analysis for optimal performance

interface DetectorConfig {
  enableDebug: boolean;
  runStressTests: boolean;
}

interface MemoryCapabilities {
  total: number;
  level: "high" | "medium" | "low";
  jsHeapSizeLimit: number;
  estimatedAvailable: number;
  stressTestScore?: number;
}

interface CPUCapabilities {
  cores: number;
  level: "high" | "medium" | "low";
  estimatedScore: "high" | "medium" | "low";
}

interface GPUCapabilities {
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
  maxTextureSize: number;
  level: "high" | "medium" | "low";
  vendor: string;
  renderer: string;
  stressTestScore?: number;
}

interface BrowserCapabilities {
  supportsOffscreenCanvas: boolean;
  supportsWorkers: boolean;
  supportsSharedArrayBuffer: boolean;
  supportsWASM: boolean;
  supportsCSSHoudini: boolean;
}

interface DisplayCapabilities {
  pixelRatio: number;
  refreshRate: number;
  colorGamut: "p3" | "srgb" | "limited";
  contrastRatio: "high" | "standard";
  reducedMotion: boolean;
}

interface NetworkCapabilities {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface DeviceCapabilities {
  memory: MemoryCapabilities;
  cpu: CPUCapabilities;
  gpu: GPUCapabilities;
  browser: BrowserCapabilities;
  display: DisplayCapabilities;
  network: NetworkCapabilities;
  overall: "high" | "medium" | "low" | "detecting";
}

export class DeviceCapabilityDetector {
  private config: DetectorConfig;
  public deviceCapabilities: DeviceCapabilities | null = null;
  public isInitialized = false;

  constructor(config: Partial<DetectorConfig> = {}) {
    this.config = {
      enableDebug: config.enableDebug || false,
      runStressTests: config.runStressTests !== false,
      ...config,
    };
    if (this.config.enableDebug) {
      console.log("🔍 [DeviceCapabilityDetector] Initialized");
    }
  }

  public async initialize(): Promise<DeviceCapabilities | null> {
    if (this.isInitialized) {
      return this.deviceCapabilities;
    }
    if (this.config.enableDebug) {
      console.log(
        "🔍 [DeviceCapabilityDetector] Starting capability detection..."
      );
    }

    this.deviceCapabilities = {
      memory: {
        total: (navigator as any).deviceMemory || 4,
        level: this._detectMemoryLevel(),
        jsHeapSizeLimit: (performance as any).memory?.jsHeapSizeLimit || 0,
        estimatedAvailable: this._estimateAvailableMemory(),
      },
      cpu: {
        cores: navigator.hardwareConcurrency || 2,
        level: this._detectCPULevel(),
        estimatedScore: this._calculateCPUScore(),
      },
      gpu: {
        supportsWebGL: this._detectWebGLSupport(),
        supportsWebGL2: this._detectWebGL2Support(),
        maxTextureSize: this._getMaxTextureSize(),
        level: this._detectGPULevel(),
        vendor: this._getGPUVendor(),
        renderer: this._getGPURenderer(),
      },
      browser: {
        supportsOffscreenCanvas: this._detectOffscreenCanvasSupport(),
        supportsWorkers: this._detectWorkerSupport(),
        supportsSharedArrayBuffer: this._detectSharedArrayBufferSupport(),
        supportsWASM: this._detectWASMSupport(),
        supportsCSSHoudini: this._detectCSSHoudiniSupport(),
      },
      display: {
        pixelRatio: window.devicePixelRatio || 1,
        refreshRate: await this._detectRefreshRate(),
        colorGamut: this._detectColorGamut(),
        contrastRatio: this._detectContrastCapability(),
        reducedMotion: this._detectReducedMotion(),
      },
      network: {
        effectiveType:
          (navigator as any).connection?.effectiveType || "unknown",
        downlink: (navigator as any).connection?.downlink || 0,
        rtt: (navigator as any).connection?.rtt || 0,
        saveData: (navigator as any).connection?.saveData || false,
      },
      overall: "detecting",
    };

    if (this.config.runStressTests) {
      await this._runCapabilityTests();
    }

    this.deviceCapabilities.overall = this._calculateOverallPerformanceLevel();
    this._applyAnticipatoryIntensity(this.deviceCapabilities.overall as any);
    this.isInitialized = true;

    if (this.config.enableDebug) {
      console.log(
        "📊 [DeviceCapabilityDetector] Capabilities detected:",
        this.deviceCapabilities
      );
    }

    return this.deviceCapabilities;
  }

  private _detectMemoryLevel(): "high" | "medium" | "low" {
    const memory = (navigator as any).deviceMemory || 4;
    if (memory >= 8) return "high";
    if (memory >= 4) return "medium";
    return "low";
  }

  private _estimateAvailableMemory(): number {
    if ((performance as any).memory) {
      return (
        (performance as any).memory.jsHeapSizeLimit -
        (performance as any).memory.usedJSHeapSize
      );
    }
    return ((navigator as any).deviceMemory || 4) * 1024 * 1024 * 1024 * 0.7;
  }

  private _detectCPULevel(): "high" | "medium" | "low" {
    const cores = navigator.hardwareConcurrency || 2;
    if (cores >= 8) return "high";
    if (cores >= 4) return "medium";
    return "low";
  }

  private _calculateCPUScore(): "high" | "medium" | "low" {
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sin(i) * Math.cos(i);
    }
    const duration = performance.now() - start;
    if (duration < 10) return "high";
    if (duration < 25) return "medium";
    return "low";
  }

  private _detectWebGLSupport(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch (e) {
      return false;
    }
  }

  private _detectWebGL2Support(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!canvas.getContext("webgl2");
    } catch (e) {
      return false;
    }
  }

  private _getMaxTextureSize(): number {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        (canvas.getContext("webgl") as WebGLRenderingContext) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
      return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;
    } catch (e) {
      return 0;
    }
  }

  private _getGPUVendor(): string {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        (canvas.getContext("webgl") as WebGLRenderingContext) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
      if (!gl) return "unknown";
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      return debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : "unknown";
    } catch (e) {
      return "unknown";
    }
  }

  private _getGPURenderer(): string {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        (canvas.getContext("webgl") as WebGLRenderingContext) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
      if (!gl) return "unknown";
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      return debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : "unknown";
    } catch (e) {
      return "unknown";
    }
  }

  private _detectGPULevel(): "high" | "medium" | "low" {
    const renderer = this._getGPURenderer().toLowerCase();
    if (/rtx|radeon rx|gtx 16|gtx 20|apple m[1-9]/.test(renderer)) {
      return "high";
    }
    if (/gtx|radeon|intel iris|intel uhd/.test(renderer)) {
      return "medium";
    }
    return "low";
  }

  private _detectOffscreenCanvasSupport(): boolean {
    return typeof OffscreenCanvas !== "undefined";
  }

  private _detectWorkerSupport(): boolean {
    return typeof Worker !== "undefined";
  }

  private _detectSharedArrayBufferSupport(): boolean {
    return typeof SharedArrayBuffer !== "undefined";
  }

  private _detectWASMSupport(): boolean {
    return typeof WebAssembly !== "undefined";
  }

  private _detectCSSHoudiniSupport(): boolean {
    return (
      typeof CSS !== "undefined" && (CSS as any).paintWorklet !== undefined
    );
  }

  private async _detectRefreshRate(): Promise<number> {
    return new Promise((resolve) => {
      let lastTime = performance.now();
      let frameCount = 0;
      const samples: number[] = [];
      const measure = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        samples.push(1000 / delta);
        lastTime = currentTime;
        frameCount++;
        if (frameCount < 10) {
          requestAnimationFrame(measure);
        } else {
          const avgFPS = samples.reduce((a, b) => a + b, 0) / samples.length;
          resolve(Math.round(avgFPS));
        }
      };
      requestAnimationFrame(measure);
    });
  }

  private _detectColorGamut(): "p3" | "srgb" | "limited" {
    if (window.matchMedia("(color-gamut: p3)").matches) return "p3";
    if (window.matchMedia("(color-gamut: srgb)").matches) return "srgb";
    return "limited";
  }

  private _detectContrastCapability(): "high" | "standard" {
    if (window.matchMedia("(dynamic-range: high)").matches) return "high";
    if (window.matchMedia("(contrast: high)").matches) return "high";
    return "standard";
  }

  private _detectReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  private async _runCapabilityTests(): Promise<void> {
    if (this.deviceCapabilities) {
      this.deviceCapabilities.gpu.stressTestScore =
        await this._runGPUStressTest();
      this.deviceCapabilities.memory.stressTestScore =
        await this._runMemoryStressTest();
    }
    if (this.config.enableDebug) {
      console.log("⚡ [DeviceCapabilityDetector] Capability tests completed");
    }
  }

  private async _runGPUStressTest(): Promise<number> {
    // ... Implementation from JS file ...
    return 0;
  }

  private async _runMemoryStressTest(): Promise<number> {
    // ... Implementation from JS file ...
    return 0;
  }

  private _calculateOverallPerformanceLevel(): "high" | "medium" | "low" {
    if (!this.deviceCapabilities) return "low";
    const scores = {
      memory:
        this.deviceCapabilities.memory.level === "high"
          ? 3
          : this.deviceCapabilities.memory.level === "medium"
          ? 2
          : 1,
      cpu:
        this.deviceCapabilities.cpu.level === "high"
          ? 3
          : this.deviceCapabilities.cpu.level === "medium"
          ? 2
          : 1,
      gpu:
        this.deviceCapabilities.gpu.level === "high"
          ? 3
          : this.deviceCapabilities.gpu.level === "medium"
          ? 2
          : 1,
      browser:
        (this.deviceCapabilities.gpu.supportsWebGL ? 1 : 0) +
        (this.deviceCapabilities.browser.supportsWorkers ? 1 : 0) +
        (this.deviceCapabilities.browser.supportsOffscreenCanvas ? 1 : 0),
    };
    const totalScore =
      scores.memory + scores.cpu + scores.gpu + Math.min(scores.browser, 3);
    if (totalScore >= 10) return "high";
    if (totalScore >= 7) return "medium";
    return "low";
  }

  public getCapabilities(): DeviceCapabilities | null {
    if (!this.isInitialized) {
      console.warn(
        "[DeviceCapabilityDetector] Not initialized - call initialize() first"
      );
      return null;
    }
    return this.deviceCapabilities;
  }

  public destroy(): void {
    this.deviceCapabilities = null;
    this.isInitialized = false;
    if (this.config.enableDebug) {
      console.log("🔍 [DeviceCapabilityDetector] Destroyed");
    }
  }

  /**
   * Recommend a performance-quality label that callers (e.g., visual systems)
   * can use to pick an appropriate performance profile.
   * Returns one of `"low" | "balanced" | "high"`.
   */
  public recommendPerformanceQuality(): "low" | "balanced" | "high" {
    if (!this.isInitialized || !this.deviceCapabilities) {
      // Default to balanced when we have insufficient information.
      return "balanced";
    }

    switch (this.deviceCapabilities.overall) {
      case "high":
        return "high";
      case "medium":
        return "balanced";
      case "low":
      default:
        return "low";
    }
  }

  private _applyAnticipatoryIntensity(level: "high" | "medium" | "low"): void {
    const root = document.documentElement;
    const mapping: Record<string, number> = {
      high: 0.26,
      medium: 0.18,
      low: 0.1,
    };
    const val = mapping[level] ?? 0.18;
    root.style.setProperty("--sn-anticipatory-intensity", val.toString());
    if (this.config.enableDebug) {
      console.log(
        `🔍 [DeviceCapabilityDetector] Applied --sn-anticipatory-intensity=${val} for performance level ${level}`
      );
    }
  }
}
