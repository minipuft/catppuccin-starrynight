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
