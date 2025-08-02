// Jest setup file for mocking browser APIs

// Mock IndexedDB
const FDBFactory = require('fake-indexeddb/lib/FDBFactory');
const FDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
const FDBRequest = require('fake-indexeddb/lib/FDBRequest');
const FDBTransaction = require('fake-indexeddb/lib/FDBTransaction');
const FDBDatabase = require('fake-indexeddb/lib/FDBDatabase');
const FDBObjectStore = require('fake-indexeddb/lib/FDBObjectStore');
const FDBIndex = require('fake-indexeddb/lib/FDBIndex');
const FDBCursor = require('fake-indexeddb/lib/FDBCursor');

global.indexedDB = new FDBFactory();
global.IDBKeyRange = FDBKeyRange;
global.IDBRequest = FDBRequest;
global.IDBTransaction = FDBTransaction;
global.IDBDatabase = FDBDatabase;
global.IDBObjectStore = FDBObjectStore;
global.IDBIndex = FDBIndex;
global.IDBCursor = FDBCursor;

// Mock other browser APIs that might be needed
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => [])
};

// Mock Web APIs
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
};
global.localStorage = localStorageMock;

// Mock MediaQueryList
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Mock Spicetify global object for Spicetify theme testing
global.Spicetify = {
  Player: {
    data: {},
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    seek: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    next: jest.fn(),
    back: jest.fn()
  },
  Platform: {
    getUserAPI: jest.fn(() => ({
      getUser: jest.fn(() => Promise.resolve({ username: 'test-user' }))
    })),
    getAdManagers: jest.fn(() => ({})),
    getPlayerAPI: jest.fn(() => ({
      getState: jest.fn(() => Promise.resolve({ item: null }))
    }))
  },
  LocalStorage: {
    get: jest.fn((key) => {
      // Return default values for common settings
      const defaults = {
        'sn-enable-beat-sync': 'true',
        'sn-enable-cinematic-drama': 'true',
        'sn-enable-ethereal-beauty': 'true',
        'sn-enable-natural-harmony': 'true',
        'sn-performance-mode': 'balanced',
        'sn-visual-intensity': '0.7'
      };
      return defaults[key] || null;
    }),
    set: jest.fn(),
    remove: jest.fn()
  },
  CosmosAsync: {
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    del: jest.fn(() => Promise.resolve({}))
  },
  colorExtractor: jest.fn(() => Promise.resolve({
    VIBRANT: '#ff6b6b',
    DARK_VIBRANT: '#c44569',
    LIGHT_VIBRANT: '#ff9ff3',
    MUTED: '#54a0ff',
    DARK_MUTED: '#2f3542',
    LIGHT_MUTED: '#a4b0be'
  })),
  getAudioData: jest.fn(() => Promise.resolve({
    audio_features: {
      energy: 0.7,
      valence: 0.8,
      tempo: 120,
      danceability: 0.6
    }
  })),
  URI: {
    from: jest.fn(),
    fromString: jest.fn()
  },
  ReactDOM: {
    render: jest.fn(),
    unmountComponentAtNode: jest.fn()
  },
  React: {
    createElement: jest.fn(),
    Fragment: jest.fn()
  }
};

// Prevent tests from redefining global properties that already exist in JSDOM
// Add helper functions for safe global property mocking
global.safeDefineProperty = function(obj, prop, descriptor) {
  if (!(prop in obj)) {
    Object.defineProperty(obj, prop, descriptor);
  } else {
    // Property already exists, just update the value
    if (descriptor.value && typeof descriptor.value === 'object') {
      Object.assign(obj[prop], descriptor.value);
    } else if (descriptor.value) {
      obj[prop] = descriptor.value;
    }
  }
};