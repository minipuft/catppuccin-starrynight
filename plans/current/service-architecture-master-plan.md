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
- [ ] Catalogue current service providers (InfrastructureSystemCoordinator, SystemIntegrationCoordinator, VisualEffectsCoordinator) and note which systems they instantiate.
- [ ] Produce a “today” sequence diagram showing how CSS, events, performance metrics, and music data reach a representative visual system.
- [ ] Identify all direct usages of `globalThis`, `year3000System`, and helper singletons (CSS writer, MusicSyncService, timers, etc.).

### Step P1 – Styling & Theming Baseline
- [ ] List critical CSS tokens / variables and which systems update them.
- [ ] Capture screenshots or short recordings for key visual experiences (sidebar shimmer, depth layers, particles) to use later in regression checks.
- [ ] Document current build/typecheck/test commands that guard styling behaviour.

### Step P2 – Service Gap Analysis
- [ ] Compare existing service container APIs with the dependencies recorded in P0.
- [ ] Note mismatches (e.g., systems pulling data not yet exposed via services) and classify them by priority.
- [ ] Agree on any new service interfaces required before implementation begins.

Deliverable for Preparation Track: a short summary added to this plan referencing diagrams, token lists, and gap analysis. Only after this summary is in place do we progress to implementation tracks.

---

## Part A – Visual System Service Adoption (Step-by-Step)

### Phase A0 – Service Foundations ✅ (Complete in repo)
- Expose new services (`PerformanceProfileService`, `MusicSyncLifecycleService`, `ThemingStateService`) via `DefaultServiceFactory`.
- Ensure `SystemIntegrationCoordinator` registers shared instances post-initialisation.
- Inject services into visual systems (`ServiceSystemBridge` updates).

### Phase A1 – Tiered Migration (Existing tracker alignment)
- **Analysis**
  - [ ] For each remaining `BaseVisualSystem` descendant, create a dependency table (inputs, outputs, styling touchpoints).
  - [ ] Review with the team; confirm no hidden styling hooks.
- **Implementation**
  - [ ] Migrate Tier 1 → Tier 3 systems to `ServiceVisualSystemBase` (per tracker).
  - [ ] Replace `_performSystemSpecific*` with `performVisualSystem*` patterns.
  - [ ] Implement `performSystemHealthCheck()`.
- **Verification**
  - [ ] Run unit/integration tests cited in the tracker for each system.
  - [ ] Update tracker entry noting styling checks.

### Phase A2 – Service Consumption Audit *(NEW enforcement)*
- **Analysis**
  - [ ] Enumerate all places each system still uses globals/singletons.
  - [ ] Confirm the corresponding service APIs are ready (from Preparation P2).
- **Implementation**
  - [ ] Override `injectServices`, store references, and replace direct calls.
  - [ ] Swap manual listeners for service-provided equivalents.
- **Verification**
  - [ ] Grep/TSLint to ensure no leftover forbidden references.
  - [ ] Re-run styling regression artefacts captured in P1 for affected systems.

### Phase A3 – Styling & Behaviour Verification
- Run targeted visual regression tests (sidebar, shimmer, particle systems, background gradients).
- Confirm CSS tokens (`--sn-*`) unchanged via diff of compiled CSS.
- Document outcomes in `plans/current/base-class-migration-tracker.md`.

### Phase A4 – Cleanup & Base Class Removal
- Delete `BaseVisualSystem.ts` after all dependants migrate.
- Remove legacy helpers superseded by services.
- Update docs (architecture overview, API reference, legacy archive).

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
- [ ] All visual systems consume dependencies exclusively through services (`injectServices`).
- [ ] Infrastructure + visual coordinators free of `globalThis`/`year3000System` fallbacks.
- [ ] Styling/theming verified equivalent (CSS token diff & visual smoke tests).
- [ ] BaseVisualSystem removed, legacy helpers archived.
- [ ] PerformanceCoordinator facade fully integrated; SimplePerformanceCoordinator deleted.
- [ ] Documentation refreshed (architecture overview, API reference, release notes).

---

## Reporting & Tracking
- **Base-class progress**: continue updating `plans/current/base-class-migration-tracker.md` for Tier status.
- **Performance consolidation**: maintain `plans/current/performance-consolidation-progress.md` for infrastructure milestones.
- **Master plan**: update this document after each phase to reflect status, blockers, and validation results.
