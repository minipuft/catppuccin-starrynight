/**
 * Year 3000 Cinematic Palette Definitions for StarryNight Theme
 * 
 * Cinematic gradient color palettes extracted from Year 3000 visual guides.
 * Maintains identical interface to CatppuccinPalettes.ts for seamless switching.
 * Features smooth liquid flow aesthetics with high contrast dramatic gradients.
 * 
 * @architecture PaletteSystemManager integration
 * @performance Static color definitions for optimal lookup performance
 */

export type Year3000Flavor = 'subtle' | 'balanced' | 'cinematic' | 'maximum';
export type Year3000ColorName = 
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender' | 'text' | 'subtext1' | 'subtext0'
  | 'overlay2' | 'overlay1' | 'overlay0' | 'surface2' | 'surface1'
  | 'surface0' | 'base' | 'mantle' | 'crust';

export interface Year3000Color {
  hex: string;
  rgb: string; // "r, g, b" format for CSS var usage
  hsl: [number, number, number]; // [h, s, l]
  brightness: number; // 0-1 perceptual brightness for smart selection
}

export type Year3000Palette = {
  [K in Year3000ColorName]: Year3000Color;
}

// Helper function to create color objects (identical to CatppuccinPalettes)
function color(hex: string, h: number, s: number, l: number): Year3000Color {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate perceptual brightness (using relative luminance formula)
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return {
    hex,
    rgb: `${r}, ${g}, ${b}`,
    hsl: [h, s, l],
    brightness
  };
}

// Year 3000 Cinematic Gradient Palettes
export const YEAR3000_PALETTES: Record<Year3000Flavor, Year3000Palette> = {
  // Subtle: Muted cinematic tones for professional environments
  subtle: {
    rosewater: color('#e8d5d1', 15, 45, 85),
    flamingo: color('#e5c3c3', 0, 45, 82),
    pink: color('#d8a8cc', 316, 40, 75),
    mauve: color('#9d7bc7', 267, 45, 65),      // Electric Purple (muted)
    red: color('#c85a7a', 343, 45, 60),
    maroon: color('#c27882', 350, 35, 65),
    peach: color('#d18a5f', 23, 50, 60),
    yellow: color('#d4c285', 41, 45, 70),
    green: color('#8cc98a', 115, 35, 65),
    teal: color('#7bc5b8', 174, 35, 65),
    sky: color('#7ab5c7', 189, 40, 65),
    sapphire: color('#6baac7', 199, 45, 60),
    blue: color('#7d9dd4', 217, 50, 65),       // Electric Blue (muted)
    lavender: color('#a8aed9', 232, 45, 75),
    text: color('#c2c8d4', 226, 25, 80),
    subtext1: color('#b2b8c8', 227, 20, 72),
    subtext0: color('#9ca4b8', 228, 15, 65),
    overlay2: color('#868ea8', 228, 12, 58),
    overlay1: color('#757d95', 230, 10, 52),
    overlay0: color('#656c82', 231, 8, 45),
    surface2: color('#555c70', 233, 8, 38),
    surface1: color('#454c5a', 234, 8, 32),
    surface0: color('#353a46', 237, 10, 25),
    base: color('#252832', 240, 12, 17),
    mantle: color('#1f222a', 240, 10, 15),
    crust: color('#181b22', 240, 15, 12)
  },

  // Balanced: Moderate cinematic intensity with vibrant gradients
  balanced: {
    rosewater: color('#f2d8d3', 15, 60, 88),
    flamingo: color('#eec6c6', 0, 60, 85),
    pink: color('#e8b3d8', 316, 55, 80),
    mauve: color('#b388d6', 267, 55, 70),      // Electric Purple (balanced)
    red: color('#d16b8a', 343, 55, 65),
    maroon: color('#d08692', 350, 45, 70),
    peach: color('#e59a6f', 23, 65, 65),
    yellow: color('#e0d295', 41, 55, 75),
    green: color('#9cd49a', 115, 40, 70),
    teal: color('#8bd0c3', 174, 40, 70),
    sky: color('#8ac0d2', 189, 50, 70),
    sapphire: color('#7bb5d2', 199, 55, 65),
    blue: color('#8da8e0', 217, 60, 70),       // Electric Blue (balanced)
    lavender: color('#b8bee5', 232, 55, 80),
    text: color('#ced4e0', 226, 35, 85),
    subtext1: color('#bec4d3', 227, 25, 77),
    subtext0: color('#a8b0c3', 228, 20, 70),
    overlay2: color('#929ab3', 228, 15, 63),
    overlay1: color('#8289a0', 230, 12, 57),
    overlay0: color('#72798f', 231, 10, 50),
    surface2: color('#62697d', 233, 10, 43),
    surface1: color('#525968', 234, 10, 37),
    surface0: color('#424954', 237, 12, 30),
    base: color('#2f323e', 240, 15, 22),
    mantle: color('#282b36', 240, 12, 19),
    crust: color('#21242e', 240, 18, 16)
  },

  // Cinematic: Full intensity Year 3000 gradients with dramatic contrast
  cinematic: {
    rosewater: color('#fce0db', 15, 85, 92),
    flamingo: color('#f5c9c9', 0, 85, 88),
    pink: color('#ff6b9d', 316, 100, 70),     // Vivid Magenta (from visual guide)
    mauve: color('#6c5ce7', 267, 85, 65),     // Electric Purple (from visual guide)
    red: color('#ff4757', 343, 100, 65),      // Cosmic Red (from visual guide)
    maroon: color('#e84393', 350, 80, 70),
    peach: color('#fd7f28', 23, 95, 58),      // Luminous Orange (from visual guide)
    yellow: color('#f39c12', 41, 88, 52),
    green: color('#a6e3a1', 115, 54, 76),
    teal: color('#00cec9', 174, 100, 40),     // Neon Cyan (from visual guide)
    sky: color('#74b9ff', 189, 100, 72),      // Electric Blue (from visual guide)
    sapphire: color('#0984e3', 199, 100, 46),
    blue: color('#a29bfe', 217, 95, 80),
    lavender: color('#c77dff', 232, 100, 75),
    text: color('#e8f0ff', 226, 100, 95),
    subtext1: color('#d0d8f0', 227, 65, 88),
    subtext0: color('#b8c0d8', 228, 45, 80),
    overlay2: color('#a0a8c0', 228, 30, 70),
    overlay1: color('#8890a8', 230, 20, 60),
    overlay0: color('#707890', 231, 15, 50),
    surface2: color('#586078', 233, 15, 42),
    surface1: color('#485060', 234, 15, 35),
    surface0: color('#384048', 237, 18, 28),
    base: color('#202030', 240, 25, 16),
    mantle: color('#181828', 240, 22, 13),
    crust: color('#101020', 240, 30, 9)
  },

  // Maximum: Ultra-intense Year 3000 with maximum saturation and contrast
  maximum: {
    rosewater: color('#ffe5e0', 15, 100, 95),
    flamingo: color('#ffcccc', 0, 100, 90),
    pink: color('#ff3d7f', 316, 100, 62),     // Maximum Vivid Magenta
    mauve: color('#5a4fcf', 267, 100, 55),    // Maximum Electric Purple
    red: color('#ff2942', 343, 100, 58),      // Maximum Cosmic Red
    maroon: color('#e6337a', 350, 90, 65),
    peach: color('#ff6500', 23, 100, 50),     // Maximum Luminous Orange
    yellow: color('#f1c40f', 48, 89, 50),
    green: color('#00ff88', 150, 100, 50),
    teal: color('#00ffff', 180, 100, 50),     // Maximum Neon Cyan
    sky: color('#4da6ff', 189, 100, 65),      // Maximum Electric Blue
    sapphire: color('#0066ff', 199, 100, 50),
    blue: color('#8a7fff', 217, 100, 75),
    lavender: color('#b347ff', 232, 100, 65),
    text: color('#ffffff', 0, 0, 100),
    subtext1: color('#e8e8ff', 240, 100, 95),
    subtext0: color('#d0d0ff', 240, 100, 90),
    overlay2: color('#b8b8ff', 240, 100, 85),
    overlay1: color('#a0a0ff', 240, 100, 80),
    overlay0: color('#8888ff', 240, 100, 75),
    surface2: color('#4040aa', 240, 60, 45),
    surface1: color('#303088', 240, 65, 35),
    surface0: color('#202066', 240, 70, 25),
    base: color('#0f0f33', 240, 70, 13),
    mantle: color('#0a0a22', 240, 75, 10),
    crust: color('#050511', 240, 80, 5)
  }
};

// Brightness-aware color selection utilities (identical interface to Catppuccin)
export interface BrightnessConfig {
  baseColorTarget: number; // 0-1 target brightness for base colors
  surfaceColorTarget: number; // 0-1 target brightness for surface colors
  textContrastMin: number; // minimum contrast ratio for text
}

export const BRIGHTNESS_CONFIGS: Record<'bright' | 'balanced' | 'dark', BrightnessConfig> = {
  bright: {
    baseColorTarget: 0.25, // Lighter base colors
    surfaceColorTarget: 0.35,
    textContrastMin: 4.5
  },
  balanced: {
    baseColorTarget: 0.15, // Standard base colors  
    surfaceColorTarget: 0.25,
    textContrastMin: 4.5
  },
  dark: {
    baseColorTarget: 0.08, // Darker base colors
    surfaceColorTarget: 0.15,
    textContrastMin: 3.0 // Slightly lower contrast for dark mode comfort
  }
};

/**
 * Get brightness-adjusted base color for a Year 3000 flavor
 */
export function getBrightnessAdjustedBaseColor(
  flavor: Year3000Flavor, 
  brightnessMode: 'bright' | 'balanced' | 'dark'
): Year3000Color {
  const palette = YEAR3000_PALETTES[flavor];
  const config = BRIGHTNESS_CONFIGS[brightnessMode];
  
  // For bright mode, use surface colors; for dark mode, use deeper colors
  switch (brightnessMode) {
    case 'bright':
      return palette.surface1;
    case 'balanced':
      return palette.surface0;
    case 'dark':
      return palette.base;
    default:
      return palette.base;
  }
}

/**
 * Get brightness-adjusted surface color for a Year 3000 flavor
 */
export function getBrightnessAdjustedSurfaceColor(
  flavor: Year3000Flavor,
  brightnessMode: 'bright' | 'balanced' | 'dark'
): Year3000Color {
  const palette = YEAR3000_PALETTES[flavor];
  
  switch (brightnessMode) {
    case 'bright':
      return palette.surface2;
    case 'balanced':
      return palette.surface1;
    case 'dark':
      return palette.surface0;
    default:
      return palette.surface1;
  }
}

/**
 * Get the accent color from a Year 3000 palette by name
 */
export function getYear3000AccentColor(
  flavor: Year3000Flavor,
  accentName: Year3000ColorName
): Year3000Color {
  return YEAR3000_PALETTES[flavor][accentName];
}

/**
 * Get default accent color for a flavor (electric purple for dramatic contrast)
 */
export function getDefaultAccentColor(flavor: Year3000Flavor): Year3000Color {
  const palette = YEAR3000_PALETTES[flavor];
  return palette.mauve; // Electric Purple as primary accent across all flavors
}

/**
 * Get cinematic gradient pair for flowing transitions
 */
export function getCinematicGradientPair(
  flavor: Year3000Flavor,
  intensity: 'low' | 'medium' | 'high' = 'medium'
): [Year3000Color, Year3000Color] {
  const palette = YEAR3000_PALETTES[flavor];
  
  switch (intensity) {
    case 'low':
      return [palette.mauve, palette.blue]; // Electric Purple → Electric Blue
    case 'medium':
      return [palette.pink, palette.peach]; // Vivid Magenta → Luminous Orange
    case 'high':
      return [palette.red, palette.teal]; // Cosmic Red → Neon Cyan
    default:
      return [palette.mauve, palette.pink]; // Electric Purple → Vivid Magenta
  }
}

/**
 * Get animated flow colors for visual movement effects
 */
export function getAnimatedFlowColors(flavor: Year3000Flavor): {
  primary: Year3000Color;
  secondary: Year3000Color;
  tertiary: Year3000Color;
  atmosphere: Year3000Color;
} {
  const palette = YEAR3000_PALETTES[flavor];
  
  return {
    primary: palette.mauve,    // Electric Purple
    secondary: palette.pink,   // Vivid Magenta
    tertiary: palette.sky,     // Electric Blue
    atmosphere: palette.base   // Deep cosmic background
  };
}