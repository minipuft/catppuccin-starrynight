// @ts-nocheck -- Test file uses JSDOM, accesses private APIs

import { JSDOM } from "jsdom";
import { PerformanceAnalyzer } from "../src-js/core/PerformanceAnalyzer";
import { SettingsManager } from "../src-js/managers/SettingsManager";
import { MusicSyncService } from "../src-js/services/MusicSyncService";
import { SidebarConsciousnessSystem } from "../src-js/systems/visual/SidebarConsciousnessSystem";
import { echoPool } from "../src-js/utils/echoPool";
import * as Year3000Utilities from "../src-js/utils/Year3000Utilities";

describe("SidebarConsciousnessSystem – echo spawning", () => {
  const dom = new JSDOM(
    "<html><body><nav class='Root__nav-bar'><a class='main-navBar-navLink' aria-current='page' style='--sidebar-focus-hue:210'>Home</a></nav></body></html>"
  );
  (globalThis as any).document = dom.window.document;
  (globalThis as any).window = dom.window as any;
  (globalThis as any).navigator = dom.window.navigator as any;

  const perf = new PerformanceAnalyzer();
  const music = new MusicSyncService({
    YEAR3000_CONFIG: {} as any,
    Year3000Utilities,
    colorHarmonyEngine: null,
    settingsManager: null,
  });
  const settings = new SettingsManager({} as any, {}, Year3000Utilities);

  const system = new SidebarConsciousnessSystem(
    {} as any,
    Year3000Utilities as any,
    perf,
    music,
    settings,
    null
  );

  it("adds a .sn-temporal-echo behind the focused nav link", async () => {
    await system.initialize();
    system.updateFromMusicAnalysis({ visualIntensity: 0.6 });
    const echoCount = document.querySelectorAll(".sn-temporal-echo").length;
    expect(echoCount).toBeGreaterThanOrEqual(1);
    expect(echoPool.activeCount()).toBe(echoCount);
  });
});
