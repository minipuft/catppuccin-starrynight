# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build & Test
- `npm run build` - Bundles TypeScript source files from `src-js/` to `theme.js` using esbuild
- `npm test` - Runs Jest tests for visual systems and managers
- `npm run lint:css` - Runs stylelint on SCSS files in `src/`

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

### "Year 3000" System
The theme is built around a sophisticated internal framework called the "Year 3000 System":

- **`Year3000System`** - Central orchestrator managing all visual systems, managers, and services
- **`ColorHarmonyEngine`** - Handles dynamic color extraction from album art and blending with Catppuccin palette
- **`MusicSyncService`** - Real-time music analysis for beat-synchronized visuals
- **Performance Layer** - `MasterAnimationCoordinator`, `PerformanceAnalyzer`, `CSSVariableBatcher` for optimized 60fps visuals

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

### Performance Requirements
- Target 60fps for all animations
- Memory usage must not exceed 50MB
- CPU usage increase should be <10% during idle, <30% during transitions
- Progressive degradation for lower-end hardware

### Testing
- Jest with ts-jest for TypeScript support
- Tests focus on visual systems, managers, and core functionality
- Module path mapping: `@/` maps to `src-js/`

### Development Notes
- Uses TypeScript for all JavaScript logic
- React/ReactDOM provided by Spicetify environment
- No jQuery or heavy animation libraries (performance-critical)
- Extensive documentation in `docs/` directory
- Built for Spicetify CLI with manual SCSS compilation

### Debugging
- Global `Y3K` object exposed in debug mode with access to system internals
- Debug mode enabled via `YEAR3000_CONFIG.enableDebug = true`
- Drag cartography system for DOM interaction debugging