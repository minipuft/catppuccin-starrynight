// ============================================================================
// 🌌 QUICK-ADD RADIAL MENU – Phase 4 Quasar Quick-Add
// ----------------------------------------------------------------------------
// Displays a radial overlay of recently used playlists after the user starts a
// drag gesture and holds the pointer relatively still for a small delay. This
// allows rapid drag-drop placement without needing to travel to the sidebar.
//
// The implementation uses **vanilla DOM** + minimal Spicetify APIs to avoid
// heavy dependencies. It is fully gated so that if any requirement is missing
// (e.g., Spicetify not ready) it silently aborts, preserving default behaviour.
// ----------------------------------------------------------------------------
/* eslint-disable no-console */

import { spring } from "@/utils/flipSpring";
import { isSidebarCloneCapable as sidebarCloneCapable } from "@/utils/sidebarDetector";
// TODO(Phase1): branch to clone flow when capability true. Currently logs only.

interface PlaylistInfo {
  uri: string;
  image: string;
  name: string;
}

const HOLD_MS = 250;
const MOVE_THRESHOLD = 8; // px
const MAX_PLAYLISTS_SHOWN = 5;
let holdTimer: number | null = null;
let startX = 0;
let startY = 0;
let overlayEl: HTMLDivElement | null = null;
let currentDragDataUris: string[] | null = null;
let currentPointer = { x: 0, y: 0 };

// Phase4: accessibility live region helper
const LIVE_ID = "sn-live";
function ensureLiveRegion() {
  let live = document.getElementById(LIVE_ID);
  if (!live) {
    live = document.createElement("div");
    live.id = LIVE_ID;
    live.setAttribute("aria-live", "polite");
    live.style.position = "absolute";
    live.style.width = "1px";
    live.style.height = "1px";
    live.style.overflow = "hidden";
    live.style.clipPath = "inset(100%)";
    live.style.clip = "rect(1px,1px,1px,1px)";
    live.style.whiteSpace = "nowrap";
    document.body.appendChild(live);
  }
  return live;
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function fetchRecentPlaylists(): PlaylistInfo[] {
  try {
    const raw = localStorage.getItem("sn-recent-playlists");
    if (!raw) return [];
    const arr = JSON.parse(raw) as PlaylistInfo[];
    return Array.isArray(arr) ? arr.slice(0, MAX_PLAYLISTS_SHOWN) : [];
  } catch {
    return [];
  }
}

function addTracksToPlaylist(playlistUri: string, trackUris: string[]): void {
  try {
    // 🌟 TODO Phase 4b: Replace with official Spicetify.Playlist API once confirmed
    const endpoint = `/v1/playlists/${playlistUri.split(":").pop()}/tracks`;
    // Using Cosmos fetch wrapper if available
    (window as any).Spicetify?.CosmosAsync.post(endpoint, {
      uris: trackUris,
    });
  } catch (e) {
    console.warn("[StarryNight] QuickAddRadial failed to add tracks:", e);
  }
}

function pushRecentPlaylist(pl: PlaylistInfo): void {
  try {
    const list = fetchRecentPlaylists();
    const existingIdx = list.findIndex((p) => p.uri === pl.uri);
    if (existingIdx !== -1) list.splice(existingIdx, 1); // move to front
    list.unshift(pl);
    const trimmed = list.slice(0, 10);
    localStorage.setItem("sn-recent-playlists", JSON.stringify(trimmed));
  } catch {
    /* ignore */
  }
}

function createOverlay(x: number, y: number, playlists: PlaylistInfo[]): void {
  if (!playlists.length) return;
  destroyOverlay();

  overlayEl = document.createElement("div");
  overlayEl.className = "sn-quick-add-overlay";
  overlayEl.style.position = "fixed";
  overlayEl.style.inset = "0";
  overlayEl.style.pointerEvents = "none";
  overlayEl.style.zIndex = "9999"; // above everything

  const center = document.createElement("div");
  center.className = "sn-quick-add-center";
  center.style.position = "absolute";
  center.style.left = `${x}px`;
  center.style.top = `${y}px`;
  center.style.width = "0";
  center.style.height = "0";

  overlayEl.appendChild(center);
  document.body.appendChild(overlayEl);

  const radius = 90;
  const angleStep = (Math.PI * 2) / playlists.length;
  playlists.forEach((pl, idx) => {
    const angle = angleStep * idx - Math.PI / 2; // start top
    const btn = document.createElement("button");
    btn.className = "sn-quick-add-btn";
    btn.style.position = "absolute";
    btn.style.width = "64px";
    btn.style.height = "64px";
    btn.style.borderRadius = "50%";
    btn.style.border = "2px solid rgba(255,255,255,0.4)";
    btn.style.background = `url('${pl.image}') center/cover no-repeat`;
    btn.style.cursor = "pointer";
    btn.style.pointerEvents = "auto"; // re-enable for button itself

    const cx = radius * Math.cos(angle);
    const cy = radius * Math.sin(angle);
    btn.style.transform = `translate(${cx - 32}px, ${cy - 32}px)`; // center button

    // === FLIP SPRING ANIMATION (Phase2) ===
    // First: element at cursor center scale 0
    btn.style.transformOrigin = "center center";
    const firstX = 0;
    const firstY = 0;
    btn.style.transform = `translate(${firstX}px, ${firstY}px) scale(0.1)`;

    // Play on next frame to not block layout
    requestAnimationFrame(() => {
      const animator = spring({
        stiffness: 220,
        damping: 20,
        onUpdate: (v) => {
          btn.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
        },
      });
      animator.to({ x: cx - 32, y: cy - 32, s: 1 });
    });

    btn.title = `Add to ${pl.name}`;
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (currentDragDataUris) addTracksToPlaylist(pl.uri, currentDragDataUris);
      pushRecentPlaylist(pl);
      destroyOverlay();
    });

    center.appendChild(btn);
  });

  const live = ensureLiveRegion();
  live.textContent =
    "Quick-add menu open. Press number keys 1 to 5 to pick a playlist or continue dragging.";
}

function destroyOverlay(): void {
  overlayEl?.remove();
  overlayEl = null;

  const live = document.getElementById(LIVE_ID);
  if (live) live.textContent = "";
}

function clearHoldTimer(): void {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
}

function onDragStart(e: DragEvent): void {
  startX = e.clientX;
  startY = e.clientY;
  currentDragDataUris = (e.dataTransfer?.getData("text/spotify") || "")
    .split(/[\n,]/)
    .filter(Boolean);

  const cloneCapable = sidebarCloneCapable();

  clearHoldTimer();
  holdTimer = window.setTimeout(async () => {
    if (cloneCapable) {
      const overlay = await import("./SidebarCloneOverlay");
      overlay.launchSidebarClone({
        cursorX: currentPointer.x,
        cursorY: currentPointer.y,
        uris: currentDragDataUris ?? [],
      });
    } else {
      const playlists = await getRadialPlaylists();
      createOverlay(startX, startY, playlists);
    }
  }, HOLD_MS);
}

function onDragEnd(): void {
  clearHoldTimer();
  destroyOverlay();
  currentDragDataUris = null;
}

function onPointerMove(e: PointerEvent): void {
  currentPointer = { x: e.clientX, y: e.clientY };
  if (!holdTimer) return;
  if (distance(startX, startY, e.clientX, e.clientY) > MOVE_THRESHOLD) {
    clearHoldTimer();
  }
}

// Map number keys 1-5 to buttons when overlay visible
document.addEventListener("keydown", (e) => {
  if (!overlayEl) return;
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= MAX_PLAYLISTS_SHOWN) {
    const btn =
      overlayEl.querySelectorAll<HTMLButtonElement>(".sn-quick-add-btn")[
        num - 1
      ];
    btn?.click();
  }
});

async function fetchPlaylistsFromAPI(): Promise<PlaylistInfo[]> {
  try {
    const Cosmos = (window as any).Spicetify?.CosmosAsync;
    if (!Cosmos) return [];
    const resp = await Cosmos.get(
      "https://api.spotify.com/v1/me/playlists?limit=10"
    );
    if (!resp?.items) return [];
    return resp.items.slice(0, MAX_PLAYLISTS_SHOWN).map((pl: any) => ({
      uri: pl.uri,
      name: pl.name,
      image: pl.images?.[0]?.url || "",
    }));
  } catch {
    return [];
  }
}

function scrapeSidebarPlaylists(): PlaylistInfo[] {
  try {
    const items = Array.from(
      document.querySelectorAll('[data-testid="rootlist-card"]')
    ) as HTMLElement[];
    const res: PlaylistInfo[] = [];
    for (const el of items) {
      const uri =
        el.getAttribute("data-uri") ||
        el
          .querySelector("a")
          ?.getAttribute("href")
          ?.replace("/playlist/", "spotify:playlist:");
      if (!uri) continue;
      const img = el.querySelector("img") as HTMLImageElement | null;
      const image = img?.src || "";
      const name = img?.alt || el.textContent?.trim() || "Playlist";
      res.push({ uri, image, name });
      if (res.length >= MAX_PLAYLISTS_SHOWN) break;
    }
    return res;
  } catch {
    return [];
  }
}

async function getRadialPlaylists(): Promise<PlaylistInfo[]> {
  const local = fetchRecentPlaylists();
  if (local.length) return local;
  const sidebar = scrapeSidebarPlaylists();
  if (sidebar.length) return sidebar;
  const api = await fetchPlaylistsFromAPI();
  return api;
}

export function enableQuickAddRadialMenu(): void {
  const g = globalThis as any;
  if (g.__SN_quickAddRadial) return;
  g.__SN_quickAddRadial = true;

  window.addEventListener("dragstart", onDragStart, true);
  window.addEventListener("dragend", onDragEnd, true);
  window.addEventListener("pointermove", onPointerMove, true);

  console.info("🌌 Quick-Add radial menu enabled");
  console.info(
    `[StarryNight] Sidebar clone capability: ${sidebarCloneCapable()}`
  );
  // TODO(Phase1): If true, future implementation will use clone flow
}
