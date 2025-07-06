# PROJECT RULES - Catppuccin StarryNight Development Guide

This document serves as the definitive reference for all development work on the Catppuccin StarryNight Spicetify theme project. Any AI assistant working on this project must adhere to these rules and patterns.

## Table of Contents

1. [Project Overview & Philosophy](#project-overview--philosophy)
2. [Architecture Framework](#architecture-framework)
3. [Technology Constraints](#technology-constraints)
4. [Development Standards](#development-standards)
5. [Performance Requirements](#performance-requirements)
6. [Quality Gates](#quality-gates)
7. [File Organization](#file-organization)
8. [Coding Standards](#coding-standards)
9. [User Experience Guidelines](#user-experience-guidelines)
10. [Feature Development](#feature-development)

---

## Project Overview & Philosophy

### "Year 3000" System Philosophy
The theme is built around the **"Emergent Systems Choreographer"** approach - a sophisticated internal framework where every component works in harmony to create a unified, performant, and aesthetically coherent experience.

**Core Principles:**
- **Modular Architecture**: Each system is independently testable and replaceable
- **Performance First**: Target 60fps with <50MB memory footprint
- **Aesthetic Coherence**: All visual effects feel part of a unified system
- **Graceful Degradation**: Fail safely with fallback behaviors
- **User Empowerment**: Full customization without compromising stability

### Project Mission
*"Every line of code should feel like stardust settling into constellation patterns - purposeful, beautiful, and performant. We don't just implement features; we choreograph systems that dance with the rhythm of user's music and the physics of their hardware."*

---

## Architecture Framework

### Core System Components

#### Year3000System (Central Orchestrator)
- **Location**: `src-js/core/Year3000System.ts`
- **Role**: Central coordinator for all managers, services, and visual systems
- **Responsibilities**: System lifecycle, performance monitoring, error recovery

#### Key Subsystems
- **ColorHarmonyEngine**: Dynamic color extraction and palette generation
- **MusicSyncService**: Real-time music analysis and beat detection
- **PerformanceAnalyzer**: Resource usage monitoring and optimization
- **MasterAnimationCoordinator**: 60fps animation management
- **CSSVariableBatcher**: Optimized CSS variable updates
- **SettingsManager**: User configuration persistence

#### Visual Systems
- **BeatSyncVisualSystem**: Beat-synchronized animations
- **LightweightParticleSystem**: Optimized particle effects
- **WebGPUBackgroundSystem**: GPU-accelerated backgrounds
- **RightSidebarConsciousnessSystem**: Sidebar-specific enhancements

#### Managers
- **Card3DManager**: 3D card transformations
- **GlassmorphismManager**: Glassmorphism effects
- **SettingsManager**: Configuration management

#### Services
- **MusicSyncService**: Spotify API integration
- **TemporalMemoryService**: History and state management

---

## Technology Constraints

### Approved Technology Stack

#### Languages (REQUIRED)
- **TypeScript**: Primary language for all client-side logic (strict mode required)
- **JavaScript (ES6+)**: Configuration files where TypeScript not required
- **SCSS**: CSS pre-processor for all styling

#### Core APIs (REQUIRED)
- **Spicetify.Player**: Track changes and playback state
- **Spicetify.Platform**: User information and client details
- **Spicetify.React & Spicetify.ReactDOM**: Custom UI elements
- **Spicetify.colorExtractor**: Album art color extraction
- **Spicetify.getAudioData**: Audio analysis features

#### Build Tools (REQUIRED)
- **esbuild**: JavaScript bundler (React/ReactDOM external)
- **TypeScript Compiler**: Type checking
- **SASS Compiler**: SCSS to CSS compilation (external)
- **Jest & ts-jest**: Testing framework

#### UI Libraries (APPROVED)
- **spcr-settings**: Settings page UI framework

### Prohibited Technologies

#### Banned Dependencies
- **jQuery**: All DOM manipulation via vanilla JS or Spicetify APIs
- **Heavy Animation Libraries**: No GSAP, Three.js, etc. (performance critical)
- **External UI Frameworks**: No Bootstrap, Material-UI, etc.
- **General Purpose Frameworks**: Custom solutions preferred for performance

---

## Development Standards

### Code Architecture Standards

#### Module Interface Requirements
```typescript
// All modules must implement IManagedSystem
interface IManagedSystem {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<HealthCheckResult>;
  destroy(): void;
  forceRepaint?(reason?: string): void;
}

// Example implementation
class FeatureManager implements IManagedSystem {
  public initialized: boolean = false;
  
  constructor(private system: Year3000System) {}

  async initialize(): Promise<void> {
    // Setup with error handling
    this.initialized = true;
  }

  updateAnimation(deltaTime: number): void {
    // Animation updates
  }

  async healthCheck(): Promise<HealthCheckResult> {
    return { ok: true };
  }

  destroy(): void {
    // Always implement cleanup
    this.initialized = false;
  }
}
```

#### Error Handling Pattern (REQUIRED)
```typescript
class FeatureManager {
  private handleSpicetifyError(operation: string, error: Error): void {
    this.system.logger.error(`${operation} failed`, {
      error: error.message,
      stack: error.stack,
      context: this.constructor.name
    });

    // Always provide fallback behavior
    this.enableFallbackMode();
  }

  private enableFallbackMode(): void {
    // Graceful degradation logic
  }
}
```

#### Performance Validation (REQUIRED)
```typescript
// All operations must be performance monitored
const performanceResult = this.system.performanceAnalyzer.measureOperation(
  'operation-name',
  () => this.performOperation()
);
```

### Commit Standards

#### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`
**Scopes**: `core`, `visual`, `managers`, `systems`, `scss`, `types`

**Examples**:
```
feat(visual): add reactive particle system with beat sync
fix(core): prevent memory leak in animation coordinator
refactor(scss): consolidate glow effects into harmonic aura mixin
perf(systems): optimize CSS variable batching for smoother transitions
```

---

## Performance Requirements

### Mandatory Performance Targets

#### Resource Usage Limits
- **CPU Usage**: <10% increase during idle, <30% during transitions
- **GPU Usage**: <25% on mid-range hardware (GTX 1650 baseline)
- **Memory Usage**: <50MB JavaScript heap, no leaks over 4+ hours
- **Frame Rate**: 60fps target, never below 45fps on capable systems

#### Response Time Requirements
- **UI Interactions**: <100ms response time in settings
- **Color Transitions**: Begin within 500ms of track changes
- **Beat Detection**: <50ms visual response to audio beats
- **Settings Load**: <100ms on Spotify startup

#### Performance Monitoring (REQUIRED)
```typescript
// Use PerformanceAnalyzer for all operations
const monitor = this.system.performanceAnalyzer;

// Memory tracking
monitor.trackMemoryUsage();

// Frame rate validation
monitor.validateFrameRate();

// Operation timing
const result = monitor.measureOperation('color-extraction', () => {
  return this.extractColors(imageUrl);
});
```

### Auto-Performance Scaling

#### Hardware Detection System
- **Auto-Detect**: System capabilities automatically identified
- **Dynamic Quality**: Reduce effect complexity based on performance
- **User Override**: Manual performance mode selection
- **Recovery**: Auto-reduce quality when performance drops

#### Performance Modes
- **Auto**: Intelligent hardware-based optimization
- **High**: Full effects for powerful systems
- **Medium**: Balanced performance and quality
- **Low**: Essential effects only

---

## Quality Gates

### Code Quality Requirements

#### Type Safety (MANDATORY)
- **TypeScript Strict Mode**: 100% compliance required
- **No Any Types**: Explicit typing for all variables
- **Interface Compliance**: All modules implement required interfaces

#### Documentation Requirements (MANDATORY)
```typescript
/**
 * [Brief description of class/function purpose]
 *
 * @description [Detailed explanation of functionality and Year3000System integration]
 *
 * @example
 * ```typescript
 * // Real usage example
 * const manager = new FeatureManager(year3000System);
 * manager.initialize();
 * ```
 *
 * @see {RelatedClass} for [explanation of relationship]
 * @since v2.1.0
 */
```

#### Testing Requirements
- **Unit Tests**: All public methods tested
- **Integration Tests**: Spicetify API integration points
- **Performance Tests**: Resource usage validation
- **Accessibility Tests**: Screen reader and reduced motion

#### Error Resilience (MANDATORY)
- **API Failures**: Graceful handling of all Spicetify API failures
- **Memory Safety**: No memory leaks, proper cleanup
- **Safe Mode**: Auto-disable effects if critical errors detected
- **Long-Session Stability**: Tested up to 8 hours

### Quality Assurance Checklist
- [ ] Follows Year3000System architecture patterns
- [ ] Uses proper CSS variable naming (`--sn-*`)
- [ ] Implements IManagedSystem interface
- [ ] Has comprehensive error handling
- [ ] Includes JSDoc documentation
- [ ] Passes TypeScript strict mode
- [ ] Supports accessibility features
- [ ] Memory cleanup implemented
- [ ] Performance validated with PerformanceAnalyzer

---

## File Organization

### Directory Structure

#### Root Level
- `app.scss`: Main SCSS entry point
- `color.ini`: Catppuccin color palettes
- `theme.js`: Final bundled JavaScript (auto-generated)
- `user.css`: Final compiled CSS (auto-generated)
- `manifest.json`: Spicetify theme manifest
- `.cursor/rules/`: Agent rule files (`.mdc`)

#### Source Directories

##### `/src` - SCSS Source Files
```
/src/
├── components/     # Reusable UI components
├── core/          # Core theme styles, variables, mixins
├── features/      # Complex features (settings modal)
├── layout/        # Major layout containers
├── search/        # Search-related styles
└── sidebar/       # Navigation sidebar styles
```

##### `/src-js` - TypeScript Source Files
```
/src-js/
├── components/    # React components (settings UI)
├── config/        # Global configuration files
├── core/          # Year3000System orchestrator
├── debug/         # Performance monitors, debugging tools
├── effects/       # Standalone visual effects
├── managers/      # Feature-specific managers
├── services/      # Data provision services
├── systems/       # Core logic systems
│   └── visual/    # Visual rendering systems
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── theme.entry.ts # Main entry point
```

#### Supporting Directories
- `/assets`: Static assets (animated GIFs per Catppuccin flavor)
- `/docs`: Project documentation
- `/Extensions`: JavaScript extension files for Spicetify

### Naming Conventions

#### File Naming
- **SCSS Files**: `_partial-name.scss` (e.g., `_buttons.scss`)
- **TypeScript Files**: `PascalCase.ts` for classes (e.g., `ColorHarmonyEngine.ts`)
- **Utility Files**: `camelCase.ts` (e.g., `musicSyncUtils.ts`)

#### CSS Variables
- **Spicetify Compatibility**: `--spice-{property}`
- **StarryNight Specific**: `--sn-{property}`
- **RGB Variants**: `--spice-rgb-{property}`, `--sn-gradient-{property}-rgb`

#### Code Naming
```typescript
// Interface naming: starts with capital I
interface IManagedSystem {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<HealthCheckResult>;
  destroy(): void;
  forceRepaint?(reason?: string): void;
}

// CSS variables: kebab-case with sn- prefix
--sn-particle-count: 120;
--sn-glow-intensity: 0.5;
--sn-harmonic-phase: 0deg;

// SCSS mixins: kebab-case with descriptive action
@mixin cosmic-glow-effect($intensity, $color-rgb) { }
@mixin beat-responsive-scale($base-scale: 1) { }
```

---

## Coding Standards

### SCSS Standards

#### Module Structure (REQUIRED)
```scss
// SCSS Module Structure
@use "../core/_mixins" as *;
@use "../components/_sn_harmonic_aura" as *;

// 1. CSS Variables (--sn-* prefixed)
:root {
  --sn-feature-intensity: 0;
  --sn-feature-hue: 0deg;
}

// 2. Mixins following naming convention
@mixin feature-glow-effect($intensity: 0.5) {
  // Implementation
}

// 3. Application with proper scope
@include target-selector {
  @include feature-glow-effect();
}
```

#### CSS Variable System (REQUIRED)
- **Dynamic Styling**: All visual properties needing real-time updates
- **StarryNight Prefix**: `--sn-*` for theme-specific variables
- **Spicetify Compatibility**: `--spice-*` for legacy support
- **GPU Acceleration**: Use `transform` and `opacity` for animations

#### Accessibility Requirements (MANDATORY)
- **Reduced Motion**: Support `prefers-reduced-motion`
- **Contrast Ratios**: Maintain Catppuccin contrast standards
- **Screen Reader**: All UI elements properly labeled

### TypeScript Standards

#### Class Structure (REQUIRED)
```typescript
/**
 * Example of properly documented StarryNight component
 * @class ParticleSystemManager
 * @implements {IManagedSystem}
 * @description Manages lightweight particle effects responding to beat detection
 */
class ParticleSystemManager implements IManagedSystem {
  public initialized: boolean = false;
  constructor(private system: Year3000System) {}

  /**
   * Updates particle intensity based on music beat detection
   * @param intensity - Beat intensity from 0 (silence) to 1 (peak)
   * @throws {SpicetifyAPIError} When audio data is unavailable
   */
  setBeatIntensity(intensity: number): void {
    try {
      this.updateParticleCount(Math.floor(intensity * this.maxParticles));
    } catch (error) {
      this.system.logger.warn('Particle update failed, using fallback', error);
      this.useStaticParticles();
    }
  }
}
```

#### Error Handling Patterns (MANDATORY)
```typescript
// Standard Spicetify API error handling
try {
  const colorData = Spicetify.colorExtractor(imageUrl);
} catch (error) {
  this.system.logger.warn('Color extraction failed, using theme default');
  return this.getThemeDefaultColor();
}
```

---

## User Experience Guidelines

### UX Principles

#### Core UX Goals
- **Effortless Discovery**: Users intuitively understand capabilities
- **Meaningful Responsiveness**: Visual changes connect to music/intent
- **Respectful Performance**: Never compromise Spotify functionality
- **Inclusive Access**: Accessible to users with varying abilities
- **Delightful Surprise**: Unexpected moments enhancing music enjoyment

#### User Personas

##### Primary: Music Enthusiast
- **Needs**: Enhanced listening, customizable visuals, smooth performance
- **Flow**: Install → Visual enhancement → Discover settings → Customize

##### Secondary: Accessibility-Focused User
- **Needs**: Beautiful theme without accessibility interference
- **Flow**: Enable reduced motion → Verify contrast → Test screen reader

##### Tertiary: Performance-Conscious User
- **Needs**: Visual enhancements without performance impact
- **Flow**: Auto-detect hardware → Suggest settings → Monitor performance

### Settings Organization (REQUIRED)

#### Priority-Ordered Categories
1. **Visual Effects** (Most discovered)
   - Beat Sync Intensity: 0-100% slider
   - Color Harmony: On/Off + Manual Override
   - Particle Effects: None/Subtle/Full
   - Glassmorphism Intensity: 0-100% slider

2. **Performance** (Power users)
   - Performance Mode: Auto/High/Medium/Low
   - FPS Target: 30/60/120 fps
   - Memory Limit: Conservative/Balanced/Unlimited

3. **Accessibility** (Critical for some)
   - Reduced Motion: System/Force off/Force on
   - High Contrast: Theme/Enhanced/Maximum
   - Animation Speed: 0.5x/1x/1.5x/2x

4. **Advanced** (Enthusiasts)
   - Export/Import Settings
   - Debug Information
   - Custom Configurations

### Accessibility Requirements (MANDATORY)

#### Screen Reader Support
- All controls have proper ARIA labels
- Changes announced to screen reader
- Visual effects don't interfere with audio feedback

#### Motion Sensitivity Support
- **System Preference**: Automatically respect `prefers-reduced-motion`
- **Conservative**: Gentle effects only (opacity, subtle scaling)
- **Minimal**: Static colors, no animations
- **Off**: Purely functional theme, no visual effects

---

## Feature Development

### Feature Acceptance Criteria

#### Core Visual Systems
- **Color Extraction**: <200ms extraction, >95% success rate
- **Beat Synchronization**: ±3 BPM accuracy, <50ms visual response
- **Performance**: Maintain 60fps during peak activity
- **Accessibility**: WCAG 2.1 AA compliance

#### Integration Requirements
- **API Coverage**: Utilize all relevant Spicetify APIs
- **Error Resilience**: Handle all API failure scenarios
- **Version Compatibility**: Support latest 3 Spicetify versions
- **Lifecycle Management**: Proper cleanup on theme unload

### Feature Development Workflow

#### 1. ORIENT - Understand System Context
```typescript
import { Year3000System } from '../core/Year3000System';
import type { IManagedSystem } from '../types/systems';
```

#### 2. APPLY - Follow Established Patterns
```typescript
class NewFeatureManager implements IManagedSystem {
  public initialized: boolean = false;
  
  constructor(private system: Year3000System) {}
  
  async initialize(): Promise<void> {
    // Setup with error handling
    this.initialized = true;
  }
  
  updateAnimation(deltaTime: number): void {
    // Animation updates
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    return { ok: true };
  }
  
  destroy(): void {
    // Always implement cleanup
    this.initialized = false;
  }
}
```

#### 3. VALIDATE - Use Performance Monitoring
```typescript
const performanceResult = this.system.performanceAnalyzer.measureOperation(
  'new-feature-operation',
  () => this.performOperation()
);
```

### Feature Testing Protocol

#### Automated Testing Requirements
```typescript
describe('ColorHarmonyEngine', () => {
  it('should extract colors within performance bounds', async () => {
    const startTime = performance.now();
    const colors = await colorEngine.extractFromArtwork(testImageUrl);
    const duration = performance.now() - startTime;

    expect(duration).toBeLessThan(200); // 200ms requirement
    expect(colors).toHaveLength(5); // Expected color count
    expect(colors[0]).toMatchRGB(expectedDominantColor); // Color accuracy
  });
});
```

#### Manual Testing Checklist
- [ ] Visual quality across all Catppuccin flavors
- [ ] Smooth performance on target hardware specs
- [ ] Screen reader and reduced motion accessibility
- [ ] Edge cases: unusual artwork, network issues, API failures
- [ ] Complete user workflows end-to-end

---

## Conclusion

This document represents the complete development ruleset for the Catppuccin StarryNight Spicetify theme. All development work must adhere to these standards to maintain the project's vision of a performant, beautiful, and accessible music visualization system.

Remember the project philosophy: *"Every line of code should feel like stardust settling into constellation patterns - purposeful, beautiful, and performant."*

For questions or clarifications, refer to the specific `.cursor/rules/*.mdc` files or project documentation in the `/docs` directory.

---

**Document Version**: 1.0  
**Last Updated**: 2025-07-02  
**Maintained By**: Year 3000 Development Team