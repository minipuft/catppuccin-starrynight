# 🛰️ DragCartographer – Stellar Drag Mapping

**Module Path:** `src-js/debug/DragCartographer.ts`
**Public API:** `enableDragCartography()` • `getDragMap()`
**Introduced:** Phase 1 (June 2025)
**Status:** ✅ Stable • **Debug-only** (excluded from production bundles)

---

## 1 Purpose

DragCartographer is a lightweight listener that records **every** native `dragstart` that fires inside the Spotify client. It stores a concise CSS-selector path, timestamp and drag payload. The resulting map is invaluable for:

- Understanding which DOM nodes start Spotify's proprietary drag flows.
- Designing resilient selectors for advanced drag enhancements.
- Measuring real-world feature usage before changing UX.

---

## 2 Activation

```javascript
import { enableDragCartography } from "@/debug/DragCartographer";

if (YEAR3000_CONFIG.enableDebug) enableDragCartography();
```

**Idempotent:** multiple calls are safe – the listener is attached once.

During local dev the module is conditionally imported in `theme.entry.ts` when:

```javascript
YEAR3000_CONFIG.enableDebug === true;
```

---

## 3 Logged Data Model

```ts
interface DragStartLog {
  time: string; // locale time, e.g. "14:33:02"
  selector: string; // truncated CSS path (depth ≤ 4)
  uris?: string[]; // dragged spotify URIs, if present
  label?: string; // text/plain label from DataTransfer
  contextUri?: string; // (future) originating context – not yet used
  sectionIndex?: number; // (future) section index in playlist grid
}
```

Aggregated in memory:

```ts
interface DragAggregate {
  selector: string;
  count: number; // occurrences this session
  samples: DragStartLog[]; // ≤ 3 exemplar events
}
```

---

## 4 Retrieving the Map

```javascript
import { getDragMap } from "@/debug/DragCartographer";

console.table(getDragMap().slice(0, 10));
```

Example output:

| selector                        | count | sample payload                            |
| ------------------------------- | ----- | ----------------------------------------- |
| `div.main-trackList-row > span` | 57    | `spotify:track:4uLU6hMCjMI75M1A2tKUQC`    |
| `a[data-testid="rootlist-row"]` | 31    | `spotify:playlist:37i9dQZF1DXcBWIGoYBM5M` |

---

## 5 Implementation Highlights

- **Capture-phase listener** ensures even cancelled drags are logged.
- **WeakSet guard** prevents logging the same DOM node twice per session.
- **Selector builder** traverses at most 4 ancestors → predictable, concise output.
- Aggregation uses a **static `Map`** so multiple hot reloads share state.

---

## 6 Performance

DragCartographer adds **<0.1 ms** overhead per `dragstart` (Chrome 119, M1 MacBook). Memory cost is bounded by the number of unique drag sources encountered during a session (~1-3 KB typical).

---

## 7 Safety & Production Guard

- The module lives under `src-js/debug/` and is **tree-shaken out** in production builds.
- When included, its side-effects are read-only (console + in-memory map).
- No external network calls are made.

---

## 8 Roadmap / TODO

- Add CSV export helper for CI selector-drift testing.
- Persist aggregate to `localStorage` when `enableDebug.persist` flag is on.
- Surface **heat-map overlay** for visualising drag hot-zones.
