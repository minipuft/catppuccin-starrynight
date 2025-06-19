/*
 * getScrollNode.ts
 * ----------------------------------------------------------------------------
 * Returns Spotify’s main view scroll node regardless of minor classname churn
 * across client versions.  Centralising this selector avoids scattering fragile
 * queries in multiple modules.
 */

const SCROLL_NODE_SELECTORS = [
  ".main-view-container__scroll-node", // 2023-era builds
  ".main-viewContainer-scrollNode", // 2024 dash variant
  ".main-viewContainer__scrollNode", // 2024 double-underscore variant
].join(", ");

export function getScrollNode(): HTMLElement | null {
  return document.querySelector<HTMLElement>(SCROLL_NODE_SELECTORS);
}
