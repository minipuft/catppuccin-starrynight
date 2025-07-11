# 👁️ Catppuccin StarryNight: Visual Systems Architecture

**Document Version:** 2.0 - Updated for New Directory Structure

## 👋 Welcome to Catppuccin StarryNight!

The Catppuccin StarryNight theme for Spicetify is more than just a color scheme; it's an immersive visual experience designed to bring your Spotify interface to life. It dynamically responds to the music you play, user interactions, and the beloved Catppuccin color palettes (Mocha, Macchiato, Frappe, Latte).

This document details the **developer-friendly architecture** of our sophisticated visual systems, organized in an intuitive directory structure that separates concerns and promotes maintainability.

Whether you're a developer looking to understand the theme's internals, a contributor, or simply curious, this guide will walk you through the organized architecture of these sophisticated visual components.

---

## 🎯 Purpose of This Document

This document aims to:

- Explain the overall architecture of the visual systems within `theme.js`.
- Detail the role and implementation of each individual visual system.
- Provide a clear understanding of how these systems achieve music synchronization and dynamic effects.
- Document the new developer-friendly directory structure and its benefits.

---

## 🗂️ New Directory Structure Overview

As of version 2.0, the codebase has been reorganized into a **developer-friendly structure** that promotes clarity and maintainability:

### **Domain-Driven Organization**

```
src-js/
├── 🎵 audio/          # Music analysis, color extraction, genre profiling
├── 👁️ visual/         # Visual effects, rendering, animations
├── 💻 ui/             # User interface components and interactions
├── ⚙️ core/           # Core system infrastructure
├── 🛠️ utils/          # Utility functions by domain
└── 📦 assets/         # Static assets (shaders, worklets)
```

### **Key Benefits**

- **Intuitive Navigation**: Find components by their purpose, not implementation details
- **Clear Dependencies**: Layered architecture with defined data flow
- **Maintainability**: Related functionality grouped together
- **Scalability**: Easy to add new systems within existing domains

### **Visual Systems Location**

Visual systems are now organized in `src-js/visual/` by type:

- `visual/base/` - Core visual infrastructure
- `visual/backgrounds/` - Background rendering systems
- `visual/beat-sync/` - Music-reactive visual effects
- `visual/ui-effects/` - Interface enhancement effects

This replaces the previous scattered organization across multiple directories.

---

## 🎶 The Core Engine: How Visuals Sync with Music

The dynamic nature of Catppuccin StarryNight is powered by a coordinated system where music analysis drives visual changes. Here's the architectural flow:

### **Audio Layer** (`src-js/audio/`)

1.  **`MusicSyncService`** - The Conductor: Central music analysis engine that fetches raw audio data from Spotify (BPM, energy, danceability, timing segments) and processes it into usable formats.
2.  **`ColorHarmonyEngine`** - The Palette Extractor: Analyzes album artwork to extract dominant colors and harmonizes them with Catppuccin palettes.
3.  **Event Broadcasting**: Music data is published via the GlobalEventBus to all subscribed visual systems.

### **Visual Layer** (`src-js/visual/`)

4.  **Visual Systems - The Performers**: Specialized modules organized by type:
    - **Background Systems** (`visual/backgrounds/`) - WebGL renderers, particle effects
    - **Beat-Sync Systems** (`visual/beat-sync/`) - Music-reactive visual effects
    - **UI Effects** (`visual/ui-effects/`) - Interface enhancements, sidebar animations
    - **Base Infrastructure** (`visual/base/`) - Common visual system foundation

### **Core Coordination** (`src-js/core/`)

5.  **System Orchestration**: `Year3000System` manages lifecycle, `MasterAnimationCoordinator` synchronizes animations, `PerformanceAnalyzer` monitors performance.

### **Data Flow**

```
Audio Analysis → Color Extraction → Event Broadcasting → Visual Rendering
     ↓              ↓                    ↓                    ↓
MusicSyncService → ColorHarmonyEngine → GlobalEventBus → Visual Systems
```

### **Visual Transformation Methods**

Visual systems receive music data and create effects through:

- **CSS Variable Updates**: Dynamic CSS Custom Properties via `CSSVariableBatcher`
- **DOM Manipulation**: Adding/removing classes for animation triggers
- **Canvas Rendering**: Direct HTML5 Canvas graphics for complex visuals
- **Animation Orchestration**: Coordinated timing via `MasterAnimationCoordinator`

All visual systems extend `BaseVisualSystem` (`src-js/visual/base/`) providing consistent initialization, cleanup, performance monitoring, and utility functions for color manipulation and frame-rate independent animations.

---

## ⚙️ Meet the Visual Systems: A Deep Dive

Below is a breakdown of each distinct visual system, outlining its specific contribution to the theme and key aspects of its implementation.

### 1. `BeatSyncVisualSystem` (`src-js/visual/beat-sync/`)

- **Purpose**: To create visual effects that pulse and react in direct synchronization with the music's beat and rhythm. This system provides immediate, tangible feedback to the listener, strengthening the connection between sight and sound.
- **Location**: `src-js/visual/beat-sync/BeatSyncVisualSystem.ts`
- **Implementation Highlights**:
  - **Rhythm-Responsive**: Subscribes to music events via `GlobalEventBus` from `MusicSyncService`. The `onBeatDetected(currentTime, energy, visualIntensity)` method triggers beat-synchronized effects.
  - **Smooth Animations**: Employs `MasterAnimationCoordinator` integration for optimized animation loops with `requestAnimationFrame`. Uses `Year3000Utilities.lerpSmooth` for frame-rate independent smooth animations.
  - **Controlled Pulsing**: It manages the intensity of visual pulses by interpolating a `currentPulseIntensity` value towards a `targetPulseIntensity` (set upon beat detection). The speed of this animation is controlled by distinct `pulseHalfLifeAttack` and `pulseHalfLifeDecay` parameters, allowing for customizable attack and release times for the pulses.
  - **CSS-Driven Effects**: The calculated `currentPulseIntensity` is typically applied to a CSS custom property (e.g., `--sn-beat-pulse-intensity`). The theme's stylesheets then use this variable to drive actual visual effects like glows, size changes, or opacity shifts on UI elements.

### 2. `LightweightParticleSystem`

- **Purpose**: To generate and manage a field of dynamic, lightweight particles. These particles create an ambient, atmospheric layer that subtly responds to the music, significantly contributing to the "StarryNight" aesthetic of the theme.
- **Implementation Highlights**:
  - **Canvas Rendering**: Particles are rendered onto one or more dedicated HTML5 Canvas elements, usually positioned as a background layer. It utilizes the `_createCanvasElement` method from the `BaseVisualSystem` for canvas setup.
  - **Efficient Particle Management**: It uses a `particlePool` to reuse particle objects, which is more performant than continuously creating and destroying them, especially when many particles are active.
  - **Dynamic Particle Behavior**: When `spawnParticle(energy, intensity, speedFactor, mood)` is called (often triggered by `updateFromMusicAnalysis`), new particles are introduced or existing ones are reset. Their initial properties (like velocity, size, color, and lifespan) are directly influenced by the characteristics of the current music (e.g., higher energy music might result in faster or brighter particles).
  - **Physics and Smoothing**: A continuous `renderLoop` (using `requestAnimationFrame`) updates particle positions based on their physics (velocity) and also updates visual properties like size and opacity based on their remaining `life`. Crucially, `Year3000Utilities.lerpSmooth` is used here to smoothly animate changes in particle position, rotation, size, and opacity, making their movement and transitions appear more natural and fluid.
  - **Musical Influence**: The `updateFromMusicAnalysis(processedMusicData)` method regularly feeds new musical data into the system, which can alter parameters like particle spawn rate, average speed, color palettes, or general turbulence of the particle field.

### 3. `BehavioralPredictionEngine`

- **Purpose**: To analyze the ongoing music stream and attempt to predict upcoming significant musical events, such as drops, transitions between sections (verse to chorus), or moments of high energy. These predictions are then used to create subtle, anticipatory visual cues in the UI.
- **Implementation Highlights**:
  - **Music Data Analysis**: Within its `updateFromMusicAnalysis` method, this engine scrutinizes `processedMusicData` and `rawFeatures`, potentially looking for patterns in loudness, energy trends, or information about musical segments.
  - **Forecasting Logic**: The `generatePredictions(context)` method embodies the core prediction algorithm. This could range from simple heuristic rules (e.g., a rapid increase in energy and loudness might signal an impending drop) to more sophisticated analyses.
  - **Subtle Visual Cues**: Predictions are translated into visual highlights via the `applyHighlights(predictions)` method. This usually involves applying specific CSS classes (obtained via `getHighlightClasses(type)`) to UI elements. These classes might trigger subtle animations, color shifts, or glows that prime the user for the predicted musical change without being overly distracting.

### 4. `DataGlyphSystem`

- **Purpose**: To attach small, dynamic visual markers or "glyphs" to various UI elements, such as items in playlists, navigation links, or cards. These glyphs can serve multiple functions: representing underlying data, providing additional context, visually enhancing interactivity, or reacting to the music.
- **Implementation Highlights**:
  - **DOM Awareness**: It uses a `MutationObserver` (configured via `setupItemObserver`) to monitor the DOM for the appearance or modification of specific UI elements that should host a glyph.
  - **Glyph Lifecycle**: When a designated element is detected, `attachGlyph(itemElement)` is called to create the glyph and append it to the element. The `updateGlyphData(itemElement, data)` method allows the glyph's appearance or state to be changed dynamically, often driven by data from `updateFromMusicAnalysis`.
  - **Interactive Glyphs**: The system can respond to user interactions via `handleItemInteraction(itemElement, event)`, allowing glyphs to animate or change state on events like mouse hover or click.
  - **Advanced Effects**: Features like `updateActiveEchoesAndResonance()` suggest that glyphs might have more complex behaviors, such as creating temporary visual "echoes" or interacting with nearby glyphs based on a concept of musical "resonance," leading to a more interconnected and flowing visual language across the interface.

### 5. `DimensionalNexusSystem`

- **Purpose**: To create and manage what is described as a "dimensional nexus" or "quantum space." This likely refers to a highly sophisticated and immersive visual background or overlay effect that forms a core part of the theme's advanced visual identity, reacting deeply to both music and user activity.
- **Implementation Highlights**:
  - **Generative/Procedural Visuals**: Methods such as `initializeQuantumSpace()`, `updateConsciousnessField(processedMusicData)`, and `evolveBiomorphicShape(...)` point towards the generation of complex, possibly abstract and evolving, visual structures.
  - **Organic Forms**: The `evolveBiomorphicShape` method, in particular, suggests the creation of organic-looking, abstract shapes whose forms and animations are influenced by the music's `visualIntensity`, `moodIdentifier`, and `energy`.
  - **User Influence**: `recordUserInteraction()` indicates that user actions (like mouse movements or clicks) can directly impact the state or appearance of this nexus.
  - **Modal Integration**: With `setupModalObserver()`, the system can detect when modals (pop-up dialogs) are displayed and potentially adapt its visuals or the modal's backdrop to create a seamless, integrated look and feel.
  - **Central Visual Hub**: Given its name and the nature of its methods, the Dimensional Nexus System likely serves as a foundational visual element, with other, more specific effects potentially layering on top or interacting with it.

### 6. `PredictiveMaterializationSystem`

- **Purpose**: To work in tandem with predictive logic (either its own or from the `BehavioralPredictionEngine`) to "materialize" or bring visual elements into view in a timely and anticipatory fashion. This aims to make UI changes feel less abrupt and more connected to the flow of the music.
- **Implementation Highlights**:
  - **Anticipatory Element Rendering**: Although its `theme.js` outline is relatively simple (`initialize`, `updateFromMusicAnalysis`, `destroy`), the system's name is highly indicative of its function. It likely manages the appearance and animation of UI elements based on predicted musical events.
  - **Synergy with Prediction**: It probably receives cues or data from a prediction engine. If, for example, a beat drop is predicted in a few seconds, this system might initiate a subtle animation or start rendering an element that will become fully prominent when the drop occurs.
  - **Seamless Transitions**: The timing of these materializations is key, aiming for a smooth and natural integration where visuals appear "just in time" or gracefully lead into significant moments in the music.

### 7. `GradientConductor` (`src-js/visual/backbone/`)

- **Purpose**: Central orchestrator for all gradient background rendering systems. Manages the coordination between WebGL and CSS gradient backends, providing a single source of truth for gradient management with progressive enhancement capabilities.
- **Location**: `src-js/visual/backbone/GradientConductor.ts`
- **Implementation Highlights**:
  - **Backend Management**: Registers and manages multiple visual backends (WebGL, CSS) with priority-based selection using `BackendSelector.selectOptimalBackend()`.
  - **Progressive Enhancement**: Automatically selects the optimal backend based on device capabilities, gracefully falling back from WebGL to CSS when needed.
  - **Performance Monitoring**: Continuously monitors performance metrics and automatically scales quality down when frame rates drop below targets.
  - **Unified API**: Provides consistent methods (`setPalette()`, `setMusicMetrics()`, `setPerformanceConstraints()`) that work across all backends.
  - **Event Coordination**: Listens for color harmony updates, music sync changes, and performance constraint modifications via `GlobalEventBus`.
  - **CSS Variable Integration**: Updates CSS variables for fallback rendering and cross-system coordination via `CSSVariableBatcher`.

### 8. `WebGLGradientBackgroundSystem` (`src-js/visual/backgrounds/`)

- **Purpose**: High-performance WebGL2-based gradient renderer that creates flowing, music-synchronized background gradients using Alex Harri's flowing gradient technique.
- **Location**: `src-js/visual/backgrounds/WebGLGradientBackgroundSystem.ts`
- **Implementation Highlights**:
  - **Advanced Shaders**: Uses sophisticated fragment shaders with dual time-offset waves, dynamic blur system, and three-field noise blending.
  - **Music Synchronization**: Real-time response to beat detection, energy levels, and rhythm phase changes.
  - **Performance Optimized**: Maintains 60fps target with automatic quality scaling and memory management.
  - **Accessibility Compliant**: Respects `prefers-reduced-motion` by freezing animations and disabling transform effects.
  - **Seamless Integration**: Coordinates with `GradientConductor` for backend switching and fallback management.

### 9. `SidebarConsciousnessSystem`

- **Purpose**: To apply dynamic visual effects specifically to the Spotify sidebar (the left navigation pane). The goal is to transform the sidebar from a static list of links into an element that feels aware of and responsive to the currently playing music.
- **Implementation Highlights**:
  - **Focused Styling**: Its effects are primarily targeted at elements within the `.Root__nav-bar` container.
  - **Harmonic Visual Feedback**: A key feature is `updateHarmonicModeDisplay(newModeKey)`. This method likely visualizes the current musical harmony (e.g., analogous, triadic, complementary – concepts often borrowed from color theory and applied to music visualization) by applying specific CSS classes (like `sn-harmonic-analogous-flow`, `sn-harmonic-triadic-balance` found in the theme's CSS) or by directly manipulating styles within the sidebar.
  - **Music-Driven Aesthetics**: The `updateFromMusicAnalysis(processedMusicData)` method takes in musical data and translates it into visual changes for the sidebar. This could involve modifying background effects, the styling of navigation links, or custom visual indicators, all based on the music's energy, mood, or detected harmonic properties.
  - **CSS-Powered**: Like other systems, it achieves its visual effects by dynamically changing CSS custom properties relevant to the sidebar or by adding/removing CSS classes that trigger predefined animations and styles defined in the theme's SCSS/CSS files.

---

This detailed overview should provide a solid understanding of the purpose, role, and general implementation strategy for each visual system within the Catppuccin StarryNight theme. For more granular details on specific mechanisms, such as BPM calculation in the `BMPHarmonyEngine` or color blending logic in the `ColorHarmonyEngine`, please refer to their respective dedicated documentation files: `BMP_HARMONY_ENGINE.md` and `COLOR_HARMONY_ENGINE.md`.

## 🆕 Aberration Visual System (Chromatic Aberration Overlay)

For a deep-dive into the newly refactored chromatic-aberration effect, see **[Aberration Visual System](visual/ABERRATION_SYSTEM.md)**.
It details:

- `AberrationCanvas` WebGL renderer
- `AberrationVisualSystem` adaptor for MasterAnimationCoordinator
- `AberrationManager` settings orchestration & CSS-batch integration

This system lives under `src-js/effects/Aberration/` and was finalised in **Phase 6 (June 2025)**.

## 🌠 Temporal Echo Contract (Phase 4)

The **Temporal Echo** is the canonical ripple / pulse primitive used across all
visual systems. A single SCSS class (`.sn-temporal-echo`) together with a small
set of CSS custom properties replaces a dozen bespoke key-frames. Every system now spawns an echo via DOM (JS) or extends the class
in CSS.

| CSS Variable                  | Purpose                                       | Typical Range                                         |
| ----------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| `--sn-echo-radius-multiplier` | Scales core radius of the expanding circle    | `0.8 – 2.4`                                           |
| `--sn-echo-hue-shift`         | Hue rotation applied to `filter:hue-rotate()` | `-40deg – +40deg` based on track valence              |
| `--sn-kinetic-intensity`      | Overall opacity / blur multiplier (0 = muted) | `0 – 0.5` controlled by **motion-intelligence-level** |
| `--sn-echo-offset-x`          | X-axis positional nudge (noise + beat)        | `-12px – +12px`                                       |
| `--sn-echo-offset-y`          | Y-axis positional nudge                       | `-12px – +12px`                                       |
| `--sn-echo-skew`              | Minor `skewX()` flavour                       | `-6deg – +6deg`                                       |
| `--sn-echo-rotate`            | Start angle for radial mask                   | `0deg – 360deg`                                       |

### Lifecycle

```
┌────────── UI-interaction / beat-peak / prediction ──────────┐
│  Visual system calls `addTemporalEcho(hostElement)`         │
├─────────────────────────────────────────────────────────────┤
│ 1. Echo element acquired from pool (≤ dynamicMaxEchoes)     │
│ 2. Inline CSS vars injected (energy, valence, NoiseField)   │
│ 3. Element appended → CSS handles animation (600–1000 ms)   │
│ 4. On `animationend` → element recycled into pool           │
└─────────────────────────────────────────────────────────────┘
```

### Accessibility

The constructor of each system lazily caches `prefers-reduced-motion`. Spawning
is **skipped entirely** when the user prefers reduced motion or when the
`sn-echo-intensity` setting is `0`. This guarantees a motion-free experience
without double-rendering.

> **Contract Rule:** Systems **MUST NOT** mutate the echo's key-frames – visual
> variation is expressed only through the variables above.
