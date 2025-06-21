// @ts-nocheck -- Test file intentionally accesses private APIs
import { JSDOM } from "jsdom";
import { PerformanceAnalyzer } from "../src-js/core/PerformanceAnalyzer";
import { SettingsManager } from "../src-js/managers/SettingsManager";
import { MusicSyncService } from "../src-js/services/MusicSyncService";
import { DataGlyphSystem } from "../src-js/systems/visual/DataGlyphSystem";
import * as Year3000Utilities from "../src-js/utils/Year3000Utilities";

// Jest environment setup
const dom = new JSDOM("<html><body></body></html>");
(globalThis as any).document = dom.window.document;
(globalThis as any).window = dom.window as any;
(globalThis as any).navigator = dom.window.navigator as any;

// Dummy dependencies ---------------------------------------------------------
class DummyMusicSync implements Partial<MusicSyncService> {
  getLatestProcessedData() {
    return { energy: 0.5, valence: 0.5 } as any;
  }
  getCurrentBeatVector() {
    return { x: 0, y: 0 };
  }
}

describe("DataGlyphSystem – Quantum-Splash clustering", () => {
  jest.useFakeTimers();

  const perf = new PerformanceAnalyzer();
  const music = new DummyMusicSync() as unknown as MusicSyncService;
  const settings = new SettingsManager();
  const config = { enableDebug: false } as any;
  const system = new DataGlyphSystem(
    config,
    Year3000Utilities as any,
    perf,
    music,
    settings,
    null
  );

  it("merges ≥3 rapid echoes into one mega ripple", () => {
    const host = document.createElement("div");
    // Trigger three echoes within < 300 ms
    (system as any).addTemporalEcho(host as HTMLElement);
    jest.advanceTimersByTime(50);
    (system as any).addTemporalEcho(host as HTMLElement);
    jest.advanceTimersByTime(50);
    (system as any).addTemporalEcho(host as HTMLElement);

    const echoes = host.querySelectorAll(".sn-temporal-echo");

    expect(echoes.length).toBe(1);
    // Expect kinetic intensity lower for mega ripple
    expect(
      (echoes[0] as HTMLElement).style.getPropertyValue(
        "--sn-kinetic-intensity"
      )
    ).toBe("0.4");
  });
});

// Mock Year3000 utilities and system dependencies
jest.mock("@/utils/Year3000Utilities", () => ({
  __esModule: true,
  // minimal stub – return object with getHealthMonitor undefined so DGS skips
  default: {},
  getHealthMonitor: () => null,
}));

describe("DataGlyphSystem echo pool management", () => {
  jest.useFakeTimers();

  const createHostElement = () => {
    const el = document.createElement("div");
    el.className = "main-trackList-trackListRow"; // matches MODERN_SELECTORS.trackRow
    document.body.appendChild(el);
    return el;
  };

  const makeSystem = async () => {
    const perf = new PerformanceAnalyzer({ enableDebug: false });
    const dummyYear3000: any = {
      queueCSSVariableUpdate: jest.fn(),
      registerAnimationSystem: jest.fn(),
    };

    const dgs = new DataGlyphSystem(
      {} as any,
      require("@/utils/Year3000Utilities"),
      perf,
      null,
      null,
      dummyYear3000
    );
    await dgs.initialize();
    return dgs as any; // cast for private inspection
  };

  it("should keep echo counts within dynamic limits after burst hovers", async () => {
    const dgs: any = await makeSystem();
    const host = createHostElement();

    // Fire 500 hover events
    for (let i = 0; i < 500; i++) {
      host.dispatchEvent(new Event("mouseenter"));
      jest.advanceTimersByTime(130); // > dwell delay
      host.dispatchEvent(new Event("mouseleave"));
    }

    // flush pending timers including echo removal timers (1.3s each)
    jest.runOnlyPendingTimers();

    // Expectations
    expect(dgs.currentEchoCount).toBeLessThanOrEqual(dgs.dynamicMaxEchoes);
    expect(dgs.echoPool.length).toBeLessThanOrEqual(dgs.dynamicMaxEchoes * 2);
  });
});
