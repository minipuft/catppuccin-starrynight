// TODO[PHASE1-NOISE] NoiseField utility generates a static simplex-noise vector grid.
// At runtime DataGlyphSystem will sample this field for per-row echo origin offsets.
// Implementation is intentionally lightweight – 2D value noise with cosine interpolation.

export type Vector2 = { x: number; y: number };

const GRID_SIZE = 64; // 64×64 grid → 4 KB of vectors
const vectors: Vector2[] = new Array(GRID_SIZE * GRID_SIZE);

// --- Initialise random unit vectors ---------------------------------
(function init() {
  for (let i = 0; i < vectors.length; i++) {
    const angle = Math.random() * Math.PI * 2;
    vectors[i] = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }
})();

/**
 * Bilinear sample of the noise field.
 * @param u normalized x (0-1)
 * @param v normalized y (0-1)
 * @returns Vector2 direction with length in [0,1]
 */
export function sample(u: number, v: number): Vector2 {
  const x = Math.max(0, Math.min(0.9999, u)) * (GRID_SIZE - 1);
  const y = Math.max(0, Math.min(0.9999, v)) * (GRID_SIZE - 1);

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const sx = x - x0;
  const sy = y - y0;

  const v00 = vectors[y0 * GRID_SIZE + x0]!;
  const v10 = vectors[y0 * GRID_SIZE + (x1 % GRID_SIZE)]!;
  const v01 = vectors[(y1 % GRID_SIZE) * GRID_SIZE + x0]!;
  const v11 = vectors[(y1 % GRID_SIZE) * GRID_SIZE + (x1 % GRID_SIZE)]!;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const ix0x = lerp(v00.x, v10.x, sx);
  const ix0y = lerp(v00.y, v10.y, sx);
  const ix1x = lerp(v01.x, v11.x, sx);
  const ix1y = lerp(v01.y, v11.y, sx);

  return {
    x: lerp(ix0x, ix1x, sy),
    y: lerp(ix0y, ix1y, sy),
  };
}

// --- TODO[PHASE2-NOISE] Expose function to reseed grid for new sessions.
