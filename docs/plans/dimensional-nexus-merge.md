# Dimensional Nexus ➜ Sidebar Consolidation — Phase 1

> **Goal:** Inventory `_sn_dimensional_nexus.scss` and classify every block as **KEEP / DUPLICATE / MERGE** relative to the canonical sidebar modules.
>
> Once complete, Phase 2 will implement the actual consolidation.

---

## 🗂️ TO-DO Checklist

- [ ] **Generate raw diff**
  - Command: `git diff --no-index src/systems/_sn_dimensional_nexus.scss src/sidebar/_sidebar_background_effects.scss > docs/plans/diff_background_effects.patch`
  - Command: `git diff --no-index src/systems/_sn_dimensional_nexus.scss src/sidebar/_sidebar_interactive.scss > docs/plans/diff_interactive.patch`
- [ ] **Annotate `_sn_dimensional_nexus.scss`**
  - Open `src/systems/_sn_dimensional_nexus.scss`
  - For each _variable block_ (`:root { ... }`):
    - 🔖 Add one of the following comments directly above the block:
      - `// TODO-MERGE: unique vars ➜ _sidebar_background_effects.scss`
      - `// TODO-REMOVE-DUPLICATE: variable already defined`
- [ ] **Classify selector sections**
  - 🔎 Search for each top-level selector (e.g., `.sn-predictive-echo-item`, `.sn-dimensional-rift-target`, `.Root__nav-bar` enhancement layers).
  - Decide:
    - `KEEP` — if code already exists in sidebar modules.
    - `MERGE-TO-DIMENSIONAL-NEXUS` — if feature is unique.
    - `DELETE` — if obsolete or experimental.
  - ✅ Record decision as inline `// TODO:` comment above the selector.
- [ ] **Catalogue keyframes**
  - Make sure animation names are unique; flag duplicates for rename.
- [ ] **Update this checklist** with line numbers for every marked item (helps during Phase 2 extraction).
- [ ] **Create stub enhancement file**

  - Path: `src/sidebar/_sidebar_dimensional_nexus.scss`
  - Contents:

    ```scss
    // ████████████████████████████████████████████████████████████████
    // SIDEBAR DIMENSIONAL NEXUS — Enhancement Layer (Phase 2)
    // Consolidated unique effects from _sn_dimensional_nexus.scss
    // ████████████████████████████████████████████████████████████████

    /* TODO: Phase 2 will populate this file with merged sections */
    ```

- [ ] **Update architecture doc** (`src/core/_sn_architecture_documentation.scss`)
  - Replace the old path reference with the new sidebar module.

---

## 📝 Notes & Decisions Log

Please append any findings, uncertainties, or edge-cases here while working through the checklist.

## ✅ Phase 3 – Implementation Recap (17-Jun-2025)

- [x] Created `src/sidebar/_sidebar_dimensional_nexus.scss` and migrated unique Dimensional Rift enhancements.
- [x] Added `sn-rift-pulse` keyframes.
- [x] Ensured new import order in `src/core/_main.scss` (post-interactive).
- [x] Deprecated original `src/systems/_sn_dimensional_nexus.scss`.

---

## 🧹 Phase 4 – Final Clean-Up & Verification (To-Do)

- [x] **Run full SCSS compilation** to ensure there are _no_ `Undefined variable` or `Duplicate @keyframes` warnings.
- [ ] **Search repo** for `@use "../systems/_sn_dimensional_nexus"` or similar to confirm no lingering imports.
- [ ] **Smoke-test sidebar** in all energy modes (low/mid/high) to validate:
  - Dimensional Rift animation active when `--sn-dimensional-rift-intensity` > 0.
  - Predictive Echo shimmer unaffected.
  - No visual regressions in vibration or entanglement effects.
- [ ] **Add changelog entry**
  - File: `docs/CHANGELOG.md`
  - Version bump: `vNext` → "Sidebar Dimensional Nexus Consolidation".
  - Include migration note for theme customizers.
- [x] **Remove deprecated module** `src/systems/_sn_dimensional_nexus.scss`.
- [ ] **Update Architecture Doc Diagram** (optional) with new arrow from _Legacy Sidebar_ → _Sidebar Dimensional Nexus_.

---
