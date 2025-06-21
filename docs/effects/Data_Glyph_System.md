# 🌌 Data Glyph System (DGS)

> “Tiny symbols, cosmic context.”

---

## v3 (June 2025) – Performance & CSS Variable Pipeline

- All glyph intensity writes now routed via `CSSVariableBatcher`.
- New tokens `--sn-glyph-intensity`, `--sn-glyph-glow` replace legacy `--glyph-intensity`, `--sn-glyph-opacity` (aliased for vNext).
- Echo pool doubled (LRU) + TimerConsolidation cleanup; median GC pause ‑32 %.
- Health-monitor hooks added (`requiredSelectors`, `healthCheck`).
- Jest coverage extended to > 90 % lines.

---

## Overview

The **Data Glyph System (DGS)** sprinkles adaptive icons ( _glyphs_ ) on track rows, cards, library items and other UI entities, conveying subtle real-time information such as musical energy, attention score and predicted interaction intensity.

- **Source:** `src-js/systems/visual/DataGlyphSystem.ts`
- **Domain:** Year 3000 visual stack (subclass of `BaseVisualSystem`).
- **Related Style Module:** `src/systems/_sn_data_glyphs.scss`

DGS attaches a `data-sn-glyph` attribute to each observed item; the visible dot is rendered in CSS via a `::after` pseudo-element—zero extra DOM nodes.

---

## 1 ▪ Key Concepts

| Concept                 | Purpose                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| **GlyphData Cache**     | `WeakMap<Element,GlyphData>` storing per-item intensity, kinetic state, attention score, etc.           |
| **Observed Items**      | Map of elements currently decorated with a glyph plus teardown callbacks.                               |
| **Echo Pool**           | Re-used `.sn-temporal-echo` elements for ripple effects (shared with Predictive Materialization).       |
| **Performance Mode**    | MasterAnimationCoordinator can switch DGS to _performance_ (fewer heavy updates, smaller observed set). |
| **Memory Optimisation** | Config block `memoryOptimization` caps cache sizes and schedules clean-ups.                             |

---

## 2 ▪ Event & Update Flow

1. **Initialization** – registers with `MasterAnimationCoordinator` if present, else starts fallback `requestAnimationFrame` loop.
2. **MutationObserver** – monitors the entire `document.body`; when matching selectors appear, `attachGlyph()` tags them.
3. **Per-Frame Loop** (`updateAnimation`)
   - Every frame → `animateAllGlyphs()` adjusts CSS vars based on music energy & attention.
   - Every `heavyUpdateInterval` (1 s) → `_updateGlyphTargetsOptimized()` prunes off-screen or detached items.
4. **Interaction Handling** – `mouseenter` / `mouseleave` update `attentionScore` and may spawn **Temporal Echoes**.

---

## 3 ▪ Configuration Highlights

```ts
const defaults = {
  memoryOptimization: {
    maxCacheSize: 100,
    cleanupInterval: 30_000,
    maxObservedItems: 200,
    staleItemThreshold: 300_000,
  },
  heavyUpdateInterval: 1000, // ms – doubles in performance mode
};
```

Modes can be switched via `onPerformanceModeChange("performance"|"quality")`.

---

## 4 ▪ Public API

| Method                          | Description                                              |
| ------------------------------- | -------------------------------------------------------- |
| `initialize()`                  | Sets up observers, registers with animation coordinator. |
| `onAnimate(delta)`              | Frame hook when under MasterAnimationCoordinator.        |
| `updateAnimation(ts,delta)`     | Internal rAF loop when standalone.                       |
| `updateModeConfiguration(cfg)`  | Accepts glyphIntensity etc. from theme settings.         |
| `onPerformanceModeChange(mode)` | Toggled by external performance monitor.                 |
| `destroy()`                     | Disconnects observers, cancels rAF, cleans maps.         |

---

## 5 ▪ SCSS Integration

| Variable / Attr      | Description                                                                   | Default       |
| -------------------- | ----------------------------------------------------------------------------- | ------------- |
| `data-sn-glyph`      | Attribute added to host element; `_sn_data_glyphs.scss` styles its `::after`. | —             |
| `--glyph-intensity`  | 0-1 value driven by music energy and attention score.                         | 0             |
| `--sn-glyph-opacity` | Direct opacity for `::after`. Derived from intensity.                         | 0             |
| `--sn-glyph-scale`   | Scale transform for growing/shrinking dot.                                    | 1             |
| `.sn-temporal-echo`  | Ripple element pooled by DGS for hover echoes.                                | CSS keyframes |

> The SCSS file also defines meditation/desaturation variables for future sidebar biometric feedback—they are _not_ set by DGS yet.

---

## 6 ▪ Usage Example

```ts
// Custom system reading glyph intensity to drive a tooltip
GlobalEventBus.subscribe("visual/pulse", () => {
  document.querySelectorAll("[data-sn-glyph]").forEach((el) => {
    const intensity = parseFloat(
      getComputedStyle(el).getPropertyValue("--glyph-intensity")
    );
    if (intensity > 0.7) showTooltip(el, "🔥 Hot track!");
  });
});
```

---

## 7 ▪ Best Practices

1. **Zero-cost rendering** – rely on CSS `::after`, avoid adding extra children.
2. **Respect caps** – don't manually increase `maxObservedItems` > 300 without testing FPS on low-end devices.
3. **Accessibility** – DGS automatically disables echoes in `prefers-reduced-motion`.
4. **Reuse echoPool** – when spawning custom echoes, call `acquireEchoElement()` & `releaseEchoElement()`.

---

## 8 ▪ Roadmap

| Phase | Item                                                       |
| ----- | ---------------------------------------------------------- |
| 3     | Encode semantic icons (🎧, 🎶) depending on content type.  |
| 4     | Feed `UserGenreHistory` into glyph colour palette.         |
| 4     | Expose ARIA-labelled glyph for screen-reader hints.        |
| 5     | GPU Canvas glyph mode using WebGPU for thousands of items. |

---

## 9 ▪ Status

- **Beta** – API stabilising; visual spec may iterate.
- **Introduced:** v0.9 (May 2025)

---

_“From small dots, big stories emerge.”_
