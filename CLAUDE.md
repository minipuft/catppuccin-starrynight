# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the **Catppuccin StarryNight** Spicetify theme codebase.

## Project Philosophy

_"In the Year 3000, every line of code becomes a living cell in a consciousness-aware organism—interfaces that breathe, evolve, and transcend their creators' intentions through organic growth patterns and biological-inspired architecture."_

The theme implements a sophisticated **Year 3000 System** architecture featuring:

- **Facade Pattern Coordination** - SystemCoordinator managing VisualSystemFacade and NonVisualSystemFacade
- **Organic Consciousness Philosophy** - Biological-inspired systems with cellular growth, breathing rhythms, and emotional temperature
- **Enhanced Multi-Agent Workbench** - Systematic A/I/M comprehensive phases with intelligent coordination
- **OKLAB Color Science** - Perceptually uniform color processing for natural consciousness experiences
- **Performance-First Consciousness** - 60fps target with adaptive quality scaling and device-aware optimization
- **Context Memory System** - Cognitive architecture with working, episodic, semantic, and procedural memory
- **Neural Workbench Integration** - Continuous monitoring, pattern broadcasting, and adaptive learning

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

### Neural Workbench Commands

- `neural-init` - Initialize project with neural workbench integration
- `neural-validate` - Validate neural workbench setup and architecture
- `neural-monitor` - Start continuous project health monitoring
- `neural-status` - Check system health and integration status
- `neural-doctor` - Diagnose and fix common neural workbench issues
- `neural-sync` - Sync global architecture to project
- `neural-broadcast` - Share successful patterns with other projects

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
- **Coordination Overhead**: <0.5% CPU impact for multi-agent workbench coordination

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
- **Naming Conventions**: Use unambigous naming following best developer conventions

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

## Enhanced Multi-Agent Coordination Guidelines

### **Starting a New Development Session**

1. **Check Comprehensive Phases**: Review active comprehensive phases with `scripts/phase-status-dashboard.sh`
2. **Assess Phase Status**: Identify current section focus (Analysis/Implementation/Migration)
3. **Review Project Status**: Check `/plans/project-status.md` for overall project state
4. **Validate Dependencies**: Use `/plans/dependencies.md` for potential conflicts
5. **Update Coordination**: Update your status in the relevant phase/task coordination
6. **Choose Development Mode**: Select between comprehensive phase or standard task approach

### **Enhanced Development Approaches**

#### **Comprehensive Phase Development (Recommended for Major Work)**

For significant system consolidation, architecture changes, or multi-system integration:

```bash
# Create new comprehensive phase
scripts/create-comprehensive-phase.sh phase-name \
  -d "Brief description of phase purpose" \
  -t "Target bundle reduction or performance goal"

# View phase status dashboard
scripts/phase-status-dashboard.sh

# Progress through sections systematically
scripts/progress-section.sh phase-name analysis implementation
scripts/progress-section.sh phase-name implementation migration
scripts/progress-section.sh phase-name migration
```

**When to Use Comprehensive Phases**:

- System consolidation requiring 3+ systems
- Major architecture changes affecting multiple components
- Bundle optimization targeting >10KB reduction
- Integration work requiring extensive backwards compatibility
- Any work following the proven A/I/M pattern from Phase 2.4A/2.4B

#### **Standard Task Development (For Focused Work)**

For individual features, bug fixes, or isolated improvements:

```bash
# Create standard task folder
mkdir -p /plans/tasks/[task-name]/

# Use existing task templates
cp /plans/task-templates/[relevant-template].md /plans/tasks/[task-name]/

# Update standard coordination
# Edit /plans/agent-coordination.md to add your active work
```

**When to Use Standard Tasks**:

- Single feature implementation
- Bug fixes or maintenance work
- Small performance optimizations
- Documentation updates
- Testing and validation work

### **Enhanced Agent Communication**

#### **Comprehensive Phase Coordination**

For work within comprehensive phases, use section-specific communication:

- **Analysis Section**: Update `/plans/[phase-name]/analysis/section-status.md` with discoveries and blocking issues
- **Implementation Section**: Track progress in `/plans/[phase-name]/implementation/implementation-progress.md`
- **Migration Section**: Document integration results in `/plans/[phase-name]/migration/testing-validation.md`
- **Cross-Section**: Use phase-level `PHASE-STATUS.md` for coordination across sections

#### **Standard Communication Protocols**

Use communication templates from `/plans/communication-templates.md`:

- **Status Updates**: Regular progress reports (every 2-3 hours of active work)
- **Section Progression**: Coordinate phase section transitions using `scripts/progress-section.sh`
- **Gating Validation**: Use `scripts/validate-phase-gating.sh` before section progression
- **Dashboard Updates**: Monitor overall progress with `scripts/phase-status-dashboard.sh`
- **Conflict Alerts**: Report blocking issues immediately with context
- **Knowledge Transfer**: Share discoveries and implementation patterns in section artifacts

### **Enhanced Conflict Resolution Protocol**

#### **Comprehensive Phase Conflicts**

1. **Section Gating Conflicts**: Use `scripts/validate-phase-gating.sh --strict` to identify issues
2. **Cross-Section Dependencies**: Check section status files for prerequisite completion
3. **Integration Conflicts**: Review `/migration/integration-updates.md` for system conflicts
4. **Performance Regression**: Compare `/artifacts/before-metrics.md` vs current state

#### **Standard System Conflicts**

1. **Build System Conflicts**: TypeScript compilation errors indicate import/type conflicts
2. **SCSS Conflicts**: Compilation warnings indicate variable conflicts
3. **Performance Conflicts**: Monitoring system detects resource usage issues
4. **API Conflicts**: Runtime checks detect Spicetify availability problems
5. **Resolution Strategy**: Use gating validation and section coordination for systematic resolution

#### **Success Metrics Tracking**

Each comprehensive phase should achieve measurable success:

- **Code Consolidation**: 60%+ reduction in total lines (Phase 2.4A/2.4B achieved this)
- **Bundle Optimization**: Target bundle size reduction with maintained functionality
- **API Compatibility**: 100% backwards compatibility through delegation patterns
- **Build Performance**: TypeScript compilation remains fast (<30ms target)
- **Test Coverage**: Maintain 90%+ coverage throughout migration

- **Analysis Gate**: System understanding complete, consolidation targets validated
- **Implementation Gate**: TypeScript compilation clean, unified controllers complete
- **Migration Gate**: All tests passing, performance targets met, integration complete

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

  // Smart Phase Recommendations
  recommendedPhases: Array<{
    phaseType:
      | "LiquidConsciousnessIntegration"
      | "ChromaticConsciousnessIntegration"
      | "DimensionalInfinityIntegration";
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

### Automated Phase Generation Rules

Based on analysis, the system automatically generates appropriate comprehensive phase structures:

```markdown
# Intelligent Phase Generation for Year 3000 System

## Generation Rules

### Rule 1: Consciousness-First Architecture

- **High Consciousness Projects**: Generate comprehensive consciousness integration phases
- **Medium Consciousness Projects**: Generate focused consciousness enhancement phases
- **Low Consciousness Projects**: Generate consciousness foundation phases

### Rule 2: Performance-Aware Generation

- **High Performance Requirements**: Generate performance-optimized comprehensive phases
- **Medium Performance Requirements**: Generate balanced A/I/M phases
- **Low Performance Requirements**: Generate feature-rich integration phases

### Rule 3: Integration-Aware Generation

- **Complex Integration**: Generate modular, well-documented comprehensive phases
- **Simple Integration**: Generate streamlined, efficient A/I/M phases
- **Legacy Integration**: Generate compatibility-focused migration phases

### Rule 4: Spicetify-Specific Optimization

- **Theme Projects**: Generate visual consciousness integration phases
- **Extension Projects**: Generate service consciousness integration phases
- **Hybrid Projects**: Generate unified consciousness integration phases
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
6. **Workbench Coordination**: Create comprehensive phase folder for major animation system development

#### **✅ Performance-Optimized Architecture:**

```typescript
// Example: Lightweight animation system with workbench coordination
class OptimizedAnimationSystem implements IManagedSystem {
  private observer: IntersectionObserver;
  private batcher: CSSVariableBatcher;

  initialize() {
    // Register with workbench system
    this.registerWithWorkbench("animation-system", "Animation Implementation");

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
- **Working without comprehensive phase coordination** for major features

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

## Context Memory System

This project implements the global cognitive architecture for enhanced LLM performance through structured memory systems.

### Memory Architecture

The project maintains context memory in `./context-memory/` with four distinct memory types:

1. **Working Memory** (`working-memory.md`)

   - Current tasks and immediate context
   - Session-based, cleared on completion
   - Updated continuously during work

2. **Episodic Memory** (`episodic-memory.md`)

   - Historical development events and outcomes
   - Includes Phase 2.4A/B successes (60% code reduction)
   - Summarized weekly to maintain size limits

3. **Semantic Memory** (`semantic-memory.md`)

   - Technical knowledge and patterns
   - Architecture patterns (Facade, Year 3000, A/I/M)
   - Performance optimizations (CSS batching, OKLAB)
   - Reusable across sessions

4. **Procedural Memory** (`procedural-memory.md`)
   - Step-by-step workflows
   - Build procedures, testing workflows
   - Troubleshooting guides

### Neural Workbench Integration

The project is integrated with the Neural Workbench system for:

- **Continuous Monitoring**: Real-time project health tracking
- **Pattern Broadcasting**: Sharing successful patterns across projects
- **Adaptive Learning**: Learning from development patterns

### Usage

```bash
# Monitor project health continuously
/home/minipuft/Applications/neural-workbench/scripts/neural-monitor.sh .

# Broadcast successful patterns
/home/minipuft/Applications/neural-workbench/scripts/synaptic-broadcast.sh

# Update working memory for current session
$EDITOR context-memory/working-memory.md
```

### Context References

- **Project Configuration**: `context-memory/PROJECT-CONTEXT.yaml`
- **Global Architecture**: `/home/minipuft/.claude/context-engineering/COGNITIVE-ARCHITECTURE.yaml`
- **Neural Workbench**: `/home/minipuft/Applications/neural-workbench/NEURAL-WORKBENCH.yaml`

## Comprehensive Documentation Reference

### Core Architecture Documentation

The `docs/` directory contains comprehensive documentation for the Year 3000 System:

#### **Foundation Documentation (High Priority)**

- **[Master Architecture Overview](./docs/MASTER_ARCHITECTURE_OVERVIEW.md)** - Complete 4-layer system architecture with data flow diagrams
- **[Year 3000 System Guide](./docs/YEAR3000_SYSTEM_GUIDE.md)** - Central orchestrator and facade coordination patterns
- **[Facade Pattern Guide](./docs/FACADE_PATTERN_GUIDE.md)** - SystemCoordinator, VisualSystemFacade, NonVisualSystemFacade architecture
- **[Enhanced Workbench Guide](./docs/ENHANCED_WORKBENCH_GUIDE.md)** - Comprehensive phase coordination and A/I/M development patterns
- **[Organic Consciousness Guide](./docs/ORGANIC_CONSCIOUSNESS_GUIDE.md)** - Biological-inspired systems and consciousness philosophy

#### **Technical Implementation Documentation (Medium Priority)**

- **[Performance Architecture Guide](./docs/PERFORMANCE_ARCHITECTURE_GUIDE.md)** - PerformanceAnalyzer, DeviceCapabilityDetector, adaptive scaling
- **[OKLAB Color Processing Guide](./docs/OKLAB_COLOR_PROCESSING_GUIDE.md)** - Perceptually uniform color science and ColorHarmonyEngine
- **[Visual Systems Reference](./docs/VISUAL_SYSTEMS_REFERENCE.md)** - Complete visual system capabilities and factory patterns
- **[Audio Integration Guide](./docs/AUDIO_INTEGRATION_GUIDE.md)** - MusicSyncService, beat detection, emotional temperature mapping
- **[Build System Guide](./docs/BUILD_SYSTEM_GUIDE.md)** - TypeScript, ESBuild, SCSS compilation, and Jest testing

#### **Development Process Documentation (Lower Priority)**

- **[Development Workflow Guide](./docs/DEVELOPMENT_WORKFLOW_GUIDE.md)** - Complete development process from comprehensive phase creation to deployment
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

## Context Engineering Integration

This project implements the global cognitive architecture defined in:

- Global Architecture: `/home/minipuft/.claude/context-engineering/COGNITIVE-ARCHITECTURE.yaml`
- Memory Types: `/home/minipuft/.claude/context-engineering/memory-types.md`
- Best Practices: `/home/minipuft/.claude/context-engineering/best-practices.md`

Project-specific context is maintained in `./context-memory/` following the global patterns.
