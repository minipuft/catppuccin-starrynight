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

// 9. CSS API mock (DeviceCapabilityDetector)
(global as any).CSS = {
  supports: jest.fn().mockReturnValue(true)
};

// 10. Mock idb's openDB to avoid real IndexedDB usage in Node
jest.mock("idb", () => ({
  __esModule: true,
  openDB: jest.fn().mockResolvedValue({}),
  deleteDB: jest.fn(),
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
    getShaderInfoLog: jest.fn(() => 'Mock shader info log'),
    
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
    uniformMatrix4fv: jest.fn(),
    
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
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
    };
  }
  return null;
});

// 12. Silence noisy console logs in test output (optional)
const originalConsoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  if (/(StorageManager|CSSVariableBatcher)/.test(args[0])) return;
  originalConsoleError(...args);
};
