# Catppuccin StarryNight - Domain Rules

## Core Architecture
- **Coordination Pattern**: ThemeLifecycleCoordinator → SystemIntegrationCoordinator → (VisualEffectsCoordinator + InfrastructureSystemCoordinator)
- **Unified Interface**: All systems implement `IManagedSystem` for consistent lifecycle management
- **Service Composition**: Modern systems use `SystemServiceBridge` (composition) instead of `BaseVisualSystem` (inheritance)
- **Performance-First**: 60fps target with adaptive quality scaling and device-aware optimization
- **OKLAB Color Science**: Perceptually uniform color processing for natural visual experiences
- **Audio Integration**: Real-time music analysis driving visual harmonization

## Tech Stack
- **Languages**: TypeScript (strict mode), SCSS, JavaScript ES6+
- **Build**: ESBuild bundling, Jest testing, SASS compilation
- **APIs**: Spicetify Player/Platform, React/ReactDOM, colorExtractor, getAudioData
- **Performance**: WebGL2 with CSS fallbacks, Intersection Observer, Performance Observer

## System Hierarchy
#### 1. Central Orchestration Layer
- **`AdvancedThemeSystem`** - Central system orchestrator (Year3000System)
- **`SystemCoordinator`** - Dependency injection and facade coordination
- **Progressive API Detection** - Graceful degradation when Spicetify APIs unavailable

#### 2. System Coordination Layer
- **`SystemIntegrationCoordinator`** - Main facade coordinator managing both visual and infrastructure systems
- **`VisualEffectsCoordinator`** - Manages visual systems (backgrounds, particles, effects, UI)
- **`InfrastructureSystemCoordinator`** - Manages non-visual systems (performance, CSS, settings, music sync)
- **Unified lifecycle management** through `IManagedSystem` interface
- **Service composition** via `DefaultServiceFactory` providing shared services to all systems

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

## Interface Pattern
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

## Module Path Mapping (TypeScript only)
- `@/` → `src-js/` (main source directory)
- `@/audio/*` → `src-js/audio/*` (music sync and color harmony)
- `@/core/*` → `src-js/core/*` (system architecture and coordination)
- `@/visual/*` → `src-js/visual/*` (visual effects and rendering)
- `@/utils/*` → `src-js/utils/*` (utilities and helpers)
- `@/config/*` → `src-js/config/*` (configuration and settings)
- `@/types/*` → `src-js/types/*` (TypeScript type definitions)

**Note**: Path aliases only apply to TypeScript files in `src-js/`. SCSS files in `src/` use standard SCSS `@import` or `@use` statements.

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

## Development Standards

### Performance Requirements (Target Goals)
- **Frame Rate**: 60fps target with graceful degradation
- **Memory**: Minimize heap usage, prevent leaks during extended sessions
- **Responsiveness**: UI interactions <100ms, smooth transitions

### Code Quality Standards
- **TypeScript**: Strict mode enabled, working toward eliminating `any` types
- **Interface Compliance**: Core systems implement `IManagedSystem` (ongoing migration)
- **Error Handling**: All Spicetify API calls should have try-catch with fallbacks
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