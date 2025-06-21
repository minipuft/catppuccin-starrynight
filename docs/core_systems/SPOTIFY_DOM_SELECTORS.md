# 🏷️ Spotify DOM Selectors Reference

## Overview

`SpotifyDOMSelectors.ts` centralises **all CSS selectors** used by Catppuccin StarryNight to interface with Spotify's internal DOM. By maintaining a single mapping we can:

1. **Update selectors in one place** when Spotify ships markup changes.
2. Provide _modern_ selectors while still exposing **graceful fall-backs** for legacy builds.
3. Offer helper functions & debug utilities for quick validation in the browser console.

> **File:** `src-js/debug/SpotifyDOMSelectors.ts`

---

## 1 ▪ Exposed Selector Maps

| Constant               | Type                           | Purpose                                                                                            |
| ---------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `MODERN_SELECTORS`     | `{ [key: string]: string }`    | Canonical, up-to-date selectors tested against current Spotify builds.                             |
| `LEGACY_SELECTORS`     | `{ [key: string]: string }`    | Older selectors retained for compatibility with pre-2023 Spotify clients.                          |
| `SELECTOR_MAPPINGS`    | `{ [legacy: string]: string }` | Migration map → auto-translates legacy selectors to their modern equivalents.                      |
| `ORBITAL_ELEMENTS`     | `{ [key: string]: string }`    | Elements that participate in orbital / gravity visual effects (Phase 2).                           |
| `GRAVITY_WELL_TARGETS` | `{ primary/secondary/... }`    | Categorised arrays of selectors used by the **Dimensional Nexus** & **SidebarConsciousnessSystem** |
| `ANTI_GRAVITY_ZONES`   | `{ [key: string]: string[] }`  | Regions that explicitly _disable_ gravity or hover effects.                                        |

All selector strings are lazily resolved via the memoised `$$` utility (see `src-js/utils/domCache.ts`).

---

## 2 ▪ Helper Functions

| Function                     | Signature                               | Description                                                                                 |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| `elementExists`              | `(selector: string) => boolean`         | Memoised check – returns `true` if at least one element matches.                            |
| `findElementWithFallback`    | `(modern, legacy?) => Element \| null`  | First tries the modern selector, then optional legacy selector while logging a warning.     |
| `findElementsWithFallback`   | `(modern, legacy?, opts?) => Element[]` | Same as above but returns all matches. Accepts `{ force?: boolean }` to bypass memoisation. |
| `validateSpotifyDOM`         | `() => ValidationReport`                | Iterates over **all** modern selectors, logs ✅/❌ results, returns summary object.         |
| `testGravitySystemSelectors` | `() => void`                            | Quick check for presence of gravity-well and orbital targets.                               |
| `validatePredictionTargets`  | `() => ValidationReport`                | Phase 2 helper: validates selectors required by **BehavioralPredictionEngine**.             |
| `testPhase2Systems`          | `() => any`                             | Aggregated health-check calling the above validators and returning issue counts.            |

### ValidationReport Shape

```ts
interface ValidationReport {
  found: number;
  missing: number;
  details: {
    [key: string]: {
      selector: string;
      exists: boolean;
      element: Element | null;
    };
  };
}
```

---

## 3 ▪ Global Debug Interface

On load, if `window` is available, the module attaches:

```js
window.SpotifyDOMSelectors = {
  validate: () => {...},
  testGravity: () => {...},
  validatePredictionTargets: () => {...},
  testPhase2Systems: () => {...},
  selectors: MODERN_SELECTORS,
  targets: GRAVITY_WELL_TARGETS,
  orbital: ORBITAL_ELEMENTS,
  antiGravity: ANTI_GRAVITY_ZONES,
};
```

Console helpers:

```js
SpotifyDOMSelectors.validate(); // ✅ Verify all selectors
SpotifyDOMSelectors.testGravity(); // ✅ Check gravity-well mappings
SpotifyDOMSelectors.validatePredictionTargets();
```

---

## 4 ▪ Integration Points

- **Visual Systems** – `DimensionalNexusSystem`, `BehavioralPredictionEngine`, and **QuickAddRadialMenu** query elements via `SpotifyDOMSelectors` ensuring they stay resilient to HTML changes.
- **Nebula & Particle Systems** – use `ORBITAL_ELEMENTS` to apply hover EGL shader effects.
- **Unit Tests** – call `validateSpotifyDOM()` inside Jest to fail early when Spotify's markup shifts.

---

## 5 ▪ Best Practices

1. **Always import selectors** from this module; avoid ad-hoc strings in feature code.
2. When adding new selectors **check for existing legacy variants** and update `SELECTOR_MAPPINGS` accordingly.
3. Log a _single_ warning when falling back to legacy selectors to avoid console spam.
4. Keep selector specificity minimal – prefer data-attributes (`[data-testid]`) over deep class chains.
5. Use `$$` for memoised queries; avoid `document.querySelectorAll` directly in hot paths.

---

## 6 ▪ Roadmap

| Phase | Planned Enhancement                                                                           |
| ----- | --------------------------------------------------------------------------------------------- |
| 2     | Auto-generate type-safe selector enums via code-gen script.                                   |
| 3     | Integrate **MutationObserver** to auto-refresh memoised WeakRefs on dynamic page transitions. |
| 4     | Provide a DevTools panel listing real-time selector hit-rates and stale cache info.           |

---

## 7 ▪ Status

- **Maintenance Level:** Actively monitored – selectors reviewed with each Spotify desktop release.
- **Last Audit:** January 2025
- **Version:** 1.0

---

**Happy selecting!**
