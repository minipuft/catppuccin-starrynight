// ===================================================================
// 🔍 DEVICE CAPABILITY DETECTOR - Year 3000 Performance System
// ===================================================================
// Advanced device capability detection and optimization
// Provides comprehensive hardware and software analysis for optimal performance

export class DeviceCapabilityDetector {
  constructor(config = {}) {
    this.config = {
      enableDebug: config.enableDebug || false,
      runStressTests: config.runStressTests !== false, // Default true
      ...config,
    };

    this.deviceCapabilities = null;
    this.isInitialized = false;
    this._capabilityTestResults = new Map();

    if (this.config.enableDebug) {
      console.log("🔍 [DeviceCapabilityDetector] Initialized");
    }
  }

  /**
   * Initialize device capability detection
   */
  async initialize() {
    if (this.isInitialized) {
      return this.deviceCapabilities;
    }

    if (this.config.enableDebug) {
      console.log(
        "🔍 [DeviceCapabilityDetector] Starting capability detection..."
      );
    }

    // === DEVICE CAPABILITY ANALYSIS ===
    this.deviceCapabilities = {
      // Memory analysis
      memory: {
        total: navigator.deviceMemory || 4,
        level: this._detectMemoryLevel(),
        jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0,
        estimatedAvailable: this._estimateAvailableMemory(),
      },

      // CPU analysis
      cpu: {
        cores: navigator.hardwareConcurrency || 2,
        level: this._detectCPULevel(),
        estimatedScore: this._calculateCPUScore(),
      },

      // GPU analysis
      gpu: {
        supportsWebGL: this._detectWebGLSupport(),
        supportsWebGL2: this._detectWebGL2Support(),
        maxTextureSize: this._getMaxTextureSize(),
        level: this._detectGPULevel(),
        vendor: this._getGPUVendor(),
        renderer: this._getGPURenderer(),
      },

      // Browser capabilities
      browser: {
        supportsOffscreenCanvas: this._detectOffscreenCanvasSupport(),
        supportsWorkers: this._detectWorkerSupport(),
        supportsSharedArrayBuffer: this._detectSharedArrayBufferSupport(),
        supportsWASM: this._detectWASMSupport(),
        supportsCSSHoudini: this._detectCSSHoudiniSupport(),
      },

      // Display capabilities
      display: {
        pixelRatio: window.devicePixelRatio || 1,
        refreshRate: await this._detectRefreshRate(),
        colorGamut: this._detectColorGamut(),
        contrastRatio: this._detectContrastCapability(),
        reducedMotion: this._detectReducedMotion(),
      },

      // Network capabilities
      network: {
        effectiveType: navigator.connection?.effectiveType || "unknown",
        downlink: navigator.connection?.downlink || 0,
        rtt: navigator.connection?.rtt || 0,
        saveData: navigator.connection?.saveData || false,
      },

      // Overall performance level
      overall: "detecting", // Will be calculated after all tests
    };

    // Run capability tests if enabled
    if (this.config.runStressTests) {
      await this._runCapabilityTests();
    }

    // Calculate overall performance level
    this.deviceCapabilities.overall = this._calculateOverallPerformanceLevel();

    this.isInitialized = true;

    if (this.config.enableDebug) {
      console.log(
        "📊 [DeviceCapabilityDetector] Capabilities detected:",
        this.deviceCapabilities
      );
    }

    return this.deviceCapabilities;
  }

  // === DEVICE CAPABILITY DETECTION METHODS ===

  _detectMemoryLevel() {
    const memory = navigator.deviceMemory || 4;
    if (memory >= 8) return "high";
    if (memory >= 4) return "medium";
    return "low";
  }

  _estimateAvailableMemory() {
    if (performance.memory) {
      return (
        performance.memory.jsHeapSizeLimit - performance.memory.usedJSHeapSize
      );
    }
    return (navigator.deviceMemory || 4) * 1024 * 1024 * 1024 * 0.7; // Estimate 70% available
  }

  _detectCPULevel() {
    const cores = navigator.hardwareConcurrency || 2;
    if (cores >= 8) return "high";
    if (cores >= 4) return "medium";
    return "low";
  }

  _calculateCPUScore() {
    // Simple CPU benchmark using performance timing
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sin(i) * Math.cos(i);
    }
    const duration = performance.now() - start;

    // Lower duration = faster CPU = higher score
    if (duration < 10) return "high";
    if (duration < 25) return "medium";
    return "low";
  }

  _detectWebGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch (e) {
      return false;
    }
  }

  _detectWebGL2Support() {
    try {
      const canvas = document.createElement("canvas");
      return !!canvas.getContext("webgl2");
    } catch (e) {
      return false;
    }
  }

  _getMaxTextureSize() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;
    } catch (e) {
      return 0;
    }
  }

  _detectGPULevel() {
    const renderer = this._getGPURenderer().toLowerCase();

    // High-end GPUs
    if (
      renderer.includes("rtx") ||
      renderer.includes("radeon rx") ||
      renderer.includes("gtx 16") ||
      renderer.includes("gtx 20") ||
      renderer.includes("apple m1") ||
      renderer.includes("apple m2")
    ) {
      return "high";
    }

    // Medium-end GPUs
    if (
      renderer.includes("gtx") ||
      renderer.includes("radeon") ||
      renderer.includes("intel iris") ||
      renderer.includes("intel uhd")
    ) {
      return "medium";
    }

    return "low";
  }

  _getGPUVendor() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return "unknown";

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      return debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : "unknown";
    } catch (e) {
      return "unknown";
    }
  }

  _getGPURenderer() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return "unknown";

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      return debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : "unknown";
    } catch (e) {
      return "unknown";
    }
  }

  _detectOffscreenCanvasSupport() {
    return typeof OffscreenCanvas !== "undefined";
  }

  _detectWorkerSupport() {
    return typeof Worker !== "undefined";
  }

  _detectSharedArrayBufferSupport() {
    return typeof SharedArrayBuffer !== "undefined";
  }

  _detectWASMSupport() {
    return typeof WebAssembly !== "undefined";
  }

  _detectCSSHoudiniSupport() {
    return typeof CSS !== "undefined" && CSS.paintWorklet !== undefined;
  }

  async _detectRefreshRate() {
    // Estimate refresh rate using requestAnimationFrame
    return new Promise((resolve) => {
      let lastTime = performance.now();
      let frameCount = 0;
      const samples = [];

      const measure = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        samples.push(1000 / delta); // Convert to FPS
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

  _detectColorGamut() {
    if (window.matchMedia("(color-gamut: p3)").matches) return "p3";
    if (window.matchMedia("(color-gamut: srgb)").matches) return "srgb";
    return "limited";
  }

  _detectContrastCapability() {
    if (window.matchMedia("(dynamic-range: high)").matches) return "high";
    if (window.matchMedia("(contrast: high)").matches) return "high";
    return "standard";
  }

  _detectReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // === DYNAMIC CAPABILITY TESTS ===

  async _runCapabilityTests() {
    // GPU stress test
    this.deviceCapabilities.gpu.stressTestScore =
      await this._runGPUStressTest();

    // Memory stress test
    this.deviceCapabilities.memory.stressTestScore =
      await this._runMemoryStressTest();

    if (this.config.enableDebug) {
      console.log("⚡ [DeviceCapabilityDetector] Capability tests completed");
    }
  }

  async _runGPUStressTest() {
    return new Promise((resolve) => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (!gl) {
          resolve(0);
          return;
        }

        const startTime = performance.now();

        // Simple GPU stress test - render multiple triangles
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(
          vertexShader,
          `
          attribute vec2 position;
          void main() {
            gl_Position = vec4(position, 0.0, 1.0);
          }
        `
        );
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(
          fragmentShader,
          `
          precision mediump float;
          void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
          }
        `
        );
        gl.compileShader(fragmentShader);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Render multiple frames
        let frameCount = 0;
        const testFrames = 60;

        const renderFrame = () => {
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          frameCount++;

          if (frameCount < testFrames) {
            requestAnimationFrame(renderFrame);
          } else {
            const duration = performance.now() - startTime;
            const score = (testFrames / duration) * 1000; // FPS
            resolve(Math.min(score, 60)); // Cap at 60 FPS
          }
        };

        renderFrame();
      } catch (e) {
        resolve(0);
      }
    });
  }

  async _runMemoryStressTest() {
    return new Promise((resolve) => {
      try {
        const startMemory = performance.memory
          ? performance.memory.usedJSHeapSize
          : 0;

        // Allocate and deallocate memory to test GC performance
        const arrays = [];
        const startTime = performance.now();

        for (let i = 0; i < 100; i++) {
          arrays.push(new Array(10000).fill(Math.random()));
        }

        // Force garbage collection test
        arrays.length = 0;

        setTimeout(() => {
          const endTime = performance.now();
          const duration = endTime - startTime;
          const endMemory = performance.memory
            ? performance.memory.usedJSHeapSize
            : 0;

          // Lower duration and memory delta = better score
          const timeScore = Math.max(0, 100 - duration);
          const memoryScore =
            startMemory > 0
              ? Math.max(0, 100 - (endMemory - startMemory) / 1024 / 1024)
              : 50;

          resolve((timeScore + memoryScore) / 2);
        }, 100);
      } catch (e) {
        resolve(0);
      }
    });
  }

  _calculateOverallPerformanceLevel() {
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
        (this.deviceCapabilities.browser.supportsWebGL ? 1 : 0) +
        (this.deviceCapabilities.browser.supportsWorkers ? 1 : 0) +
        (this.deviceCapabilities.browser.supportsOffscreenCanvas ? 1 : 0),
    };

    const totalScore =
      scores.memory + scores.cpu + scores.gpu + Math.min(scores.browser, 3);

    if (totalScore >= 10) return "high";
    if (totalScore >= 7) return "medium";
    return "low";
  }

  /**
   * Get device capabilities report
   * @returns {Object} Complete device capabilities
   */
  getCapabilities() {
    if (!this.isInitialized) {
      console.warn(
        "[DeviceCapabilityDetector] Not initialized - call initialize() first"
      );
      return null;
    }
    return this.deviceCapabilities;
  }

  /**
   * Get recommendations based on device capabilities
   * @returns {Array} Array of optimization recommendations
   */
  getRecommendations() {
    if (!this.deviceCapabilities) {
      return ["Initialize device capability detection first"];
    }

    const recommendations = [];

    if (this.deviceCapabilities.overall === "low") {
      recommendations.push("Consider enabling performance mode");
      recommendations.push("Reduce visual effect intensity");
      recommendations.push("Disable GPU-intensive features");
    }

    if (this.deviceCapabilities.memory.level === "low") {
      recommendations.push("Enable aggressive memory cleanup");
      recommendations.push("Reduce animation history length");
    }

    if (!this.deviceCapabilities.gpu.supportsWebGL) {
      recommendations.push("Disable WebGL-dependent features");
      recommendations.push("Use CSS-only animations");
    }

    if (this.deviceCapabilities.display.reducedMotion) {
      recommendations.push("Respect reduced motion preference");
      recommendations.push("Use static or minimal animations");
    }

    if (this.deviceCapabilities.network.saveData) {
      recommendations.push("Enable data-saving mode");
      recommendations.push("Reduce resource-intensive operations");
    }

    return recommendations.length > 0
      ? recommendations
      : ["Device capabilities are optimal"];
  }

  /**
   * Check if a specific capability is supported
   * @param {string} capability - Capability to check (e.g., 'webgl', 'workers', 'offscreenCanvas')
   * @returns {boolean} Whether the capability is supported
   */
  supportsCapability(capability) {
    if (!this.deviceCapabilities) return false;

    const capabilityMap = {
      webgl: this.deviceCapabilities.gpu.supportsWebGL,
      webgl2: this.deviceCapabilities.gpu.supportsWebGL2,
      workers: this.deviceCapabilities.browser.supportsWorkers,
      offscreenCanvas: this.deviceCapabilities.browser.supportsOffscreenCanvas,
      sharedArrayBuffer:
        this.deviceCapabilities.browser.supportsSharedArrayBuffer,
      wasm: this.deviceCapabilities.browser.supportsWASM,
      cssHoudini: this.deviceCapabilities.browser.supportsCSSHoudini,
      highMemory: this.deviceCapabilities.memory.level === "high",
      highCPU: this.deviceCapabilities.cpu.level === "high",
      highGPU: this.deviceCapabilities.gpu.level === "high",
      reducedMotion: this.deviceCapabilities.display.reducedMotion,
      saveData: this.deviceCapabilities.network.saveData,
    };

    return capabilityMap[capability] || false;
  }

  /**
   * Get optimal settings based on device capabilities
   * @returns {Object} Recommended settings for optimal performance
   */
  getOptimalSettings() {
    if (!this.deviceCapabilities) return {};

    const settings = {
      performanceMode: "auto",
      maxParticles: 100,
      animationQuality: "high",
      enableGPUAcceleration: true,
      batchUpdates: true,
      frameBudget: 16,
    };

    // Adjust based on overall performance
    if (this.deviceCapabilities.overall === "low") {
      settings.performanceMode = "performance";
      settings.maxParticles = 20;
      settings.animationQuality = "low";
      settings.frameBudget = 32; // Lower target FPS
    } else if (this.deviceCapabilities.overall === "medium") {
      settings.maxParticles = 50;
      settings.animationQuality = "medium";
      settings.frameBudget = 20;
    }

    // GPU-specific adjustments
    if (!this.deviceCapabilities.gpu.supportsWebGL) {
      settings.enableGPUAcceleration = false;
      settings.animationQuality = "low";
    }

    // Memory-specific adjustments
    if (this.deviceCapabilities.memory.level === "low") {
      settings.maxParticles = Math.min(settings.maxParticles, 30);
      settings.batchUpdates = true;
    }

    // Respect user preferences
    if (this.deviceCapabilities.display.reducedMotion) {
      settings.animationQuality = "minimal";
      settings.maxParticles = 0;
    }

    if (this.deviceCapabilities.network.saveData) {
      settings.performanceMode = "performance";
      settings.animationQuality = "low";
    }

    return settings;
  }

  /**
   * Clean up and destroy the detector
   */
  destroy() {
    this._capabilityTestResults.clear();
    this.deviceCapabilities = null;
    this.isInitialized = false;

    if (this.config.enableDebug) {
      console.log("🔍 [DeviceCapabilityDetector] Destroyed");
    }
  }
}
