// ============================================================================
// 🛰️  DRAG CARTOGRAPHER – Phase 1 Stellar Mapping
// ----------------------------------------------------------------------------
// Tracks all native `dragstart` events during runtime and logs a concise CSS
// selector path, element snapshot, and drag payload to the console. This helps
// us catalogue which DOM nodes initiate Spotify's drag-and-drop flows so we
// can later augment them with richer previews and quick-add menus.
//
// ⚠️  This file is **development / debug-only**. It is conditionally imported
//     from `theme.entry.ts` when `YEAR3000_CONFIG.enableDebug === true`.
//     No production bundles should include this code.
//
// Export `enableDragCartography()` to activate. The function is idempotent and
// safe to call multiple times (hot-reload friendly).
// ----------------------------------------------------------------------------

/* eslint-disable no-console */

interface DragStartLog {
  time: string;
  selector: string;
  uris?: string[];
  label?: string;
  contextUri?: string;
  sectionIndex?: number;
}

interface DragAggregate {
  selector: string;
  count: number;
  samples: DragStartLog[];
}

class DragCartographer {
  private static readonly MAX_PATH_DEPTH = 4;
  private readonly seen = new WeakSet<EventTarget>();
  private static readonly aggregate: Map<string, DragAggregate> = new Map();

  constructor() {
    document.addEventListener("dragstart", this.handleDragStart, true);
  }

  private handleDragStart = (event: DragEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (this.seen.has(target)) return; // log each element once per session
    this.seen.add(target);

    const selector = DragCartographer.buildSelectorPath(target);
    const detail: DragStartLog = {
      time: new Date().toLocaleTimeString(),
      selector,
    };

    // Attempt to read Spicetify drag payload if available
    // Spotify attaches data under these MIME-types
    try {
      const dt = event.dataTransfer;
      if (dt) {
        const uris = dt.getData("text/spotify") || dt.getData("text/uri-list");
        if (uris) {
          detail.uris = uris.split(/\n|,/).filter(Boolean);
        }
        const label = dt.getData("text/plain");
        if (label) detail.label = label;
      }
    } catch {
      /* silent */
    }

    // ---------------- Aggregate counts -----------------
    const agg = DragCartographer.aggregate;
    const entry = agg.get(selector);
    if (entry) {
      entry.count += 1;
      if (entry.samples.length < 3) entry.samples.push(detail);
    } else {
      agg.set(selector, { selector, count: 1, samples: [detail] });
    }

    console.groupCollapsed(
      `%c[DragCartographer] dragstart → ${selector}`,
      "color:#7dd3fc;font-weight:600"
    );
    console.table(detail);
    console.log("Event:", event);
    console.log("Target element snapshot:", target);
    console.groupEnd();
  };

  private static buildSelectorPath(el: HTMLElement): string {
    const path: string[] = [];
    let current: HTMLElement | null = el;
    let depth = 0;
    while (current && depth < DragCartographer.MAX_PATH_DEPTH) {
      const tag = current.tagName.toLowerCase();
      const id = current.id ? `#${current.id}` : "";
      const cls =
        current.className && typeof current.className === "string"
          ? "." + current.className.split(/\s+/).slice(0, 2).join(".")
          : "";
      path.push(`${tag}${id}${cls}`);
      current = current.parentElement;
      depth += 1;
    }
    return path.join(" > ");
  }

  // Public helper to fetch map
  public static getDragMap(): DragAggregate[] {
    return Array.from(DragCartographer.aggregate.values()).sort(
      (a, b) => b.count - a.count
    );
  }
}

export function enableDragCartography(): void {
  const g = globalThis as any;
  if (g.__SN_dragCartographer) return; // already enabled
  g.__SN_dragCartographer = new DragCartographer();
  console.info("🛰️  DragCartographer enabled – logging dragstart events");
}

export function getDragMap() {
  return DragCartographer.getDragMap();
}
