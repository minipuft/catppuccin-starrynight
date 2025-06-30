# 🌌 QuickAddRadialMenu – Quasar Quick-Add

**Module Path:** `src-js/effects/QuickAddRadialMenu.ts`
**Public API:** `enableQuickAddRadialMenu()`
**Status:** ✅ Production Ready
**Last Updated:** June 2025

---

## 1 UX at a Glance

Drag a track and **hold** the pointer for _250 ms_ without moving more than **8 px** → a five-button radial pops up under the cursor, showing your **Most-Recently-Used (MRU) playlists**. Release over a button or press **1-5** to drop instantly – no sidebar travel needed.

If the environment supports **Sidebar Clone** animation (`isSidebarCloneCapable()`), the radial defers to `SidebarCloneOverlay` for a richer morphing UI; otherwise it self-renders.

---

## 2 Interaction Timeline

```mermaid
sequenceDiagram
    participant U as User Pointer
    U->>B as dragstart
    B->>Q as onDragStart()
    Q->>Q: start holdTimer (250 ms)
    U->>Q: pointermove
    Q-->>Q: cancel timer if moved >8 px
    Note over Q: timer fires ⇒ overlay chosen
    alt Sidebar clone capable
        Q->>SidebarCloneOverlay: launchSidebarClone()
    else
        Q->>Q: createOverlay()
    end
    U->>Q: click / key 1-5
    Q->>Spicetify.CosmosAsync: POST /playlists/:id/tracks
    Q->>LocalStorage: update sn-recent-playlists
    Q->>ScreenReader: live region announce success
```

---

## 3 Constants

| Constant              | Default  | Purpose                                           |
| --------------------- | -------- | ------------------------------------------------- |
| `HOLD_MS`             | **250**  | Time to hold pointer still before overlay appears |
| `MOVE_THRESHOLD`      | **8 px** | Pointer movement tolerance during hold            |
| `MAX_PLAYLISTS_SHOWN` | **5**    | Buttons rendered in radial                        |

---

## 4 Accessibility

- **Live Region:** Hidden `<div id="sn-live" aria-live="polite">` announces menu open and success messages.
- **Keyboard:** Number keys **1-5** activate corresponding playlist buttons.
- **Reduced-Motion:** `prefers-reduced-motion: reduce` skips FLIP springs; buttons fade-in instantly.
- **Focus Safety:** Buttons are regular `<button>` elements with proper `title` attributes.

---

## 5 Playlist Source Hierarchy

1. **MRU LocalStorage** – `sn-recent-playlists` (fast, personalised).
2. **Sidebar Scrape** – scratches DOM for visible playlists (offline friendly).
3. **Spotify Web API** – `GET /v1/me/playlists?limit=10` via Spicetify Cosmos (network fallback).

### MRU Schema

```ts
interface PlaylistInfo {
  uri: string;
  name: string;
  image: string;
}
```

Stored as JSON array, capped at **10** entries.

---

## 6 Animation Details

- **FLIP + spring** via `utils/flipSpring.ts` (stiffness 220, damping 20).
- Buttons spawn at cursor center `scale(0.1)` → spring to circumference `radius 90 px`.
- Houdini `paint(sn-aura)` glow reacts to `--sn-glow-level` (hover state).

---

## 7 Developer Usage

```ts
import { enableQuickAddRadialMenu } from "@/effects/QuickAddRadialMenu";

enableQuickAddRadialMenu();
```

Will print sidebar capability status:

```
🌌 Quick-Add radial menu enabled
[StarryNight] Sidebar clone capability: true|false
```

---

## 8 Troubleshooting

| Symptom              | Possible Cause                  | Fix                                               |
| -------------------- | ------------------------------- | ------------------------------------------------- |
| Radial never appears | Pointer moves >8 px during hold | Increase `MOVE_THRESHOLD` or steady your hand 😉  |
| API call 403         | Cosmos token expired            | Restart Spotify or run `Spicetify.RefreshToken()` |
| Playlist art blank   | Playlist has no image           | Fallback CSS provides gradient background         |

---

## 9 Future Enhancements

- **AbortController** to cancel hold when scrolling lists.
- **Adaptive Hold** – shorten `HOLD_MS` when user frequently uses radial.
- **Rotation Parameter** – allow wheel to rotate button order.
- **Reverse FLIP** when overlay closes.
