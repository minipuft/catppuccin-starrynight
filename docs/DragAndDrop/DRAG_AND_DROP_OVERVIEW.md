# 🌌 Drag-and-Drop UX Stack – Overview

**Document Version:** 1.0
**Status:** 🚧 In Progress (Core modules stable, API surface frozen)
**Last Updated:** June 2025

---

## 🚀 Motivation

Spotify's default drag-and-drop experience is limited to plain-text ghosts and long pointer travel to the sidebar. StarryNight upgrades this flow to a **rich, context-aware drag system** that feels instant and playful while retaining complete fallback safety.

| Phase | Milestone                  | Key Modules                                  | Result                                                                       |
| ----- | -------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| **1** | Mapping & capability audit | `DragCartographer`                           | Logged thousands of native `dragstart` selectors to build a reliability map. |
| **2** | Visual Ghost Upgrade       | `EnhancedDragPreview` + `CanvasGhostBuilder` | Hi-DPI drag ghosts with artwork, label, drop shadow and memory cache.        |
| **3** | Sidebar Morph Prototype    | `SidebarCloneOverlay` + `flipSpring`         | FLIP-spring animation clones real sidebar to cursor, honours reduced-motion. |
| **4** | Quick-Add Menu             | `QuickAddRadialMenu` + Houdini Aura          | Five-button radial, MRU storage, 1-5 keyboard shortcuts, live region a11y.   |

> **Performance Guard:** A runtime capability detector (`sidebarDetector.ts`) ensures older browsers or low-perf devices fall back to legacy behaviour.

---

## 🧩 Core Modules

| Module                | Purpose                                                                                                                                              | Public API                               | Location                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------- |
| `DragCartographer`    | Debug-only tracker that logs every `dragstart` selector & payload. Aids future resilience audits.                                                    | `enableDragCartography()` `getDragMap()` | `src-js/debug/DragCartographer.ts`      |
| `EnhancedDragPreview` | Injects a custom drag ghost via `dataTransfer.setDragImage()`. Uses canvas for pixel-perfect rendering with graceful DOM fallback.                   | `enableEnhancedDragPreview(opts?)`       | `src-js/effects/EnhancedDragPreview.ts` |
| `QuickAddRadialMenu`  | After **HOLD + STILL** gesture, shows radial overlay of recent playlists allowing click or `1-5` keypress. Falls back to sidebar clone when capable. | `enableQuickAddRadialMenu()`             | `src-js/effects/QuickAddRadialMenu.ts`  |
| `SidebarCloneOverlay` | Deep-clones sidebar, applies `contain: paint`, FLIP-springs to pointer. Invoked from radial when environment supports it.                            | internal async import                    | `src-js/effects/SidebarCloneOverlay.ts` |

---

## 🌐 Capability Detection Flow

```mermaid
flowchart TD
    A[dragstart] --> B{sidebarCloneCapable()}
    B -- yes --> C[SidebarCloneOverlay.launch()]
    B -- no --> D[QuickAddRadialMenu.createOverlay()]
```

1. `dragstart` captured in **capture phase**.
2. Pointer coordinates + DataTransfer URIs stored.
3. `pointermove` distance ≤ _MOVE_THRESHOLD_ (**8 px**) starts HOLD timer.
4. After _HOLD_MS_ (**250 ms**) either sidebar clone or radial appears.

---

## ♿ Accessibility Highlights

- **Live Region:** `#sn-live` (polite) announces menu open & success states.
- **Reduced-Motion:** Media query aborts FLIP & spring animations.
- **Keyboard Mapping:** Numeric keys `1-5` activate corresponding playlist buttons.
- **Hover Aura:** Houdini paint worklet (`quickAddAura.js`) provides non-essential glow that degrades silently.

---

## 🔒 Reliability & Fallback Strategy

- Every module is **idempotent** – multiple `enable*()` calls are safe during hot-reload.
- If any step throws, a `console.debug()` log is emitted and native Spotify D-n-D continues unaffected.
- Drag ghost creation path is wrapped in `try/catch`; on failure we revert to browser default ghost.

---

## 🛠️ Developer Hooks

```javascript
import { enableDragCartography } from "@/debug/DragCartographer";
import { enableEnhancedDragPreview } from "@/effects/EnhancedDragPreview";
import { enableQuickAddRadialMenu } from "@/effects/QuickAddRadialMenu";

// Usually called in theme.entry.ts (after Spicetify loaded)
if (YEAR3000_CONFIG.enableDebug) enableDragCartography();
enableEnhancedDragPreview({ size: 80, borderRadius: 10 });
enableQuickAddRadialMenu();
```

---

## 🗺️ Future Work

- AbortController support for hold timer (cancel on long scroll).
- Spring overshoot analytics → dynamic stiffness tuning.
- Selector resilience audit running weekly via CI.
- FLIP reverse animation when radial closes.
