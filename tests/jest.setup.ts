import { JSDOM } from "jsdom";

/*
 * Global test harness bootstrap
 * ------------------------------------------------------------
 * Provides minimal browser-like globals so that systems written
 * for the Spotify client can execute under Jest.
 */

// 1. Create JSDOM window & document
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

(global as any).window = dom.window;
(global as any).document = dom.window.document;
(global as any).navigator = dom.window.navigator;

// 2. Stub requestAnimationFrame / cancelAnimationFrame with timers
(global as any).requestAnimationFrame = (cb: FrameRequestCallback): number => {
  return setTimeout(cb, 0) as unknown as number;
};
(global as any).cancelAnimationFrame = (id: number) => clearTimeout(id);

// 3. matchMedia stub (needed for reduced-motion queries)
(global as any).matchMedia =
  dom.window.matchMedia ??
  (() => ({
    matches: false,
    media: "",
    addListener: () => {},
    removeListener: () => {},
  }));

// 4. CSSStyleDeclaration polyfill with no-op setProperty
if (!(global as any).CSSStyleDeclaration) {
  (global as any).CSSStyleDeclaration = function () {};
}
if (!(global as any).CSSStyleDeclaration.prototype?.setProperty) {
  (global as any).CSSStyleDeclaration.prototype.setProperty = function () {};
}

// 5. localStorage fallback (SettingsManager & StorageManager rely on it)
(global as any).localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// 6. Performance shim
(global as any).performance = global.performance || { now: () => Date.now() };

// 7. Minimal Spicetify stub – just enough for unit tests
(global as any).Spicetify = {
  LocalStorage: {
    get: () => null,
    set: () => {},
  },
  Player: {
    data: {
      item: {},
    },
  },
  colorExtractor: jest.fn().mockResolvedValue({}),
  CosmosAsync: { get: jest.fn().mockResolvedValue({}) },
};

// 8. indexedDB placeholder (TemporalMemoryService)
(global as any).indexedDB = (global as any).indexedDB || {};

// 9. Mock idb's openDB to avoid real IndexedDB usage in Node
jest.mock("idb", () => ({
  __esModule: true,
  openDB: jest.fn().mockResolvedValue({}),
  deleteDB: jest.fn(),
}));

// 10. Silence noisy console logs in test output (optional)
const originalConsoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  if (/(StorageManager|CSSVariableBatcher)/.test(args[0])) return;
  originalConsoleError(...args);
};
