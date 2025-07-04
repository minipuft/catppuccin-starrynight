import { MODERN_SELECTORS } from "@/debug/SpotifyDOMSelectors";

/**
 * Starts a MutationObserver on the now-playing bar.  Whenever the bar's DOM
 * changes we invoke `onChange` (typically used to queue a `--sn-force-refresh`
 * variable update).
 *
 * Returns a disposer function you must call during tear-down to avoid memory
 * leaks.
 */
export function startNowPlayingWatcher(
  onChange: () => void,
  enableDebug = false
): () => void {
  const bar = document.querySelector(
    MODERN_SELECTORS["nowPlayingBar"] as string
  );
  if (!bar) {
    if (enableDebug) {
      console.warn(
        "🎵 [NowPlayingDomWatcher] nowPlayingBar element not found – watcher inactive"
      );
    }
    return () => {};
  }

  const mObserver = new MutationObserver(() => {
    onChange();
    if (enableDebug)
      console.log(
        "🎵 [NowPlayingDomWatcher] DOM mutation detected → onChange dispatched"
      );
  });

  mObserver.observe(bar, { childList: true, subtree: true });
  if (enableDebug) console.log("🎵 [NowPlayingDomWatcher] watcher active");

  // Dispose function
  return () => {
    mObserver.disconnect();
    if (enableDebug) console.log("🎵 [NowPlayingDomWatcher] watcher disposed");
  };
}
