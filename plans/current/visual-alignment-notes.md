# Visual System Alignment Notes

## Context
- Goal: retire `BaseVisualSystem` inheritance without losing theming, music sync, or performance heuristics.
- Constraints: Service layer (`SystemServices`, `CoreServiceProviders`, `ServiceVisualSystemBase`) must satisfy all legacy guarantees before systems switch bases.
- Scope: Background visual stack (DepthLayered, FluidGradient, WebGL renderer, UnifiedParticleSystem, DynamicGradientStrategy) still depends on the legacy base.

## Findings
- `ThemeLifecycleCoordinator` currently stubs `_applyPerformanceProfile` and `_refreshConditionalSystems` (`src-js/core/lifecycle/ThemeLifecycleCoordinator.ts:3245`), so global profiling must live elsewhere.
- `SystemIntegrationCoordinator` provisions shared dependencies (performance coordinator, music sync, CSS writer) but exposes no performance-profile API.
- `VisualEffectsCoordinator` instantiates background systems with only service dependencies; constructor argument mismatch prevents `config`/`utils`/`musicSyncService` from reaching those systems (`src-js/visual/effects/VisualEffectsCoordinator.ts:1896`).
- Kinetic and gradient CSS variables remain active in SCSS (`src/core/_interaction_mixins.scss`, `src/sidebar/_sidebar_interactive.scss`), so any migration must keep `getCosmicState`/CSS batching behaviour intact.
- UI controllers (Sidebar, Animation, etc.) already run on `ServiceVisualSystemBase`; parity gaps exist only in background systems.

## Risks
- Migrating before parity drops auto performance tiering, music-driven animation, and canvas styling.
- Coordinator lacks hooks to replace BaseVisualSystem's music subscription and cosmic-state helpers.
- Reports mark kinetic variables as unused, risking accidental cleanup if live usage is not documented.

## Strategic Direction
1. **Performance Profile Service**: implement in `SystemIntegrationCoordinator` (or a dedicated module) backed by `SimplePerformanceCoordinator`; expose via service container so visual systems can request current tier data.
2. **Constructor Adapter**: update `VisualEffectsCoordinator` to supply `(config, ThemeUtilities, performanceCoordinator, musicSyncService, year3000System)` to legacy systems until they adopt service injection.
3. **Music/Cosmic Bridges**: add thin wrappers in the service layer for music sync lifecycle and kinetic CSS reads to replace BaseVisualSystem helpers.
4. **Pilot Migration**: once bridges exist, migrate `DepthLayeredGradientSystem` to `ServiceVisualSystemBase` to validate the approach, followed by the remaining background systems.

## Immediate Tasks
- [x] Design performance profile access API and capture decisions here.
- [x] Draft dependency map for each BaseVisualSystem descendant.
- [x] Define service interfaces for MusicSync auto-registration and kinetic CSS state retrieval.
- [x] Update VisualEffectsCoordinator constructor wiring plan.

## Responsibility Map
| Responsibility | Current Owner | Gap | Proposed Destination |
| -------------- | ------------- | --- | -------------------- |
| Performance tier selection (`_applyPerformanceProfile`) | `BaseVisualSystem` + legacy config | ThemeLifecycleCoordinator stubbed | `SystemIntegrationCoordinator` exposing `PerformanceProfileService` backed by `SimplePerformanceCoordinator` |
| MusicSync auto subscription | `BaseVisualSystem.initialize()` | Not available in service layer | New `MusicSyncLifecycleService` injected via `ServiceContainer` |
| Cosmic/Kinetic CSS reads (`getCosmicState`) | `BaseVisualSystem` DOM queries | No shared accessor | Extend `CSSVariableService` with helpers to batch-read kinetic tokens |
| Canvas lifecycle helpers | `BaseVisualSystem` direct DOM/WebGL management | Partially in `ServiceVisualSystemBase` | Keep in `CanvasManagementService`; bolt on theming helpers |
| Device capability detection | Manual `DeviceCapabilityDetector` per system | Duplicated work | Share `EnhancedDeviceTierDetector` via `SystemIntegrationCoordinator` or service adapter |
| Theming data propagation | Per-system CSS setProperty | Works but undocumented | Document tokens; ensure new services continue batching updates |

### Notes
- Add new service interfaces in `SystemServices.ts` so both UI and background systems can opt-in without reintroducing inheritance.
- Once services exist, update `VisualEffectsCoordinator.resolveDependencies` to request them explicitly.

## Phased Migration Plan

### Phase 0 – Service Foundations
1. Implement `PerformanceProfileService` inside `SystemIntegrationCoordinator`; expose through `ServiceContainer` and offer subscription hooks for systems.
2. Extend `SystemServices.ts` with `MusicSyncLifecycleService` (subscribe/unsubscribe helpers) and `ThemingStateService` (read-only kinetic/cosmic state access).
3. Update `DefaultServiceFactory` to create the new services using shared coordinator instances.
4. Adjust `VisualEffectsCoordinator.resolveDependencies` to pass the new services into systems.

#### Phase 0 Progress
- ✅ Added concrete service implementations (`DefaultPerformanceProfileService`, `DefaultMusicSyncLifecycleService`, `DefaultThemingStateService`) and exposed them via the service container.
- ✅ Registered overrides in `DefaultServiceFactory` wired to `SystemIntegrationCoordinator` shared dependencies, keeping fallbacks for legacy pathways.
- ✅ Bridged MusicSync lifecycle and kinetic CSS state consumption through the new services, ensuring existing systems remain functional.
- ✅ Updated `VisualEffectsCoordinator` to inject the refreshed service container into every system at creation time.

### Phase 1 – Constructor Alignment
1. Introduce adapter logic in `VisualEffectsCoordinator` that normalizes arguments for legacy constructors until migrated.
2. Document expected constructor signatures per system in this note and add development-time assertions.
3. Once services are injected, gradually remove direct `config`/`utils` arguments in favour of `injectServices`.

#### Phase 1 Progress
- ✅ Captured constructor signatures and runtime dependencies for all remaining `BaseVisualSystem` descendants (see dependency map above).
- ✅ Added a base-argument adapter in `VisualEffectsCoordinator` so every system receives `(config, utils, performanceCoordinator, musicSyncService, year3000System)` before additional dependencies.

### Phase 2 – Pilot Migration (DepthLayeredGradientSystem)
1. Switch the class to extend `ServiceVisualSystemBase`.
2. Replace BaseVisualSystem calls with service equivalents (performance tier, music sync, kinetic CSS).
3. Validate via `npm run build`, `npm run validate`, and targeted visual smoke tests.
4. Capture lessons learned in this note before moving on.

#### Phase 2 Progress
- ✅ `DepthLayeredGradientSystem` now extends `ServiceVisualSystemBase`, pulls services through `injectServices`, and renames lifecycle hooks to the composition pattern (`src-js/visual/backgrounds/DepthLayeredGradientSystem.ts`).
- ✅ Replaced direct `performanceMonitor` usage with the injected analyzer service and ensured cleanup unsubscribes from the new MusicSync lifecycle service.
- ℹ️ Still reading granular music state from the legacy `musicSyncService` pending a richer snapshot from `MusicSyncLifecycleService`; documented for future follow-up.

### Phase 3 – Background Stack Rollout
- Repeat Phase 2 steps for `FluidGradientBackgroundSystem`, `WebGLRenderer`, `UnifiedParticleSystem`, and `DynamicGradientStrategy`.
- After each migration, remove legacy-only helpers and update documentation.

### Phase 4 – Cleanup
- Delete `BaseVisualSystem` once all clients migrate.
- Retire obsolete helper functions and clean up docs under `docs/legacy/`.
- Remove stubs from `ThemeLifecycleCoordinator` or rewire them to call the new services.

### Tracking TODOs
- [x] Add system-specific dependency table to this note.
- [x] Confirm SCSS token inventory and reflect in documentation.

### Phase A1 Dependency Map (2025-10-07)
#### GradientDirectionalFlowSystem
- **Inputs**: `MusicSyncService`, `ColorHarmonyEngine`, `SimplePerformanceCoordinator`, `ThemeUtilities`, unified event bus, CSSVariableWriter bridge.
- **Outputs**: Beat/spectral flow vectors, flow state caches, throttle timers.
- **Styling Touchpoints**: Updates `--sn-flow-direction-x/y`, `--sn-flow-intensity`, `--sn-flow-strength`, `--sn-flow-angle`, `--sn-flow-animated-x/y`, `--sn-corridor-flow-*`, `--sn-inward-vector-*`, `--sn-radial-distance`.

#### TunnelVisualizationSystem
- **Inputs**: `MusicSyncService`, `ColorHarmonyEngine`, `SimplePerformanceCoordinator`, unified event bus, CSSVariableWriter bridge.
- **Outputs**: Lighting state buffers, tunnel geometry state.
- **Styling Touchpoints**: Drives `--sn-tunnel-enabled`, `--sn-tunnel-width`, `--sn-tunnel-depth`, `--sn-tunnel-count`, `--sn-lighting-intensity`, `--sn-atmospheric-haze`, `--sn-wall-color-*`, `--sn-light-temperature`, `--sn-magical-shimmer`, `--sn-animated-haze`.

#### DynamicGradientStrategy
- **Inputs**: OKLAB color processor, `ThemeUtilities`, `DeviceCapabilityDetector`, unified event bus, DOM music-state events, CSSVariableWriter bridge.
- **Outputs**: Gradient caches, performance throttles, OKLAB stop collections.
- **Styling Touchpoints**: Controls `--sn-bg-gradient-*`, `--sn-webgl-living-gradient-sync`, `--sn-gradient-visualEffects-level`, `--sn-gradient-crossfade-opacity`, responsive animation variables.

#### UnifiedParticleSystem
- **Inputs**: SharedCanvasManager, `VisualEffectsCoordinator`, `MusicSyncService`, `SimplePerformanceCoordinator`, unified event bus, optional `year3000System` bridge.
- **Outputs**: Canvas render loop, particle pool metrics, visual effect state sync.
- **Styling Touchpoints**: Canvas overlay `sn-particle-visual-effects-canvas`; indirect influence via coordinator-provided CSS state (no direct CSS tokens).

#### WebGLGradientBackgroundSystem
- **Inputs**: `MusicSyncService`, `ColorHarmonyEngine`, `SimplePerformanceCoordinator`, `DeviceCapabilityDetector`, CSSVariableWriter bridge, unified event bus, shader loader, `VisualEffectsCoordinator` facade.
- **Outputs**: WebGL buffers, shader uniforms, quality scaling metrics.
- **Styling Touchpoints**: Reads/writes `--sn-bg-gradient-*`, `--sn-gradient-flow-*`, `--sn-gradient-crossfade-opacity`, `--sn-webgl-*`, `--sn-corridor-enabled`.

#### FluidGradientBackgroundSystem
- **Inputs**: `MusicSyncService`, `SimplePerformanceCoordinator`, CSSVariableWriter bridge, unified event bus, shader loader, `VisualEffectsCoordinator` state, WebGL gradient fallback.
- **Outputs**: Liquid shader uniforms, quality scaling metrics, visual memory caches.
- **Styling Touchpoints**: Maintains `--sn-visualEffects-flow-direction`, `--sn-visualEffects-animation-intensity`, `--sn-visualEffects-aurora-flow`, `--sn-visualEffects-viscosity`, `--sn-visualEffects-surface-*`, `--sn-visualEffects-animation-scale`.

#### OKLABColorProcessor
- **Inputs**: `GenreProfileManager`, `MusicEmotionAnalyzer`, `SimplePerformanceCoordinator`, unified event bus, OKLAB utilities, `AnimationFrameCoordinator`, palette managers.
- **Outputs**: Emotional temperature snapshots, OKLAB gradient caches, palette extensions.
- **Styling Touchpoints**: Writes `--sn-accent-*`, `--sn-bg-gradient-*`, `--sn-color-oklab-*`, `--sn-harmony-*`, `--sn-gravity-*`, sidebar/now-playing accent tokens.

> Confirmed via targeted `rg '--sn-'` scans and constructor audits; no additional hidden styling hooks were found beyond the tokens listed above.

### Phase A1 Execution Log (2025-10-07)
- **GradientDirectionalFlowSystem** migrated to `ServiceVisualSystemBase`, reworked music subscriptions through the service container fallback, and added a health snapshot for flow vectors.
- **TunnelVisualizationSystem** now uses service-managed event wiring, lifecycle hooks, and emits tunnel diagnostics via `performSystemHealthCheck()`.
- **DynamicGradientStrategy** integrates service-aware CSS batching + DOM/event subscriptions; health checks surface gradient cache status.
- **UnifiedParticleSystem** transitioned to service lifecycle, centralizing music sync cleanup while preserving particle pool analytics.
- **WebGLGradientBackgroundSystem** refactored to service-driven lifecycle with typed event helpers and consistent performance metrics.
- **FluidGradientBackgroundSystem** mirrors the WebGL pattern, ensuring shader readiness + music responsiveness tracked through services.
- **ColorHarmonyEngine** migrated to `ServiceSystemBase`, routing event/CSS/music lifecycle through the service container while maintaining semantic bridge fallbacks.

### Base Class Dependency Map
| System | Constructor Signature (before migration) | Notable Runtime Dependencies |
| ------ | ---------------------------------------- | ----------------------------- |
| `DepthLayeredGradientSystem` | `(config, utils, performanceMonitor, musicSyncService?, year3000System?)` | Requires CSSVariableWriter injection post-construction; reads ThemeUtilities, uses VisualEffectsCoordinator from `year3000System`. |
| `FluidGradientBackgroundSystem` | `(config, utils, performanceMonitor, musicSyncService?, year3000System?)` | Wraps `WebGLGradientBackgroundSystem`; expects shared CSS writer and VisualEffectsCoordinator via `year3000System`. |
| `WebGLGradientBackgroundSystem` | `(config, utils, performanceMonitor, musicSyncService?, year3000System?)` | Creates canvases/WebGL contexts; relies on DeviceCapabilityDetector internally. |
| `UnifiedParticleSystem` | `(config, utils, performanceMonitor, musicSyncService?, year3000System?)` | Instantiates shared canvas manager, subscribes to MusicSync; expects VisualEffectsCoordinator via `year3000System`. |
| `DynamicGradientStrategy` | `(config = ADVANCED_SYSTEM_CONFIG, utils = ThemeUtilities, performanceMonitor?, musicSyncService?, cssController?, cssAnimationManager?)` | Strategy pattern for gradients; optional CSS controller fallback to global writer. |

### Phase A6 Analysis (2025-10-08)
- **Global access inventory**: After the UI/service migrations, only the color pipeline and debug diagnostics continued to call `globalThis.year3000System`. Current global usage is limited to diagnostic tooling (`src-js/debug/DebugCoordinator.ts`) plus configuration fallbacks; the active color pipeline now resolves services via the factory (see Phase A6.1+ notes below).
- **Settings infrastructure map**: `settings` helper wraps `TypedSettingsManager` (`get`, `set`, `reset`, `onChange`, `export`, `import`), which emits structured `SettingsChangeEvent` objects. `SettingsProvider` auto-selects storage (Spicetify adapter preferred, browser fallback) and exposes diagnostics. Unified change propagation flows through `TypedSettingsManager.onChange` → `unifiedEventBus.emit('settings:changed', …)` (see `ViewportAwareSystem.handleUnifiedSettingsChange`). DOM `year3000SystemSettingsChanged` persists only as a compatibility rebroadcast inside `ViewportAwareSystem`.
- **Theme lifecycle touchpoints**: `ThemeLifecycleCoordinator` surfaces facade-backed getters (`timerConsolidationSystem`, `enhancedMasterAnimationCoordinator`, `cssVariableController`, `musicSyncService`, etc.), `applyInitialSettings(scope?)`, and the `facadeCoordinator` reference needed by color/audio subsystems. Consumers mostly call into these getters or delegate to CSS controller helpers (`getGlobalOptimizedCSSController`, `queueCSSVariableUpdate`).
- **Bridge implications**: Service adapters must expose (a) typed settings operations + change subscription for injection clients, and (b) a lifecycle facade that returns the coordinator reference while offering convenience wrappers for common calls (`applyInitialSettings`, CSS controller access, timer/animation retrieval). Phase A6 refactors will prioritize the UI/integration modules listed above; color + diagnostics usage will migrate once the new services are in place.

### Phase A6 Implementation Notes (2025-10-08)
- Registered `DefaultSettingsService` and `DefaultThemeLifecycleService` in `DefaultServiceFactory`, exposing them through `SystemIntegrationCoordinator` with typed manager + lifecycle wiring. Type definitions in `SystemServices.ts` now include `settings` and `themeLifecycle` entries.
- Refactored key UI/integration modules to consume the new services: settings UI, sidebar performance + integration controllers, glassmorphism manager, interaction/focus trackers, aberration utilities, prismatic scroll sheen, holographic UI, and visual effect controllers (`AnimationEffectsController`, `DepthLayerController`, `HeaderVisualEffectsController`, `WebGLGradientBackgroundSystem`). These now resolve CSS controllers, timers, and music sync state via service lookups instead of `globalThis`.
- Phase verification: `npm run typecheck` ✅; `rg "(globalThis as any).year3000System" src-js/visual` now returns only color-pipeline modules (`ColorHarmonyEngine`, `ColorProcessor`, `ColorStateManager`, `ColorEventRouter`) and diagnostics (`DebugCoordinator`). Captured these residuals for Part B lifecycle hardening.

### Phase A6.1 Verification Log (2025-10-08)
- Reviewed `src-js/visual/color/ThemeColorController.ts` ensuring the strategy no longer depends on BaseVisualSystem hooks. CSS coordination now resolves through `DefaultServiceFactory.getServices().themeLifecycle` before falling back to the global writer, aligning with the new service bridge.
- Dependency map updated: ThemeColorController consumes `settings` + `themeLifecycle` services; PaletteSystemManager remains the only palette abstraction. No direct `globalThis` reads remain in the strategy path.
- Recorded verification results here and in the master plan; standalone base-class migration tracker remains archived (`plans/archive/base-class-migration-tracker.md`) with a pointer back to the master plan, no further updates required.

### Phase A6.2 – Color Pipeline Migration Notes (2025-10-08)
- Audited the remaining color orchestrators: `ColorStateManager`, `ColorEventRouter`, `ColorProcessor`, and `ColorHarmonyEngine` were the final runtime paths still sourcing CSS controllers and performance analyzers from `globalThis.year3000System`.
- Introduced `themeLifecycle.getPerformanceCoordinator()` alongside the existing CSS/music helpers so color subsystems can resolve shared infrastructure via the service container. Each orchestrator now calls `DefaultServiceFactory.getServices()` and falls back to globals only if the lifecycle service is unavailable (legacy bootstrap/tests).
- `globalColorProcessor` now binds to the service-provided performance coordinator, ensuring the singleton respects service overrides and future testing hooks.
- `ColorHarmonyEngine.refreshPalette()` uses the lifecycle service to trigger palette refreshes, preserving behavior while removing direct global dependency.
- `DebugCoordinator` now resolves facade/lifecycle data through the service layer with legacy global fallbacks, clearing the last runtime dependency on direct globals; remaining work is limited to documentation/tests (tracked under Phase A7 and the future testing plan).
- Completed service-only integration for residual visual systems (`UnifiedParticleSystem`, `FluidGradientBackgroundSystem`, `DepthLayeredGradientSystem`, `WebGLGradientBackgroundSystem`, `UIVisualEffectsController`, `PrismaticScrollSheen`, `AberrationManager`, `AudioVisualController`) by routing visual coordinator access through `VisualCoordinatorService` helpers and removing all `globalThis` fallbacks. Visual systems now register/unregister with the coordinator via the service layer, satisfying the acceptance checklist.
- Removed the legacy React require shim in `theme.entry.ts` so the entry point no longer patches `globalThis`; manual diagnostics/test scripts now export their results instead of attaching them to globals.
- Added automated coverage under `tests/integration/color/ColorDiagnosticsService.integration.test.ts`, verifying service-based resolution for `ColorEventRouter`, `CSSColorController`, `ColorHarmonyEngine`, and `DebugCoordinator` with sentinel guards against `globalThis` fallbacks.

### Phase A7 Documentation & Diagnostics Refresh (2025-10-08)
- Added `docs/visual-service-facade-overview.md` to document the service container responsibilities and migration guidelines.
- Updated `docs/spotify/spicetify-design-bible.md` to highlight `ServiceVisualSystemBase` usage with service-injected examples; archived API references now include pointers to the new facade doc.
- Tagged legacy API reference with an archive notice and cross-link to the facade overview; other legacy guides remain under `docs/legacy/` with historical context.
- Diagnostics health checks now pull facade/lifecycle references via `DefaultServiceFactory`, aligning debug tooling with the service architecture.
- Regression evidence: `npm run typecheck` ✅ (2025-10-08); no visual regressions observed during smoke checks (UI + color harmonization) while updating docs/diagnostics.
