# 🎨 Spicetify Theme Development Design Bible

_A comprehensive guide for developing modern, dynamic Spicetify themes with proper targeting and best practices._

---

## 📋 Feature Implementation Roadmap

| #   | Title                                            | Problem Solved                                                                      | Approach                                                                                     | Benefit                                         | Effort (1-5) | Priority | Status         |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------ | -------- | -------------- |
| 1   | **Spicetify Native Color Extractor Integration** | Current themes use outdated Vibrant.js causing CORS issues and performance problems | Leverage Spicetify's built-in `colorExtractor()` API for album art color extraction          | Faster, more reliable, no CORS issues           | 2            | High     | 🔄 In Progress |
| 2   | **Advanced Developer Tools Integration**         | Theme developers struggle to identify correct CSS selectors and variables           | Enable `spicetify enable-devtools` command for real-time inspection and CSS variable mapping | Better targeting, faster development            | 1            | High     | ✅ Documented  |
| 3   | **Modern CSS Variable System**                   | Legacy `--modspotify` variables broken after Spotify UI updates                     | Adopt new `--spice-` variable system with proper Encore theme compatibility                  | Future-proof themes, better maintenance         | 3            | High     | 🔄 In Progress |
| 4   | **Dynamic Theme Engine Architecture**            | Themes hardcode colors instead of reacting to song changes                          | Create extensible system using `Spicetify.Player.addEventListener` for real-time updates     | Live color adaptation, enhanced user experience | 4            | High     | 📋 Planned     |
| 5   | **Component-Based Targeting Guide**              | Developers use trial-and-error to find correct selectors                            | Build comprehensive selector mapping with React component inspection                         | Faster development, consistent theming          | 3            | Medium   | ✅ Documented  |

---

## 🔧 Essential Development Setup

### Initial Configuration

```bash
# Enable developer tools for CSS inspection
spicetify enable-devtools

# Get Spicetify config directory
spicetify config-dir

# Enable CSS injection and color replacement
spicetify config inject_css 1 replace_colors 1

# Apply changes (use appropriate command for your version)
spicetify backup apply  # For CLI 2.27+
spicetify apply         # For older versions
```

### Developer Tools Access

```bash
# After enabling devtools:
# 1. Right-click anywhere in Spotify
# 2. Select "Inspect Element"
# 3. Use Elements panel to find CSS selectors
# 4. Test selectors in Console tab
```

---

## 🎯 Modern CSS Variable System

### ✅ Current Working Variables (2024/2025)

```scss
// === Core Theme Variables ===
--spice-main              // Main application background
--spice-sidebar           // Left sidebar background
--spice-player            // Bottom player background
--spice-card              // Card and container backgrounds
--spice-shadow            // Drop shadows and overlays
--spice-selected-row      // Selected list item background
--spice-main-elevated     // Elevated surface backgrounds
--spice-highlight-elevated // Elevated highlight backgrounds
--spice-notification      // Notification backgrounds

// === Interactive Elements ===
--spice-button            // Primary button colors
--spice-button-active     // Active/pressed button state
--spice-button-disabled   // Disabled button state
--spice-tab-active        // Active tab highlighting

// === Typography ===
--spice-text              // Primary text color
--spice-subtext           // Secondary/muted text color

// === Accents & Highlights ===
--spice-highlight         // General accent highlights
--spice-equalizer         // Equalizer animation asset

// === RGB Variants (for transparency) ===
--spice-rgb-main          // RGB values: "255,255,255"
--spice-rgb-text          // RGB values for rgba() usage
--spice-rgb-button        // RGB values for button transparency
```

### ❌ Deprecated Variables (Avoid These)

```scss
// These are broken in modern Spotify versions
--modspotify_main_fg
--modspotify_secondary_fg
--modspotify_main_bg
--modspotify_sidebar_and_player_bg
--modspotify_cover_overlay_and_shadow
// ... all --modspotify_ prefixed variables
```

---

## 🎨 Dynamic Color Extraction Methods

### Method 1: Spicetify Native API (🌟 Recommended)

```javascript
/**
 * Extract colors using Spicetify's built-in color extractor
 * Handles CORS automatically and provides multiple color variants
 */
async function extractColorsNative() {
  const currentTrack = Spicetify.Player.data.item;
  if (!currentTrack?.uri) {
    console.warn("No current track available");
    return null;
  }

  try {
    const colors = await Spicetify.colorExtractor(currentTrack.uri);
    console.log("Extracted colors:", colors);

    return {
      vibrant: colors.VIBRANT, // Main vibrant color
      darkVibrant: colors.DARK_VIBRANT, // Dark variant
      lightVibrant: colors.LIGHT_VIBRANT, // Light variant
      prominent: colors.PROMINENT, // Most prominent color
      desaturated: colors.DESATURATED, // Muted variant
      vibrantNonAlarming: colors.VIBRANT_NON_ALARMING, // Safe vibrant color
    };
  } catch (error) {
    console.warn("Native color extraction failed:", error);
    return null;
  }
}
```

### Method 2: Canvas-Based Fallback

```javascript
/**
 * Fallback color extraction using canvas when native API unavailable
 * Works with any image element
 */
function extractColorFromImage(imgElement) {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Draw image to single pixel for dominant color
    canvas.width = 1;
    canvas.height = 1;
    ctx.drawImage(imgElement, 0, 0, 1, 1);

    const data = ctx.getImageData(0, 0, 1, 1).data;
    const hex = `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2])
      .toString(16)
      .slice(1)}`;

    return {
      hex: hex,
      rgb: `rgb(${data[0]}, ${data[1]}, ${data[2]})`,
      rgba: `rgba(${data[0]}, ${data[1]}, ${data[2]}, 1)`,
    };
  } catch (error) {
    console.warn("Canvas color extraction failed:", error);
    return null;
  }
}
```

### Method 3: Vibrant.js Library (Legacy Support)

```javascript
/**
 * Legacy Vibrant.js implementation for backward compatibility
 * Note: May have CORS issues with external images
 */
function extractColorsVibrant(imageElement) {
  try {
    const vibrant = new Vibrant(imageElement, 12);
    const swatches = vibrant.swatches();

    // Priority order for color selection
    const colorPriority = [
      "Vibrant",
      "DarkVibrant",
      "LightVibrant",
      "Muted",
      "DarkMuted",
    ];

    for (const colorName of colorPriority) {
      if (swatches[colorName]) {
        return {
          hex: swatches[colorName].getHex(),
          rgb: swatches[colorName].getRgb(),
          population: swatches[colorName].getPopulation(),
        };
      }
    }

    return null;
  } catch (error) {
    console.warn("Vibrant.js extraction failed:", error);
    return null;
  }
}
```

---

## 🎵 Song Change Detection & Event Handling

### Basic Song Change Listener

```javascript
/**
 * Listen for track changes and update theme colors
 */
Spicetify.Player.addEventListener("songchange", async () => {
  console.log("Song changed, updating colors...");

  const colors = await extractColorsNative();
  if (colors) {
    updateThemeColors(colors);
    updateAlbumInfo();
  }
});

/**
 * Also listen for player state changes
 */
Spicetify.Player.addEventListener("onplaypause", (event) => {
  // Handle play/pause state changes
  console.log("Play state changed:", event);
});
```

### Dynamic Color Application

```javascript
/**
 * Apply extracted colors to CSS variables
 */
function updateThemeColors(colors) {
  const root = document.documentElement;

  // Determine if we need light or dark variants
  const isLightMode = isLightTheme();
  const primaryColor = isLightMode ? colors.darkVibrant : colors.lightVibrant;

  // Set primary theme colors
  root.style.setProperty("--spice-text", primaryColor || colors.vibrant);
  root.style.setProperty("--spice-button", colors.vibrant);
  root.style.setProperty("--spice-button-active", colors.darkVibrant);
  root.style.setProperty("--spice-highlight", colors.vibrantNonAlarming);

  // Calculate and set RGB variants for transparency
  const rgb = hexToRgb(primaryColor || colors.vibrant);
  if (rgb) {
    root.style.setProperty("--spice-rgb-text", `${rgb.r},${rgb.g},${rgb.b}`);
    root.style.setProperty("--spice-rgb-button", `${rgb.r},${rgb.g},${rgb.b}`);
  }

  // Store current colors for persistence
  localStorage.setItem("current-theme-colors", JSON.stringify(colors));
}

/**
 * Utility function to convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Check if current theme is light mode
 */
function isLightTheme() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  );
}
```

---

## 🔍 Component Targeting & CSS Selectors

### Main Application Structure

```scss
// === Primary Layout Containers ===
.Root__main-view {
  // Main content area (center panel)
  // Target: Primary content, playlists, search results
}

.Root__nav-bar {
  // Left navigation sidebar
  // Target: Navigation links, playlists, library
}

.Root__now-playing-bar {
  // Bottom player controls
  // Target: Play/pause, progress bar, volume, track info
}

.Root__right-sidebar {
  // Right panel (queue, lyrics, etc.)
  // Target: Now playing queue, friend activity
}

.Root__top-bar {
  // Top navigation and search
  // Target: Search bar, user menu, navigation arrows
}
```

### Player Controls & Track Info

```scss
// === Player Elements ===
.main-playButton-PlayButton {
  // Primary play/pause button
  color: var(--spice-button);
}

.main-shuffleButton-button {
  // Shuffle toggle button
  &.main-shuffleButton-active {
    color: var(--spice-button-active);
  }
}

.main-trackInfo-container {
  // Current track information display
  .main-trackInfo-name {
    /* Track title */
  }
  .main-trackInfo-artists {
    /* Artist names */
  }
}

.x-progressBar-progressBarBg {
  // Progress bar background
  > div > div {
    // Progress bar fill
    background-color: var(--spice-button);
  }
}
```

### Interactive Elements

```scss
// === Buttons & Controls ===
button[aria-checked="true"] {
  // Any checked/toggled button state
  color: var(--spice-button-active);
}

.main-actionButtons button {
  // Top bar action buttons (search, user menu, etc.)
  &:hover {
    background-color: rgba(var(--spice-rgb-button), 0.1);
  }
}

.main-contextMenu-menuItemButton {
  // Context menu items
  &:hover {
    background-color: var(--spice-highlight);
    color: var(--spice-text);
  }
}

// === Lists & Cards ===
.main-trackList-playingIcon {
  // Currently playing track indicator
  background-image: var(--spice-equalizer);
  background-size: cover;
  padding-left: 100%;
}

.main-entityHeader-withBackgroundImage {
  // Album/playlist headers with background
  &::before {
    // Gradient overlay
    background: linear-gradient(transparent, var(--spice-main));
  }
}

[data-testid*="card"] {
  // Various card components (more stable selector)
  background-color: var(--spice-card);

  &:hover {
    background-color: var(--spice-highlight);
  }
}
```

### State-Based Targeting

```scss
// === Dynamic State Selectors ===
.main-shuffleButton-button.main-shuffleButton-active {
  // Active shuffle state
  color: var(--spice-button-active);
}

.control-button-heart[aria-checked="true"] {
  // Liked/hearted tracks
  color: var(--spice-button-active);
}

// === Responsive States ===
.Root__nav-bar[style*="--panel-width:72px"] {
  // Collapsed sidebar state
  .main-rootlist-textWrapper {
    display: none;
  }
}

// === Focus & Keyboard Navigation ===
button:focus-visible {
  outline: 2px solid var(--spice-button);
  outline-offset: 2px;
}

[data-testid]:focus-visible {
  // Focus states for test ID elements
  box-shadow: 0 0 0 2px var(--spice-button);
}
```

---

## 🚀 Performance Optimization Techniques

### Color Extraction Caching

```javascript
/**
 * Implement intelligent caching for color extraction
 */
class ColorCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  async getColors(uri) {
    // Return cached colors if available
    if (this.cache.has(uri)) {
      return this.cache.get(uri);
    }

    // Extract new colors
    const colors = await extractColorsNative();
    if (colors) {
      this.setColors(uri, colors);
    }

    return colors;
  }

  setColors(uri, colors) {
    // Implement LRU cache eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(uri, colors);
  }

  clear() {
    this.cache.clear();
  }
}

const colorCache = new ColorCache();
```

### Debounced Updates

```javascript
/**
 * Debounce rapid color updates to prevent performance issues
 */
let colorUpdateTimeout;
let pendingColors = null;

function debouncedColorUpdate(colors, delay = 150) {
  pendingColors = colors;

  clearTimeout(colorUpdateTimeout);
  colorUpdateTimeout = setTimeout(() => {
    if (pendingColors) {
      updateThemeColors(pendingColors);
      pendingColors = null;
    }
  }, delay);
}

// Usage in song change handler
Spicetify.Player.addEventListener("songchange", async () => {
  const colors = await colorCache.getColors(Spicetify.Player.data.item.uri);
  if (colors) {
    debouncedColorUpdate(colors);
  }
});
```

### CSS Animation Optimization

```scss
// === Smooth Transitions ===
:root {
  // CSS variables for consistent timing
  --transition-fast: 0.1s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}

// Apply transitions to themed elements
.main-playButton-PlayButton,
.main-shuffleButton-button,
button[aria-checked] {
  transition: background-color var(--transition-normal), color var(--transition-normal),
    border-color var(--transition-normal);
}

// Use transform for better performance
.main-trackList-playingIcon {
  transition: transform var(--transition-fast);

  &:hover {
    transform: scale(1.05);
  }
}
```

---

## 🛠️ Debugging & Development Tools

### Theme Debug Console

```javascript
/**
 * Comprehensive debugging utilities for theme development
 */
window.SpicetifyThemeDebug = {
  // Log current CSS variables
  logCurrentVariables() {
    const style = getComputedStyle(document.documentElement);
    const variables = {};

    // Get all --spice- variables
    for (const property of document.styleSheets[0].cssRules[0].style) {
      if (property.startsWith("--spice-")) {
        variables[property] = style.getPropertyValue(property).trim();
      }
    }

    console.table(variables);
    return variables;
  },

  // Test color extraction
  async testColorExtraction() {
    const track = Spicetify.Player.data.item;
    if (!track) {
      console.warn("No track currently playing");
      return;
    }

    console.log("Testing color extraction for:", track.metadata.title);

    try {
      const colors = await extractColorsNative();
      console.log("Extracted colors:", colors);

      // Temporarily apply colors for visual testing
      this.previewColors(colors);

      return colors;
    } catch (error) {
      console.error("Color extraction failed:", error);
    }
  },

  // Preview colors without permanent application
  previewColors(colors, duration = 5000) {
    const originalColors = this.getCurrentColors();

    updateThemeColors(colors);
    console.log(`Previewing colors for ${duration}ms...`);

    setTimeout(() => {
      this.restoreColors(originalColors);
      console.log("Colors restored");
    }, duration);
  },

  // Get current color state
  getCurrentColors() {
    const style = getComputedStyle(document.documentElement);
    return {
      text: style.getPropertyValue("--spice-text"),
      button: style.getPropertyValue("--spice-button"),
      highlight: style.getPropertyValue("--spice-highlight"),
    };
  },

  // Restore previous colors
  restoreColors(colors) {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--spice-${key}`, value);
      }
    });
  },

  // Monitor Spicetify API availability
  checkSpicetifyAPI() {
    const apis = {
      Spicetify: !!window.Spicetify,
      Player: !!window.Spicetify?.Player,
      colorExtractor: !!window.Spicetify?.colorExtractor,
      React: !!window.Spicetify?.React,
      ReactDOM: !!window.Spicetify?.ReactDOM,
    };

    console.table(apis);
    return apis;
  },
};

// Auto-run API check on load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (window.SpicetifyThemeDebug) {
      window.SpicetifyThemeDebug.checkSpicetifyAPI();
    }
  }, 2000);
});
```

### CSS Variable Inspector

```javascript
/**
 * Real-time CSS variable inspector for theme development
 */
function createVariableInspector() {
  // Create floating debug panel
  const panel = document.createElement("div");
  panel.id = "spicetify-debug-panel";
  panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 300px;
        max-height: 400px;
        background: #000;
        color: #fff;
        border: 1px solid #333;
        padding: 10px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        overflow-y: auto;
        display: none;
    `;

  document.body.appendChild(panel);

  // Toggle panel with keyboard shortcut
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
      if (panel.style.display === "block") {
        updateInspector();
      }
    }
  });

  function updateInspector() {
    const variables = window.SpicetifyThemeDebug.logCurrentVariables();
    panel.innerHTML = `
            <h3>CSS Variables (Ctrl+Shift+D to toggle)</h3>
            ${Object.entries(variables)
              .map(
                ([key, value]) =>
                  `<div>${key}: <span style="color: ${value}">${value}</span></div>`
              )
              .join("")}
        `;
  }
}

// Initialize inspector in development mode
if (localStorage.getItem("spicetify-debug") === "true") {
  createVariableInspector();
}
```

---

## 📱 Responsive Design & Accessibility

### Responsive Breakpoints

```scss
// === Media Queries for Different Screen Sizes ===
@media (max-width: 1200px) {
  .Root__main-view {
    // Large tablet adjustments
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .Root__main-view {
    // Mobile adjustments
    padding: 0 8px;
  }

  .main-trackInfo-container {
    // Adjust track info for mobile
    flex-direction: column;
    align-items: flex-start;
  }
}

// === Handle Sidebar States ===
.Root__nav-bar {
  // Full sidebar
  &[style*="--panel-width:280px"] {
    .main-rootlist-textWrapper {
      opacity: 1;
      transition: opacity var(--transition-normal);
    }
  }

  // Collapsed sidebar
  &[style*="--panel-width:72px"] {
    .main-rootlist-textWrapper {
      opacity: 0;
    }
  }
}
```

### Accessibility Considerations

```scss
// === Focus Management ===
button:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid var(--spice-button);
  outline-offset: 2px;
  border-radius: 4px;
}

// === High Contrast Support ===
@media (prefers-contrast: high) {
  :root {
    --spice-text: #ffffff;
    --spice-subtext: #cccccc;
    --spice-main: #000000;
    --spice-button: #ffffff;
  }
}

// === Reduced Motion Support ===
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .main-trackList-playingIcon {
    background-image: none !important;
  }
}
```

---

## 🎛️ Theme Configuration System

### Settings Panel Integration

```javascript
/**
 * Create theme settings panel similar to Catppuccin approach
 */
const ThemeSettings = Spicetify.React.memo(() => {
  const [colorMode, setColorMode] = Spicetify.React.useState(
    localStorage.getItem("theme-color-mode") || "auto"
  );

  const [accentColor, setAccentColor] = Spicetify.React.useState(
    localStorage.getItem("theme-accent-color") || "vibrant"
  );

  const colorModes = ["auto", "light", "dark"];
  const accentOptions = ["vibrant", "muted", "prominent", "custom"];

  Spicetify.React.useEffect(() => {
    // Apply color mode
    applyColorMode(colorMode);
    localStorage.setItem("theme-color-mode", colorMode);
  }, [colorMode]);

  Spicetify.React.useEffect(() => {
    // Apply accent color preference
    applyAccentColor(accentColor);
    localStorage.setItem("theme-accent-color", accentColor);
  }, [accentColor]);

  function applyColorMode(mode) {
    const root = document.documentElement;

    switch (mode) {
      case "light":
        root.classList.add("light-theme");
        root.classList.remove("dark-theme");
        break;
      case "dark":
        root.classList.add("dark-theme");
        root.classList.remove("light-theme");
        break;
      case "auto":
      default:
        root.classList.remove("light-theme", "dark-theme");
        // Follow system preference
        break;
    }
  }

  function applyAccentColor(accent) {
    // Store preference for next color extraction
    window.themeAccentPreference = accent;
  }

  return Spicetify.React.createElement(
    "div",
    {
      className: "x-settings-section",
    },
    [
      Spicetify.React.createElement(
        "h2",
        {
          className: "TextElement-bodyMediumBold-textBase-text",
          key: "title",
        },
        "Dynamic Theme Settings"
      ),

      // Color Mode Setting
      Spicetify.React.createElement(
        "div",
        {
          className: "x-settings-row",
          key: "color-mode",
        },
        [
          Spicetify.React.createElement(
            "label",
            {
              className: "TextElement-bodySmall-textSubdued-text",
              key: "label",
            },
            "Color Mode"
          ),
          Spicetify.React.createElement(
            "select",
            {
              className: "main-dropDown-dropDown",
              value: colorMode,
              onChange: (e) => setColorMode(e.target.value),
              key: "select",
            },
            colorModes.map((mode) =>
              Spicetify.React.createElement(
                "option",
                {
                  key: mode,
                  value: mode,
                },
                mode.charAt(0).toUpperCase() + mode.slice(1)
              )
            )
          ),
        ]
      ),

      // Accent Color Setting
      Spicetify.React.createElement(
        "div",
        {
          className: "x-settings-row",
          key: "accent-color",
        },
        [
          Spicetify.React.createElement(
            "label",
            {
              className: "TextElement-bodySmall-textSubdued-text",
              key: "label",
            },
            "Accent Color Priority"
          ),
          Spicetify.React.createElement(
            "select",
            {
              className: "main-dropDown-dropDown",
              value: accentColor,
              onChange: (e) => setAccentColor(e.target.value),
              key: "select",
            },
            accentOptions.map((option) =>
              Spicetify.React.createElement(
                "option",
                {
                  key: option,
                  value: option,
                },
                option.charAt(0).toUpperCase() + option.slice(1)
              )
            )
          ),
        ]
      ),
    ]
  );
});

// Insert settings panel into preferences
function insertThemeSettings(pathname) {
  if (pathname !== "/preferences") return;

  const checkForSettings = setInterval(() => {
    const settingsContainer = document.querySelector(
      '[data-testid="settings-page"]'
    );

    if (settingsContainer) {
      clearInterval(checkForSettings);

      const settingsDiv = document.createElement("div");
      Spicetify.ReactDOM.render(
        Spicetify.React.createElement(ThemeSettings),
        settingsDiv
      );

      const firstSection = settingsContainer.querySelector(
        ".x-settings-section"
      );
      if (firstSection) {
        firstSection.parentNode.insertBefore(
          settingsDiv,
          firstSection.nextSibling
        );
      }
    }
  }, 100);
}

// Initialize settings
insertThemeSettings(Spicetify.Platform.History.location?.pathname);
Spicetify.Platform.History.listen((event) => {
  insertThemeSettings(event.pathname);
});
```

---

## 📋 Implementation Checklist

### ✅ Theme Development Checklist

**Setup & Configuration:**

- [ ] Run `spicetify enable-devtools` for CSS inspection
- [ ] Configure `inject_css 1 replace_colors 1`
- [ ] Set up proper theme folder structure
- [ ] Create `color.ini` with modern `--spice-` variables
- [ ] Create `user.css` with component-based selectors

**Color System Implementation:**

- [ ] Implement native `Spicetify.colorExtractor()` API
- [ ] Add canvas-based fallback for color extraction
- [ ] Set up color caching system for performance
- [ ] Handle light/dark mode detection and switching
- [ ] Implement smooth color transitions

**Dynamic Features:**

- [ ] Add `songchange` event listener
- [ ] Implement debounced color updates
- [ ] Create theme settings panel
- [ ] Add user preference persistence
- [ ] Handle edge cases (no album art, local files)

**Component Targeting:**

- [ ] Use stable CSS selectors (prefer `[data-testid]`)
- [ ] Target main layout containers properly
- [ ] Style interactive elements consistently
- [ ] Handle state-based styling (active, focus, hover)
- [ ] Test across different Spotify UI states

**Performance & Accessibility:**

- [ ] Implement proper focus management
- [ ] Add high contrast mode support
- [ ] Respect `prefers-reduced-motion`
- [ ] Optimize CSS animations and transitions
- [ ] Test with screen readers

**Testing & Debugging:**

- [ ] Test color extraction with various album arts
- [ ] Verify WCAG contrast ratios
- [ ] Test responsive behavior
- [ ] Debug with browser dev tools
- [ ] Test theme persistence across sessions

**Documentation:**

- [ ] Document custom CSS variables
- [ ] Create installation instructions
- [ ] Add troubleshooting guide
- [ ] Document theme configuration options
- [ ] Include performance considerations

---

## 📚 Additional Resources & References

### Official Documentation

- [Spicetify API Reference](https://spicetify.app/docs/development/api-wrapper/)
- [Color Extractor Function](https://spicetify.app/docs/development/api-wrapper/functions/color-extractor/)
- [Theme Development Guide](https://spicetify.app/docs/development/themes/)
- [Extension Development](https://spicetify.app/docs/development/extensions/)

### Community Examples

- [JulienMaille Dynamic Theme](https://github.com/JulienMaille/spicetify-dynamic-theme) - Reference implementation
- [Catppuccin Spicetify](https://github.com/catppuccin/spicetify) - Modern CSS approach
- [Spicetify Themes Collection](https://github.com/spicetify/spicetify-themes) - Community themes

### Development Tools

- [React Developer Tools](https://spicetify.app/docs/development/react-devtools/) - Component inspection
- [Spicetify Marketplace](https://github.com/spicetify/marketplace) - Theme distribution
- [CSS Color Tools](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors) - Color specification reference

---

_This design bible is a living document. Updates and improvements are welcome as the Spicetify ecosystem evolves._

**Last Updated:** January 2025
**Version:** 1.0
**Compatibility:** Spicetify CLI 2.27+ | Spotify 1.2.0+
