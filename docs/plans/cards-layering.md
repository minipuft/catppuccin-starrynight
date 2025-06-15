# Card Layering Ownership Matrix

> **Purpose**: Establish clear ownership of `.main-card-card`–related styling across the code-base so that future refactors (Phase 2+) can move quickly without side-effects.
>
> **Modules under review**
>
> 1. `src/components/_sn_card_non_search.scss` – "Lite / Non-Search" cosmic styling.
> 2. `src/components/_sn_enhanced_cards.scss` – High-intensity "Cosmic Mode" styling.

---

## 📑 Selector Matrix

| Selector / Pattern                                                                   | Concern Category                    | `_sn_card_non_search.scss` | `_sn_enhanced_cards.scss` | Duplicate? |
| ------------------------------------------------------------------------------------ | ----------------------------------- | -------------------------- | ------------------------- | ---------- |
| `.main-card-card`                                                                    | Base block styles                   | ✅ (lines 102-170)         | ✅ (lines 117-210)        | ⚠ **Yes**  |
| `.main-card-card:hover`                                                              | Hover feedback                      | ✅                         | ✅                        | ⚠ **Yes**  |
| `.main-card-card:active` & variants (`&.sn-card-selected`, `[aria-selected="true"]`) | Active / selected state             | ✅                         | ✅                        | ⚠ **Yes**  |
| `.main-card-card::before / ::after`                                                  | Decorative particles & energy bloom | ✅                         | ✅                        | ⚠ **Yes**  |
| `body:not(:has(.main-searchPage-content)) .main-card-card`                           | Search-exclusion wrapper            | ✅                         | ✅                        | ⚠ **Yes**  |
| `.main-searchPage-content .main-card-card`                                           | Hard quarantine in search           | ✅                         | ➖                        | —          |
| `.main-card-header`, `.main-card-PlayButtonContainer`                                | Card sub-elements                   | ➖                         | ✅                        | —          |
| Media-query blocks (`prefers-reduced-motion`, `prefers-contrast`, etc.)              | Accessibility & perf                | ✅                         | ✅                        | ⚠ **Yes**  |

> **Legend**: ✅ — selector present, ➖ — not present, ⚠ — identical selector appears in both modules.

---

## 🎛️ Custom Property (CSS Variable) Inventory

| Variable Prefix                                                         | Defined In `non_search`               | Defined In `enhanced`                   | Duplicate Definition? |
| ----------------------------------------------------------------------- | ------------------------------------- | --------------------------------------- | --------------------- |
| `--sn-card-*`                                                           | **32** vars (gravity, harmonic, etc.) | 0                                       | —                     |
| `--card-*` (generic cosmic)                                             | 0                                     | **28** vars (holographic, energy, etc.) | —                     |
| **Shared root-level theme vars** (`--sn-gradient-*`, `--spice-*`, etc.) | Referenced only                       | Referenced only                         | n/a                   |

Observation: **No literal variable name collisions** today. Collision risk comes from _selector_ duplication, not var-name duplication.

---

## 🎞️ Keyframe Ownership

| Keyframe Name               | `_sn_card_non_search.scss` | `_sn_enhanced_cards.scss` | Duplicate? |
| --------------------------- | -------------------------- | ------------------------- | ---------- |
| `stellar-breathing`         | ✅                         | ➖                        | —          |
| `gravitational-field-pulse` | ✅                         | ➖                        | —          |
| `cosmic-resonance-pulse`    | ✅                         | ➖                        | —          |
| `chromatic-harmony-shift`   | ✅                         | ➖                        | —          |
| `constellation-orbit`       | ✅                         | ➖                        | —          |
| `nebula-drift`              | ✅                         | ➖                        | —          |
| `nexus-focus-pulse`         | ➖                         | ✅                        | —          |
| `energy-source-rotation`    | ➖                         | ✅                        | —          |

No identical `@keyframes` across the two modules.

---

## 🔍 Hard Duplicate Lines (same selector **and** property)

Below is a quick spotlight of high-risk duplicates that will need resolution in Phases 2-4:

1. **`.main-card-card { transition: … }`** — Both files set `transition` (different variable sets). Cascades can overwrite unpredictably.
2. **`.main-card-card:hover { box-shadow: … }`** — Competing hover shadows.
3. **`body:not(:has(.main-searchPage-content)) .main-card-card { position: relative; border-radius: … }`** — Both define radius/background; must split base vs cosmic.
4. **Accessibility media queries** — Both reset animations under `prefers-reduced-motion` resulting in duplicated declarations.

---

## 📈 Next Steps

- Phase 2 will introduce a new `src/components/_sn_card_base.scss` partial that **owns**:
  - Positioning, border-radius, default background & shadow
  - Core transitions & reduced-motion fallbacks
- Phase 3 will re-scope `_sn_card_non_search.scss` to _lite_ hover & search-quarantine only.
- Phase 4 will prune `_sn_enhanced_cards.scss` to own all **high-intensity kinetic effects**.

---

_Generated on_: 2025-06-15
