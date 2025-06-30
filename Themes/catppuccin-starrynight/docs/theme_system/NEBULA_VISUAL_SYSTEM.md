# 🌌 Nebula Visual System Documentation

## Overview

The **Nebula Visual System** is the atmospheric glow that sits behind the main content of Catppuccin StarryNight, gently reacting to **music, scrolling and genre changes** while remaining GPU-friendly. It is composed of two cooperating runtimes:

1. **NebulaController** (`src-js/effects/NebulaController.ts`)
   - Lightweight (< 2 ms median) JavaScript that converts beat/genre/scroll events into CSS custom-property updates.
2. **WebGPUBackgroundSystem** (`src-js/systems/visual/WebGPUBackgroundSystem.ts`)
   - A progressively-enhanced, optional renderer that paints a procedural RGB-noise nebula via WebGPU when the browser supports it **and** the user has enabled the _Cosmic Maximum_ mode.

When WebGPU is not available—or the user prefers reduced motion—the SCSS fallback defined in `src/core/_sn_nebula_variables.scss` + `src/layout/_sn_scroll_node_backgrounds.scss` provides a purely-CSS multi-gradient alternative that still receives live updates from `NebulaController`.

---

## 1 ▪ NebulaController

| Aspect                   | Details                                                                                                                                                                                                                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**                 | `src-js/effects/NebulaController.ts`                                                                                                                                                                                                                                                                                  |
| **Public ctor**          | `new NebulaController(y3k?: Year3000System)` – automatically initialised via `initializeNebulaController()` in `theme.entry.ts`.                                                                                                                                                                                      |
| **Key responsibilities** | 1) Subscribe to _GlobalEventBus_ topics (`music:beat`, `music:genre-change`, `user:scroll`).<br>2) Translate payloads into the CSS variables listed below.<br>3) Throttle writes via a shared `CSSVariableBatcher` to minimise layout thrashing.<br>4) Emit performance timings to `PerformanceAnalyzer` every ≈ 1 s. |
| **User settings**        | • `nebula-intensity` (disabled · minimal · balanced · intense)<br>• honours OS «Prefers-reduced-motion» & Year3000 device-capability tiers.                                                                                                                                                                           |
| **Performance Guard**    | Maintains a 120-frame rolling median; if scripting cost > 2 ms it will fall back to a cheaper `screen` blend-mode.                                                                                                                                                                                                    |

### 1.1 CSS Variables Written

| Variable                          | Range                    | Source event           | Purpose                                                    |
| --------------------------------- | ------------------------ | ---------------------- | ---------------------------------------------------------- |
| `--sn-nebula-beat-intensity`      | 0.8 – 1.4                | `music:beat.energy`    | Global multiplier applied to the 4 background layers.      |
| `--sn-nebula-aberration-strength` | 0 – 0.6                  | `music:beat.energy`    | Drives chromatic-aberration effect in CSS & WebGPU.        |
| `--sn-nebula-layer-3-blur`        | `calc(...)`              | `user:scroll.velocity` | Adds extra blur on fast scrolls to suggest depth parallax. |
| `--sn-nebula-noise-scale-y`       | 140 % – 200 %            | `user:scroll.velocity` | Vertically stretches the noise overlay when scrolling.     |
| `--sn-nebula-layer-0-opacity`     | 0 – 0.18                 | `music:genre-change`   | Brief discovery glow when a brand-new genre is detected.   |
| `--sn-nebula-ease-t`              | 0 / 1                    | `music:genre-change`   | Temporarily tightens gradient stops for dramatic focus.    |
| `--sn-nebula-blend-mode`          | `color-dodge` / `screen` | Auto                   | Lower GPU cost if median frame > 2 ms.                     |

All other colour tokens are **aliases** to `--sn-gradient-*` and therefore inherit Catppuccin & Color Harmony updates automatically.

---

## 2 ▪ WebGPUBackgroundSystem

| Aspect                 | Details                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**               | `src-js/systems/visual/WebGPUBackgroundSystem.ts`                                                                                                                                                                                                                                                                                |
| **Activation rules**   | • User setting `sn-enable-webgpu` == `"true"`.<br>• Artistic Mode == `cosmic-maximum`.<br>• `navigator.gpu` present.<br>Otherwise the system stays dormant (`initialized === false`).                                                                                                                                            |
| **Rendering approach** | Full-screen `<canvas>` fixed behind the DOM. Renders a single full-screen triangle with a minimalist WGSL fragment shader that outputs RGB noise tinted via 3 colour uniforms (`primary`, `secondary`, `accent`).                                                                                                                |
| **Uniform layout**     | `vec4f[4]` (64 bytes):<br>0–3 Primary (RGB + 1)<br>4–7 Secondary<br>8–11 Accent<br>12 time · energy · valence · drift-angle                                                                                                                                                                                                      |
| **Dynamic updates**    | • Colours refreshed every 30 frames by sampling computed CSS `<custom-properties>`.<br>• A drift vector (pseudo-random + music beat vector) is recalculated every 2 s and exposed to CSS as `--sn-nebula-drift-x/y` so the fallback shaders can stay in sync.<br>• Uniform buffer is updated each frame via `queue.writeBuffer`. |
| **Fallback path**      | If any init step fails the system calls `destroy()` and the CSS nebula remains active.                                                                                                                                                                                                                                           |

### 2.1 Performance considerations

- Runs entirely on the GPU after initialisation (no per-frame CPU work besides uniform write).
- The RGB-noise shader is deliberately cheap (single `sin/fract` pattern). Future phases can replace it with richer WGSL includes.
- The canvas uses `alphaMode: premultiplied` and sits at `z-index: -1` leaving DOM hit-testing unaffected.

---

## 3 ▪ SCSS Architecture

1. **Variable façade** – `src/core/_sn_nebula_variables.scss` defines `--sn-nebula-layer-N-*` tokens that _alias_ existing depth-layer & gradient variables, enforcing a single source-of-truth.
2. **Background implementation** – `src/layout/_sn_scroll_node_backgrounds.scss` composes a 4-layer radial-gradient stack inside `.main-view-container__scroll-node::before` and a noise overlay in `::after`.
3. **Utilities** – The `@mixin nebula-noise()` in `_mixins.scss` generates the fractal-noise data-uri referenced by `::after`.
4. **Component hooks** – Many components (e.g. `_sn_enhanced_cards.scss`, `_sn_loading.scss`) reference `--sn-nebula-beat-intensity` for local bloom or mask effects.

All SCSS honours **prefers-reduced-motion** by disabling animation when requested.

---

## 4 ▪ Integration Points

- `theme.entry.ts` → calls `initializeNebulaController(year3000System)` and registers `WebGPUBackgroundSystem` with _Year3000System_’s ManagedSystem scheduler.
- `MusicSyncService` supplies `music:beat` + `getCurrentBeatVector()` used by both components.
- `SettingsManager` exposes `nebula-intensity` & `sn-enable-webgpu` toggles.
- Dynamic colour updates flow from **Color Harmony Engine → CSS variables → Nebula shader**.

---

## 5 ▪ Debug & Testing

```javascript
// Quick check: Nebula variables & performance
Year3000Debug.testNebula = () => {
  const root = document.documentElement;
  console.table({
    beat: getComputedStyle(root).getPropertyValue("--sn-nebula-beat-intensity"),
    blur: getComputedStyle(root).getPropertyValue("--sn-nebula-layer-3-blur"),
    aberration: getComputedStyle(root).getPropertyValue(
      "--sn-nebula-aberration-strength"
    ),
  });
  return globalThis.__SN_nebulaController?.frameDurations?.slice(-10);
};
```

There is also a built-in median warning: open DevTools console and look for
`[NebulaController] Median scripting cost … ms exceeds 2 ms budget.`

---

## 6 ▪ Future Roadmap

| Phase | Planned Feature                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------- |
| 2     | **Pulse Staging** – multi-band EQ mapping: bass → scale, mids → blur, highs → aberration.           |
| 3     | **GPU Blend Upgrade** – replace RGB-noise with signed-distance nebula + volumetric light shafts.    |
| 4     | **Accessibility** – colour-blind safe palettes & automatic contrast safeguards for nebula overlays. |
| 5     | **Energy Saver** – adaptive frame-skip when tab is backgrounded or FPS dips below target.           |

---

## 7 ▪ Implementation Checklist

- [x] `NebulaController` initialised exactly once (hot-reload safe).
- [x] WebGPU canvas only created when `navigator.gpu` present.
- [x] All new CSS variables are **RGB-based** (no hex in gradients).
- [x] Performance guard falls back to `screen` blend-mode at > 2 ms median.
- [x] honours `prefers-reduced-motion` & low-capability devices.
- [x] Noise overlay rendered via `@include nebula-noise()` mixin.

---

**Status:** Phase 1 complete ‑ Nebula live in production.

— _January 2025_ | **Version 1.0** | _Catppuccin StarryNight_
