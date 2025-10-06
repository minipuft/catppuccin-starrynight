# Visual Effects Coordination (Current)

## Scope
Reference for the live `VisualEffectsCoordinator` implementation. Use this alongside `docs/ARCHITECTURE.md` for the broader orchestration picture.

## Coordinator Summary
- File: `src-js/visual/effects/VisualEffectsCoordinator.ts` (singleton implementing `IManagedSystem`).
- Responsibilities:
  * Maintain the shared `VisualEffectState` and broadcast updates each animation tick.
  * Register/unregister `BackgroundSystemParticipant`s via `registerVisualEffectsParticipant` / `unregisterVisualEffectsParticipant`.
  * Relay music/color/performance events from the unified event bus and `MusicSyncService`.
  * Apply CSS updates through `CSSVariableWriter`/`CSSVariableBatcher` when color or intensity values change.

## VisualEffectState Highlights
```ts
interface VisualEffectState {
  musicIntensity: number;
  energyLevel: number;
  colorTemperature: number;
  flowDirection: { x: number; y: number };
  fluidIntensity: number;
  depthPerception: number;
  luminosity: number;
  pulseRate: number;
  scalingFactor: number;
  deviceCapabilities: DeviceCapabilities;
  performanceMode: PerformanceMode;
  timestamp: number;
}
```
Values are evolved each frame from music analysis (`MusicSyncService`), color harmony (`ColorHarmonyEngine`), and participant contributions.

## Participant Contract
```ts
interface BackgroundSystemParticipant extends IManagedSystem {
  systemName: string;
  onVisualStateUpdate(state: VisualEffectState): void;
  onVisualEffectEvent(eventType: string, payload: VisualEffectEventPayload): void;
  getVisualContribution?(): Partial<VisualEffectState>;
}

const coordinator = VisualEffectsCoordinator.getInstance(config, cssController);
await coordinator.initialize();
const result = coordinator.registerVisualEffectsParticipant(systemInstance);
```
Systems should provide their own `initialize/destroy` lifecycle and clean up on unregister.

## Integration Flow
1. `MusicSyncService` emits music events -> coordinator updates `VisualEffectState`.
2. `ColorHarmonyEngine` publishes color events -> coordinator updates dynamic/OKLAB tokens.
3. Participants receive `onVisualStateUpdate` and adjust DOM/WebGL output.
4. Performance monitors call `coordinator.adjustQualityLevel(...)` in response to device metrics.

## Verification Notes (2025-10-06)
- Checked `src-js/visual/effects/VisualEffectsCoordinator.ts` and dependent systems (`FluidGradientBackgroundSystem`, `WebGLGradientStrategy`, `SidebarVisualEffectsSystem`) to ensure API names (`registerVisualEffectsParticipant`, etc.) match.

