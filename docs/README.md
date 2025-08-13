# 🌌 **Catppuccin StarryNight Theme — Documentation Hub**

> **Purpose:** give both **humans** and **AI models** a concise map of the theme's architecture, files, and core ideas. Feed this file first — it links to every deeper doc.

> **ℹ️ Architecture status**: The **Visual Effects Coordination System** is **✅ production-ready** and enabled by default.
> The theme uses coordinated background systems with WebGL enhancement and automatic CSS fallbacks for optimal performance and compatibility.

---

## 1 What is StarryNight?

Catppuccin StarryNight is a **music-reactive, performance-aware, visually coordinated theme** for Spotify (via Spicetify). It blends a dynamic colour pipeline, beat-synchronised visuals, and progressive enhancement through a unified Visual Effects Coordination system to turn the client into an immersive, low-jank canvas.

Key pillars:

1. **Dynamic Palette** — RGB variables evolve with album art & Catppuccin flavour.
2. **Visual Effects Coordination** — Background systems coordinate through shared state for unified experiences.
3. **Performance Core** — single rAF loop + CSS-variable batching maintain 60 FPS.
4. **Graceful Degradation** — reduced-motion, low-tier hardware, and degraded mode all supported.

---

## 2 Folder Map

| Path                           | Contents (high-level)                                        |
| ------------------------------ | ------------------------------------------------------------ |
| `docs/core_systems/`           | Performance / scheduling / settings infrastructure           |
| `docs/DragAndDrop/`            | Advanced drag-and-drop UX stack                              |
| `docs/CI_CD/`                  | CI/CD pipeline and architecture documentation                |
| `docs/architecture/`           | Architecture examples, migration guides, performance        |
| `docs/development/`            | AI framework, directory structure, project rules            |
| `docs/spotify/DOM_TARGETTING/` | Canonical Spotify selector references                        |
| Other root docs                | API_REFERENCE, VISUAL_SYSTEMS_REFERENCE, VISUAL_EFFECTS_COORDINATION, etc. |

---

## 3 Quick Index (expand per section)

<details>
<summary>▶ Core Systems</summary>

| Document                          | Topics                                      |
| --------------------------------- | ------------------------------------------- |
| `CSS_VARIABLE_BATCHER.md`         | Batched `style.setProperty()`; perf metrics |
| `PERFORMANCE_ANALYZER.md`         | FPS & health telemetry; quality gating      |
| `MASTER_ANIMATION_COORDINATOR.md` | Central rAF loop; priority scheduling       |
| `DEVICE_CAPABILITY_DETECTOR.md`   | Hardware profiling & quality tiers          |
| `SETTINGS_SYSTEM.md`              | Validation, persistence, React wrapper      |
| `TIMER_CONSOLIDATION_SYSTEM.md`   | setInterval funnel & budgeting              |
| `EVENT_BUS.md`                    | Lightweight pub/sub utility                 |
| `USER_HISTORY_STORE.md`           | Tracks seen genres for discovery cues       |

</details>

<details>
<summary>▶ Effects</summary>

- `ABERRATION_CANVAS.md` — chromatic RGB-split overlay.
- `PRISMATIC_SCROLL_SHEEN.md` — hue-shift linked to scroll.
- `Data_Glyph_System.md` — adaptive glyph dots on tracks/cards.
- `DIMENSIONAL_NEXUS_SYSTEM.md` — navigation-field warp & meditation states.
- `Predictive_Behavior_Systems.md` — anticipatory glows & behavioural prediction.
- `VISUAL_EFFECTS_COORDINATION.md` — **✅** Visual Effects Coordination Architecture with unified state management.

</details>

<details>
<summary>▶ BeatSync & Audio</summary>

- `BEATSYNC_IMPLEMENTATION.md` — kinetic-verb blueprint.
- `BMP_HARMONY_ENGINE.md` — intelligent BPM & harmony engine.
- `ENHANCED_BPM_IMPLEMENTATION.md` — Cat-Jam-style tempo refinement.

</details>

<details>
<summary>▶ Drag-and-Drop</summary>

- `DRAG_AND_DROP_OVERVIEW.md` — architecture & roadmap.
- `DRAG_CARTOGRAPHER.md` — selector logging utility.
- `ENHANCED_DRAG_PREVIEW.md` — hi-DPI canvas drag ghost.
- `QUICK_ADD_RADIAL_MENU.md` — MRU radial & sidebar clone overlay.

</details>

<details>
<summary>▶ Theme System</summary>

- `COLOR_HARMONY_ENGINE.md` — RGB pipeline & dynamic extraction.
- `LERP_SMOOTHING_INTEGRATION.md` — colour easing mathematics.
- `NEBULA_VISUAL_SYSTEM.md` — atmospheric glow stack (CSS + WebGL).

</details>

<details>
<summary>▶ Spotify Selector Guides</summary>

- `mainView_DOM.md`, `navbar_DOM.md`, `nowPlaying_DOM.md`, `rightSidebar_DOM.md` — stable selector cheat-sheets.

</details>

---

## 4 Choose Your Own Adventure

| You are…                | Start here                                                    |
| ----------------------- | ------------------------------------------------------------- |
| **New Contributor**     | `VISUAL_SYSTEMS_REFERENCE.md` then `VISUAL_EFFECTS_COORDINATION.md`  |
| **Performance Auditor** | `PERFORMANCE_OPTIMIZATION_GUIDELINES.md` + `PERFORMANCE_ARCHITECTURE_GUIDE.md` |
| **Design Theorist**     | `MASTER_ARCHITECTURE_OVERVIEW.md` + `ORGANIC_CONSCIOUSNESS_GUIDE.md`         |
| **AI / LLM**            | This file → follow folder map as needed                       |

---

## 5 Status Badges

- **✅ Stable** — unlikely to change soon.
- **🟢 Active** — evolving but safe to rely on.
- **🚧 In Progress** — expect breaking tweaks.

Individual docs declare a badge in their header.

---

_Last updated: **August 2025** — Visual Effects Coordination System v1.0.0_
