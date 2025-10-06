# Catppuccin StarryNight Color & Audio Integration

## Scope
Authoritative reference for music-driven color processing in the live codebase. Supersedes legacy "consciousness" terminology and documents only the modules currently shipped.

## Music Sync Overview
- Entry module: `src-js/audio/MusicSyncService.ts`
- Responsibilities: subscribe to Spicetify player events, fetch audio features, compute enhanced BPM/beat phases, broadcast `music:*` events via unified event bus, coordinate with `ColorHarmonyEngine` and visual systems.

### MusicSyncService Highlights
- Progressive initialization: waits for Spicetify availability, supports degraded mode.
- Beat scheduling: predictive beat tracking, exposes `startBeatScheduler`, `stopBeatScheduler`, `getCurrentBeatPhase`.
- Metrics: maintains processing metrics, cache stats, exposed via `getMetrics`.
- Event publishing: emits `music:beat`, `music:energy`, `music:dramatic-peak`, etc.
- Integration: registers with lifecycle coordinator; used by visual managers (`Card3DManager`, `DepthLayerController`, etc.).

## Color Harmony & OKLAB
- Core module: `src-js/audio/ColorHarmonyEngine.ts` orchestrates OKLAB color processing for album art palettes and music tone.
- Utilities: `src-js/utils/color/OKLABColorProcessor.ts` (RGB <-> OKLAB conversions, perceptual blending) and `EmotionalTemperatureMapper.ts` (maps musical/emotional data to temperature ranges).
- Outputs: `SpicetifyColorBridge` and `CSSVariableWriter`/`CSSVariableBatcher` apply colors to CSS vars (`-sn-oklab-*`, `-sn-dynamic-*`).

### OKLAB Usage
- `blendColors()` converts RGB to OKLAB, interpolates in OKLAB space, and converts back-ensuring perceptually uniform gradients.
- `updatePaletteFromAlbumArt()` extracts dominant colors, caches by album art hash, and harmonizes them with Catppuccin tokens.
- `publishColorState()` emits `colors:extracted` / `colors:harmonized` events and queues CSS variable updates via batcher.

### SCSS Integration
- SCSS modules import `core/_design_tokens` and use `oklab-color('token', opacity)` helper (see `token-usage-guide` guidance).
- Tokens available: `accent`, `primary`, `secondary`, `shadow`, `highlight` (mapped from OKLAB outputs).
- Migration tips: replace `rgba(var(--sn-accent-rgb), x)` with `oklab-color('accent', x)`; see legacy OKLAB migration notes for path adjustments.

### Color Events & Settings
- `ColorEventCoordinator` listens for color events and synchronizes `ColorStateManager`.
- Settings toggles (via `settings`) can adjust vibrancy, warmth bias, and fallback behavior.

## Event Flow
1. `MusicSyncService` fetches audio features; emits beat/color events.
2. `ColorHarmonyEngine` receives music payloads, processes OKLAB colors.
3. `SpicetifyColorBridge` and `CSSVariableWriter` update CSS vars (`-sn-dynamic-*`).
4. `VisualEffectsCoordinator` and participants react to color/mood changes via event bus.

## Verification Notes (2025-10-06)
- Reviewed `src-js/audio/MusicSyncService.ts`, `src-js/audio/ColorHarmonyEngine.ts`, `src-js/utils/color/OKLABColorProcessor.ts`, `src-js/utils/color/EmotionalTemperatureMapper.ts`, and `src-js/utils/spicetify/SpicetifyColorBridge.ts`.
- Legacy guides referenced for salvage: `docs/legacy/AUDIO_INTEGRATION_GUIDE.md`, existing OKLAB guides.

## Pending Work
- Document genre profile behavior (`GenreProfileManager`).
- Add diagrams for beat/color flow once verified with runtime logs.
- Consolidate OKLAB naming/migration notes into this doc when rewriting token guides.

