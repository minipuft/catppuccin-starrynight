# 🔧 CI/CD Troubleshooting Guide

## Catppuccin StarryNight - Pipeline Issue Resolution

Comprehensive troubleshooting guide for common CI/CD pipeline issues and their solutions.

---

## 🚨 Common Issues & Solutions

### 1. Bundle Size Exceeded

#### Problem
```bash
❌ JavaScript bundle too large: 713KB > 250KB
❌ CSS bundle too large: 663KB > 200KB  
❌ Total bundle too large: 1375KB > 450KB
```

#### Root Causes
- Large third-party dependencies
- Unused code not tree-shaken
- CSS duplication
- Unoptimized assets

#### Solutions

##### Immediate Fixes
```bash
# 1. Remove CSS duplicates
npm run prune-css

# 2. Check bundle contents
npm run build && ls -lah theme.js user.css

# 3. Analyze what's included
# Create temporary analysis script
echo "console.log('Bundle size:', fs.statSync('theme.js').size)" > analyze.js
node analyze.js
```

##### Long-term Optimization
```bash
# 1. Enable tree shaking in build
# Edit package.json build script:
"build": "esbuild src-js/theme.entry.ts --bundle --outfile=theme.js --tree-shaking=true"

# 2. Remove unused imports
# Scan for unused code
npm run lint:js -- --fix

# 3. Optimize CSS 
npm run scan-css      # Analyze CSS tokens
npm run diff-css      # Find differences
npm run replace-css   # Optimize variables
```

##### Bundle Analysis Script
```javascript
// scripts/analyze-bundle.js
const fs = require('fs');
const path = require('path');

function analyzeBundleSize() {
  const themeSize = fs.statSync('theme.js').size;
  const cssSize = fs.statSync('user.css').size;
  
  console.log('📊 Bundle Analysis:');
  console.log(`JavaScript: ${(themeSize/1024).toFixed(1)}KB`);
  console.log(`CSS: ${(cssSize/1024).toFixed(1)}KB`);
  console.log(`Total: ${((themeSize + cssSize)/1024).toFixed(1)}KB`);
  
  // Identify large files
  if (themeSize > 250000) {
    console.log('⚠️ JavaScript bundle exceeds target');
    console.log('💡 Consider code splitting or removing unused imports');
  }
  
  if (cssSize > 200000) {
    console.log('⚠️ CSS bundle exceeds target');
    console.log('💡 Run: npm run prune-css');
  }
}

analyzeBundleSize();
```

### 2. Color Validation Failures

#### Problem
```bash
❌ frappe.text invalid hex format: c6d0f5
❌ Missing required color: base
❌ Color contrast too low: 3.2 (minimum 4.5)
```

#### Root Causes
- Missing `#` prefix in hex colors
- Incomplete color definitions
- Accessibility violations

#### Solutions

##### Fix Hex Color Format
```bash
# Auto-fix missing # prefixes
sed -i 's/= \([0-9A-Fa-f]\{6\}\)$/= #\1/g' color.ini

# Verify format
node scripts/validate-color-schemes.js
```

##### Add Missing Colors
```ini
# Add to each [scheme] section in color.ini
[mocha]
# ... existing colors ...
text = #cdd6f4
base = #1e1e2e
mantle = #181825
surface0 = #313244
surface1 = #45475a
surface2 = #585b70
blue = #89b4fa
lavender = #b4befe
sapphire = #74c7ec
```

##### Fix Contrast Issues
```bash
# Check contrast ratios
node -e "
const validator = require('./scripts/validate-color-schemes.js');
const v = new validator();
console.log('Contrast check:', v.contrastRatio('#cdd6f4', '#1e1e2e'));
"

# Use Catppuccin official colors for guaranteed compliance
```

##### Color Validation Script
```javascript
// scripts/fix-colors.js
const fs = require('fs');

function fixColorFormat() {
  const colorIni = fs.readFileSync('color.ini', 'utf8');
  
  // Fix hex format
  const fixed = colorIni.replace(/= ([0-9A-Fa-f]{6})$/gm, '= #$1');
  
  fs.writeFileSync('color.ini', fixed);
  console.log('✅ Fixed color format in color.ini');
}

fixColorFormat();
```

### 3. TypeScript Compilation Errors

#### Problem
```bash
❌ TypeScript compilation failed
src-js/file.ts(42,15): error TS2339: Property 'xyz' does not exist
```

#### Root Causes
- Type definition mismatches
- Missing imports
- Incorrect type annotations
- API changes

#### Solutions

##### Check and Fix Types
```bash
# 1. Run typecheck with verbose output
npm run typecheck -- --listFiles

# 2. Fix common issues
npm run lint:js:fix

# 3. Check imports
grep -r "import.*from" src-js/ | grep -v ".d.ts"
```

##### Common Fixes
```typescript
// Fix: Property does not exist
// Before:
const element: HTMLElement = document.querySelector('.selector');
element.someMethod(); // ❌ Error

// After:
const element = document.querySelector('.selector') as HTMLElement;
if (element && 'someMethod' in element) {
  (element as any).someMethod(); // ✅ Safe
}

// Fix: Module not found
// Check file paths and extensions
import { something } from '@/path/to/module'; // ✅ Use path mapping
```

##### TypeScript Health Check
```bash
# Create health check script
cat > scripts/ts-health.js << 'EOF'
const { execSync } = require('child_process');

try {
  execSync('npm run typecheck', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript errors found:');
  console.log(error.stdout.toString());
  process.exit(1);
}
EOF

node scripts/ts-health.js
```

### 4. GitHub Actions Failures

#### Problem
```bash
❌ Action failed: comprehensive-testing
❌ Error: Process completed with exit code 1
```

#### Root Causes
- Environment differences
- Dependency issues
- Timeout problems
- Resource constraints

#### Solutions

##### Debug GitHub Actions
```bash
# 1. Check recent runs
gh run list --limit 5

# 2. View specific failure
gh run view <run-id>

# 3. Download logs
gh run download <run-id>

# 4. Re-run failed jobs
gh run rerun <run-id> --failed
```

##### Local Simulation
```bash
# Simulate CI environment locally
export CI=true
export NODE_ENV=production

# Run the same commands as CI
npm ci
npm run build
npm run test:comprehensive
```

##### Fix Environment Issues
```yaml
# .github/workflows/comprehensive-testing.yml
# Add debugging steps
- name: 🔍 Debug Environment
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Working directory: $(pwd)"
    echo "Files present: $(ls -la)"
    echo "Package.json exists: $(test -f package.json && echo 'yes' || echo 'no')"
```

##### Timeout Issues
```yaml
# Increase timeout for slow operations
- name: 📦 Install Dependencies
  run: npm ci
  timeout-minutes: 10  # Increase from default 5

- name: 🧪 Run Tests
  run: npm run test:comprehensive
  timeout-minutes: 15  # Increase for comprehensive tests
```

### 5. Performance Test Failures

#### Problem
```bash
❌ Performance regression detected
❌ Bundle size increased by 25%
❌ Memory usage exceeds threshold
```

#### Root Causes
- New dependencies added
- Code bloat
- Inefficient algorithms
- Memory leaks

#### Solutions

##### Performance Analysis
```bash
# 1. Profile current build
npm run test:comprehensive -- --profile

# 2. Compare with previous builds
git log --oneline | head -5
git checkout HEAD~1
npm run build
ls -lh theme.js user.css  # Compare sizes

# 3. Return to current
git checkout -
```

##### Memory Leak Detection
```javascript
// scripts/memory-test.js
const fs = require('fs');

function memoryUsageTest() {
  const used = process.memoryUsage();
  
  console.log('Memory Usage:');
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
  
  // Check if heap usage is reasonable
  const heapMB = used.heapUsed / 1024 / 1024;
  if (heapMB > 100) {
    console.log('⚠️ High memory usage detected');
    return false;
  }
  
  console.log('✅ Memory usage within limits');
  return true;
}

memoryUsageTest();
```

##### Performance Budget Enforcement
```javascript
// scripts/enforce-budgets.js
const fs = require('fs');

const BUDGETS = {
  javascript: 250 * 1024,  // 250KB
  css: 200 * 1024,        // 200KB
  total: 450 * 1024       // 450KB
};

function enforceBudgets() {
  const jsSize = fs.statSync('theme.js').size;
  const cssSize = fs.statSync('user.css').size;
  const total = jsSize + cssSize;
  
  let passed = true;
  
  if (jsSize > BUDGETS.javascript) {
    console.log(`❌ JS exceeds budget: ${jsSize} > ${BUDGETS.javascript}`);
    passed = false;
  }
  
  if (cssSize > BUDGETS.css) {
    console.log(`❌ CSS exceeds budget: ${cssSize} > ${BUDGETS.css}`);
    passed = false;
  }
  
  if (total > BUDGETS.total) {
    console.log(`❌ Total exceeds budget: ${total} > ${BUDGETS.total}`);
    passed = false;
  }
  
  if (passed) {
    console.log('✅ All performance budgets passed');
  }
  
  process.exit(passed ? 0 : 1);
}

enforceBudgets();
```

### 6. Build Process Failures

#### Problem
```bash
❌ Build failed: Cannot resolve module
❌ ESBUILD: Transform failed
❌ Syntax error in TypeScript
```

#### Root Causes
- Missing dependencies
- Path resolution issues
- Syntax errors
- Configuration problems

#### Solutions

##### Dependency Issues
```bash
# 1. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Check for missing dependencies
npm ls

# 3. Install missing peer dependencies
npm install --save-dev @types/node @types/react
```

##### Path Resolution
```json
// tsconfig.json - ensure paths are correct
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src-js/*"]
    }
  }
}
```

##### Build Configuration
```javascript
// package.json - verify build script
{
  "scripts": {
    "build": "npm run typecheck && esbuild src-js/theme.entry.ts --bundle --outfile=theme.js --format=iife --target=es2020 --external:react --external:react-dom --loader:.fs=text"
  }
}
```

##### Build Health Check
```bash
# Create build verification script
cat > scripts/build-health.sh << 'EOF'
#!/bin/bash

echo "🔍 Build Health Check"

# Check required files exist
if [ ! -f "package.json" ]; then
  echo "❌ package.json missing"
  exit 1
fi

if [ ! -f "tsconfig.json" ]; then
  echo "❌ tsconfig.json missing"
  exit 1
fi

if [ ! -f "src-js/theme.entry.ts" ]; then
  echo "❌ Entry point missing"
  exit 1
fi

# Check dependencies
echo "📦 Checking dependencies..."
npm ls --depth=0

# Test build
echo "🏗️ Testing build..."
npm run build

if [ -f "theme.js" ]; then
  echo "✅ Build successful"
  ls -lh theme.js
else
  echo "❌ Build failed - no output"
  exit 1
fi
EOF

chmod +x scripts/build-health.sh
./scripts/build-health.sh
```

---

## 🔍 Diagnostic Tools

### 1. Pipeline Health Dashboard

```bash
# Create diagnostic script
cat > scripts/pipeline-health.js << 'EOF'
const { execSync } = require('child_process');
const fs = require('fs');

class PipelineHealthChecker {
  async runFullDiagnostic() {
    console.log('🔍 Pipeline Health Diagnostic\n');
    
    this.checkEnvironment();
    this.checkDependencies();
    this.checkBuildSystem();
    this.checkValidation();
    this.checkPerformance();
    
    console.log('\n📊 Diagnostic Complete');
  }
  
  checkEnvironment() {
    console.log('🌍 Environment Check:');
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      
      console.log(`  Node.js: ${nodeVersion}`);
      console.log(`  npm: ${npmVersion}`);
      console.log(`  Platform: ${process.platform}`);
      console.log(`  Working Directory: ${process.cwd()}`);
    } catch (error) {
      console.log('  ❌ Environment check failed');
    }
  }
  
  checkDependencies() {
    console.log('\n📦 Dependencies Check:');
    try {
      execSync('npm ls --depth=0', { stdio: 'pipe' });
      console.log('  ✅ Dependencies OK');
    } catch (error) {
      console.log('  ❌ Dependency issues detected');
      console.log('  💡 Run: npm install');
    }
  }
  
  checkBuildSystem() {
    console.log('\n🏗️ Build System Check:');
    
    const requiredFiles = [
      'package.json',
      'tsconfig.json', 
      'src-js/theme.entry.ts'
    ];
    
    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ❌ ${file} missing`);
      }
    });
    
    try {
      execSync('npm run typecheck', { stdio: 'pipe' });
      console.log('  ✅ TypeScript compilation OK');
    } catch (error) {
      console.log('  ❌ TypeScript compilation failed');
    }
  }
  
  checkValidation() {
    console.log('\n🔍 Validation Check:');
    
    const validators = [
      'scripts/validate-theme-structure.js',
      'scripts/validate-color-schemes.js',
      'scripts/run-comprehensive-tests.js'
    ];
    
    validators.forEach(validator => {
      if (fs.existsSync(validator)) {
        console.log(`  ✅ ${validator}`);
      } else {
        console.log(`  ❌ ${validator} missing`);
      }
    });
  }
  
  checkPerformance() {
    console.log('\n🚀 Performance Check:');
    
    if (fs.existsSync('theme.js') && fs.existsSync('user.css')) {
      const jsSize = fs.statSync('theme.js').size;
      const cssSize = fs.statSync('user.css').size;
      
      console.log(`  JavaScript: ${(jsSize/1024).toFixed(1)}KB`);
      console.log(`  CSS: ${(cssSize/1024).toFixed(1)}KB`);
      console.log(`  Total: ${((jsSize + cssSize)/1024).toFixed(1)}KB`);
      
      // Check budgets
      if (jsSize <= 250000 && cssSize <= 200000) {
        console.log('  ✅ Within performance budgets');
      } else {
        console.log('  ⚠️ Exceeds performance budgets');
      }
    } else {
      console.log('  ❌ Build artifacts missing');
    }
  }
}

const checker = new PipelineHealthChecker();
checker.runFullDiagnostic();
EOF

node scripts/pipeline-health.js
```

### 2. Quick Fix Utility

```bash
# Create auto-fix script
cat > scripts/quick-fix.js << 'EOF'
const fs = require('fs');
const { execSync } = require('child_process');

class QuickFix {
  async runAllFixes() {
    console.log('🔧 Running Quick Fixes...\n');
    
    this.fixColorFormat();
    this.fixDependencies();
    this.fixLinting();
    this.optimizeBundle();
    
    console.log('\n✅ Quick fixes complete');
    console.log('💡 Run: npm run test:comprehensive');
  }
  
  fixColorFormat() {
    console.log('🎨 Fixing color format...');
    try {
      const colorIni = fs.readFileSync('color.ini', 'utf8');
      const fixed = colorIni.replace(/= ([0-9A-Fa-f]{6})$/gm, '= #$1');
      fs.writeFileSync('color.ini', fixed);
      console.log('  ✅ Color format fixed');
    } catch (error) {
      console.log('  ❌ Color fix failed:', error.message);
    }
  }
  
  fixDependencies() {
    console.log('📦 Checking dependencies...');
    try {
      execSync('npm install', { stdio: 'pipe' });
      console.log('  ✅ Dependencies updated');
    } catch (error) {
      console.log('  ❌ Dependency fix failed');
    }
  }
  
  fixLinting() {
    console.log('🔍 Fixing linting issues...');
    try {
      execSync('npm run lint:js:fix', { stdio: 'pipe' });
      console.log('  ✅ Linting issues fixed');
    } catch (error) {
      console.log('  ⚠️ Some linting issues remain');
    }
  }
  
  optimizeBundle() {
    console.log('🚀 Optimizing bundle...');
    try {
      if (fs.existsSync('scripts/prune-css.ts')) {
        execSync('npm run prune-css', { stdio: 'pipe' });
        console.log('  ✅ CSS optimized');
      }
      
      execSync('npm run build', { stdio: 'pipe' });
      console.log('  ✅ Bundle rebuilt');
    } catch (error) {
      console.log('  ❌ Bundle optimization failed');
    }
  }
}

const fixer = new QuickFix();
fixer.runAllFixes();
EOF

node scripts/quick-fix.js
```

---

## 🚨 Emergency Procedures

### Pipeline Complete Failure

#### 1. Immediate Response
```bash
# Stop any running processes
pkill -f "npm"

# Check system resources
free -h
df -h
ps aux | grep node

# Clear caches
npm cache clean --force
rm -rf node_modules package-lock.json
rm -rf .github/cache
```

#### 2. Full Reset
```bash
# Reset to last known good state
git status
git stash push -m "Emergency stash"
git checkout main
git pull origin main

# Reinstall everything
npm install
npm run build
npm run test:comprehensive
```

#### 3. Emergency Bypass
```bash
# Temporarily disable failing checks
# Edit .github/workflows/comprehensive-testing.yml
# Add: if: false
# To failing job steps

# Or use emergency override
git commit -m "Emergency fix" --allow-empty
git push
```

### Data Recovery

#### 1. Recover Lost Artifacts
```bash
# Download artifacts from previous successful run
gh run list --workflow=comprehensive-testing.yml --limit 5
gh run download <successful-run-id>
```

#### 2. Restore Configuration
```bash
# Restore from backup
cp .github/workflows/comprehensive-testing.yml.backup .github/workflows/comprehensive-testing.yml
cp package.json.backup package.json
```

---

## 📞 Support Escalation

### When to Escalate
- Pipeline down for >30 minutes
- Security vulnerabilities detected
- Data loss or corruption
- Repeated infrastructure failures

### Contact Information
- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)
- **Emergency Contact**: See CODEOWNERS file
- **Documentation**: CI/CD Pipeline docs
- **Community**: Discord #dev-support

### Escalation Template
```markdown
## CI/CD Pipeline Issue

**Severity**: [Critical/High/Medium/Low]
**Component**: [Validation/Build/Deploy/etc.]
**Started**: [Timestamp]
**Impact**: [Description]

### Error Details
```
[Paste error logs]
```

### Steps Taken
- [ ] Checked recent changes
- [ ] Ran local validation  
- [ ] Checked dependencies
- [ ] Attempted quick fixes

### Environment
- Node.js version: 
- Platform:
- Last successful run:
```

---

*Troubleshooting Guide Version: 1.0.0*
*Last Updated: July 16, 2025*