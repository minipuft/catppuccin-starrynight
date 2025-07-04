// ============================================================================
// 🌠 ENHANCED DRAG PREVIEW – Phase 2 Constellation Builder
// ----------------------------------------------------------------------------
// Creates a richer drag ghost with cover art + label using HTML Drag and Drop
// API. It listens at capture phase for `dragstart` and sets a custom
// `dataTransfer.setDragImage()` when possible. Falls back silently if any step
// fails, ensuring full backward-compatibility.
// ----------------------------------------------------------------------------
// Public API: `enableEnhancedDragPreview()` – idempotent.
// ----------------------------------------------------------------------------

/* eslint-disable no-console */

import { buildDragGhostCanvas } from "@/utils/graphics/CanvasGhostBuilder";

interface PreviewOptions {
  size?: number; // square size in px (default 72)
  borderRadius?: number; // px
  fontSize?: number; // px
}

const DEFAULT_OPTS: Required<PreviewOptions> = {
  size: 72,
  borderRadius: 8,
  fontSize: 12,
};

// Caching to avoid expensive DOM queries on subsequent drags of same element
const cache = new WeakMap<HTMLElement, { label: string; img?: string }>();

function createGhost(label: string, imgSrc?: string): HTMLElement {
  try {
    return buildDragGhostCanvas(label, imgSrc);
  } catch {
    // Fallback to legacy DOM ghost if canvas path fails
    const div = document.createElement("div");
    div.textContent = label;
    div.style.padding = "4px 6px";
    div.style.fontSize = "12px";
    div.style.background = "rgba(32,32,35,0.9)";
    div.style.color = "#fff";
    return div;
  }
}

function extractImageSrc(el: HTMLElement): string | undefined {
  // Strategy 1: direct <img>
  const img = el.querySelector<HTMLImageElement>("img[src]");
  if (img?.src) return img.src;
  // Strategy 2: CSS background-image url("...")
  const bg = getComputedStyle(el).backgroundImage;
  const match = bg && /url\("?([^\"]+)"?\)/.exec(bg);
  return match ? match[1] : undefined;
}

function findFallbackLabel(el: HTMLElement): string {
  // Try aria/alt/title first
  const attrLabel = el.getAttribute("aria-label") || el.getAttribute("title");
  if (attrLabel) return attrLabel;
  // Otherwise, look for first non-empty text node in descendants
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent?.trim();
      return text ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  const n = walker.nextNode();
  return (n?.textContent?.trim() || "").slice(0, 60);
}

function getPreviewData(
  target: HTMLElement
): { label: string; img?: string } | null {
  if (cache.has(target)) return cache.get(target)!;
  const label = findFallbackLabel(target);
  if (!label) return null;
  const img = extractImageSrc(target);
  const data: { label: string; img?: string } = img
    ? { label, img }
    : { label };
  cache.set(target, data);
  return data;
}

function onDragStart(event: DragEvent): void {
  try {
    if (
      !event.dataTransfer ||
      typeof event.dataTransfer.setDragImage !== "function"
    )
      return;
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Prefer dataTransfer-supplied label
    let label = event.dataTransfer.getData("text/plain");
    let imgSrc: string | undefined;

    if (!label) {
      const data = getPreviewData(target);
      if (!data) return; // can't build label, use default
      label = data.label;
      imgSrc = data.img;
    } else {
      imgSrc = extractImageSrc(target);
    }

    const ghostEl = createGhost(label, imgSrc);
    document.body.appendChild(ghostEl);
    const offset = ghostEl.offsetWidth / 2;
    event.dataTransfer.setDragImage(ghostEl, offset, offset);

    const cleanup = () => {
      ghostEl.remove();
      window.removeEventListener("dragend", cleanup, true);
    };
    window.addEventListener("dragend", cleanup, true);
  } catch (err) {
    console.debug("[StarryNight] EnhancedDragPreview failed:", err);
  }
}

export function enableEnhancedDragPreview(opts: PreviewOptions = {}): void {
  const g = globalThis as any;
  if (g.__SN_enhancedDragPreview) return; // already enabled
  g.__SN_enhancedDragPreview = true;

  Object.assign(DEFAULT_OPTS, opts);

  document.addEventListener("dragstart", onDragStart, true);
  console.info("🌠 Enhanced drag preview enabled");
}

// TODO[Phase1]: buildDragGhostCanvas util introduced for pixel-perfect previews.
//               Remove DOM fallback after verifying stability across browsers.
