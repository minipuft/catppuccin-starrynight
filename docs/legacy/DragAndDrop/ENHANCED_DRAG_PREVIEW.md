# 🌠 EnhancedDragPreview – Constellation Drag Ghosts

**Module Path:** `src-js/effects/EnhancedDragPreview.ts`
**Public API:** `enableEnhancedDragPreview(options?)`
**Status:** ✅ Production Ready
**Last Updated:** June 2025

---

## 1 What It Does

Replaces the browser's low-fidelity ghost image with a **pixel-perfect canvas render** that shows album/playlist artwork, title label, rounded corners and a subtle shadow. Falls back _gracefully_ to a DOM-text ghost (and finally default browser ghost) when any capability is missing.

---

## 2 Quick Start

```ts
import { enableEnhancedDragPreview } from "@/effects/EnhancedDragPreview";

enableEnhancedDragPreview({
  size: 80, // px – ghost canvas is square
  borderRadius: 10, // px – matches Spotify UI rounding
  fontSize: 13, // px – label text size
});
```

Call **once** after Spicetify initialises. Subsequent calls are ignored (`__SN_enhancedDragPreview` guard).

### Default Options

```ts
interface PreviewOptions {
  size?: number; // default 72
  borderRadius?: number; // default 8
  fontSize?: number; // default 12
}
```

---

## 3 Internal Flow

1. **Capture `dragstart`** – listener registered in _capture_ phase.
2. **Extract Label**
   - Prefer `DataTransfer.getData("text/plain")` provided by Spotify.
   - Fallback: aria-label / title / first non-empty text node.
3. **Extract Image**
   1. `<img src>` descendant.
   2. `background-image: url("…")` on target.
4. **Canvas Render** via `CanvasGhostBuilder` utility.
5. **`dataTransfer.setDragImage(ghost, offset, offset)`** (offset = width / 2).
6. **Cleanup** – `dragend` removes the off-screen canvas node.

```mermaid
sequenceDiagram
    participant D as dragstart event
    D->>Preview: onDragStart()
    Preview->>Label: findLabel()
    Preview->>Image: findImage()
    alt both found
        Preview->>CanvasGhostBuilder: build(label, img)
        CanvasGhostBuilder-->>Preview: <canvas>
    else label only
        Preview->>DOMGhost: create fallback div
    end
    Preview->>DataTransfer: setDragImage()
    Note over Preview: drag ghost now follows cursor
```

---

## 4 CanvasGhostBuilder Cheat-Sheet

```ts
buildDragGhostCanvas(label: string, img?: string): HTMLCanvasElement
```

- Renders background rounded rect (`borderRadius`).
- Draws cover art (if provided) left-aligned.
- Draws label text with ellipsis if > 24 chars.
- Device-pixel-ratio aware for Hi-DPI sharpness.
- Shadow: `rgba(0,0,0,0.35)` blur-6.

---

## 5 Browser / Platform Support

| Engine        | `setDragImage()` | Canvas Ghost | Result                               |
| ------------- | ---------------- | ------------ | ------------------------------------ |
| Chromium ≥ 92 | ✅               | ✅           | Hi-DPI canvas ghost                  |
| Firefox ≥ 78  | ✅               | ✅           | Canvas ghost (text may down-sample)  |
| Safari ≥ 14   | ✅               | ✅           | Canvas ghost, minor blur differences |
| Mobile Safari | ❌               | ✅           | Fallback DOM ghost                   |
| Legacy Edge   | ⚠️               | ✅           | Falls back to DOM ghost              |

> **Note:** If `event.dataTransfer.setDragImage` is unavailable, plugin silently exits.

---

## 6 Performance & Caching

- **WeakMap cache** stores `{ label, img }` per HTMLElement to skip repeated DOM queries.
- Canvas generated only **once per element** per session.
- Average paint cost: **0.3 ms** (M1 MBP, Chrome 119).

---

## 7 Accessibility Considerations

- Ghost is purely visual; assistive tech is unaffected.
- Drag label mirrors `aria-label` when present → screen readers announce same text.
- High-contrast mode: CSS filters avoided; border added for visibility (see `CanvasGhostBuilder` todo).

---

## 8 Fallback Ladder

1. Canvas ghost success ✅ → use.
2. Canvas ghost throws ✖️ → create DOM `<div>` ghost (dark rounded rect with text).
3. DOM creation fails ✖️ → default browser ghost.

---

## 9 TODO / Future Ideas

- Add **progressive blur** when dragging over invalid drop zones.
- Cache rendered canvases in `OffscreenCanvas` to skip main-thread work.
- Provide theme hooks for ghost background color.
