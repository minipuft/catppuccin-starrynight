# Centralised Selector Mixin Matrix

> Living document – update whenever Spotify's DOM evolves.
> **Last Updated:** 2025-10-04 (Phase 3 Low Priority Complete: 103 mixins across 6 files - 95%+ documentation coverage)

## Layout & Navigation Selectors

| Mixin Name              | Attr-First Selector (preferred)                           | Legacy / Fallback Selector | Adopted Files (initial scan)                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `left-sidebar-root`     | `div[data-testid="Desktop_LeftSidebar_Id"].Root__nav-bar` | `.Root__nav-bar`           | `src/layout/_navbar.scss`, `src/layout/_sn_sidebar_navigation.scss`, `src/sidebar/_sidebar_background_effects.scss`, `src/sidebar/_sidebar_interactive.scss`, `src/features/_sn_glassmorphism.scss`, others |
| `right-sidebar-root`    | `div.Root__right-sidebar[data-testid="right-sidebar"]`    | `.Root__right-sidebar`     | `src/layout/_right_sidebar.scss`, `src/layout/.scss` `src/features/_sn_glassmorphism.scss`, `src/features/_sn_context_zones.scss`, `src/components/_sn_loading.scss`                                        |
| `now-playing-bar-root`  | `aside[data-testid="now-playing-bar"]`                    | `.Root__now-playing-bar`   | `src/components/_now_playing.scss`, `src/features/_sn_atmospheric.scss`, `src/features/_sn_glassmorphism.scss`, `src/features/_themed_interactive_components.scss`                                          |
| `main-view-root`        | `div.Root__main-view#main-view`                           | `.Root__main-view`         | `src/features/_sn_context_zones.scss`, `src/features/_sn_depth_layers.scss`, `src/features/_sn_z_index_management.scss`                                                                                     |
| `main-view-scroll-node` | `.Root__main-view .main-view-container__scroll-node`      | _(same)_                   | `src/layout/_sn_scroll_node_backgrounds.scss`, `src/features/_sn_depth_layers.scss`                                                                                                                         |
| `main-nav-link`         | `nav[aria-label="Main"] ul li a`                          | _(same)_                   | `src/sidebar/_sidebar_background_effects.scss`, `src/sidebar/_sidebar_interactive.scss`                                                                                                                     |

## Entity Headers & Content Pages

| Mixin Name                          | Stable Selector (Tier 1)                        | Transitional Selector (Tier 2)       | Use Case                                           | Status     | File |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------ | -------------------------------------------------- | ---------- | ---- |
| `entity-header-root`                | `.main-entityHeader-container`                  | `[data-testid*="entity-header"]`     | Album/Playlist/Artist page header container        | ✅ Active | `_index.scss` |
| `entity-header-title`               | `.main-entityHeader-title`                      | `[class*="entityHeader-title"]`      | Entity header title text                           | ✅ Active | `_index.scss` |
| `entity-header-image`               | `.main-entityHeader-imageContainer`             | `.main-entityHeader-image`           | Entity header cover art container                  | ✅ Active | `_index.scss` |
| `entity-header-background-color`    | `.main-entityHeader-backgroundColor`            | _(stable class)_                     | Header background color layer (dynamic effects)    | ✅ Active | `_index.scss` |
| `entity-header-gradient-overlay`    | `.main-entityHeader-backgroundOverColorGradient`| _(stable class)_                     | Header gradient overlay layer                      | ✅ Active | `_index.scss` |
| `entity-header-metadata`            | `.main-entityHeader-metaData`                   | _(stable class)_                     | Metadata container (songs, duration, followers)    | ✅ Active | `_index.scss` |
| `playlist-page-container`           | `div[data-testid="playlist-page"]`              | _(stable attribute)_                 | Playlist page root container                       | ✅ Active | `_index.scss` |

**Usage Example:**
```scss
@include entity-header-background-color {
  // Dynamic color extraction from album art
  background: var(--extracted-bg-color);
  transition: background-color 0.5s ease;
}

@include entity-header-metadata {
  // Metadata styling with glassmorphism
  backdrop-filter: blur(8px);
  background: rgba(var(--spice-rgb-surface0), 0.7);
}
```

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

## Action Bar Components (Playlist/Album Controls)

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status     | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ---------- | ---- |
| `shuffle-button`              | `button[data-testid="shuffle-button"]`  | _(stable attribute only)_            | Shuffle play button                                | ✅ Active | `_index.scss` |
| `add-to-library-button`       | `button[data-testid="add-to-library-button"]` | `button.control-button-heart`  | Add to library/like button                         | ✅ Active | `_index.scss` |
| `filter-pills`                | `div.main-genre-chip`                   | `div.main-tag-container`             | Genre/mood filter pills                            | ✅ Active | `_index.scss` |
| `search-within-playlist`      | `div.playlist-playlist-searchBoxContainer` | `div.x-filterBox-filterInputContainer` | Playlist search box container               | ✅ Active | `_index.scss` |
| `sort-dropdown`               | `button.x-sortBox-sortDropdown[data-testid="sort-button"]` | `button.x-sortBox-sortDropdown` | Sort options dropdown          | ✅ Active | `_index.scss` |

**Usage Example:**
```scss
@include shuffle-button {
  // Shuffle button styling with active state
  &[aria-checked="true"] {
    color: var(--spice-accent);
  }
}

@include filter-pills {
  // Filter pill styling
  border-radius: 16px;
  padding: 8px 16px;
  background: rgba(var(--spice-rgb-surface1), 0.5);
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
| `global-nav-links`            | `button.main-globalNav-navLink`         | _(same)_                             | Custom navigation link buttons                     | ✅ Active | `_global-nav.scss` |
| `global-nav-search-section`   | `div.main-globalNav-searchSection`      | _(same)_                             | Search section container                           | ✅ Active | `_global-nav.scss` |
| `whats-new-button`            | `button[aria-label="What's New"]`       | _(stable attribute only)_            | What's New notification button                     | ✅ Active | `_global-nav.scss` |
| `friend-activity-button`      | `button[data-restore-focus-key="buddy_feed"]` | _(stable attribute only)_      | Friend activity sidebar toggle                     | ✅ Active | `_global-nav.scss` |
| `skip-link`                   | `a[data-encore-id="skipLink"]`          | _(stable attribute only)_            | Accessibility skip to content link                 | ✅ Active | `_global-nav.scss` |
| `nav-links-scrollable-container` | `div.custom-navlinks-scrollable_container` | _(theme-specific class)_          | Custom navigation links scrollable wrapper         | ✅ Active | `_global-nav.scss` |
| `global-search-form`          | `form[role="search"]`                   | _(semantic role selector)_           | Global search form element                         | ✅ Active | `_global-nav.scss` |
| `clear-search-button`         | `button[aria-label="Clear search field"]` | _(stable aria-label)_              | Clear search input button                          | ✅ Active | `_global-nav.scss` |

**Usage Example:**
```scss
@include skip-link {
  // Accessibility skip link (hidden until focused)
  position: absolute;
  top: -100px;
  &:focus {
    top: 0;
    z-index: 9999;
  }
}

@include global-search-form {
  // Search form styling
  width: 100%;
  max-width: 500px;
}
```

## Now Playing Bar - Extended Controls

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `now-playing-progress-bar`    | `.main-nowPlayingBar-progressBar`       | _(same)_                             | Track progress bar                                 | ✅ Active | `_now-playing.scss` |
| `volume-control`              | `[data-testid="volume-bar"]`            | `div.main-nowPlayingBar-volumeSlider`| Volume slider control                              | ✅ Active | `_now-playing.scss` |
| `lyrics-button`               | `[data-testid="lyrics-button"]`         | `button[aria-label*="Lyrics"]`       | Lyrics toggle button                               | ✅ Active | `_now-playing.scss` |
| `queue-button`                | `[data-testid="queue-button"]`          | `button[aria-label*="Queue"]`        | Queue toggle button                                | ✅ Active | `_now-playing.scss` |
| `stars-overlay`               | `span.stars-now-playing#stars-now-playing` | _(stable ID)_                     | Theme-specific star animation overlay              | ✅ Active | `_now-playing.scss` |
| `now-playing-semantic-wrapper` | `aside[aria-label="Now playing bar"][data-testid="now-playing-bar"]` | `aside[data-testid="now-playing-bar"]` | Semantic aside wrapper for now playing bar | ✅ Active | `_now-playing.scss` |
| `connect-device-button`       | `button[data-testid="connect-device-picker"]` | `button[aria-label*="Connect to a device"]` | Device/speaker connection button | ✅ Active | `_now-playing.scss` |

**Usage Example:**
```scss
@include now-playing-semantic-wrapper {
  // Main semantic wrapper styling
  display: flex;
  align-items: center;
  gap: 16px;
}

@include connect-device-button {
  // Device picker button styling
  &[aria-pressed="true"] {
    color: var(--spice-accent);
  }
}
```

## Now Playing View (NPV) - Sections & Enhancements

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `npv-visual-enhancement`      | `div[data-testid="track-visual-enhancement"]` | _(stable attribute only)_      | Animated/video track visual overlay                | ✅ Active | `_npv.scss` |
| `npv-sections`                | `div.main-nowPlayingView-section`       | _(same)_                             | Generic NPV section container                      | ✅ Active | `_npv.scss` |
| `npv-about-artist`            | `.main-nowPlayingView-section:has(...)`  | `.main-nowPlayingView-aboutArtist`  | About the artist section                           | ✅ Active | `_npv.scss` |
| `npv-credits`                 | `.main-nowPlayingView-credits`          | _(same)_                             | Song credits section                               | ✅ Active | `_npv.scss` |
| `npv-queue`                   | `.main-nowPlayingView-queue`            | _(same)_                             | Queue section in NPV                               | ✅ Active | `_npv.scss` |
| `npv-cover-art-static`        | `div.main-nowPlayingView-coverArt`      | _(stable class)_                     | Static cover art image container                   | ✅ Active | `_npv.scss` |
| `npv-tertiary-buttons`        | `[data-encore-id="buttonTertiary"]`     | `button[data-encore-id="buttonTertiary"]` | Tertiary action buttons (Share, Add to Queue) | ✅ Active | `_npv.scss` |
| `npv-queue-item`              | `li.main-useDropTarget-base`            | _(stable class)_                     | Individual queue item rows                         | ✅ Active | `_npv.scss` |

**Usage Example:**
```scss
@include npv-cover-art-static {
  // Static cover art styling
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(var(--sn-accent-rgb), 0.3);
}

@include npv-tertiary-buttons {
  // Tertiary button styling
  opacity: 0.8;
  &:hover {
    opacity: 1;
    background: rgba(var(--spice-rgb-surface1), 0.5);
  }
}

@include npv-queue-item {
  // Queue item styling
  padding: 8px;
  &:hover {
    background: rgba(var(--spice-rgb-surface1), 0.3);
  }
}
```

## Track List - Cell-Level Selectors

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `tracklist-play-cell`         | `div[role="gridcell"][aria-colindex="1"]` | `.main-trackList-rowSectionIndex`  | Track number/play button column                    | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-info-cell`         | `div[role="gridcell"][aria-colindex="2"]` | `.main-trackList-rowMainContent`   | Title & artist column                              | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-album-cell`        | `div[role="gridcell"][aria-colindex="3"]` | _(role-based selector)_            | Album name column                                  | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-duration-cell`     | `div[role="gridcell"][aria-colindex="5"]` | `.main-trackList-rowSectionEnd`    | Duration & actions column                          | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-column-header`     | `button.main-tracklist-column`          | `div[role="columnheader"]`           | Column header elements                             | ✅ Active | `_dom_selectors_tracklist.scss` |
| `tracklist-header-start-section` | `div.main-trackList-trackListHeaderRowSectionStart` | _(same)_              | First column header container (#)                  | ✅ Active | `_tracklist.scss` |
| `tracklist-header-variable-section` | `div.main-tracklist-tracklistHeaderRowSectionVariable` | _(same)_       | Variable-width column header containers            | ✅ Active | `_tracklist.scss` |
| `tracklist-header-end-section` | `div.main-tracklist-tracklistHeaderRowSectionEnd` | _(same)_                | Last column header container (duration)            | ✅ Active | `_tracklist.scss` |
| `tracklist-row-index-section` | `span.main-trackList-rowSectionIndex`   | `div.main-trackList-rowSectionIndex` | Track number/index display area                    | ✅ Active | `_tracklist.scss` |
| `tracklist-row-main-content`  | `div.main-trackList-rowMainContent`     | _(same)_                             | Title/Artist wrapper in row                        | ✅ Active | `_tracklist.scss` |
| `tracklist-row-end-section`   | `div.main-trackList-rowSectionEnd`      | _(same)_                             | Like/Duration/Menu container                       | ✅ Active | `_tracklist.scss` |

**Usage Example:**
```scss
@include tracklist-header-start-section {
  // First column header styling
  text-align: center;
  width: 48px;
}

@include tracklist-row-main-content {
  // Title/artist wrapper styling
  display: flex;
  align-items: center;
  gap: 12px;
}
```

## Your Library - Advanced Selectors

| Mixin Name                    | Stable Selector (Tier 1)                | Transitional Selector (Tier 2)       | Use Case                                           | Status | File |
| ----------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------------------------- | ------ | ---- |
| `your-library-filter-area`    | `.main-yourLibraryX-filterArea`         | `.main-yourLibrary-filterArea`       | Filter pills container                             | ✅ Active | `_library.scss` |
| `your-library-search`         | `input[placeholder*="library" i]`       | `.main-yourLibraryX-searchInput`     | Library search input field                         | ✅ Active | `_library.scss` |
| `library-drop-target`         | `.main-useDropTarget-base`              | _(with type-specific variants)_      | Drag & drop target zones                           | ✅ Active | `_library.scss` |
| `left-sidebar-footer`         | `div[data-testid="left-sidebar-footer"]`| _(stable attribute only)_            | Bottom sidebar action buttons                      | ✅ Active | `_library.scss` |
| `library-item-container`      | `div[data-overlayscrollbars-initialize="true"].main-yourLibraryX-libraryItemContainer` | `.main-yourLibraryX-libraryItemContainer` | Scrollable items container with custom scrollbars  | ✅ Active | `_library.scss` |
| `library-rootlist`            | `div.main-yourLibraryX-libraryRootlist` | _(stable class)_                     | Root element for library item grid/list            | ✅ Active | `_library.scss` |
| `library-virtual-scroll-sentinels` | `div.main-rootlist-topSentinel`, `div.main-rootlist-bottomSentinel` | _(stable classes)_ | Virtual scrolling boundary elements | ✅ Active | `_library.scss` |
| `library-rootlist-wrapper`    | `div.main-rootlist-wrapper[role="presentation"]` | `div.main-rootlist-wrapper`  | Wrapper around library grid items                  | ✅ Active | `_library.scss` |
| `sidebar-resize-bar`          | `div.LayoutResizer__resize-bar.LayoutResizer__inline-end` | `div.LayoutResizer__resize-bar` | Sidebar width resize handle                        | ✅ Active | `_library.scss` |

**Usage Example:**
```scss
@include library-item-container {
  // Custom scrollbar styling
  scrollbar-width: thin;
  scrollbar-color: var(--spice-surface1) transparent;
}

@include sidebar-resize-bar {
  // Resize handle styling
  width: 4px;
  cursor: col-resize;
  background: var(--spice-surface1);

  &:hover {
    background: var(--spice-accent);
  }
}
```

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
