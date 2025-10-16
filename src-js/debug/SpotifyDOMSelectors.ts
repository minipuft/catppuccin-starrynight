// ===================================================================
// 🎯 SPOTIFY DOM SELECTORS CONFIGURATION
// ===================================================================
// Centralized selector mappings based on SPOTIFY_DOM_TARGETING.md
// Provides modern selectors and legacy fallbacks for Spicetify theming

import { $$ } from "@/utils/dom/domCache";

// ---------------------------------------------------------------------------
// NOTE[Phase3]: Replaced repetitive querySelectorAll calls with WeakRef-caching
// helper $$.  All look-ups inside this module should go through $$ from now on
// to benefit from selector-level memoisation.
// ---------------------------------------------------------------------------

export const MODERN_SELECTORS: { [key: string]: string } = {
  // Main Layout Structure
  nowPlayingBar: ".Root__now-playing-bar",
  leftSidebar: ".Root__nav-bar",
  mainView: ".Root__main-view",
  mainViewContainer: ".main-view-container",
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
  navBarLink: ".main-navBar-navBarLink",
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
  trackName: "[data-testid='track-name']",
  artistName: "[data-testid='artist-name']",
  trackListTrackName: ".main-trackList-trackName",
  trackListArtistName: ".main-trackList-artistName",

  // Entity Headers (Playlist/Album/Artist Pages)
  entityHeader: ".main-entityHeader-container",
  entityTitle: ".main-entityHeader-title",
  entityMetadata: ".main-entityHeader-metaData",
  entityImage: ".main-entityHeader-imageContainer",
  entityHeaderTitleText: ".main-entityHeader-titleText",
  entityCard: ".main-entityCard-container",

  // Action Bar & Controls
  actionBar: ".main-actionBar-ActionBarRow",
  actionBarInner: ".main-actionBar-ActionBar",
  playButton: "[data-testid='play-button']",
  pauseButton: "[data-testid='pause-button']",
  shuffleButton: "[data-testid='shuffle-button']",
  likeButton: ".control-button-heart",
  controlButton: "[data-testid='control-button']",
  playPauseButton: ".main-playPauseButton-button",
  playerControlsButtons: ".player-controls__buttons",

  // Buttons & Interactive Elements
  buttonGeneric: 'button[class*="Button"]',
  buttonRole: '[role="button"]',
  playButtonLegacy: ".main-playButton-PlayButton",

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
  // Phase 2.2: Unified .sn-card selector (CardDOMWatcher) + legacy
  card: ".sn-card, .main-card-card",
  cardImage: ".main-cardImage-image",
  albumArt: ".main-trackList-albumArt",

  // Icons
  iconGeneric: 'svg[class*="Icon"]',
  iconTestId: '[data-testid*="icon"]',
  iconLegacy: ".Svg-sc-ytk21e-0",

  // Modal & Overlay
  modal: ".main-modal-container",
  overlay: ".main-overlay-container",
};

export const LEGACY_SELECTORS: { [key: string]: string } = {
  // Old selectors that might still be used in some contexts
  nowPlayingWidget: ".main-nowPlayingWidget-nowPlaying",
  navBar: ".main-navBar-navBar",
  navBarLink: ".main-navBar-navBarLink",
  searchBar: ".main-search-searchBar",
  topBar: ".main-topBar-topBar",
  queue: ".main-queue-queue",
  trackList: ".main-trackList-trackList",
};

export const SELECTOR_MAPPINGS: { [key: string]: string } = Object.entries({
  // Migration mapping: legacy → modern
  ".main-nowPlayingWidget-nowPlaying": MODERN_SELECTORS["nowPlayingBar"],
  ".main-navBar-navBar": MODERN_SELECTORS["leftSidebar"],
  ".main-search-searchBar": MODERN_SELECTORS["searchInput"],
  ".main-topBar-topBar": MODERN_SELECTORS["actionBar"],
  ".main-queue-queue": MODERN_SELECTORS["queue"],
  ".main-trackList-trackList": MODERN_SELECTORS["trackListContainer"],
}).reduce((acc, [key, value]) => {
  if (typeof value === "string") {
    acc[key] = value;
  }
  return acc;
}, {} as { [key: string]: string });

// Grouped selectors for easy consumption by systems that need multiple fallbacks
export const SELECTOR_GROUPS: { [key: string]: string[] } = {
  nowPlaying: [
    MODERN_SELECTORS.nowPlayingWidget as string,
    LEGACY_SELECTORS.nowPlayingWidget as string,
    MODERN_SELECTORS.nowPlayingBar as string,
  ],
  sidebar: [
    MODERN_SELECTORS.leftSidebar as string,
    LEGACY_SELECTORS.navBar as string,
  ],
  mainContent: [
    MODERN_SELECTORS.mainView as string,
    MODERN_SELECTORS.mainViewContainer as string,
  ],
  buttons: [
    MODERN_SELECTORS.buttonGeneric as string,
    MODERN_SELECTORS.buttonRole as string,
    MODERN_SELECTORS.playButtonLegacy as string,
  ],
  cards: [
    MODERN_SELECTORS.card as string, // Already includes ".sn-card, .main-card-card"
    MODERN_SELECTORS.entityCard as string,
  ],
  headers: [
    "h1, h2, h3, h4, h5, h6",
    MODERN_SELECTORS.entityHeaderTitleText as string,
    MODERN_SELECTORS.entityHeader as string,
  ],
  textElements: [
    MODERN_SELECTORS.trackName as string,
    MODERN_SELECTORS.artistName as string,
    MODERN_SELECTORS.trackListTrackName as string,
    MODERN_SELECTORS.trackListArtistName as string,
  ],
  iconElements: [
    MODERN_SELECTORS.iconGeneric as string,
    MODERN_SELECTORS.iconTestId as string,
    MODERN_SELECTORS.iconLegacy as string,
  ],
  playbackControls: [
    MODERN_SELECTORS.controlButton as string,
    MODERN_SELECTORS.playPauseButton as string,
    MODERN_SELECTORS.playerControlsButtons as string,
  ],
  trackRows: [
    MODERN_SELECTORS.trackRow as string,
    LEGACY_SELECTORS.trackList as string,
  ],
};

export const ORBITAL_ELEMENTS: { [key: string]: string } = {
  // Elements that can have orbital gravity effects
  trackRows: MODERN_SELECTORS["trackRow"] ?? "",
  libraryItems: MODERN_SELECTORS["libraryItems"] ?? "",
  cards: MODERN_SELECTORS["card"] ?? "",
  navLinks: ".main-navBar-navBarLink", // This one still works
};

export const GRAVITY_WELL_TARGETS: { [key: string]: string[] } = {
  // Major UI elements that should have gravity wells
  primary: [
    MODERN_SELECTORS["nowPlayingBar"],
    MODERN_SELECTORS["leftSidebar"],
    MODERN_SELECTORS["entityHeader"],
  ].filter((s): s is string => !!s),
  secondary: [
    MODERN_SELECTORS["actionBar"],
    MODERN_SELECTORS["queue"],
    MODERN_SELECTORS["searchInput"],
  ].filter((s): s is string => !!s),
  tertiary: [
    MODERN_SELECTORS["playButton"],
    MODERN_SELECTORS["trackListHeader"],
  ].filter((s): s is string => !!s),
};

export const ANTI_GRAVITY_ZONES: { [key: string]: string[] } = {
  // Areas where anti-gravity effects should be applied
  searchAreas: [
    MODERN_SELECTORS["searchInput"],
    MODERN_SELECTORS["searchPage"],
  ].filter((s): s is string => !!s),
  notifications: [
    "[data-testid='notification-bar']",
    ".main-topBar-notifications",
  ],
  dropdowns: [".main-dropdown-menu", "[role='menu']", "[role='listbox']"],
};

// Utility function to check if an element exists
export function elementExists(selector: string): boolean {
  return $$(selector).length > 0;
}

// Utility function to find element with fallback
export function findElementWithFallback(
  modernSelector: string,
  legacySelector?: string
): Element | null {
  const modernMatches = $$(modernSelector);
  let element: Element | null = modernMatches.length
    ? (modernMatches[0] as Element)
    : null;
  if (!element && legacySelector) {
    element = ($$(legacySelector)[0] as Element | undefined) || null;
    if (element) {
      console.warn(
        `🌌 [SpotifyDOMSelectors] Using legacy selector: ${legacySelector}. Consider updating to: ${modernSelector}`
      );
    }
  }
  return element;
}

// Utility function to get all elements with fallbacks
export function findElementsWithFallback(
  modernSelector: string,
  legacySelector?: string,
  options?: { force?: boolean }
): Element[] {
  let elements = $$(modernSelector, options);
  if (elements.length === 0 && legacySelector) {
    elements = $$(legacySelector, options);
    if (elements.length > 0) {
      console.warn(
        `🌌 [SpotifyDOMSelectors] Using legacy selector: ${legacySelector}. Consider updating to: ${modernSelector}`
      );
    }
  }
  return elements;
}

// Debug function to validate current DOM state
export function validateSpotifyDOM(): any {
  console.group("🌌 [SpotifyDOMSelectors] DOM Validation");

  const results = {
    found: 0,
    missing: 0,
    details: {} as { [key: string]: any },
  };

  Object.entries(MODERN_SELECTORS).forEach(([key, selector]) => {
    const exists = elementExists(selector);
    results.details[key] = {
      selector,
      exists,
      element: exists ? $$(selector)[0] || null : null,
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

export function testGravitySystemSelectors(): void {
  console.group("🌌 [Phase 1] Testing Gravity System Selectors");

  console.log("🎯 Primary gravity well targets:");
  if (GRAVITY_WELL_TARGETS["primary"]) {
    GRAVITY_WELL_TARGETS["primary"].forEach((selector) => {
      const element = $$(selector)[0] || null;
      console.log(`${element ? "✅" : "❌"} ${selector}`, element);
    });
  }

  console.log("🎯 Secondary gravity well targets:");
  if (GRAVITY_WELL_TARGETS["secondary"]) {
    GRAVITY_WELL_TARGETS["secondary"].forEach((selector) => {
      const element = $$(selector)[0] || null;
      console.log(`${element ? "✅" : "❌"} ${selector}`, element);
    });
  }

  console.log("🛸 Orbital elements:");
  Object.entries(ORBITAL_ELEMENTS).forEach(([key, selector]) => {
    const elements = $$(selector);
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
export function validatePredictionTargets(): any {
  console.group(
    "🔮 [SpotifyDOMSelectors] Phase 2 - Prediction Target Validation"
  );

  const testSelectors = [
    { name: "Track Rows", selector: ORBITAL_ELEMENTS["trackRows"] },
    { name: "Progress Bar", selector: MODERN_SELECTORS["progressBar"] },
    { name: "Play Button", selector: MODERN_SELECTORS["playButton"] },
    { name: "Heart Button", selector: MODERN_SELECTORS["heartButton"] },
    { name: "Album Cover", selector: MODERN_SELECTORS["albumCover"] },
    {
      name: "Now Playing Widget",
      selector: MODERN_SELECTORS["nowPlayingWidget"],
    },
    { name: "Now Playing Left", selector: MODERN_SELECTORS["nowPlayingLeft"] },
    { name: "Left Sidebar", selector: MODERN_SELECTORS["leftSidebar"] },
    { name: "Library Items", selector: ORBITAL_ELEMENTS["libraryItems"] },
  ];

  const results = {
    found: 0,
    missing: 0,
    details: {} as { [key: string]: any },
  };

  testSelectors.forEach(({ name, selector }) => {
    if (!selector) return;
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
export function testPhase2Systems(): any {
  console.group("🌌 [SpotifyDOMSelectors] Phase 2 - System Integration Test");

  const systemTests = {
    behavioralPrediction: validatePredictionTargets(),
    dimensionalNexus: {
      sidebarElement: MODERN_SELECTORS["leftSidebar"]
        ? elementExists(MODERN_SELECTORS["leftSidebar"])
        : false,
    },
    dataGlyph: {
      navLinks: MODERN_SELECTORS["navBarLink"]
        ? elementExists(MODERN_SELECTORS["navBarLink"])
        : false,
      trackRows: ORBITAL_ELEMENTS["trackRows"]
        ? elementExists(ORBITAL_ELEMENTS["trackRows"])
        : false,
      cards: ORBITAL_ELEMENTS["cards"]
        ? elementExists(ORBITAL_ELEMENTS["cards"])
        : false,
    },
  };

  let totalIssues = 0;
  Object.values(systemTests).forEach((tests) => {
    if (typeof tests === "object" && (tests as any).missing) {
      totalIssues += (tests as any).missing;
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
  (window as any).SpotifyDOMSelectors = {
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
