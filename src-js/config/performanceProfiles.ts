/**
 * Performance profiles and optimization configurations
 * Device capability detection and quality scaling
 */

export interface PerformanceProfile {
  maxParticles: number;
  animationThrottle: number;
  enableGPUAcceleration: boolean;
  enableAdvancedShaders: boolean;
  textureResolution: number;
}

export interface LoggingConfig {
  level: "off" | "error" | "warn" | "info" | "debug" | "verbose";
  performance: {
    enableFrameBudgetWarnings: boolean;
    throttleWarnings: boolean;
    throttleInterval: number;
    enableAdaptiveDegradation: boolean;
  };
}

/**
 * Performance profiles for different device capabilities
 */
export const PERFORMANCE_PROFILES: Record<string, PerformanceProfile> = {
  low: {
    maxParticles: 15,
    animationThrottle: 32,        // ~30fps
    enableGPUAcceleration: false,
    enableAdvancedShaders: false,
    textureResolution: 0.5,
  },
  
  balanced: {
    maxParticles: 40,
    animationThrottle: 16,        // ~60fps
    enableGPUAcceleration: true,
    enableAdvancedShaders: false,
    textureResolution: 1.0,
  },
  
  high: {
    maxParticles: 75,
    animationThrottle: 16,        // ~60fps
    enableGPUAcceleration: true,
    enableAdvancedShaders: true,
    textureResolution: 1.0,
  },
  
  ultra: {
    maxParticles: 150,
    animationThrottle: 8,         // ~120fps
    enableGPUAcceleration: true,
    enableAdvancedShaders: true,
    textureResolution: 2.0,       // High-res textures
  },
};

/**
 * Default logging configuration
 */
export const DEFAULT_LOGGING_CONFIG: LoggingConfig = {
  level: "info",
  performance: {
    enableFrameBudgetWarnings: true,
    throttleWarnings: true,
    throttleInterval: 5000,       // ms between repeated warnings
    enableAdaptiveDegradation: true,
  },
};

/**
 * Performance monitoring thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  // Frame timing thresholds (ms)
  frame: {
    good: 16,      // 60fps
    acceptable: 33, // 30fps
    poor: 50,      // 20fps
  },
  
  // Memory usage thresholds (MB)
  memory: {
    good: 30,
    acceptable: 50,
    poor: 100,
  },
  
  // GPU usage thresholds (%)
  gpu: {
    good: 25,
    acceptable: 50,
    poor: 75,
  },
} as const;

/**
 * Device capability detection parameters
 */
export const DEVICE_DETECTION_CONFIG = {
  // CPU core count thresholds
  cpuCores: {
    low: 2,
    medium: 4,
    high: 8,
  },
  
  // Memory thresholds (GB)
  memory: {
    low: 4,
    medium: 8,
    high: 16,
  },
  
  // WebGL feature detection
  webgl: {
    requiredExtensions: [
      "OES_texture_float",
      "WEBGL_color_buffer_float",
    ],
    optionalExtensions: [
      "EXT_color_buffer_half_float",
      "OES_texture_half_float",
      "WEBGL_depth_texture",
    ],
  },
  
  // Performance test parameters
  benchmarks: {
    particleCount: 1000,
    testDuration: 2000,      // ms
    targetFrameRate: 45,     // minimum acceptable fps
  },
} as const;

/**
 * Get performance profile by key
 */
export function getPerformanceProfile(key: string): PerformanceProfile {
  return (PERFORMANCE_PROFILES[key] as PerformanceProfile) || PERFORMANCE_PROFILES.balanced;
}

/**
 * Get all available performance profile keys
 */
export function getPerformanceProfileKeys(): string[] {
  return Object.keys(PERFORMANCE_PROFILES);
}

/**
 * Validate performance profile key
 */
export function isValidPerformanceProfile(key: string): key is keyof typeof PERFORMANCE_PROFILES {
  return key in PERFORMANCE_PROFILES;
}

/**
 * Determine performance profile based on device capabilities
 */
export function detectOptimalPerformanceProfile(deviceInfo: {
  cpuCores?: number;
  memory?: number;
  hasWebGL?: boolean;
  hasAdvancedShaders?: boolean;
  benchmarkScore?: number;
}): keyof typeof PERFORMANCE_PROFILES {
  let score = 0;
  
  // CPU scoring
  if (deviceInfo.cpuCores) {
    if (deviceInfo.cpuCores >= DEVICE_DETECTION_CONFIG.cpuCores.high) score += 3;
    else if (deviceInfo.cpuCores >= DEVICE_DETECTION_CONFIG.cpuCores.medium) score += 2;
    else if (deviceInfo.cpuCores >= DEVICE_DETECTION_CONFIG.cpuCores.low) score += 1;
  }
  
  // Memory scoring
  if (deviceInfo.memory) {
    if (deviceInfo.memory >= DEVICE_DETECTION_CONFIG.memory.high) score += 3;
    else if (deviceInfo.memory >= DEVICE_DETECTION_CONFIG.memory.medium) score += 2;
    else if (deviceInfo.memory >= DEVICE_DETECTION_CONFIG.memory.low) score += 1;
  }
  
  // GPU capabilities
  if (deviceInfo.hasWebGL) score += 2;
  if (deviceInfo.hasAdvancedShaders) score += 2;
  
  // Benchmark results
  if (deviceInfo.benchmarkScore) {
    if (deviceInfo.benchmarkScore > 80) score += 3;
    else if (deviceInfo.benchmarkScore > 60) score += 2;
    else if (deviceInfo.benchmarkScore > 40) score += 1;
  }
  
  // Determine profile based on total score
  if (score >= 10) return "ultra";
  if (score >= 7) return "high";
  if (score >= 4) return "balanced";
  return "low";
}

/**
 * Calculate frame budget for given FPS target
 */
export function calculateFrameBudget(targetFPS: number): number {
  return 1000 / targetFPS; // ms per frame
}

/**
 * Check if current performance meets targets
 */
export function isPerformanceMeetingTargets(metrics: {
  frameTime: number;
  memoryUsage: number;
  gpuUsage?: number;
}): {
  overall: "good" | "acceptable" | "poor";
  frame: "good" | "acceptable" | "poor";
  memory: "good" | "acceptable" | "poor";
  gpu?: "good" | "acceptable" | "poor";
} {
  const frameStatus = metrics.frameTime <= PERFORMANCE_THRESHOLDS.frame.good ? "good" :
                     metrics.frameTime <= PERFORMANCE_THRESHOLDS.frame.acceptable ? "acceptable" : "poor";
                     
  const memoryStatus = metrics.memoryUsage <= PERFORMANCE_THRESHOLDS.memory.good ? "good" :
                      metrics.memoryUsage <= PERFORMANCE_THRESHOLDS.memory.acceptable ? "acceptable" : "poor";
                      
  const gpuStatus = metrics.gpuUsage ? 
    (metrics.gpuUsage <= PERFORMANCE_THRESHOLDS.gpu.good ? "good" :
     metrics.gpuUsage <= PERFORMANCE_THRESHOLDS.gpu.acceptable ? "acceptable" : "poor") :
    undefined;
  
  const statuses = [frameStatus, memoryStatus, gpuStatus].filter(Boolean);
  const overallStatus = statuses.includes("poor") ? "poor" :
                       statuses.includes("acceptable") ? "acceptable" : "good";
  
  const result: {
    overall: "good" | "acceptable" | "poor";
    frame: "good" | "acceptable" | "poor";
    memory: "good" | "acceptable" | "poor";
    gpu?: "good" | "acceptable" | "poor";
  } = {
    overall: overallStatus,
    frame: frameStatus,
    memory: memoryStatus,
  };
  
  if (gpuStatus) {
    result.gpu = gpuStatus;
  }
  
  return result;
}

/**
 * Get quality scaling recommendations
 */
export function getQualityScalingRecommendations(
  currentPerformance: ReturnType<typeof isPerformanceMeetingTargets>
): {
  shouldReduceQuality: boolean;
  shouldIncreaseQuality: boolean;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let shouldReduce = false;
  let shouldIncrease = false;
  
  if (currentPerformance.overall === "poor") {
    shouldReduce = true;
    recommendations.push("Reduce particle count");
    recommendations.push("Increase animation throttle");
    
    if (currentPerformance.frame === "poor") {
      recommendations.push("Disable advanced shaders");
    }
    
    if (currentPerformance.memory === "poor") {
      recommendations.push("Reduce texture resolution");
    }
  } else if (currentPerformance.overall === "good") {
    shouldIncrease = true;
    recommendations.push("Consider increasing quality settings");
    recommendations.push("Enable advanced features if available");
  }
  
  return {
    shouldReduceQuality: shouldReduce,
    shouldIncreaseQuality: shouldIncrease,
    recommendations,
  };
}