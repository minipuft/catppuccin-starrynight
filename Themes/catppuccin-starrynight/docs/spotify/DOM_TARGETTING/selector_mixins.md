# Centralised Selector Mixin Matrix

> Living document – update whenever Spotify's DOM evolves.

| Mixin Name              | Attr-First Selector (preferred)                           | Legacy / Fallback Selector | Adopted Files (initial scan)                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `left-sidebar-root`     | `div[data-testid="Desktop_LeftSidebar_Id"].Root__nav-bar` | `.Root__nav-bar`           | `src/layout/_navbar.scss`, `src/layout/_sn_sidebar_navigation.scss`, `src/sidebar/_sidebar_background_effects.scss`, `src/sidebar/_sidebar_interactive.scss`, `src/features/_sn_glassmorphism.scss`, others |
| `right-sidebar-root`    | `div.Root__right-sidebar[data-testid="right-sidebar"]`    | `.Root__right-sidebar`     | `src/layout/_right_sidebar.scss`, `src/layout/_sn_right_sidebar_consciousness.scss`, `src/features/_sn_glassmorphism.scss`, `src/features/_sn_context_zones.scss`, `src/components/_sn_loading.scss`        |
| `now-playing-bar-root`  | `aside[data-testid="now-playing-bar"]`                    | `.Root__now-playing-bar`   | `src/components/_now_playing.scss`, `src/features/_sn_atmospheric.scss`, `src/features/_sn_glassmorphism.scss`, `src/features/_themed_interactive_components.scss`                                          |
| `main-view-root`        | `div.Root__main-view#main-view`                           | `.Root__main-view`         | `src/features/_sn_context_zones.scss`, `src/features/_sn_depth_layers.scss`, `src/features/_sn_z_index_management.scss`                                                                                     |
| `main-view-scroll-node` | `.Root__main-view .main-view-container__scroll-node`      | _(same)_                   | `src/layout/_sn_scroll_node_backgrounds.scss`, `src/features/_sn_depth_layers.scss`                                                                                                                         |
| `main-nav-link`         | `nav[aria-label="Main"] ul li a`                          | _(same)_                   | `src/sidebar/_sidebar_background_effects.scss`, `src/sidebar/_sidebar_interactive.scss`                                                                                                                     |

**Notes**

- _Attr-First Selector_ – use the most stable attribute-based hook when Spotify provides one. Legacy class names remain as fallback for older UI builds.
- _Adopted Files_ – list is non-exhaustive. The CSV (`scripts/dom_selectors.csv`) is the authoritative source.

Next steps (Phase 3):

1. Implement each stub mixin in `src/core/_dom_selectors.scss` with union selectors.
2. Refactor all modules to replace hard-coded selectors with the mixins.
