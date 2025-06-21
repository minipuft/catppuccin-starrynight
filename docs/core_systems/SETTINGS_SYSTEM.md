# ⚙️ Settings System

## Overview

The StarryNight **Settings System** provides a cohesive layer for **persisting**, **validating**, and **surfacing** user-configurable options inside Spotify's _Settings_ page. It is composed of:

1. **settingKeys.ts** – canonical string constants for every option.
2. **SettingsManager.ts** – reads/writes values in `Spicetify.LocalStorage`, enforces validation schemas, and dispatches change events.
3. **SettingsSection.tsx** – lightweight React wrapper that replaces the external `spcr-settings` dependency.
4. **StarryNightSettings.ts** – wires a `SettingsSection` instance into Spotify's preferences route.
5. **spcr-settings.d.ts** – local typings subset for compatibility.

---

## 1 ▪ Key Files

| File                                       | Purpose                                                       |
| ------------------------------------------ | ------------------------------------------------------------- |
| `src-js/config/settingKeys.ts`             | Centralised constants used across codebase & SCSS.            |
| `src-js/managers/SettingsManager.ts`       | Validation, defaults, localStorage IO, and change dispatch.   |
| `src-js/utils/SettingsSection.tsx`         | Minimal drop-in replacement for `spcr-settings` React helper. |
| `src-js/components/StarryNightSettings.ts` | Instantiates the Settings UI and binds reactions.             |
| `src-js/types/spcr-settings.d.ts`          | Partial type-defs for the removed `spcr-settings` package.    |

---

## 2 ▪ Setting Keys

```ts
// settingKeys.ts (excerpt)
export const ACCENT_COLOR_KEY = "catppuccin-accentColor";
export const GRADIENT_INTENSITY_KEY = "sn-gradient-intensity";
export const STAR_DENSITY_KEY = "sn-star-density";
export const CATPPUCCIN_FLAVOR_KEY = "catppuccin-flavor";
export const GLASS_LEVEL_KEY = "sn-glassmorphism-level";
export const GLASS_LEVEL_OLD_KEY = "sn-glassmorphismIntensity"; // legacy
// ... and so on
```

Using constants avoids typo bugs and enables **IDE autocomplete**.

---

## 3 ▪ SettingsManager

### 3.1 Validation Schema

```ts
// Shape
interface ValidationSchema {
  [K in keyof ThemeSettings]: {
    default: ThemeSettings[K];
    allowedValues?: ReadonlyArray<ThemeSettings[K]>;
  };
}
```

_On construction_ `SettingsManager` populates `validationSchemas` and calls `validateAndRepair()` – any missing/invalid value is replaced with its default.

### 3.2 Change Flow

```mermaid
graph LR
  A[UI / system] -->|set(key,val)| B[SettingsManager]
  B -->|validate| C[Spicetify.LocalStorage]
  C -->|CustomEvent year3000SystemSettingsChanged| D[Subscribers]
```

### 3.3 Public API

| Method                  | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| `get(key)`              | Returns strongly-typed value (post-validation).                  |
| `set(key,value)`        | Persists if valid & emits change event. Returns boolean success. |
| `getAllowedValues(key)` | Helper for UI dropdowns.                                         |
| `getAllSettings()`      | Snapshot object of _all_ values.                                 |
| `resetAllToDefaults()`  | Bulk revert.                                                     |
| `healthCheck()`         | Async check for storage availability.                            |

---

## 4 ▪ SettingsSection Helper

`SettingsSection.tsx` re-implements only the required field types (dropdown, toggle, input, button) to avoid the full `spcr-settings` bundle.

```tsx
const section = new SettingsSection(
  "StarryNight Theme",
  "starrynight-settings"
);
section.addDropDown(
  "catppuccin-flavor",
  "Catppuccin flavour",
  ["latte", "mocha"],
  1
);
await section.pushSettings();
```

Internally the component waits for Spotify's `Platform.History` router so it mounts reliably during navigation.

---

## 5 ▪ UI Bootstrap (StarryNightSettings.ts)

This module assembles a `SettingsSection`, registers a dozen controls, and hooks them to `SettingsManager` + live effect loaders (e.g., `applyStarryNightSettings`).

Key patterns:

1. **Graceful Degradation** – if the global Year3000System isn't ready, a local `SettingsManager` instance is created so the UI still functions.
2. **Event Propagation** – most `onChange` handlers ultimately call `settingsManager.set(...)` which triggers the shared change event consumed by visual subsystems.
3. **Navigation Re-render** – listens to Spotify's History changes so the panel stays reactive without page reloads.

---

## 6 ▪ Best Practices

1. **Always** import keys from `settingKeys.ts` – never inline strings.
2. Use `getAllowedValues()` to drive dropdown option lists.
3. When adding a new setting:
   a) Add constant → `settingKeys.ts`
   b) Extend `ThemeSettings` & `ValidationSchema` in `SettingsManager.ts`
   c) Surface control in `StarryNightSettings.ts`.
4. Avoid heavy work inside `onChange` handlers; delegate to effect modules.
5. Mark legacy keys (like `GLASS_LEVEL_OLD_KEY`) and keep migration logic until next major version.

---

## 7 ▪ Roadmap

| Phase | Plan                                                               |
| ----- | ------------------------------------------------------------------ |
| 2     | Move storage layer to `StorageManager` with cloud sync capability. |
| 3     | Add **import/export** JSON preset button to `SettingsSection`.     |
| 4     | Telemetry: log setting changes (opt-in) for UX research.           |

---

## 8 ▪ Status

- **Introduced:** v1.0 (Jan 2025)
- **API Stability:** Stable – new keys may be added, existing semantics remain.

---

_"Configure once, experience everywhere."_
