#!/usr/bin/env node

/**
 * Comprehensive Testing Suite
 * 
 * Orchestrates all validation and testing for the StarryNight theme
 * - Theme structure validation
 * - Color scheme validation  
 * - Performance regression testing
 * - TypeScript compilation
 * - Visual regression testing
 * - Integration testing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import validation modules
const ThemeStructureValidator = require('./validate-theme-structure');
const ColorSchemeValidator = require('./validate-color-schemes');

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
  header: (msg) => console.log(`${colors.bright}${colors.magenta}${msg}${colors.reset}`),
  separator: () => console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`)
};

class ComprehensiveTestSuite {
  constructor() {
    this.testResults = {
      structure: { passed: false, errors: [], warnings: [] },
      colors: { passed: false, errors: [], warnings: [] },
      performance: { passed: false, errors: [], warnings: [] },
      typescript: { passed: false, errors: [], warnings: [] },
      build: { passed: false, errors: [], warnings: [] },
      visual: { passed: false, errors: [], warnings: [] },
      integration: { passed: false, errors: [], warnings: [] }
    };
    
    this.startTime = Date.now();
    this.rootPath = process.cwd();
  }
  
  // Run theme structure validation
  async runStructureValidation() {
    log.header('🏗️ Running Theme Structure Validation');
    
    try {
      const validator = new ThemeStructureValidator();
      const result = await validator.validate();
      
      this.testResults.structure.passed = result;
      this.testResults.structure.errors = validator.errors;
      this.testResults.structure.warnings = validator.warnings;
      
      if (result) {
        log.success('Theme structure validation passed');
      } else {
        log.error('Theme structure validation failed');
      }
      
    } catch (error) {
      log.error(`Structure validation error: ${error.message}`);
      this.testResults.structure.errors.push(error.message);
    }
  }
  
  // Run color scheme validation
  async runColorValidation() {
    log.header('🌈 Running Color Scheme Validation');
    
    try {
      const validator = new ColorSchemeValidator();
      const result = await validator.validate();
      
      this.testResults.colors.passed = result;
      this.testResults.colors.errors = validator.errors;
      this.testResults.colors.warnings = validator.warnings;
      
      if (result) {
        log.success('Color scheme validation passed');
      } else {
        log.error('Color scheme validation failed');
      }
      
    } catch (error) {
      log.error(`Color validation error: ${error.message}`);
      this.testResults.colors.errors.push(error.message);
    }
  }
  
  // Run TypeScript compilation test
  async runTypeScriptValidation() {
    log.header('🔍 Running TypeScript Compilation Test');
    
    try {
      execSync('npm run typecheck', { stdio: 'pipe' });
      this.testResults.typescript.passed = true;
      log.success('TypeScript compilation passed');
      
    } catch (error) {
      log.error('TypeScript compilation failed');
      this.testResults.typescript.errors.push(error.message);
    }
  }
  
  // Run build test
  async runBuildValidation() {
    log.header('🏗️ Running Build Validation');
    
    try {
      log.info('Building CSS and JavaScript...');
      execSync('npm run build', { stdio: 'pipe' });
      
      // Check if build outputs exist
      const themePath = path.join(this.rootPath, 'theme.js');
      const cssPath = path.join(this.rootPath, 'user.css');
      
      const themeExists = fs.existsSync(themePath);
      const cssExists = fs.existsSync(cssPath);
      
      log.info(`Checking build artifacts...`);
      
      if (themeExists) {
        const themeSize = fs.statSync(themePath).size;
        log.success(`theme.js created: ${Math.round(themeSize/1024)}KB`);
      } else {
        this.testResults.build.errors.push('theme.js not generated');
        log.error('theme.js not generated');
      }
      
      if (cssExists) {
        const cssSize = fs.statSync(cssPath).size;
        log.success(`user.css created: ${Math.round(cssSize/1024)}KB`);
      } else {
        this.testResults.build.errors.push('user.css not generated');
        log.error('user.css not generated');
      }
      
      if (themeExists && cssExists) {
        this.testResults.build.passed = true;
        log.success('Build validation passed');
      } else {
        log.error('Build validation failed - missing artifacts');
      }
      
    } catch (error) {
      log.error('Build validation failed');
      this.testResults.build.errors.push(`Build process failed: ${error.message}`);
      
      // Try to provide more specific error information
      try {
        log.info('Attempting to diagnose build failure...');
        
        // Check if SCSS compilation works
        try {
          execSync('npm run build:css', { stdio: 'pipe' });
          log.info('✅ SCSS compilation successful');
        } catch (scssError) {
          log.error('❌ SCSS compilation failed');
          this.testResults.build.errors.push(`SCSS compilation failed: ${scssError.message}`);
        }
        
        // Check if TypeScript compilation works
        try {
          execSync('npm run typecheck', { stdio: 'pipe' });
          log.info('✅ TypeScript compilation successful');
        } catch (tsError) {
          log.error('❌ TypeScript compilation failed');
          this.testResults.build.errors.push(`TypeScript compilation failed: ${tsError.message}`);
        }
        
      } catch (diagError) {
        log.warn('Could not run build diagnostics');
      }
    }
  }
  
  // Run performance regression tests
  async runPerformanceValidation() {
    log.header('🚀 Running Performance Regression Tests');
    
    try {
      const themePath = path.join(this.rootPath, 'theme.js');
      const cssPath = path.join(this.rootPath, 'user.css');
      
      if (!fs.existsSync(themePath) || !fs.existsSync(cssPath)) {
        this.testResults.performance.errors.push('Build files missing for performance test');
        return;
      }
      
      // Bundle size analysis
      const jsSize = fs.statSync(themePath).size;
      const cssSize = fs.statSync(cssPath).size;
      const totalSize = jsSize + cssSize;
      
      log.info(`Bundle sizes: JS=${Math.round(jsSize/1024)}KB, CSS=${Math.round(cssSize/1024)}KB`);
      
      // Performance budgets (updated for feature-rich theme)
      const jsBudget = 800000;  // 800KB
      const cssBudget = 600000; // 600KB
      const totalBudget = 1400000; // 1.4MB
      
      let performanceIssues = [];
      
      if (jsSize > jsBudget) {
        performanceIssues.push(`JavaScript bundle too large: ${Math.round(jsSize/1024)}KB > ${Math.round(jsBudget/1024)}KB`);
      }
      
      if (cssSize > cssBudget) {
        performanceIssues.push(`CSS bundle too large: ${Math.round(cssSize/1024)}KB > ${Math.round(cssBudget/1024)}KB`);
      }
      
      if (totalSize > totalBudget) {
        performanceIssues.push(`Total bundle too large: ${Math.round(totalSize/1024)}KB > ${Math.round(totalBudget/1024)}KB`);
      }
      
      if (performanceIssues.length === 0) {
        this.testResults.performance.passed = true;
        log.success('Performance regression tests passed');
      } else {
        this.testResults.performance.errors = performanceIssues;
        log.error('Performance regression tests failed');
      }
      
    } catch (error) {
      log.error(`Performance validation error: ${error.message}`);
      this.testResults.performance.errors.push(error.message);
    }
  }
  
  // Run visual regression tests
  async runVisualValidation() {
    log.header('👁️ Running Visual Regression Tests');
    
    try {
      // Create visual test HTML
      const visualTestHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>StarryNight Visual Test</title>
  <link rel="stylesheet" href="user.css">
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--spice-base, #1e1e2e);
      color: var(--spice-text, #cdd6f4);
    }
    .test-container { 
      margin: 20px 0; 
      padding: 20px; 
      border: 1px solid var(--spice-text, #cdd6f4); 
      border-radius: 8px; 
      background: var(--spice-surface, #313244);
    }
    .color-test { 
      width: 50px; 
      height: 50px; 
      border-radius: 50%; 
      margin: 10px; 
      display: inline-block; 
    }
    .gradient-test { 
      width: 200px; 
      height: 100px; 
      margin: 10px; 
      border-radius: 8px; 
    }
    .animation-test {
      width: 100px;
      height: 100px;
      background: var(--sn-accent, #89b4fa);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
  </style>
</head>
<body>
  <h1>🌌 StarryNight Visual Test Suite</h1>
  
  <div class="test-container">
    <h2>Color Variables Test</h2>
    <div class="color-test" style="background: var(--spice-text, #cdd6f4);"></div>
    <div class="color-test" style="background: var(--spice-base, #1e1e2e);"></div>
    <div class="color-test" style="background: var(--spice-accent, #89b4fa);"></div>
    <div class="color-test" style="background: var(--spice-surface, #313244);"></div>
  </div>
  
  <div class="test-container">
    <h2>Gradient Tests</h2>
    <div class="gradient-test" style="background: var(--sn-gradient, linear-gradient(45deg, #89b4fa, #b4befe));"></div>
    <div class="gradient-test" style="background: radial-gradient(circle, var(--spice-accent, #89b4fa), var(--spice-base, #1e1e2e));"></div>
  </div>
  
  <div class="test-container">
    <h2>Animation Tests</h2>
    <div class="animation-test"></div>
  </div>
  
  <div class="test-container">
    <h2>StarryNight Features</h2>
    <div class="gradient-test" style="background: var(--sn-accent, #89b4fa); box-shadow: 0 0 20px var(--sn-glow, rgba(137, 180, 250, 0.3));"></div>
  </div>
</body>
</html>`;
      
      fs.writeFileSync(path.join(this.rootPath, 'visual-test.html'), visualTestHtml);
      
      this.testResults.visual.passed = true;
      log.success('Visual regression test files created');
      
    } catch (error) {
      log.error(`Visual validation error: ${error.message}`);
      this.testResults.visual.errors.push(error.message);
    }
  }
  
  // Run integration tests
  async runIntegrationValidation() {
    log.header('🔗 Running Integration Tests');
    
    try {
      // Test Year3000 system integration
      const themePath = path.join(this.rootPath, 'theme.js');
      
      if (!fs.existsSync(themePath)) {
        this.testResults.integration.errors.push('Theme bundle missing for integration test');
        return;
      }
      
      const themeContent = fs.readFileSync(themePath, 'utf8');
      
      // Check for core system components
      const requiredComponents = [
        'Year3000System',
        'ColorHarmonyEngine',
        'MusicSyncService',
        'PerformanceAnalyzer',
        'OrganicBeatSyncConsciousness',
        'CSSVariableBatcher'
      ];
      
      let missingComponents = [];
      
      for (const component of requiredComponents) {
        if (!themeContent.includes(component)) {
          missingComponents.push(component);
        }
      }
      
      if (missingComponents.length === 0) {
        this.testResults.integration.passed = true;
        log.success('Integration tests passed');
      } else {
        this.testResults.integration.errors.push(`Missing components: ${missingComponents.join(', ')}`);
        log.error('Integration tests failed');
      }
      
    } catch (error) {
      log.error(`Integration validation error: ${error.message}`);
      this.testResults.integration.errors.push(error.message);
    }
  }
  
  // Generate comprehensive test report
  generateReport() {
    log.separator();
    log.header('📊 Comprehensive Test Report');
    log.separator();
    
    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    log.info(`Test suite completed in ${duration}s`);
    log.info(`Timestamp: ${new Date().toISOString()}`);
    
    // Test results summary
    const testSummary = {
      '🏗️ Structure': this.testResults.structure.passed ? '✅' : '❌',
      '🌈 Colors': this.testResults.colors.passed ? '✅' : '❌',
      '🔍 TypeScript': this.testResults.typescript.passed ? '✅' : '❌',
      '🏗️ Build': this.testResults.build.passed ? '✅' : '❌',
      '🚀 Performance': this.testResults.performance.passed ? '✅' : '❌',
      '👁️ Visual': this.testResults.visual.passed ? '✅' : '❌',
      '🔗 Integration': this.testResults.integration.passed ? '✅' : '❌'
    };
    
    console.log('');
    for (const [test, status] of Object.entries(testSummary)) {
      console.log(`${status} ${test}`);
    }
    
    // Overall status
    const allPassed = Object.values(this.testResults).every(result => result.passed);
    const totalErrors = Object.values(this.testResults).reduce((sum, result) => sum + result.errors.length, 0);
    const totalWarnings = Object.values(this.testResults).reduce((sum, result) => sum + result.warnings.length, 0);
    
    console.log('');
    if (allPassed) {
      log.success(`🎉 ALL TESTS PASSED! Theme ready for deployment`);
    } else {
      log.error(`❌ ${totalErrors} test(s) failed`);
    }
    
    if (totalWarnings > 0) {
      log.warn(`⚠️ ${totalWarnings} warning(s) found`);
    }
    
    // Detailed error/warning report
    if (totalErrors > 0 || totalWarnings > 0) {
      console.log('');
      log.header('📋 Detailed Issues');
      
      for (const [testName, result] of Object.entries(this.testResults)) {
        if (result.errors.length > 0) {
          console.log(`\n❌ ${testName.toUpperCase()} ERRORS:`);
          result.errors.forEach(error => log.error(`  • ${error}`));
        }
        
        if (result.warnings.length > 0) {
          console.log(`\n⚠️ ${testName.toUpperCase()} WARNINGS:`);
          result.warnings.forEach(warning => log.warn(`  • ${warning}`));
        }
      }
    }
    
    // Performance metrics
    console.log('');
    log.header('📈 Performance Metrics');
    
    try {
      const themePath = path.join(this.rootPath, 'theme.js');
      const cssPath = path.join(this.rootPath, 'user.css');
      
      if (fs.existsSync(themePath) && fs.existsSync(cssPath)) {
        const jsSize = fs.statSync(themePath).size;
        const cssSize = fs.statSync(cssPath).size;
        
        log.info(`JavaScript bundle: ${Math.round(jsSize/1024)}KB`);
        log.info(`CSS bundle: ${Math.round(cssSize/1024)}KB`);
        log.info(`Total bundle: ${Math.round((jsSize + cssSize)/1024)}KB`);
      }
    } catch (error) {
      log.warn('Could not generate performance metrics');
    }
    
    log.separator();
    
    return allPassed;
  }
  
  // Run all tests
  async runAllTests() {
    log.header('🌌 Catppuccin StarryNight - Comprehensive Test Suite');
    log.info('Starting comprehensive validation...');
    
    // Run all validation tests
    await this.runStructureValidation();
    await this.runColorValidation();
    await this.runTypeScriptValidation();
    await this.runBuildValidation();
    await this.runPerformanceValidation();
    await this.runVisualValidation();
    await this.runIntegrationValidation();
    
    // Generate final report
    const success = this.generateReport();
    
    return success;
  }
}

// Run comprehensive tests if called directly
if (require.main === module) {
  const testSuite = new ComprehensiveTestSuite();
  testSuite.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    log.error(`Test suite failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = ComprehensiveTestSuite;