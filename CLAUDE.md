# Catppuccin StarryNight - Spicetify Theme

This file provides guidance to Claude Code when working with the **Catppuccin StarryNight** Spicetify theme codebase.

## Project Overview

**Catppuccin StarryNight** is an advanced Spicetify theme that implements sophisticated visual effects and music synchronization through a modular TypeScript architecture. It creates dynamic, music-responsive interfaces with real-time audio analysis and OKLAB color science processing.

### Core Architecture
- **Coordination Pattern**: SystemCoordinator orchestrating VisualSystemCoordinator and NonVisualSystemFacade
- **Unified Interface**: All systems implement `IManagedSystem` for consistent lifecycle management
- **Performance-First**: 60fps target with adaptive quality scaling and device-aware optimization
- **OKLAB Color Science**: Perceptually uniform color processing for natural visual experiences
- **Audio Integration**: Real-time music analysis driving visual harmonization

### Tech Stack
- **Languages**: TypeScript (strict mode), SCSS, JavaScript ES6+
- **Build**: ESBuild bundling, Jest testing, SASS compilation
- **Build Output**:
  - `src-js/**/*.ts` → compiles to `theme.js` (bundled JavaScript for Spicetify)
  - `src/**/*.scss` → compiles to `user.css` (theme stylesheet for Spicetify)
- **APIs**: Spicetify Player/Platform, React/ReactDOM, colorExtractor, getAudioData
- **Performance**: WebGL2 with CSS fallbacks, Intersection Observer, Performance Observer

## Development Commands

### Build & Test
- `npm run build` - Full development build (CSS + JS with sourcemap)
- `npm run build:dev` - Same as build (development mode)
- `npm run build:prod` - Production build with minification and PostCSS optimization
- `npm run build:fast` - Quick production build (compressed CSS + minified JS)
- `npm run build:js:dev` - TypeScript bundle with sourcemap
- `npm run build:js:prod` - Minified TypeScript bundle
- `npm run build:css:dev` - Expanded SCSS compilation
- `npm run build:css:prod` - Compressed SCSS with PostCSS optimization

### Testing & Validation
- `npm test` - Run Jest tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:unit:audio` - Audio system unit tests
- `npm run test:unit:core` - Core system unit tests
- `npm run test:unit:visual` - Visual system unit tests
- `npm run test:unit:utils` - Utility function unit tests
- `npm run test:comprehensive` - Full test suite including performance tests
- `npm run typecheck` - TypeScript compilation check
- `npm run typecheck:watch` - Watch TypeScript compilation
- `npm run lint:js` - ESLint on TypeScript (strict mode, zero warnings)
- `npm run lint:js:fix` - Fix ESLint issues automatically
- `npm run lint:css` - Stylelint on SCSS files
- `npm run validate` - Complete validation (typecheck + lint + test)

### CSS Development
- `npm run sass:watch` - Watch SCSS files for changes and auto-compile
- `npm run scan-css` - Scan SCSS files for tokens and variables
- `npm run diff-css` - Show differences between CSS token versions
- `npm run replace-css` - Replace CSS tokens using mapping
- `npm run generate-map` - Generate replacement mapping for CSS tokens
- `npm run prune-css` - Remove duplicate CSS declarations
- `npm run build:css:purgecss` - Build CSS with unused styles removed
- `npm run build:css:advanced` - Advanced CSS optimization build

### Installation & Release
- `npm run install` - Build and install theme (CI detection)
- `npm run install:force` - Force install with mocha flavor
- `npm run prepare:release` - Prepare files for release

## Architecture Summary

### Build Architecture
The theme consists of two compilation pipelines:

1. **TypeScript Pipeline** (`src-js/` → `theme.js`):
   - Entry point: `src-js/theme.entry.ts`
   - Bundler: ESBuild with tree-shaking
   - Output: Single bundled `theme.js` file loaded by Spicetify
   - External dependencies: React, ReactDOM (provided by Spicetify)

2. **SCSS Pipeline** (`src/` → `user.css`):
   - Entry point: `app.scss`
   - Compiler: SASS with PostCSS optimization
   - Output: Single compiled `user.css` stylesheet
   - Contains: CSS variables, layout rules, visual effects, animations

**IMPORTANT**: Changes to `src-js/**/*.ts` files require rebuilding `theme.js` to take effect. Changes to `src/**/*.scss` files require recompiling `user.css`. The compiled outputs (`theme.js` and `user.css`) are what Spicetify actually loads.

### System Entry Point
**Entry Point**: `src-js/theme.entry.ts` - Main system initialization and progressive API detection

### Core System Hierarchy

#### 1. Central Orchestration Layer
- **`AdvancedThemeSystem`** - Central system orchestrator (Year3000System)
- **`SystemCoordinator`** - Dependency injection and facade coordination
- **Progressive API Detection** - Graceful degradation when Spicetify APIs unavailable

#### 2. System Coordination Layer
- **`VisualSystemCoordinator`** - Coordinates visual systems (background, effects, UI)
- **`NonVisualSystemFacade`** - Factory for services (performance, settings, music sync)
- **`SystemCoordinator`** - Orchestrates interaction between visual and non-visual systems
- **Unified lifecycle management** through `IManagedSystem` interface

#### 3. Visual & Audio Integration Layer
- **`MusicSyncService`** - Spicetify API integration with beat detection
- **`ColorHarmonyEngine`** - OKLAB color science processing
- **`VisualEffectsCoordinator`** - Unified visual state coordination
- **`WebGLRenderer`** - Hardware-accelerated visuals with CSS fallbacks
- **Background Systems** - Multiple specialized visual effect controllers

#### 4. Performance Optimization Layer
- **`PerformanceAnalyzer`** - Real-time monitoring and quality scaling
- **`DeviceCapabilityDetector`** - Hardware detection and optimization
- **`OptimizedUnifiedCSSController`** - Efficient DOM updates and variable management

### Core Interface Pattern
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

### Module Path Mapping (TypeScript only)
- `@/` → `src-js/` (main source directory)
- `@/audio/*` → `src-js/audio/*` (music sync and color harmony)
- `@/core/*` → `src-js/core/*` (system architecture and coordination)
- `@/visual/*` → `src-js/visual/*` (visual effects and rendering)
- `@/utils/*` → `src-js/utils/*` (utilities and helpers)
- `@/config/*` → `src-js/config/*` (configuration and settings)
- `@/types/*` → `src-js/types/*` (TypeScript type definitions)

**Note**: Path aliases only apply to TypeScript files in `src-js/`. SCSS files in `src/` use standard SCSS `@import` or `@use` statements.

### Spicetify Environment
- **React/ReactDOM**: Provided by Spicetify, marked as external in ESBuild
- **API Availability**: Progressive detection with graceful degradation
- **Build Target**: Chromium engine (Spotify's embedded browser)
- **Runtime APIs**: `Spicetify.Player`, `Platform`, `colorExtractor`, `getAudioData`

## Development Standards

### Performance Requirements (Target Goals)
- **Frame Rate**: 60fps target with graceful degradation
- **Memory**: Minimize heap usage, prevent leaks during extended sessions
- **Responsiveness**: UI interactions <100ms, smooth transitions
- **Build System**: ESBuild for fast development compilation
- **Bundle Optimization**: Production builds with minification and compression

### Code Quality Standards
- **TypeScript**: Strict mode enabled, working toward eliminating `any` types
- **Interface Compliance**: Core systems implement `IManagedSystem` (ongoing migration)
- **Error Handling**: All Spicetify API calls should have try-catch with fallbacks
- **Testing**: Jest framework configured, working toward higher coverage
- **Documentation**: JSDoc for public APIs (ongoing improvement)
- **Accessibility**: `prefers-reduced-motion` support implemented

### Naming Conventions
**Classes** - Clear, descriptive, indicate function:
- ✅ `AudioAnalyzer`, `ColorHarmonyEngine`, `PerformanceAnalyzer`
- ❌ `ConsciousnessManager`, `OrganicInterface`, `FlowEntity`

**Methods** - Action-oriented, specify behavior:
- ✅ `updateColorsFromMusic()`, `detectBeat()`, `optimizePerformance()`
- ❌ `channelConsciousness()`, `breatheInterface()`, `orchestrateFlow()`

**Variables** - Describe data clearly:
- ✅ `currentTrack`, `colorTemperature`, `frameRate`, `deviceCapabilities`
- ❌ `consciousness`, `organicState`, `synapticData`

**Technical Naming**:
- **Files**: `PascalCase.ts` for systems, `camelCase.ts` for utilities
- **CSS Variables**: `--sn-*` theme prefix, `--spice-*` Spicetify compatibility
- **SCSS Mixins**: `kebab-case` with descriptive names

## Technology Constraints

### Allowed Technologies
- **Languages**: TypeScript (strict), SCSS, JavaScript ES6+
- **APIs**: Spicetify Player/Platform, React/ReactDOM, colorExtractor, getAudioData
- **Build**: ESBuild, TypeScript compiler, Jest/ts-jest, SASS, PostCSS
- **Performance**: WebGL2, CSS transitions, Intersection Observer, Performance Observer
- **Libraries**: OKLAB color utilities, lightweight utilities (<10KB total)

### Prohibited Technologies
- **Heavy Libraries**: jQuery, GSAP, Three.js, external UI frameworks
- **Build Tools**: Webpack, Rollup, Parcel (ESBuild only)
- **Styling**: CSS-in-JS, styled-components, runtime CSS generation
- **Anti-Patterns**: Continuous loops, canvas physics, high-frequency DOM manipulation

## Claude Code Development Workflow

### File Navigation
- Use **Glob** tool for finding files by patterns: `**/*.ts`, `src-js/**/*`, `src/**/*.scss`
- Use **Grep** tool for code search: find implementations, interfaces, references
- Use **Read** tool to understand file contents before making changes
- **TypeScript Entry Point**: `src-js/theme.entry.ts` (compiles to `theme.js`)
- **SCSS Entry Point**: `app.scss` (imports from `src/`, compiles to `user.css`)

### Development Process
1. **Understand First**: Read relevant files and understand current architecture
2. **Search Thoroughly**: Use Grep to find all references before modifying interfaces
3. **Build After Changes**:
   - TypeScript changes: Run `npm run build:js:dev` to rebuild `theme.js`
   - SCSS changes: Run `npm run build:css:dev` to rebuild `user.css`
   - Full rebuild: Run `npm run build` for both
4. **Test Continuously**: Run `npm run typecheck` and `npm test` after changes
5. **Validate Performance**: Ensure changes don't break performance requirements
6. **Document Changes**: Update JSDoc comments for public API changes

**Critical**: Remember that Spicetify loads the compiled `theme.js` and `user.css` files, not the source files directly. Always rebuild after making changes to see them take effect.

### Common Tasks
- **Adding Visual Effects**: Implement `IManagedSystem`, register with `VisualSystemCoordinator`
- **Adding Services**: Register with `NonVisualSystemFacade` for infrastructure systems
- **Performance Optimization**: Use `PerformanceAnalyzer` integration, measure before/after
- **Color Processing**: Use `ColorHarmonyEngine` and OKLAB color space
- **Music Integration**: Integrate with `MusicSyncService` for audio-reactive features
- **Settings**: Use `SettingsManager` for persistent configuration

### Testing Strategy
- **Framework**: Jest with ts-jest preset and JSDOM environment
- **Coverage**: Focus on system coordination and cross-system integration
- **Test Structure**: Unit tests in `tests/unit/`, integration tests in `tests/integration/`
- **Performance Tests**: Memory leak detection and frame rate regression testing
- **Module Mapping**: `@/` paths configured in both tsconfig.json and jest.config.js

### Error Handling Patterns
- All Spicetify API calls must have try-catch blocks with fallback behavior
- Progressive enhancement when APIs are unavailable
- Graceful degradation maintaining core CSS-only functionality
- Health check methods for system diagnostics

## Key Documentation
- [`docs/MASTER_ARCHITECTURE_OVERVIEW.md`](./docs/MASTER_ARCHITECTURE_OVERVIEW.md) - Complete system architecture
- [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md) - Interfaces and implementation examples
- [`docs/VISUAL_EFFECTS_COORDINATION.md`](./docs/VISUAL_EFFECTS_COORDINATION.md) - Visual system coordination guide
- [`docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md`](./docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md) - Performance optimization strategies

## Quick Reference

### Essential Validation Commands
```bash
npm run typecheck    # TypeScript compilation check
npm test            # Run Jest test suite
npm run lint:js     # ESLint code quality check (many warnings to resolve)
npm run validate    # Complete validation suite (typecheck + lint + test)
```

### Code Quality Status
The codebase is actively being modernized. Current status:
- **TypeScript**: Compiles successfully with strict mode
- **ESLint**: ~1500 warnings/errors being addressed (mainly `any` types and unused variables)
- **Testing**: Jest framework configured, tests need expansion
- **Performance**: Core systems optimized, ongoing refinements

### Debug Access
When `ADVANCED_SYSTEM_CONFIG.enableDebug = true`, access global `Y3K` object:
- `Y3K.system` - Main Year3000System instance
- `Y3K.music` - MusicSyncService
- `Y3K.debug` - Debug utilities
- `Y3K.health` - System health monitoring

### Development Philosophy
- **Simplicity First**: Choose the simplest solution that meets requirements
- **Performance-First**: Every feature must meet performance budgets
- **Progressive Enhancement**: Core functionality first, sophistication later
- **Developer-Friendly**: Clear naming, minimal abstractions, easy onboarding
- **Direct Integration**: Solve problems directly within the Spicetify environment