// @ts-nocheck – test hooks into private members intentionally
import { JSDOM } from "jsdom";
import { PerformanceAnalyzer } from "../src-js/core/PerformanceAnalyzer";
import { SettingsManager } from "../src-js/managers/SettingsManager";
import { MusicSyncService } from "../src-js/services/MusicSyncService";
import { SidebarConsciousnessSystem } from "../src-js/systems/visual/SidebarConsciousnessSystem";
import * as Year3000Utilities from "../src-js/utils/Year3000Utilities";

// Mock DOM -----------------------------------------------------------------
const dom = new JSDOM(
  "<html><body><nav class='Root__nav-bar'><a id='nav-link' href='#'>Home</a></nav></body></html>"
);
(globalThis as any).window = dom.window as any;
(globalThis as any).document = dom.window.document;
(globalThis as any).navigator = dom.window.navigator as any;

// Stub matchMedia so reduced-motion check doesn't throw in JSDOM
dom.window.matchMedia =
  dom.window.matchMedia ||
  (function () {
    return () => ({
      matches: false,
      media: "",
      addListener: () => {},
      removeListener: () => {},
    });
  })();

// Dummy dependencies --------------------------------------------------------
class DummyMusicSync implements Partial<MusicSyncService> {
  getLatestProcessedData() {
    return { energy: 0.6, valence: 0.4 } as any;
  }
  getCurrentBeatVector() {
    return { x: 0, y: 0 };
  }
}

describe("SidebarConsciousnessSystem – temporal echo spawn", () => {
  const perf = new PerformanceAnalyzer();
  const settings = new SettingsManager();
  const music = new DummyMusicSync() as unknown as MusicSyncService;
  const config = { enableDebug: false } as any;

  const system = new SidebarConsciousnessSystem(
    config,
    Year3000Utilities as any,
    perf,
    music,
    settings,
    null
  );

  beforeAll(async () => {
    await system.initialize();
  });

  afterAll(() => {
    system.destroy();
  });

  it("spawns exactly one .sn-temporal-echo on nav item focus", () => {
    const link = document.getElementById("nav-link") as HTMLElement;
    link.dispatchEvent(new dom.window.Event("focusin", { bubbles: true }));

    const echoes = document.querySelectorAll(".sn-temporal-echo");
    expect(echoes.length).toBe(1);
  });
});
