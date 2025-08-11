// === PRESERVED ESSENTIAL SETTINGS (13 total) ===

// Core theme settings
export const ACCENT_COLOR_KEY = "catppuccin-accentColor";
export const CATPPUCCIN_FLAVOR_KEY = "catppuccin-flavor";
export const BRIGHTNESS_MODE_KEY = "sn-brightness-mode";

// Advanced systems (preserved)
export const PALETTE_SYSTEM_KEY = "sn-palette-system";
export const ARTISTIC_MODE_KEY = "sn-artistic-mode";
export const HARMONIC_MODE_KEY = "sn-current-harmonic-mode";
export const HARMONIC_INTENSITY_KEY = "sn-harmonic-intensity";
export const HARMONIC_EVOLUTION_KEY = "sn-harmonic-evolution";

// Visual controls (consolidated gradient intensity is the master control)
export const GRADIENT_INTENSITY_KEY = "sn-gradient-intensity";
export const GLASS_LEVEL_KEY = "sn-glassmorphism-level";

// Performance settings
export const WEBGL_ENABLED_KEY = "sn-webgl-enabled";
export const ANIMATION_QUALITY_KEY = "sn-animation-quality";
export const WEBGL_QUALITY_KEY = "sn-webgl-quality";

// === REMOVED SETTINGS ===
// These settings have been consolidated or removed:
// - STAR_DENSITY_KEY (consolidated into GRADIENT_INTENSITY_KEY)
// - NEBULA_INTENSITY_KEY (consolidated into GRADIENT_INTENSITY_KEY)  
// - FLOW_GRADIENT_KEY (consolidated into GRADIENT_INTENSITY_KEY)
// - ENABLE_ABERRATION_KEY (removed - technical/niche setting)
// - VISUAL_INTENSITY_KEY (overlapping with gradient intensity)
// - MANUAL_BASE_COLOR_KEY (overlapping with harmonic system)
// - WEBGL_FORCE_ENABLED_KEY (overlapping with webgl-enabled)
// - CARD_3D_LEVEL_KEY (removed - niche setting)
// - GLASS_LEVEL_OLD_KEY (legacy compatibility, no longer needed)
