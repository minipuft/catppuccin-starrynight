# Catppuccin StarryNight Architecture

## Scope
This document is the authoritative overview of the current Catppuccin StarryNight theme implementation. It reflects the consolidated lifecycle/visual systems that replaced the legacy AdvancedThemeSystem + facade stack. Use it alongside the `AGENTS` rules for day-to-day work and keep it in sync with source modules under `src-js/` and `src/`.

## Lifecycle & Entry
1. `src-js/theme.entry.ts` is the only runtime entry point. It patches React requires, waits for Spicetify readiness, loads the Catppuccin CSS theme, then instantiates `ThemeLifecycleCoordinator` with `ADVANCED_SYSTEM_CONFIG`.
2. Degraded mode is triggered when essential APIs (`Spicetify.Player`, `Spicetify.Platform`) are missing. In that case `ThemeLifecycleCoordinator.initializeDegradedMode()` keeps CSS-driven visuals alive while monitoring for API availability through `DegradedModeCoordinator`.
3. Full mode calls `initializeAllSystems()` and `setupMusicAnalysisAndColorExtraction()`, wiring music sync, color harmony, and registering post-init UI controllers (CardDOMWatcher, AberrationManager, DragPreviewManager, QuickAddRadialMenu, etc.).
4. Settings UI is lazy-loaded via `ui/components/StarryNightSettings`, only when React/ReactDOM are available. Debug mode exposes `(window as any).Y3K` with lifecycle, performance, and music sync handles.

## Coordination Layer
- `src-js/core/lifecycle/ThemeLifecycleCoordinator.ts`
  - Owns progressive initialization, health monitoring, cleanup.
  - Delegates system wiring to `SystemIntegrationCoordinator` and stores cached handles (e.g., `simplePerformanceCoordinator`, `webglSystemsIntegration`).
  - Manages color state via `ColorEventCoordinator`, `ColorStateManager`, and `ColorProcessor` singletons.

- `src-js/core/integration/SystemIntegrationCoordinator.ts`
  - Executes phased initialization (`core`, `visual`, `services`, etc.), coordinating dependencies and sequencing.
  - Creates/returns shared singletons: `VisualEffectsCoordinator`, `InfrastructureSystemCoordinator`, `MusicSyncService`, `CSSVariableWriter`, `SimplePerformanceCoordinator`, `EnhancedDeviceTierDetector`, `WebGLSystemsIntegration`, `ColorHarmonyEngine`, `SpicetifyColorBridge`.
  - Registers health/performance observers and exposes `getCachedNonVisualSystem` / `getCachedVisualSystem` helpers.

- `src-js/core/events/EventBus.ts`
  - Replaces the old UnifiedEventBus; all systems publish/subscribe through `unifiedEventBus` with structured topics (e.g., `music:beat`, `colors:harmonized`, `performance:quality-level`).

## Visual Coordination
- `src-js/visual/effects/VisualEffectsCoordinator.ts`
  - Singleton that implements `IManagedSystem` and holds the shared `VisualEffectState`.
  - Registers `BackgroundSystemParticipant`s (e.g., `FluidGradientBackgroundSystem`, `WebGLGradientStrategy`, `UnifiedParticleSystem`, `SidebarVisualEffectsSystem`).
  - Exposes participant lifecycle, quality scaling, health checks, metrics, and CSS variable batching.

- Background strategies live under `src-js/visual/strategies/`:
  - `ColorStrategySelector` chooses a backend (`webgl`, `css`, `hybrid`) and returns configured strategies.
  - `WebGLGradientStrategy`, `DynamicGradientStrategy`, `DepthLayeredStrategy`, `ColorStrategyRegistry` each implement `IManagedSystem` and register themselves with the coordinator.

- UI enhancements:
  - Managers: `Card3DManager`, `GlassmorphismManager`, `SidebarVisualEffectsSystem`, `AudioVisualController` (all under `src-js/ui/`).
  - Interactions: `ui/interactions/DragPreviewManager.ts` (enhanced drag ghost) and `ui/interactions/PlaylistQuickAddMenu.ts` (Quick Add radial) replace the legacy `effects/*` implementations.
  - Atmospheric/Depth controllers (`visual/effects/DepthLayerController.ts`, `visual/atmospheric/AtmosphericCrystalsSystem.ts`) subscribe to music and performance events via the coordinator.

## Audio & Color Pipeline
- `src-js/audio/MusicSyncService.ts`
  - Centralizes Spicetify Player integration, beat detection, enhanced BPM analysis, caching, and event publication.
  - Emits `music:*` events on the unified event bus and provides metrics, predictive beat scheduling, and graceful degradation.

- Refer to `docs/COLOR_AND_AUDIO.md` for full music/color processing (MusicSync + OKLAB pipeline, SCSS integration).

## Performance & Settings
- Performance modules under `src-js/core/performance/` (e.g., `PerformanceMonitor.ts`, `SimplePerformanceCoordinator.ts`, `EnhancedDeviceTierDetector.ts`, `GradientPerformanceOptimizer.ts`) expose quality scaling hooks consumed by both lifecycle and visual systems.
- Settings live in `src-js/config`:
  - `globalConfig.ts` contains platform/environment flags.
  - `advanced-system-config.ts` exposes developer toggles (debug, feature flags, performance tiers).
  - Runtime changes emit `year3000SystemSettingsChanged` events listened to by managers such as `Card3DManager` and `SidebarVisualEffectsSystem`.

## CSS & Asset Pipeline
- SCSS sources in `src/` define Catppuccin tokens, layouts, and system-specific styles. They compile to `user.css` via SASS/PostCSS.
- TypeScript sources in `src-js/` compile to `theme.js` via ESBuild. Both artifacts sit at repo root and are deployed by `install.sh` / `install-hybrid.sh` / `install.ps1`.
- Visual systems rely on synchronized CSS variables (`--sn-*`, `--spice-*`). `CSSVariableWriter` ensures synchronized updates between music/color output and SCSS expectations.

## Event & Data Flow (Text Diagram)
```
Spicetify APIs -> theme.entry -> ThemeLifecycleCoordinator
  -> SystemIntegrationCoordinator (creates shared systems)
    -> MusicSyncService -> unifiedEventBus 'music:*'
    -> ColorHarmonyEngine -> SpicetifyColorBridge + CSSVariableWriter
  -> VisualEffectsCoordinator
    -> BackgroundSystemParticipant.onVisualStateUpdate()
    -> UI controllers & strategies adjust DOM/WebGL output
PerformanceMonitor -> unifiedEventBus 'performance:*' -> Coordinators adjust quality levels
Settings Manager -> year3000SystemSettingsChanged -> Managers sync configs
```

## Compatibility Rules
- Document only current modules. When referencing deprecated systems, label them clearly and point to replacements.
- Verify path aliases (`@/`) against `tsconfig.json` before adding examples.
- Highlight degraded-mode behavior whenever systems depend on optional Spicetify APIs.
- When adding new systems, ensure they implement `IManagedSystem` from `src-js/types/systems.ts` and register through `SystemIntegrationCoordinator` or `VisualEffectsCoordinator` instead of ad-hoc wiring.

## Pending Enhancements
- Add mermaid or sequence diagrams once verified against runtime traces.
- Link to future consolidated guides (`BUILD_AND_DEPLOY.md`, `COLOR_AND_AUDIO.md`, `STYLING_AND_TOKENS.md`, `SETTINGS_AND_CONFIG.md`) as they are authored.
- Record verification notes in `plans/documentation-cleanup.md` whenever this document is updated.
