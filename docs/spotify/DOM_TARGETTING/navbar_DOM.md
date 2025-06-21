### Global Navigation Bar (`#global-nav-bar`)

Top-level bar housing history buttons, navigation links, and the universal search input.

- **Overall Structure:**

  - `div.Root__globalNav#global-nav-bar`: Sticky container spanning the top of the viewport.
  - Skip link → `a[data-encore-id="skipLink"]` (hidden until focused).

- **History Buttons (Back / Forward):**

  - Wrapper → `div.main-globalNav-historyButtonsContainer`
    - Back button → `button[aria-label="Go back"]`
    - Forward button → `button[aria-label="Go forward"]`

- **Custom Navigation Links:**

  - Scrollable container → `div.custom-navlinks-scrollable_container`
  - Any nav link button → `button.main-globalNav-navLink`

- **Search Section:**

  - Wrapper → `div.main-globalNav-searchSection`
  - Search form → `form[role="search"]`
    - Input element → `input[role="combobox"][data-top-bar-search="true"]`
    - Clear field button → `button[aria-label="Clear search field"]`

- **Top-Right Buttons:**
  - What's New → `button[aria-label="What's New"]`
  - Friend Activity → `button[data-restore-focus-key="buddy_feed"]`
  - User Avatar Dropdown → `button.main-userWidget-box`

### 2025 Snapshot – Key Stable Selectors

Spotify's 2025 UI largely stabilised around `main-*` classnames and `data-` attributes. Prefer these when targeting the global nav:

- Root bar → `div.Root__globalNav#global-nav-bar`
- History wrapper → `div.main-globalNav-historyButtonsContainer`
- Search container → `div.main-globalNav-searchContainer`
- Search input → `input[data-top-bar-search="true"]`
- Nav link button → `button.main-globalNav-navLink`
- Avatar button → `button.main-userWidget-box`

> **Tip:** When styling icons, pair `button[aria-label="Go back"] svg` selectors with theme variables to recolour the arrow glyphs without affecting other icons.

---

<details>
<summary>Raw DOM Snapshot (May 2025)</summary>

```html
<div
  class="Root__globalNav pKJyyZ_7ei9TgOxrTFHX forceExpandSearchInput VWGwIHKvvfu0ry5ZqbxU"
  id="global-nav-bar"
>
  ...
  <!-- truncated for brevity -->
</div>
```

</details>
