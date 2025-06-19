// ============================================================================
// 🛰️  SIDEBAR DETECTOR – Phase 1 (Sidebar-Morph Quick-Add)
// ----------------------------------------------------------------------------
// Centralises DOM selectors for Spotify's sidebar (rootlist) and exposes two
// helpers:
//   • querySidebar(): { node, rect } | null
//   • isSidebarCloneCapable(): boolean
// Keeping selectors in one place makes future A/B DOM changes easier to patch.
// ----------------------------------------------------------------------------

// TODO(Phase1): Verify selector in Canary desktop builds once a week.
const SIDEBAR_SELECTOR = '[data-testid="rootlist-container"]';

export interface SidebarInfo {
  node: HTMLElement;
  rect: DOMRect;
}

export function querySidebar(): SidebarInfo | null {
  const node = document.querySelector<HTMLElement>(SIDEBAR_SELECTOR);
  if (!node) return null;
  const rect = node.getBoundingClientRect();
  return { node, rect };
}

export function isSidebarCloneCapable(): boolean {
  // Basic capability checks – expand as needed (ShadowDOM, OffscreenCanvas, etc.)
  const hasSidebar = !!querySidebar();
  const canClone = typeof Element.prototype.cloneNode === "function";
  const springReady = !!(window as any).snFlipSpringLoaded; // set when flipSpring imported
  return hasSidebar && canClone && springReady;
}
