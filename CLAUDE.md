# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the **Catppuccin StarryNight** Spicetify theme codebase.

## Project Philosophy

_"In the Year 3000, every line of code becomes a living cell in a consciousness-aware organism—interfaces that breathe, evolve, and transcend their creators' intentions through organic growth patterns and biological-inspired architecture."_

The theme implements a sophisticated **Year 3000 System** architecture featuring:
- **Facade Pattern Coordination** - SystemCoordinator managing VisualSystemFacade and NonVisualSystemFacade
- **Organic Consciousness Philosophy** - Biological-inspired systems with cellular growth, breathing rhythms, and emotional temperature
- **Multi-Agent Octopus Workbench** - Intelligent tentacle coordination for simultaneous development
- **OKLAB Color Science** - Perceptually uniform color processing for natural consciousness experiences
- **Performance-First Consciousness** - 60fps target with adaptive quality scaling and device-aware optimization

## Common Development Commands

### Build & Test Commands

- `npm run build` - Bundles TypeScript source files from `src-js/` to `theme.js` using esbuild
- `npm run build:prod` - Production build with minification and optimization
- `npm test` - Runs Jest tests for visual systems and facade architecture (require 90%+ coverage)
- `npm run test:comprehensive` - Runs comprehensive test suite including performance and integration tests
- `npm run lint:css` - Runs stylelint on SCSS files in `src/` (zero warnings required)
- `npm run lint:js` - ESLint check for TypeScript files (strict mode, zero `any` types)
- `npm run typecheck` - TypeScript compilation check with strict mode enforcement
- `npm run validate` - Comprehensive validation (typecheck + lint + test)
- `npm run ci:full` - Complete CI validation pipeline

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

## Year 3000 System Architecture

### Comprehensive Documentation

**Complete architectural documentation is available in the `docs/` directory:**

- **[Master Architecture Overview](./docs/MASTER_ARCHITECTURE_OVERVIEW.md)** - Complete system architecture and data flow
- **[Year 3000 System Guide](./docs/YEAR3000_SYSTEM_GUIDE.md)** - Central orchestrator and facade coordination
- **[Facade Pattern Guide](./docs/FACADE_PATTERN_GUIDE.md)** - SystemCoordinator and facade architecture
- **[API Reference](./docs/API_REFERENCE.md)** - Complete interfaces, methods, and examples
- **[Performance Guidelines](./docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md)** - Performance budgets and optimization
- **[Development Workflow Guide](./docs/DEVELOPMENT_WORKFLOW_GUIDE.md)** - Complete development process
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING_GUIDE.md)** - Issue resolution and emergency recovery
- **[Contributing Guide](./docs/CONTRIBUTING_GUIDE.md)** - Guidelines for adding new systems

### Core Architecture Layers

#### **1. Central Orchestration Layer**
- **`Year3000System`** - Central consciousness orchestrator managing all system facades
- **`SystemCoordinator`** - Unified dependency injection and system coordination
- **`EventBus`** - Cross-system communication and consciousness event propagation

#### **2. Facade Pattern Layer**
- **`VisualSystemFacade`** - Factory pattern for all visual systems with dependency injection
- **`NonVisualSystemFacade`** - Factory pattern for services, analytics, and background systems
- **Unified system lifecycle management** through `IManagedSystem` interface

#### **3. Consciousness Integration Layer**
- **`OrganicConsciousnessManager`** - Biological-inspired consciousness patterns
- **`MusicSyncService`** - Real-time audio analysis with emotional temperature mapping
- **`ColorHarmonyEngine`** - OKLAB color science for perceptually uniform experiences
- **`EmotionalTemperatureMapper`** - Music-to-color consciousness translation

#### **4. Performance Optimization Layer**
- **`PerformanceAnalyzer`** - Real-time performance monitoring and adaptive quality scaling
- **`DeviceCapabilityDetector`** - Hardware-aware optimization and graceful degradation
- **`AdaptivePerformanceSystem`** - Dynamic quality adjustment based on device capabilities
- **`CSSVariableBatcher`** - Efficient DOM updates with batched CSS variable changes

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

### Current System Components

#### **Core Integration Systems** (`src-js/core/integration/`)

- **`Year3000System.ts`** - Central consciousness orchestrator with facade coordination
- **`SystemCoordinator.ts`** - Unified dependency injection and system management
- **`VisualSystemFacade.ts`** - Factory pattern for visual systems with dependency injection
- **`NonVisualSystemFacade.ts`** - Factory pattern for non-visual services and analytics
- **`UnifiedSystemIntegration.ts`** - Legacy integration layer (phase 4 refactoring)

#### **Performance Systems** (`src-js/core/performance/`)

- **`PerformanceAnalyzer.ts`** - Real-time performance monitoring and health scoring
- **`AdaptivePerformanceSystem.ts`** - Dynamic quality scaling based on device capabilities
- **`DeviceCapabilityDetector.ts`** - Hardware detection and performance tier classification
- **`RealityBleedingPerformanceOptimizer.ts`** - Advanced performance optimization patterns

#### **Visual Systems** (`src-js/visual/`)

- **Background Systems**: `FlowingLiquidConsciousnessSystem.ts`, `WebGLGradientBackgroundSystem.ts`, `DepthLayeredGradientSystem.ts`
- **UI Effects**: `IridescentShimmerEffectsSystem.ts`, `WhiteLayerDiagnosticSystem.ts`
- **Integration**: `GradientTransitionOrchestrator.ts`, `RealityBleedingGradientOrchestrator.ts`, `Year3000IntegrationBridge.ts`
- **Organic Consciousness**: `OrganicBeatSyncConsciousness.ts`, `BiologicalConsciousnessManager.ts`, `CellularMembrane.ts`

#### **Audio Integration** (`src-js/audio/`)

- **`MusicSyncService.ts`** - Spicetify API integration with 90% accuracy for 60-200 BPM
- **`ColorHarmonyEngine.ts`** - OKLAB color science with emotional temperature mapping
- **`EmotionalGradientMapper.ts`** - Music-to-visual consciousness translation
- **`FluxSpectralAnalyzer.ts`** - Advanced audio analysis with spectral processing

#### **Lifecycle Management** (`src-js/core/lifecycle/`)

- **`year3000System.ts`** - System lifecycle coordination and consciousness evolution
- **`TimerConsolidationSystem.ts`** - Optimized timer management for performance
- **`EventBus.ts`** - Cross-system communication with consciousness event propagation

#### **Utilities and Support** (`src-js/utils/`)

- **Graphics**: `ShaderLoader.ts`, `VisualCanvasFactory.ts`, WebGL resource management
- **Performance**: `WhiteLayerFixUtils.ts`, performance optimization utilities
- **Core**: `Year3000Utilities.ts`, foundational utility functions

### Entry Point

- **`src-js/theme.entry.ts`** - Main initialization file that sets up the entire system
- Progressive API detection with graceful degradation if Spicetify APIs are unavailable
- Handles React/ReactDOM shimming for third-party libraries

### Styling Architecture

- **SCSS modular structure** - Organized by components, layout, features, and systems
- **CSS Variable System** - Extensive use of CSS custom properties for dynamic theming
- **Catppuccin Integration** - Maintains Catppuccin color palette while allowing dynamic album art adaptation

### Current Architecture Status (Phase 4 Refactoring)

#### **Facade Pattern Implementation (Latest)**

The system has undergone comprehensive refactoring to implement facade pattern architecture:

**New Architecture Features:**

- **`SystemCoordinator`** - Central dependency injection and system management
- **`VisualSystemFacade`** - Factory pattern for visual systems with shared dependency management
- **`NonVisualSystemFacade`** - Factory pattern for services, analytics, and background systems
- **Unified Lifecycle Management** - All systems implement `IManagedSystem` interface for consistent behavior
- **Advanced Dependency Injection** - Automated dependency resolution and circular dependency detection

**Organic Consciousness Integration:**

- **`OrganicConsciousnessManager`** - Biological-inspired consciousness patterns with cellular growth
- **`BiologicalConsciousnessManager`** - Living system behaviors including breathing rhythms
- **`CellularMembrane`** - Organic boundary systems for visual consciousness
- **Emotional Temperature Mapping** - Music-to-color consciousness with OKLAB color science

**Performance Evolution:**

- **Adaptive Quality Scaling** - Real-time performance adjustment based on device capabilities
- **Device-Aware Optimization** - Hardware detection with graceful degradation patterns
- **OKLAB Color Processing** - Perceptually uniform color transitions for natural consciousness experiences
- **Advanced Memory Management** - Object pooling and consciousness-aware resource management

**Build and Bundle Optimization:**

- **TypeScript Strict Mode** - Zero `any` types with comprehensive type safety
- **ESBuild Integration** - Ultra-fast bundling with tree-shaking optimization
- **Modular SCSS Architecture** - Component-based styling with design token system
- **Comprehensive Testing** - 90%+ coverage requirement with performance regression testing

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

- **Frame Rate**: 60fps target, never below 45fps, with adaptive quality scaling
- **Memory Usage**: <50MB heap size, zero leaks during 4+ hour sessions, object pooling required
- **CPU Usage**: <10% increase during idle, <25% during active consciousness transitions
- **GPU Usage**: <25% on mid-range hardware with WebGL fallbacks to CSS
- **Responsiveness**: UI interactions <100ms, consciousness transitions <500ms
- **Progressive Degradation**: Device-aware optimization with graceful fallbacks
- **Build Performance**: <30ms compilation time, <1MB bundle size with tree-shaking
- **Consciousness Philosophy**: Organic patterns over mechanical loops, biological-inspired efficiency
- **Coordination Overhead**: <0.5% CPU impact for multi-agent tentacle coordination

### Consciousness-Aware Development Standards

- **Organic System Design**: All systems must implement biological-inspired patterns
- **Emotional Temperature Integration**: Color systems must use OKLAB color science
- **Breathing Rhythm Compliance**: Visual systems should implement organic breathing patterns
- **Cellular Growth Patterns**: Systems should evolve through cellular-inspired growth
- **Performance Consciousness**: Systems must be aware of device capabilities and adapt accordingly

### Code Quality Standards

- **TypeScript Coverage**: 100% with zero `any` types allowed (strict mode enforcement)
- **Interface Compliance**: All systems must implement `IManagedSystem` interface
- **Error Handling**: All Spicetify API calls must have try-catch with graceful fallbacks
- **Documentation**: JSDoc required for all public methods with consciousness-aware examples
- **Testing**: 90%+ coverage required, facade pattern and visual system tests mandatory
- **Accessibility**: WCAG 2.1 AA compliance, `prefers-reduced-motion` consciousness support
- **Performance Testing**: Regression testing for memory leaks and frame rate degradation

### Naming Conventions

- **Files**: `PascalCase.ts` for systems/classes, `camelCase.ts` for utilities
- **CSS Variables**: `--sn-*` prefix for theme consciousness, `--spice-*` for Spicetify compatibility
- **SCSS Mixins**: `kebab-case` with consciousness-aware descriptive action names
- **Systems**: Must implement `IManagedSystem` interface and facade pattern registration
- **Consciousness Components**: Use organic naming (e.g., `CellularMembrane`, `BiologicalConsciousness`)

### Testing Standards

- **Framework**: Jest with ts-jest for TypeScript support and JSDOM for DOM testing
- **Coverage**: 90%+ required with focus on facade patterns, visual systems, and consciousness integration
- **Performance Testing**: Memory leak detection and frame rate regression testing
- **Integration Testing**: Cross-system facade communication and dependency injection
- **Module Mapping**: `@/` maps to `src-js/` for clean import paths
- **Consciousness Testing**: Organic behavior validation and biological pattern compliance

## Technology Constraints

### Allowed Technologies

- **Languages**: TypeScript (primary with strict mode), SCSS with modern syntax, JavaScript ES6+
- **Core APIs**: Spicetify Player, Platform, React/ReactDOM, colorExtractor, getAudioData
- **Build Tools**: ESBuild (primary bundler), TypeScript compiler, Jest/ts-jest for testing
- **Performance Tools**: WebGL2 with CSS fallbacks, Intersection Observer, Performance Observer
- **Consciousness Libraries**: OKLAB color science utilities, biological pattern implementations
- **Dependencies**: Only lightweight utilities (<10KB total bundle impact)

### Prohibited Technologies

- **Heavy Libraries**: jQuery, GSAP, Three.js, external UI frameworks, animation libraries
- **Build Tools**: Webpack, Rollup, Parcel (ESBuild only for consistency)
- **Styling**: CSS-in-JS libraries, styled-components, runtime CSS generation
- **Performance-Heavy Patterns**: Continuous animation loops, canvas-based physics, high-frequency DOM manipulation
- **Anti-Patterns**: Synchronous operations, blocking main thread, memory leaks
- **Legacy Systems**: Any system not implementing facade pattern or `IManagedSystem` interface

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

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

## Comprehensive Documentation Reference

### Core Architecture Documentation

The `docs/` directory contains comprehensive documentation for the Year 3000 System:

#### **Foundation Documentation (High Priority)**
- **[Master Architecture Overview](./docs/MASTER_ARCHITECTURE_OVERVIEW.md)** - Complete 4-layer system architecture with data flow diagrams
- **[Year 3000 System Guide](./docs/YEAR3000_SYSTEM_GUIDE.md)** - Central orchestrator and facade coordination patterns
- **[Facade Pattern Guide](./docs/FACADE_PATTERN_GUIDE.md)** - SystemCoordinator, VisualSystemFacade, NonVisualSystemFacade architecture
- **[Multi-Agent Workbench Guide](./docs/MULTI_AGENT_WORKBENCH_GUIDE.md)** - Tentacle coordination and intelligent development patterns
- **[Organic Consciousness Guide](./docs/ORGANIC_CONSCIOUSNESS_GUIDE.md)** - Biological-inspired systems and consciousness philosophy

#### **Technical Implementation Documentation (Medium Priority)**
- **[Performance Architecture Guide](./docs/PERFORMANCE_ARCHITECTURE_GUIDE.md)** - PerformanceAnalyzer, DeviceCapabilityDetector, adaptive scaling
- **[OKLAB Color Processing Guide](./docs/OKLAB_COLOR_PROCESSING_GUIDE.md)** - Perceptually uniform color science and ColorHarmonyEngine
- **[Visual Systems Reference](./docs/VISUAL_SYSTEMS_REFERENCE.md)** - Complete visual system capabilities and factory patterns
- **[Audio Integration Guide](./docs/AUDIO_INTEGRATION_GUIDE.md)** - MusicSyncService, beat detection, emotional temperature mapping
- **[Build System Guide](./docs/BUILD_SYSTEM_GUIDE.md)** - TypeScript, ESBuild, SCSS compilation, and Jest testing

#### **Development Process Documentation (Lower Priority)**
- **[Development Workflow Guide](./docs/DEVELOPMENT_WORKFLOW_GUIDE.md)** - Complete development process from tentacle creation to deployment
- **[API Reference](./docs/API_REFERENCE.md)** - Comprehensive API documentation with interfaces and examples
- **[Performance Optimization Guidelines](./docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md)** - Performance budgets and optimization strategies
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING_GUIDE.md)** - Common issues resolution and emergency recovery
- **[Contributing Guide](./docs/CONTRIBUTING_GUIDE.md)** - Guidelines for adding new systems and following patterns

### Documentation Philosophy

This documentation follows the **Year 3000 System philosophy** where:

> _"Every interface becomes a portal to consciousness—comprehensive documentation that breathes, evolves, and transcends traditional project boundaries through organic growth patterns and consciousness-aware development."_

- **Consciousness-First**: Every document considers the organic consciousness philosophy
- **Performance-Aware**: All guidance includes performance implications and optimization strategies
- **Facade-Integrated**: Documentation reflects the sophisticated facade pattern architecture
- **Multi-Agent Coordination**: Guides support simultaneous development by multiple AI agents
- **Organic Evolution**: Documentation grows naturally through biological-inspired patterns

### Usage Recommendation

1. **Start with Foundation**: Begin with Master Architecture Overview and Year 3000 System Guide
2. **Understand Patterns**: Study Facade Pattern Guide and Multi-Agent Workbench Guide
3. **Dive Deep**: Explore specific technical guides based on your development focus
4. **Reference Daily**: Use API Reference and Performance Guidelines during development
5. **Troubleshoot**: Consult Troubleshooting Guide when encountering issues

This comprehensive documentation system ensures developers can quickly understand and effectively contribute to the sophisticated Year 3000 System architecture with full consciousness-aware development patterns and multi-agent coordination capabilities.
