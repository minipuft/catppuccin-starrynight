# Documentation Cleanup Plan

_Last updated: 2025-10-06 09:28 UTC_

## Goals
- Replace outdated, contradictory documentation with a concise, accurate developer guide set.
- Remove or archive irrelevant materials before rewriting core references.
- Track cleanup progress transparently for future contributors.

## Verification Principles
- Treat every existing rule or document claim as suspect until confirmed against current code and build outputs.
- Update or discard any instruction that references modules, pipelines, or behaviors no longer present in `src-js/`, `src/`, or the install scripts.
- Record verification steps when promoting guidance into the consolidated docs so contributors know the source of truth.

## Quick Removal Candidates (pending confirmation)
## Removal Candidate Audit (2025-10-06)
| Document | Current Observation | Action for End State |
| --- | --- | --- |
| `docs/ADVANCED_THEME_SYSTEM_GUIDE.md` | Describes obsolete SystemCoordinator/AdvancedThemeSystem but contains reusable notes on progressive init and performance gating. | Fold relevant sections into new `docs/ARCHITECTURE.md`; retire file after rewrite. |
| `docs/API_REFERENCE.md` | Large interface catalog tied to removed facades and outdated file paths. | Replace with targeted API notes inside new architecture/feature docs; retire file. |
| `docs/AUDIO_INTEGRATION_GUIDE.md` | Mix of current `MusicSyncService` details and dead modules (`FluxSpectralAnalyzer`). | Extract live portions for `docs/COLOR_AND_AUDIO.md`; drop deprecated module sections. |
| `docs/BACKGROUND_SYSTEMS_GUIDE.md` | Background layering overview mostly accurate but references renamed participants. | Merge into architecture doc's visual systems chapter with updated names. |
| `docs/DYNAMIC_VISUAL_EFFECTS_GUIDE.md` | Documents visual coordination but points to old paths. | Consolidate into new architecture guide; refresh code references. |
| `docs/DragAndDrop/DRAG_AND_DROP_OVERVIEW.md` | Interaction design still valid; implementation moved to `ui/interactions/*`. | Rewrite as part of a modern interaction/UX appendix; keep diagrams. |
| `docs/DragAndDrop/ENHANCED_DRAG_PREVIEW.md` | API references legacy module path. | Update content and move under the same interaction appendix. |
| `docs/DragAndDrop/QUICK_ADD_RADIAL_MENU.md` | Feature still exists with new module path. | Retain content, rewrite to reference `src-js/ui/interactions/QuickAddRadialMenu.ts`. |
| `docs/FACADE_PATTERN_GUIDE.md` | Architecture centered on removed facades. | No longer representative; drop after extracting any historical notes if needed. |
| `docs/PERFORMANCE_ARCHITECTURE_GUIDE.md` | Performance budgets useful but tied to old coordinators. | Lift budgets/perf philosophy into architecture doc; retire file. |
| `docs/VISUAL_SYSTEMS_REFERENCE.md` | Nearly all systems removed/renamed ("organic consciousness"). | Retire; re-document current systems from scratch. |
| `docs/core_systems/SPOTIFY_DOM_SELECTORS.md` | Module still active but helper references outdated. | Keep as supporting reference; refresh to match `src-js/utils/dom/domCache` and current selector usage. |
| `docs/development/AI_FRAMEWORK.md` | Superseded by new AGENTS rule stack. | Retire after pulling any useful onboarding tips into `docs/CONTRIBUTING.md`. |
| `docs/development/PROJECT_RULES.md` | Duplicates obsolete rule set with metaphoric terms. | Retire; rely on AGENTS + new contributor guide. |

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

## Target End State
When consolidation is complete, the rules and documentation should look like this structured stack. Phase 1 (legacy archive) is complete; Phase 2 begins rewriting the core guides.

### Global Rules Layer
- `AGENTS.md` - Quick start, safe coding defaults, and links into deeper layers.
- `AGENTS.domain.md` - Verified architecture constraints, technology policies, and module responsibilities referenced directly from the current code.
- `AGENTS.local.md` - Environment, build, and Spicetify deployment notes, kept in sync with install scripts and generated artifacts.

### Core Documentation
- `docs/ARCHITECTURE.md` (new, draft scaffold created) - Single source for lifecycle, visual coordination, module boundaries, and settings integrations.
- `docs/BUILD_AND_DEPLOY.md` (planned) - Build pipeline, CI/CD flow, troubleshooting, and release packaging.
- `docs/COLOR_AND_AUDIO.md` (planned) - OKLAB pipeline, color harmony, audio integration, and tuning parameters.
- `docs/STYLING_AND_TOKENS.md` (planned) - SCSS layout, token governance, optimization practices, and migration history.
- `docs/CONTRIBUTING.md` (rewrite) - Modern onboarding that references the `AGENTS` guides, directory map, and coding standards.
- `docs/SETTINGS_AND_CONFIG.md` (planned) - User-facing settings, config files, dependency switches, and debugging aids.

### Supporting References
- Keep focused sub-guides only when they add depth (e.g., `docs/spotify/` for platform quirks) and ensure each references the corresponding source files.
- Archive or delete superseded docs so the `/docs` directory mirrors the active architecture.

## Phase 1: Legacy Archive (in progress)
- [x] Create `docs/legacy/` archive directory.
- [x] Move outdated architecture and systems docs into the archive (`ADVANCED_THEME_SYSTEM_GUIDE.md`, `API_REFERENCE.md`, `BACKGROUND_SYSTEMS_GUIDE.md`, etc.).
- [x] Relocate Drag-and-Drop guides to the archive pending rewrite.
- [x] Archive legacy contributor/rule guides (`docs/development/AI_FRAMEWORK.md`, `docs/development/PROJECT_RULES.md`).
- [x] Note any doc moved so we can extract relevant sections into new consolidated guides.

## Phase 2: Architecture Rewrite (active)
- [x] Draft `docs/ARCHITECTURE.md` scaffold aligned with current modules.
- [x] Pull verified initialization flow details from `ThemeLifecycleCoordinator` and `SystemIntegrationCoordinator`.
- [x] Document music/color pipeline specifics sourced from `MusicSyncService` and `ColorHarmonyEngine`.
- [x] Outline visual system responsibilities and registration patterns using `VisualEffectsCoordinator` and strategy modules.
- [x] Add performance, settings, and event flow references tied to current code.
- [x] Capture verification notes (files touched, commands run) for each update.
  - 2025-10-06: Reviewed `theme.entry.ts`, `core/lifecycle/ThemeLifecycleCoordinator.ts`, `core/integration/SystemIntegrationCoordinator.ts`, `visual/effects/VisualEffectsCoordinator.ts`, `audio/MusicSyncService.ts`, `audio/ColorHarmonyEngine.ts` while drafting `docs/ARCHITECTURE.md`.

## Phase 3: Build & Deploy Rewrite (active)
- [x] Create `docs/BUILD_AND_DEPLOY.md` scaffold with current npm scripts and artifact outputs.
- [x] Cross-check deployment scripts (`install.sh`, `install-hybrid.sh`, `install.ps1`) and document initial behavior assumptions (artifact copy, rebuild, backups).
- [x] Summarize CI workflow commands from `.github/workflows/*.yml` and align with the doc.
- [x] Add troubleshooting cases sourced from `logs/` and `runtime-state/` usage.
- [x] Record verification notes when sections are updated.
  - 2025-10-06: Reviewed `MusicSyncService`, `ColorHarmonyEngine`, `OKLABColorProcessor`, `EmotionalTemperatureMapper`, `SpicetifyColorBridge` when drafting `docs/COLOR_AND_AUDIO.md`.
  - 2025-10-06: Reviewed `install.sh`, `install-hybrid.sh`, `install.ps1`, and `.github/workflows/ci.yml`/`comprehensive-testing.yml`/`performance-monitoring.yml` for `docs/BUILD_AND_DEPLOY.md`.

## Phase 4: Color & Styling Consolidation (active)
- [x] Rewrite `docs/COLOR_AND_AUDIO.md` to absorb relevant content from `OKLAB_COLOR_PROCESSING_GUIDE.md`, `OKLAB_COLOR_MIGRATION_GUIDE.md`, and `OKLAB_VARIABLE_NAMING_CONVENTION.md`.
- [x] Create `docs/STYLING_AND_TOKENS.md` merging token governance docs (`token-governance.md`, `token-system-architecture.md`, `token-usage-guide.md`, `LEGACY_TOKEN_MIGRATION.md`).
- [x] Update `docs/ARCHITECTURE.md` and new guides to cross-reference the consolidated color/styling sections.
- [x] Remove or archive legacy OKLAB/token docs once content is absorbed.
- [x] Capture verification notes for each rewritten section.
  - 2025-10-06: Reviewed token governance/system/usage docs and `src/design-tokens/tokens.scss` while drafting `docs/STYLING_AND_TOKENS.md`; moved legacy docs to `docs/legacy/`.

## Next Actions
1. Confirm with maintainers whether to delete or archive the quick-removal candidates listed above.
2. Inventory remaining docs for partial relevance (e.g., CI/CD, troubleshooting) and tag for rewrite vs. keep.
3. Draft the new documentation structure (core guide, reference, operational notes) leveraging updated `AGENTS` files as the backbone.
4. Schedule rewrite sprints, starting with a modern architecture overview and API reference.

## Notes
- Missing-reference counts were generated by scanning for `src-js/*.ts` paths that no longer exist in the repository.
- If any listed document contains snippets worth preserving, capture them before removal.
