### Now Playing Bar (`.Root__now-playing-bar`)

The bottom bar containing player controls, track information, and additional options.

- **Overall Structure:**

  - `div.Root__now-playing-bar`: The outermost container for the entire now playing bar.
  - `aside[aria-label="Now playing bar"][data-testid="now-playing-bar"]`: A semantic wrapper for the now playing bar's contents.
  - `div.main-nowPlayingBar-nowPlayingBar`: An inner wrapper directly containing the left, center, and right sections.

- **Left Controls & Track Info:**

  - `div.main-nowPlayingBar-left`: Container for the album art, track title, artist, and like button.
    - `div[data-testid="now-playing-widget"]` (often with class `main-nowPlayingWidget-nowPlaying`): The core widget displaying the currently playing track's cover art and textual information.
    - `div[data-testid="CoverSlotCollapsed_container"]` (often with class `main-coverSlotCollapsed-container`): Contains the small album artwork displayed in the now playing bar.
    - `div.main-nowPlayingWidget-trackInfo` (often with class `main-trackInfo-container`): Wraps the track title and artist name(s).
    - `span.stars-now-playing#stars-now-playing`: A specific span element, potentially used by themes for custom visual effects (e.g., star animations).
    - `button.main-addButton-button.control-button-heart`: The button to add/remove a track from "Liked Songs" (heart icon). Its state can be determined by the `aria-checked` attribute.

- **Center Controls & Progress Bar:**

  - `div.main-nowPlayingBar-center`: Wrapper holding playback controls (play/pause, next/previous, shuffle, repeat) and the progress bar.
  - `div[data-testid="play-button"]`: Play/Pause toggle.
  - `div.main-nowPlayingBar-progressBar`: The track progress bar container.

- **Right Controls:**
  - `div.main-nowPlayingBar-right`: Container for volume control, device switcher, lyrics, and queue buttons.
  - `[data-testid="volume-bar"]`: Volume slider node.
  - `[data-testid="lyrics-button"]`: Lyrics toggle button.
  - `[data-testid="queue-button"]`: Queue toggle button.

### 2025 Snapshot – Key Stable Selectors

The May 2025 build keeps the same foundational structure but introduced more robust `data-testid` hooks. These anchors are preferable to hashed classnames when styling the Now Playing bar.

- **Root Bar:** `aside[data-testid="now-playing-bar"]`
- **Bar Wrapper:** `div.main-nowPlayingBar-nowPlayingBar`
- **Sections:**
  - Left → `div.main-nowPlayingBar-left`
  - Center → `div.main-nowPlayingBar-center`
  - Right → `div.main-nowPlayingBar-right`
- **Core Now-Playing Widget:** `div[data-testid="now-playing-widget"]`
  - Cover Art (collapsed) → `div[data-testid="CoverSlotCollapsed_container"]`
  - Track Info Wrapper → `div.main-trackInfo-container`
- **Primary Buttons:**
  - Like button → `button.control-button-heart`
  - Play/Pause toggle → `div[data-testid="play-button"]`
  - Queue toggle → `button[data-testid="queue-button"]`

> **Tip:** Attribute selectors like `[data-testid]` remain the most reliable method for theming, as Spotify often revs hashed class names.

---

<details>
<summary>Raw DOM Snapshot (May 2025)</summary>

```html
<div
  data-overlayscrollbars-initialize="true"
  class="cZCuJDjrGA2QMXja_Sua ZjfaJlGQZ42nCWjD3FDm"
  data-overlayscrollbars="host"
>
  <div
    class=""
    data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYHidden"
    tabindex="-1"
    style="margin-right: 0px; margin-bottom: 0px; margin-left: 0px; top: 0px; right: auto; left: 0px; width: calc(100% + 0px); padding: 0px;"
  >
    <div class="AAdBM1nhG73supMfnYX7 zduvaX0Ioxqd5ypeWoAf IkRGajTjItEFQkRMeH6v">
      <div class="nw2W4ZMdICuBo08Tzxg9" data-testid="NPV_Panel_OpenDiv">
        <div class="main-nowPlayingView-nowPlayingWidget">
          ...<!-- truncated for brevity -->
        </div>
      </div>
    </div>
  </div>
</div>
```

</details>
