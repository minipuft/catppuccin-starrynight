# Centralised Selector Mixin Matrix

> Living document – update whenever Spotify's DOM evolves.
> **Last Updated:** 2025-10-03 (Added card component mixins for Encore migration)

## Layout & Navigation Selectors

| Mixin Name              | Attr-First Selector (preferred)                           | Legacy / Fallback Selector | Adopted Files (initial scan)                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `left-sidebar-root`     | `div[data-testid="Desktop_LeftSidebar_Id"].Root__nav-bar` | `.Root__nav-bar`           | `src/layout/_navbar.scss`, `src/layout/_sn_sidebar_navigation.scss`, `src/sidebar/_sidebar_background_effects.scss`, `src/sidebar/_sidebar_interactive.scss`, `src/features/_sn_glassmorphism.scss`, others |
| `right-sidebar-root`    | `div.Root__right-sidebar[data-testid="right-sidebar"]`    | `.Root__right-sidebar`     | `src/layout/_right_sidebar.scss`, `src/layout/.scss` `src/features/_sn_glassmorphism.scss`, `src/features/_sn_context_zones.scss`, `src/components/_sn_loading.scss`                                        |
| `now-playing-bar-root`  | `aside[data-testid="now-playing-bar"]`                    | `.Root__now-playing-bar`   | `src/components/_now_playing.scss`, `src/features/_sn_atmospheric.scss`, `src/features/_sn_glassmorphism.scss`, `src/features/_themed_interactive_components.scss`                                          |
| `main-view-root`        | `div.Root__main-view#main-view`                           | `.Root__main-view`         | `src/features/_sn_context_zones.scss`, `src/features/_sn_depth_layers.scss`, `src/features/_sn_z_index_management.scss`                                                                                     |
| `main-view-scroll-node` | `.Root__main-view .main-view-container__scroll-node`      | _(same)_                   | `src/layout/_sn_scroll_node_backgrounds.scss`, `src/features/_sn_depth_layers.scss`                                                                                                                         |
| `main-nav-link`         | `nav[aria-label="Main"] ul li a`                          | _(same)_                   | `src/sidebar/_sidebar_background_effects.scss`, `src/sidebar/_sidebar_interactive.scss`                                                                                                                     |

## Card Component Selectors (Encore Migration 2025)

| Mixin Name                    | Current Selector (Encore)                | Legacy Selector       | Use Case                                           | Adopted Files                                                                                                                                                                                                           |
| ----------------------------- | ---------------------------------------- | --------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `card-container-universal`    | `.main-card-cardContainer`               | `.main-card-card`     | All card types (visual effects, interactions)      | `src/components/_sn_card_base.scss`, `src/components/_sn_enhanced_cards.scss`, `src/features/visual-effects/_crystalline_glassmorphism.scss`, `src/features/interactions/_css_interactions.scss`, 11 other files       |
| `card-container-music-reactive` | `.main-card-cardContainer[href*="/album/"], .main-card-cardContainer[href*="/artist/"]` | `.main-card-card[href*="/album/"], .main-card-card[href*="/artist/"]` | Album/Artist cards only (beat sync, rhythm effects) | `src/features/music-sync/_beat_synchronization.scss`, `src/features/music-sync/ui/_audio-reactive-atmospherics.scss`, `src/features/visual-effects/_beat_sync_glassmorphism.scss` |
| `card-image-container`        | `.main-card-imageContainer`              | `.main-card-header`   | Image area (album art, play button overlay)        | `src/components/_sn_enhanced_cards.scss` (line 445)                                                                                                                                                                      |
| `card-title`                  | `[data-encore-id="cardTitle"]`           | `.main-cardHeader-text` | Card title text (stable attribute preferred)     | `src/features/interactions/_text_visual_effects.scss`                                                                                                                                                                   |
| `card-subtitle`               | `[data-encore-id="cardSubtitle"]`        | `.main-card-cardMetadata` | Card subtitle/metadata (year, artist, etc.)      | _(use stable attribute for new code)_                                                                                                                                                                                    |
| `card-play-button`            | `.main-card-PlayButtonContainer`         | _(same, unchanged)_   | Play button overlay (consistent across versions)   | Multiple files (unchanged structure)                                                                                                                                                                                     |

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
