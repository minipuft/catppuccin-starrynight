// VisualCanvasFactory.ts – GPU-accelerated canvas creation with fallbacks
// ========================================================================
// This factory provides optimized canvas contexts, prioritizing WebGL2
// while gracefully falling back to 2D canvas on legacy devices.

export type CanvasContextType = "webgl2" | "2d";

export interface CanvasResult {
  canvas: HTMLCanvasElement;
  ctx: RenderingContext | null;
  type: CanvasContextType;
  capabilities: {
    supportsGPUAcceleration: boolean;
    supports3D: boolean;
    maxTextureSize?: number;
    preferredFormat?: string;
  };
}

export interface CanvasOptions {
  id: string;
  width?: number;
  height?: number;
  alpha?: boolean;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  preferredType?: CanvasContextType;
  fallbackChain?: CanvasContextType[];
}


/**
 * Detect if WebGL2 is available and functional.
 */
function detectWebGL2Support(): boolean {
  try {
    const testCanvas = document.createElement("canvas");
    const gl = testCanvas.getContext("webgl2");
    if (!gl) return false;

    // Basic capability verification
    const hasRequiredExtensions =
      gl.getExtension("EXT_color_buffer_float") !== null;
    return true; // WebGL2 core functionality is sufficient
  } catch (e) {
    return false;
  }
}


/**
 * Create WebGL2 canvas context with optimized settings.
 */
function createWebGL2Context(
  canvas: HTMLCanvasElement,
  options: CanvasOptions
): CanvasResult | null {
  try {
    const contextOptions: WebGLContextAttributes = {
      alpha: options.alpha ?? true,
      antialias: options.antialias ?? true,
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    };

    const gl = canvas.getContext(
      "webgl2",
      contextOptions
    ) as WebGL2RenderingContext;
    if (!gl) return null;

    // Get capabilities
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    return {
      canvas,
      ctx: gl,
      type: "webgl2",
      capabilities: {
        supportsGPUAcceleration: true,
        supports3D: true,
        maxTextureSize,
      },
    };
  } catch (error) {
    console.warn(
      "[VisualCanvasFactory] WebGL2 context creation failed:",
      error
    );
    return null;
  }
}

/**
 * Create 2D canvas context as fallback.
 */
function create2DContext(
  canvas: HTMLCanvasElement,
  options: CanvasOptions
): CanvasResult {
  const contextOptions: CanvasRenderingContext2DSettings = {
    alpha: options.alpha ?? true,
    desynchronized: true, // Optimize for animations
  };

  const ctx = canvas.getContext(
    "2d",
    contextOptions
  ) as CanvasRenderingContext2D;

  return {
    canvas,
    ctx,
    type: "2d",
    capabilities: {
      supportsGPUAcceleration: false,
      supports3D: false,
    },
  };
}

/**
 * Main factory function - creates optimized canvas with best available context.
 */
export async function createOptimizedCanvas(
  options: CanvasOptions
): Promise<CanvasResult> {
  // Create canvas element
  const canvas = document.createElement("canvas");
  canvas.id = options.id;

  // Set dimensions
  canvas.width = options.width ?? window.innerWidth;
  canvas.height = options.height ?? window.innerHeight;

  // Define fallback chain
  const fallbackChain = options.fallbackChain ?? ["webgl2", "2d"];

  // If user specified preferred type, try it first
  if (options.preferredType) {
    const chain = [
      options.preferredType,
      ...fallbackChain.filter((t) => t !== options.preferredType),
    ];
    fallbackChain.splice(0, fallbackChain.length, ...chain);
  }

  // Try each context type in order
  for (const contextType of fallbackChain) {
    let result: CanvasResult | null = null;

    switch (contextType) {
      case "webgl2":
        if (detectWebGL2Support()) {
          result = createWebGL2Context(canvas, options);
        }
        break;

      case "2d":
        result = create2DContext(canvas, options);
        break;
    }

    if (result) {
      return result;
    }
  }

  // Ultimate fallback - should never reach here
  return create2DContext(canvas, options);
}

/**
 * Quick capability detection without creating canvas.
 */
export function detectRenderingCapabilities(): {
  webgl2: boolean;
  recommendedType: CanvasContextType;
} {
  const webgl2 = detectWebGL2Support();

  let recommendedType: CanvasContextType = "2d";
  if (webgl2) {
    recommendedType = "webgl2";
  }

  return { webgl2, recommendedType };
}
