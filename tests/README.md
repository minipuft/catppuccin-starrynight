# Testing Guide - Catppuccin StarryNight

## Overview

This document provides guidance for writing and maintaining tests in the Catppuccin StarryNight Spicetify theme. The test suite has been modernized to align with the service composition pattern and 3-layer orchestration architecture.

## Test Structure

### Directory Organization
```
tests/
├── integration/          # Cross-system integration tests
│   ├── color/          # Color-related integrations
│   ├── orchestration/  # System coordination tests
│   └── visual/         # Visual effects integrations
├── unit/               # Individual component tests
│   ├── audio/          # Music sync and color harmony
│   ├── core/           # Core systems and lifecycle
│   ├── utils/          # Utility functions and processors
│   └── visual/         # Visual effect systems
├── performance/        # Performance benchmark tests
├── helpers/            # Test utilities and mock factories
└── README.md          # This file
```

## Test Utilities

### Mock Factories

Use standardized mock factories for consistent test setup:

```typescript
import { createMockPerformanceAnalyzer, createMockCSSVariableWriter, createTestOrchestration } from './helpers/mockFactories';

// Create a complete orchestration setup for integration tests
const { coordinator, mocks } = createTestOrchestration({
  mockLevel: 'full' // 'minimal', 'standard', or 'full'
});

// Create specific mocks for unit tests
const mockPerformanceAnalyzer = createMockPerformanceAnalyzer();
const mockCSSWriter = createMockCSSVariableWriter(config, mockPerformanceAnalyzer);
```

### Test Utilities

Common test utilities are available in `tests/helpers/testUtilities.ts`:

```typescript
import { waitForSystemInitialization, assertHealthy, cleanupSystems } from './helpers/testUtilities';

// Wait for system to initialize with timeout
await waitForSystemInitialization(system);

// Assert that system health check passes
await assertHealthy(system);

// Clean up systems after tests
await cleanupSystems(system1, system2, system3);
```

## Writing Tests

### Unit Tests

Unit tests should focus on individual components in isolation:

1. Use mock factories for dependencies
2. Test one component at a time
3. Verify inputs, outputs, and side effects
4. Follow AAA pattern: Arrange, Act, Assert

```typescript
describe('MyComponent', () => {
  let component: MyComponent;
  let mockDependency: jest.Mocked<Dependency>;

  beforeEach(() => {
    mockDependency = createMockDependency();
    component = new MyComponent(mockDependency);
  });

  afterEach(async () => {
    await cleanupSystems(component);
  });

  it('should process input correctly', async () => {
    // Arrange
    const input = { value: 42 };

    // Act
    const result = await component.process(input);

    // Assert
    expect(result).toBe(expectedOutput);
    expect(mockDependency.method).toHaveBeenCalledWith(input);
  });
});
```

### Integration Tests

Integration tests should verify that multiple systems work together:

1. Test orchestration and coordination
2. Verify event flow between systems
3. Validate dependency injection patterns
4. Test system lifecycle management

```typescript
describe('System Integration', () => {
  let { coordinator, mocks } = createTestOrchestration();

  beforeEach(async () => {
    await coordinator.initialize();
  });

  afterEach(async () => {
    await coordinator.destroy();
  });

  it('should coordinate visual and non-visual systems', async () => {
    // Test that systems work together through the coordinator
    const visualSystem = coordinator.getVisualSystem('MyVisualSystem');
    const nonVisualSystem = coordinator.getCachedNonVisualSystem('MyNonVisualSystem');

    expect(visualSystem).toBeDefined();
    expect(nonVisualSystem).toBeDefined();
  });
});
```

## Architecture-Specific Patterns

### Service Composition Pattern

Systems now use composition instead of inheritance. When testing:

- Mock services that are injected
- Verify service interactions rather than internal state
- Test service lifecycle through the composition

### 3-Layer Orchestration

The architecture follows a 3-layer orchestration pattern:
1. ThemeLifecycleCoordinator (top level)
2. SystemIntegrationCoordinator (middle level) 
3. VisualEffectsCoordinator and InfrastructureSystemCoordinator (bottom level)

When testing orchestration:
- Use `createTestOrchestration()` for full setup
- Verify coordination between layers
- Test event propagation across layers

### Dependency Injection

Modern systems rely on dependency injection. In tests:
- Always provide required dependencies via mock factories
- Verify that systems gracefully handle missing dependencies
- Test that injected dependencies are used correctly

## Best Practices

### 1. Use Type-Safe Mocks
- All mock factories return properly typed mocks
- Override only the methods you need to customize
- Keep mock implementations minimal and focused

### 2. Clean Up Resources
- Always clean up systems in `afterEach` hooks
- Remove DOM elements created during tests
- Cancel any timers or event listeners

### 3. Handle Async Operations Properly
- Use async/await for system initialization
- Wait for promises to resolve before making assertions
- Use appropriate timeouts for initialization

### 4. Focus on Behavior, Not Implementation
- Test what the system does, not how it does it
- Avoid testing private methods directly
- Focus on inputs, outputs, and observable effects

### 5. Performance Considerations
- Keep test execution time reasonable
- Use appropriate test durations for performance tests
- Test performance under various conditions

## Common Pitfalls

### 1. Avoid Complex Setup
- Use mock factories to keep setup simple
- Don't recreate the same mocks across multiple tests
- Extract common setup to `beforeEach` blocks

### 2. Don't Mock What You Don't Own
- Only mock external dependencies and complex internals
- Test the actual behavior of your own code
- Use real objects when possible

### 3. Proper Error Handling Tests
- Test both success and failure paths
- Verify error handling and fallback behavior
- Test edge cases and invalid inputs

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Specific Test File
```bash
npm test -- path/to/your/test.file.ts
```

### Watch Mode
```bash
npm test -- --watch
```

## Test Coverage

- Aim for 80%+ coverage on critical systems
- Focus coverage on high-risk areas
- Coverage reports are generated automatically
- New features should include appropriate tests