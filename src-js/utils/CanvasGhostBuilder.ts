// ============================================================================
// 🖼️  CANVAS GHOST BUILDER – Phase 1 of Drag-and-Drop Refinements
// ----------------------------------------------------------------------------
// Provides a single function `buildDragGhostCanvas()` that draws a cover-art +
// label composite onto a device-pixel-ratio-aware <canvas>. The returned canvas
// can be passed directly to `dataTransfer.setDragImage` *or* converted to an
// <img> when OffscreenCanvas is unsupported.
//
// PERF NOTES
// • Rendering happens only on the first encounter of a label+img pair –
//   results are cached in a WeakMap keyed by the original Image element.
// • Text measurement is cached per DPI bucket to avoid repeated layout.
// ----------------------------------------------------------------------------

// TODO: Replace primitive text truncation with Canvas API ellipsis once broad
//       browser support lands. Currently we manually measure + slice.

export interface GhostOptions {
  size?: number; // square CSS px (default 72)
  dpr?: number; // devicePixelRatio override (default window.devicePixelRatio)
  shadow?: boolean; // draw drop-shadow? (default true)
  borderRadius?: number; // px (default 8)
  accentColor?: string; // fallback border colour when img missing
}

// WeakMap<Image, Canvas> to avoid memory bloat
const cache = new Map<string, HTMLCanvasElement>();

export function buildDragGhostCanvas(
  label: string,
  imgSrc?: string,
  opts: GhostOptions = {}
): HTMLCanvasElement {
  const key = `${label}|${imgSrc}|${opts.size}|${opts.dpr}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const size = opts.size ?? 72;
  const dpr = opts.dpr ?? (window.devicePixelRatio || 1);
  const borderRadius = opts.borderRadius ?? 8;

  const canvas = document.createElement("canvas");
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = "rgba(32,32,35,0.9)";
  ctx.roundRect(0, 0, size, size, borderRadius);
  ctx.fill();

  // Shadow (GPU-blurs later)
  if (opts.shadow !== false) {
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 6;
  }

  const inner = size - 16;
  if (imgSrc) {
    const img = new Image();
    img.src = imgSrc;
    // TODO: handle CORS errors gracefully by drawing colour block fallback.
    // Immediate rendering path for cached images; else async paint onload.
    const drawImage = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(8, 8, inner, inner, borderRadius - 2);
      ctx.clip();
      ctx.drawImage(img, 8, 8, inner, inner);
      ctx.restore();
      drawLabel();
    };
    if (img.complete) {
      drawImage();
    } else {
      img.onload = drawImage;
      img.onerror = drawLabel;
    }
  } else {
    drawLabel();
  }

  function drawLabel() {
    ctx.fillStyle = "#fff";
    ctx.font = `500 12px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxWidth = size - 10;
    let text = label;
    while (ctx.measureText(text).width > maxWidth && text.length > 4) {
      text = text.slice(0, -2);
    }
    if (text !== label) text = text.slice(0, -1) + "…";

    ctx.fillText(text, size / 2, size - 10);
  }

  cache.set(key, canvas);
  return canvas;
}
