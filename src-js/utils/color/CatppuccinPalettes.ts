/**
 * Catppuccin Palette Definitions for StarryNight Theme
 * 
 * Complete color palettes for all 4 Catppuccin flavors with proper RGB and hex values.
 * Supports brightness-aware color selection and dynamic fallback coordination.
 * 
 * @architecture ColorStateManager integration
 * @performance Static color definitions for optimal lookup performance
 */

export type CatppuccinFlavor = 'mocha' | 'latte' | 'frappe' | 'macchiato';
export type CatppuccinColorName = 
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender' | 'text' | 'subtext1' | 'subtext0'
  | 'overlay2' | 'overlay1' | 'overlay0' | 'surface2' | 'surface1'
  | 'surface0' | 'base' | 'mantle' | 'crust';

export interface CatppuccinColor {
  hex: string;
  rgb: string; // "r, g, b" format for CSS var usage
  hsl: [number, number, number]; // [h, s, l]
  brightness: number; // 0-1 perceptual brightness for smart selection
}

export type CatppuccinPalette = {
  [K in CatppuccinColorName]: CatppuccinColor;
}

// Helper function to create color objects
function color(hex: string, h: number, s: number, l: number): CatppuccinColor {
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

// Complete Catppuccin palette definitions
export const CATPPUCCIN_PALETTES: Record<CatppuccinFlavor, CatppuccinPalette> = {
  mocha: {
    rosewater: color('#f5e0dc', 10, 56, 91),
    flamingo: color('#f2cdcd', 0, 59, 88),
    pink: color('#f5c2e7', 316, 72, 86),
    mauve: color('#cba6f7', 267, 84, 81),
    red: color('#f38ba8', 343, 81, 75),
    maroon: color('#eba0ac', 350, 65, 77),
    peach: color('#fab387', 23, 92, 75),
    yellow: color('#f9e2af', 41, 86, 83),
    green: color('#a6e3a1', 115, 54, 76),
    teal: color('#94e2d5', 174, 57, 73),
    sky: color('#89dceb', 189, 71, 73),
    sapphire: color('#74c7ec', 199, 76, 69),
    blue: color('#89b4fa', 217, 92, 76),
    lavender: color('#b4befe', 232, 97, 85),
    text: color('#cdd6f4', 226, 64, 88),
    subtext1: color('#bac2de', 227, 35, 80),
    subtext0: color('#a6adc8', 228, 24, 72),
    overlay2: color('#9399b2', 228, 17, 64),
    overlay1: color('#7f849c', 230, 13, 55),
    overlay0: color('#6c7086', 231, 11, 47),
    surface2: color('#585b70', 233, 12, 39),
    surface1: color('#45475a', 234, 13, 31),
    surface0: color('#313244', 237, 16, 23),
    base: color('#1e1e2e', 240, 21, 15),
    mantle: color('#181825', 240, 18, 13),
    crust: color('#11111b', 240, 23, 9)
  },
  
  latte: {
    rosewater: color('#dc8a78', 11, 59, 67),
    flamingo: color('#dd7878', 0, 60, 67),
    pink: color('#ea76cb', 316, 73, 69),
    mauve: color('#8839ef', 266, 85, 58),
    red: color('#d20f39', 347, 87, 44),
    maroon: color('#e64553', 355, 76, 59),
    peach: color('#fe640b', 22, 99, 52),
    yellow: color('#df8e1d', 35, 77, 49),
    green: color('#40a02b', 109, 58, 40),
    teal: color('#179299', 183, 74, 35),
    sky: color('#04a5e5', 197, 97, 46),
    sapphire: color('#209fb5', 189, 70, 42),
    blue: color('#1e66f5', 220, 91, 54),
    lavender: color('#7287fd', 231, 97, 72),
    text: color('#4c4f69', 234, 16, 35),
    subtext1: color('#5c5f77', 233, 13, 41),
    subtext0: color('#6c6f85', 233, 10, 47),
    overlay2: color('#7c7f93', 232, 10, 53),
    overlay1: color('#8c8fa1', 231, 10, 59),
    overlay0: color('#9ca0b0', 228, 11, 65),
    surface2: color('#acb0be', 227, 12, 71),
    surface1: color('#bcc0cc', 226, 14, 77),
    surface0: color('#ccd0da', 225, 16, 83),
    base: color('#eff1f5', 220, 23, 95),
    mantle: color('#e6e9ef', 220, 22, 92),
    crust: color('#dce0e8', 220, 21, 89)
  },
  
  frappe: {
    rosewater: color('#f2d5cf', 10, 57, 88),
    flamingo: color('#eebebe', 0, 58, 84),
    pink: color('#f4b8e4', 316, 73, 84),
    mauve: color('#ca9ee6', 277, 59, 76),
    red: color('#e78284', 359, 68, 71),
    maroon: color('#ea999c', 358, 56, 76),
    peach: color('#ef9f76', 20, 79, 70),
    yellow: color('#e5c890', 40, 62, 73),
    green: color('#a6d189', 96, 44, 68),
    teal: color('#81c8be', 172, 39, 65),
    sky: color('#99d1db', 189, 48, 73),
    sapphire: color('#85c1dc', 199, 55, 69),
    blue: color('#8caaee', 222, 74, 74),
    lavender: color('#babbf1', 239, 66, 84),
    text: color('#c6d0f5', 227, 70, 87),
    subtext1: color('#b5bfe2', 229, 44, 80),
    subtext0: color('#a5adce', 230, 34, 72),
    overlay2: color('#949cbb', 231, 19, 64),
    overlay1: color('#838ba7', 232, 16, 56),
    overlay0: color('#737994', 232, 13, 49),
    surface2: color('#626880', 233, 16, 42),
    surface1: color('#51576d', 234, 16, 35),
    surface0: color('#414559', 235, 16, 30),
    base: color('#303446', 229, 19, 23),
    mantle: color('#292c3c', 231, 19, 20),
    crust: color('#232634', 229, 20, 17)
  },
  
  macchiato: {
    rosewater: color('#f4dbd6', 10, 58, 90),
    flamingo: color('#f0c6c6', 0, 58, 86),
    pink: color('#f5bde6', 316, 74, 85),
    mauve: color('#c6a0f6', 267, 83, 79),
    red: color('#ed8796', 351, 74, 73),
    maroon: color('#ee99a0', 357, 70, 77),
    peach: color('#f5a97f', 21, 86, 73),
    yellow: color('#eed49f', 42, 79, 78),
    green: color('#a6da95', 105, 48, 72),
    teal: color('#8bd5ca', 172, 47, 69),
    sky: color('#91d7e3', 189, 59, 73),
    sapphire: color('#7dc4e4', 199, 66, 69),
    blue: color('#8aadf4', 220, 83, 75),
    lavender: color('#b7bdf8', 238, 82, 84),
    text: color('#cad3f5', 227, 68, 88),
    subtext1: color('#b8c0e0', 228, 39, 81),
    subtext0: color('#a5adcb', 227, 27, 72),
    overlay2: color('#939ab7', 228, 20, 64),
    overlay1: color('#8087a2', 230, 15, 56),
    overlay0: color('#6e738d', 230, 12, 48),
    surface2: color('#5b6078', 233, 16, 40),
    surface1: color('#494d64', 234, 15, 33),
    surface0: color('#363a4f', 235, 16, 26),
    base: color('#24273a', 232, 23, 19),
    mantle: color('#1e2030', 233, 23, 16),
    crust: color('#181926', 236, 23, 13)
  }
};

// Brightness-aware color selection utilities
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
 * Get brightness-adjusted base color for a Catppuccin flavor
 */
export function getBrightnessAdjustedBaseColor(
  flavor: CatppuccinFlavor, 
  brightnessMode: 'bright' | 'balanced' | 'dark'
): CatppuccinColor {
  const palette = CATPPUCCIN_PALETTES[flavor];
  const config = BRIGHTNESS_CONFIGS[brightnessMode];
  
  // For bright mode, use surface colors; for dark mode, use deeper colors
  switch (brightnessMode) {
    case 'bright':
      return flavor === 'latte' ? palette.surface1 : palette.surface0;
    case 'balanced':
      return flavor === 'latte' ? palette.base : palette.surface0;
    case 'dark':
      return flavor === 'latte' ? palette.mantle : palette.base;
    default:
      return palette.base;
  }
}

/**
 * Get brightness-adjusted surface color for a Catppuccin flavor
 */
export function getBrightnessAdjustedSurfaceColor(
  flavor: CatppuccinFlavor,
  brightnessMode: 'bright' | 'balanced' | 'dark'
): CatppuccinColor {
  const palette = CATPPUCCIN_PALETTES[flavor];
  
  switch (brightnessMode) {
    case 'bright':
      return flavor === 'latte' ? palette.surface2 : palette.surface1;
    case 'balanced':
      return flavor === 'latte' ? palette.surface0 : palette.surface1;
    case 'dark':
      return flavor === 'latte' ? palette.surface0 : palette.surface0;
    default:
      return palette.surface1;
  }
}

/**
 * Get the accent color from a Catppuccin palette by name
 */
export function getCatppuccinAccentColor(
  flavor: CatppuccinFlavor,
  accentName: CatppuccinColorName
): CatppuccinColor {
  return CATPPUCCIN_PALETTES[flavor][accentName];
}

/**
 * Get default accent color for a flavor (mauve for most, blue for latte for better contrast)
 */
export function getDefaultAccentColor(flavor: CatppuccinFlavor): CatppuccinColor {
  const palette = CATPPUCCIN_PALETTES[flavor];
  return flavor === 'latte' ? palette.blue : palette.mauve;
}