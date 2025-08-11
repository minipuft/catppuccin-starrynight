# Directory Structure Guide

This document outlines the organized directory structure of the Catppuccin StarryNight theme, designed for developer-friendly navigation and logical component grouping.

## 🗂️ Source Code Organization (`src-js/`)

The TypeScript source code is organized into intuitive, domain-specific directories:

### 📱 **`audio/`** - Music Analysis & Processing
Components that analyze, process, and extract data from music:
- `MusicSyncService.ts` - Core music analysis and beat detection
- `ColorHarmonyEngine.ts` - Album art color extraction and palette generation
- `GenreProfileManager.ts` - Music genre classification and profiling
- `TemporalMemoryService.ts` - Music listening history and pattern analysis

### 🎨 **`visual/`** - Visual Effects & Rendering
All visual components, organized by type:

#### `visual/base/` - Core Visual Infrastructure
- `BaseVisualSystem.ts` - Abstract base class for all visual systems
- `starryNightEffects.ts` - Core visual effect utilities

#### `visual/backgrounds/` - Background Rendering Systems
- `WebGLGradientBackgroundSystem.ts` - GPU-accelerated flowing gradients
- `LightweightParticleSystem.ts` - CPU-optimized particle effects
- `ParticleFieldSystem.ts` - REMOVED: Consolidated into ParticleConsciousnessModule

#### `visual/beat-sync/` - Music-Reactive Visuals
- `BeatSyncVisualSystem.ts` - Beat-synchronized visual effects and animations

#### `visual/ui-effects/` - Interface Enhancement Effects
- `RightSidebarCoordinator.ts` - Performance coordinator for sidebar updates
- `RightSidebarConsciousnessSystem.ts` - Music-reactive sidebar effects
- `DimensionalNexusSystem.ts` - Spatial UI transformation effects
- `DataGlyphSystem.ts` - Information visualization components
- `BehavioralPredictionEngine.ts` - User interaction prediction system
- `PredictiveMaterializationSystem.ts` - Predictive UI materialization
- `SidebarConsciousnessSystem.ts` - General sidebar enhancement system
- `NebulaController.ts` - Nebula visual effect coordination
- `Aberration/` - Chromatic aberration effects
- `prismaticScrollSheen.ts` - Scroll-reactive visual enhancements

### 💻 **`ui/`** - User Interface Components
User-facing interface elements:

#### `ui/components/` - React/UI Components
- `StarryNightSettings.ts` - Theme settings interface

#### `ui/interactions/` - User Interaction Systems
- `EnhancedDragPreview.ts` - Enhanced drag and drop visuals
- `QuickAddRadialMenu.ts` - Radial menu interface

#### `ui/managers/` - UI State Management
- `SettingsManager.ts` - User preferences and configuration
- `Card3DManager.ts` - 3D card transformation effects
- `GlassmorphismManager.ts` - Glass morphism effect management

### ⚙️ **`core/`** - Core System Infrastructure
Fundamental system components:

#### `core/animation/` - Animation Engine
- `MasterAnimationCoordinator.ts` - Centralized animation frame management
- `EmergentChoreographyEngine.ts` - Advanced animation orchestration

#### `core/config/` - Configuration Systems
- `environment.ts` - Environment capability detection

#### `core/events/` - Event Management
- `EventBus.ts` - Global event communication system

#### `core/lifecycle/` - System Lifecycle Management
- `year3000System.ts` - Main system orchestrator
- `VisualSystemRegistry.ts` - Visual system registration and management

#### `core/performance/` - Performance Optimization
- `CSSVariableBatcher.ts` - Batched CSS variable updates
- `DeviceCapabilityDetector.ts` - Hardware capability detection
- `PerformanceAnalyzer.ts` - Real-time performance monitoring
- `TimerConsolidationSystem.ts` - Optimized timer management
- `CDFVariableBridge.ts` - CSS variable synchronization

### 🛠️ **`utils/`** - Utility Functions
Reusable utility functions organized by domain:

#### `utils/animation/` - Animation Utilities
- Animation helper functions and mathematical utilities

#### `utils/core/` - Core Utilities
- `Year3000Utilities.ts` - Core theme utility functions
- `PaletteExtensionManager.ts` - Color palette management

#### `utils/dom/` - DOM Manipulation
- `domCache.ts` - DOM element caching
- `getScrollNode.ts` - Scroll container detection
- `sidebarDetector.ts` - Sidebar state detection
- `NowPlayingDomWatcher.ts` - Now playing bar observation

#### `utils/graphics/` - Graphics Utilities
- `NoiseField.ts` - Procedural noise generation
- `ShaderLoader.ts` - WebGL shader management

#### `utils/platform/` - Platform Integration
- `SpicetifyCompat.ts` - Spicetify compatibility layer
- `StorageManager.ts` - Local storage management
- `UserHistory.ts` - User interaction history
- `spicetifyReady.ts` - Spicetify readiness detection

### 🎯 **`assets/`** - Static Assets
- `shaders/` - WebGL/WebGPU shader files
- `worklets/` - Audio worklet files

### 🎛️ **Supporting Directories**
- `config/` - Configuration files and constants
- `debug/` - Debugging and diagnostic tools
- `types/` - TypeScript type definitions
- `tests/` - Unit and integration tests

## 📁 **Documentation Structure (`docs/`)**

Documentation is organized by system and domain:

- `BeatSync/` - Beat synchronization system documentation
- `core_systems/` - Core infrastructure documentation
- `development/` - Development guides and rules
- `effects/` - Visual effects documentation
- `spotify/` - Spotify integration documentation
- `theme_system/` - Theme system architecture
- `visual/` - Visual system documentation

## 🎯 **Key Architecture Principles**

### 1. **Domain Separation**
- **Audio**: Music analysis and data extraction
- **Visual**: Rendering and visual effects
- **UI**: User interface and interaction
- **Core**: System infrastructure
- **Utils**: Reusable utilities

### 2. **Layered Architecture**
```
UI Layer (React components, interactions)
    ↓
Visual Layer (effects, animations, rendering)
    ↓
Audio Layer (music analysis, color extraction)
    ↓
Core Layer (lifecycle, performance, events)
    ↓
Utils Layer (platform, graphics, DOM utilities)
```

### 3. **Clear Dependencies**
- Higher layers depend on lower layers
- No circular dependencies between domains
- Shared utilities accessible to all layers

### 4. **Performance Focus**
- Dedicated performance monitoring and optimization systems
- Centralized animation coordination
- Batched updates and optimized rendering

This structure ensures maintainability, performance, and clear separation of concerns while providing an intuitive navigation experience for developers.