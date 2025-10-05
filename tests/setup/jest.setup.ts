import { TextEncoder, TextDecoder } from "util";

/*
 * Global test harness bootstrap
 * ------------------------------------------------------------
 * Provides minimal browser-like globals so that systems written
 * for the Spotify client can execute under Jest.
 */

// Polyfill TextEncoder and TextDecoder BEFORE importing JSDOM
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import { JSDOM } from "jsdom";

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

// 4. Enhanced CSSStyleDeclaration with CSS variable support
const mockCSSProperties = new Map<string, string>();

if (!(global as any).CSSStyleDeclaration) {
  (global as any).CSSStyleDeclaration = function () {};
}

// Enhanced CSS variable support for tests
(global as any).CSSStyleDeclaration.prototype.setProperty = function(
  property: string, 
  value: string
) {
  mockCSSProperties.set(property, value);
};

(global as any).CSSStyleDeclaration.prototype.getPropertyValue = function(
  property: string
): string {
  return mockCSSProperties.get(property) || '';
};

// Enhanced document.documentElement.style support
if (dom.window.document.documentElement && dom.window.document.documentElement.style) {
  const originalSetProperty = dom.window.document.documentElement.style.setProperty;
  dom.window.document.documentElement.style.setProperty = function(
    property: string, 
    value: string,
    priority?: string
  ) {
    // Store in both our mock map and the original JSDOM style
    mockCSSProperties.set(property, value);
    if (originalSetProperty) {
      originalSetProperty.call(this, property, value, priority);
    }
  };

  const originalGetPropertyValue = dom.window.document.documentElement.style.getPropertyValue;
  dom.window.document.documentElement.style.getPropertyValue = function(
    property: string
  ): string {
    // Try mock first, then original JSDOM style
    const mockValue = mockCSSProperties.get(property);
    if (mockValue) {
      return mockValue;
    }
    return originalGetPropertyValue ? originalGetPropertyValue.call(this, property) : '';
  };

  // Also ensure cssText clearing works properly 
  const originalCssTextSetter = Object.getOwnPropertyDescriptor(
    dom.window.document.documentElement.style,
    'cssText'
  )?.set;
  
  if (originalCssTextSetter) {
    Object.defineProperty(dom.window.document.documentElement.style, 'cssText', {
      set: function(value: string) {
        if (value === '') {
          // Clear our mock properties when cssText is cleared
          mockCSSProperties.clear();
        }
        originalCssTextSetter.call(this, value);
      },
      get: function() {
        return originalCssTextSetter ? (this as any)._cssText || '' : '';
      },
      configurable: true
    });
  }
}

// 5. localStorage fallback (SettingsManager & StorageManager rely on it)
(global as any).localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// 6. Performance shim
(global as any).performance = global.performance || { now: () => Date.now() };

// 7. Comprehensive Spicetify mock for theme integration
(global as any).Spicetify = {
  LocalStorage: {
    get: jest.fn(() => null),
    set: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
  },
  
  Player: {
    data: {
      item: {
        metadata: {
          title: 'Test Track',
          artist_name: 'Test Artist',
          album_name: 'Test Album',
        },
        uri: 'spotify:track:test123'
      },
      track: {
        metadata: {
          title: 'Test Track',
          artist_name: 'Test Artist', 
          album_name: 'Test Album',
        }
      },
      is_paused: false,
      duration: 200000,
      position: 100000,
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    next: jest.fn(),
    previous: jest.fn(),
    togglePlay: jest.fn(),
    seekTo: jest.fn(),
  },
  
  Platform: {
    History: {
      listen: jest.fn(() => jest.fn()), // Returns cleanup function
      push: jest.fn(),
      replace: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      location: {
        pathname: '/test',
        search: '',
        hash: '',
      },
    },
    ClipboardAPI: {
      copy: jest.fn().mockResolvedValue(undefined),
    },
  },
  
  // Color extraction API with realistic responses
  colorExtractor: jest.fn().mockResolvedValue({
    LIGHT_VIBRANT: { hex: '#ff6b6b', rgb: [255, 107, 107] },
    VIBRANT: { hex: '#4ecdc4', rgb: [78, 205, 196] },
    DARK_VIBRANT: { hex: '#45b7d1', rgb: [69, 183, 209] },
    LIGHT_MUTED: { hex: '#a8e6cf', rgb: [168, 230, 207] },
    MUTED: { hex: '#88d8c0', rgb: [136, 216, 192] },
    DARK_MUTED: { hex: '#2c3e50', rgb: [44, 62, 80] },
    DOMINANT: { hex: '#336699', rgb: [51, 102, 153] }
  }),
  
  // Audio data API for music sync systems
  getAudioData: jest.fn().mockReturnValue({
    energy: 0.7,
    valence: 0.6,
    tempo: 128,
    loudness: -5.5,
    danceability: 0.8,
    acousticness: 0.2,
    instrumentalness: 0.1,
    liveness: 0.3,
    speechiness: 0.05,
    key: 5,
    mode: 1,
    time_signature: 4,
    // Raw audio analysis data
    bars: [],
    beats: [],
    sections: [],
    segments: [],
    tatums: []
  }),
  
  // Cosmos API for data fetching
  CosmosAsync: { 
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
    put: jest.fn().mockResolvedValue({}),
    del: jest.fn().mockResolvedValue({}),
  },
  
  // UI API
  showNotification: jest.fn(),
  Snackbar: {
    enqueueSnackbar: jest.fn(),
  },
  
  // Config and app info
  Config: {
    version: '1.2.1',
    isDevMode: true,
  },
  
  // React integration (provided by Spicetify)
  React: global.React || {
    createElement: jest.fn(),
    useState: jest.fn(() => [null, jest.fn()]),
    useEffect: jest.fn(),
    useRef: jest.fn(() => ({ current: null })),
    Component: class MockComponent {},
  },
  
  ReactDOM: global.ReactDOM || {
    render: jest.fn(),
    unmountComponentAtNode: jest.fn(),
    createPortal: jest.fn(),
  },
};

// 8. indexedDB placeholder (TemporalMemoryService)
(global as any).indexedDB = (global as any).indexedDB || {};

// 9. CSS API mock (DeviceCapabilityDetector)
(global as any).CSS = {
  supports: jest.fn().mockReturnValue(true)
};

// 10. Enhanced IndexedDB Mock for TemporalMemoryService
const mockDB = {
  get: jest.fn().mockResolvedValue(undefined),
  put: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  getAll: jest.fn().mockResolvedValue([]),
  count: jest.fn().mockResolvedValue(0),
  transaction: jest.fn().mockReturnValue({
    objectStore: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue(undefined),
      put: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn().mockResolvedValue(undefined)
    }),
    complete: jest.fn().mockResolvedValue(undefined)
  }),
  close: jest.fn(),
  version: 1,
  name: 'TestDB',
  objectStoreNames: ['testStore']
};

jest.mock("idb", () => ({
  __esModule: true,
  openDB: jest.fn().mockResolvedValue(mockDB),
  deleteDB: jest.fn().mockResolvedValue(undefined),
}));

// 11. Enhanced WebGL Mocking System
// Mock WebGL2RenderingContext for systems that check for it
(global as any).WebGL2RenderingContext = function() {};

const createWebGLMock = () => {
  const mockTexture = { id: Math.random().toString(36) };
  const mockShader = { id: Math.random().toString(36) };
  const mockProgram = { id: Math.random().toString(36) };
  const mockBuffer = { id: Math.random().toString(36) };
  
  return {
    // Texture operations
    createTexture: jest.fn(() => mockTexture),
    bindTexture: jest.fn(),
    texImage2D: jest.fn(),
    texParameteri: jest.fn(),
    generateMipmap: jest.fn(),
    
    // Shader operations
    createShader: jest.fn(() => mockShader),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn((shader: any, param: number) => {
      return param === 35713 ? true : false; // COMPILE_STATUS = 35713
    }),
    getShaderInfoLog: jest.fn(() => ''), // Return empty string for successful compilation
    
    // Program operations
    createProgram: jest.fn(() => mockProgram),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn(() => true),
    useProgram: jest.fn(),
    
    // Buffer operations
    createBuffer: jest.fn(() => mockBuffer),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    
    // Attribute operations
    getAttribLocation: jest.fn(() => 0),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    
    // Uniform operations
    getUniformLocation: jest.fn(() => ({ id: 'mock-uniform' })),
    uniform1f: jest.fn(),
    uniform2f: jest.fn(),
    uniform3f: jest.fn(),
    uniform4f: jest.fn(),
    uniform1i: jest.fn(),
    uniform2i: jest.fn(),
    uniform3i: jest.fn(),
    uniform4i: jest.fn(),
    uniformMatrix4fv: jest.fn(),
    // Vector uniform operations (missing methods causing failures)
    uniform1fv: jest.fn(),
    uniform2fv: jest.fn(),
    uniform3fv: jest.fn(),
    uniform4fv: jest.fn(),
    uniform1iv: jest.fn(),
    uniform2iv: jest.fn(),
    uniform3iv: jest.fn(),
    uniform4iv: jest.fn(),
    uniformMatrix2fv: jest.fn(),
    uniformMatrix3fv: jest.fn(),
    
    // Drawing operations
    drawArrays: jest.fn(),
    drawElements: jest.fn(),
    
    // State management
    viewport: jest.fn(),
    clear: jest.fn(),
    clearColor: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    blendFunc: jest.fn(),
    
    // Error handling
    getError: jest.fn(() => 0), // NO_ERROR = 0
    isContextLost: jest.fn(() => false),
    
    // Extensions and capabilities
    getExtension: jest.fn(() => null),
    getSupportedExtensions: jest.fn(() => []),
    getParameter: jest.fn((param) => {
      // Common WebGL parameters
      if (param === 3379) return 4096; // MAX_TEXTURE_SIZE
      if (param === 34076) return 16; // MAX_TEXTURE_IMAGE_UNITS  
      if (param === 7936) return "Mock WebGL Vendor"; // VENDOR
      if (param === 7937) return "Mock WebGL Renderer"; // RENDERER
      return 0;
    }),
    
    // Constants (commonly used ones)
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,
    ARRAY_BUFFER: 34962,
    ELEMENT_ARRAY_BUFFER: 34963,
    STATIC_DRAW: 35044,
    TRIANGLES: 4,
    FLOAT: 5126,
    TEXTURE_2D: 3553,
    RGBA: 6408,
    UNSIGNED_BYTE: 5121,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_MAG_FILTER: 10240,
    LINEAR: 9729,
    CLAMP_TO_EDGE: 33071,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    COLOR_BUFFER_BIT: 16384,
    DEPTH_TEST: 2929,
    BLEND: 3042,
    SRC_ALPHA: 770,
    ONE_MINUS_SRC_ALPHA: 771,
    NO_ERROR: 0
  };
};

// Mock HTMLCanvasElement.getContext for WebGL
HTMLCanvasElement.prototype.getContext = jest.fn((contextType: string) => {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return createWebGLMock();
  }
  if (contextType === '2d') {
    return {
      // Drawing operations
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      strokeRect: jest.fn(),
      
      // Image operations
      getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      drawImage: jest.fn(),
      
      // Transform operations (CRITICAL - these were missing)
      setTransform: jest.fn(),
      getTransform: jest.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
      resetTransform: jest.fn(),
      scale: jest.fn(),          // ← This was missing, causing the error
      rotate: jest.fn(),
      translate: jest.fn(),
      transform: jest.fn(),
      
      // State management
      save: jest.fn(),
      restore: jest.fn(),
      
      // Path operations
      beginPath: jest.fn(),
      closePath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      bezierCurveTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      arc: jest.fn(),
      arcTo: jest.fn(),
      ellipse: jest.fn(),
      rect: jest.fn(),
      
      // Drawing styles
      stroke: jest.fn(),
      fill: jest.fn(),
      clip: jest.fn(),
      
      // Properties (getters/setters)
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      lineDashOffset: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowColor: 'rgba(0, 0, 0, 0)',
      globalAlpha: 1.0,
      globalCompositeOperation: 'source-over',
      
      // Text operations
      fillText: jest.fn(),
      strokeText: jest.fn(),
      measureText: jest.fn(() => ({ width: 100 })),
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic',
      direction: 'inherit',
      
      // Line dash operations
      setLineDash: jest.fn(),
      getLineDash: jest.fn(() => []),
      
      // Image smoothing
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'low',
      
      // Canvas dimensions (mock)
      canvas: {
        width: 800,
        height: 600,
        style: {},
        getContext: jest.fn(() => null) // Recursive context creation fallback
      }
    };
  }
  return null;
});

// 12. Global System Dependencies Bootstrap
// Initialize global dependencies that SystemCoordinator and other systems need
// This prevents "Global OptimizedCSSVariableManager not initialized" errors

// Create mock global CSS manager instance (set this early, before any imports)
const mockOptimizedCSSController = {
  queueCSSVariableUpdate: jest.fn(),
  flushBatch: jest.fn(),
  setProperty: jest.fn(),
  destroy: jest.fn(),
  initialized: true,
  initialize: jest.fn().mockResolvedValue(undefined),
  // Additional methods for enhanced CSS variable management
  batchSetVariables: jest.fn(),
  clearBatch: jest.fn(),
  getBatchSize: jest.fn(() => 0),
  isReady: jest.fn(() => true),
  flush: jest.fn(),
  flushPendingUpdates: jest.fn(),
  // CSS consciousness controller compatibility
  updateCSSVariable: jest.fn(),
  updateBatchedCSSVariables: jest.fn(),
  queueBatchedUpdate: jest.fn()
};

// Set up global references that systems expect
(global as any).globalOptimizedCSSController = mockOptimizedCSSController;

// Mock the getter function specifically (Phase 6.1: migrated to UnifiedCSSVariableManager)
jest.mock('@/core/css/UnifiedCSSVariableManager', () => ({
  ...jest.requireActual('@/core/css/UnifiedCSSVariableManager'),
  getGlobalUnifiedCSSManager: () => mockOptimizedCSSController,
  setGlobalUnifiedCSSManager: jest.fn(),
  getGlobalUnifiedCSSManagerSafe: () => mockOptimizedCSSController
}));

// Mock AdvancedThemeSystem global
(global as any).advancedThemeSystem = {
  isInitialized: true,
  getCachedNonVisualSystem: jest.fn(() => mockOptimizedCSSController),
  config: { enableDebug: false, artisticMode: 'artist-vision' },
  // Enhanced properties for system orchestration
  cssConsciousnessController: mockOptimizedCSSController,
  unifiedCSSConsciousnessController: mockOptimizedCSSController,
  performanceAnalyzer: null,
  performanceCoordinator: null,
  performanceOrchestrator: null,
  musicSyncService: null,
  settingsManager: null,
  colorHarmonyEngine: null,
  semanticColorManager: null,
  deviceCapabilityDetector: null,
  // Facade coordination
  facadeCoordinator: {
    getVisualSystem: jest.fn(() => null),
    getNonVisualSystem: jest.fn(() => mockOptimizedCSSController),
    isInitialized: jest.fn(() => true)
  },
  // Animation and timer systems
  timerConsolidationSystem: {
    registerConsolidatedTimer: jest.fn(),
    unregisterConsolidatedTimer: jest.fn()
  },
  // Methods that might be called
  registerAnimationSystem: jest.fn(),
  unregisterAnimationSystem: jest.fn(),
  queueCSSVariableUpdate: jest.fn(),
  updateFromMusicAnalysis: jest.fn(),
  applyColorsToTheme: jest.fn()
};

// 13. Silence noisy console logs in test output (optional)
const originalConsoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  if (/(StorageManager|CSSVariableBatcher|OptimizedCSSVariableManager.*not.*initialized)/.test(args[0])) return;
  originalConsoleError(...args);
};
