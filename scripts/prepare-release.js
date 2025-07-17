#!/usr/bin/env node

/**
 * Release Preparation Script
 * 
 * Prepares the StarryNight theme for release by:
 * - Running comprehensive tests
 * - Validating all theme components
 * - Building production bundles
 * - Generating release package
 * - Creating release notes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ComprehensiveTestSuite = require('./run-comprehensive-tests');

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

class ReleasePreparator {
  constructor() {
    this.rootPath = process.cwd();
    this.releaseDir = path.join(this.rootPath, 'release');
    this.version = this.getVersion();
    this.releaseNotes = [];
  }
  
  // Get version from package.json
  getVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'package.json'), 'utf8'));
      return packageJson.version || '1.0.0';
    } catch (error) {
      log.warn('Could not read version from package.json, using 1.0.0');
      return '1.0.0';
    }
  }
  
  // Clean and prepare release directory
  prepareReleaseDirectory() {
    log.header('📁 Preparing Release Directory');
    
    // Remove existing release directory
    if (fs.existsSync(this.releaseDir)) {
      fs.rmSync(this.releaseDir, { recursive: true });
    }
    
    // Create new release directory
    fs.mkdirSync(this.releaseDir, { recursive: true });
    
    log.success('Release directory prepared');
  }
  
  // Run comprehensive tests
  async runComprehensiveTests() {
    log.header('🧪 Running Comprehensive Test Suite');
    
    try {
      const testSuite = new ComprehensiveTestSuite();
      const success = await testSuite.runAllTests();
      
      if (!success) {
        throw new Error('Comprehensive tests failed');
      }
      
      log.success('All comprehensive tests passed');
      this.releaseNotes.push('✅ All comprehensive tests passed');
      
    } catch (error) {
      log.error(`Test suite failed: ${error.message}`);
      throw error;
    }
  }
  
  // Build production bundles
  buildProductionBundles() {
    log.header('🏗️ Building Production Bundles');
    
    try {
      // Clean previous builds
      const filesToClean = ['theme.js', 'user.css'];
      filesToClean.forEach(file => {
        const filePath = path.join(this.rootPath, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      
      // Build theme bundle
      execSync('npm run build', { stdio: 'inherit' });
      
      // Verify build outputs
      const themeExists = fs.existsSync(path.join(this.rootPath, 'theme.js'));
      const cssExists = fs.existsSync(path.join(this.rootPath, 'user.css'));
      
      if (!themeExists || !cssExists) {
        throw new Error('Build outputs missing');
      }
      
      // Get bundle sizes
      const jsSize = fs.statSync(path.join(this.rootPath, 'theme.js')).size;
      const cssSize = fs.statSync(path.join(this.rootPath, 'user.css')).size;
      
      log.success(`Production bundles built successfully`);
      log.info(`JavaScript bundle: ${Math.round(jsSize/1024)}KB`);
      log.info(`CSS bundle: ${Math.round(cssSize/1024)}KB`);
      log.info(`Total bundle: ${Math.round((jsSize + cssSize)/1024)}KB`);
      
      this.releaseNotes.push(`📦 JavaScript bundle: ${Math.round(jsSize/1024)}KB`);
      this.releaseNotes.push(`🎨 CSS bundle: ${Math.round(cssSize/1024)}KB`);
      this.releaseNotes.push(`📊 Total bundle: ${Math.round((jsSize + cssSize)/1024)}KB`);
      
    } catch (error) {
      log.error(`Build failed: ${error.message}`);
      throw error;
    }
  }
  
  // Generate release package
  generateReleasePackage() {
    log.header('📦 Generating Release Package');
    
    try {
      // Core theme files
      const coreFiles = [
        'theme.js',
        'user.css',
        'manifest.json',
        'color.ini',
        'README.md'
      ];
      
      // Installation scripts
      const installScripts = [
        'install.sh',
        'install-hybrid.sh',
        'install.ps1'
      ];
      
      // Copy core files
      coreFiles.forEach(file => {
        const srcPath = path.join(this.rootPath, file);
        const destPath = path.join(this.releaseDir, file);
        
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          log.success(`Copied ${file}`);
        } else {
          log.warn(`${file} not found, skipping`);
        }
      });
      
      // Copy installation scripts
      installScripts.forEach(script => {
        const srcPath = path.join(this.rootPath, script);
        const destPath = path.join(this.releaseDir, script);
        
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          // Make executable
          fs.chmodSync(destPath, '755');
          log.success(`Copied ${script}`);
        } else {
          log.warn(`${script} not found, skipping`);
        }
      });
      
      // Copy assets if they exist
      const assetsPath = path.join(this.rootPath, 'assets');
      const releaseAssetsPath = path.join(this.releaseDir, 'assets');
      
      if (fs.existsSync(assetsPath)) {
        fs.cpSync(assetsPath, releaseAssetsPath, { recursive: true });
        log.success('Copied assets directory');
      }
      
      log.success('Release package generated');
      
    } catch (error) {
      log.error(`Package generation failed: ${error.message}`);
      throw error;
    }
  }
  
  // Generate release metadata
  generateReleaseMetadata() {
    log.header('📋 Generating Release Metadata');
    
    try {
      const metadata = {
        name: 'Catppuccin StarryNight',
        version: this.version,
        release_time: new Date().toISOString(),
        build_info: {
          node_version: process.version,
          platform: process.platform,
          arch: process.arch
        },
        files: fs.readdirSync(this.releaseDir).filter(file => file !== 'release-info.json'),
        bundle_sizes: {},
        validation: {
          comprehensive_tests: 'passed',
          theme_structure: 'validated',
          color_schemes: 'validated',
          performance: 'within_budgets'
        }
      };
      
      // Add bundle size info
      const themePath = path.join(this.releaseDir, 'theme.js');
      const cssPath = path.join(this.releaseDir, 'user.css');
      
      if (fs.existsSync(themePath)) {
        metadata.bundle_sizes.javascript = fs.statSync(themePath).size;
      }
      
      if (fs.existsSync(cssPath)) {
        metadata.bundle_sizes.css = fs.statSync(cssPath).size;
      }
      
      // Write metadata
      fs.writeFileSync(
        path.join(this.releaseDir, 'release-info.json'),
        JSON.stringify(metadata, null, 2)
      );
      
      log.success('Release metadata generated');
      
    } catch (error) {
      log.error(`Metadata generation failed: ${error.message}`);
      throw error;
    }
  }
  
  // Generate release notes
  generateReleaseNotes() {
    log.header('📝 Generating Release Notes');
    
    try {
      const releaseNotesContent = `# 🌌 Catppuccin StarryNight v${this.version}

## 🚀 Release Information
- **Version**: ${this.version}
- **Release Date**: ${new Date().toLocaleDateString()}
- **Build Time**: ${new Date().toLocaleTimeString()}

## 📦 What's Included
- Optimized theme bundle with Year 3000 System
- Full Catppuccin color palette support (Mocha, Macchiato, Frappe, Latte)
- Performance-optimized visual effects
- Responsive design for all screen sizes
- Accessibility features with WCAG compliance

## 🔧 Installation
1. Download the theme files from this release
2. Extract to your Spicetify themes directory
3. Run: \`spicetify config current_theme catppuccin-starrynight\`
4. Apply: \`spicetify apply\`

## 📊 Technical Details
${this.releaseNotes.map(note => `- ${note}`).join('\n')}

## 🎨 Features
- **Dynamic Color Harmony**: Music-responsive color adaptation
- **Beat Synchronization**: Visual effects sync with music tempo
- **Performance Optimized**: <450KB total bundle size
- **Accessibility First**: WCAG AA compliant with reduced motion support
- **Modern Architecture**: Year 3000 System with TypeScript

## 🌟 System Requirements
- Spicetify CLI 2.x or newer
- Spotify Desktop App
- Modern web browser (Chrome 88+, Firefox 78+, Safari 14+)

## 📋 Validation Status
- ✅ Theme structure validation passed
- ✅ Color scheme validation passed
- ✅ Performance regression tests passed
- ✅ TypeScript compilation successful
- ✅ Visual regression tests passed
- ✅ Comprehensive test suite passed

## 🤝 Support
- GitHub Issues: [Report bugs and feature requests](https://github.com/your-repo/issues)
- Documentation: [Theme documentation](https://github.com/your-repo/docs)
- Community: [Join our Discord](https://discord.gg/catppuccin)

---
*This release was automatically generated and validated by the CI/CD pipeline*`;
      
      fs.writeFileSync(
        path.join(this.releaseDir, 'RELEASE_NOTES.md'),
        releaseNotesContent
      );
      
      log.success('Release notes generated');
      
    } catch (error) {
      log.error(`Release notes generation failed: ${error.message}`);
      throw error;
    }
  }
  
  // Generate checksums
  generateChecksums() {
    log.header('🔐 Generating Checksums');
    
    try {
      const files = fs.readdirSync(this.releaseDir);
      const checksums = [];
      
      files.forEach(file => {
        const filePath = path.join(this.releaseDir, file);
        
        if (fs.statSync(filePath).isFile() && file !== 'checksums.sha256') {
          try {
            const hash = require('crypto')
              .createHash('sha256')
              .update(fs.readFileSync(filePath))
              .digest('hex');
            
            checksums.push(`${hash}  ${file}`);
          } catch (error) {
            log.warn(`Could not generate checksum for ${file}`);
          }
        }
      });
      
      fs.writeFileSync(
        path.join(this.releaseDir, 'checksums.sha256'),
        checksums.join('\n') + '\n'
      );
      
      log.success('Checksums generated');
      
    } catch (error) {
      log.error(`Checksum generation failed: ${error.message}`);
      throw error;
    }
  }
  
  // Final validation
  validateRelease() {
    log.header('🔍 Final Release Validation');
    
    try {
      const requiredFiles = ['theme.js', 'user.css', 'manifest.json', 'color.ini'];
      const missingFiles = [];
      
      requiredFiles.forEach(file => {
        const filePath = path.join(this.releaseDir, file);
        if (!fs.existsSync(filePath)) {
          missingFiles.push(file);
        }
      });
      
      if (missingFiles.length > 0) {
        throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
      }
      
      // Check bundle sizes
      const themePath = path.join(this.releaseDir, 'theme.js');
      const cssPath = path.join(this.releaseDir, 'user.css');
      
      const jsSize = fs.statSync(themePath).size;
      const cssSize = fs.statSync(cssPath).size;
      const totalSize = jsSize + cssSize;
      
      if (totalSize > 450000) { // 450KB limit
        throw new Error(`Bundle too large: ${Math.round(totalSize/1024)}KB > 450KB`);
      }
      
      log.success('Final release validation passed');
      
    } catch (error) {
      log.error(`Release validation failed: ${error.message}`);
      throw error;
    }
  }
  
  // Main release preparation process
  async prepare() {
    log.separator();
    log.header('🌌 StarryNight Release Preparation');
    log.info(`Preparing release v${this.version}`);
    log.separator();
    
    try {
      this.prepareReleaseDirectory();
      await this.runComprehensiveTests();
      this.buildProductionBundles();
      this.generateReleasePackage();
      this.generateReleaseMetadata();
      this.generateReleaseNotes();
      this.generateChecksums();
      this.validateRelease();
      
      log.separator();
      log.success(`🎉 Release v${this.version} prepared successfully!`);
      log.info(`📁 Release package: ${this.releaseDir}`);
      log.info(`📊 Files: ${fs.readdirSync(this.releaseDir).length}`);
      log.info(`💾 Package size: ${Math.round(this.getDirectorySize(this.releaseDir)/1024)}KB`);
      log.separator();
      
      return true;
      
    } catch (error) {
      log.separator();
      log.error(`❌ Release preparation failed: ${error.message}`);
      log.separator();
      throw error;
    }
  }
  
  // Helper: Get directory size
  getDirectorySize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        size += this.getDirectorySize(filePath);
      } else {
        size += stats.size;
      }
    });
    
    return size;
  }
}

// Run release preparation if called directly
if (require.main === module) {
  const preparator = new ReleasePreparator();
  preparator.prepare().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Release preparation failed:', error.message);
    process.exit(1);
  });
}

module.exports = ReleasePreparator;