# Graceful Degradation (Current Behavior)

## Scope
How Catppuccin StarryNight keeps the theme functional when Spicetify APIs or runtime features fail. Reflects the logic implemented in `ThemeLifecycleCoordinator`, `DegradedModeCoordinator`, and `MusicSyncService`.

## Lifecycle Entry
- `ThemeLifecycleCoordinator.initializeDegradedMode()` runs when `Spicetify.Player` / `Spicetify.Platform` are unavailable. Core steps:
  * Load CSS-only visuals, skip music analysis/advanced UI.
  * Continue polling for APIs; upgrade to full mode once available.
  * Register fallback listeners so settings changes still propagate.
- `DegradedModeCoordinator` tracks feature availability and toggles systems back on when APIs recover.

## Music & Color Resilience
- Located in `src-js/audio/MusicSyncService.ts`.
- Uses `Promise.allSettled` to request audio features and album colors; handles each result independently.
- Fallback paths:
  * **Audio OK / Color fail** -> keep beat sync, fall back to Catppuccin defaults.
  * **Color OK / Audio fail** -> apply album palette, synthesize default BPM/energy values.
  * **Both fail** -> use static Catppuccin palette and neutral music state.
- Retries color extraction via `robustColorExtraction(trackUri, maxRetries=3)` with logging and input validation.

## Visual Systems
- If `VisualEffectsCoordinator` or WebGL systems fail, background participants unregister and CSS-based systems continue (handled inside each participant via try/catch + health checks).
- Participants should degrade to CSS tokens (e.g., `--sn-dynamic-*`, `--sn-color-*`) when music intensity or color data is missing.

## Install/Runtime Recovery
- Install scripts always run `spicetify backup` before applying, allowing `spicetify restore` to revert when errors occur.
- Debug mode exposes `(window as any).Y3K.mode` (`"degraded"` or `"full"`) for quick inspection.

## Verification Notes (2025-10-06)
- Confirmed behavior in `src-js/core/lifecycle/ThemeLifecycleCoordinator.ts`, `src-js/core/lifecycle/DegradedModeCoordinator.ts`, and `src-js/audio/MusicSyncService.ts` (Promise.allSettled + fallback sections).

