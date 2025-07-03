## v1.2.0 – Flow Gradient Wave/Blur System (03-Jul-2025)

### Added

- **WebGL Flow Gradient System** - Comprehensive flowing gradient background with dual time-offset waves and dynamic blur
  - `WebGLGradientBackgroundSystem` - New visual system extending `BaseVisualSystem`
  - **Wave Stack Architecture**: Dual independent wave layers with per-wave alpha masks
  - **Dynamic Blur System**: Power function blur calculation for depth perception
  - **Three-Field Noise Blending**: Independent background noise with time offsets
  - **CSS Skew Transform**: Sleek `-6deg` skew with responsive & accessibility support

- **New Shader Uniforms**:
  - `u_waveY[2]` - Wave Y positions (default: [0.25, 0.75])
  - `u_waveHeight[2]` - Wave blend heights (default: [0.4, 0.3])
  - `u_waveOffset[2]` - Time offsets (default: [2.5, -1.8])
  - `u_blurExp` - Blur power function exponent (default: 1.2)
  - `u_blurMax` - Maximum blur amount (default: 0.6)

- **Public API Methods**:
  - `setWaveY()`, `setWaveHeight()`, `setWaveOffset()` - Wave parameter control
  - `setBlurSettings()` - Dynamic blur configuration
  - `getMetrics()` - Performance monitoring (fps, compileErrors, isActive, settings)

- **CSS Wrapper System**:
  - `.sn-flow-gradient-wrapper` - Canvas container with transform isolation
  - Mobile responsiveness: skew disabled ≤ 768px viewports
  - Accessibility: `prefers-reduced-motion` compliance

- **Intensity Presets**: `minimal` | `balanced` | `intense` with different parameter matrices
- **Comprehensive Testing**: 33 unit tests covering wave stack, wrapper performance, and integration

### Changed

- **Enhanced Fallback Consistency**: CSS gradient fallback now matches WebGL skew transform
- **Performance Optimizations**: GPU cost < 1ms @1080p, compile time < 3ms on Intel UHD 620
- **Accessibility Improvements**: Full reduced motion support across WebGL and CSS systems

### Technical Details

- **Framework**: C.A.G.E.E.R.F methodology implementation
- **Performance Targets**: 60fps target, <50MB memory, <10% CPU overhead  
- **Browser Support**: WebGL2 baseline, automatic fallback to CSS gradient
- **Quality Gates**: 90%+ test coverage, zero TypeScript errors, WCAG 2.1 AA compliance

### Documentation

- Updated `docs/webgl-gradient-integration.md` with Phase 1-5 implementation status
- Added comprehensive troubleshooting section with driver compatibility matrix
- Documented settings matrix, API methods, and debug tools
- Performance benchmarks and accessibility compliance detailed

---

## v1.1.0 – Canonical Accent Token Roll-Out (01-Jul-2025)

### Breaking ⚠️

The legacy StarryNight gradient variables have been removed from runtime output.

| Removed                         | Replacement                           |
| ------------------------------- | ------------------------------------- |
| `--sn-gradient-primary(-rgb)`   | `--sn-accent-hex` / `--sn-accent-rgb` |
| `--sn-gradient-secondary(-rgb)` | ↑                                     |
| `--sn-gradient-accent(-rgb)`    | ↑                                     |
| `--sn-dynamic-accent-rgb`       | ↑                                     |

If you were targeting these CSS custom properties in personal mods or
user-styles, switch to the canonical pair above.

### Changed

- Color pipeline writes only `--sn-accent-hex` and `--sn-accent-rgb`.
- `writeLegacyAccentVars` configuration flag **removed** (was deprecated in
  vNext).
- Visual systems (Nebula, BeatSync, ParticleField, etc.) now read the canonical
  token exclusively.

### Added

- Helper `getCanonicalAccent()` already available since v1.0.0.

## vNext – Sidebar Dimensional Nexus Consolidation (17-Jun-2025)

### Added

- `src/sidebar/_sidebar_dimensional_nexus.scss` – new enhancement layer for Dimensional Rift & advanced sidebar effects.

### Changed

- Consolidated duplicated variables into `_sidebar_background_effects.scss`.
- Removed import of deprecated `src/systems/_sn_dimensional_nexus.scss` from build.
- Updated import order in `src/core/_main.scss` to ensure background → interactive → nexus hierarchy.
- Removed all resolved `TODO[Y3K-*]` comment markers from SCSS core files after full implementation of anticipatory shimmer (PH1) and predictive materialization (PH2) hooks.

### Removed

- `src/systems/_sn_dimensional_nexus.scss` – module fully removed after consolidation.

### Notes for Theme Customizers

- If you previously referenced `--sn-sidebar-*` variables in custom overrides, verify they remain intact.
- The new Dimensional Rift variables (`--sn-dimensional-rift-intensity`, `--sn-dimensional-rift-color-rgb`) continue to function unchanged.

## vNext – Drag-and-Drop Documentation (18-Jun-2025)

### Added

- `docs/DragAndDrop/DRAG_AND_DROP_OVERVIEW.md` – architecture & phased rollout.
- `docs/DragAndDrop/DRAG_CARTOGRAPHER.md` – debug mapping docs.
- `docs/DragAndDrop/ENHANCED_DRAG_PREVIEW.md` – canvas drag ghost docs.
- `docs/DragAndDrop/QUICK_ADD_RADIAL_MENU.md` – quick-add radial docs.
- Updated `docs/README.md` index with **Drag-and-Drop UX** section.

### Notes

These documents cover the new drag-and-drop UX stack introduced during Phases 1-4 (June 2025). They have no code impact but provide implementation guidance and a11y specs.

## vNext – Data Glyph System v3 (21-Jun-2025)

### Added

- Health-monitor integration for DataGlyphSystem (`requiredSelectors`, custom `healthCheck`).
- Jest spec `tests/DataGlyphSystem.spec.ts` covering echo pooling & mega-ripple logic (≥90 % coverage).
- `src/components/_sn_glyph_variables.scss` with glyph variable map + `glyph-consciousness()` mixin.

### Changed

- DataGlyphSystem routes CSS writes through `CSSVariableBatcher`; introduces `--sn-glyph-intensity`, `--sn-glyph-glow`.
- Echo pool switched to size-aware LRU (2× dynamicMaxEchoes) and TimerConsolidation cleanup.
- Docs updated (`docs/effects/Data_Glyph_System.md` v3).

### Deprecated

- Legacy tokens `--glyph-intensity`, `--sn-glyph-opacity` (to be removed in v2.0).
