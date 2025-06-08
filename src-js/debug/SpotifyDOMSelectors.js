// ===================================================================
// 🎯 SPOTIFY DOM SELECTORS CONFIGURATION
// ===================================================================
// Centralized selector mappings based on SPOTIFY_DOM_TARGETING.md
// Provides modern selectors and legacy fallbacks for Spicetify theming

export const MODERN_SELECTORS = {
  // Main Layout Structure
  nowPlayingBar: ".Root__now-playing-bar",
  leftSidebar: ".Root__nav-bar",
  mainView: ".Root__main-view",
  rightSidebar: ".Root__right-sidebar",

  // Now Playing Components
  nowPlayingWidget: "[data-testid='now-playing-widget']",
  nowPlayingLeft: ".main-nowPlayingBar-left",
  nowPlayingCenter: ".main-nowPlayingBar-center",
  nowPlayingRight: ".main-nowPlayingBar-right",
  coverArt: ".main-coverSlotCollapsed-container",
  trackInfo: ".main-trackInfo-container",

  // Navigation & Library
  navMain: "nav[aria-label='Main']",
  yourLibrary: ".main-yourLibraryX-libraryContainer",
  libraryItems: ".main-yourLibraryX-listItem",
  libraryHeader: ".main-yourLibraryX-header",
  playlistList: ".main-rootlist-wrapper",

  // Track Lists & Content
  trackListContainer: "[role='grid'][aria-label*='tracks']",
  trackRow: ".main-trackList-trackListRow",
  trackListHeader: ".main-trackList-trackListHeaderRow",
  trackNumber: ".main-trackList-rowSectionIndex",
  trackTitle: ".main-trackList-rowTitle",
  trackArtist: ".main-trackList-rowSubTitle",

  // Entity Headers (Playlist/Album/Artist Pages)
  entityHeader: ".main-entityHeader-container",
  entityTitle: ".main-entityHeader-title",
  entityMetadata: ".main-entityHeader-metaData",
  entityImage: ".main-entityHeader-imageContainer",

  // Action Bar & Controls
  actionBar: ".main-actionBar-ActionBarRow",
  actionBarInner: ".main-actionBar-ActionBar",
  playButton: "[data-testid='play-button']",
  pauseButton: "[data-testid='pause-button']",
  shuffleButton: "[data-testid='shuffle-button']",
  likeButton: ".control-button-heart",

  // Queue & Right Sidebar
  queue: ".main-queue-trackList",
  queueContainer: "[aria-label='Next in queue']",
  aboutArtist: "[aria-label='About the artist']",
  credits: "[aria-label='Credits']",

  // Search & Filtering
  searchInput: "[data-testid='search-input']",
  searchPage: "[data-testid='search-container']",
  filterPills: ".main-genre-chip",
  sortButton: "[data-testid='sort-button']",

  // Cards & Media
  card: ".main-card-card",
  cardImage: ".main-cardImage-image",
  albumArt: ".main-trackList-albumArt",

  // Modal & Overlay
  modal: ".main-modal-container",
  overlay: ".main-overlay-container",
};

export const LEGACY_SELECTORS = {
  // Old selectors that might still be used in some contexts
  nowPlayingWidget: ".main-nowPlayingWidget-nowPlaying",
  navBar: ".main-navBar-navBar",
  navBarLink: ".main-navBar-navBarLink",
  searchBar: ".main-search-searchBar",
  topBar: ".main-topBar-topBar",
  queue: ".main-queue-queue",
  trackList: ".main-trackList-trackList",
};

export const SELECTOR_MAPPINGS = {
  // Migration mapping: legacy → modern
  ".main-nowPlayingWidget-nowPlaying": MODERN_SELECTORS.nowPlayingBar,
  ".main-navBar-navBar": MODERN_SELECTORS.leftSidebar,
  ".main-search-searchBar": MODERN_SELECTORS.searchInput,
  ".main-topBar-topBar": MODERN_SELECTORS.actionBar,
  ".main-queue-queue": MODERN_SELECTORS.queue,
  ".main-trackList-trackList": MODERN_SELECTORS.trackListContainer,
};

export const ORBITAL_ELEMENTS = {
  // Elements that can have orbital gravity effects
  trackRows: MODERN_SELECTORS.trackRow,
  libraryItems: MODERN_SELECTORS.libraryItems,
  cards: MODERN_SELECTORS.card,
  navLinks: ".main-navBar-navBarLink", // This one still works
};

export const GRAVITY_WELL_TARGETS = {
  // Major UI elements that should have gravity wells
  primary: [
    MODERN_SELECTORS.nowPlayingBar,
    MODERN_SELECTORS.leftSidebar,
    MODERN_SELECTORS.entityHeader,
  ],
  secondary: [
    MODERN_SELECTORS.actionBar,
    MODERN_SELECTORS.queue,
    MODERN_SELECTORS.searchInput,
  ],
  tertiary: [MODERN_SELECTORS.playButton, MODERN_SELECTORS.trackListHeader],
};

export const ANTI_GRAVITY_ZONES = {
  // Areas where anti-gravity effects should be applied
  searchAreas: [MODERN_SELECTORS.searchInput, MODERN_SELECTORS.searchPage],
  notifications: [
    "[data-testid='notification-bar']",
    ".main-topBar-notifications",
  ],
  dropdowns: [".main-dropdown-menu", "[role='menu']", "[role='listbox']"],
};

// Utility function to check if an element exists
export function elementExists(selector) {
  return document.querySelector(selector) !== null;
}

// Utility function to find element with fallback
export function findElementWithFallback(modernSelector, legacySelector) {
  let element = document.querySelector(modernSelector);
  if (!element && legacySelector) {
    element = document.querySelector(legacySelector);
    if (element) {
      console.warn(
        `🌌 [SpotifyDOMSelectors] Using legacy selector: ${legacySelector}. Consider updating to: ${modernSelector}`
      );
    }
  }
  return element;
}

// Utility function to get all elements with fallbacks
export function findElementsWithFallback(modernSelector, legacySelector) {
  let elements = document.querySelectorAll(modernSelector);
  if (elements.length === 0 && legacySelector) {
    elements = document.querySelectorAll(legacySelector);
    if (elements.length > 0) {
      console.warn(
        `🌌 [SpotifyDOMSelectors] Using legacy selector: ${legacySelector}. Consider updating to: ${modernSelector}`
      );
    }
  }
  return elements;
}

// Debug function to validate current DOM state
export function validateSpotifyDOM() {
  console.group("🌌 [SpotifyDOMSelectors] DOM Validation");

  const results = {
    found: 0,
    missing: 0,
    details: {},
  };

  Object.entries(MODERN_SELECTORS).forEach(([key, selector]) => {
    const exists = elementExists(selector);
    results.details[key] = {
      selector,
      exists,
      element: exists ? document.querySelector(selector) : null,
    };

    if (exists) {
      results.found++;
      console.log(`✅ ${key}: ${selector}`);
    } else {
      results.missing++;
      console.warn(`❌ ${key}: ${selector}`);
    }
  });

  console.log(`📊 Summary: ${results.found} found, ${results.missing} missing`);
  console.groupEnd();

  return results;
}

// === PHASE 1 VERIFICATION FUNCTIONS ===
// Quick debug functions to test selector updates

export function testGravitySystemSelectors() {
  console.group("🌌 [Phase 1] Testing Gravity System Selectors");

  console.log("🎯 Primary gravity well targets:");
  GRAVITY_WELL_TARGETS.primary.forEach((selector) => {
    const element = document.querySelector(selector);
    console.log(`${element ? "✅" : "❌"} ${selector}`, element);
  });

  console.log("🎯 Secondary gravity well targets:");
  GRAVITY_WELL_TARGETS.secondary.forEach((selector) => {
    const element = document.querySelector(selector);
    console.log(`${element ? "✅" : "❌"} ${selector}`, element);
  });

  console.log("🛸 Orbital elements:");
  Object.entries(ORBITAL_ELEMENTS).forEach(([key, selector]) => {
    const elements = document.querySelectorAll(selector);
    console.log(
      `${elements.length > 0 ? "✅" : "❌"} ${key} (${selector}): ${
        elements.length
      } found`
    );
  });

  console.groupEnd();
}

// === PHASE 2 VERIFICATION FUNCTIONS ===

// Test the prediction engine selectors specifically
export function validatePredictionTargets() {
  console.group(
    "🔮 [SpotifyDOMSelectors] Phase 2 - Prediction Target Validation"
  );

  const testSelectors = [
    { name: "Track Rows", selector: ORBITAL_ELEMENTS.trackRows },
    { name: "Progress Bar", selector: MODERN_SELECTORS.progressBar },
    { name: "Play Button", selector: MODERN_SELECTORS.playButton },
    { name: "Heart Button", selector: MODERN_SELECTORS.heartButton },
    { name: "Album Cover", selector: MODERN_SELECTORS.albumCover },
    { name: "Now Playing Widget", selector: MODERN_SELECTORS.nowPlayingWidget },
    { name: "Now Playing Left", selector: MODERN_SELECTORS.nowPlayingLeft },
    { name: "Left Sidebar", selector: MODERN_SELECTORS.leftSidebar },
    { name: "Library Items", selector: ORBITAL_ELEMENTS.libraryItems },
  ];

  const results = {
    found: 0,
    missing: 0,
    details: {},
  };

  testSelectors.forEach(({ name, selector }) => {
    const elements = findElementsWithFallback(selector);
    const count = elements.length;
    results.details[name] = {
      selector,
      count,
      exists: count > 0,
    };

    if (count > 0) {
      results.found++;
      console.log(`✅ ${name}: ${count} elements found (${selector})`);
    } else {
      results.missing++;
      console.warn(`❌ ${name}: No elements found (${selector})`);
    }
  });

  console.log(
    `📊 Prediction Targets Summary: ${results.found} types found, ${results.missing} missing`
  );
  console.groupEnd();

  return results;
}

// Test all Phase 2 updated systems
export function testPhase2Systems() {
  console.group("🌌 [SpotifyDOMSelectors] Phase 2 - System Integration Test");

  const systemTests = {
    behavioralPrediction: validatePredictionTargets(),
    dimensionalNexus: {
      sidebarElement: elementExists(MODERN_SELECTORS.leftSidebar),
    },
    dataGlyph: {
      navLinks: elementExists(MODERN_SELECTORS.navBarLink),
      trackRows: elementExists(ORBITAL_ELEMENTS.trackRows),
      cards: elementExists(ORBITAL_ELEMENTS.cards),
    },
  };

  let totalIssues = 0;
  Object.entries(systemTests).forEach(([system, tests]) => {
    if (typeof tests === "object" && tests.missing) {
      totalIssues += tests.missing;
    }
  });

  console.log(
    `🎯 Phase 2 Integration Health: ${
      totalIssues === 0
        ? "✅ All systems operational"
        : `⚠️ ${totalIssues} issues detected`
    }`
  );
  console.groupEnd();

  return systemTests;
}

// Global exposure for easy console testing
if (typeof window !== "undefined") {
  window.SpotifyDOMSelectors = {
    validate: validateSpotifyDOM,
    testGravity: testGravitySystemSelectors,
    validatePredictionTargets,
    testPhase2Systems,
    selectors: MODERN_SELECTORS,
    targets: GRAVITY_WELL_TARGETS,
    orbital: ORBITAL_ELEMENTS,
    antiGravity: ANTI_GRAVITY_ZONES,
  };

  console.log("🎯 [SpotifyDOMSelectors] Debug functions available:");
  console.log("  window.SpotifyDOMSelectors.validate() - Test all selectors");
  console.log(
    "  window.SpotifyDOMSelectors.testGravity() - Test gravity selectors"
  );
}
