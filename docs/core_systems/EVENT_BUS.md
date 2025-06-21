# 🏷️ Event Bus

## Overview

`EventBus` is a minimal **publish / subscribe** utility used for decoupled intra-theme communication. It sits at the core of StarryNight's runtime, enabling modules to share state changes without direct imports.

- **File:** `src-js/core/EventBus.ts`
- **Exports:**
  - `EventBus` class – for custom instances.
  - `GlobalEventBus` singleton – exposed at `globalThis.GlobalEventBus` in dev.

---

## 1 ▪ Basic Usage

### Publish / Subscribe

```ts
import { GlobalEventBus } from "@/core/EventBus";

type AuraPayload = { hue: number; intensity: number };

// Subscribe
const unsubscribe = GlobalEventBus.subscribe<AuraPayload>(
  "artist:aura",
  (payload) => console.log("Aura updated", payload)
);

// Publish
GlobalEventBus.publish<AuraPayload>("artist:aura", {
  hue: 280,
  intensity: 0.7,
});

// Later…
unsubscribe();
```

---

## 2 ▪ Public API

| Method                    | Signature               | Purpose                                   |
| ------------------------- | ----------------------- | ----------------------------------------- |
| `subscribe(topic, cb)`    | Returns `unsubscribe()` | Listen for events on `topic`.             |
| `publish(topic, payload)` | void                    | Notify all subscribers.                   |
| `unsubscribe(topic, cb)`  | void                    | Remove specific listener.                 |
| `destroy()`               | void                    | Clear all subscriptions (for hot-reload). |

Type safety is achieved through generic `<T>` payload parameter.

---

## 3 ▪ Design Decisions

1. **Zero deps** – avoids popular but heavy libraries (mitt, nanoevents).
2. **Set-based storage** – O(1) add/remove & prevents duplicate callbacks.
3. **Global debug exposure** – during dev, scripts can call `window.GlobalEventBus.publish(...)` from DevTools.

---

## 4 ▪ Integration Examples

- **MasterAnimationCoordinator** – planned to emit `modeChange` events.
- **NebulaController** – publishes `nebula:ready` once WebGPU pipeline initialised.
- **SettingsManager** – broadcasts `settings:changed:key` for reactive UI updates.

---

## 5 ▪ Best Practices

1. Namespace topics (`feature:event`) to avoid collisions.
2. Always keep a reference to the `unsubscribe` function to avoid leaks.
3. Do not rely on delivery order; treat handlers as independent.

---

## 6 ▪ Roadmap

| Phase | Improvement                                            |
| ----- | ------------------------------------------------------ |
| 2     | Wildcard topic matching (`sidebar:*`).                 |
| 3     | Dev overlay panel to list active topics & subscribers. |

---

## 7 ▪ Status

- **Introduced:** v1.0 (Jan 2025)
- **API Stability:** Stable – breaking changes require major bump.

---

_"Talk less, sync more."_
