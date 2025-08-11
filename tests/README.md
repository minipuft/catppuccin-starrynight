# Test Organization Guide

This document explains the test structure for the Catppuccin StarryNight Spicetify theme.

## Directory Structure

```
tests/
├── unit/                          # Unit tests (.test.ts)
│   ├── audio/                     # Audio system tests (ColorHarmonyEngine, MusicSync)
│   ├── core/                      # Core system tests (UnifiedSystemIntegration, Performance)
│   ├── visual/                    # Visual system tests (WebGL, Visual Integration)
│   └── utils/                     # Utility tests (ShaderLoader, Validation, etc.)
├── integration/                   # Integration tests (.test.ts)
│   ├── orchestration/             # System orchestration tests
│   └── visual-effects-integration.test.ts
├── manual/                        # Manual test scripts (.js/.html)
│   ├── webgl/                     # WebGL testing scripts
│   ├── performance/               # Performance testing scripts
│   └── integration/               # Integration validation scripts
└── setup/                         # Test configuration
    └── jest.setup.ts              # Jest global setup
```

## Test Categories

### Unit Tests (`tests/unit/`)
Formal Jest tests that validate individual components and systems.

- **Audio Tests**: Music sync, color harmony, beat detection
- **Core Tests**: System coordination, performance management, integration
- **Visual Tests**: WebGL rendering, visual effects, animation systems
- **Utils Tests**: Utilities, validation, shader loading

### Integration Tests (`tests/integration/`)
Tests that validate interactions between multiple systems.

- **Orchestration Tests**: System-wide coordination and communication
- **Visual Effects Integration**: Cross-system visual effects coordination

### Manual Tests (`tests/manual/`)
Browser-executable scripts for manual testing and debugging.

- **WebGL Tests**: WebGL system validation, shader testing
- **Performance Tests**: Performance monitoring, device capability testing
- **Integration Tests**: Live system integration validation

## Running Tests

### All Tests
```bash
npm test                    # Run all Jest tests
npm run validate           # Run tests + linting + typecheck
```

### Specific Test Categories
```bash
npm run test:unit          # Run all unit tests
npm run test:integration   # Run integration tests
```

### Specific Unit Test Groups
```bash
npm run test:unit:audio    # Audio system tests
npm run test:unit:core     # Core system tests
npm run test:unit:visual   # Visual system tests
npm run test:unit:utils    # Utility tests
```

### Manual Tests
Manual tests must be run directly in the browser:

1. Open Spicetify developer console
2. Copy and paste the test script content
3. Or serve the HTML files through a local server

Example manual test execution:
```javascript
// In Spicetify console, load and run:
// tests/manual/performance/test-performance-system.js
```

## Test Configuration

- **Jest Config**: `jest.config.js`
- **Setup File**: `tests/setup/jest.setup.ts`
- **Module Mapping**: `@/` → `src-js/`
- **Environment**: jsdom with TypeScript support

## Guidelines

### Unit Tests
- Use `.test.ts` extension
- Test individual components/systems
- Mock external dependencies
- Maintain 90%+ coverage

### Integration Tests  
- Test system interactions
- Use real implementations where possible
- Focus on facade patterns and event bus

### Manual Tests
- Use `.js` extension for console execution
- Include descriptive logging
- Test real Spicetify environment
- Document expected outcomes

## Examples

### Unit Test Example
```typescript
// tests/unit/audio/ColorHarmonyEngine.test.ts
describe('ColorHarmonyEngine', () => {
  it('should process OKLAB colors correctly', () => {
    const engine = new ColorHarmonyEngine();
    const result = engine.processColor([0.7, 0.1, 0.1]);
    expect(result).toBeDefined();
  });
});
```

### Manual Test Example  
```javascript
// tests/manual/webgl/test-webgl-system.js
console.log('Testing WebGL System...');
const canvas = document.querySelector('canvas');
if (canvas) {
  console.log('✓ WebGL canvas found');
} else {
  console.log('⚠ WebGL canvas not found');
}
```

## Migration Notes

This structure was created to organize previously scattered test files:
- Moved loose `test-*.js` files from project root to `tests/manual/`
- Categorized formal tests by system (audio, core, visual, utils)
- Maintained all existing test functionality and configuration