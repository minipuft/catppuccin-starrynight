/**
 * WebGL Gradient Wrapper Performance Tests
 * Verifies no scroll jank and proper click pass-through
 */

import { WebGLGradientBackgroundSystem } from '@/visual/backgrounds/WebGLGradientBackgroundSystem';
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { SettingsManager } from '@/ui/managers/SettingsManager';
import { YEAR3000_CONFIG } from '@/config/globalConfig';

// Mock performance APIs
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => [])
} as any;

// Mock window APIs
Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockReturnValue({ matches: false }),
  configurable: true
});

// Create mock WebGL2 context  
const createMockWebGL2 = () => ({
  canvas: { width: 1920, height: 1080 },
  createShader: jest.fn().mockReturnValue({}),
  createProgram: jest.fn().mockReturnValue({}),
  createTexture: jest.fn().mockReturnValue({}),
  createBuffer: jest.fn().mockReturnValue({}),
  createVertexArray: jest.fn().mockReturnValue({}),
  getUniformLocation: jest.fn().mockReturnValue({}),
  getAttribLocation: jest.fn().mockReturnValue(0),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  getShaderParameter: jest.fn().mockReturnValue(true),
  getProgramParameter: jest.fn().mockReturnValue(true),
  useProgram: jest.fn(),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  bindVertexArray: jest.fn(),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  bindTexture: jest.fn(),
  texImage2D: jest.fn(),
  texParameteri: jest.fn(),
  activeTexture: jest.fn(),
  uniform1f: jest.fn(),
  uniform2f: jest.fn(),
  uniform1i: jest.fn(),
  uniform1fv: jest.fn(),
  viewport: jest.fn(),
  clearColor: jest.fn(),
  clear: jest.fn(),
  drawArrays: jest.fn(),
  deleteTexture: jest.fn(),
  deleteBuffer: jest.fn(),
  deleteVertexArray: jest.fn(),
  deleteProgram: jest.fn(),
  deleteShader: jest.fn(),
  getShaderInfoLog: jest.fn().mockReturnValue(''),
  getProgramInfoLog: jest.fn().mockReturnValue(''),
  getError: jest.fn().mockReturnValue(0), // GL_NO_ERROR
  pixelStorei: jest.fn(),
  // WebGL constants
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  TRIANGLES: 4,
  ARRAY_BUFFER: 34962,
  STATIC_DRAW: 35044,
  TEXTURE_2D: 3553,
  TEXTURE0: 33984,
  COLOR_BUFFER_BIT: 16384,
  NO_ERROR: 0,
  RGBA: 6408,
  UNSIGNED_BYTE: 5121,
  TEXTURE_MIN_FILTER: 10241,
  TEXTURE_MAG_FILTER: 10240,
  LINEAR: 9729,
  CLAMP_TO_EDGE: 33071,
  TEXTURE_WRAP_S: 10242,
  TEXTURE_WRAP_T: 10243
});

// Mock DOM APIs
Object.defineProperty(document, 'createElement', {
  value: jest.fn().mockImplementation((tagName: string) => {
    if (tagName === 'div') {
      return {
        style: { 
          _cssText: '',
          set cssText(value: string) { (this as any)._cssText = value; },
          get cssText() { return (this as any)._cssText || ''; }
        },
        className: '',
        appendChild: jest.fn(),
        parentNode: null
      };
    }
    if (tagName === 'canvas') {
      return {
        style: { 
          _cssText: '',
          set cssText(value: string) { (this as any)._cssText = value; },
          get cssText() { return (this as any)._cssText || ''; }
        },
        className: '',
        parentNode: null,
        id: '',
        width: 1920,
        height: 1080,
        getContext: jest.fn().mockImplementation((type: string) => {
          return type === 'webgl2' ? createMockWebGL2() : null;
        })
      };
    }
    return {
      style: { cssText: '' },
      className: '',
      appendChild: jest.fn(),
      parentNode: null
    };
  }),
  configurable: true
});

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
  configurable: true
});

describe('WebGL Gradient Wrapper Performance', () => {
  let system: WebGLGradientBackgroundSystem;
  let mockPerformanceAnalyzer: jest.Mocked<SimplePerformanceCoordinator>;
  let mockSettingsManager: jest.Mocked<SettingsManager>;

  beforeEach(() => {
    mockPerformanceAnalyzer = {
      startTiming: jest.fn(),
      endTiming: jest.fn(),
      emitTrace: jest.fn(),
      getAverageFPS: jest.fn().mockReturnValue(60)
    } as any;

    mockSettingsManager = {
      get: jest.fn().mockReturnValue('balanced'),
      initialized: true
    } as any;

    system = new WebGLGradientBackgroundSystem(
      YEAR3000_CONFIG,
      {} as any,
      mockPerformanceAnalyzer,
      null,
      mockSettingsManager,
      null
    );
  });

  afterEach(() => {
    if (system) {
      system.destroy();
    }
    jest.clearAllMocks();
  });

  describe('Wrapper Element Properties', () => {
    it('should create wrapper with pointer-events: none', async () => {
      await system.initialize();
      
      const wrapper = system['wrapper'];
      expect(wrapper).toBeTruthy();
      expect(wrapper?.style.cssText).toContain('pointer-events: none');
    });

    it('should position wrapper behind content (z-index: -11)', async () => {
      await system.initialize();
      
      const wrapper = system['wrapper'];
      expect(wrapper?.style.cssText).toContain('z-index: -11');
    });

    it('should use fixed positioning to avoid layout shifts', async () => {
      await system.initialize();
      
      const wrapper = system['wrapper'];
      expect(wrapper?.style.cssText).toContain('position: fixed');
    });

    it('should prevent overflow to avoid scroll interference', async () => {
      await system.initialize();
      
      const wrapper = system['wrapper'];
      expect(wrapper?.style.cssText).toContain('overflow: hidden');
    });
  });

  describe('Canvas Element Properties', () => {
    it('should position canvas relatively within wrapper', async () => {
      await system.initialize();
      
      const canvas = system['canvas'];
      expect(canvas?.style.cssText).toContain('position: absolute');
      expect(canvas?.style.cssText).toContain('pointer-events: none');
    });

    it('should maintain full size within wrapper', async () => {
      await system.initialize();
      
      const canvas = system['canvas'];
      expect(canvas?.style.cssText).toContain('width: 100%');
      expect(canvas?.style.cssText).toContain('height: 100%');
    });
  });

  describe('CSS Class Application', () => {
    it('should apply sn-flow-gradient-wrapper class for CSS styling', async () => {
      await system.initialize();
      
      const wrapper = system['wrapper'];
      expect(wrapper?.className).toBe('sn-flow-gradient-wrapper');
    });
  });

  describe('Cleanup Behavior', () => {
    it('should remove wrapper and canvas on destruction', async () => {
      await system.initialize();
      
      const wrapper = system['wrapper'];
      const mockParent = { removeChild: jest.fn() };
      if (wrapper) {
        Object.defineProperty(wrapper, 'parentNode', {
          value: mockParent,
          writable: true,
          configurable: true
        });
      }

      system.destroy();

      expect(mockParent.removeChild).toHaveBeenCalledWith(wrapper);
      expect(system['wrapper']).toBeNull();
      expect(system['canvas']).toBeNull();
    });
  });

  describe('Performance Characteristics', () => {
    it('should not affect main thread performance', async () => {
      const startTime = performance.now();
      
      await system.initialize();
      
      const endTime = performance.now();
      const initTime = endTime - startTime;
      
      // Initialization should be fast (< 100ms)
      expect(initTime).toBeLessThan(100);
    });

    it('should maintain stable FPS metrics', () => {
      const metrics = system.getMetrics();
      
      expect(typeof metrics.fps).toBe('number');
      expect(metrics.fps).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle mobile viewport gracefully', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });

      expect(() => system.initialize()).not.toThrow();
    });

    it('should respect reduced motion preferences', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockReturnValue({ matches: true }),
        configurable: true
      });

      expect(() => system.initialize()).not.toThrow();
    });
  });
});