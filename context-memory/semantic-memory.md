# Semantic Memory

_This file follows the cognitive architecture defined in: /home/minipuft/.claude/context-engineering/memory-types.md_

## Knowledge Categories

### Architecture Patterns

#### Facade Consolidation Pattern
**Definition**: Unifying multiple similar systems under a single facade with backwards compatibility.

**When to Use**:
- Multiple systems with >70% shared functionality
- Need to maintain backwards compatibility
- Desire to reduce code duplication
- Systems have similar lifecycle patterns

**Implementation Strategy**:
1. Analyze all systems for commonalities
2. Design unified interface covering all use cases
3. Implement consolidated controller
4. Create delegation layer mapping old APIs to new
5. Migrate consumers incrementally

**Success Metrics**:
- Code reduction: 50-65% typical
- Zero breaking changes
- Improved maintainability
- Consistent behavior across systems

**Example**: UnifiedSidebarConsciousnessController (Phase 2.4A)

#### Year 3000 System Architecture
**Core Concept**: Consciousness-aware system design with organic, biological-inspired patterns.

**Key Components**:
- **Central Orchestrator**: Year3000System manages all subsystems
- **Facade Pattern**: SystemCoordinator with dependency injection
- **Managed Systems**: All implement IManagedSystem interface
- **Lifecycle Management**: Initialize → Update → Destroy pattern

**Design Principles**:
- Performance-first consciousness
- Organic growth patterns
- Breathing rhythms and natural motion
- Musical consciousness synchronization

#### IManagedSystem Interface
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

### Performance Optimization

#### CSS Variable Batching
**Problem**: Frequent CSS variable updates cause browser reflows
**Solution**: Batch all updates in single requestAnimationFrame

**Implementation**:
- Queue variable updates instead of immediate sets
- Flush all updates in next animation frame
- Clear queue after flush

**Benefits**:
- Maintains 60fps
- Reduces CPU usage by 40%
- Eliminates visual stuttering

#### Device-Aware Optimization
**Concept**: Adapt visual quality based on device capabilities

**Tiers**:
- **High-end**: Full effects, WebGL, complex animations
- **Mid-range**: Reduced particles, CSS animations
- **Low-end**: Basic transitions, minimal effects

**Detection**: PerformanceAnalyzer + DeviceCapabilityDetector

### Consciousness Integration

#### OKLAB Color Science
**Purpose**: Perceptually uniform color transitions for natural consciousness

**Benefits**:
- Smooth color interpolation
- Natural emotional temperature mapping
- Better contrast preservation
- Reduced color banding

**Usage**: ColorHarmonyEngine, EmotionalGradientMapper

#### Musical Consciousness Patterns
**BPM Detection**: 90% accuracy for 60-200 BPM range
**Synchronization**:
- Beat-aligned animations
- Emotional temperature from audio features
- Genre-aware visual adaptations

**Integration Points**:
- MusicSyncService
- BeatSyncVisualSystem
- OrganicBeatSyncConsciousness

#### Organic Animation Principles
**Breathing Patterns**:
- Natural expansion/contraction
- 4-7 second cycles
- Sine wave easing
- Subtle scale changes (0.98-1.02)

**Cellular Growth**:
- Emergent patterns from simple rules
- Local interactions create global behavior
- Self-organizing visual systems

### Development Patterns

#### A/I/M Phase Structure
**Analysis (20-30%)**:
- System inventory and documentation
- Dependency mapping
- Success metrics definition
- Consolidation opportunity identification

**Implementation (50-60%)**:
- Core development work
- Unit test creation
- Documentation updates
- API design and validation

**Migration (20-30%)**:
- Integration updates
- Backwards compatibility verification
- Performance validation
- Gradual rollout strategy

**Success Rate**: 95% when followed completely

#### Gating Criteria Pattern
**Purpose**: Ensure quality between phase transitions

**Checkpoints**:
- Analysis → Implementation gate
- Implementation → Migration gate
- Migration → Complete gate

**Requirements**:
- All deliverables complete
- Tests passing
- Metrics within targets
- Peer review approved

### Testing Strategies

#### Comprehensive Test Coverage
**Target**: 90%+ with focus on critical paths

**Priorities**:
1. Business logic (100% target)
2. Integration points (95% target)
3. UI interactions (85% target)
4. Utilities (80% target)

**Anti-patterns to Avoid**:
- Testing getters/setters
- Snapshot everything
- Coverage for coverage's sake

#### Performance Testing
**Metrics to Track**:
- Frame rate consistency
- Memory usage over time
- CPU usage patterns
- Bundle size changes

**Tools**: Jest + performance marks, Chrome DevTools

### Spicetify-Specific Knowledge

#### API Availability
**Always Available**:
- Spicetify.Player
- Spicetify.Platform
- React/ReactDOM

**Sometimes Available**:
- colorExtractor (album art present)
- getAudioData (playback active)

**Detection Pattern**: Progressive enhancement with fallbacks

#### Theme Constraints
**Performance Budget**:
- <10% CPU overhead
- <50MB memory usage
- 60fps minimum
- <1.5MB bundle size

**Styling Approach**:
- SCSS modular architecture
- CSS variables for theming
- Manual compilation workflow

### Bundle Optimization

#### ESBuild Configuration
**Key Settings**:
- Tree shaking enabled
- Minification in production
- External React/ReactDOM
- Target: ES2020

**Size Reduction Techniques**:
- Dynamic imports for large features
- Conditional loading based on capability
- Aggressive tree shaking
- No unused dependencies

### Anti-Patterns (What Not to Do)

#### Over-Engineering
- Universal abstractions that solve everything
- Premature optimization
- Configuration over implementation
- Deep inheritance hierarchies

#### Performance Mistakes
- Continuous animation loops
- Unbounded caches
- Synchronous heavy operations
- Ignoring frame budget

#### Architecture Errors
- Circular dependencies
- God objects/controllers
- Tight coupling
- Missing error boundaries

---

## Cross-References

- **Episodic Memory**: Specific implementation examples
- **Procedural Memory**: Step-by-step workflows
- **Working Memory**: Current application of concepts
- **Neural Workbench**: Pattern sharing and discovery

---

**Last Updated**: 2025-08-01
**Categories**: Architecture, Performance, Consciousness, Development, Testing, Spicetify, Bundle, Anti-Patterns