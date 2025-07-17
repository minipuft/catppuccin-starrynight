#!/usr/bin/env node

/**
 * Color Scheme Validation Script
 * 
 * Validates Catppuccin color schemes for consistency and accessibility
 * - Checks color.ini format and values
 * - Validates CSS custom properties
 * - Tests color contrast ratios
 * - Verifies Catppuccin palette compliance
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  header: (msg) => console.log(`${colors.bright}${colors.magenta}${msg}${colors.reset}`)
};

// Official Catppuccin color palettes
const CATPPUCCIN_COLORS = {
  mocha: {
    rosewater: '#f5e0dc',
    flamingo: '#f2cdcd',
    pink: '#f5c2e7',
    mauve: '#cba6f7',
    red: '#f38ba8',
    maroon: '#eba0ac',
    peach: '#fab387',
    yellow: '#f9e2af',
    green: '#a6e3a1',
    teal: '#94e2d5',
    sky: '#89dceb',
    sapphire: '#74c7ec',
    blue: '#89b4fa',
    lavender: '#b4befe',
    text: '#cdd6f4',
    subtext1: '#bac2de',
    subtext0: '#a6adc8',
    overlay2: '#9399b2',
    overlay1: '#7f849c',
    overlay0: '#6c7086',
    surface2: '#585b70',
    surface1: '#45475a',
    surface0: '#313244',
    base: '#1e1e2e',
    mantle: '#181825',
    crust: '#11111b'
  },
  macchiato: {
    rosewater: '#f4dbd6',
    flamingo: '#f0c6c6',
    pink: '#f5bde6',
    mauve: '#c6a0f6',
    red: '#ed8796',
    maroon: '#ee99a0',
    peach: '#f5a97f',
    yellow: '#eed49f',
    green: '#a6da95',
    teal: '#8bd5ca',
    sky: '#91d7e3',
    sapphire: '#7dc4e4',
    blue: '#8aadf4',
    lavender: '#b7bdf8',
    text: '#cad3f5',
    subtext1: '#b8c0e0',
    subtext0: '#a5adcb',
    overlay2: '#939ab7',
    overlay1: '#8087a2',
    overlay0: '#6e738d',
    surface2: '#5b6078',
    surface1: '#494d64',
    surface0: '#363a4f',
    base: '#24273a',
    mantle: '#1e2030',
    crust: '#181926'
  },
  frappe: {
    rosewater: '#f2d5cf',
    flamingo: '#eebebe',
    pink: '#f4b8e4',
    mauve: '#ca9ee6',
    red: '#e78284',
    maroon: '#ea999c',
    peach: '#ef9f76',
    yellow: '#e5c890',
    green: '#a6d189',
    teal: '#81c8be',
    sky: '#99d1db',
    sapphire: '#85c1dc',
    blue: '#8caaee',
    lavender: '#babbf1',
    text: '#c6d0f5',
    subtext1: '#b5bfe2',
    subtext0: '#a5adce',
    overlay2: '#949cbb',
    overlay1: '#838ba7',
    overlay0: '#737994',
    surface2: '#626880',
    surface1: '#51576d',
    surface0: '#414559',
    base: '#303446',
    mantle: '#292c3c',
    crust: '#232634'
  },
  latte: {
    rosewater: '#dc8a78',
    flamingo: '#dd7878',
    pink: '#ea76cb',
    mauve: '#8839ef',
    red: '#d20f39',
    maroon: '#e64553',
    peach: '#fe640b',
    yellow: '#df8e1d',
    green: '#40a02b',
    teal: '#179299',
    sky: '#04a5e5',
    sapphire: '#209fb5',
    blue: '#1e66f5',
    lavender: '#7287fd',
    text: '#4c4f69',
    subtext1: '#5c5f77',
    subtext0: '#6c6f85',
    overlay2: '#7c7f93',
    overlay1: '#8c8fa1',
    overlay0: '#9ca0b0',
    surface2: '#acb0be',
    surface1: '#bcc0cc',
    surface0: '#ccd0da',
    base: '#eff1f5',
    mantle: '#e6e9ef',
    crust: '#dce0e8'
  }
};

class ColorSchemeValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.rootPath = process.cwd();
  }

  // Parse color.ini file
  parseColorIni() {
    const colorIniPath = path.join(this.rootPath, 'color.ini');
    
    if (!fs.existsSync(colorIniPath)) {
      this.errors.push('color.ini file not found');
      return null;
    }

    try {
      const content = fs.readFileSync(colorIniPath, 'utf8');
      const schemes = {};
      
      let currentScheme = null;
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) {
          continue;
        }
        
        // Parse section headers
        const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/);
        if (sectionMatch) {
          currentScheme = sectionMatch[1];
          schemes[currentScheme] = {};
          continue;
        }
        
        // Parse key-value pairs
        const kvMatch = trimmed.match(/^([^=]+)=(.+)$/);
        if (kvMatch && currentScheme) {
          const key = kvMatch[1].trim();
          const value = kvMatch[2].trim();
          schemes[currentScheme][key] = value;
        }
      }
      
      return schemes;
    } catch (error) {
      this.errors.push(`Failed to parse color.ini: ${error.message}`);
      return null;
    }
  }

  // Validate hex color format
  isValidHexColor(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  }

  // Convert hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Calculate relative luminance
  relativeLuminance(r, g, b) {
    const sRGB = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }

  // Calculate contrast ratio
  contrastRatio(color1, color2) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return null;
    
    const lum1 = this.relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Validate color scheme against Catppuccin palette
  validateScheme(schemeName, colors) {
    log.header(`🎨 Validating ${schemeName} color scheme`);
    
    if (!CATPPUCCIN_COLORS[schemeName]) {
      this.errors.push(`Unknown color scheme: ${schemeName}`);
      log.error(`Unknown color scheme: ${schemeName}`);
      return false;
    }

    const officialColors = CATPPUCCIN_COLORS[schemeName];
    let isValid = true;

    // Check required colors
    const requiredColors = ['text', 'base', 'surface0', 'surface1', 'surface2', 'blue', 'lavender'];
    
    for (const colorName of requiredColors) {
      if (!colors[colorName]) {
        this.errors.push(`${schemeName} missing required color: ${colorName}`);
        log.error(`Missing required color: ${colorName}`);
        isValid = false;
        continue;
      }

      const colorValue = colors[colorName];
      
      // Validate hex format
      if (!this.isValidHexColor(colorValue)) {
        this.errors.push(`${schemeName}.${colorName} invalid hex format: ${colorValue}`);
        log.error(`${colorName} invalid hex format: ${colorValue}`);
        isValid = false;
        continue;
      }

      // Check against official palette
      const officialColor = officialColors[colorName];
      if (officialColor && colorValue.toLowerCase() !== officialColor.toLowerCase()) {
        this.warnings.push(`${schemeName}.${colorName} differs from official palette: ${colorValue} vs ${officialColor}`);
        log.warn(`${colorName} differs from official: ${colorValue} vs ${officialColor}`);
      } else if (officialColor) {
        log.success(`${colorName} matches official palette: ${colorValue}`);
      }
    }

    // Validate contrast ratios
    this.validateContrast(schemeName, colors);

    return isValid;
  }

  // Validate contrast ratios for accessibility
  validateContrast(schemeName, colors) {
    log.info(`Checking contrast ratios for ${schemeName}`);
    
    const textColor = colors.text;
    const baseColor = colors.base;
    const surface0Color = colors.surface0;
    
    if (!textColor || !baseColor) return;

    // Text on base contrast
    const textBaseContrast = this.contrastRatio(textColor, baseColor);
    if (textBaseContrast) {
      const level = textBaseContrast >= 7 ? 'AAA' : textBaseContrast >= 4.5 ? 'AA' : 'FAIL';
      if (textBaseContrast >= 4.5) {
        log.success(`Text/base contrast: ${textBaseContrast.toFixed(2)} (${level})`);
      } else {
        this.errors.push(`${schemeName} text/base contrast too low: ${textBaseContrast.toFixed(2)} (minimum 4.5)`);
        log.error(`Text/base contrast too low: ${textBaseContrast.toFixed(2)}`);
      }
    }

    // Text on surface contrast
    if (surface0Color) {
      const textSurfaceContrast = this.contrastRatio(textColor, surface0Color);
      if (textSurfaceContrast) {
        const level = textSurfaceContrast >= 7 ? 'AAA' : textSurfaceContrast >= 4.5 ? 'AA' : 'FAIL';
        if (textSurfaceContrast >= 4.5) {
          log.success(`Text/surface contrast: ${textSurfaceContrast.toFixed(2)} (${level})`);
        } else {
          this.warnings.push(`${schemeName} text/surface contrast low: ${textSurfaceContrast.toFixed(2)}`);
          log.warn(`Text/surface contrast low: ${textSurfaceContrast.toFixed(2)}`);
        }
      }
    }
  }

  // Validate CSS custom properties
  validateCSSProperties() {
    log.header('🎨 Validating CSS custom properties');
    
    const cssPath = path.join(this.rootPath, 'user.css');
    if (!fs.existsSync(cssPath)) {
      this.errors.push('user.css file not found');
      return false;
    }

    try {
      const content = fs.readFileSync(cssPath, 'utf8');
      
      // Check for Spicetify variables
      const spiceVars = [
        '--spice-text',
        '--spice-base',
        '--spice-surface',
        '--spice-accent',
        '--spice-button',
        '--spice-main'
      ];

      for (const varName of spiceVars) {
        if (content.includes(varName)) {
          log.success(`Found CSS variable: ${varName}`);
        } else {
          this.warnings.push(`CSS missing variable: ${varName}`);
          log.warn(`Missing CSS variable: ${varName}`);
        }
      }

      // Check for StarryNight specific variables
      const snVars = [
        '--sn-accent',
        '--sn-gradient',
        '--sn-glow',
        '--sn-shadow'
      ];

      for (const varName of snVars) {
        if (content.includes(varName)) {
          log.success(`Found StarryNight variable: ${varName}`);
        } else {
          this.warnings.push(`CSS missing StarryNight variable: ${varName}`);
          log.warn(`Missing StarryNight variable: ${varName}`);
        }
      }

      return true;
    } catch (error) {
      this.errors.push(`Failed to validate CSS: ${error.message}`);
      return false;
    }
  }

  // Run all validations
  async validate() {
    log.header('🌈 Color Scheme Validation');
    log.info('Starting color scheme validation...');
    
    const colorIniData = this.parseColorIni();
    if (!colorIniData) {
      return false;
    }

    let allValid = true;
    
    // Validate each color scheme
    for (const [schemeName, colors] of Object.entries(colorIniData)) {
      if (!this.validateScheme(schemeName, colors)) {
        allValid = false;
      }
    }

    // Validate CSS properties
    this.validateCSSProperties();

    // Summary
    log.header('📊 Color Validation Summary');
    
    if (this.errors.length === 0) {
      log.success('✨ Color scheme validation passed!');
      if (this.warnings.length > 0) {
        log.warn(`${this.warnings.length} warning(s) found:`);
        this.warnings.forEach(warning => log.warn(`  • ${warning}`));
      }
      return true;
    } else {
      log.error('❌ Color scheme validation failed!');
      log.error(`${this.errors.length} error(s) found:`);
      this.errors.forEach(error => log.error(`  • ${error}`));
      
      if (this.warnings.length > 0) {
        log.warn(`${this.warnings.length} warning(s) found:`);
        this.warnings.forEach(warning => log.warn(`  • ${warning}`));
      }
      return false;
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ColorSchemeValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    log.error(`Validation failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = ColorSchemeValidator;