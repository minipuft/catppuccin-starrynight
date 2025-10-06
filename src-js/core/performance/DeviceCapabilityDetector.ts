// ===================================================================
// 🔍 DEVICE CAPABILITY DETECTOR - Year 3000 Performance System
// ===================================================================
// Advanced device capability detection and optimization
// Provides comprehensive hardware and software analysis for optimal performance

interface DetectorConfig {
  enableDebug: boolean;
  runStressTests: boolean;
  spicetifyContext?: boolean; // New: Enable Spicetify-specific optimizations
}

// Enhanced tier detection from EnhancedDeviceTierDetector
export interface TierDetectionResult {
  tier: 'high' | 'medium' | 'low';
  confidence: number; // 0-1
  reasoning: string[];
  capabilities: any; // DeviceCapabilities reference
}

// Enhanced scoring system with continuous values instead of binary classification
interface MemoryCapabilities {
  total: number;
  score: number; // 0-10 continuous score
  level: "high" | "medium" | "low"; // Kept for backward compatibility
  jsHeapSizeLimit: number;
  estimatedAvailable: number;
  spicetifyOverhead: number; // New: Estimated Spotify resource usage
  stressTestScore?: number;
  confidenceLevel: number; // New: 0-1 confidence in detection accuracy
}

interface CPUCapabilities {
  cores: number;
  score: number; // 0-10 continuous score based on benchmarks
  level: "high" | "medium" | "low"; // Kept for backward compatibility
  singleThreadPerformance: number; // New: Single-thread performance score
  thermalThrottlingRisk: number; // New: 0-1 estimated throttling risk
  confidenceLevel: number; // New: 0-1 confidence in detection accuracy
}

interface GPUCapabilities {
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
  maxTextureSize: number;
  score: number; // 0-10 continuous score
  level: "high" | "medium" | "low"; // Kept for backward compatibility
  vendor: string;
  renderer: string;
  webglCapabilityScore: number; // New: Detailed WebGL performance score
  stressTestScore?: number;
  confidenceLevel: number; // New: 0-1 confidence in detection accuracy
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

// New composite scoring interface for Spicetify optimization
interface SpicetifyDeviceProfile {
  memoryScore: number; // 0-10
  cpuScore: number; // 0-10  
  gpuScore: number; // 0-10
  compositeScore: number; // 0-100 overall device capability
  spicetifyOverhead: number; // Estimated Spotify resource usage (0-1)
  
  // User preference override
  userQualityPreference: "auto" | "performance" | "balanced" | "quality";
  
  // Enhanced tier detection
  tierDetection?: TierDetectionResult;
  
  // Adaptive thresholds
  confidenceLevel: number; // How sure we are about capabilities (0-1)
  recommendedQualityLevel: number; // 0-100 recommended quality level
}

interface DeviceCapabilities {
  memory: MemoryCapabilities;
  cpu: CPUCapabilities;
  gpu: GPUCapabilities;
  browser: BrowserCapabilities;
  display: DisplayCapabilities;
  network: NetworkCapabilities;
  overall: "high" | "medium" | "low" | "detecting";
  
  // Enhanced hardware info from EnhancedDeviceTierDetector
  hardwareInfo?: {
    isHighEnd: boolean;
    isMobile: boolean;
    isOldDevice: boolean;
    hasPerformanceIndicators: boolean;
  };
  
  // New: Enhanced scoring system
  spicetifyProfile: SpicetifyDeviceProfile;
}

export class DeviceCapabilityDetector {
  private config: DetectorConfig;
  public deviceCapabilities: DeviceCapabilities | null = null;
  public isInitialized = false;
  
  // New: Cache for expensive computations
  private benchmarkCache = new Map<string, number>();
  private detectionStartTime = 0;

  constructor(config: Partial<DetectorConfig> = {}) {
    this.config = {
      enableDebug: config.enableDebug || false,
      runStressTests: config.runStressTests !== false,
      spicetifyContext: config.spicetifyContext || this._detectSpicetifyContext(),
      ...config,
    };
    if (this.config.enableDebug) {
      console.log("🔍 [DeviceCapabilityDetector] Initialized", 
        this.config.spicetifyContext ? "(Spicetify-optimized)" : "(Standard)");
    }
  }
  
  // New: Detect if we're running in Spicetify context
  private _detectSpicetifyContext(): boolean {
    return !!(window as any).Spicetify;
  }

  public async initialize(): Promise<DeviceCapabilities | null> {
    if (this.isInitialized) {
      return this.deviceCapabilities;
    }
    
    this.detectionStartTime = performance.now();
    
    if (this.config.enableDebug) {
      console.log(
        "🔍 [DeviceCapabilityDetector] Starting enhanced capability detection...",
        this.config.spicetifyContext ? "(Spicetify mode)" : "(Standard mode)"
      );
    }

    // Enhanced capability detection with continuous scoring
    const memoryData = await this._analyzeMemoryCapabilities();
    const cpuData = await this._analyzeCPUCapabilities();
    const gpuData = await this._analyzeGPUCapabilities();
    
    this.deviceCapabilities = {
      memory: memoryData,
      cpu: cpuData,
      gpu: gpuData,
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
      spicetifyProfile: await this._createSpicetifyProfile(memoryData, cpuData, gpuData),
    };

    if (this.config.runStressTests) {
      await this._runCapabilityTests();
      // Update scores after stress tests
      this.deviceCapabilities.spicetifyProfile = await this._createSpicetifyProfile(
        this.deviceCapabilities.memory, 
        this.deviceCapabilities.cpu, 
        this.deviceCapabilities.gpu
      );
    }

    this.deviceCapabilities.overall = this._calculateOverallPerformanceLevel();
    this.isInitialized = true;
    
    const detectionTime = performance.now() - this.detectionStartTime;
    if (this.config.enableDebug) {
      console.log(
        "📊 [DeviceCapabilityDetector] Enhanced detection completed in",
        `${detectionTime.toFixed(1)}ms`,
        "\nSpicetify Profile:", this.deviceCapabilities.spicetifyProfile
      );
    }

    if (this.config.enableDebug) {
      console.log(
        "📊 [DeviceCapabilityDetector] Capabilities detected:",
        this.deviceCapabilities
      );
    }

    return this.deviceCapabilities;
  }
  
  // New: Get enhanced Spicetify device profile
  public getSpicetifyProfile(): SpicetifyDeviceProfile | null {
    return this.deviceCapabilities?.spicetifyProfile || null;
  }
  
  // New: Get recommended quality level (0-100)
  public getRecommendedQualityLevel(): number {
    return this.deviceCapabilities?.spicetifyProfile?.recommendedQualityLevel || 50;
  }

  // Enhanced memory capability analysis with continuous scoring
  private async _analyzeMemoryCapabilities(): Promise<MemoryCapabilities> {
    const deviceMemory = (navigator as any).deviceMemory;
    const hasMemoryAPI = typeof deviceMemory === 'number';
    
    // More optimistic memory detection for devices without API
    const estimatedMemory = deviceMemory || this._estimateMemoryFromOtherSources();
    
    const jsHeapSizeLimit = (performance as any).memory?.jsHeapSizeLimit || 0;
    const estimatedAvailable = this._estimateAvailableMemory();
    const spicetifyOverhead = this.config.spicetifyContext ? this._estimateSpicetifyOverhead() : 0;
    
    // Continuous scoring (0-10) instead of binary classification
    const score = this._calculateMemoryScore(estimatedMemory, jsHeapSizeLimit, estimatedAvailable);
    
    return {
      total: estimatedMemory,
      score,
      level: score >= 7 ? "high" : score >= 4 ? "medium" : "low",
      jsHeapSizeLimit,
      estimatedAvailable,
      spicetifyOverhead,
      confidenceLevel: hasMemoryAPI ? 0.9 : 0.6, // Lower confidence when API unavailable
    };
  }
  
  private _detectMemoryLevel(): "high" | "medium" | "low" {
    const memory = (navigator as any).deviceMemory || 6; // More optimistic default
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

  // Enhanced CPU capability analysis with performance benchmarking
  private async _analyzeCPUCapabilities(): Promise<CPUCapabilities> {
    const cores = navigator.hardwareConcurrency || 4; // More optimistic default
    
    // Run single-thread performance test
    const singleThreadPerformance = await this._benchmarkSingleThreadPerformance();
    const thermalThrottlingRisk = this._estimateThermalThrottlingRisk(cores);
    
    // Composite CPU score considering cores + single-thread performance
    const score = this._calculateCPUScore(cores, singleThreadPerformance);
    
    return {
      cores,
      score,
      level: score >= 7 ? "high" : score >= 4 ? "medium" : "low",
      singleThreadPerformance,
      thermalThrottlingRisk,
      confidenceLevel: cores > 1 ? 0.8 : 0.5, // Lower confidence for single-core detection
    };
  }
  
  private _detectCPULevel(): "high" | "medium" | "low" {
    const cores = navigator.hardwareConcurrency || 4; // More optimistic default
    if (cores >= 8) return "high";
    if (cores >= 4) return "medium";
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

  // Enhanced GPU capability analysis with WebGL performance testing
  private async _analyzeGPUCapabilities(): Promise<GPUCapabilities> {
    const supportsWebGL = this._detectWebGLSupport();
    const supportsWebGL2 = this._detectWebGL2Support();
    const maxTextureSize = this._getMaxTextureSize();
    const vendor = this._getGPUVendor();
    const renderer = this._getGPURenderer();
    
    // WebGL capability scoring based on actual capabilities
    const webglCapabilityScore = await this._benchmarkWebGLCapabilities();
    
    // Composite GPU score
    const score = this._calculateGPUScore(renderer, webglCapabilityScore, supportsWebGL2, maxTextureSize);
    
    return {
      supportsWebGL,
      supportsWebGL2,
      maxTextureSize,
      score,
      level: score >= 7 ? "high" : score >= 4 ? "medium" : "low",
      vendor,
      renderer,
      webglCapabilityScore,
      confidenceLevel: supportsWebGL ? 0.8 : 0.3, // Much lower confidence without WebGL
    };
  }
  
  private _detectGPULevel(): "high" | "medium" | "low" {
    const renderer = this._getGPURenderer().toLowerCase();
    // More inclusive GPU detection - many modern integrated GPUs are capable
    if (/rtx|radeon rx|gtx 16|gtx 20|apple m[1-9]|iris xe/.test(renderer)) {
      return "high";
    }
    if (/gtx|radeon|intel iris|intel uhd|vega|ryzen/.test(renderer)) {
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

  // New: Enhanced scoring and helper methods
  
  private _estimateMemoryFromOtherSources(): number {
    // Use multiple heuristics when deviceMemory API unavailable
    const cores = navigator.hardwareConcurrency || 4;
    const screen = window.screen;
    
    // Modern devices typically have more memory
    // Base estimate on core count and screen resolution
    let estimate = 4; // Optimistic baseline
    
    if (cores >= 8) estimate = 16;
    else if (cores >= 6) estimate = 12;
    else if (cores >= 4) estimate = 8;
    else if (cores >= 2) estimate = 6;
    
    // High-resolution displays often indicate more capable devices
    if (screen.width * screen.height > 2073600) estimate *= 1.5; // >1080p
    
    return Math.round(estimate);
  }
  
  private _estimateSpicetifyOverhead(): number {
    // Estimate Spotify's resource usage impact (0-1)
    // Spotify typically uses 100-300MB RAM + CPU for decoding
    return this.config.spicetifyContext ? 0.15 : 0;
  }
  
  private _calculateMemoryScore(memory: number, heapLimit: number, available: number): number {
    // Score 0-10 based on actual memory capabilities
    let score = Math.min(memory / 2, 10); // Base score from total memory
    
    // Adjust for heap limit if available
    if (heapLimit > 0) {
      const heapGB = heapLimit / (1024 * 1024 * 1024);
      score = Math.max(score, Math.min(heapGB, 10));
    }
    
    // Penalty for Spicetify overhead
    if (this.config.spicetifyContext) {
      score *= 0.85; // 15% reduction for shared resources
    }
    
    return Math.min(Math.max(score, 1), 10);
  }
  
  private async _benchmarkSingleThreadPerformance(): Promise<number> {
    const cacheKey = 'singleThreadPerf';
    if (this.benchmarkCache.has(cacheKey)) {
      return this.benchmarkCache.get(cacheKey)!;
    }
    
    return new Promise((resolve) => {
      const start = performance.now();
      let result = 0;
      
      // CPU-intensive computation
      for (let i = 0; i < 500000; i++) {
        result += Math.sin(i) * Math.cos(i);
      }
      
      const duration = performance.now() - start;
      // Convert to 0-10 score (lower duration = higher score)
      const score = Math.max(1, Math.min(10, 50 / duration));
      
      this.benchmarkCache.set(cacheKey, score);
      resolve(score);
    });
  }
  
  private _estimateThermalThrottlingRisk(cores: number): number {
    // Estimate throttling risk based on core count and device type
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    
    let risk = 0.1; // Base risk
    if (cores >= 8) risk += 0.2;
    if (isMobile) risk += 0.3;
    
    return Math.min(risk, 1);
  }
  
  private _calculateCPUScore(cores: number, singleThreadPerf: number): number {
    // Weighted combination of core count and single-thread performance
    const coreScore = Math.min(cores / 2, 10); // Max 10 for 20+ cores
    const perfWeight = 0.7; // Single-thread performance is more important
    
    return Math.min(coreScore * (1 - perfWeight) + singleThreadPerf * perfWeight, 10);
  }
  
  private async _benchmarkWebGLCapabilities(): Promise<number> {
    const cacheKey = 'webglCapability';
    if (this.benchmarkCache.has(cacheKey)) {
      return this.benchmarkCache.get(cacheKey)!;
    }
    
    if (!this._detectWebGLSupport()) {
      this.benchmarkCache.set(cacheKey, 0);
      return 0;
    }
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      this.benchmarkCache.set(cacheKey, 0);
      return 0;
    }
    
    let score = 2; // Base score for WebGL support
    
    // Test various capabilities
    if (gl.getExtension('OES_texture_float')) score += 1;
    if (gl.getExtension('WEBGL_depth_texture')) score += 1;
    if (gl.getExtension('OES_element_index_uint')) score += 1;
    
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize >= 4096) score += 2;
    else if (maxTextureSize >= 2048) score += 1;
    
    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    if (maxVertexAttribs >= 16) score += 1;
    
    // WebGL2 bonus
    if (gl instanceof WebGL2RenderingContext) score += 2;
    
    this.benchmarkCache.set(cacheKey, Math.min(score, 10));
    return Math.min(score, 10);
  }
  
  private _calculateGPUScore(renderer: string, webglScore: number, hasWebGL2: boolean, maxTexture: number): number {
    let score = webglScore; // Base on actual WebGL capabilities
    
    // Renderer-based adjustments (more inclusive than before)
    const rendererLower = renderer.toLowerCase();
    if (/rtx|radeon rx|apple m[1-9]|arc a/.test(rendererLower)) {
      score += 2; // High-end GPUs
    } else if (/gtx|radeon|vega|iris xe|ryzen/.test(rendererLower)) {
      score += 1; // Mid-range GPUs
    } else if (/intel|qualcomm|mali|adreno/.test(rendererLower)) {
      // Don't penalize integrated GPUs as harshly
      score += 0.5;
    }
    
    return Math.min(Math.max(score, 1), 10);
  }
  
  private async _createSpicetifyProfile(memory: MemoryCapabilities, cpu: CPUCapabilities, gpu: GPUCapabilities): Promise<SpicetifyDeviceProfile> {
    const memoryScore = memory.score;
    const cpuScore = cpu.score;
    const gpuScore = gpu.score;
    
    // Composite score with weights appropriate for Spicetify themes
    const compositeScore = Math.round(
      (memoryScore * 0.3 + cpuScore * 0.4 + gpuScore * 0.3) * 10
    );
    
    // Calculate recommended quality level (0-100)
    let recommendedQuality = Math.min(compositeScore, 100);
    
    // Spicetify-specific adjustments
    if (this.config.spicetifyContext) {
      recommendedQuality *= (1 - memory.spicetifyOverhead);
    }
    
    // Ensure minimum quality for decent experience
    recommendedQuality = Math.max(recommendedQuality, 20);
    
    // Average confidence from component detections
    const confidenceLevel = (memory.confidenceLevel + cpu.confidenceLevel + gpu.confidenceLevel) / 3;
    
    return {
      memoryScore,
      cpuScore,
      gpuScore,
      compositeScore,
      spicetifyOverhead: memory.spicetifyOverhead,
      userQualityPreference: 'auto', // Default, will be overridden by settings
      confidenceLevel,
      recommendedQualityLevel: Math.round(recommendedQuality),
    };
  }

  private _calculateOverallPerformanceLevel(): "high" | "medium" | "low" {
    if (!this.deviceCapabilities) return "low";
    
    // Use enhanced composite score instead of individual component classification
    const compositeScore = this.deviceCapabilities.spicetifyProfile.compositeScore;
    const confidence = this.deviceCapabilities.spicetifyProfile.confidenceLevel;
    
    // Apply confidence penalty - reduce score if we're not confident about detection
    const adjustedScore = compositeScore * (0.7 + confidence * 0.3);
    
    if (adjustedScore >= 70) return "high";
    if (adjustedScore >= 40) return "medium";
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

  /**
   * Check if WebGL support is available (for ColorStrategySelector)
   */
  public hasWebGLSupport(): boolean {
    if (this.isInitialized && this.deviceCapabilities) {
      return this.deviceCapabilities.gpu.supportsWebGL;
    }
    // Fallback check if not initialized
    return this._detectWebGLSupport();
  }

  /**
   * Check if WebGL2 support is available
   */
  public hasWebGL2Support(): boolean {
    if (this.isInitialized && this.deviceCapabilities) {
      return this.deviceCapabilities.gpu.supportsWebGL2;
    }
    // Fallback check if not initialized  
    return this._detectWebGL2Support();
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

  // ===================================================================
  // ENHANCED TIER DETECTION (from EnhancedDeviceTierDetector)
  // ===================================================================

  /**
   * Enhanced tier detection with focus on giving most users full experience
   * Integrated from EnhancedDeviceTierDetector
   */
  public static detectTier(): TierDetectionResult {
    const capabilities = this._analyzeBasicCapabilities();
    const reasoning: string[] = [];
    
    let tier: 'high' | 'medium' | 'low' = 'medium'; // Default to full experience
    let confidence = 0.8; // Default confidence
    
    // High Tier Detection: True high-end devices only
    if (this._isHighTierDevice(capabilities, reasoning)) {
      tier = 'high';
      confidence = 0.9;
    }
    // Low Tier Detection: Only very budget/old devices
    else if (this._isLowTierDevice(capabilities, reasoning)) {
      tier = 'low';
      confidence = 0.85;
    }
    // Medium Tier: Most modern devices (default)
    else {
      reasoning.push('Standard modern device - full experience enabled');
      reasoning.push(`${capabilities.memory}GB RAM, ${capabilities.cores} cores, WebGL2: ${capabilities.webgl2}`);
    }
    
    const result: TierDetectionResult = {
      tier,
      confidence,
      reasoning,
      capabilities
    };
    
    console.log('🔍 [DeviceCapabilityDetector] Enhanced tier detection complete', result);
    
    return result;
  }

  private static _analyzeBasicCapabilities() {
    const memory = (navigator as any).deviceMemory || this._estimateMemory();
    const cores = navigator.hardwareConcurrency || this._estimateCores();
    const webgl = this._checkWebGLSupport();
    const webgl2 = this._checkWebGL2Support();
    const userAgent = navigator.userAgent;
    const platform = navigator.platform || 'unknown';
    
    return {
      memory,
      cores,
      webgl,
      webgl2,
      userAgent,
      platform,
      hardwareInfo: {
        isHighEnd: this._detectHighEndHardware(memory, cores, userAgent),
        isMobile: this._isMobileDevice(userAgent, platform),
        isOldDevice: this._isOldDevice(userAgent),
        hasPerformanceIndicators: this._hasPerformanceIndicators(userAgent)
      }
    };
  }

  private static _isHighTierDevice(capabilities: any, reasoning: string[]): boolean {
    const { memory, cores, webgl2, hardwareInfo } = capabilities;
    
    // Primary high-end criteria
    const hasHighEndSpecs = memory >= 8 && cores >= 6 && webgl2;
    
    if (!hasHighEndSpecs) {
      return false;
    }
    
    // Additional high-end indicators
    const indicators = [];
    
    if (memory >= 16) indicators.push('16+GB RAM');
    if (cores >= 8) indicators.push('8+ CPU cores');
    if (hardwareInfo.hasPerformanceIndicators) indicators.push('Performance GPU detected');
    if (hardwareInfo.isHighEnd) indicators.push('High-end hardware signatures');
    
    // Need at least 2 high-end indicators beyond base specs
    if (indicators.length >= 2) {
      reasoning.push('High-end device detected');
      reasoning.push(`Specs: ${memory}GB RAM, ${cores} cores, WebGL2: ${webgl2}`);
      reasoning.push(`Indicators: ${indicators.join(', ')}`);
      return true;
    }
    
    // Gaming/workstation detection
    if (this._isGamingOrWorkstation(capabilities)) {
      reasoning.push('Gaming/workstation device detected');
      reasoning.push(`High-performance device indicators found`);
      return true;
    }
    
    return false;
  }

  private static _isLowTierDevice(capabilities: any, reasoning: string[]): boolean {
    const { memory, cores, webgl2, hardwareInfo } = capabilities;
    
    // Very restrictive low-tier criteria - only truly limited devices
    const reasons = [];
    
    // Memory restrictions (very low memory only)
    if (memory < 4) {
      reasons.push(`Low memory: ${memory}GB`);
    }
    
    // CPU restrictions (very few cores only)
    if (cores < 4) {
      reasons.push(`Few CPU cores: ${cores}`);
    }
    
    // WebGL restrictions (no WebGL2 support)
    if (!webgl2) {
      reasons.push('No WebGL2 support');
    }
    
    // Old device detection
    if (hardwareInfo.isOldDevice) {
      reasons.push('Legacy device detected');
    }
    
    // Mobile with very limited specs
    if (hardwareInfo.isMobile && memory <= 4 && cores <= 4) {
      reasons.push('Resource-constrained mobile device');
    }
    
    // Need multiple limiting factors for low tier
    if (reasons.length >= 2) {
      reasoning.push('Budget/legacy device detected - enabling performance optimizations');
      reasoning.push(...reasons);
      return true;
    }
    
    return false;
  }

  private static _estimateMemory(): number {
    // Conservative memory estimation for devices without deviceMemory API
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('mobile') || ua.includes('android')) {
      return 4; // Most mobile devices have at least 4GB now
    }
    
    if (ua.includes('ipad') || ua.includes('tablet')) {
      return 6; // iPads typically have good specs
    }
    
    return 8; // Desktop default - most desktops have 8GB+
  }

  private static _estimateCores(): number {
    // Conservative core estimation
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('mobile')) {
      return 4; // Most modern mobile devices have 4+ cores
    }
    
    return 4; // Safe desktop default
  }

  private static _checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const hasWebGL = gl !== null;
      canvas.remove();
      return hasWebGL;
    } catch {
      return false;
    }
  }

  private static _checkWebGL2Support(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      const hasWebGL2 = gl !== null;
      canvas.remove();
      return hasWebGL2;
    } catch {
      return false;
    }
  }

  private static _detectHighEndHardware(memory: number, cores: number, userAgent: string): boolean {
    const ua = userAgent.toLowerCase();
    
    // Hardware indicators
    const indicators = [
      ua.includes('gaming'),
      ua.includes('nvidia'),
      ua.includes('amd'),
      ua.includes('geforce'),
      ua.includes('radeon'),
      memory >= 16,
      cores >= 8
    ];
    
    return indicators.filter(Boolean).length >= 2;
  }

  private static _isMobileDevice(userAgent: string, platform: string): boolean {
    const ua = userAgent.toLowerCase();
    const p = platform.toLowerCase();
    
    return (
      ua.includes('mobile') ||
      ua.includes('android') ||
      ua.includes('iphone') ||
      ua.includes('ipad') ||
      p.includes('arm') ||
      'ontouchstart' in window
    );
  }

  private static _isOldDevice(userAgent: string): boolean {
    const ua = userAgent.toLowerCase();
    
    // Old browser versions that indicate legacy hardware
    const oldBrowsers = [
      /chrome\/[1-6]\d\./, // Chrome < 70
      /firefox\/[1-5]\d\./, // Firefox < 60
      /safari\/[1-9]\./, // Very old Safari
      /msie|trident/, // Internet Explorer
    ];
    
    return oldBrowsers.some(pattern => pattern.test(ua));
  }

  private static _hasPerformanceIndicators(userAgent: string): boolean {
    const ua = userAgent.toLowerCase();
    
    // GPU/Performance indicators in user agent
    const indicators = [
      'nvidia',
      'amd',
      'geforce',
      'radeon',
      'quadro',
      'gaming',
      'performance'
    ];
    
    return indicators.some(indicator => ua.includes(indicator));
  }

  private static _isGamingOrWorkstation(capabilities: any): boolean {
    const { userAgent, memory, cores } = capabilities;
    const ua = userAgent.toLowerCase();
    
    // Gaming device indicators
    const gamingIndicators = [
      ua.includes('gaming'),
      ua.includes('nvidia'),
      ua.includes('geforce'),
      ua.includes('rog'), // ASUS ROG
      ua.includes('alienware'),
      memory >= 16 && cores >= 8
    ];
    
    return gamingIndicators.filter(Boolean).length >= 2;
  }
}
