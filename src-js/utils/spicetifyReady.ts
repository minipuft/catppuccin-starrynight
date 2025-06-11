export async function waitForSpicetifyReady(
  timeout: number = 10000,
  checkInterval: number = 100
): Promise<boolean> {
  const start = Date.now();

  // The canonical readiness cue used in official Spicetify docs is `Spicetify.showNotification`.
  // We additionally verify that `Spicetify.Platform` is available because many theme systems
  // rely on that registry for APIs (UserAPI, PlayerAPI, etc.).
  while (Date.now() - start < timeout) {
    const spicetify = (window as any).Spicetify;
    if (spicetify?.showNotification && spicetify?.Platform) {
      return true;
    }
    await new Promise((res) => setTimeout(res, checkInterval));
  }
  return false; // Timed-out – caller should fall back to degraded mode.
}
