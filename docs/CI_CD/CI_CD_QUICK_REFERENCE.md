# 🚀 CI/CD Quick Reference Guide

## Catppuccin StarryNight - CI/CD Commands & Workflows

Quick reference for developers working with the CI/CD pipeline.

---

## 🔥 Essential Commands

### Testing & Validation
```bash
# Complete validation suite
npm run test:comprehensive

# Theme-specific validation only
npm run test:theme

# Individual validations
npm run typecheck                    # TypeScript compilation
npm run lint:css                     # SCSS/CSS linting
npm test                            # Jest unit tests
node scripts/validate-theme-structure.js
node scripts/validate-color-schemes.js
```

### Build & Development
```bash
# Production build
npm run build

# Fast development build
npm run build:fast

# Watch mode for SCSS
npm run sass:watch

# TypeScript watch mode
npm run typecheck:watch
```

### Release & Deployment
```bash
# Prepare full release package
npm run prepare:release

# Dry run (testing only)
npm run release:dry-run

# Manual deployment trigger
gh workflow run deployment.yml -f environment=production
```

---

## 📊 Pipeline Status Indicators

### ✅ Validation Passing
```
✅ 🏗️ Structure    - All theme files valid
✅ 🌈 Colors       - Catppuccin compliance passed  
✅ 🔍 TypeScript   - No compilation errors
✅ 🏗️ Build        - Bundle created successfully
✅ 🚀 Performance  - Within budget limits
✅ 👁️ Visual       - Regression tests passed
✅ 🔗 Integration  - Year3000 components detected
```

### ❌ Common Failures
```
❌ Bundle too large: 713KB > 250KB (JS) | 663KB > 200KB (CSS)
❌ Invalid hex format: missing # prefix in color.ini
❌ Missing required field in manifest.json
❌ TypeScript compilation errors
❌ Performance budget exceeded
```

---

## 🔧 Quick Fixes

### Bundle Size Issues
```bash
# Check current sizes
ls -lh theme.js user.css

# Analyze bundle contents
npm run build -- --analyze

# Optimize CSS
npm run prune-css
```

### Color Format Issues
```bash
# Fix missing # prefixes in color.ini
sed -i 's/= \([0-9A-Fa-f]\{6\}\)$/= #\1/g' color.ini

# Validate color format
node scripts/validate-color-schemes.js
```

### TypeScript Issues
```bash
# Check for errors
npm run typecheck

# Auto-fix linting issues
npm run lint:js:fix

# Validate build
npm run build
```

---

## 🎯 Quality Gates

### Performance Budgets
| Component | Current | Target | Status |
|-----------|---------|---------|---------|
| JavaScript | 713KB | 250KB | ❌ Exceeds |
| CSS | 663KB | 200KB | ❌ Exceeds |
| Total | 1,376KB | 450KB | ❌ Exceeds |

### Required Validations
- [x] Manifest.json structure
- [x] Color scheme compliance  
- [x] TypeScript compilation
- [x] Bundle creation
- [ ] Performance budgets
- [x] Visual regression tests
- [x] Integration tests

---

## 🔄 Workflow Triggers

### Automatic Triggers
```yaml
# GitHub Actions auto-run on:
✅ Push to main/develop branches
✅ Pull requests to main/develop  
✅ Daily at 4 AM UTC (scheduled)
✅ Version tags (v*)
```

### Manual Triggers
```bash
# Manual workflow dispatch
gh workflow run comprehensive-testing.yml -f test-level=comprehensive
gh workflow run deployment.yml -f environment=staging
```

---

## 📁 Key Files & Locations

### CI/CD Scripts
```
scripts/
├── validate-theme-structure.js    # Theme file validation
├── validate-color-schemes.js      # Color compliance checking
├── run-comprehensive-tests.js     # Test orchestration
└── prepare-release.js             # Release automation
```

### GitHub Workflows
```
.github/workflows/
├── comprehensive-testing.yml      # Main CI pipeline
└── deployment.yml                # Deployment automation
```

### Configuration Files
```
├── package.json                   # NPM scripts & dependencies
├── tsconfig.json                 # TypeScript configuration  
├── manifest.json                 # Theme metadata
└── color.ini                     # Color scheme definitions
```

---

## 🚨 Emergency Procedures

### Pipeline Failure Recovery
```bash
# 1. Check GitHub Actions logs
gh run list --limit 5

# 2. Run local validation
npm run test:comprehensive

# 3. Fix identified issues
npm run validate:fix

# 4. Re-trigger pipeline
git push --force-with-lease
```

### Bundle Size Emergency
```bash
# Immediate size reduction
npm run prune-css              # Remove CSS duplicates
npm run build:fast             # Skip optimizations temporarily

# Long-term optimization
# - Remove unused imports
# - Optimize third-party dependencies  
# - Implement code splitting
```

### Color Validation Emergency
```bash
# Quick fix for all color schemes
sed -i 's/= \([0-9A-Fa-f]\{6\}\)$/= #\1/g' color.ini

# Add missing variables to SCSS
# Edit: src/core/_sn_root_variables.scss
```

---

## 📈 Monitoring & Metrics

### Pipeline Health Dashboard
```bash
# Check recent pipeline runs
gh run list --workflow=comprehensive-testing.yml --limit 10

# View specific run details  
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

### Performance Tracking
```bash
# Bundle size history
git log --oneline --grep="bundle" --since="1 month ago"

# Performance trend analysis
npm run test:comprehensive -- --profile
```

---

## 🎨 Theme-Specific Validations

### Catppuccin Compliance
```bash
# All 4 color schemes required:
✅ Mocha (dark)      - #1e1e2e base
✅ Macchiato (dark)  - #24273a base  
✅ Frappe (dark)     - #303446 base
✅ Latte (light)     - #eff1f5 base
```

### Year3000 System Integration
```bash
# Required components in bundle:
✅ Year3000System
✅ ColorHarmonyEngine
✅ MusicSyncService
✅ PerformanceAnalyzer
✅ BeatSyncVisualSystem
```

### StarryNight Variables
```scss
// Required CSS variables:
--sn-accent          // Theme accent color
--sn-gradient        // Gradient definitions
--sn-glow           // Glow effects
--sn-shadow         // Shadow effects
```

---

## 🔗 Useful Links

### Internal Documentation
- [CI/CD Pipeline Documentation](./CI_CD_PIPELINE.md)
- [Theme Development Guide](../README.md)
- [Performance Standards](./PERFORMANCE_STANDARDS.md)

### External Resources
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Catppuccin Official Palette](https://catppuccin.com/palette)
- [Spicetify Theme Guidelines](https://spicetify.app/docs/development/themes)

### Support Channels
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/catppuccin)
- [Documentation Site](https://docs.your-domain.com)

---

## 💡 Pro Tips

### Development Workflow
1. **Always run local validation before push**: `npm run test:theme`
2. **Use watch modes for development**: `npm run sass:watch`
3. **Check bundle sizes regularly**: `ls -lh theme.js user.css`
4. **Keep color.ini properly formatted**: Use # prefixes for hex colors

### Performance Optimization
1. **Monitor bundle growth**: Track size changes in PRs
2. **Use performance budgets**: Set strict limits and enforce them
3. **Optimize critical path**: Prioritize visible content loading
4. **Profile regularly**: Use `npm run test:comprehensive -- --profile`

### Quality Assurance
1. **Validate on multiple environments**: Test staging before production
2. **Use comprehensive tests for releases**: `npm run test:comprehensive`
3. **Monitor accessibility**: Ensure WCAG AA compliance
4. **Document breaking changes**: Update version and changelog

---

*Quick Reference Version: 1.0.0*
*Last Updated: July 16, 2025*