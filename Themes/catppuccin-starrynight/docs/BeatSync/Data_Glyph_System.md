# Data Glyph System – BeatSync Integration

> Baseline & responsibilities cross-map (Phase 1 – Requirements Convergence)

---

## 0 ▪ Context

The canonical specification lives under `docs/effects/Data_Glyph_System.md`.
This file tracks **BeatSync-specific responsibilities, performance deltas** and
other analysis outputs required by _Phase 1 — Requirements Convergence & Baseline_.

---

## 1 ▪ Baseline Metrics (60 s Scroll Session)

| Metric                       | Value | Source                 |
| ---------------------------- | ----- | ---------------------- |
| Average FPS                  | TODO  | MAC-perf overlay       |
| Δ Memory (usedJSHeapSize)    | TODO  | PerformanceAnalyzer    |
| Echo count (peak)            | TODO  | `getMetricsSnapshot()` |
| Glyph updates / sec (approx) | TODO  | DGS internal counter   |

Raw JSON artefact: `docs/perf-baselines/2025-06-21_dgs_60s_baseline.json`.

---

## 2 ▪ Year 3000 Kinetic Verbs Cross-Map

| Kinetic Verb | DGS Responsibility                                                  | Gap / Deviation |
| ------------ | ------------------------------------------------------------------- | --------------- |
| _Sprinkle_   | Places glyph dot on track rows.                                     | —               |
| _Pulse_      | Echo ripple appears on hover / beat.                                | —               |
| _Breathe_    | Glyph intensity follows energy envelope.                            | —               |
| _Coalesce_   | ✖ Not yet implemented. Requires clustering glyphs when items group. |
| _Cascade_    | ✖ Deferred – DGS does not trigger chain reactions across systems.   |

_Note: See Year 3000 design docs › "Kinetic Verbs" §2 for definitions._

---

## 3 ▪ Missing Hooks & Variables (Open Docs Gaps)

- [ ] `--sn-glyph-energy-gradient` – referenced in SCSS but undefined.
- [ ] Selector map for Library Episode rows (Podcast) missing.
- [ ] Health-check hook for **echoPool length** not wired into `SystemHealthMonitor`.

---

## 4 ▪ Next Steps

1. Populate baseline JSON with real values (run overlay & commit).
2. File issue for _Coalesce_ verb implementation.
3. Extend selector map and CSS variable definitions.

---

_Last updated: 2025-06-21_
