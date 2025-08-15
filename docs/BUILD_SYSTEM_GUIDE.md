# Build System Guide

> **"With advanced systems, the build system is not merely compilation—it is the transformation of visual-effects-aware code into responsive, smooth interfaces that adapt to every device and user."**

## Overview

The Catppuccin StarryNight theme implements a sophisticated **multi-stage build system** optimized for Spicetify theme development. This guide documents the complete build pipeline, from TypeScript compilation to CSS processing and comprehensive testing workflows.

### Build Philosophy

1. **Performance-First** - Fast incremental builds with intelligent caching
2. **Type Safety** - Strict TypeScript with zero `any` types allowed
3. **Quality Gates** - Comprehensive linting, testing, and validation
4. **Modular Architecture** - Separate concerns with path mapping
5. **Production Optimization** - Tree-shaking, minification, and bundle analysis

## Build Architecture Overview

```
Source Code → TypeScript Compilation → ESBuild Bundling → Spicetify Theme
     ↓              ↓                       ↓               ↓
SCSS Files → Sass Compilation → CSS Processing → user.css
     ↓              ↓                       ↓               ↓
Test Files → Jest Testing → Coverage Analysis → Quality Report
```

### Core Build Tools

1. **TypeScript** - Type checking and compilation
2. **ESBuild** - Ultra-fast JavaScript bundling
3. **Sass** - Advanced SCSS compilation
4. **Jest** - Comprehensive testing framework
5. **ESLint** - JavaScript/TypeScript linting
6. **Stylelint** - SCSS/CSS linting

## TypeScript Configuration

**Location**: `tsconfig.json`

### Compiler Configuration

```json
{
  "compilerOptions": {
    // Base Configuration
    "target": "ES2017",               // Modern JavaScript target
    "module": "commonjs",             // Node.js compatibility
    "jsx": "react",                   // React JSX support
    "esModuleInterop": true,          // Modern module interop
    "allowJs": true,                  // JavaScript file support
    "resolveJsonModule": true,        // JSON import support
    
    // Strict Type Checking
    "strict": true,                   // All strict options enabled
    "noImplicitAny": true,           // No implicit any types
    "noUncheckedIndexedAccess": true, // Strict index access
    "exactOptionalPropertyTypes": true, // Exact optional properties
    "noImplicitOverride": true,       // Explicit override keyword
    "noFallthroughCasesInSwitch": true, // Switch statement safety
    
    // Build Configuration
    "noEmit": true,                   // Type checking only (ESBuild handles emit)
    "incremental": true,              // Incremental compilation
    "skipLibCheck": true,             // Skip lib declaration checking
    
    // Module Resolution
    "moduleResolution": "node",       // Node.js module resolution
    "baseUrl": ".",                   // Base path for imports
    "forceConsistentCasingInFileNames": true // Case-sensitive imports
  }
}
```

### Path Mapping System

```json
{
  "paths": {
    "@/*": ["src-js/*"],              // Root source directory
    "@/audio/*": ["src-js/audio/*"], // Audio processing systems
    "@/assets/*": ["src-js/assets/*"], // Static assets
    "@/core/*": ["src-js/core/*"],   // Core system architecture
    "@/ui/*": ["src-js/ui/*"],       // UI components and managers
    "@/utils/*": ["src-js/utils/*"], // Utility functions
    "@/visual/*": ["src-js/visual/*"], // Visual systems
    "@/config/*": ["src-js/config/*"], // Configuration files
    "@/debug/*": ["src-js/debug/*"], // Debug and diagnostics
    "@/types/*": ["src-js/types/*"], // Type definitions
    "@/tests/*": ["src-js/tests/*"]  // Test utilities
  }
}
```

### Type Safety Standards

- **Zero `any` types** - All code must be properly typed
- **Strict null checks** - Explicit handling of null/undefined
- **No implicit returns** - All code paths must return values
- **Exact optional properties** - Precise optional property handling
- **No unused variables** - Clean code requirements

## ESBuild Configuration

### Development Build

```bash
# Development build with sourcemaps and debugging
npm run build:js:dev

# ESBuild command breakdown:
esbuild src-js/theme.entry.ts \
  --bundle \                      # Bundle all dependencies
  --outfile=theme.js \           # Output file for Spicetify
  --format=iife \                # Immediately Invoked Function Expression
  --target=es2020 \              # Modern JavaScript target
  --external:react \             # External React (provided by Spicetify)
  --external:react-dom \         # External ReactDOM
  --loader:.fs=text \            # Load .fs files as text (shaders)
  --keep-names \                 # Preserve function names for debugging
  --sourcemap                    # Generate source maps
```

### Production Build

```bash
# Production build with minification
npm run build:js:prod

# ESBuild command for production:
esbuild src-js/theme.entry.ts \
  --bundle \
  --outfile=theme.js \
  --format=iife \
  --target=es2020 \
  --external:react \
  --external:react-dom \
  --loader:.fs=text \
  --minify                       # Minify for production
```

### Bundle Analysis

The build system generates optimized bundles with:

- **Tree Shaking** - Dead code elimination
- **Code Splitting** - Logical module separation
- **Minification** - Size optimization for production
- **Source Maps** - Debugging support in development
- **External Dependencies** - React/ReactDOM provided by Spicetify

### Performance Characteristics

- **Development Build**: ~20-30ms compilation time
- **Production Build**: ~40-50ms with minification
- **Bundle Size**: ~712KB (optimized for Spicetify)
- **Tree Shaking**: ~30% size reduction through unused code elimination

## Sass Compilation System

### SCSS Architecture

**Entry Point**: `app.scss`

```scss
// Main SCSS entry point combining architecture layers
@use "sass:meta";

// Central architecture management
@forward "src/core/_main";

// Root-level utilities
@forward "src/core/variables";
@forward "src/scss/quick_add_radial";
```

### Development vs Production

```bash
# Development SCSS compilation
npm run build:css:dev
sass app.scss user.css --style=expanded --quiet

# Production SCSS compilation  
npm run build:css:prod
sass app.scss user.css --style=compressed --quiet
```

### SCSS Module System

The project uses modern SCSS with `@use` and `@forward`:

```scss
// Modern module pattern
@use "sass:color";
@use "sass:math";
@use "sass:map";

// Forward public API
@forward "variables" as sn-*;
@forward "mixins" show mixin-name;

// Private implementation
@use "internal" as *;
```

### CSS Processing Pipeline

1. **SCSS Compilation** - Advanced Sass features and mixins
2. **CSS Variable Generation** - Dynamic design tokens
3. **Optimization** - Compression and dead code elimination
4. **Validation** - Stylelint quality checking
5. **Output** - Final `user.css` for Spicetify

## Linting Configuration

### Stylelint Configuration

**Location**: `.stylelintrc.cjs`

```javascript
module.exports = {
  // Modern PostCSS SCSS parser
  customSyntax: "postcss-scss",
  
  // Community standards
  extends: ["stylelint-config-standard-scss"],
  
  // Custom plugins for StarryNight
  plugins: [
    "./.stylelint/plugins/no-literal-cubic-bezier.js", // Custom rule
    "stylelint-scss",                    // SCSS support
    "stylelint-declaration-strict-value", // Design token enforcement
    "stylelint-order",                   // Property ordering
    "stylelint-use-nesting"              // Modern nesting patterns
  ],
  
  rules: {
    // StarryNight naming conventions
    "scss/dollar-variable-pattern": "^sn-[a-z0-9-]+$",
    "custom-property-pattern": "^(--sn|--spice)-[a-z0-9-]+$",
    
    // Design token enforcement
    "scale-unlimited/declaration-strict-value": [
      ["/color/", "fill", "stroke", "box-shadow", "border", "background"],
      { ignoreValues: ["currentColor", "transparent", "inherit", "var", "none"] }
    ],
    
    // Code organization
    "order/properties-alphabetical-order": true,
    "csstools/use-nesting": "always"
  }
};
```

### ESLint Configuration

The project uses strict ESLint rules for TypeScript:

```bash
# JavaScript/TypeScript linting
npm run lint:js

# Auto-fix lint issues
npm run lint:js:fix

# ESLint command
eslint "src-js/**/*.{ts,tsx}" --max-warnings 0
```

## Jest Testing Framework

**Location**: `jest.config.js`

### Jest Configuration

```javascript
module.exports = {
  preset: "ts-jest",                    // TypeScript support
  testEnvironment: "jsdom",             // DOM testing environment
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Test setup
  
  // TypeScript transformation
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  
  // Path mapping (matches tsconfig.json)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src-js/$1"
  }
};
```

### Test Categories

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - System interaction testing
3. **Performance Tests** - Performance regression testing
4. **Visual Tests** - Visual system validation
5. **Coverage Tests** - Code coverage analysis

### Testing Standards

- **90%+ Coverage** - Comprehensive test coverage required
- **Performance Budgets** - Memory and timing constraints
- **Visual Regression** - Automated visual testing
- **Integration Testing** - Cross-system compatibility

### Test Structure

```typescript
// Example test structure
describe('VisualSystemFacade', () => {
  let facade: VisualSystemFacade;
  
  beforeEach(() => {
    facade = new VisualSystemFacade(/* dependencies */);
  });
  
  describe('System Creation', () => {
    it('should create visual systems with proper dependencies', () => {
      const system = facade.getVisualSystem('Particle');
      expect(system).toBeDefined();
      expect(system.initialize).toBeDefined();
    });
  });
  
  describe('Performance Integration', () => {
    it('should monitor system performance', async () => {
      const metrics = facade.getMetrics();
      expect(metrics.currentFPS).toBeGreaterThan(30);
    });
  });
});
```

## Build Scripts and Automation

### Core Build Scripts

```json
{
  "scripts": {
    // Main build commands
    "build": "npm run build:css:dev && npm run build:js:dev",
    "build:dev": "npm run build:css:dev && npm run build:js:dev", 
    "build:prod": "npm run build:css:prod && npm run build:js:prod",
    "build:fast": "npm run build:css:prod && esbuild src-js/theme.entry.ts --bundle --outfile=theme.js --format=iife --target=es2020 --external:react --external:react-dom --loader:.fs=text --minify",
    
    // Development tools
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",
    "sass:watch": "sass --watch app.scss:user.css",
    
    // Quality assurance
    "validate": "npm run typecheck && npm run lint:css && npm run test",
    "validate:fix": "npm run lint:js:fix && npm run validate",
    
    // Testing
    "test": "jest",
    "test:comprehensive": "node scripts/run-comprehensive-tests.js",
    "test:theme": "node scripts/validate-theme-structure.js && node scripts/validate-color-schemes.js",
    
    // CSS utilities
    "scan-css": "ts-node scripts/scanCssTokens.ts",
    "diff-css": "ts-node scripts/diffTokens.ts", 
    "replace-css": "ts-node scripts/replaceCssTokens.ts",
    "generate-map": "ts-node scripts/generateReplaceMap.ts",
    "prune-css": "ts-node scripts/pruneDuplicateDecls.ts"
  }
}
```

### CSS Token Management

The build system includes sophisticated CSS token management:

#### CSS Token Scanner

**Location**: `scripts/scanCssTokens.ts`

```typescript
// Automatically scan SCSS files for CSS custom properties
interface TokenCollection {
  cssProps: Set<string>;      // CSS custom properties (--sn-*)
  mixins: Set<string>;        // SCSS mixins (@mixin)
  functions: Set<string>;     // SCSS functions (@function)
  uses: Set<string>;          // SCSS modules (@use)
}

// Extract tokens from SCSS files
async function extractTokens(filePath: string): Promise<TokenCollection> {
  const text = await fs.readFile(filePath, "utf8");
  const root = scss.parse(text);
  
  // Walk AST to collect tokens
  root.walkDecls((decl) => {
    if (decl.prop.startsWith("--")) {
      collection.cssProps.add(decl.prop);
    }
  });
  
  return collection;
}
```

#### Token Replacement System

```bash
# Generate replacement mapping
npm run generate-map

# Replace tokens using mapping
npm run replace-css --mapping build/css-audit/replace-map.json

# Prune duplicate declarations
npm run prune-css
```

### Comprehensive Testing Suite

**Location**: `scripts/run-comprehensive-tests.js`

```javascript
class ComprehensiveTestSuite {
  constructor() {
    this.testResults = {
      structure: { passed: false, errors: [], warnings: [] },
      colors: { passed: false, errors: [], warnings: [] },
      performance: { passed: false, errors: [], warnings: [] },
      typescript: { passed: false, errors: [], warnings: [] },
      visual: { passed: false, errors: [], warnings: [] },
      integration: { passed: false, errors: [], warnings: [] }
    };
  }
  
  async runAllTests() {
    // Theme structure validation
    await this.validateThemeStructure();
    
    // Color scheme validation
    await this.validateColorSchemes();
    
    // Performance regression testing
    await this.runPerformanceTests();
    
    // TypeScript compilation
    await this.validateTypeScript();
    
    // Visual regression testing
    await this.runVisualTests();
    
    // Integration testing
    await this.runIntegrationTests();
    
    return this.generateReport();
  }
}
```

## CI/CD Integration

### Continuous Integration

```bash
# CI build command
npm run build:ci

# Full CI validation
npm run ci:full
```

### Quality Gates

The build system enforces strict quality gates:

1. **TypeScript Compilation** - Zero errors required
2. **Lint Checks** - Zero warnings allowed
3. **Test Coverage** - 90%+ coverage required
4. **Performance Budgets** - Build time <50ms, bundle size <1MB
5. **Visual Regression** - No visual changes without approval

### Automated Validation

```typescript
// Automated validation pipeline
interface ValidationPipeline {
  structure: ThemeStructureValidator;
  colors: ColorSchemeValidator;
  performance: PerformanceRegressionTester;
  typescript: TypeScriptValidator;
  visual: VisualRegressionTester;
  integration: IntegrationTester;
}

// Quality gate enforcement
class QualityGateEnforcer {
  async enforceQualityGates(): Promise<boolean> {
    const results = await Promise.all([
      this.validateStructure(),
      this.validateColors(),
      this.validatePerformance(),
      this.validateTypeScript(),
      this.validateVisual(),
      this.validateIntegration()
    ]);
    
    return results.every(result => result.passed);
  }
}
```

## Development Workflow

### Local Development Setup

```bash
# Install dependencies
npm install

# Start development with watch mode
npm run typecheck:watch &  # Type checking
npm run sass:watch &       # SCSS compilation
npm run test -- --watch   # Test watching

# Development build
npm run build:dev
```

### File Watching and Hot Reload

```bash
# SCSS watch mode with automatic compilation
sass --watch app.scss:user.css

# TypeScript watch mode for immediate error feedback
tsc --noEmit --watch

# Jest watch mode for test-driven development
jest --watch
```

### Build Performance Optimization

#### Incremental Compilation

```typescript
// TypeScript incremental compilation
{
  "compilerOptions": {
    "incremental": true,              // Enable incremental compilation
    "tsBuildInfoFile": "./tsconfig.tsbuildinfo" // Build cache file
  }
}
```

#### ESBuild Optimization

```bash
# Fast build for development iteration
npm run build:fast

# Parallel CSS and JS compilation
npm run build:css:prod & npm run build:js:prod & wait
```

### Code Quality Automation

#### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run validate:fix",
      "pre-push": "npm run test:comprehensive"
    }
  }
}
```

#### Automated Formatting

```bash
# Auto-fix linting issues
npm run lint:js:fix

# Format SCSS files
npx stylelint "src/**/*.scss" --fix
```

## Performance Monitoring

### Build Performance Metrics

The build system tracks performance metrics:

```typescript
interface BuildMetrics {
  compilation: {
    typescript: number;    // TypeScript compilation time
    sass: number;          // SASS compilation time
    esbuild: number;       // ESBuild bundling time
    total: number;         // Total build time
  };
  
  output: {
    jsSize: number;        // JavaScript bundle size
    cssSize: number;       // CSS output size
    compression: number;   // Compression ratio
  };
  
  quality: {
    typeErrors: number;    // TypeScript errors
    lintWarnings: number;  // Lint warnings
    testCoverage: number;  // Test coverage percentage
  };
}
```

### Bundle Analysis

```bash
# Analyze bundle size and dependencies
npm run build:prod
npx bundle-analyzer theme.js

# Performance profiling
npm run test:comprehensive
```

## Troubleshooting

### Common Build Issues

1. **TypeScript Errors**
   ```bash
   # Check specific type errors
   npm run typecheck
   
   # Common fixes
   # - Add missing type imports
   # - Fix path mapping issues
   # - Resolve strict mode violations
   ```

2. **SCSS Compilation Failures**
   ```bash
   # Check SCSS syntax
   npm run lint:css
   
   # Common fixes
   # - Fix @use/@forward syntax
   # - Resolve variable scope issues
   # - Update deprecated features
   ```

3. **ESBuild Bundle Issues**
   ```bash
   # Debug bundle generation
   npm run build:js:dev
   
   # Common fixes
   # - Check external dependencies
   # - Verify entry point
   # - Resolve loader configuration
   ```

4. **Test Failures**
   ```bash
   # Run tests with detailed output
   npm test -- --verbose
   
   # Common fixes
   # - Update snapshots
   # - Fix mock configurations
   # - Resolve async test issues
   ```

### Debug Tools

```bash
# Enable TypeScript diagnostics
tsc --noEmit --diagnostics

# SCSS debug output
sass app.scss user.css --style=expanded --verbose

# ESBuild analysis
esbuild --analyze --bundle src-js/theme.entry.ts

# Jest debugging
jest --detectOpenHandles --verbose
```

### Performance Optimization

#### Build Speed Optimization

```bash
# Parallel builds
npm run build:css:prod & npm run build:js:prod & wait

# Incremental TypeScript
tsc --incremental --noEmit

# ESBuild caching
esbuild --bundle --incremental
```

#### Bundle Size Optimization

```typescript
// Tree shaking configuration
{
  "sideEffects": false,           // Enable tree shaking
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

## API Reference

### Build Scripts API

```typescript
interface BuildSystem {
  // Core builds
  buildDevelopment(): Promise<BuildResult>;
  buildProduction(): Promise<BuildResult>;
  buildFast(): Promise<BuildResult>;
  
  // Validation
  typeCheck(): Promise<TypeCheckResult>;
  lintCSS(): Promise<LintResult>;
  lintJS(): Promise<LintResult>;
  
  // Testing
  runTests(): Promise<TestResult>;
  runComprehensiveTests(): Promise<ComprehensiveTestResult>;
  
  // Utilities
  scanCSSTokens(): Promise<TokenCollection>;
  generateReplaceMap(): Promise<ReplaceMap>;
  pruneDuplicates(): Promise<PruneResult>;
}
```

### Configuration Interfaces

```typescript
interface BuildConfiguration {
  typescript: {
    strict: boolean;
    target: string;
    moduleResolution: string;
    paths: Record<string, string[]>;
  };
  
  esbuild: {
    bundle: boolean;
    minify: boolean;
    sourcemap: boolean;
    target: string;
    format: string;
    external: string[];
  };
  
  sass: {
    style: 'expanded' | 'compressed';
    quiet: boolean;
    watch: boolean;
  };
  
  jest: {
    preset: string;
    testEnvironment: string;
    coverage: {
      threshold: number;
      reporters: string[];
    };
  };
}
```

---

## Related Documentation

- [Master Architecture Overview](./MASTER_ARCHITECTURE_OVERVIEW.md) - System architecture
- [Performance Architecture Guide](./PERFORMANCE_ARCHITECTURE_GUIDE.md) - Performance monitoring
- [Visual Systems Reference](./VISUAL_SYSTEMS_REFERENCE.md) - Visual system development
- [Development Workflow Guide](./DEVELOPMENT_WORKFLOW_GUIDE.md) - Complete development process

---

*Part of the Year 3000 System - where build processes transcend mere compilation to become conscious transformation of code into living interfaces.*