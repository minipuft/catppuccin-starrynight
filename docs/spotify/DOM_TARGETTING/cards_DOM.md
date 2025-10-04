# Spotify Card Components - DOM Structure Reference

> **Living Document** – Updated for Spotify's migration to Encore design system (2025)
> **Last Updated:** 2025-10-03
> **Migration Status:** Transitional period - both legacy and current structures active

---

## Overview

Spotify's card components display albums, artists, playlists, podcasts, and other content across the interface. As of 2025, Spotify is migrating from legacy class-based selectors to the **Encore design system** using stable `data-encore-id` attributes.

### Critical Selector Changes

| Element | Legacy Selector | Current Selector | Status |
|---------|----------------|------------------|--------|
| **Card Container** | `.main-card-card` | `.main-card-cardContainer` | ⚠️ Transitional |
| **Image Container** | `.main-card-header` | `.main-card-imageContainer` | ⚠️ Transitional |
| **Title** | `.main-cardHeader-text` | `[data-encore-id="cardTitle"]` | ✅ Stable attribute |
| **Subtitle** | `.main-card-cardMetadata` | `[data-encore-id="cardSubtitle"]` | ✅ Stable attribute |

**Best Practice:** Support both selectors during the 6-month transition period (2025 H1-H2).

---

## Card Type Hierarchy

### 1. **Album Cards** (Full Music Reactivity)
- **Location:** Home page, artist discography, search results
- **Selector Pattern:** `[href*="/album/"]`
- **Effects:** Visual + Music-reactive (beat sync, rhythm, audio-responsive)
- **Year3000 Treatment:** Maximum visual sophistication

### 2. **Artist Cards** (Full Music Reactivity)
- **Location:** Home page, genre pages, search results
- **Selector Pattern:** `[href*="/artist/"]`
- **Effects:** Visual + Music-reactive (beat sync, rhythm, audio-responsive)
- **Year3000 Treatment:** Maximum visual sophistication

### 3. **Playlist Cards** (Visual Effects Only)
- **Location:** Home page, made for you, search results
- **Selector Pattern:** General card selectors (no href filtering)
- **Effects:** Visual only (glassmorphism, depth, interactions)
- **Year3000 Treatment:** Beautiful visuals, NO beat sync

### 4. **Podcast/Show Cards** (Visual Effects Only)
- **Location:** Home page, podcast section, search results
- **Selector Pattern:** General card selectors
- **Effects:** Visual only (glassmorphism, depth, interactions)
- **Year3000 Treatment:** Minimal effects, clean presentation

---

## Current DOM Structure (Encore - 2025)

### Complete Album Card Example

```html
<div class="main-card-cardContainer"
     data-encore-id="card"
     aria-labelledby="card-title-crest-bladee">

  <!-- Interactive Button Layer (Styled Components - UNSTABLE, avoid targeting) -->
  <div role="button" class="CardButton-sc-g9vf2u-0 hGutJE CardButton-medium-medium-buttonPrimary-isNotCollapsed">
    <div draggable="true" class="CardButton-sc-g9vf2u-1 cQZRed">
      <a aria-label="Crest" draggable="false" href="/album/123" data-testid="card-click-handler">
      </a>
    </div>
  </div>

  <!-- Image Container with Play Button -->
  <div class="main-card-imageContainer">
    <div class="main-cardImage-imageWrapper">
      <img aria-hidden="false"
           draggable="false"
           loading="lazy"
           src="https://i.scdn.co/image/..."
           alt=""
           class="main-image-image main-cardImage-image">
    </div>

    <!-- Play Button Container -->
    <div class="main-card-PlayButtonContainer">
      <div class="main-playButton-PlayButton main-playButton-primary">
        <button aria-label="Play"
                data-testid="play-button"
                aria-expanded="false">
          <svg><!-- Play icon --></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Text Content Area -->
  <div class="Areas__MainArea">
    <!-- Title with stable data attribute -->
    <p data-encore-id="cardTitle"
       id="card-title-crest-bladee"
       class="main-card-cardTitle encore-text encore-text-body-medium-bold">
      <a draggable="false"
         dir="auto"
         href="/album/123">
        Crest
      </a>
    </p>

    <!-- Subtitle with stable data attribute -->
    <div data-encore-id="cardSubtitle">
      <span class="encore-text encore-text-body-small">2022</span>
    </div>
  </div>
</div>
```

### Key Characteristics (Current)

1. **Stable Attributes:**
   - `data-encore-id="card"` on container
   - `data-encore-id="cardTitle"` on title
   - `data-encore-id="cardSubtitle"` on subtitle
   - `data-testid="card-click-handler"` on link
   - `data-testid="play-button"` on play button

2. **Unstable Elements (DO NOT TARGET):**
   - `CardButton-sc-*` classes (styled-components, random hash)
   - Dynamic class names with random strings
   - Inline style attributes (can change)

3. **Selector Strategy:**
   ```scss
   // ✅ GOOD - Stable selectors
   .main-card-cardContainer[data-encore-id="card"] { }
   [data-encore-id="cardTitle"] { }
   [data-testid="play-button"] { }

   // ❌ BAD - Unstable selectors
   .CardButton-sc-g9vf2u-0 { }
   .hGutJE { }
   ```

---

## Legacy DOM Structure (Pre-2025)

### Complete Album Card Example

```html
<div class="main-card-card">
  <!-- Card Header with Image -->
  <div class="main-card-header">
    <div class="main-cardImage-imageWrapper">
      <img src="https://i.scdn.co/image/..."
           alt=""
           class="main-cardImage-image main-image-image">
    </div>

    <!-- Play Button Container (same structure) -->
    <div class="main-card-PlayButtonContainer">
      <div class="main-playButton-PlayButton">
        <button aria-label="Play">
          <svg><!-- Play icon --></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Card Metadata -->
  <div class="main-card-cardMetadata">
    <a href="/album/123" class="main-cardHeader-link" draggable="false">
      <div class="main-cardHeader-text main-type-balladBold">Crest</div>
    </a>
    <div class="main-cardSubHeader-root main-type-mestoBold">
      <span>2022</span>
    </div>
  </div>
</div>
```

### Key Characteristics (Legacy)

1. **Class-Based Structure:**
   - `.main-card-card` for container
   - `.main-card-header` for image area
   - `.main-cardHeader-text` for title
   - `.main-card-cardMetadata` for metadata

2. **Notable Differences:**
   - No `data-encore-id` attributes
   - Different image container class (`.main-card-header`)
   - Title in `.main-cardHeader-text` vs `[data-encore-id="cardTitle"]`
   - Metadata in `.main-card-cardMetadata` vs `[data-encore-id="cardSubtitle"]`

---

## Backwards Compatible Selector Patterns

### Universal Card Targeting (All Card Types)

```scss
// Target all cards equally - visual effects, interactions
.main-card-card,
.main-card-cardContainer {
  // Base styles, glassmorphism, hover effects, etc.
  position: relative;
  border-radius: var(--card-border-radius, 12px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
}
```

### Album/Artist Specific Targeting (Music-Reactive)

```scss
// Target only album/artist cards for beat sync effects
.main-card-card[href*="/album/"],
.main-card-card[href*="/artist/"],
.main-card-cardContainer[href*="/album/"],
.main-card-cardContainer[href*="/artist/"] {
  // Music-reactive effects only
  animation: beat-pulse var(--beat-duration) ease-in-out infinite;
}
```

### Image Container (Supports Both Structures)

```scss
// Support both legacy and current image containers
.main-card-header,
.main-card-imageContainer {
  position: relative;
  border-radius: inherit;
  overflow: hidden;

  // Visual effects that work on image area
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3));
  }
}
```

### Play Button (Unchanged Across Versions)

```scss
// Play button structure is consistent
.main-card-PlayButtonContainer {
  position: absolute;
  right: 8px;
  bottom: 8px;

  .main-playButton-PlayButton {
    // Play button styles
  }
}
```

### Title and Subtitle (Flexible Targeting)

```scss
// Support both legacy and current title selectors
.main-cardHeader-text,
[data-encore-id="cardTitle"] {
  font-weight: 700;
  margin-bottom: 4px;
}

// Support both legacy and current subtitle selectors
.main-card-cardMetadata,
[data-encore-id="cardSubtitle"] {
  color: var(--spice-subtext);
  font-size: 0.875rem;
}
```

---

## Year3000 Design Philosophy for Cards

### Tier 1: Album/Artist Cards (Maximum Effects)
- **Visual:** Glassmorphism, depth layers, gradients, glow
- **Interactive:** Ripple effects, hover lift, focus states
- **Music-Reactive:** Beat synchronization, rhythm phase, audio atmospherics
- **Implementation:** Conditional selectors target `[href*="/album/"]` and `[href*="/artist/"]`

### Tier 2: Playlist/Podcast Cards (Visual Only)
- **Visual:** Same beautiful glassmorphism, depth, gradients
- **Interactive:** Same ripple effects, hover states, focus
- **Music-Reactive:** NONE - static visual beauty only
- **Implementation:** Universal card selectors (no href filtering)

### Tier 3: Search/Minimal Cards (Basic Effects)
- **Visual:** Base styles, minimal depth
- **Interactive:** Standard hover, focus
- **Music-Reactive:** NONE
- **Implementation:** Context-aware targeting (within search containers)

---

## Common Card Contexts

### 1. Home Page Shelves
```html
<section data-testid="component-shelf">
  <div class="main-shelf-shelf">
    <div class="main-gridContainer-gridContainer">
      <!-- Cards here -->
      <div class="main-card-cardContainer">...</div>
      <div class="main-card-cardContainer">...</div>
    </div>
  </div>
</section>
```

### 2. Artist Discography
```html
<div data-testid="artist-page">
  <section data-testid="discography-section">
    <div class="main-gridContainer-gridContainer">
      <!-- Album cards with artist context -->
      <div class="main-card-cardContainer" href="/album/...">...</div>
    </div>
  </section>
</div>
```

### 3. Search Results
```html
<div class="main-searchPage-content">
  <section data-testid="search-top-results">
    <!-- Reduced effects in search context -->
    <div class="main-card-cardContainer">...</div>
  </section>
</div>
```

### 4. Library View (Compact Cards)
```html
<div class="main-yourLibrary-yourLibrary">
  <!-- Smaller cards, different styling -->
  <div class="main-card-cardContainer">...</div>
</div>
```

---

## Migration Checklist

### For Theme Developers

- [ ] **Update all `.main-card-card` selectors:**
  ```scss
  // Before
  .main-card-card { }

  // After
  .main-card-card,
  .main-card-cardContainer { }
  ```

- [ ] **Update image container selectors:**
  ```scss
  // Before
  .main-card-header { }

  // After
  .main-card-header,
  .main-card-imageContainer { }
  ```

- [ ] **Prefer stable attributes for new code:**
  ```scss
  // Use data-encore-id when available
  [data-encore-id="cardTitle"] { }
  [data-encore-id="cardSubtitle"] { }
  ```

- [ ] **Avoid styled-components classes:**
  ```scss
  // ❌ Never target these
  .CardButton-sc-* { }
  .cQZRed { }
  ```

- [ ] **Test across contexts:**
  - Home page shelves
  - Artist discography
  - Search results
  - Library view
  - Genre/mood pages

### For Music-Reactive Themes

- [ ] **Separate album/artist logic:**
  ```scss
  // Music-reactive (albums/artists only)
  .main-card-cardContainer[href*="/album/"] {
    @include beat-sync-effects;
  }

  // Visual only (all cards)
  .main-card-cardContainer {
    @include glassmorphism-effects;
  }
  ```

- [ ] **Verify playlists don't pulse:**
  - Test playlist cards show NO beat sync
  - Visual effects should remain static
  - Interactions should work normally

---

## Performance Considerations

### GPU Acceleration
```scss
.main-card-card,
.main-card-cardContainer {
  // Force GPU acceleration for smooth animations
  transform: translateZ(0);
  will-change: transform;
}
```

### Efficient Selectors
```scss
// ✅ GOOD - Direct class selector
.main-card-cardContainer { }

// ⚠️ ACCEPTABLE - Attribute selector (slightly slower)
[data-encore-id="card"] { }

// ❌ AVOID - Complex descendant selectors
.main-shelf-shelf .main-gridContainer-gridContainer > div:nth-child(odd) { }
```

### Reduced Motion
```scss
@media (prefers-reduced-motion: reduce) {
  .main-card-card,
  .main-card-cardContainer {
    // Disable all animations
    animation: none !important;
    transition: opacity 0.2s ease;
  }
}
```

---

## Related Documentation

- **[mainView_DOM.md](./mainView_DOM.md)** - Main content area structure
- **[selector_mixins.md](./selector_mixins.md)** - Reusable selector patterns
- **[SPOTIFY_DOM_TARGETING.md](./SPOTIFY_DOM_TARGETING.md)** - General targeting strategy

---

## Appendix: Selector Reference Table

| Element | Legacy | Current | Stable Attribute | Notes |
|---------|--------|---------|------------------|-------|
| Card Container | `.main-card-card` | `.main-card-cardContainer` | `[data-encore-id="card"]` | Both needed during transition |
| Image Container | `.main-card-header` | `.main-card-imageContainer` | - | Structure changed significantly |
| Image | `.main-cardImage-image` | `.main-image-image` | - | Class consolidated |
| Play Button Container | `.main-card-PlayButtonContainer` | `.main-card-PlayButtonContainer` | - | ✅ Unchanged |
| Play Button | `.main-playButton-PlayButton` | `.main-playButton-PlayButton` | `[data-testid="play-button"]` | ✅ Consistent |
| Title | `.main-cardHeader-text` | - | `[data-encore-id="cardTitle"]` | Use attribute for future-proofing |
| Subtitle/Metadata | `.main-card-cardMetadata` | - | `[data-encore-id="cardSubtitle"]` | Use attribute for future-proofing |
| Link (title) | `.main-cardHeader-link` | `a[draggable="false"]` | `[data-testid="card-click-handler"]` | Inside title element |

---

**Document Maintainer:** StarryNight Theme Team
**Questions/Issues:** See [repository issues](https://github.com/yourusername/catppuccin-starrynight/issues)
