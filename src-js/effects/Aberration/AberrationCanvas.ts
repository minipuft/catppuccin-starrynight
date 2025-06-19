/* =============================================================================
 *  ADAPTIVE CHROMATIC ABERRATION CANVAS – Phase 2
 *  ---------------------------------------------------------------------------
 *  Lightweight WebGL helper that applies a subtle RGB channel offset to reduce
 *  harsh colour seams on gradient backgrounds.  It runs on a 256×256 off-screen
 *  framebuffer and paints the result onto a <canvas> overlay that sits above
 *  .main-view-container__scroll-node.  The effect is gated behind capability
 *  checks and prefersReducedMotion.
 * =============================================================================
 */

import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { Year3000System } from "@/core/year3000System";

/** Thin wrapper that owns the canvas and GL program.  */
export class AberrationCanvas {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private tex: WebGLTexture | null = null;
  private strength = 0.4; // default; overridden via CSS var
  private rafId: number | null = null;
  private perf: PerformanceAnalyzer | null;
  private frameStart = 0;
  private readonly _defaultSize = 256;

  // Bound handlers so we can remove them in destroy()
  private _boundContextLost = (e: Event) => this._handleContextLost(e);
  private _boundContextRestored = () => this._handleContextRestored();

  constructor(
    private parent: HTMLElement,
    private y3k: Year3000System | null = null
  ) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this._defaultSize;
    this.canvas.height = this._defaultSize;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    Object.assign(this.canvas.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      mixBlendMode: "screen",
      zIndex: "-1",
    } as CSSStyleDeclaration);

    this.parent.appendChild(this.canvas);
    this.perf = y3k?.performanceAnalyzer ?? null;

    // Phase-5: Robust context-loss handling
    this.canvas.addEventListener(
      "webglcontextlost",
      this._boundContextLost as EventListener,
      false
    );
    this.canvas.addEventListener(
      "webglcontextrestored",
      this._boundContextRestored,
      false
    );

    this._initGL();
  }

  private _initGL(): void {
    const gl = this.canvas.getContext("webgl", {
      premultipliedAlpha: false,
      alpha: true,
      antialias: false,
    });
    if (!gl) {
      console.warn("[AberrationCanvas] WebGL not available – effect disabled");
      return;
    }
    this.gl = gl;

    // Compile extremely small shader – 2D texture sample with rgb shift.
    const vsSource = `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = (aPos+1.0)*0.5; gl_Position = vec4(aPos,0.0,1.0); }`;
    const fsSource = `precision mediump float; uniform sampler2D uTex; uniform float uStrength; uniform float uTime; varying vec2 vUv; void main(){ float freq = 8.0; vec2 offset = vec2(sin(vUv.y*freq+uTime)*uStrength, 0.0); vec4 c; c.r = texture2D(uTex, vUv + offset).r; c.g = texture2D(uTex, vUv).g; c.b = texture2D(uTex, vUv - offset).b; c.a = clamp(uStrength * 1.5, 0.0, 0.6); gl_FragColor = c; }`;

    const compile = (type: number, src: string): WebGLShader => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[AberrationCanvas] Shader link failed");
      return;
    }

    this.program = prog;
    gl.useProgram(prog);

    // Set up full-screen quad
    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Create texture placeholder (single white pixel)
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255])
    );
    this.tex = tex;

    // TODO[Year3000-Phase1]: AberrationCanvas is now driven by the global MasterAnimationCoordinator.
    // We no longer start a private requestAnimationFrame loop here. The new AberrationVisualSystem
    // will call canvas.render(time) each frame. Remove the RAF registration to avoid duplicate
    // animation loops.
    // this._render = this._render.bind(this);
    // this.rafId = requestAnimationFrame(this._render);
  }

  /** Public API: update strength via CSS variable (0–1) */
  public setStrength(value: number): void {
    this.strength = value;
  }

  /** Uploads a bitmap (e.g., gradient snapshot) into the shader texture. */
  public updateSourceBitmap(bmp: ImageBitmap): void {
    if (!this.gl || !this.tex) return;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
  }

  /**
   * Public render hook – called by AberrationVisualSystem.onAnimate().
   * All original rendering logic from the private _render loop lives here so
   * that the effect can be orchestrated by MasterAnimationCoordinator.
   */
  public render(time: number): void {
    if (!this.gl || !this.program) return;
    const gl = this.gl;
    if (this.perf) this.frameStart = performance.now();

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);

    const uTexLoc = gl.getUniformLocation(this.program, "uTex");
    const uStrLoc = gl.getUniformLocation(this.program, "uStrength");
    const uTimeLoc = gl.getUniformLocation(this.program, "uTime");

    // Phase-3: Strength is now updated via SettingsManager events; no per-frame polling.

    gl.uniform1i(uTexLoc, 0);
    gl.uniform1f(uStrLoc, this.strength);
    gl.uniform1f(uTimeLoc, time * 0.001);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (this.perf) {
      const dur = performance.now() - this.frameStart;
      this.perf.shouldUpdate("aberration", 500) &&
        this.perf.endTiming("AberrationCanvas", this.frameStart);
      if (dur > 0.5) {
        console.warn(
          `[AberrationCanvas] Frame ${dur.toFixed(2)} ms exceeds 0.5 ms budget`
        );
      }
    }

    // TODO[Year3000-Phase1]: Remove self-rescheduling now that MasterAnimationCoordinator drives the loop.
    // Leaving this line commented to keep fallback option until fully migrated.
    // this.rafId = requestAnimationFrame(this.render.bind(this));
  }

  public destroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.gl) {
      const lose = this.gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    }
    // Remove event listeners
    this.canvas.removeEventListener("webglcontextlost", this._boundContextLost);
    this.canvas.removeEventListener(
      "webglcontextrestored",
      this._boundContextRestored
    );
    this.canvas.remove();
  }

  /**
   * Dynamically adjusts the off-screen buffer resolution. Caller should use
   * powers of two (64–256) to keep GPU happy. Safe to call every time
   * performance mode toggles – texture & buffers are reused.
   */
  public setPixelSize(size: number): void {
    if (size === this.canvas.width) return; // no-op
    this.canvas.width = size;
    this.canvas.height = size;
  }

  // ────────────────────────────────────────────────────────────────
  // Context-loss life-cycle helpers (Phase-5)
  // ────────────────────────────────────────────────────────────────
  private _handleContextLost(e: Event): void {
    e.preventDefault(); // Prevent default context restore so we control timing
    console.warn("[AberrationCanvas] WebGL context lost – waiting for restore");
    this.gl = null;
    this.program = null;
  }

  private _handleContextRestored(): void {
    console.info(
      "[AberrationCanvas] WebGL context restored – re-initializing GL"
    );
    this._initGL();
  }
}

/** Convenience initializer matching NebulaController style. */
export function initializeAberrationCanvas(
  y3k: Year3000System | null = null
): AberrationCanvas | null {
  // Capability & reduced-motion checks
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const capabilityOverall = (y3k as any)?.deviceCapabilityDetector
    ?.deviceCapabilities?.overall as any;
  if (prefersReducedMotion || capabilityOverall === "low") {
    return null;
  }

  // Spotify class names occasionally change; support historical & current ones.
  const SCROLL_NODE_SELECTORS = [
    ".main-view-container__scroll-node", // older builds
    ".main-viewContainer-scrollNode", // dash variant
    ".main-viewContainer__scrollNode", // double-underscore variant (20 24-06)
  ].join(", ");

  const findContainer = (): HTMLElement | null =>
    document.querySelector<HTMLElement>(SCROLL_NODE_SELECTORS);

  let container = findContainer();

  if (!container) {
    // Fallback – wait for DOM insertion
    const observer = new MutationObserver(() => {
      const el = findContainer();
      if (el) {
        container = el;
        new AberrationCanvas(container, y3k); // instantiate once found
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    console.warn(
      "[AberrationCanvas] Scroll-node not found yet – will attach when available"
    );
    return null; // early return; effect will attach asynchronously
  }

  const inst = new AberrationCanvas(container, y3k);
  // Initial strength from CSS variable if available
  const cssStrength = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--sn-nebula-aberration-strength");
  const parsed = parseFloat(cssStrength);
  if (!isNaN(parsed)) inst.setStrength(parsed);
  return inst;
}
