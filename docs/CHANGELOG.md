## vNext – Sidebar Dimensional Nexus Consolidation (17-Jun-2025)

### Added

- `src/sidebar/_sidebar_dimensional_nexus.scss` – new enhancement layer for Dimensional Rift & advanced sidebar effects.

### Changed

- Consolidated duplicated variables into `_sidebar_background_effects.scss`.
- Removed import of deprecated `src/systems/_sn_dimensional_nexus.scss` from build.
- Updated import order in `src/core/_main.scss` to ensure background → interactive → nexus hierarchy.

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
