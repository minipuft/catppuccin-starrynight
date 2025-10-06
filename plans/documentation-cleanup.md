# Documentation Cleanup Plan

_Last updated: 2025-10-06 09:28 UTC_

## Goals
- Replace outdated, contradictory documentation with a concise, accurate developer guide set.
- Remove or archive irrelevant materials before rewriting core references.
- Track cleanup progress transparently for future contributors.

## Quick Removal Candidates (pending confirmation)
These files reference code paths that no longer exist and offer little reusable content. Removing or archiving them would immediately reduce noise:

| File | Missing References (count) | Notes |
| --- | --- | --- |
| `docs/ADVANCED_THEME_SYSTEM_GUIDE.md` | 1 | Points to `src-js/core/lifecycle/AdvancedThemeSystem.ts`, replaced by consolidated lifecycle coordinator. |
| `docs/API_REFERENCE.md` | 5 | Documents legacy facades (`SystemCoordinator`, `VisualSystemFacade`, `PerformanceAnalyzer`) that were renamed or removed. |
| `docs/AUDIO_INTEGRATION_GUIDE.md` | 2 | Mentions `FluxSpectralAnalyzer` and organic consciousness modules no longer in repo. |
| `docs/BACKGROUND_SYSTEMS_GUIDE.md` | 4 | Describes background systems removed during WebGL consolidation. |
| `docs/DYNAMIC_VISUAL_EFFECTS_GUIDE.md` | 3 | Focuses on effect coordinators and managers that no longer exist. |
| `docs/DragAndDrop/DRAG_AND_DROP_OVERVIEW.md` | 3 | Refers to `src-js/effects/*` modules superseded by `ui/interactions/DragPreviewManager`. |
| `docs/DragAndDrop/ENHANCED_DRAG_PREVIEW.md` | 1 | Same obsolete module path as above. |
| `docs/DragAndDrop/QUICK_ADD_RADIAL_MENU.md` | 1 | Targets deprecated quick-add radial menu implementation. |
| `docs/FACADE_PATTERN_GUIDE.md` | 3 | Documents `SystemCoordinator`/facade classes that were deleted or renamed. |
| `docs/PERFORMANCE_ARCHITECTURE_GUIDE.md` | 4 | Covers removed adaptive performance modules. |
| `docs/VISUAL_SYSTEMS_REFERENCE.md` | 23 | Almost entirely references the retired "organic consciousness" visual stack. |
| `docs/core_systems/SPOTIFY_DOM_SELECTORS.md` | 1 | References `src-js/utils/domCache.ts`, removed during DOM watcher rewrite. |
| `docs/development/AI_FRAMEWORK.md` | 1 | Placeholder referencing `src-js/systems/visual/ComponentName.ts` (never existed). |
| `docs/development/PROJECT_RULES.md` | 1 | Points to `src-js/core/Year3000System.ts`, superseded by `ThemeLifecycleCoordinator`. |

## Consolidation Targets (active)
These documents still hold relevant knowledge but overlap heavily. Merge or restructure them so the updated docs match the current architecture and terminology.

| Target | Candidate Docs | Consolidation Intent |
| --- | --- | --- |
| Architecture & Lifecycle | `docs/MODERNIZED_SYSTEMS_GUIDE.md`, `docs/VISUAL_EFFECTS_COORDINATION.md`, `docs/MODULE_BOUNDARIES.md`, `docs/PHASE_4_ARCHITECTURAL_BOUNDARIES.md` | Fold the accurate lifecycle, visual coordination, and module boundary material into a single architecture reference aligned with `src-js/theme.entry.ts` and `core/lifecycle` updates. |
| Build & Delivery | `docs/BUILD_SYSTEM_GUIDE.md`, `docs/CI_CD/CI_CD_ARCHITECTURE.md`, `docs/CI_CD/CI_CD_PIPELINE.md`, `docs/README_CI_CD.md`, `docs/TROUBLESHOOTING_GUIDE.md` | Consolidate into one build/deploy playbook that covers npm scripts, CI, installation scripts, and failure recovery steps. |
| Color Processing Systems | `docs/OKLAB_COLOR_PROCESSING_GUIDE.md`, `docs/OKLAB_COLOR_MIGRATION_GUIDE.md`, `docs/OKLAB_VARIABLE_NAMING_CONVENTION.md` | Combine the OKLAB theory, migration notes, and naming rules into a single color processing reference aligned with `src-js/audio/ColorHarmonyEngine.ts` and `utils/color/*`. |
| Styling & Token Governance | `docs/CSS_OPTIMIZATION_GUIDE.md`, `docs/CSS_OPTIMIZATION_SUMMARY.md`, `docs/token-governance.md`, `docs/token-system-architecture.md`, `docs/token-usage-guide.md`, `docs/LEGACY_TOKEN_MIGRATION.md` | Produce a single styling playbook that explains token governance, SCSS layout, and modern optimization steps while retiring duplicate summaries. |
| Developer Onboarding & Standards | `docs/CONTRIBUTING_GUIDE.md`, `docs/DEVELOPER_MIGRATION_GUIDE.md`, `docs/development/PROJECT_RULES.md`, `docs/development/DIRECTORY_STRUCTURE.md` | Replace the metaphoric onboarding material with a streamlined contributor guide that references the new `AGENTS` stack and current repo layout. |
| Settings & Configuration | `docs/SETTINGS_MIGRATION_GUIDE.md`, `docs/DEPENDENCY_ANALYSIS.md`, `docs/MASTER_ARCHITECTURE_OVERVIEW.md` (retain salvaged settings sections) | Consolidate user settings, dependency switches, and configuration contracts into a current settings/configuration reference. |

## Next Actions
1. Confirm with maintainers whether to delete or archive the quick-removal candidates listed above.
2. Inventory remaining docs for partial relevance (e.g., CI/CD, troubleshooting) and tag for rewrite vs. keep.
3. Draft the new documentation structure (core guide, reference, operational notes) leveraging updated `AGENTS` files as the backbone.
4. Schedule rewrite sprints, starting with a modern architecture overview and API reference.

## Notes
- Missing-reference counts were generated by scanning for `src-js/*.ts` paths that no longer exist in the repository.
- If any listed document contains snippets worth preserving, capture them before removal.
