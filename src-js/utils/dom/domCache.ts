/*
 * ---------------------------------------------------------------------------
 * 🌌 DOM CACHE HELPER – Phase 3 (Selector Intelligence Optimisation)
 * ---------------------------------------------------------------------------
 * Provides a very small wrapper around document.querySelectorAll that returns a
 * cached result while the Element list is still strongly reachable. It uses
 * WeakRef + FinalizationRegistry so that once all Elements are detached and
 * garbage-collected the cache entry is automatically pruned.
 *
 * Fallbacks are included for engines that do not support WeakRef or
 * FinalizationRegistry – in those scenarios the helper simply performs an
 * uncached query.
 * ---------------------------------------------------------------------------
 */

/* ---------------------------------------------------------------------------
 * Ambient fallback typings for WeakRef / FinalizationRegistry so the file
 * type-checks even when the TypeScript lib used by the project predates
 * their standard declarations.  When the real globals exist the ambient
 * ones are simply ignored thanks to declaration merging.
 * ------------------------------------------------------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var WeakRef: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var FinalizationRegistry: any;

export {};

export interface DomCacheOptions {
  /** Force refresh the cache and re-query even when an entry exists. */
  force?: boolean;
}

interface CacheEntry {
  // Using `any` here to avoid a hard dependency on `WeakRef` typings in older
  // TypeScript libs.  At runtime this will hold a WeakRef instance when
  // available, otherwise `null`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any;
  lastUpdate: number;
}

const CACHE = new Map<string, CacheEntry>();
const SUPPORTS_WEAKREF = typeof WeakRef !== "undefined";
const SUPPORTS_REGISTRY = typeof FinalizationRegistry !== "undefined";

// Clean-up callback removes the cache entry once its value is GC-collected.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: any = SUPPORTS_REGISTRY
  ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – lib dom may not include FinalizationRegistry in older TS bundlers
    new FinalizationRegistry((selector: string) => {
      CACHE.delete(selector);
    })
  : null;

/**
 * Cached querySelectorAll wrapper.
 *
 * @example
 *   const links = $$(".main-navBar-navBarLink");
 */
export function $$(selector: string, options: DomCacheOptions = {}): Element[] {
  if (!SUPPORTS_WEAKREF) {
    // Environment doesn't support WeakRef – fall back to direct query.
    return Array.from(document.querySelectorAll(selector));
  }

  let entry = CACHE.get(selector);
  let elements = entry?.ref?.deref();

  if (options.force || !elements) {
    elements = Array.from(document.querySelectorAll(selector));
    // (Re)create cache entry
    const ref = new WeakRef(elements);
    entry = { ref, lastUpdate: Date.now() };
    CACHE.set(selector, entry);
    registry?.register(elements, selector);
  }

  return elements;
}

/** Remove a specific selector cache entry */
export function invalidateSelector(selector: string): void {
  CACHE.delete(selector);
}

/** Clear all cached selector entries */
export function clearDomCache(): void {
  CACHE.clear();
}

/** Generate a quick diagnostics report */
export function getDomCacheReport() {
  const rows = Array.from(CACHE.entries()).map(([sel, entry]) => ({
    selector: sel,
    cached: !!entry.ref?.deref(),
    ageMs: Date.now() - entry.lastUpdate,
  }));
  return rows;
}
