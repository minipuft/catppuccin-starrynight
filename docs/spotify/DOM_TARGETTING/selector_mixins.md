# Centralised Selector Mixin Matrix

> Living document – update whenever Spotify's DOM evolves.
> **Last Updated:** 2025-10-04 (Complete modular coverage: 74 mixins across 6 files - 82% documentation coverage)

## Layout & Navigation Selectors

| Mixin Name              | Attr-First Selector (preferred)                           | Legacy / Fallback Selector | Adopted Files (initial scan)                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `left-sidebar-root`     | `div[data-testid="Desktop_LeftSidebar_Id"].Root__nav-bar` | `.Root__nav-bar`           | `src/layout/_navbar.scss`, `src/layout/_sn_sidebar_navigation.scss`, `src/sidebar/_sidebar_background_effects.scss`, `src/sidebar/_sidebar_interactive.scss`, `src/features/_sn_glassmorphism.scss`, others |
| `right-sidebar-root`    | `div.Root__right-sidebar[data-testid="right-sidebar"]`    | `.Root__right-sidebar`     | `src/layout/_right_sidebar.scss`, `src/layout/.scss` `src/features/_sn_glassmorphism.scss`, `src/features/_sn_context_zones.scss`, `src/components/_sn_loading.scss`                                        |
| `now-playing-bar-root`  | `aside[data-testid="now-playing-bar"]`                    | `.Root__now-playing-bar`   | `src/components/_now_playing.scss`, `src/features/_sn_atmospheric.scss`, `src/features/_sn_glassmorphism.scss`, `src/features/_themed_interactive_components.scss`                                          |
| `main-view-root`        | `div.Root__main-view#main-view`                           | `.Root__main-view`         | `src/features/_sn_context_zones.scss`, `src/features/_sn_depth_layers.scss`, `src/features/_sn_z_index_management.scss`                                                                                     |
| `main-view-scroll-node` | `.Root__main-view .main-view-container__scroll-node`      | _(same)_                   | `src/layout/_sn_scroll_node_backgrounds.scss`, `src/features/_sn_depth_layers.scss`                                                                                                                         |
| `main-nav-link`         | `nav[aria-label="Main"] ul li a`                          | _(same)_                   | `src/sidebar/_sidebar_background_effects.scss`, `src/sidebar/_sidebar_interactive.scss`                                                                                                                     |

## Structural Container Selectors (Home Page & Grid Layouts)

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ |
| `shelf-container`             | `section[data-testid="component-shelf"]` | `.main-shelf-shelf`                  | Home page shelf wrappers, section backgrounds      | ✅ Active |
| `grid-container`              | N/A                                      | `.main-gridContainer-gridContainer` | Universal grid layout for cards                    | ✅ Active |
| `shelf-grid`                  | Combined selector (see above)            | Combined selector                   | Scoped effects within home page shelf contexts     | ✅ Active |

## Card Component Selectors (Encore Migration 2025)

| Mixin Name                    | Current Selector (Encore)                | Legacy Selector       | Use Case                                           | Adopted Files                                                                                                                                                                                                           |
| ----------------------------- | ---------------------------------------- | --------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `card-container-universal`    | `.main-card-cardContainer`               | `.main-card-card`     | All card types (visual effects, interactions)      | `src/components/_sn_card_base.scss`, `src/components/_sn_enhanced_cards.scss`, `src/features/visual-effects/_crystalline_glassmorphism.scss`, `src/features/interactions/_css_interactions.scss`, 11 other files       |
| `card-container-music-reactive` | `.main-card-cardContainer[href*="/album/"], .main-card-cardContainer[href*="/artist/"]` | `.main-card-card[href*="/album/"], .main-card-card[href*="/artist/"]` | Album/Artist cards only (beat sync, rhythm effects) | `src/features/music-sync/_beat_synchronization.scss`, `src/features/music-sync/ui/_audio-reactive-atmospherics.scss`, `src/features/visual-effects/_beat_sync_glassmorphism.scss` |
| `card-image-container`        | `.main-card-imageContainer`              | `.main-card-header`   | Image area (album art, play button overlay)        | `src/components/_sn_enhanced_cards.scss` (line 445)                                                                                                                                                                      |
| `card-title`                  | `[data-encore-id="cardTitle"]`           | `.main-cardHeader-text` | Card title text (stable attribute preferred)     | `src/features/interactions/_text_visual_effects.scss`                                                                                                                                                                   |
| `card-subtitle`               | `[data-encore-id="cardSubtitle"]`        | `.main-card-cardMetadata` | Card subtitle/metadata (year, artist, etc.)      | _(use stable attribute for new code)_                                                                                                                                                                                    |
| `card-play-button`            | `.main-card-PlayButtonContainer`         | _(same, unchanged)_   | Play button overlay (consistent across versions)   | Multiple files (unchanged structure)                                                                                                                                                                                     |

## Context-Aware Card Selectors (Year3000 Design Philosophy)

| Mixin Name                    | Context Selector                                  | Card Selector                        | Effect Intensity                                   | Status |
| ----------------------------- | ------------------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ |
| `cards-in-shelf`              | `section[data-testid="component-shelf"]`, `.main-shelf-shelf` | `.main-card-cardContainer`, `.main-card-card` | Full effects (max visual sophistication)           | ✅ Active |
| `cards-in-search`             | `.main-searchPage-content`, `section[data-testid*="search"]` | `.main-card-cardContainer`, `.main-card-card` | Reduced effects (clarity & readability focus)      | ✅ Active |
| `cards-in-artist-discography` | `[data-testid="artist-page"]`, `section[data-testid*="discography"]` | `.main-card-cardContainer`, `.main-card-card` | Enhanced effects (album focus)                     | ✅ Active |
| `cards-in-library`            | `.main-yourLibrary-yourLibrary`                   | `.main-card-cardContainer`, `.main-card-card` | Compact styling (minimal effects)                  | ✅ Active |

### Context-Aware Usage Examples

**Home Page Shelves** (Maximum effects):
```scss
@include cards-in-shelf {
  // Full visual effects, glassmorphism, beat sync (for albums/artists)
  @include crystalline-glassmorphism;
  @include beat-sync-effects;
}
```

**Search Results** (Minimal effects):
```scss
@include cards-in-search {
  // Reduced effects for clarity
  backdrop-filter: blur(4px); // Lighter blur
  transform: none; // No lift animations
}
```

**Artist Discography** (Enhanced focus):
```scss
@include cards-in-artist-discography {
  // Enhanced visual effects for album cards
  @include advanced-glassmorphism;
  box-shadow: 0 8px 32px rgba(var(--sn-accent-rgb), 0.2);
}
```

**Library View** (Compact):
```scss
@include cards-in-library {
  // Minimal effects, compact spacing
  padding: 8px;
  border-radius: 6px;
}
```

## Global Navigation Bar Selectors (Top Bar)

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ |
| `global-nav-bar`              | `div.Root__globalNav#global-nav-bar`    | `.Root__globalNav`                   | Top navigation bar root container                  | ✅ Active |
| `global-nav-search-input`     | `input[data-top-bar-search="true"]`     | `input.main-globalNav-searchInput`   | Search bar input field                            | ✅ Active |
| `global-nav-history-buttons`  | `.main-globalNav-historyButtonsContainer` | _(same)_                           | Back/Forward button container                      | ✅ Active |
| `user-avatar-button`          | `button.main-userWidget-box`            | _(same)_                             | User profile dropdown button                       | ✅ Active |

**Usage Example:**
```scss
@include global-nav-bar {
  // Top bar styling, background effects
  background: rgba(var(--spice-rgb-surface0), 0.95);
  backdrop-filter: blur(20px);
}

@include global-nav-search-input {
  // Search input focus state, custom icons
  &:focus {
    box-shadow: 0 0 0 2px var(--spice-accent);
  }
}
```

## Now Playing Bar Sections (Bottom Bar)

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ |
| `now-playing-bar-section`     | `.main-nowPlayingBar-left/center/right` | _(accepts parameter: "left"\|"center"\|"right")_ | Target specific sections of bottom bar             | ✅ Active |
| `now-playing-widget`          | `div[data-testid="now-playing-widget"]` | `.main-nowPlayingWidget-nowPlaying`  | Current track widget container                     | ✅ Active |
| `now-playing-track-info`      | `.main-trackInfo-container`             | `.main-nowPlayingWidget-trackInfo`   | Track title and artist text container              | ✅ Active |
| `now-playing-cover-art`       | `div[data-testid="CoverSlotCollapsed_container"]` | `.main-coverSlotCollapsed-container` | Small album art in bottom bar                      | ✅ Active |
| `like-button`                 | `button.control-button-heart`           | _(same)_                             | Like/Unlike heart button                           | ✅ Active |

**Usage Example:**
```scss
@include now-playing-bar-section("left") {
  // Left section styling (track info, like button)
  gap: 12px;
}

@include now-playing-widget {
  // Widget hover state, animations
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.02);
  }
}

@include like-button {
  // Heart button checked state
  &[aria-checked="true"] {
    color: var(--spice-accent);
  }
}
```

## Right Sidebar - Now Playing View (Expanded Player)

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ |
| `npv-panel`                   | `div[data-testid="NPV_Panel_OpenDiv"]`  | _(stable attribute only)_            | Main NPV panel wrapper                             | ✅ Active |
| `npv-widget`                  | `.main-nowPlayingView-nowPlayingWidget` | _(same)_                             | Inner widget wrapper                               | ✅ Active |
| `npv-grid`                    | `.main-nowPlayingView-nowPlayingGrid`   | _(same)_                             | Two-column layout (artwork + info)                 | ✅ Active |
| `npv-cover-art`               | `.main-nowPlayingView-coverArtContainer`| _(same)_                             | Large album art container                          | ✅ Active |
| `npv-track-info`              | `.main-nowPlayingView-contextItemInfo`  | `.main-nowPlayingView-trackInfo`     | Track metadata & controls column                   | ✅ Active |

**Usage Example:**
```scss
@include npv-panel {
  // Panel slide-in animation, background
  animation: slideIn 0.3s ease;
  background: var(--spice-surface0);
}

@include npv-cover-art {
  // Large album art effects
  box-shadow: 0 8px 32px rgba(var(--sn-accent-rgb), 0.3);
  border-radius: 8px;
}
```

## Track List Components (Playlist/Album Tables)

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ |
| `tracklist-root`              | `div[role="grid"][aria-label*="tracks"]`| `.main-trackList-container`          | Main track list grid container                     | ✅ Active |
| `tracklist-header`            | `div.main-trackList-trackListHeaderRow[role="row"]` | `div[data-testid="track-list-header"]` | Column headers row                                 | ✅ Active |
| `tracklist-row`               | `div.main-trackList-trackListRow[role="row"]` | _(same)_                             | Individual track row                               | ✅ Active |
| `tracklist-album-art`         | `img.main-trackList-albumArt`           | `img.main-trackList-rowImage`        | Small album thumbnail in track list                | ✅ Active |
| `tracklist-title`             | `a.main-trackList-rowTitle`             | `div.main-trackList-rowTitle`        | Track title link/text                              | ✅ Active |

**Usage Example:**
```scss
@include tracklist-row {
  // Row hover state, transitions
  &:hover {
    background: rgba(var(--spice-rgb-surface1), 0.5);
  }
}

@include tracklist-album-art {
  // Album art border radius, shadow
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

## Your Library Selectors (Left Sidebar)

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ |
| `your-library-container`      | `.main-yourLibraryX-libraryContainer`   | `.main-yourLibrary-libraryContainer` | Main library scrollable container                  | ✅ Active |
| `your-library-entry-points`   | `.main-yourLibraryX-entryPoints`        | `.main-yourLibrary-entryPoints`      | Quick access filter buttons (Playlists/Artists/Albums) | ✅ Active |
| `your-library-list-item`      | `.main-yourLibraryX-listItem`           | `.main-yourLibrary-listItem`         | Individual library item (playlist/album/artist)    | ✅ Active |
| `your-library-header`         | `.main-yourLibraryX-header`             | `.main-yourLibrary-header`           | Library section header                             | ✅ Active |

**Usage Example:**
```scss
@include your-library-container {
  // Custom scrollbar styling
  &::-webkit-scrollbar {
    width: 8px;
  }
}

@include your-library-list-item {
  // Library item hover state
  &:hover {
    background: rgba(var(--spice-rgb-surface1), 0.3);
  }
}
```

## Global Navigation - Secondary Controls (Extended)

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `global-nav-links`            | `button.main-globalNav-navLink`         | _(same)_                             | Custom navigation link buttons                     | ✅ Active | `_dom_selectors_global_nav.scss` |
| `global-nav-search-section`   | `div.main-globalNav-searchSection`      | _(same)_                             | Search section container                           | ✅ Active | `_dom_selectors_global_nav.scss` |
| `whats-new-button`            | `button[aria-label="What's New"]`       | _(stable attribute only)_            | What's New notification button                     | ✅ Active | `_dom_selectors_global_nav.scss` |
| `friend-activity-button`      | `button[data-restore-focus-key="buddy_feed"]` | _(stable attribute only)_      | Friend activity sidebar toggle                     | ✅ Active | `_dom_selectors_global_nav.scss` |

## Now Playing Bar - Extended Controls

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `now-playing-progress-bar`    | `.main-nowPlayingBar-progressBar`       | _(same)_                             | Track progress bar                                 | ✅ Active | `_dom_selectors_now_playing.scss` |
| `volume-control`              | `[data-testid="volume-bar"]`            | `div.main-nowPlayingBar-volumeSlider`| Volume slider control                              | ✅ Active | `_dom_selectors_now_playing.scss` |
| `lyrics-button`               | `[data-testid="lyrics-button"]`         | `button[aria-label*="Lyrics"]`       | Lyrics toggle button                               | ✅ Active | `_dom_selectors_now_playing.scss` |
| `queue-button`                | `[data-testid="queue-button"]`          | `button[aria-label*="Queue"]`        | Queue toggle button                                | ✅ Active | `_dom_selectors_now_playing.scss` |
| `stars-overlay`               | `span.stars-now-playing#stars-now-playing` | _(stable ID)_                     | Theme-specific star animation overlay              | ✅ Active | `_dom_selectors_now_playing.scss` |

## Now Playing View (NPV) - Sections & Enhancements

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `npv-visual-enhancement`      | `div[data-testid="track-visual-enhancement"]` | _(stable attribute only)_      | Animated/video track visual overlay                | ✅ Active | `_dom_selectors_npv.scss` |
| `npv-sections`                | `div.main-nowPlayingView-section`       | _(same)_                             | Generic NPV section container                      | ✅ Active | `_dom_selectors_npv.scss` |
| `npv-about-artist`            | `.main-nowPlayingView-section:has(...)`  | `.main-nowPlayingView-aboutArtist`  | About the artist section                           | ✅ Active | `_dom_selectors_npv.scss` |
| `npv-credits`                 | `.main-nowPlayingView-credits`          | _(same)_                             | Song credits section                               | ✅ Active | `_dom_selectors_npv.scss` |
| `npv-queue`                   | `.main-nowPlayingView-queue`            | _(same)_                             | Queue section in NPV                               | ✅ Active | `_dom_selectors_npv.scss` |

## Track List - Cell-Level Selectors

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `tracklist-play-cell`         | `div[role="gridcell"][aria-colindex="1"]` | `.main-trackList-rowSectionIndex`  | Track number/play button column                    | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-info-cell`         | `div[role="gridcell"][aria-colindex="2"]` | `.main-trackList-rowMainContent`   | Title & artist column                              | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-album-cell`        | `div[role="gridcell"][aria-colindex="3"]` | _(role-based selector)_            | Album name column                                  | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-duration-cell`     | `div[role="gridcell"][aria-colindex="5"]` | `.main-trackList-rowSectionEnd`    | Duration & actions column                          | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-column-header`     | `button.main-tracklist-column`          | `div[role="columnheader"]`           | Column header elements                             | ✅ Active | `_dom_selectors_tracklist.scss` |

## Your Library - Advanced Selectors

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `your-library-filter-area`    | `.main-yourLibraryX-filterArea`         | `.main-yourLibrary-filterArea`       | Filter pills container                             | ✅ Active | `_dom_selectors_library.scss` |
| `your-library-search`         | `input[placeholder*="library" i]`       | `.main-yourLibraryX-searchInput`     | Library search input field                         | ✅ Active | `_dom_selectors_library.scss` |
| `library-drop-target`         | `.main-useDropTarget-base`              | _(with type-specific variants)_      | Drag & drop target zones                           | ✅ Active | `_dom_selectors_library.scss` |
| `left-sidebar-footer`         | `div[data-testid="left-sidebar-footer"]`| _(stable attribute only)_            | Bottom sidebar action buttons                      | ✅ Active | `_dom_selectors_library.scss` |

### Card Selector Usage Guidelines

**Universal Card Targeting** (Visual effects apply to ALL cards):
```scss
// Use for: glassmorphism, depth layers, hover effects, focus states
.main-card-card,
.main-card-cardContainer {
  // Visual effects and interactions
}
```

**Music-Reactive Targeting** (Beat sync ONLY for albums/artists):
```scss
// Use for: beat synchronization, rhythm phase, audio atmospherics
.main-card-card[href*="/album/"],
.main-card-card[href*="/artist/"],
.main-card-cardContainer[href*="/album/"],
.main-card-cardContainer[href*="/artist/"] {
  // Music-reactive effects
}
```

**Image Container** (Support both structures):
```scss
// Use for: image overlays, gradients, visual effects on artwork
.main-card-header,
.main-card-imageContainer {
  // Image area effects
}
```

**Stable Attributes** (Future-proof targeting):
```scss
// Prefer for: new code, content-specific styling
[data-encore-id="cardTitle"] { }
[data-encore-id="cardSubtitle"] { }
[data-testid="play-button"] { }
```

### Selector Stability Tiers

All mixins in `_dom_selectors.scss` follow a three-tier stability system:

**✅ Tier 1 - STABLE (Preferred):**
- `data-encore-id` attributes (e.g., `data-encore-id="cardTitle"`)
- `data-testid` attributes (e.g., `data-testid="play-button"`)
- **Characteristics**: Least likely to change, future-proof, explicitly set by Spotify
- **Examples**: `[data-encore-id="card"]`, `button[data-testid="play-button"]`

**⚠️ Tier 2 - TRANSITIONAL (Use with fallbacks):**
- `.main-*` classes (e.g., `.main-card-cardContainer`)
- **Characteristics**: Currently stable but may change during Encore migration
- **Strategy**: Support both legacy and current selectors through 2025
- **Examples**: `.main-card-card, .main-card-cardContainer`

**❌ Tier 3 - DANGEROUS (NEVER TARGET):**
- `*-sc-*` classes (styled-components with random hashes)
- Random alphanumeric classes (e.g., `.hGutJE`, `.cQZRed`)
- **Characteristics**: Change on every build, will break your theme instantly
- **Warning**: Targeting these is a breaking change waiting to happen

**Mixin Strategy**: All mixins prioritize Tier 1 > Tier 2 fallback. Tier 3 selectors are explicitly documented as **forbidden**.

### Migration Status & Timeline

- **Q1 2025:** Encore rollout begins, both selectors active
- **Q2-Q3 2025:** Transitional period (6 months), support both required
- **Q4 2025:** Legacy selectors may be deprecated
- **Current Status:** ✅ All theme files updated to support both structures

**Files Updated (15/15 Complete):**
1. `_sn_card_base.scss` - Base structural layer
2. `_css_interactions.scss` - Interaction system
3. `_crystalline_glassmorphism.scss` - Glass effects
4. `_sn_enhanced_cards.scss` - Main enhancement layer (1220 lines)
5. `_beat_synchronization.scss` - Beat sync core
6. `_audio-reactive-atmospherics.scss` - Atmospheric effects
7. `_beat_sync_glassmorphism.scss` - Rhythm glass
8. `_grid_navigation_mode.scss` - Grid breathing
9. `_sn_active_loading_states.scss` - Loading states
10. `_white_layer_fixes.scss` - Visual fixes
11. `_dynamic_interface.scss` - Dynamic behaviors
12. `_microinteractions.scss` - Micro-interactions
13. `_design_tokens.scss` - Token system
14. `_performance_mixins.scss` - Performance hints
15. `_text_visual_effects.scss` - Text effects

**Notes**

- _Attr-First Selector_ – use the most stable attribute-based hook when Spotify provides one. Legacy class names remain as fallback for older UI builds.
- _Adopted Files_ – list is non-exhaustive. The CSV (`scripts/dom_selectors.csv`) is the authoritative source.
- _Card Selectors_ – Transitional period active; support both legacy and current through 2025 H2.

## Recommended Mixin Implementation

Future work (Phase 3):

1. Implement each stub mixin in `src/core/_dom_selectors.scss` with union selectors.
2. Refactor all modules to replace hard-coded selectors with the mixins.
3. Add card-specific mixins:
   ```scss
   @mixin card-container-universal {
     .main-card-card,
     .main-card-cardContainer {
       @content;
     }
   }

   @mixin card-container-music-reactive {
     .main-card-card[href*="/album/"],
     .main-card-card[href*="/artist/"],
     .main-card-cardContainer[href*="/album/"],
     .main-card-cardContainer[href*="/artist/"] {
       @content;
     }
   }

   @mixin card-image-container {
     .main-card-header,
     .main-card-imageContainer {
       @content;
     }
   }
   ```

## Related Documentation

- **[cards_DOM.md](./cards_DOM.md)** - Complete card structure reference (NEW)
- **[mainView_DOM.md](./mainView_DOM.md)** - Main view DOM structure
- **[SPOTIFY_DOM_TARGETING.md](./SPOTIFY_DOM_TARGETING.md)** - General targeting strategy
