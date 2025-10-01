# Phase 8.1 - Depth System Consolidation Archive

**Date**: 2025-09-30
**Status**: ✅ Complete

## Archived Files

This directory contains the legacy depth system files that were consolidated in Phase 8.1:

1. **`_visual_hierarchy.scss`** (681 lines)
   - Comprehensive "Year 3000" cosmic visual effects system
   - 6-layer parallax depth with star fields and nebulas
   - 9 keyframe animations
   - Music-responsive cosmic expansion
   - Applied to: `.Root`, `.main-view-container`, `.main-topBar-container`, `.main-navBar-navBar`, `.main-entityHeader-entityHeader`, `.main-nowPlayingBar-nowPlayingBar`

2. **`_perspective_depth_layers.scss`** (104 lines)
   - Modern 3D depth layer system with JS control
   - 4 depth layers using `translateZ` 3D transforms
   - Strong JS integration with `DepthLayeredGradientSystem.ts`
   - Applied to: `.main-view-container__scroll-node`

3. **`_z_index_management.scss`** (44 lines)
   - Basic z-index coordination for layered effects
   - 7 CSS variables for z-index layers
   - Applied to: `.Root__main-view`, `.sn-stars-container`, `.shootingstar`

**Total Lines Archived**: 829 lines

## Replacement

All functionality consolidated into:
- **`src/features/backgrounds/_cosmic_depth_system.scss`** (850 lines)

## Migration Guide

### For Future Developers

If you need to reference the old system architecture:

1. **Z-Index Management** - Now in unified scale at top of `_cosmic_depth_system.scss`
2. **3D Depth Layers** - Now in "PART 2" with same variable names (no JS changes required)
3. **Cosmic Visual Effects** - Now in "PART 3" with all keyframes and mixins preserved

### CSS Variable Mapping

All CSS variables preserved with same names:

**Z-Index** (expanded unified scale):
- `--z-galactic-backdrop: -1100` (new unified)
- `--z-starfield: -10` (unchanged)
- `--z-content-base: 0` (unchanged)
- etc.

**3D Depth** (unchanged):
- `--sn-depth-layer-0-z: 75px`
- `--sn-depth-layer-1-z: 150px`
- `--sn-depth-layer-2-z: 225px`
- `--sn-depth-layer-3-z: 300px`
- `--sn-depth-right-sidebar-z: 4px`

**Cosmic Effects** (unchanged):
- `--cosmic-depth-layer-1` through `--cosmic-depth-layer-6`
- `--parallax-speed-1` through `--parallax-speed-6`
- `--star-density-near`, `--star-density-mid`, etc.
- `--nebula-scale-small`, `--nebula-scale-medium`, etc.
- All music responsiveness variables

### Selector Mapping

All selectors preserved:

**3D Depth System**:
```scss
// OLD: _perspective_depth_layers.scss
.main-view-container__scroll-node::before  // Layer 0
.main-view-container__scroll-node::after   // Layer 1

// NEW: Same in _cosmic_depth_system.scss (via mixin)
```

**Cosmic Visual Effects**:
```scss
// OLD: _visual_hierarchy.scss
.Root::before                              // Galactic backdrop
.Root::after                               // Cosmic dust
.main-view-container::before               // Far nebula
.main-view-container::after                // Far stars
.main-topBar-container::before             // Mid nebula
.main-topBar-container::after              // Mid stars
.main-navBar-navBar::before                // Near nebula
.main-navBar-navBar::after                 // Near stars
.main-entityHeader-entityHeader::before    // Local stars
.main-entityHeader-entityHeader::after     // Local nebula
.main-nowPlayingBar-nowPlayingBar::before  // Cosmic energy

// NEW: Same in _cosmic_depth_system.scss (via mixin)
```

### JavaScript Integration

No changes required to TypeScript files:
- `DepthLayeredGradientSystem.ts` - Still updates same CSS variables
- `DepthLayeredStrategy.ts` - Still references same selectors
- `AudioVisualController.ts` - Still integrates with same system
- `ColorHarmonyEngine.ts` - Still sets `--sn-oklab-processed-bright-highlight-rgb`

### Import Changes

**Old** (`src/core/_main.scss`):
```scss
@use "../features/system/_z_index_management" as *;
@use "../features/system/_visual_hierarchy" as *;
@use "../features/backgrounds/_perspective_depth_layers" as three-d-depth;

// Later:
@include three-d-depth.apply-3d-depth-layer-variables;
```

**New** (`src/core/_main.scss`):
```scss
@use "../features/backgrounds/_cosmic_depth_system" as cosmic-depth;

// Later:
@include cosmic-depth.apply-cosmic-depth-system;
```

## Consolidation Benefits

1. **Single Source of Truth**: One file for all depth effects
2. **No Pseudo-Element Conflicts**: Clear allocation strategy
3. **Unified Z-Index Scale**: Consistent layering (-1100 to 100)
4. **Maintainability**: Easier to understand and modify
5. **Performance**: Reduced duplication, optimized selectors

## Metrics

**Before Consolidation**:
- Total Lines: 829 lines across 3 files
- Bundle Size: 768K user.css (15,406 lines)
- Build Time: 3.382s

**After Consolidation**:
- Total Lines: 850 lines in 1 file
- Bundle Size: 768K user.css (15,386 lines)
- Build Time: 3.373s
- **Reduction**: 20 lines eliminated from compiled CSS, slightly faster build

## Rollback Instructions

If consolidation needs to be reverted:

1. Restore archived files to original locations:
   ```bash
   mv plans/archive/phase-8.1-depth-consolidation/_visual_hierarchy.scss src/features/system/
   mv plans/archive/phase-8.1-depth-consolidation/_z_index_management.scss src/features/system/
   mv plans/archive/phase-8.1-depth-consolidation/_perspective_depth_layers.scss src/features/backgrounds/
   ```

2. Revert `src/core/_main.scss` changes:
   ```scss
   @use "../features/system/_z_index_management" as *;
   @use "../features/system/_visual_hierarchy" as *;
   @use "../features/backgrounds/_perspective_depth_layers" as three-d-depth;

   @include three-d-depth.apply-3d-depth-layer-variables;
   ```

3. Remove consolidated file:
   ```bash
   rm src/features/backgrounds/_cosmic_depth_system.scss
   ```

4. Rebuild:
   ```bash
   npm run build
   ```

## References

- Tracking Document: `plans/depth-system-consolidation.md`
- New Unified File: `src/features/backgrounds/_cosmic_depth_system.scss`
- Related Commit: Phase 8.1 - Depth System Consolidation

---

**Last Updated**: 2025-09-30
**Archived By**: Claude Code (Phase 8.1 consolidation)
