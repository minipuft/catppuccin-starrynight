// ============================================================================
// 🌀 SIDEBAR CLONE OVERLAY – Phase 2 (Sidebar-Morph Quick-Add)
// ----------------------------------------------------------------------------
// This file scaffolds the logic for cloning Spotify's sidebar (rootlist) and
// morph-animating it into a compact quick-add hub at the cursor location.
// Only skeleton code + TODO comments are provided for incremental fill-in.
// ----------------------------------------------------------------------------
import { spring } from "@/utils/flipSpring";
import { querySidebar } from "@/utils/sidebarDetector";

// -----------------------------
// Types
// -----------------------------
interface DragContext {
  cursorX: number;
  cursorY: number;
  uris: string[];
}

// Keep reference so we can destroy overlay when finished or on hot-reload.
let activeClone: HTMLElement | null = null;
const cleanupFns: Array<() => void> = [];

// NEW: AbortController to allow cancelling the spring animation on rapid drags
let animationAbortController: AbortController | null = null;

// Reuse MRU storage key from QuickAddRadialMenu
const MRU_KEY = "sn-recent-playlists";

export function launchSidebarClone(context: DragContext): void {
  // Abort any in-flight animation controller so a fresh drag can start cleanly.
  if (animationAbortController) {
    animationAbortController.abort();
    animationAbortController = null;
  }

  // If a clone overlay is still active from a previous drag, remove it so we
  // can start fresh.  This prevents the early guard from exiting prematurely
  // on rapid consecutive drags.
  if (activeClone) {
    destroySidebarClone();
  }

  animationAbortController = new AbortController();
  const { signal } = animationAbortController;

  // Guard: if overlay already present, ignore.
  if (activeClone) return;

  const sidebar = querySidebar();
  if (!sidebar) return; // fallback handled by caller.

  // 1. Deep-clone node -------------------------------------------------------
  const clone = sidebar.node.cloneNode(true) as HTMLElement;
  clone.id = ""; // remove duplicated IDs
  clone.setAttribute("aria-hidden", "true");
  clone.classList.add("sn-clone-overlay");
  clone.style.position = "fixed";
  clone.style.top = `${sidebar.rect.top}px`;
  clone.style.left = `${sidebar.rect.left}px`;
  clone.style.width = `${sidebar.rect.width}px`;
  clone.style.height = `${sidebar.rect.height}px`;
  clone.style.zIndex = "9999";
  clone.style.willChange = "transform, opacity";
  clone.style.contain = "paint";

  // Strip potentially conflicting attributes that could interfere with
  // accessibility or duplicate event semantics when the node is detached
  // from its original context.
  (function stripCloneArtefacts(root: HTMLElement) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    while (walker.nextNode()) {
      const el = walker.currentNode as HTMLElement;
      // Remove redundant aria-labels that may clash with the source list.
      if (el.hasAttribute("aria-label")) el.removeAttribute("aria-label");
      // Reset tabindex so cloned items don\'t pollute the tab order before we
      // intentionally re-enable focus for curated playlist targets later.
      if (el.tabIndex >= 0) el.tabIndex = -1;
    }
  })(clone);

  document.body.appendChild(clone);
  activeClone = clone;

  // 2. Prepare FLIP spring ---------------------------------------------------
  const firstX = 0;
  const firstY = 0;
  const firstS = 1;

  const lastX = context.cursorX - sidebar.rect.left - sidebar.rect.width * 0.2;
  const lastY = context.cursorY - sidebar.rect.top - sidebar.rect.height * 0.2;
  const lastS = 0.6;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) {
    // Skip spring animation, jump to final state and prune instantly
    clone.style.transform = `translate(${lastX}px, ${lastY}px) scale(${lastS})`;
    pruneCloneItems(clone, context);
    return;
  }

  const anim = spring({
    stiffness: 220,
    damping: 20,
    onUpdate: (v) => {
      // Abort early if the drag was superseded by another action.
      if (signal.aborted) return;
      clone.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
    },
  });
  clone.style.transformOrigin = "top left";
  clone.style.transform = `translate(${firstX}px, ${firstY}px) scale(${firstS})`;

  // play next frame
  requestAnimationFrame(() => anim.to({ x: lastX, y: lastY, s: lastS }));

  // After approx 400 ms (spring settle) prune and wire interactions
  const pruneTimeout = setTimeout(() => {
    if (!signal.aborted && activeClone) pruneCloneItems(activeClone, context);
  }, 400);
  // Ensure timeout cleared on abort to prevent unnecessary work.
  signal.addEventListener("abort", () => clearTimeout(pruneTimeout));
  // Destroy clone when aborted so the UI cleans up instantly.
  signal.addEventListener("abort", () => destroySidebarClone());
}

export function destroySidebarClone(): void {
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;
  if (activeClone) {
    activeClone.remove();
    activeClone = null;
  }
  if (animationAbortController) {
    animationAbortController.abort();
    animationAbortController = null;
  }
}

/**
 * Helper: Add tracks to playlist using same Cosmos call as radial menu.
 */
function addTracksToPlaylist(uri: string, trackUris: string[]): void {
  try {
    const Cosmos = (window as any).Spicetify?.CosmosAsync;
    if (!Cosmos) return;
    const endpoint = `/v1/playlists/${uri.split(":").pop()}/tracks`;
    Cosmos.post(endpoint, { uris: trackUris });
  } catch {
    /* ignore */
  }
}

function pruneCloneItems(root: HTMLElement, context: DragContext): void {
  const all = Array.from(
    root.querySelectorAll<HTMLElement>('[data-uri^="spotify:playlist:"]')
  );
  if (!all.length) return;

  const keep = all.slice(0, 5);
  all.slice(5).forEach((el) => {
    el.classList.add("sn-prune-out");
    // Remove from DOM after fade-out to free memory
    setTimeout(() => el.remove(), 180);
  });

  keep.forEach((el, idx) => {
    el.setAttribute("data-index", String(idx + 1));
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    // Ensure hover glow uses existing Houdini paint
    el.style.setProperty("--sn-glow-level", "0");
    el.style.backgroundImage = "paint(sn-aura)";
    el.addEventListener("mouseenter", () =>
      el.style.setProperty("--sn-glow-level", "1")
    );
    el.addEventListener("mouseleave", () =>
      el.style.setProperty("--sn-glow-level", "0")
    );

    const uriVal = el.getAttribute("data-uri");
    if (!uriVal) {
      return;
    }
    const trackUris = context.uris;
    const clickHandler = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      const img = el.querySelector("img") as HTMLImageElement | null;
      pushRecentPlaylist(
        uriVal,
        img?.src || "",
        el.textContent?.trim() || "Playlist"
      );
      addTracksToPlaylist(uriVal as string, trackUris);
      announce("Track added to " + (el.textContent?.trim() || "playlist"));
      destroySidebarClone();
    };
    el.addEventListener("click", clickHandler);
    el.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        clickHandler(e);
      }
    });
  });

  // Number-key mapping while clone active
  const keyListener = (e: KeyboardEvent) => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= keep.length) {
      keep[n - 1]?.click();
    }
  };
  window.addEventListener("keydown", keyListener, { capture: true });
  cleanupFns.push(() =>
    window.removeEventListener("keydown", keyListener, { capture: true } as any)
  );
}

function pushRecentPlaylist(uri: string, image: string, name: string) {
  try {
    const raw = localStorage.getItem(MRU_KEY);
    const list = raw ? (JSON.parse(raw) as any[]) : [];
    const existing = list.findIndex((p) => p.uri === uri);
    if (existing !== -1) list.splice(existing, 1);
    list.unshift({ uri, image, name });
    localStorage.setItem(MRU_KEY, JSON.stringify(list.slice(0, 10)));
  } catch {
    /* ignore */
  }
}

// share live region with QuickAddRadialMenu if present
function announce(message: string) {
  const live = document.getElementById("sn-live");
  if (live) live.textContent = message;
}
