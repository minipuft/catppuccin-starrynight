#!/usr/bin/env node

/**
 * Theme Structure Validation Script
 * 
 * Validates the Catppuccin StarryNight theme structure for CI/CD pipeline
 * - Checks required files exist
 * - Validates manifest.json structure
 * - Verifies color.ini format
 * - Checks theme.js bundle integrity
 * - Validates user.css structure
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
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

class ThemeStructureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.rootPath = process.cwd();
  }

  // Check if file exists
  checkFileExists(filePath, required = true) {
    const fullPath = path.join(this.rootPath, filePath);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      log.success(`${filePath} exists`);
      return true;
    } else {
      const msg = `${filePath} missing`;
      if (required) {
        this.errors.push(msg);
        log.error(msg);
      } else {
        this.warnings.push(msg);
        log.warn(msg);
      }
      return false;
    }
  }

  // Validate manifest.json structure
  validateManifest() {
    log.header('🔍 Validating manifest.json');
    
    if (!this.checkFileExists('manifest.json')) {
      return false;
    }

    try {
      const manifestPath = path.join(this.rootPath, 'manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Required fields
      const requiredFields = ['name', 'description', 'version', 'author', 'schemeNames'];
      
      for (const field of requiredFields) {
        if (!manifest[field]) {
          this.errors.push(`manifest.json missing required field: ${field}`);
          log.error(`Missing required field: ${field}`);
        } else {
          log.success(`manifest.json has ${field}: ${typeof manifest[field] === 'object' ? JSON.stringify(manifest[field]) : manifest[field]}`);
        }
      }

      // Validate schemeNames
      if (manifest.schemeNames && Array.isArray(manifest.schemeNames)) {
        const expectedSchemes = ['mocha', 'macchiato', 'frappe', 'latte'];
        const missingSchemes = expectedSchemes.filter(scheme => !manifest.schemeNames.includes(scheme));
        
        if (missingSchemes.length > 0) {
          this.warnings.push(`manifest.json missing color schemes: ${missingSchemes.join(', ')}`);
          log.warn(`Missing color schemes: ${missingSchemes.join(', ')}`);
        } else {
          log.success('All Catppuccin color schemes present');
        }
      }

      // Validate StarryNight specific fields
      if (manifest.starryNightVersion) {
        log.success(`StarryNight version: ${manifest.starryNightVersion}`);
      } else {
        this.warnings.push('manifest.json missing starryNightVersion');
        log.warn('Missing starryNightVersion field');
      }

      return true;
    } catch (error) {
      this.errors.push(`manifest.json parse error: ${error.message}`);
      log.error(`Parse error: ${error.message}`);
      return false;
    }
  }

  // Validate color.ini structure
  validateColorIni() {
    log.header('🎨 Validating color.ini');
    
    if (!this.checkFileExists('color.ini')) {
      return false;
    }

    try {
      const colorIniPath = path.join(this.rootPath, 'color.ini');
      const colorIni = fs.readFileSync(colorIniPath, 'utf8');
      
      // Check for required sections
      const requiredSections = ['mocha', 'macchiato', 'frappe', 'latte'];
      const foundSections = [];
      
      for (const section of requiredSections) {
        if (colorIni.includes(`[${section}]`)) {
          foundSections.push(section);
          log.success(`Found color scheme: ${section}`);
        } else {
          this.errors.push(`color.ini missing section: [${section}]`);
          log.error(`Missing section: [${section}]`);
        }
      }

      // Check for required color variables in each section
      const requiredColors = ['text', 'base', 'mantle', 'surface0', 'surface1', 'surface2', 'blue', 'lavender', 'sapphire'];
      
      for (const section of foundSections) {
        const sectionStart = colorIni.indexOf(`[${section}]`);
        const nextSection = colorIni.indexOf('[', sectionStart + 1);
        const sectionContent = nextSection === -1 ? colorIni.substring(sectionStart) : colorIni.substring(sectionStart, nextSection);
        
        for (const color of requiredColors) {
          // Check for various formats: "color = value", "color=value", or "color\t=value"
          const colorRegex = new RegExp(`^\\s*${color}\\s*=`, 'm');
          if (colorRegex.test(sectionContent)) {
            log.success(`${section} has ${color} color`);
          } else {
            this.warnings.push(`color.ini [${section}] missing color: ${color}`);
            log.warn(`[${section}] missing color: ${color}`);
          }
        }
      }

      return true;
    } catch (error) {
      this.errors.push(`color.ini read error: ${error.message}`);
      log.error(`Read error: ${error.message}`);
      return false;
    }
  }

  // Validate theme.js bundle
  validateThemeBundle() {
    log.header('📦 Validating theme.js bundle');
    
    if (!this.checkFileExists('theme.js')) {
      return false;
    }

    try {
      const themePath = path.join(this.rootPath, 'theme.js');
      const themeContent = fs.readFileSync(themePath, 'utf8');
      const stats = fs.statSync(themePath);
      
      // Check bundle size
      const sizeKB = Math.round(stats.size / 1024);
      log.info(`Bundle size: ${sizeKB}KB`);
      
      // Performance budget check
      const maxSizeKB = 1500; // 1.5MB max for feature-rich theme
      if (sizeKB > maxSizeKB) {
        this.errors.push(`theme.js too large: ${sizeKB}KB (max: ${maxSizeKB}KB)`);
        log.error(`Bundle too large: ${sizeKB}KB (max: ${maxSizeKB}KB)`);
      } else {
        log.success(`Bundle size within budget: ${sizeKB}KB`);
      }

      // Check for required Year3000 system components
      const requiredComponents = [
        'Year3000System',
        'ColorHarmonyEngine',
        'MusicSyncService',
        'PerformanceAnalyzer',
        'OrganicBeatSyncConsciousness'
      ];

      for (const component of requiredComponents) {
        if (themeContent.includes(component)) {
          log.success(`Bundle includes: ${component}`);
        } else {
          this.warnings.push(`theme.js missing component: ${component}`);
          log.warn(`Missing component: ${component}`);
        }
      }

      // Check for IIFE wrapper
      if (themeContent.includes('(function()') || themeContent.includes('(() => {')) {
        log.success('Bundle properly wrapped in IIFE');
      } else {
        this.warnings.push('theme.js may not be properly wrapped in IIFE');
        log.warn('Bundle may not be properly wrapped in IIFE');
      }

      return true;
    } catch (error) {
      this.errors.push(`theme.js validation error: ${error.message}`);
      log.error(`Validation error: ${error.message}`);
      return false;
    }
  }

  // Validate user.css structure
  validateUserCSS() {
    log.header('🎨 Validating user.css');
    
    if (!this.checkFileExists('user.css')) {
      return false;
    }

    try {
      const cssPath = path.join(this.rootPath, 'user.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      const stats = fs.statSync(cssPath);
      
      // Check CSS size
      const sizeKB = Math.round(stats.size / 1024);
      log.info(`CSS size: ${sizeKB}KB`);
      
      // Performance budget check
      const maxSizeKB = 600; // 600KB max for comprehensive CSS
      if (sizeKB > maxSizeKB) {
        this.errors.push(`user.css too large: ${sizeKB}KB (max: ${maxSizeKB}KB)`);
        log.error(`CSS too large: ${sizeKB}KB (max: ${maxSizeKB}KB)`);
      } else {
        log.success(`CSS size within budget: ${sizeKB}KB`);
      }

      // Check for required CSS custom properties
      const requiredProperties = [
        '--spice-text',
        '--spice-base',
        '--spice-surface',
        '--sn-accent',
        '--sn-gradient'
      ];

      for (const prop of requiredProperties) {
        if (cssContent.includes(prop)) {
          log.success(`CSS includes property: ${prop}`);
        } else {
          this.warnings.push(`user.css missing property: ${prop}`);
          log.warn(`Missing property: ${prop}`);
        }
      }

      // Check for performance optimizations
      if (cssContent.includes('will-change:')) {
        log.success('CSS includes will-change optimizations');
      } else {
        this.warnings.push('user.css may lack performance optimizations');
        log.warn('CSS may lack performance optimizations');
      }

      return true;
    } catch (error) {
      this.errors.push(`user.css validation error: ${error.message}`);
      log.error(`Validation error: ${error.message}`);
      return false;
    }
  }

  // Validate additional theme files
  validateAdditionalFiles() {
    log.header('📋 Validating additional files');
    
    // Required files
    this.checkFileExists('README.md');
    this.checkFileExists('package.json');
    this.checkFileExists('tsconfig.json');
    
    // Optional but recommended files
    this.checkFileExists('CHANGELOG.md', false);
    this.checkFileExists('LICENSE', false);
    this.checkFileExists('.gitignore', false);
    
    // Installation scripts
    this.checkFileExists('install.sh', false);
    this.checkFileExists('install-hybrid.sh', false);
    this.checkFileExists('install.ps1', false);
    
    // Check for assets directory
    const assetsPath = path.join(this.rootPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      log.success('assets directory exists');
      
      // Check for screenshots
      const screenshotsPath = path.join(assetsPath, 'screenshots');
      if (fs.existsSync(screenshotsPath)) {
        log.success('screenshots directory exists');
      } else {
        this.warnings.push('assets/screenshots directory missing');
        log.warn('screenshots directory missing');
      }
    } else {
      this.warnings.push('assets directory missing');
      log.warn('assets directory missing');
    }
  }

  // Run all validations
  async validate() {
    log.header('🌌 StarryNight Theme Structure Validation');
    log.info('Starting comprehensive theme validation...');
    
    this.validateManifest();
    this.validateColorIni();
    this.validateThemeBundle();
    this.validateUserCSS();
    this.validateAdditionalFiles();
    
    // Summary
    log.header('📊 Validation Summary');
    
    if (this.errors.length === 0) {
      log.success(`✨ Theme structure validation passed!`);
      if (this.warnings.length > 0) {
        log.warn(`${this.warnings.length} warning(s) found:`);
        this.warnings.forEach(warning => log.warn(`  • ${warning}`));
      }
      return true;
    } else {
      log.error(`❌ Theme structure validation failed!`);
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
  const validator = new ThemeStructureValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    log.error(`Validation failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = ThemeStructureValidator;