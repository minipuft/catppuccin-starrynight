/**
 * WebGLGradientBackgroundSystem Unit Tests
 * Tests the flowing WebGL gradient background system
 */

import { WebGLGradientBackgroundSystem } from '@/systems/visual/WebGLGradientBackgroundSystem';
import { PerformanceAnalyzer } from '@/core/PerformanceAnalyzer';
import { SettingsManager } from '@/managers/SettingsManager';
import { ColorHarmonyEngine } from '@/systems/ColorHarmonyEngine';
import { DeviceCapabilityDetector } from '@/core/DeviceCapabilityDetector';
import { YEAR3000_CONFIG } from '@/config/globalConfig';

// Mock WebGL2 context
const createMockWebGL2 = (): Partial<WebGL2RenderingContext> => {
  const textures = new Map<WebGLTexture, any>();
  const buffers = new Map<WebGLBuffer, any>();
  const programs = new Map<WebGLProgram, any>();
  const shaders = new Map<WebGLShader, any>();
  let textureIdCounter = 1;
  let bufferIdCounter = 1;

  return {
    canvas: {
      width: 1920,
      height: 1080,
      style: { cssText: '' }
    } as HTMLCanvasElement,

    // Constants
    TEXTURE_2D: 3553,
    RGBA: 6408,
    UNSIGNED_BYTE: 5121,
    CLAMP_TO_EDGE: 33071,
    LINEAR: 9729,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_MAG_FILTER: 10240,
    ARRAY_BUFFER: 34962,
    STATIC_DRAW: 35044,
    TRIANGLES: 4,
    FLOAT: 5126,
    COLOR_BUFFER_BIT: 16384,
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,
    TEXTURE0: 33984,

    // Texture methods
    createTexture: jest.fn(() => {
      const texture = { _id: textureIdCounter++ } as WebGLTexture;
      textures.set(texture, {});
      return texture;
    }),
    bindTexture: jest.fn(),
    texImage2D: jest.fn(),
    texParameteri: jest.fn(),
    deleteTexture: jest.fn((texture: WebGLTexture) => {
      textures.delete(texture);
    }),
    activeTexture: jest.fn(),

    // Buffer methods
    createBuffer: jest.fn(() => {
      const buffer = { _id: bufferIdCounter++ } as WebGLBuffer;
      buffers.set(buffer, {});
      return buffer;
    }),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    deleteBuffer: jest.fn((buffer: WebGLBuffer) => {
      buffers.delete(buffer);
    }),

    // VAO methods
    createVertexArray: jest.fn(() => ({ _id: Date.now() } as WebGLVertexArrayObject)),
    bindVertexArray: jest.fn(),
    deleteVertexArray: jest.fn(),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),

    // Shader methods
    createShader: jest.fn((type: number) => {
      const shader = { _id: Date.now(), type } as WebGLShader;
      shaders.set(shader, { compiled: true });
      return shader;
    }),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn(() => true),
    deleteShader: jest.fn((shader: WebGLShader) => {
      shaders.delete(shader);
    }),

    // Program methods
    createProgram: jest.fn(() => {
      const program = { _id: Date.now() } as WebGLProgram;
      programs.set(program, { linked: true });
      return program;
    }),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn(() => true),
    useProgram: jest.fn(),
    deleteProgram: jest.fn((program: WebGLProgram) => {
      programs.delete(program);
    }),

    // Uniform methods
    getUniformLocation: jest.fn((program: WebGLProgram, name: string) => {
      return { name, _id: Date.now() } as WebGLUniformLocation;
    }),
    uniform1f: jest.fn(),
    uniform2f: jest.fn(),
    uniform1i: jest.fn(),
    uniform1fv: jest.fn(),

    // Attribute methods
    getAttribLocation: jest.fn(() => 0),

    // Rendering methods
    viewport: jest.fn(),
    clearColor: jest.fn(),
    clear: jest.fn(),
    drawArrays: jest.fn(),
  };
};

// Mock HTML5 Canvas API
const setupCanvasMocks = () => {
  Object.defineProperty(document, 'createElement', {
    value: jest.fn().mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        const mockGL = createMockWebGL2();
        return {
          width: 1920,
          height: 1080,
          id: '',
          style: { 
            cssText: '',
            set cssText(value: string) { this._cssText = value; },
            get cssText() { return this._cssText || ''; }
          },
          parentNode: null,
          remove: jest.fn(),
          getContext: jest.fn().mockImplementation((type: string) => {
            if (type === 'webgl2') return mockGL;
            if (type === '2d') return {
              createLinearGradient: jest.fn().mockReturnValue({
                addColorStop: jest.fn()
              }),
              fillRect: jest.fn(),
              fillStyle: null
            };
            return null;
          }),
          classList: {
            add: jest.fn()
          },
          dataset: {}
        };
      }
      if (tagName === 'div') {
        return {
          className: '',
          style: { 
            cssText: '',
            set cssText(value: string) { this._cssText = value; },
            get cssText() { return this._cssText || ''; }
          },
          appendChild: jest.fn(),
          parentNode: null,
          removeChild: jest.fn()
        };
      }
      return {};
    }),
    configurable: true
  });

  Object.defineProperty(document.body, 'appendChild', {
    value: jest.fn(),
    configurable: true
  });
};

describe('WebGLGradientBackgroundSystem', () => {
  let system: WebGLGradientBackgroundSystem;
  let mockPerformanceAnalyzer: jest.Mocked<PerformanceAnalyzer>;
  let mockSettingsManager: jest.Mocked<SettingsManager>;
  let mockColorHarmonyEngine: jest.Mocked<ColorHarmonyEngine>;

  beforeEach(() => {
    setupCanvasMocks();

    // Mock dependencies
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

    mockColorHarmonyEngine = {
      getCurrentGradient: jest.fn().mockReturnValue([
        { r: 203, g: 166, b: 247 }, // Mauve
        { r: 245, g: 194, b: 231 }, // Pink
        { r: 250, g: 179, b: 135 }, // Peach
        { r: 166, g: 227, b: 161 }, // Green
        { r: 148, g: 226, b: 213 }  // Teal
      ])
    } as any;

    // Mock global objects
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockReturnValue({ matches: false }),
      configurable: true
    });
    Object.defineProperty(window, 'addEventListener', { value: jest.fn(), configurable: true });
    Object.defineProperty(window, 'removeEventListener', { value: jest.fn(), configurable: true });

    // Mock DeviceCapabilityDetector static methods
    jest.spyOn(DeviceCapabilityDetector.prototype, 'recommendPerformanceQuality').mockReturnValue('high');

    const mockYear3000System = {
      colorHarmonyEngine: mockColorHarmonyEngine
    };

    system = new WebGLGradientBackgroundSystem(
      YEAR3000_CONFIG,
      {} as any, // utils
      mockPerformanceAnalyzer,
      null, // musicSyncService 
      mockSettingsManager,
      mockYear3000System
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (system) {
      system.destroy();
    }
  });

  describe('Initialization', () => {
    it('should initialize successfully with WebGL2 support', async () => {
      await system.initialize();

      expect(system.initialized).toBe(true);
      expect(system.isActive).toBe(true);
      expect(mockColorHarmonyEngine.getCurrentGradient).toHaveBeenCalledWith(5);
    });

    it('should fall back to CSS gradient when WebGL2 is not available', async () => {
      // Mock WebGL2 failure
      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            getContext: jest.fn().mockReturnValue(null)
          };
        }
        return {};
      });

      await system.initialize();

      expect(system.initialized).toBe(true);
      // Should not attempt WebGL initialization
    });

    it('should respect reduced motion preference', async () => {
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockReturnValue({ matches: true }),
        configurable: true
      });

      const mockYear3000System = {
        colorHarmonyEngine: mockColorHarmonyEngine
      };

      system = new WebGLGradientBackgroundSystem(
        YEAR3000_CONFIG,
        {} as any, // utils
        mockPerformanceAnalyzer,
        null, // musicSyncService
        mockSettingsManager,
        mockYear3000System
      );

      await system.initialize();
      expect(system.initialized).toBe(true);
    });
  });

  describe('Settings Management', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should handle intensity setting changes', () => {
      const settingsEvent = new CustomEvent('year3000SystemSettingsChanged', {
        detail: { key: 'sn-flow-gradient', value: 'intense' }
      });

      system.handleSettingsChange(settingsEvent);

      // Should update internal settings
      expect(mockSettingsManager.get).toHaveBeenCalled();
    });

    it('should disable system when setting is changed to disabled', () => {
      const settingsEvent = new CustomEvent('year3000SystemSettingsChanged', {
        detail: { key: 'sn-flow-gradient', value: 'disabled' }
      });

      jest.spyOn(system, 'destroy');
      system.handleSettingsChange(settingsEvent);

      expect(system.destroy).toHaveBeenCalled();
    });
  });

  describe('Color Integration', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should update gradient texture when color harmony changes', () => {
      const colorEvent = new Event('color-harmony:gradient-changed');
      
      // Trigger color harmony change
      document.dispatchEvent(colorEvent);

      expect(mockColorHarmonyEngine.getCurrentGradient).toHaveBeenCalled();
    });

    it('should use default colors when ColorHarmonyEngine is unavailable', async () => {
      system = new WebGLGradientBackgroundSystem(
        YEAR3000_CONFIG,
        {} as any, // utils
        mockPerformanceAnalyzer,
        null, // musicSyncService
        mockSettingsManager,
        null // No year3000System
      );

      await system.initialize();
      expect(system.initialized).toBe(true);
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should throttle animation frames to target FPS', () => {
      // Mock performance.now
      let currentTime = 0;
      jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

      // Mock requestAnimationFrame
      const mockRAF = jest.fn();
      Object.defineProperty(window, 'requestAnimationFrame', {
        value: mockRAF,
        configurable: true
      });

      // Start animation
      system['startAnimation']();

      // Simulate fast consecutive calls (should be throttled)
      currentTime = 10; // Only 10ms elapsed, should be throttled
      mockRAF.mock.calls[0][0](); // Execute first animation frame

      expect(mockRAF).toHaveBeenCalledTimes(2); // Should request next frame
    });

    it('should handle resize events properly', () => {
      const resizeHandler = system['resize'];
      
      // Mock canvas
      const mockCanvas = document.createElement('canvas');
      system['canvas'] = mockCanvas;

      // Trigger resize
      resizeHandler();

      expect(mockCanvas.width).toBe(1920);
      expect(mockCanvas.height).toBe(1080);
    });
  });

  describe('Cleanup', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should clean up WebGL resources properly', () => {
      const mockGL = system['gl'] as any;
      
      system.destroy();

      expect(mockGL.deleteTexture).toHaveBeenCalled();
      expect(mockGL.deleteBuffer).toHaveBeenCalled();
      expect(mockGL.deleteVertexArray).toHaveBeenCalled();
      expect(mockGL.deleteProgram).toHaveBeenCalled();
    });

    it('should remove event listeners on cleanup', () => {
      jest.spyOn(document, 'removeEventListener');
      jest.spyOn(window, 'removeEventListener');

      system.destroy();

      expect(document.removeEventListener).toHaveBeenCalledWith(
        'color-harmony:gradient-changed',
        expect.any(Function)
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should remove wrapper from DOM', () => {
      const mockWrapper = document.createElement('div');
      const mockParent = { removeChild: jest.fn() };
      mockWrapper.parentNode = mockParent as any;
      system['wrapper'] = mockWrapper;

      system.destroy();

      expect(mockParent.removeChild).toHaveBeenCalledWith(mockWrapper);
    });
  });

  describe('Wave Stack Functionality', () => {
    beforeEach(async () => {
      await system.initialize();
    });

    it('should initialize with default wave parameters', () => {
      const metrics = system.getMetrics();
      
      expect(metrics.settings.waveY).toEqual([0.25, 0.75]);
      expect(metrics.settings.waveHeight).toEqual([0.4, 0.3]);
      expect(metrics.settings.waveOffset).toEqual([2.5, -1.8]);
      expect(metrics.settings.blurExp).toBe(1.2);
      expect(metrics.settings.blurMax).toBe(0.6);
    });

    it('should create all required uniform locations', () => {
      const mockGL = system['gl'] as any;
      
      expect(mockGL.getUniformLocation).toHaveBeenCalledWith(
        expect.anything(),
        'u_waveY'
      );
      expect(mockGL.getUniformLocation).toHaveBeenCalledWith(
        expect.anything(),
        'u_waveHeight'
      );
      expect(mockGL.getUniformLocation).toHaveBeenCalledWith(
        expect.anything(),
        'u_waveOffset'
      );
      expect(mockGL.getUniformLocation).toHaveBeenCalledWith(
        expect.anything(),
        'u_blurExp'
      );
      expect(mockGL.getUniformLocation).toHaveBeenCalledWith(
        expect.anything(),
        'u_blurMax'
      );
    });

    it('should update wave uniforms during rendering', () => {
      const mockGL = system['gl'] as any;
      
      // Trigger a render cycle
      system['render'](performance.now());

      expect(mockGL.uniform1fv).toHaveBeenCalledWith(
        expect.anything(),
        [0.25, 0.75] // waveY
      );
      expect(mockGL.uniform1fv).toHaveBeenCalledWith(
        expect.anything(),
        [0.4, 0.3] // waveHeight
      );
      expect(mockGL.uniform1fv).toHaveBeenCalledWith(
        expect.anything(),
        [2.5, -1.8] // waveOffset
      );
      expect(mockGL.uniform1f).toHaveBeenCalledWith(
        expect.anything(),
        1.2 // blurExp
      );
      expect(mockGL.uniform1f).toHaveBeenCalledWith(
        expect.anything(),
        0.6 // blurMax
      );
    });

    it('should allow updating wave parameters via setters', () => {
      system.setWaveY([0.1, 0.9]);
      system.setWaveHeight([0.5, 0.5]);
      system.setWaveOffset([1.0, -2.0]);
      system.setBlurSettings(1.5, 0.8);

      const metrics = system.getMetrics();
      
      expect(metrics.settings.waveY).toEqual([0.1, 0.9]);
      expect(metrics.settings.waveHeight).toEqual([0.5, 0.5]);
      expect(metrics.settings.waveOffset).toEqual([1.0, -2.0]);
      expect(metrics.settings.blurExp).toBe(1.5);
      expect(metrics.settings.blurMax).toBe(0.8);
    });

    it('should apply different wave parameters based on intensity', () => {
      // Test minimal intensity
      mockSettingsManager.get.mockReturnValue('minimal');
      system['loadSettings']();
      
      let metrics = system.getMetrics();
      expect(metrics.settings.waveHeight).toEqual([0.3, 0.2]);
      expect(metrics.settings.blurMax).toBe(0.4);

      // Test intense intensity
      mockSettingsManager.get.mockReturnValue('intense');
      system['loadSettings']();
      
      metrics = system.getMetrics();
      expect(metrics.settings.waveHeight).toEqual([0.5, 0.4]);
      expect(metrics.settings.blurMax).toBe(0.8);
    });
  });

  describe('Shader Compilation', () => {
    it('should verify shader compiles with all required uniforms', async () => {
      await system.initialize();
      
      const mockGL = system['gl'] as any;

      // Verify shader compilation was attempted
      expect(mockGL.createShader).toHaveBeenCalledWith(mockGL.VERTEX_SHADER);
      expect(mockGL.createShader).toHaveBeenCalledWith(mockGL.FRAGMENT_SHADER);
      expect(mockGL.compileShader).toHaveBeenCalled();
      expect(mockGL.linkProgram).toHaveBeenCalled();

      // Verify all wave stack uniforms are located
      const expectedUniforms = [
        'u_time',
        'u_gradientTex', 
        'u_resolution',
        'u_flowStrength',
        'u_noiseScale',
        'u_waveY',
        'u_waveHeight',
        'u_waveOffset',
        'u_blurExp',
        'u_blurMax'
      ];

      expectedUniforms.forEach(uniformName => {
        expect(mockGL.getUniformLocation).toHaveBeenCalledWith(
          expect.anything(),
          uniformName
        );
      });
    });

    it('should track compilation errors in metrics', async () => {
      await system.initialize();
      const metrics = system.getMetrics();
      
      expect(metrics.compileErrors).toBe(0);
      expect(metrics.isActive).toBe(true);
      expect(typeof metrics.fps).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should handle shader compilation errors gracefully', async () => {
      // Mock shader compilation failure
      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          const mockGL = createMockWebGL2();
          mockGL.getShaderParameter = jest.fn().mockReturnValue(false);
          return {
            getContext: jest.fn().mockImplementation((type: string) => {
              return type === 'webgl2' ? mockGL : null;
            })
          };
        }
        return {};
      });

      await system.initialize();
      
      // Should fall back gracefully
      expect(system.initialized).toBe(true);
    });

    it('should handle gradient texture creation failures', async () => {
      mockColorHarmonyEngine.getCurrentGradient.mockReturnValue(null);

      await system.initialize();

      // Should use default gradient
      expect(system.initialized).toBe(true);
    });
  });
});