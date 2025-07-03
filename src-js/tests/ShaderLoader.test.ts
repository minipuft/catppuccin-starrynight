/**
 * ShaderLoader Unit Tests
 * Tests shader compilation and gradient texture creation
 */

import { ShaderLoader, createGradientTexture, DEFAULT_VERTEX_SHADER } from '@/utils/ShaderLoader';

// Mock WebGL2 context for headless testing
const createMockGL = (): Partial<WebGL2RenderingContext> => {
  const shaders = new Map<WebGLShader, { type: number; source: string; compiled: boolean }>();
  const programs = new Map<WebGLProgram, { linked: boolean; shaders: WebGLShader[] }>();
  let shaderIdCounter = 1;
  let programIdCounter = 1;

  return {
    FRAGMENT_SHADER: 35632,
    VERTEX_SHADER: 35633,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,
    TEXTURE_2D: 3553,
    RGBA: 6408,
    UNSIGNED_BYTE: 5121,
    CLAMP_TO_EDGE: 33071,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_MAG_FILTER: 10240,
    LINEAR: 9729,

    createShader: jest.fn((type: number) => {
      const shader = { _id: shaderIdCounter++ } as WebGLShader;
      shaders.set(shader, { type, source: '', compiled: false });
      return shader;
    }),

    shaderSource: jest.fn((shader: WebGLShader, source: string) => {
      const shaderData = shaders.get(shader);
      if (shaderData) {
        shaderData.source = source;
      }
    }),

    compileShader: jest.fn((shader: WebGLShader) => {
      const shaderData = shaders.get(shader);
      if (shaderData) {
        // Simple validation - reject empty source
        shaderData.compiled = shaderData.source.length > 0;
      }
    }),

    getShaderParameter: jest.fn((shader: WebGLShader, pname: number) => {
      if (pname === 35713) { // COMPILE_STATUS
        const shaderData = shaders.get(shader);
        return shaderData?.compiled || false;
      }
      return false;
    }),

    getShaderInfoLog: jest.fn(() => 'Mock shader info log'),

    deleteShader: jest.fn((shader: WebGLShader) => {
      shaders.delete(shader);
    }),

    createProgram: jest.fn(() => {
      const program = { _id: programIdCounter++ } as WebGLProgram;
      programs.set(program, { linked: false, shaders: [] });
      return program;
    }),

    attachShader: jest.fn((program: WebGLProgram, shader: WebGLShader) => {
      const programData = programs.get(program);
      if (programData) {
        programData.shaders.push(shader);
      }
    }),

    linkProgram: jest.fn((program: WebGLProgram) => {
      const programData = programs.get(program);
      if (programData) {
        // Simple validation - require both vertex and fragment shaders
        const hasVertex = programData.shaders.some(s => shaders.get(s)?.type === 35633);
        const hasFragment = programData.shaders.some(s => shaders.get(s)?.type === 35632);
        programData.linked = hasVertex && hasFragment;
      }
    }),

    getProgramParameter: jest.fn((program: WebGLProgram, pname: number) => {
      if (pname === 35714) { // LINK_STATUS
        const programData = programs.get(program);
        return programData?.linked || false;
      }
      return false;
    }),

    getProgramInfoLog: jest.fn(() => 'Mock program info log'),

    deleteProgram: jest.fn((program: WebGLProgram) => {
      programs.delete(program);
    }),

    createTexture: jest.fn(() => ({ _id: Date.now() } as WebGLTexture)),
    bindTexture: jest.fn(),
    texImage2D: jest.fn(),
    texParameteri: jest.fn(),
  };
};

describe('ShaderLoader', () => {
  let mockGL: Partial<WebGL2RenderingContext>;

  beforeEach(() => {
    mockGL = createMockGL();
    ShaderLoader.clearAllCaches();
  });

  describe('loadFragment', () => {
    it('should compile valid fragment shader', () => {
      const source = `#version 300 es
        precision mediump float;
        out vec4 fragColor;
        void main() { fragColor = vec4(1.0); }`;

      const shader = ShaderLoader.loadFragment(mockGL as WebGL2RenderingContext, source);

      expect(shader).toBeTruthy();
      expect(mockGL.createShader).toHaveBeenCalledWith(35632); // FRAGMENT_SHADER
      expect(mockGL.shaderSource).toHaveBeenCalled();
      expect(mockGL.compileShader).toHaveBeenCalled();
    });

    it('should cache compiled shaders', () => {
      const source = `#version 300 es
        precision mediump float;
        out vec4 fragColor;
        void main() { fragColor = vec4(1.0); }`;

      const shader1 = ShaderLoader.loadFragment(mockGL as WebGL2RenderingContext, source);
      const shader2 = ShaderLoader.loadFragment(mockGL as WebGL2RenderingContext, source);

      expect(shader1).toBe(shader2);
      expect(mockGL.createShader).toHaveBeenCalledTimes(1);
    });

    it('should handle compilation errors', () => {
      // Mock compilation failure
      jest.spyOn(mockGL, 'getShaderParameter').mockReturnValue(false);

      const invalidSource = 'invalid shader source';
      const shader = ShaderLoader.loadFragment(mockGL as WebGL2RenderingContext, invalidSource);

      expect(shader).toBeNull();
      expect(mockGL.deleteShader).toHaveBeenCalled();
    });
  });

  describe('loadVertex', () => {
    it('should compile valid vertex shader', () => {
      const shader = ShaderLoader.loadVertex(mockGL as WebGL2RenderingContext, DEFAULT_VERTEX_SHADER);

      expect(shader).toBeTruthy();
      expect(mockGL.createShader).toHaveBeenCalledWith(35633); // VERTEX_SHADER
    });
  });

  describe('createProgram', () => {
    it('should create program from valid shaders', () => {
      const vertexShader = ShaderLoader.loadVertex(mockGL as WebGL2RenderingContext, DEFAULT_VERTEX_SHADER);
      const fragmentSource = `#version 300 es
        precision mediump float;
        out vec4 fragColor;
        void main() { fragColor = vec4(1.0); }`;
      const fragmentShader = ShaderLoader.loadFragment(mockGL as WebGL2RenderingContext, fragmentSource);

      expect(vertexShader).toBeTruthy();
      expect(fragmentShader).toBeTruthy();

      const program = ShaderLoader.createProgram(
        mockGL as WebGL2RenderingContext,
        vertexShader!,
        fragmentShader!
      );

      expect(program).toBeTruthy();
      expect(mockGL.createProgram).toHaveBeenCalled();
      expect(mockGL.attachShader).toHaveBeenCalledTimes(2);
      expect(mockGL.linkProgram).toHaveBeenCalled();
    });
  });

  describe('cache management', () => {
    it('should clear context-specific cache', () => {
      const source = DEFAULT_VERTEX_SHADER;
      const shader1 = ShaderLoader.loadVertex(mockGL as WebGL2RenderingContext, source);

      ShaderLoader.clearCache(mockGL as WebGL2RenderingContext);

      const shader2 = ShaderLoader.loadVertex(mockGL as WebGL2RenderingContext, source);

      expect(shader1).not.toBe(shader2);
      expect(mockGL.deleteShader).toHaveBeenCalled();
    });

    it('should clear all caches', () => {
      const source = DEFAULT_VERTEX_SHADER;
      ShaderLoader.loadVertex(mockGL as WebGL2RenderingContext, source);

      ShaderLoader.clearAllCaches();

      const shader = ShaderLoader.loadVertex(mockGL as WebGL2RenderingContext, source);
      expect(shader).toBeTruthy();
      expect(mockGL.createShader).toHaveBeenCalledTimes(2); // Once before clear, once after
    });
  });
});

describe('createGradientTexture', () => {
  let mockGL: Partial<WebGL2RenderingContext>;

  beforeEach(() => {
    mockGL = createMockGL();
    
    // Mock HTML5 Canvas API
    Object.defineProperty(document, 'createElement', {
      value: jest.fn().mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: jest.fn().mockReturnValue({
              createLinearGradient: jest.fn().mockReturnValue({
                addColorStop: jest.fn()
              }),
              fillRect: jest.fn(),
              fillStyle: null
            })
          };
        }
        return {};
      }),
      configurable: true
    });
  });

  it('should create gradient texture from color stops', () => {
    const stops = [
      { r: 1, g: 0, b: 0, a: 1, position: 0 },
      { r: 0, g: 1, b: 0, a: 1, position: 0.5 },
      { r: 0, g: 0, b: 1, a: 1, position: 1 }
    ];

    const texture = createGradientTexture(mockGL as WebGL2RenderingContext, stops);

    expect(texture).toBeTruthy();
    expect(mockGL.createTexture).toHaveBeenCalled();
    expect(mockGL.bindTexture).toHaveBeenCalled();
    expect(mockGL.texImage2D).toHaveBeenCalled();
    expect(mockGL.texParameteri).toHaveBeenCalledTimes(4);
  });

  it('should handle canvas creation failure', () => {
    // Mock canvas context failure
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: jest.fn().mockReturnValue(null)
        };
      }
      return {};
    });

    const stops = [{ r: 1, g: 0, b: 0, a: 1, position: 0 }];
    const texture = createGradientTexture(mockGL as WebGL2RenderingContext, stops);

    expect(texture).toBeNull();
  });
});