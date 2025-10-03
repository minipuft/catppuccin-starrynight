/**
 * CardDOMWatcher - Unified card detection for Spotify DOM variants
 *
 * Watches for card elements and applies unified .sn-card class to both
 * .main-card-card and .main-card-cardContainer variants.
 *
 * Pattern: Functional watcher similar to NowPlayingDomWatcher
 *
 * Purpose: Future-proof against Spotify DOM changes by normalizing
 * all card variants to a single .sn-card class that CSS can target.
 */

export const CARD_SELECTORS = [
  '.main-card-card',
  '.main-card-cardContainer',
  '.Card[class*="card"]', // Catch-all for future variants
] as const;

export interface CardDOMWatcherOptions {
  enableDebug?: boolean;
  unifiedClass?: string; // Default: 'sn-card'
  onCardDiscovered?: (card: Element) => void;
}

/**
 * Start watching for card elements and apply unified class
 * Returns disposer function to stop watching
 *
 * @example
 * ```typescript
 * const dispose = startCardDOMWatcher({
 *   enableDebug: true,
 *   onCardDiscovered: (card) => console.log('New card:', card)
 * });
 *
 * // Later, to stop watching:
 * dispose();
 * ```
 */
export function startCardDOMWatcher(
  options: CardDOMWatcherOptions = {}
): () => void {
  const {
    enableDebug = false,
    unifiedClass = 'sn-card',
    onCardDiscovered
  } = options;

  // Normalize existing cards immediately
  normalizeExistingCards(unifiedClass, enableDebug, onCardDiscovered);

  // Watch for new cards
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          normalizeCard(node, unifiedClass, enableDebug, onCardDiscovered);
        }
      });
    });
  });

  // Observe main content area for better performance
  const mainContent = document.querySelector('.main-view-container') || document.body;
  observer.observe(mainContent, {
    childList: true,
    subtree: true,
  });

  if (enableDebug) {
    console.log('[CardDOMWatcher] Started watching for card elements');
  }

  // Return disposer
  return () => {
    observer.disconnect();
    if (enableDebug) {
      console.log('[CardDOMWatcher] Stopped watching');
    }
  };
}

/**
 * Normalize all existing cards on the page
 */
function normalizeExistingCards(
  unifiedClass: string,
  enableDebug: boolean,
  onCardDiscovered?: (card: Element) => void
): void {
  let normalizedCount = 0;

  CARD_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((card) => {
      if (!card.classList.contains(unifiedClass)) {
        card.classList.add(unifiedClass);
        normalizedCount++;
        onCardDiscovered?.(card);
      }
    });
  });

  if (enableDebug && normalizedCount > 0) {
    console.log(`[CardDOMWatcher] Normalized ${normalizedCount} existing cards`);
  }
}

/**
 * Normalize a single card element
 */
function normalizeCard(
  element: Element,
  unifiedClass: string,
  enableDebug: boolean,
  onCardDiscovered?: (card: Element) => void
): void {
  const isCard = CARD_SELECTORS.some(selector => element.matches(selector));

  if (isCard && !element.classList.contains(unifiedClass)) {
    element.classList.add(unifiedClass);
    onCardDiscovered?.(element);

    if (enableDebug) {
      console.log('[CardDOMWatcher] Normalized new card:', element.className);
    }
  }

  // Also check child elements
  CARD_SELECTORS.forEach((selector) => {
    element.querySelectorAll(selector).forEach((card) => {
      if (!card.classList.contains(unifiedClass)) {
        card.classList.add(unifiedClass);
        onCardDiscovered?.(card);

        if (enableDebug) {
          console.log('[CardDOMWatcher] Normalized child card:', card.className);
        }
      }
    });
  });
}
