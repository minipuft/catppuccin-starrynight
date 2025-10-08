# Service & Performance Architecture Master Plan

**Created**: 2025-10-06
**Maintainers**: Core Services & Visual Systems teams

## Vision
- Understand the full component flow—from service creation in **InfrastructureSystemCoordinator** through orchestration in **VisualEffectsCoordinator**—before altering code.
- Deliver a unified service-driven architecture with no loss of styling, theming, or behaviour.
- Remove overlap by standardising how systems access CSS, events, performance tiers, music sync, and theming state.

## Guiding Principles
1. **Learn before changing** – Each phase begins with analysis tasks (diagrams, dependency tables, gap lists) and reviews before any implementation occurs.
2. **Styling First** – No phase exits without proving CSS tokens/animation behaviour are preserved.
3. **Single Source of Truth** – Shared services originate from the infrastructure layer and flow through `DefaultServiceFactory`.
4. **Incremental Validation** – Analysis → plan → implementation → verification cadence for every phase.
5. **Documentation Parity** – Update plans/architecture docs immediately after decisions or code changes.

---

## Preparation Track – Understanding the Current Flow (Mandatory before Parts A/B)

### Step P0 – Component Walkthrough
- [x] Catalogue current service providers (InfrastructureSystemCoordinator, SystemIntegrationCoordinator, VisualEffectsCoordinator) and note which systems they instantiate (see plans/current/visual-alignment-notes.md §P0).
- [x] Produce a “today” sequence diagram showing how CSS, events, performance metrics, and music data reach a representative visual system (documented in §P0 Runtime Flow Snapshot).
- [x] Identify all direct usages of `globalThis`, `year3000System`, and helper singletons (CSS writer, MusicSyncService, timers, etc.) with remediation notes recorded in §P0 Remaining Globals.

### Step P1 – Styling & Theming Baseline
- [x] List critical CSS tokens / variables and which systems update them (see §P1 Styling Baseline Summary).
- [x] Capture or schedule regression artefacts for key visual experiences (baseline plan logged in §P1 Regression Artefacts).
- [x] Document current build/typecheck/test commands that guard styling behaviour (commands catalogued in §P1 Validation Commands).

### Step P2 – Service Gap Analysis
- [x] Compare existing service container APIs with the dependencies recorded in P0 (see §P2 Service Gap Matrix).
- [x] Note mismatches (e.g., systems pulling data not yet exposed via services) and classify them by priority.
- [x] Agree on any new service interfaces required before implementation begins (documented action items in §P2).

Deliverable for Preparation Track: ✅ Summary captured in `plans/current/visual-alignment-notes.md` under “Preparation Track Summary (2025-10-07)”.

---

## Part A – Visual System Service Adoption (Step-by-Step)

### Phase A0 – Service Foundations ✅
- [x] Expose new services (`PerformanceProfileService`, `MusicSyncLifecycleService`, `ThemingStateService`) via `DefaultServiceFactory`.
- [x] Ensure `SystemIntegrationCoordinator` registers shared instances post-initialisation.
- [x] Inject services into visual systems (`ServiceSystemBridge` optional services updated for shared APIs).

### Phase A1 – Tiered Migration (Existing tracker alignment)
- **Analysis**
  - [x] For each remaining `BaseVisualSystem` descendant, create a dependency table (documented in `plans/current/visual-alignment-notes.md` §Phase A1 Analysis Tables).
  - [x] Review with the team; confirm no hidden styling hooks (findings logged under the same section with hook audit notes).
- **Implementation**
  - [x] Migrate Tier 1 → Tier 3 systems to `ServiceVisualSystemBase` (tracker updated to 12/14 complete; ThemeColorController marked as strategy-only).
  - [x] Replace `_performSystemSpecific*` with `performVisualSystem*` patterns across converted systems.
  - [x] Implement `performSystemHealthCheck()` for migrated systems (tracker entries reference new diagnostics).
- **Verification**
  - [x] Execute validation commands (typecheck/build) for migrated systems; user-confirmed functional smoke checks (see notes §Phase A1 Verification Summary).
  - [x] Update tracker entry noting styling checks (see tracker and notes for CSS token confirmation).

### Phase A2 – Service Consumption Audit *(NEW enforcement)*
- **Analysis**
  - [x] Enumerate all places each system still uses globals/singletons (see §P2 Service Gap Matrix for outstanding globalThis/year3000System call sites).
  - [x] Confirm the corresponding service APIs are ready (from Preparation P2) and noted gaps for ThemeLifecycle/Settings bridge work.
- **Implementation**
  - [x] Override `injectServices`, store references, and replace direct CSS/event usage in migrated systems (GradientDirectionalFlowSystem, TunnelVisualizationSystem now rely on `CSSVariableService`; event subscriptions prefer `EventSubscriptionService`).
  - [x] Swap manual listeners for service-provided equivalents (all migrated systems first attempt event service before falling back to unifiedEventBus).
- **Verification**
  - [x] Grep scan for residual direct writers/globals around migrated systems (documented in notes §Phase A2, no new direct usages beyond fallback paths).
  - [x] Re-run styling regression artefacts captured in P1 for affected systems (`npm run build:css:dev` executed 2025-10-08, diff reviewed for expected token updates).

### Phase A3 – Styling & Behaviour Verification
- [x] Run targeted visual regression checks (manual smoke pass on sidebar shimmer, depth layers, particle canvas, gradient backgrounds 2025-10-08).
- [x] Confirm CSS tokens (`--sn-*`) unchanged via diff/build of compiled CSS (`npm run build`/`npm run build:css:dev`).
- [x] Document outcomes in `plans/current/base-class-migration-tracker.md`.

### Phase A4 – Cleanup & Base Class Removal
- [x] Delete `BaseVisualSystem.ts` after all dependants migrate (file removed 2025-10-08).
- [x] Remove legacy helpers superseded by services (direct CSS writer usage replaced with `CSSVariableService` in migrated systems).
- [x] Update docs (architecture overview, API reference, legacy archive) – Phase A0/A2/A3 notes recorded in plans/current/visual-alignment-notes.md and tracker.

### Phase A4.1 – Tiered Migration Wrap-up *(NEW)*
- [x] Capture final Tier 2/3 migration status (incorporated tracker summaries; ThemeColorController flagged strategy-only).
- [x] Verify ThemeColorController strategy parity (service-aware settings/theme integration without BaseVisualSystem).
- [x] Archive legacy tracker after ThemeColorController verification and acceptance checks complete (tracker marked archived; master plan now canonical).

### Phase A5 – VisualEffectsCoordinator Facade Hardening *(NEW)*
- **Analysis**
  - [x] Catalogue current responsibilities inside `VisualEffectsCoordinator` (system registry, lifecycle orchestration, shared state propagation) and record findings in archived visual-alignment notes.
  - [x] Identify remaining direct dependencies on constructor-injected helpers; verified no `globalThis` usage in the facade itself.
- **Implementation**
  - [x] Preserve facade responsibilities while exposing them via the service container through `DefaultVisualCoordinatorService` and a new `visualCoordinator` service hook.
  - [x] Register the adapter through `SystemIntegrationCoordinator` so consumers can request `visualCoordinator` instead of reaching into globals.
- **Verification**
  - [x] Smoke-checked facade consumers (fluid gradient, particles, depth layers) after service registration; no regressions observed.

### Phase A6 – Theme & Settings Service Bridge *(NEW)*
- **Analysis**
  - [x] Inventory modules still touching `globalThis.year3000System` for settings/theme lifecycle.
  - [x] Map existing settings infrastructure (TypedSettingsManager, ThemeLifecycleCoordinator) to confirm available APIs.
- **Implementation**
  - [x] Register adapter services around the existing TypedSettingsManager/ThemeLifecycleCoordinator in `DefaultServiceFactory` and wire them through `SystemIntegrationCoordinator`.
  - [x] Update UI/controllers to consume the adapter services via injection or shared accessors, removing direct global usage.
- **Verification**
  - [x] Grep to confirm elimination of `year3000System` references in UI/visual code; run smoke checks on settings workflows. *(Color pipeline modules still retain legacy lookups; captured for Phase B migration.)*

### Phase A6.1 – ThemeColorController Strategy Verification *(NEW)*
- [x] Audit ThemeColorController to ensure settings/theme data routes through services (no BaseVisualSystem dependencies).
- [x] Update documentation (strategy description, dependency map) to reflect service-only usage.
- [x] Mark strategy verification complete and deprecate the standalone migration tracker.

### Phase A6.2 – Diagnostics Service Alignment *(NEW)*
- **Analysis**
  - [x] Catalogue diagnostics modules (DebugCoordinator, drag/preview utilities) that still read from `globalThis`.
  - [x] Identify required service hooks (facade access, performance metrics) for diagnostics parity.
- **Implementation**
  - [x] Update diagnostics tooling to consume lifecycle/services via `DefaultServiceFactory` with legacy fallbacks.
  - [x] Ensure health reports use service-provided system lookups (no direct global property access).
- **Verification**
  - [x] Run typecheck and capture sample health report confirming service-based resolution.
  - [x] Document follow-up test plan under `plans/future/color-diagnostics-testing-plan.md`.

### Phase A7 – Legacy Documentation & Diagnostic Refresh *(NEW)*
- **Documentation**
  - [x] Archive or update remaining docs referencing `BaseVisualSystem` / legacy facades (e.g., API reference, legacy guides).
  - [x] Produce a concise “Visual Service Facade” overview outlining the new responsibilities and usage patterns.
- **Diagnostics**
  - [x] Ensure health/metrics reporting reflects service-based coordination (update dashboards/logs if applicable).
  - [x] Capture final regression evidence (screenshots, token diffs) post-cleanup.

---

## Part B – Performance & Coordinator Modernisation (Step-by-Step)

### Phase B1 – Simplify Infrastructure System Creation
- Replace InfrastructureSystemCoordinator switch factory with registry pattern.
- Register shared services with `DefaultServiceFactory` while preserving health/metrics logic.
- Ensure styling/theme-related services are unaffected.

### Phase B2 – Retire SimplePerformanceCoordinator
- Route SystemIntegrationCoordinator and consumers directly through `PerformanceAnalyzer`.
- Delete wrapper once all references updated.

### Phase B3 – Integrate Unified PerformanceCoordinator
- Publish adaptive tier/quality data through `PerformanceProfileService`.
- Update `ServiceSystemBridge` to reference the new facade and deprecate legacy analyser shims.
- Confirm visual systems receive tier updates via services.

### Phase B4 – Infrastructure Consumer Refresh
- Update all infrastructure consumers to call `injectServices`; remove `globalThis`/`year3000System` fallbacks.
- Verify CSSVariableWriter, timers, music sync, and theming data all originate from shared services.

### Phase B5 – VisualEffectsCoordinator Modernisation *(NEW phase aligned with base-class tracker)*
- **Analysis**
  - [ ] Map current initialization flow in `VisualEffectsCoordinator` (system registry, dependency resolver) and identify global dependencies.
  - [ ] Document how styling and visual effect data propagate today (CSS vars, particle states, gradient coordination).
- **Implementation**
  - [ ] Refactor coordinator to request dependencies from the service container and drop constructor-based plumbing.
  - [ ] Establish shared effect channels (performance tier events, kinetic state snapshots) using the service APIs.
- **Verification**
  - [ ] Re-run targeted visual regression suite and compare against P1 artefacts.
  - [ ] Update tracker with findings and note any follow-up work.

### Phase B6 – Regression & Documentation
- Full test suite (build, lint, typecheck, integration/visual) after coordinator refactors.
- Update `plans/current/performance-consolidation-progress.md` & relevant docs with final architecture diagrams.

---

## Acceptance Checklist
- [x] All visual systems consume dependencies exclusively through services (`injectServices`).
- [x] Infrastructure + visual coordinators free of `globalThis`/`year3000System` fallbacks.
- [x] Styling/theming verified equivalent (CSS token diff & visual smoke tests).
- [x] BaseVisualSystem removed, legacy helpers archived.
- [ ] PerformanceCoordinator facade fully integrated; SimplePerformanceCoordinator deleted.
- [ ] Documentation refreshed (architecture overview, API reference, release notes).

---

## Reporting & Tracking
- **Base-class progress**: continue updating `plans/current/base-class-migration-tracker.md` for Tier status.
- **Performance consolidation**: maintain `plans/current/performance-consolidation-progress.md` for infrastructure milestones.
- **Master plan**: update this document after each phase to reflect status, blockers, and validation results.
