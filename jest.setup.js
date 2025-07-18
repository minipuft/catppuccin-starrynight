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