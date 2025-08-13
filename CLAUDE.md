# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the **Catppuccin StarryNight** Spicetify theme codebase.

## Project Overview

**Catppuccin StarryNight** is a Spicetify theme implementing sophisticated visual effects and music synchronization through a modular TypeScript architecture.

### Core Architecture
- **Facade Pattern**: SystemCoordinator managing VisualSystemFacade and NonVisualSystemFacade
- **Unified Interface**: All systems implement `IManagedSystem` for consistent lifecycle management
- **Performance-First**: 60fps target with adaptive quality scaling and device-aware optimization
- **OKLAB Color Science**: Perceptually uniform color processing for natural visual experiences
- **Audio Integration**: Real-time music analysis with 90% accuracy for 60-200 BPM

### Tech Stack
- **Languages**: TypeScript (strict mode), SCSS, JavaScript ES6+
- **Build**: ESBuild bundling, Jest testing, manual SCSS compilation
- **APIs**: Spicetify Player/Platform, React/ReactDOM, colorExtractor, getAudioData
- **Performance**: WebGL2 with CSS fallbacks, Intersection Observer, Performance Observer

## Development Commands

### Build & Test
- `npm run build` - Bundle TypeScript from `src-js/` to `theme.js` (dev mode with sourcemap)
- `npm run build:prod` - Production build with minification
- `npm run build:fast` - Quick production build (CSS + minified JS)
- `npm test` - Jest tests (90%+ coverage required)
- `npm test -- --testNamePattern="SpecificTest"` - Run single test
- `npm run test:comprehensive` - Full test suite including performance tests  
- `npm run test:theme` - Validate theme structure and color schemes
- `npm run lint:css` - Stylelint on SCSS files (zero warnings)
- `npm run lint:js` - ESLint on TypeScript (strict mode, zero `any` types)
- `npm run typecheck` - TypeScript compilation check
- `npm run typecheck:watch` - Watch TypeScript compilation
- `npm run validate` - Complete validation (typecheck + lint + test)
- `npm run ci:full` - Full CI pipeline

### CSS Development & SCSS
- `npm run sass:watch` - Watch SCSS files for changes and auto-compile
- `npm run scan-css` - Scan SCSS files for tokens and variables
- `npm run diff-css` - Show differences between CSS token versions
- `npm run replace-css` - Replace CSS tokens using mapping
- `npm run generate-map` - Generate replacement mapping
- `npm run prune-css` - Remove duplicate declarations

### Installation & Release
- `npm run install:force` - Force reinstall with mocha flavor
- `npm run prepare:release` - Prepare files for release

**Manual SCSS Compilation**: Compile `app.scss` to `user.css` using SASS compiler

## Architecture Summary

### 4-Layer System Architecture

#### 1. Central Orchestration Layer
- **`Year3000System.ts`** - Central system orchestrator
- **`SystemCoordinator.ts`** - Dependency injection and coordination
- **`UnifiedEventBus.ts`** - Cross-system communication

#### 2. Facade Pattern Layer
- **`VisualSystemFacade.ts`** - Factory for visual systems
- **`NonVisualSystemFacade.ts`** - Factory for services and analytics
- **Unified lifecycle management** through `IManagedSystem` interface

#### 3. Visual & Audio Integration Layer
- **`MusicSyncService.ts`** - Spicetify API integration with beat detection
- **`ColorHarmonyEngine.ts`** - OKLAB color science processing
- **`VisualEffectsCoordinator.ts`** - Unified visual state coordination and orchestration
- **`WebGLRenderer.ts`** - Hardware-accelerated visuals (WebGL)
- **`DepthLayeredGradientSystem.ts`** - Multi-layer visual effects
- **`FluidGradientBackgroundSystem.ts`** - Fluid gradient background processing

#### 4. Performance Optimization Layer
- **`PerformanceAnalyzer.ts`** - Real-time monitoring and quality scaling
- **`DeviceCapabilityDetector.ts`** - Hardware detection and optimization
- **`CSSVariableBatcher.ts`** - Efficient DOM updates

### Core Interface
All systems implement the `IManagedSystem` interface:

```typescript
interface IManagedSystem {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<HealthCheckResult>;
  destroy(): void;
  forceRepaint?(reason?: string): void;
}
```

### Background System Coordination
Background visual systems implement `BackgroundSystemParticipant` for coordination:

```typescript
interface BackgroundSystemParticipant extends IManagedSystem {
  systemName: string;
  getVisualContribution?(): Partial<VisualEffectState>;
  onVisualStateUpdate(state: VisualEffectState): void;
  onVisualEffectEvent(eventType: VisualEventType, payload: any): void;
}
```

### Entry Point & Integration
- **Entry**: `src-js/theme.entry.ts` - Main system initialization
- **SCSS Structure**: Modular organization by components, layout, features
- **CSS Variables**: `--sn-*` prefix for theme, `--spice-*` for Spicetify compatibility
- **Progressive API Detection**: Graceful degradation if Spicetify APIs unavailable

### Module Path Mapping
- `@/` → `src-js/` (main source directory)
- `@/audio/*` → `src-js/audio/*` (music sync and color harmony)
- `@/core/*` → `src-js/core/*` (system architecture and coordination)
- `@/visual/*` → `src-js/visual/*` (visual effects and rendering)
- `@/utils/*` → `src-js/utils/*` (utilities and helpers)
- `@/config/*` → `src-js/config/*` (configuration and settings)
- `@/types/*` → `src-js/types/*` (TypeScript type definitions)

### Spicetify Environment Specifics
- **React/ReactDOM**: Provided by Spicetify, marked as external in esbuild
- **API Availability**: Progressive detection with graceful degradation
- **Extension Integration**: Theme requires `catppuccin-starrynight.js` extension
- **Build Target**: Chromium engine (Spotify's embedded browser)
- **Runtime APIs**: `Spicetify.Player`, `Platform`, `colorExtractor`, `getAudioData`

## Development Standards

### Performance Requirements (Non-Negotiable)
- **Frame Rate**: 60fps target, never below 45fps
- **Memory**: <50MB heap, zero leaks during 4+ hour sessions
- **CPU**: <10% idle increase, <25% during transitions
- **GPU**: <25% on mid-range hardware with fallbacks
- **Responsiveness**: UI <100ms, transitions <500ms
- **Build**: <30ms compilation, <1MB bundle size
- **Bundle**: <200KB gzipped total

### Code Quality Standards
- **TypeScript**: 100% coverage, zero `any` types (strict mode)
- **Interface Compliance**: All systems implement `IManagedSystem`
- **Error Handling**: All Spicetify API calls have try-catch with fallbacks
- **Testing**: 90%+ coverage, facade pattern tests mandatory
- **Documentation**: JSDoc for all public methods
- **Accessibility**: WCAG 2.1 AA compliance, `prefers-reduced-motion` support

### Architectural Framework
- **C.A.G.E.E.R.F Methodology**: All code follows Context, Actions, Goals, Execution, Evaluation, Refinement, Format
- **StarryNight Module Interface**: All systems implement `IManagedSystem` with lifecycle methods
- **Error Resilience**: All Spicetify API calls must have try-catch with fallback behavior
- **CSS Variable Strategy**: `--sn-*` for theme variables, `--spice-*` for Spicetify compatibility
- **Performance First**: Memory safety with cleanup, GPU acceleration, <16ms frame time target

### Naming Conventions
**Class Names** - Clear, descriptive, indicate function:
- ✅ `AudioAnalyzer`, `ColorManager`, `PerformanceMonitor`
- ❌ `ConsciousnessManager`, `OrganicInterface`, `NeuralOrchestrator`

**Method Names** - Action-oriented, specify behavior:
- ✅ `updateColorsFromMusic()`, `detectBeat()`, `optimizePerformance()`
- ❌ `channelConsciousness()`, `breatheInterface()`, `orchestrateFlow()`

**Variable Names** - Describe data clearly:
- ✅ `currentTrack`, `colorTemperature`, `frameRate`
- ❌ `consciousness`, `organicState`, `synapticData`

**Technical Naming**:
- **Files**: `PascalCase.ts` for systems, `camelCase.ts` for utilities
- **CSS Variables**: `--sn-*` theme prefix, `--spice-*` Spicetify prefix
- **SCSS Mixins**: `kebab-case` with descriptive names

### Code Quality Gates
Before code completion, verify:
- Can new developer understand purpose from names alone?
- Is abstraction solving a real technical problem?
- Are we over-engineering for requirements?
- Will this be easy to debug, test, and extend?
- Can someone contribute within 30 minutes?

### Testing Standards
- **Framework**: Jest with ts-jest preset and JSDOM environment
- **Configuration**: `jest.config.js` with `jest.setup.js` for global setup
- **Coverage**: 90%+ with facade patterns and visual systems focus
- **Test Types**: Unit tests, integration tests, performance regression tests
- **Module Mapping**: `@/` maps to `src-js/` for imports (configured in both tsconfig and jest)
- **Performance**: Memory leak and frame rate regression testing
- **Integration**: Cross-system facade communication testing

## Technology Constraints

### Allowed Technologies
- **Languages**: TypeScript (strict), SCSS, JavaScript ES6+
- **APIs**: Spicetify Player/Platform, React/ReactDOM, colorExtractor, getAudioData
- **Build**: ESBuild, TypeScript compiler, Jest/ts-jest
- **Performance**: WebGL2, CSS fallbacks, Intersection Observer, Performance Observer
- **Libraries**: OKLAB color utilities, lightweight utilities (<10KB total)

### Prohibited Technologies
- **Heavy Libraries**: jQuery, GSAP, Three.js, external UI frameworks
- **Build Tools**: Webpack, Rollup, Parcel (ESBuild only)
- **Styling**: CSS-in-JS, styled-components, runtime CSS generation
- **Anti-Patterns**: Continuous loops, canvas physics, high-frequency DOM manipulation
- **Legacy Systems**: Non-facade pattern or non-`IManagedSystem` implementations

### Development Environment
- Built for Spicetify CLI with manual SCSS compilation
- React/ReactDOM provided by Spicetify environment
- Module mapping: `@/` → `src-js/`
- Documentation in `docs/` directory

### Debugging Tools
- **Global Debug**: `Y3K` object when `YEAR3000_CONFIG.enableDebug = true`
- **Performance**: Real-time monitoring via `PerformanceAnalyzer`
- **Health Checks**: Component health and automatic recovery
- **Memory Profiling**: Leak detection for long sessions

## Quick Reference

### Key Documentation
- [Master Architecture Overview](./docs/MASTER_ARCHITECTURE_OVERVIEW.md) - Complete system architecture
- [API Reference](./docs/API_REFERENCE.md) - Interfaces and examples
- [Visual Effects Coordination](./docs/VISUAL_EFFECTS_COORDINATION.md) - VisualEffectsCoordinator system guide
- [Performance Guidelines](./docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md) - Optimization strategies
- [Troubleshooting Guide](./docs/TROUBLESHOOTING_GUIDE.md) - Issue resolution

### Essential Validation
- TypeScript: `npm run typecheck` (zero errors required)
- Testing: `npm run test` (90%+ coverage required)  
- Linting: `npm run lint:js && npm run lint:css` (zero warnings)
- Performance: Monitor bundle size <1MB, frame rate 60fps
- Integration: All systems implement `IManagedSystem` interface

### Development Philosophy
- **Simplicity First**: Choose simplest solution meeting requirements
- **Performance-First**: Every feature must meet performance budgets
- **Direct Integration**: Solve problems directly, not through compatibility layers
- **Developer-Friendly**: Clear naming and minimal abstractions
- **Progressive Enhancement**: Core functionality first, sophistication later