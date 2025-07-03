# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the **Catppuccin StarryNight** Spicetify theme codebase.

## Project Philosophy
*"Every line of code should feel like stardust settling into constellation patterns - purposeful, beautiful, and performant. We choreograph systems that dance with the rhythm of user's music and the physics of their hardware."*

The theme follows a **C.A.G.E.E.R.F** framework (Constraints, Actions, Goals, Execution, Evaluation, Refinement, Format) built around the "Year 3000 System" architecture.

## Common Development Commands

### Build & Test Commands
- `npm run build` - Bundles TypeScript source files from `src-js/` to `theme.js` using esbuild
- `npm test` - Runs Jest tests for visual systems and managers (require 90%+ coverage)
- `npm run lint:css` - Runs stylelint on SCSS files in `src/` (zero warnings required)
- `npm run lint:js` - ESLint check for TypeScript files (strict mode)
- `npm run typecheck` - TypeScript compilation check (no `any` types allowed)

### CSS Development & Maintenance
- `npm run scan-css` - Scans SCSS files for CSS tokens and variables
- `npm run diff-css` - Shows differences between CSS token versions
- `npm run replace-css` - Replaces CSS tokens using generated mapping file
- `npm run generate-map` - Generates replace mapping for CSS tokens
- `npm run fill-dispositions` - Fills dispositions for CSS variables
- `npm run prune-css` - Removes duplicate CSS declarations

### Manual Compilation
- SCSS compilation is handled manually (not via npm scripts)
- Compile `app.scss` to `user.css` using your preferred SASS compiler

## Architecture Overview

### "Year 3000" System Framework
The theme is built around a sophisticated internal framework designed for futuristic, music-responsive visual design:

- **`Year3000System`** - Central orchestrator implementing `StarryNightModule` pattern
- **`ColorHarmonyEngine`** - Dynamic color extraction (<200ms) and Catppuccin palette blending
- **`MusicSyncService`** - Real-time audio analysis with 90% accuracy for 60-200 BPM
- **Performance Layer** - `MasterAnimationCoordinator`, `PerformanceAnalyzer`, `CSSVariableBatcher` targeting 60fps

### Modular Architecture Pattern
All components implement the `StarryNightModule` interface:
```typescript
interface StarryNightModule {
  initialize(): Promise<void>;
  cleanup(): void;
  healthCheck?(): HealthCheckResult;
}
```

### Key Components

#### Core Systems (`src-js/core/`)
- **`year3000System.ts`** - Main system orchestrator
- **`EventBus.ts`** - Communication between systems
- **`TimerConsolidationSystem.ts`** - Consolidated timer management
- **`VisualSystemRegistry.ts`** - Manages visual system lifecycle

#### Visual Systems (`src-js/systems/visual/`)
- **`BeatSyncVisualSystem.ts`** - Beat-synchronized animations
- **`LightweightParticleSystem.ts`** - Optimized particle effects
- **`WebGPUBackgroundSystem.ts`** - GPU-accelerated backgrounds
- **`RightSidebarConsciousnessSystem.ts`** - Sidebar-specific visual enhancements

#### Managers (`src-js/managers/`)
- **`SettingsManager.ts`** - User configuration persistence
- **`Card3DManager.ts`** - 3D card transformations
- **`GlassmorphismManager.ts`** - Glassmorphism effects

#### Services (`src-js/services/`)
- **`MusicSyncService.ts`** - Spotify API integration for music analysis
- **`TemporalMemoryService.ts`** - History and state management

### Entry Point
- **`src-js/theme.entry.ts`** - Main initialization file that sets up the entire system
- Progressive API detection with graceful degradation if Spicetify APIs are unavailable
- Handles React/ReactDOM shimming for third-party libraries

### Styling Architecture
- **SCSS modular structure** - Organized by components, layout, features, and systems
- **CSS Variable System** - Extensive use of CSS custom properties for dynamic theming
- **Catppuccin Integration** - Maintains Catppuccin color palette while allowing dynamic album art adaptation

## Development Standards

### Performance Requirements (Non-Negotiable)
- **Frame Rate**: 60fps target, never below 45fps
- **Memory Usage**: <50MB heap size, zero leaks during 4+ hour sessions
- **CPU Usage**: <10% increase during idle, <30% during transitions
- **GPU Usage**: <25% on mid-range hardware during normal playback
- **Responsiveness**: UI interactions <100ms, color transitions <500ms
- **Progressive degradation**: Auto-detect capabilities, graceful fallbacks

### Code Quality Standards
- **TypeScript Coverage**: 100% with no `any` types allowed
- **Error Handling**: All Spicetify API calls must have try-catch with fallbacks
- **Documentation**: JSDoc required for all public methods with usage examples
- **Testing**: 90%+ coverage required, visual system tests mandatory
- **Accessibility**: WCAG 2.1 AA compliance, `prefers-reduced-motion` support

### Naming Conventions
- **Files**: `PascalCase.ts` for classes, `camelCase.ts` for utilities
- **CSS Variables**: `--sn-*` prefix for theme, `--spice-*` for Spicetify compatibility
- **SCSS Mixins**: `kebab-case` with descriptive action names
- **Components**: Implement `StarryNightModule` interface pattern

### Testing
- Jest with ts-jest for TypeScript support
- Tests focus on visual systems, managers, and core functionality
- Module path mapping: `@/` maps to `src-js/`

## Technology Constraints

### Allowed Technologies
- **Languages**: TypeScript (primary), SCSS, JavaScript ES6+
- **Core APIs**: Spicetify Player, Platform, React/ReactDOM, colorExtractor, getAudioData
- **Build Tools**: esbuild, TypeScript compiler, Jest/ts-jest
- **Libraries**: Only lightweight utilities (<10KB total bundle impact)

### Prohibited Technologies
- **Heavy Libraries**: jQuery, GSAP, Three.js, external UI frameworks
- **Build Tools**: Webpack, Rollup (esbuild only)
- **Styling**: CSS-in-JS libraries, styled-components
- **Dependencies**: Any library that increases bundle >50KB or affects startup time

### Development Environment
- Built for Spicetify CLI with manual SCSS compilation
- React/ReactDOM provided by Spicetify environment
- Module path mapping: `@/` maps to `src-js/`
- Extensive documentation in `docs/` directory

### Debugging & Diagnostics
- **Global Debug Object**: `Y3K` exposed when `YEAR3000_CONFIG.enableDebug = true`
- **Performance Monitoring**: Real-time resource usage via `PerformanceAnalyzer`
- **System Health**: Component health checks and automatic recovery
- **Drag Cartography**: DOM interaction debugging system
- **Memory Profiling**: Leak detection during long sessions

## Quality Gates & Validation

### Technical Validation
- All automated tests pass with 90%+ coverage
- TypeScript compilation with zero errors/warnings
- ESLint/Stylelint rules enforcement
- Bundle size <200KB gzipped

### Performance Verification
- Resource usage meets requirements on test devices
- 8+ hour stability testing without degradation
- Cross-platform compatibility (Windows, macOS, Linux)
- Audio sync accuracy >90% for 60-200 BPM range

### User Experience Validation
- WCAG 2.1 AA accessibility compliance
- Progressive disclosure of advanced features
- Real-time settings preview without restart
- Graceful degradation on hardware limitations

## AI Assistant Framework

This project uses the **C.A.G.E.E.R.F** prompt engineering framework for consistent, high-quality AI assistance:

### Framework Application
- **Context**: Year 3000 System architecture awareness, performance constraints, and security requirements
- **Actions**: Specific action verbs (Generate, Analyze, Refactor, Optimize, Debug, Document, Test)
- **Goals**: 99% code correctness, security-first approach, performance optimization
- **Execution**: Multi-step validation pipeline with TypeScript/WebGL/SCSS expertise
- **Evaluation**: Self-assessment with confidence scoring and trade-off analysis
- **Refinement**: Iterative improvement with clarification protocols
- **Format**: Structured responses with code, explanation, integration notes, and testing guidance

### Integration with Project Standards
The framework enforces:
- **Architecture Patterns**: `StarryNightModule` interface compliance
- **Performance Targets**: 60fps animations, <50MB memory, <10% CPU overhead
- **Code Quality**: 90%+ test coverage, zero `any` types, comprehensive error handling
- **Security**: Defensive coding practices, input validation, graceful degradation

For detailed framework documentation, see `docs/development/AI_FRAMEWORK.md`.