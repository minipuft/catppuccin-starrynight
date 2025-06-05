# Spotify DOM Component Targeting Guide for Spicetify Theming

This document lists various DOM components identifiable in the Spotify UI that can be targeted for styling with Spicetify. Understanding these selectors is crucial for creating custom themes.

## From the Provided UI Snapshot

Below are components identified from a typical Spotify UI snapshot, useful for theming common areas:

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
  - `

### Main View & Layout Panes

These are the major structural elements of the Spotify interface.

- **Left Sidebar / Navigation (`.Root__nav-bar`):**

  - `div[data-testid="Desktop_LeftSidebar_Id"].Root__nav-bar`: The main container for the entire left navigation sidebar.
  - `nav[aria-label="Main"]`: The semantic `<nav>` element that usually wraps the primary navigation links and the "Your Library" section.
  - \*\*"Your Library" Section (`.main-yourLibraryX-libraryContainer`):
    - `div.main-yourLibraryX-entryPoints`: Often contains quick links or entry points within the library view, like buttons for "Playlists", "Artists", "Albums".
    - `div.main-yourLibraryX-libraryContainer`: The primary scrollable container that holds the list of items in the user's library.
      - `div.main-yourLibraryX-listItem`: A general container for each individual item (playlist, album, artist) in the "Your Library" list.
        - `div.main-useDropTarget-base` (often combined with type-specific classes like `main-useDropTarget-playlist`, `main-useDropTarget-album`, `main-useDropTarget-artist`): Wrapper for a library item, indicating it can be a drop target for organizing.
        - `img` (often with classes like `main-cardImage-image` or specific to the item type): Cover art for the library item.
        - `div` or `span` for the title of the item (playlist name, album title, artist name).
        - `span` for the type and creator/artist (e.g., "Playlist • User", "Album • Artist").
      - `header.main-yourLibraryX-header`: The header area within the "Your Library" section. It might include a title, search/filter options, or collapse/expand buttons.
        - `div.main-yourLibraryX-headerContent`: A wrapper for the content inside the library header.
        - `div.main-yourLibraryX-collapseButton`: A button that might be used to collapse or expand parts of the library view or switch between compact/expanded modes.
      - `div.main-yourLibraryX-filterArea`: This area usually contains filter pills (e.g., "Playlists", "Artists", "Albums", "Podcasts & Shows") to refine the library content.
        - `div.main-searchCategory-contentArea`: A general wrapper for the filter categories/pills.
        - `div.search-searchCategory-categoryGrid[role="list"]`: The grid layout that displays the individual filter options/pills.
        - `div[role="presentation"]`: Often wraps individual filter pills/buttons within the grid.
        - `div.search-searchCategory-carouselButton`: Navigation buttons (left/right arrows) that appear if the filter pills overflow the available space.
      - `div[data-overlayscrollbars-initialize="true"].main-yourLibraryX-libraryItemContainer`: The specific container that lists the library items (playlists, albums, etc.) and uses custom overlay scrollbars.
        - `div.main-yourLibraryX-libraryRootlist`: The root element for the list/grid of library items.
          - `div[role="grid"][aria-label="Your Library"]`: The actual grid structure that presents the library items.
          - `div.main-rootlist-wrapper[role="presentation"]`: A wrapper around the rows or items within the library grid.
          - `div.main-rootlist-topSentinel` & `div.main-rootlist-bottomSentinel`: These are typically empty elements used by virtual scrolling libraries to detect the boundaries of the visible list, helping to efficiently render long lists.
  - `div[data-testid="left-sidebar-footer"]`: A container at the very bottom of the left sidebar, which might hold links like "Settings", "Create Playlist", or other actions.
  - `div.LayoutResizer__resize-bar.LayoutResizer__inline-end`: The draggable vertical bar used to resize the width of the left sidebar.

- **Main Content Area:**

  - `div.Root__main-view#main-view`: This is the largest area where content like playlists, album pages, artist pages, and search results are displayed.

- **Playlist View / Track List (within Main Content Area):**

  - `div[data-testid="playlist-page"]`: Often the top-level container for a playlist view.
  - **Playlist Header:**
    - `div.main-view-container__scroll-node`: The main scrollable container for the view.
      - `div.main-view-container__padding`: Optional padding div inside the scroll node.
    - `div.main-entityHeader-container`: The primary header section for the playlist, album, or artist page.
      - `div.main-entityHeader-backgroundColor`: A layer used for applying a solid background color to the header, often dynamically colored.
      - `div.main-entityHeader-backgroundOverColorGradient`: A layer for a gradient overlay on top of the background color.
      - `div.main-entityHeader-imageContainer`: Holds the main cover art for the playlist/album.
      - `div.main-entityHeader-headerText`: A wrapper for all the textual content in the header.
        - `span.main-entityHeader-eyebrow` or `span.Type__TypeElement-...` (check specific typography class): For the type label (e.g., "Playlist", "Album").
        - `h1.main-entityHeader-title.Type__TypeElement-...` (check specific typography class): The main title (e.g., "Liked Songs", Playlist Name).
        - `div.main-entityHeader-metaData`: Contains metadata like the owner/artist, number of songs, duration, etc.
          - `img` or `svg` for owner/artist avatar (if present).
          - `a` tag for owner/artist name (linking to their profile).
          - `span` for song count, follower count, or other stats.
  - **Action Bar (below header):**
    - `div.main-actionBar-ActionBarRow[data-testid="action-bar-row"]`: A row containing primary action buttons for the current view.
      - `div.main-actionBar-ActionBar`: An inner container for the action buttons.
      - `div.main-actionBar-ButtonRow`: A more specific wrapper if buttons are in a distinct row.
    - `button[data-testid="play-button"]` or `button[data-testid="playpause-button"]`: The main play/pause button (often a large, prominent button).
    - `button[data-testid="shuffle-button"]`: Shuffle play button.
    - `button[data-testid="add-to-library-button"]` or `button.control-button-heart[aria-checked="true/false"]`: Button to add/remove the playlist/album to library or like/unlike.
    - Filter Pills (e.g., genre filters):
      - `div.main-genre-chip` or `div.main-tag-container` (class names can vary): Individual filter pill/button.
    - `div.playlist-playlist-searchBoxContainer` or `div.x-filterBox-filterInputContainer`: Container for the "Search within playlist" input/button.
      - `input` for the search text itself.
    - `button.x-sortBox-sortDropdown[data-testid="sort-button"]`: Button to open sort options for the track list.
      - `span.Type__TypeElement-...`: Text indicating current sort key (e.g., "Date added").
      - `svg` for the dropdown arrow icon.
  - **Track List:**
    - `div.main-trackList-trackListHeaderRow[role="row"]` or `div[data-testid="track-list-header"]`: The header row for the track list, containing column titles. It is often a grid itself (`display: grid`).
      - `div.main-trackList-trackListHeaderRowSectionStart`: Contains the first column header (usually "#").
        - `button.main-tracklist-column` (or `div[role="columnheader"]`): The header for the track number/index column.
          - `span.Type__TypeElement-...` (or just `#` text): The "#" symbol.
      - `div.main-tracklist-tracklistHeaderRowSectionVariable`: A container for a variable-width column header like "Title" or "Album". There will be multiple of these.
        - `button.main-tracklist-column.main-trackList-sortable` (or `div[role="columnheader"][aria-sort]`): The header for a sortable column (e.g., Title, Album, Date added).
          - `span.Type__TypeElement-...`: The text label of the column (e.g., "Title", "Album", "Date added").
          - `svg` (often with classes like `main-trackList-arrow`, `main-trackList-descending`, `main-trackList-ascending`, or within a `span.main-trackList-headerSortArrow`): The arrow icon indicating sort status and direction.
      - `div.main-tracklist-tracklistHeaderRowSectionEnd`: Contains the last column header (usually Duration/clock icon).
        - `button.main-tracklist-column.main-trackList-durationHeader` (or `div[role="columnheader"]`):
          - `svg[aria-label="Duration"]`: The clock icon representing track duration.
      - (Older structure, might still appear) `div.main-trackList-column[role="columnheader"]`: Individual column headers (e.g., "#", "Title", "Album", "Date added", clock icon for Duration).
    - `div[role="grid"][aria-label*="tracks"]` (e.g., `aria-label="Playlist tracks"` or `aria-label="Album tracks"`): The main grid container holding all the track rows.
      - `div.main-rootlist-wrapper[role="presentation"]`: A common wrapper around the set of track rows, often used for positioning or virtual scrolling.
        - `div.main-trackList-trackListRow[role="row"]` (Attributes like `aria-rowindex`, `aria-selected="true/false"` are common):
          - **Track Number/Play Cell (Column 1):**
            - `div[role="gridcell"][aria-colindex="1"]`: Contains the track number or play button.
            - `span.main-trackList-rowSectionIndex.Type__TypeElement-...`: Displays the track number (e.g., "1", "2").
            - `button[data-testid="play-button"]` or `button[data-testid="pause-button"]`: Play/Pause button that appears on hover or for the active song.
          - **Title & Artist Cell (Column 2):**
            - `div[role="gridcell"][aria-colindex="2"]`: Contains album art, track title, and artist(s).
            - `img.main-trackList-albumArt` or `img.main-image-image.main-trackList-rowImage`: The small square album artwork.
            - `div.main-trackList-rowMainContent`: A wrapper for the title and subtitle.
              - `a.main-trackList-rowTitle.standalone-ellipsis-one-line` or `div.main-trackList-rowTitle...`: The track title, often a link to the track page.
              - `span.main-trackList-rowSubTitle.standalone-ellipsis-one-line` or `div.main-trackList-rowSubTitle...`: Contains artist name(s), often with `a` tags linking to artist pages. Explicit content badges (`span[aria-label="Explicit"]`) can also appear here.
          - **Album Cell (Column 3):**
            - `div[role="gridcell"][aria-colindex="3"]`.
            - `a.standalone-ellipsis-one-line` or `span.Type__TypeElement-...`: The album title, usually a link to the album page.
          - **Date Added Cell (Column 4):**
            - `div[role="gridcell"][aria-colindex="4"]`.
            - `span.Type__TypeElement-...` or `span.main-trackList-rowSectionVariable`: The date the track was added to the playlist.
          - **Duration & Actions Cell (Column 5):**
            - `div[role="gridcell"][aria-colindex="5"]`: Contains like button, duration, and context menu.
            - `button.control-button-heart[aria-checked="true/false"]` or `button[data-testid="add-to-liked-songs-button"]`: The heart icon to like/unlike the track.
            - `span.main-trackList-rowDuration.Type__TypeElement-...`: The track's duration (e.g., "3:45").
            - `button[data-testid="more-button"]` or `button[aria-label*="More options"]`: The three-dot context menu button for more track options.
    - `div.main-trackList-trackListRow[role="row"]`: Represents a single track in the list.
      - `div[role="gridcell"][aria-colindex="1"]`: Typically displays the track number, or a play icon on hover.
      - `div[role="gridcell"][aria-colindex="2"]`: Contains the track's primary information.
        - `img.main-trackList-albumArt` (or similar classes for small cover art within the row).
        - `a.main-trackList-rowTitle` or `div.main-trackList-rowTitle`: The track title, often a link.
        - `span.main-trackList-rowSubTitle` or `div`: Artist name(s), often linked. Can also contain other subtitle information.
      - `div[role="gridcell"][aria-colindex="3"]`: Album name, usually linked.
      - `div[role="gridcell"][aria-colindex="4"]`: "Date added" or release date.
      - `div[role="gridcell"][aria-colindex="5"]`: Track duration.
      - `button.control-button-heart[aria-checked="true/false"]`: Like/unlike button for the individual track.
      - `button[data-testid="more-button"]` or `button[aria-label*="More options"]`: The three-dot context menu button for the track.

- **Top Bar:**

### Right Sidebar:

- `div.Root__right-sidebar[data-testid="right-sidebar"]`: The main panel on the right side of the interface.
- `aside[aria-label="Now playing view"]` or `section[aria-label="Queue"]` (depending on active tab): Specifically targets the "Now Playing" details or the Queue when open in the right sidebar.
  - `div[data-testid="Desktop_PanelContainer_Id"]`: A generic container within the "Now Playing" view panel, useful for broad styling of this section.
  - **Currently Playing Info (within Now Playing View):**
    - `div.main-coverSlotExpanded-container`: Container for the large cover art of the currently playing track.
    - `div.main-trackInfo-container`: Contains track title, artist for the currently playing song.
- **Queue Section:**
  - `div[aria-label="Next in queue"]` or `section[aria-label="Queue"]` or `div.main-queue-trackList`: Container for the "Next in queue" list.
  - Track row structures within the queue will be similar to those in the main playlist view (e.g., using `div.main-trackList-trackListRow`).
- **"About the artist" Card:**
  - `div[aria-label="About the artist"]` or `section[data-testid="artist-about"]` or `div.main-entityCard-container`: Card displaying information about the currently playing artist.
    - `div.main-entityTitle-title.Type__TypeElement-...`: The title for the card itself (e.g., "About the artist").
    - `img.main-entityCard-image`: Artist's image.
    - `div.main-entityCard-title.Type__TypeElement-...`: Artist's name.
    - `div.main-entityCard-subtitle.Type__TypeElement-...`: Subtitle, often monthly listeners count.
    - `button.Button-qlcn3g-0.Button-md-buttonSecondary-useBrowserDefaultFocusStyle[aria-label*="Follow"]` (unstable generated class, focus on `Button-md-buttonSecondary` and `aria-label`): Follow button for the artist.
- **"Credits" Card:**
  - `div[aria-label="Credits"]` or `section[aria-label*="Credits"]` or `div.main-entityCard-container`: Card displaying song credits (performers, writers, producers).
    - Typically contains a list of names and their roles.
- **"On Tour" Card:**
  - `div.main-entityCard-container[aria-label*="On tour"]`: Card displaying upcoming tour dates for the artist.
    - `div.main-concertCard-card`: Container for an individual concert/tour date entry.
      - `div.main-concertCard-date`: Displays the date of the concert.
      - `div.main-concertCard-info`: Displays venue and location information for the concert.

### Scrollbars:
