// visualPerformance.ts – helper utilities for Year 3000 visual systems
// ---------------------------------------------------------------
// This file hosts lightweight utilities that should stay **framework-agnostic**
// and have **zero** runtime dependencies other than ES modules.  Anything that
// requires DOM access or class instances belongs elsewhere.
//
// NOTE: The helper intentionally does not import global config files to avoid
// circular references.  Callers must pass the `performanceProfiles` object
// explicitly.

export interface PerformanceProfileMap {
  [quality: string]: any;
}

export interface ApplyProfileOptions {
  /**
   * Optional tracing function (e.g., `PerformanceAnalyzer.emitTrace`).
   * Falls back to silent mode when omitted.
   */
  trace?: (msg: string, data?: unknown) => void;
}

/**
 * Select the desired performance-profile from a map containing pre-defined
 * profiles.  When the requested quality is not found, the function tries the
 * following fallbacks in order: `balanced`  → first key in the object.
 */
export function selectPerformanceProfile(
  quality: string,
  performanceProfiles: PerformanceProfileMap,
  opts: ApplyProfileOptions = {}
): any {
  const { trace } = opts;
  if (!performanceProfiles || typeof performanceProfiles !== "object") {
    trace?.(
      "[visualPerformance] No performanceProfiles provided – skipping selection"
    );
    return null;
  }

  let selected = performanceProfiles[quality];
  if (!selected) {
    trace?.(
      `[visualPerformance] Profile '${quality}' not found, falling back to 'balanced'`
    );
    selected = performanceProfiles["balanced"];
  }
  if (!selected) {
    // Use first available entry – last-chance fallback.
    const firstKey = Object.keys(
      performanceProfiles
    )[0] as keyof typeof performanceProfiles;
    selected = performanceProfiles[firstKey];
    trace?.(
      `[visualPerformance] Using first available profile '${firstKey}' as fallback`
    );
  }

  return selected;
}
