import type { ArtisticMode, ArtisticModeProfile, ArtisticModeProfiles } from "@/types/models";

/**
 * Advanced System Artistic Mode Profiles
 * Complete system definitions for visual intensity and behavior presets
 */

export const ARTISTIC_MODE_PROFILES: ArtisticModeProfiles = {
  "corporate-safe": {
    displayName: "Corporate Safe",
    description: "Subtle gradient elegance with professional restraint and refined color transitions",
    philosophy: "Gentle gradient flows that maintain workspace harmony while providing sophisticated visual depth",
    
    multipliers: {
      opacity: 0.2,
      saturation: 1.15,        // Enhanced for subtle gradient definition
      brightness: 1.08,        // Improved brightness for gentle luminance
      contrast: 1.05,          // Slight contrast improvement for definition
      musicEnergyBoost: 0.4,
      
      // Animation Parameters
      animationIntensity: 0.3,
      timeBasedEffectFactor: 0.2,
      interactionStrength: 0.2,
      advancedAnimations: false,
      visualIntensityBase: 0.9,
      
      // Legacy compatibility
      kineticIntensity: 0.3,
      timeBasedPlayFactor: 0.2,
      aestheticGravityStrength: 0.2,
      emergentChoreography: false,
    },
    
    features: {
      rippleEffects: false,
      timeBasedEcho: false,
      particleStreams: false,
      predictiveHighlights: true,  // Subtle only
      glassEffects: true,          // Minimal
      beatSync: false,
      colorHarmony: false,
      userInteractions: false,     // Disabled for professional environments
      aestheticGravity: false,     // Legacy compatibility
    },
    
    performance: {
      maxParticles: 0,
      animationThrottle: 32,       // 30fps for efficiency
      enableGPUAcceleration: false,
      reducedMotion: true,
    },
  },

  "artist-vision": {
    displayName: "Artist Vision", 
    description: "Cinematic gradient expression with vibrant, flowing color transitions",
    philosophy: "Dramatic gradient harmonies that create depth and emotional resonance through bold color interactions",
    
    multipliers: {
      opacity: 0.35,
      saturation: 1.45,          // Enhanced for vibrant gradients
      brightness: 1.25,          // Increased luminance for gradient depth
      contrast: 1.3,             // Higher contrast for dramatic effects
      musicEnergyBoost: 1.2,
      
      // Animation Parameters
      animationIntensity: 0.8,
      timeBasedEffectFactor: 0.7,
      interactionStrength: 0.6,
      advancedAnimations: true,
      visualIntensityBase: 1.2,
      
      // Legacy compatibility
      kineticIntensity: 0.8,
      timeBasedPlayFactor: 0.7,
      aestheticGravityStrength: 0.6,
      emergentChoreography: true,
    },
    
    features: {
      rippleEffects: true,         // Moderate intensity
      timeBasedEcho: true,          // Subtle trails
      particleStreams: true,       // Music-responsive
      predictiveHighlights: true,
      glassEffects: true,
      beatSync: true,              // Musical harmony
      colorHarmony: true,          // Respectful blending
      userInteractions: true,      // Balanced interaction effects
      aestheticGravity: true,      // Legacy compatibility
    },
    
    performance: {
      maxParticles: 20,
      animationThrottle: 16,       // 60fps
      enableGPUAcceleration: true,
      reducedMotion: false,
    },
  },

  "advanced-maximum": {
    displayName: "Advanced Maximum",
    description: "Ultra-intense cinematic gradients with maximum color saturation and fluid dynamics", 
    philosophy: "Maximum gradient intensity through electric color combinations that create immersive visual landscapes",
    
    multipliers: {
      opacity: 0.55,
      saturation: 1.65,          // Maximum saturation for electric gradients
      brightness: 1.35,          // Enhanced brightness for luminous effects
      contrast: 1.5,             // Maximum contrast for dramatic depth
      musicEnergyBoost: 2.5,
      
      // Animation Parameters
      animationIntensity: 2.0,
      timeBasedEffectFactor: 3.0,
      interactionStrength: 2.0,
      advancedAnimations: true,
      visualIntensityBase: 1.8,
      
      // Legacy compatibility
      kineticIntensity: 2.0,
      timeBasedPlayFactor: 3.0,
      aestheticGravityStrength: 2.0,
      emergentChoreography: true,
    },
    
    features: {
      rippleEffects: true,         // Full intensity
      timeBasedEcho: true,          // Visible trails
      particleStreams: true,       // Attention flow
      predictiveHighlights: true,  // Advanced prediction
      glassEffects: true,          // Intense
      beatSync: true,              // Full synchronization
      colorHarmony: true,          // Dynamic evolution
      userInteractions: true,      // Visual magnetism
      aestheticGravity: true,      // Legacy compatibility
    },
    
    performance: {
      maxParticles: 50,
      animationThrottle: 30,       // 30fps for smoothness
      enableGPUAcceleration: true,
      reducedMotion: false,
    },
  },
};

/**
 * Default artistic mode
 */
export const DEFAULT_ARTISTIC_MODE: ArtisticMode = "artist-vision";

/**
 * Get artistic mode profile by key
 */
export function getArtisticProfile(mode: ArtisticMode): ArtisticModeProfile {
  return ARTISTIC_MODE_PROFILES[mode] || ARTISTIC_MODE_PROFILES[DEFAULT_ARTISTIC_MODE]!;
}

/**
 * Get all available artistic mode keys
 */
export function getArtisticModeKeys(): ArtisticMode[] {
  return Object.keys(ARTISTIC_MODE_PROFILES) as ArtisticMode[];
}

/**
 * Validate artistic mode key
 */
export function isValidArtisticMode(mode: string): mode is ArtisticMode {
  return mode in ARTISTIC_MODE_PROFILES;
}

/**
 * Get performance tier for artistic mode
 */
export function getArtisticPerformanceTier(mode: ArtisticMode): "low" | "medium" | "high" {
  const profile = getArtisticProfile(mode);
  
  if (!profile.performance.enableGPUAcceleration || profile.performance.reducedMotion) {
    return "low";
  }
  
  if (profile.performance.maxParticles >= 40) {
    return "high"; 
  }
  
  return "medium";
}

/**
 * Get suggested device requirements for artistic mode
 */
export function getArtisticDeviceRequirements(mode: ArtisticMode): {
  minMemory: string;
  minGPU: string;
  recommended: string;
} {
  switch (mode) {
    case "corporate-safe":
      return {
        minMemory: "2GB RAM",
        minGPU: "Any integrated graphics",
        recommended: "For business/productivity environments",
      };
      
    case "artist-vision":
      return {
        minMemory: "4GB RAM", 
        minGPU: "Dedicated graphics preferred",
        recommended: "For creative and immersive experiences",
      };
      
    case "cosmic-maximum":
      return {
        minMemory: "8GB RAM",
        minGPU: "Modern dedicated graphics required", 
        recommended: "For high-performance gaming/creative workstations",
      };
      
    default:
      return getArtisticDeviceRequirements(DEFAULT_ARTISTIC_MODE);
  }
}

/**
 * Calculate effective multiplier based on device performance
 */
export function getEffectiveMultiplier(
  baseMultiplier: number, 
  devicePerformanceFactor: number = 1.0
): number {
  return Math.max(0.1, Math.min(2.0, baseMultiplier * devicePerformanceFactor));
}

/**
 * Get color temperature adjustment for artistic mode
 */
export function getArtisticColorTemperature(mode: ArtisticMode): number {
  const profile = getArtisticProfile(mode);
  
  // Warmer for corporate (comfortable), cooler for cosmic (dramatic)
  switch (mode) {
    case "corporate-safe": return 0.1;   // Slightly warmer
    case "artist-vision": return 0.0;    // Neutral
    case "advanced-maximum":
    case "cosmic-maximum": return -0.15; // Cooler/more dramatic (legacy compatibility)
    default: return 0.0;
  }
}

// =========================================================================
// BACKWARD COMPATIBILITY
// =========================================================================

// Add cosmic-maximum as an alias to advanced-maximum for backward compatibility
ARTISTIC_MODE_PROFILES["cosmic-maximum"] = {
  ...ARTISTIC_MODE_PROFILES["advanced-maximum"],
  displayName: "Cosmic Maximum", // Keep original display name for UI
  description: "Ultra-intense cinematic gradients with maximum color saturation and fluid dynamics",
  philosophy: "Maximum gradient intensity through electric color combinations that create immersive visual landscapes",
} as ArtisticModeProfile;