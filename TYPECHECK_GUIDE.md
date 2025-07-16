# TypeScript Type Checking Integration Guide

This guide explains how to use the newly integrated TypeScript type checking system in the Catppuccin StarryNight theme.

## Overview

The project now has comprehensive TypeScript type checking integrated into the build process. The system uses `tsc --noEmit` for type checking while maintaining esbuild for fast compilation.

## Available Scripts

### Core Type Checking
```bash
# Run type checking once
npm run typecheck

# Run type checking in watch mode (for development)
npm run typecheck:watch
```

### Build Scripts
```bash
# Build with type checking (recommended for production)
npm run build

# Build without type checking (for development speed)
npm run build:fast
```

### Validation Scripts
```bash
# Run all validations (typecheck + linting + tests)
npm run validate

# Auto-fix JS issues and run validations
npm run validate:fix
```

### JavaScript Linting
```bash
# Check JavaScript/TypeScript code style
npm run lint:js

# Auto-fix JavaScript/TypeScript issues
npm run lint:js:fix
```

## Development Workflow

### 1. **During Development**
```bash
# Start type checking in watch mode
npm run typecheck:watch

# In another terminal, build when needed
npm run build:fast
```

### 2. **Before Committing**
```bash
# Validate everything
npm run validate

# Or auto-fix and validate
npm run validate:fix
```

### 3. **Production Build**
```bash
# Always use the full build command
npm run build
```

## TypeScript Configuration

The project uses a strict TypeScript configuration with:

- **Strict Mode**: Enabled for maximum type safety
- **No Emit**: TypeScript only validates, esbuild compiles
- **Path Mapping**: Extensive `@/*` aliases for clean imports
- **Modern Target**: ES2017 with React JSX support

### Key Settings
```json
{
  "strict": true,
  "noImplicitAny": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitOverride": true,
  "noEmit": true
}
```

## Architecture Integration

### Year 3000 System Types
The project has comprehensive type definitions for the Year 3000 system:
- `IManagedSystem` interface for all systems
- Proper typing for music analysis data
- Type-safe event handling
- Comprehensive performance metrics typing

### Import Patterns
```typescript
// Use path aliases
import { Year3000System } from "@/core/lifecycle/year3000System";
import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";

// For root-level types
import type { Variant } from "../../../types/spicetify";
```

## Common Type Issues and Solutions

### 1. **Import Path Errors**
```typescript
// ❌ Wrong
import { Year3000System } from "../core/year3000System";

// ✅ Correct
import { Year3000System } from "@/core/lifecycle/year3000System";
```

### 2. **Missing Type References**
```typescript
// ❌ Wrong
import type { Variant } from "@/types/spicetify";

// ✅ Correct
import type { Variant } from "../../../types/spicetify";
```

### 3. **System Interface Compliance**
```typescript
// ✅ All visual systems should implement IManagedSystem
export class MySystem extends BaseVisualSystem implements IManagedSystem {
  public initialized = false;
  
  async initialize(): Promise<void> { /* */ }
  updateAnimation(deltaTime: number): void { /* */ }
  async healthCheck(): Promise<HealthCheckResult> { /* */ }
  destroy(): void { /* */ }
}
```

## Performance Considerations

### Type Checking Performance
- **Development**: Use `npm run typecheck:watch` for instant feedback
- **Build**: Type checking adds ~2-3 seconds to build time
- **CI/CD**: Always use `npm run validate` for comprehensive checks

### Memory Usage
- Type checking uses ~100-200MB RAM
- Watch mode is efficient with incremental compilation
- Large projects may need `--max-old-space-size` flag

## Integration with Existing Tools

### Jest Testing
```bash
# Tests include type checking
npm run test

# Full validation includes tests
npm run validate
```

### ESLint Integration
```bash
# JavaScript linting with TypeScript support
npm run lint:js

# Auto-fix common issues
npm run lint:js:fix
```

### CSS Linting
```bash
# SCSS linting (separate from TypeScript)
npm run lint:css
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Check import paths match actual file locations
   - Verify path aliases in tsconfig.json

2. **Type assertion errors**
   - Use proper type guards instead of `any`
   - Implement proper interfaces

3. **Performance issues**
   - Use `npm run build:fast` for development
   - Consider excluding large files from type checking

### Debug Commands
```bash
# Check TypeScript version
npx tsc --version

# Verbose type checking
npx tsc --noEmit --listFiles

# Show configuration
npx tsc --showConfig
```

## Best Practices

### 1. **Type Safety**
- No `any` types allowed
- Use proper interfaces for all data structures
- Implement type guards for runtime validation

### 2. **Performance**
- Use `npm run build:fast` during development
- Run full type checking before commits
- Watch mode for active development

### 3. **Code Quality**
- Follow existing system patterns
- Use consistent naming conventions
- Implement proper error handling

### 4. **Development Flow**
1. Start with `npm run typecheck:watch`
2. Develop with `npm run build:fast`
3. Validate with `npm run validate`
4. Commit with confidence

## Future Enhancements

### Planned Improvements
- Pre-commit hooks for automatic type checking
- CI/CD integration for pull requests
- Performance monitoring for type checking
- Additional ESLint rules for TypeScript

### Configuration Options
The system is designed to be flexible and can be configured for different development needs while maintaining strict type safety for production builds.