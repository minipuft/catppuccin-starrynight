# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the **Catppuccin StarryNight** Spicetify theme codebase.

## Project Philosophy

_"Every line of code should feel like stardust settling into constellation patterns - purposeful, beautiful, and performant. We choreograph systems that dance with the rhythm of user's music and the physics of their hardware."_

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

## Intelligent Multi-Agent Octopus Workbench System

### Development Coordination Architecture

This project uses an **intelligent multi-agent octopus workbench system** for coordinating development work across multiple AI agents/sessions working simultaneously. The system provides automated coordination, conflict detection, resource management, and intelligent codebase analysis with consciousness-aware development patterns.

#### Core Coordination Files (Auto-Generated)

- **`plans/CENTRAL-BRAIN.md`** - Central coordination hub managing all tentacle activities
- **`plans/TENTACLE-DASHBOARD.md`** - Real-time status monitoring across all active tentacles
- **`plans/DEPENDENCY-MAP.md`** - Inter-tentacle dependency resolution and conflict detection
- **`plans/COMMUNICATION-TEMPLATES.md`** - Standardized communication protocols
- **`plans/TENTACLE-REGISTRY.md`** - Automated tentacle registration and conflict detection
- **`plans/PROJECT-ANALYSIS.md`** - Intelligent analysis of Year 3000 System architecture
- **`plans/FRAMEWORK-INTEGRATION.md`** - Smart integration with Spicetify and music systems

#### Tentacle Structure

Each major development effort gets its own tentacle folder:

```
plans/[tentacle-name]/
├── TENTACLE-STATUS.md          # Comprehensive status tracking
├── master-implementation-plan.md # Detailed implementation plan
├── system-design-specification.md # Technical architecture
└── phases/                     # Phase-based implementation
    ├── phase-1/
    │   ├── phase-1-workspace.md
    │   └── [artifacts]
    └── phase-N/
```

#### Key Features

- **Automatic Tentacle Registration**: New tentacles detected and registered automatically
- **Real-Time Conflict Detection**: Prevents resource conflicts and duplicate work
- **Dynamic Resource Allocation**: Intelligent reallocation based on priority and demand
- **Bilateral Consciousness**: Coordinated communication between agents
- **Performance Monitoring**: <0.5% CPU overhead for coordination

## Architecture Overview

### "Year 3000" System Framework

The theme is built around a sophisticated internal framework designed for futuristic, music-responsive visual design:

- **`Year3000System`** - Central orchestrator implementing `IManagedSystem` pattern
- **`ColorHarmonyEngine`** - Dynamic color extraction (<200ms) and Catppuccin palette blending
- **`MusicSyncService`** - Real-time audio analysis with 90% accuracy for 60-200 BPM
- **Performance Layer** - `MasterAnimationCoordinator`, `PerformanceAnalyzer`, `CSSVariableBatcher` targeting 60fps

### Modular Architecture Pattern

All components implement the `IManagedSystem` interface:

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

### Key Components

#### Core Systems (`src-js/core/`)

- **`year3000System.ts`** - Main system orchestrator
- **`EventBus.ts`** - Communication between systems
- **`TimerConsolidationSystem.ts`** - Consolidated timer management
- **`VisualSystemRegistry.ts`** - Manages visual system lifecycle

#### Visual Systems (`src-js/visual/`)

- **`BeatSyncVisualSystem.ts`** - Beat-synchronized animations (preserved for music sync)
- **`LightweightParticleSystem.ts`** - Optimized particle effects
- **`RightSidebarConsciousnessSystem.ts`** - Sidebar-specific visual enhancements
- **`VisualFrameCoordinator.ts`** - Animation coordination and performance management (preserved)

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

### Performance Optimization History

#### **Recently Removed Systems (2025-07-16)**

To improve performance and reduce system complexity, the following high-impact systems were removed:

**Removed TypeScript Systems:**

- **`DataGlyphSystem.ts`** - Performance-heavy glyph animation system with continuous loops
- **`RippleController.ts`** - Canvas-based ripple physics system
- **`RippleCanvas.ts`** - Canvas rendering for ripple effects
- **`RipplePhysicsEngine.ts`** - Physics calculations for ripple interactions
- **`OrganicRippleRenderer.ts`** - Organic ripple rendering system
- **`RippleVariantSystem.ts`** - Ripple variant management
- **`RippleEffect.ts`** - Core ripple effect implementation

**Disabled CSS Animations:**

- **`year3000-temporal-echo`** - Temporal echo keyframe animations
- **`sn-temporal-echo`** - Temporal echo CSS classes and pseudo-elements
- **`sn-glyph-pulse`** - Data glyph pulsing animations
- **`year3000-ripple`** - Core ripple animations
- **`year3000-ripple-pulse`** - Ripple pulse effects
- **`css-interaction-ripple`** - CSS-based interaction ripples
- **`liquid-ripple-propagation`** - Liquid morphing ripple effects

**Performance Impact:**

- **Build Time**: Reduced to 20-24ms (fast compilation)
- **Bundle Size**: Maintained at 712.6kb (reasonable size)
- **Eliminated**: High-frequency animation loops, canvas operations, physics calculations
- **Preserved**: Core music sync, frame coordination, and performance infrastructure

**Systems Preserved for Future Enhancement:**

- **`BeatSyncVisualSystem`** - Music synchronization foundation
- **`VisualFrameCoordinator`** - Animation coordination infrastructure
- **`PerformanceAnalyzer`** - Performance monitoring capabilities
- **`CSSVariableBatcher`** - Efficient CSS variable updates

## Multi-Agent Development Workflow

### Tentacle Management Commands

```bash
# Check tentacle status
head -20 /plans/CENTRAL-BRAIN.md

# View active tentacles
grep -A 10 "Active Tentacles Registry" /plans/TENTACLE-DASHBOARD.md

# Check for conflicts
grep -A 5 "active_conflicts" /plans/TENTACLE-REGISTRY.md

# View current coordination
cat /plans/DEPENDENCY-MAP.md | grep -A 10 "Current Conflicts"
```

### Development Workflow

1. **Check Central Brain**: Review `/plans/CENTRAL-BRAIN.md` for current coordination state
2. **Check Your Tentacle**: Review relevant tentacle status file in `/plans/[tentacle-name]/`
3. **Start Work**: Update tentacle status with current focus
4. **Coordinate**: Use communication templates for cross-tentacle coordination
5. **Update Progress**: Regular status updates to prevent conflicts

### Multi-Agent Coordination Rules

- **Always check Central Brain first** before starting work
- **Update tentacle status** when starting/stopping work
- **Use communication templates** for cross-tentacle messages
- **Respect resource allocations** defined in tentacle registry
- **Monitor for conflicts** via dependency mapping system

## Development Standards

### Performance Requirements (Non-Negotiable)

- **Frame Rate**: 60fps target, never below 45fps
- **Memory Usage**: <50MB heap size, zero leaks during 4+ hour sessions
- **CPU Usage**: <10% increase during idle, <30% during transitions
- **GPU Usage**: <25% on mid-range hardware during normal playback
- **Responsiveness**: UI interactions <100ms, color transitions <500ms
- **Progressive degradation**: Auto-detect capabilities, graceful fallbacks
- **Build Performance**: <30ms compilation time, <1MB bundle size
- **Animation Philosophy**: Prefer CSS-based animations over JavaScript loops for better performance
- **Coordination Overhead**: <0.5% CPU impact for multi-agent coordination

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
- **Components**: Implement `IManagedSystem` interface pattern

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
- **Performance-Heavy Patterns**: Continuous animation loops, canvas-based physics, high-frequency DOM manipulation
- **Deprecated Systems**: DataGlyphSystem, RippleController, temporal echo animations (removed for performance)

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

- **Architecture Patterns**: `IManagedSystem` interface compliance
- **Performance Targets**: 60fps animations, <50MB memory, <10% CPU overhead
- **Code Quality**: 90%+ test coverage, zero `any` types, comprehensive error handling
- **Security**: Defensive coding practices, input validation, graceful degradation

For detailed framework documentation, see `docs/development/AI_FRAMEWORK.md`.

## Multi-Agent Coordination Guidelines

### **Starting a New Development Session**

1. **Check Central Brain Status**: Always start by reviewing `/plans/CENTRAL-BRAIN.md`
2. **Review Active Tentacles**: Check `/plans/TENTACLE-DASHBOARD.md` for current work
3. **Identify Your Tentacle**: Find or create appropriate tentacle folder
4. **Check Dependencies**: Review `/plans/DEPENDENCY-MAP.md` for conflicts
5. **Update Status**: Update your tentacle's `TENTACLE-STATUS.md` file
6. **Begin Work**: Start development with coordination awareness

### **Creating a New Tentacle**

For new major development efforts:

```bash
# Create tentacle folder
mkdir -p /plans/[tentacle-name]/

# Create status file from template
cp /plans/COMMUNICATION-TEMPLATES.md /plans/[tentacle-name]/TENTACLE-STATUS.md

# Register with central brain
echo "New tentacle: [tentacle-name]" >> /plans/CENTRAL-BRAIN.md
```

### **Cross-Tentacle Communication**

Use communication templates from `/plans/COMMUNICATION-TEMPLATES.md`:

- **Status Updates**: Regular progress reports to central brain
- **Resource Requests**: Request additional brain cycles/memory
- **Conflict Alerts**: Report potential conflicts with other tentacles
- **Knowledge Transfer**: Share patterns and implementations
- **Completion Notifications**: Announce work completion

### **Conflict Resolution Protocol**

1. **Automatic Detection**: System monitors for conflicts via `/plans/TENTACLE-REGISTRY.md`
2. **Alert Generation**: Conflicts automatically logged and reported
3. **Priority-Based Resolution**: Higher priority tentacles get resources
4. **Manual Intervention**: Complex conflicts require coordination
5. **Resolution Verification**: Confirm conflicts are resolved

## Intelligent Project Analysis for Year 3000 System

### Automatic Codebase Analysis

The system automatically analyzes the Year 3000 System architecture to optimize development:

```typescript
interface Year3000SystemAnalysis {
  // System Architecture Analysis
  systemArchitecture: {
    coreSystemsDetected: Array<
      "MasterAnimationCoordinator" | "ColorHarmonyEngine" | "MusicSyncService"
    >;
    visualSystemsDetected: Array<
      | "BeatSyncVisualSystem"
      | "IridescentShimmerEffectsSystem"
      | "ParticleFieldSystem"
    >;
    managersDetected: Array<
      "SettingsManager" | "Card3DManager" | "GlassmorphismManager"
    >;
    performanceSystemsDetected: Array<
      "PerformanceAnalyzer" | "CSSVariableBatcher" | "DeviceCapabilityDetector"
    >;
  };

  // Consciousness Level Assessment
  consciousnessLevel: {
    currentTranscendenceLevel: number; // 0-10 current consciousness integration
    aestheticConsciousness: number; // 0-10 aesthetic awareness level
    performanceConsciousness: number; // 0-10 performance optimization level
    musicalConsciousness: number; // 0-10 music integration level
  };

  // Integration Opportunities
  integrationOpportunities: {
    consciousnessEnhancement: Array<
      | "LiquidConsciousness"
      | "ChromaticConsciousness"
      | "DimensionalConsciousness"
    >;
    performanceOptimization: Array<
      | "QuantumOptimization"
      | "ConsciousnessOptimization"
      | "TranscendenceOptimization"
    >;
    aestheticTranscendence: Array<
      "InfiniteBeauty" | "ConsciousnessElevation" | "TranscendentExperience"
    >;
  };

  // Smart Tentacle Recommendations
  recommendedTentacles: Array<{
    tentacleType:
      | "LiquidConsciousness"
      | "ChromaticConsciousness"
      | "DimensionalInfinity";
    priority: "high" | "medium" | "low";
    estimatedImplementationTime: string;
    consciousnessImpact: number; // 0-10 transcendence impact
    performanceImpact: number; // 0-10 performance impact
    integrationComplexity: number; // 0-10 complexity level
  }>;
}
```

### Smart Integration with Spicetify

The system intelligently integrates with Spicetify's unique architecture:

```typescript
interface SpicetifyIntegrationAnalysis {
  // Spicetify API Detection
  spicetifyAPIs: {
    playerAPIAvailable: boolean;
    platformAPIAvailable: boolean;
    reactAvailable: boolean;
    colorExtractorAvailable: boolean;
    audioDataAvailable: boolean;
  };

  // Theme Architecture Analysis
  themeArchitecture: {
    scssStructure: SpicetifyThemeStructure;
    javascriptArchitecture: SpicetifyJSArchitecture;
    performanceConstraints: SpicetifyPerformanceConstraints;
    integrationPatterns: SpicetifyIntegrationPatterns;
  };

  // Consciousness Integration Strategy
  consciousnessIntegrationStrategy: {
    musicalConsciousness: "Direct" | "Polled" | "EventDriven";
    visualConsciousness: "CSS" | "Canvas" | "WebGL" | "Hybrid";
    performanceConsciousness: "Adaptive" | "Static" | "DeviceAware";
    userConsciousness: "Immediate" | "Progressive" | "Configurable";
  };
}
```

### Automated Tentacle Generation Rules

Based on analysis, the system automatically generates appropriate tentacle structures:

```markdown
# Intelligent Tentacle Generation for Year 3000 System

## Generation Rules

### Rule 1: Consciousness-First Architecture

- **High Consciousness Projects**: Generate comprehensive consciousness tentacles
- **Medium Consciousness Projects**: Generate focused consciousness enhancements
- **Low Consciousness Projects**: Generate consciousness foundation tentacles

### Rule 2: Performance-Aware Generation

- **High Performance Requirements**: Generate performance-optimized tentacles
- **Medium Performance Requirements**: Generate balanced tentacles
- **Low Performance Requirements**: Generate feature-rich tentacles

### Rule 3: Integration-Aware Generation

- **Complex Integration**: Generate modular, well-documented tentacles
- **Simple Integration**: Generate streamlined, efficient tentacles
- **Legacy Integration**: Generate compatibility-focused tentacles

### Rule 4: Spicetify-Specific Optimization

- **Theme Projects**: Generate visual consciousness tentacles
- **Extension Projects**: Generate service consciousness tentacles
- **Hybrid Projects**: Generate unified consciousness tentacles
```

## Future Development Guidelines

### **Recommended Approach for New Animation Systems**

When implementing new glyph or interaction animation systems, follow these performance-optimized patterns:

#### **✅ Preferred Patterns:**

1. **CSS-First Animations**: Use CSS keyframes with `will-change` hints and `contain` properties
2. **Batched Updates**: Leverage the existing `CSSVariableBatcher` for variable changes
3. **Intersection Observer**: Use for viewport-based optimizations instead of continuous polling
4. **Event-Driven**: Respond to user interactions rather than continuous loops
5. **Configurable Intensity**: Allow users to adjust animation intensity or disable entirely
6. **Tentacle Coordination**: Create tentacle folder for major animation system development

#### **✅ Performance-Optimized Architecture:**

```typescript
// Example: Lightweight animation system with tentacle coordination
class OptimizedAnimationSystem implements IManagedSystem {
  private observer: IntersectionObserver;
  private batcher: CSSVariableBatcher;

  initialize() {
    // Register with tentacle system
    this.registerTentacle("animation-system", "Animation Implementation");

    // Setup intersection observer for viewport detection
    this.observer = new IntersectionObserver(this.handleVisibilityChange);
    // Use existing CSS variable batcher
    this.batcher = this.year3000System.cssVariableBatcher;
  }

  // Event-driven updates instead of continuous loops
  onUserInteraction(event: InteractionEvent) {
    this.batcher.queueCSSVariableUpdate(
      "--animation-intensity",
      event.intensity
    );
  }
}
```

#### **❌ Avoid These Patterns:**

- Continuous `requestAnimationFrame` loops for non-visual calculations
- Canvas-based physics unless absolutely necessary
- High-frequency DOM manipulation (>60fps)
- Unbounded element pools or caches
- Complex pseudo-element animations with multiple layers
- **Working without tentacle coordination** for major features

#### **🔄 Migration Path for Removed Systems:**

If you need to implement glyph or ripple-like functionality:

1. **Create Tentacle**: Set up proper tentacle folder for the work
2. **Start with CSS**: Use CSS transforms and opacity changes
3. **Use Existing Infrastructure**: Leverage `BeatSyncVisualSystem` for music sync
4. **Batch Updates**: Use `CSSVariableBatcher` for performance
5. **Progressive Enhancement**: Build fallbacks for reduced-motion preferences
6. **Monitor Performance**: Use `PerformanceAnalyzer` to track impact
7. **Coordinate**: Use tentacle communication for cross-system integration

This approach maintains the visual richness while ensuring optimal performance across all device types and proper multi-agent coordination.
