// @ts-nocheck – test hooks into private members intentionally

// Mock Spicetify global first
const mockSpicetify = {
  Player: { data: { item: { uri: "spotify:track:test" } } },
  LocalStorage: {
    get: jest.fn().mockReturnValue("default"),
    set: jest.fn(),
  },
  colorExtractor: jest.fn().mockResolvedValue({}),
  CosmosAsync: {
    get: jest.fn().mockResolvedValue({ audio_features: [{ tempo: 120 }] }),
  },
  showNotification: jest.fn(),
};

// @ts-ignore
global.Spicetify = mockSpicetify;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Canvas getContext
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

import { UnifiedPerformanceCoordinator } from "@/core/performance/UnifiedPerformanceCoordinator";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { SidebarConsciousnessSystem } from "@/visual/ui/SidebarVisualEffectsSystem";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";

// Dummy dependencies --------------------------------------------------------
class DummyMusicSync implements Partial<MusicSyncService> {
  getLatestProcessedData() {
    return { energy: 0.6, valence: 0.4 } as any;
  }
  getCurrentBeatVector() {
    return { x: 0, y: 0 };
  }
  subscribe() {
    // Mock subscribe method
  }
  unsubscribe() {
    // Mock unsubscribe method
  }
}

describe("SidebarVisualEffectsSystem – temporal echo spawn", () => {
  // Set up DOM for this test
  beforeAll(() => {
    document.body.innerHTML = `
      <nav class='Root__nav-bar'>
        <a id='nav-link' href='#'>Home</a>
      </nav>
    `;

    // Provide canonical accent variable for visual systems under test
    document.documentElement.style.setProperty(
      "--sn-accent-rgb",
      "203,166,247"
    );
  });

  const config = { enableDebug: false } as any;
  const perf = new UnifiedPerformanceCoordinator(config);
  const settings = new SettingsManager();
  const music = new DummyMusicSync() as unknown as MusicSyncService;

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
    link.dispatchEvent(new Event("focusin", { bubbles: true }));

    const echoes = document.querySelectorAll(".sn-temporal-echo");
    expect(echoes.length).toBe(1);
  });
});
