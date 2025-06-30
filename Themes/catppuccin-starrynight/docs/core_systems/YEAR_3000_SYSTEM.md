# 🌌 **Year 3000 System** — v2.3.x Documentation (2025-06)

> **Status:** 🚀 _Actively Evolving_ | **Core LOC:** ≈ 11 k | **Entry Point:** `src-js/theme.entry.ts`
>
> The Year 3000 System is the beating heart of Catppuccin StarryNight. It orchestrates **dynamic colour extraction**, **music-reactive visuals**, and a **performance-aware animation stack** across 25 distinct subsystems while supporting progressive enhancement from a _visual-only_ mode up to the full interactive experience.

---

## 1 High-Level Flow

```text
┌── Boot (theme.entry.ts) ────────────────────────────────────────────────┐
│  Wait for Spicetify APIs  ⇢  decide FULL vs DEGRADED  ⇢  instantiate    │
│  Year3000System  ⇢  year3000System.initialize*(…)                      │
└─────────────────────────────────────────────────────────────────────────┘
           ↓                                             ↘ (upgrade)
┌──────── FULL MODE ───────┐                 ┌── DEGRADED MODE ──┐
│ • All core + visual sys  │                 │ • Performance core│
│ • Music analysis         │                 │ • Visual systems  │
│ • Settings UI            │                 │ • No Spotify APIs │
└──────────────────────────┘                 └───────────────────┘
```

A global debug handle `window.Y3K` is exposed once initialisation completes, containing references to every major manager/system plus realtime health metrics.

---

## 2 Core Layers & Components

| Layer                                    | Component                                                                                                                                                                                                                                                               | Purpose                                                                  | Location                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| **Boot**                                 | **Year3000System**                                                                                                                                                                                                                                                      | Central orchestrator, progressive loader, feature toggles                | `src-js/core/year3000System.ts`             |
|                                          | AvailableAPIs detector                                                                                                                                                                                                                                                  | Gates degraded/full modes                                                | inline in **Year3000System**                |
| **Performance Core**                     | `PerformanceAnalyzer`                                                                                                                                                                                                                                                   | FPS budgeting & frame stats                                              | `src-js/core/PerformanceAnalyzer.ts`        |
|                                          | `MasterAnimationCoordinator`                                                                                                                                                                                                                                            | Single requestAnimationFrame loop with cooperative scheduling            | `src-js/core/MasterAnimationCoordinator.ts` |
|                                          | `TimerConsolidationSystem`                                                                                                                                                                                                                                              | Merges disparate setInterval loops into unified cadence                  | `src-js/core/TimerConsolidationSystem.ts`   |
|                                          | `CSSVariableBatcher`                                                                                                                                                                                                                                                    | Debounced CSS variable writes to prevent layout thrash                   | `src-js/core/CSSVariableBatcher.ts`         |
|                                          | `DeviceCapabilityDetector`                                                                                                                                                                                                                                              | Surface & GPU capability probing                                         | `src-js/core/DeviceCapabilityDetector.ts`   |
| **Managers**                             | `SettingsManager`                                                                                                                                                                                                                                                       | React-native settings UI + live events (`year3000SystemSettingsChanged`) | `src-js/managers/SettingsManager.ts`        |
|                                          | `ColorHarmonyEngine`                                                                                                                                                                                                                                                    | Hex→RGB pipeline, harmonic evolution, accessibility checks               | `src-js/systems/ColorHarmonyEngine.ts`      |
|                                          | `MusicSyncService`                                                                                                                                                                                                                                                      | Audio feature extraction, BPM enhancement                                | `src-js/services/MusicSyncService.ts`       |
|                                          | `GlassmorphismManager`                                                                                                                                                                                                                                                  | Backdrop-filter tuning based on perf tier                                | `src-js/managers/GlassmorphismManager.ts`   |
|                                          | `Card3DManager`                                                                                                                                                                                                                                                         | 3-D tilt & glow for playlist cards                                       | `src-js/managers/Card3DManager.ts`          |
| **Visual Systems (registered with MAC)** | `BeatSyncVisualSystem`, `EmergentChoreographyEngine`, `LightweightParticleSystem`, `DimensionalNexusSystem`, `DataGlyphSystem`, `PredictiveMaterializationSystem`, `SidebarConsciousnessSystem`, `ParticleFieldSystem` (optional), `WebGPUBackgroundSystem` (GPU-gated) | See individual files under `src-js/systems/visual/`                      |
| **Utility Layer**                        | **Year3000Utilities**                                                                                                                                                                                                                                                   | 60+ helpers (color spaces, beat math, lerpSmooth, throttling, etc.)      | `src-js/utils/Year3000Utilities.ts`         |

---

## 3 Progressive Loading & Enhancement

```ts
// theme.entry.ts (excerpt)
const year3000System = new Year3000System(YEAR3000_CONFIG, HARMONIC_MODES);

await year3000System.initializeWithAvailableAPIs({
  player: Spicetify.Player ?? undefined,
  platform: Spicetify.Platform ?? undefined,
  config: Spicetify.Config,
  degradedMode: !Spicetify.Player,
});
```

1. **Degraded Mode** boots immediately, enabling purely visual flare for unauthenticated sessions or when Spotify internal APIs are late.
2. A background interval polls for missing APIs; once present, `upgradeToFullMode()` spins up MusicSyncService, SettingsManager, etc. without page reload.

---

## 4 Colour Pipeline Cheatsheet

1. `MusicSyncService` extracts palette from album-art →
2. Sanitised via `Year3000Utilities.sanitizeColorMap` →
3. `ColorHarmonyEngine.blendWithCatppuccin()` harmonises vs current flavour →
4. `cssVariableBatcher.queueCSSVariableUpdate()` writes:
   - `--sn-gradient-*-hex`
   - `--sn-gradient-*-rgb`
   - `--sn-dynamic-accent-rgb`
   - 〈mirrors to _-rgb_ Spice vars for SCSS consumption〉
5. SCSS layers consume RGB tokens for translucent effects.

---

## 5 Settings & Live Events

| Key                                        | Effect                                                         |
| ------------------------------------------ | -------------------------------------------------------------- |
| `catppuccin-accentColor` (dropdown)        | `dynamic` ➜ skips static overrides, else static accent applied |
| `sn-harmonic-intensity` (0-1)              | Realtime intensity push to ColorHarmonyEngine                  |
| `sn-harmonic-evolution` (bool)             | Toggles automatic harmonic cycling                             |
| `sn-current-harmonic-mode`                 | Forces mode key from `HARMONIC_MODES` map                      |
| `sn-enable-webgpu` (bool)                  | Hot-loads WebGPUBackgroundSystem (GPU only)                    |
| Artistic Mode (shared via YEAR3000_CONFIG) | Adjusts performance caps across all visual systems             |

Live changes dispatch `year3000SystemSettingsChanged`, which cascades through every subsystem via `applyUpdatedSettings()`.

---

## 6 Global Debugging

```js
window.Y3K /* shape */ = {
  system,               // Year3000System instance
  music, settings,      // quick handles
  debug: Year3000Debug, // specialised tests
  health: system.systemHealthMonitor,
  mode: "full"|"degraded" ,
  availableAPIs: {...}
};
```

- Run `Y3K.debug.runIntegrationTest()` for a full health breakdown.
- Use `Y3K.system.queueCSSVariableUpdate('--foo', 'bar')` for live tweaks.

---

## 7 Authoring New Visual Systems

1. Extend `BaseVisualSystem` and implement **either** `onAnimate(deltaMs)` **or** legacy `updateAnimation`.
2. In `initialize()`, call `year3000System.registerAnimationSystem(name, this, 'background', 30)`.
3. Expose `applyUpdatedSettings` if you need live settings.
4. Declare `destroy()` for clean teardown.

> **Tip:** Use `PerformanceAnalyzer.getFrameBudget()` to dynamically adapt quality at runtime.

---

## 8 Version History (abridged)

| Version   | Date    | Highlights                                                                     |
| --------- | ------- | ------------------------------------------------------------------------------ |
| **2.3.x** | 2025-06 | Progressive loader refactor, WebGPU BG, ParticleField, harmonised RGB pipeline |
| 2.2.x     | 2025-04 | MasterAnimationCoordinator, TimerConsolidationSystem                           |
| 2.1.x     | 2025-03 | EmergentChoreographyEngine, Debug API v2                                       |
| 2.0.0     | 2025-01 | Initial public release (“Implementation Complete”)                             |

---

## 9 Useful Code Snippets

### Queueing CSS vars safely

```ts
year3000System.queueCSSVariableUpdate("--sn-nav-intensity", "0.8");
```

### Forcing colour re-extraction

```ts
await year3000System.updateColorsFromCurrentTrack();
```

### Quick harmonic variation helper

```ts
const { derivedDarkVibrantHex } = year3000System.evolveHarmonicSignature(
  "triadic",
  "#ca9ee6"
);
```

---

© 2025 Catppuccin StarryNight Maintainers — Contributions welcome!
_This document is generated manually; keep in sync with `src-js/core/year3000System.ts` on every major feature PR._
