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
