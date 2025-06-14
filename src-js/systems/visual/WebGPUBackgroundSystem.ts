import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { SettingsManager } from "@/managers/SettingsManager";
import { MusicSyncService } from "@/services/MusicSyncService";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as Utils from "@/utils/Year3000Utilities";

/**
 * WebGPUBackgroundSystem (Phase-1 scaffold)
 * -----------------------------------------
 * Creates a transparent <canvas> element and initialises a minimal WebGPU
 * render-loop that paints a procedurally-generated nebula. The shader is kept
 * trivial (RGB noise) for now – future phases will extend it. The canvas is
 * only attached when:
 *   • Artistic mode === "cosmic-maximum"
 *   • Settings key `sn-enable-webgpu` === "true"
 *   • The browser supports WebGPU (navigator.gpu defined)
 * All failure paths gracefully fall back to doing nothing.
 */
export class WebGPUBackgroundSystem implements IManagedSystem {
  public initialized = false;
  private _canvas: HTMLCanvasElement | null = null;
  private _device: GPUDevice | null = null;
  private _ctx: GPUCanvasContext | null = null;
  private _animationFrame: number | null = null;
  private _uniformBuffer: GPUBuffer | null = null;
  private _bindGroup: GPUBindGroup | null = null;
  private _frame: number = 0;
  private _pipeline: GPURenderPipeline | null = null;

  // Helper caches
  private _primary: [number, number, number] = [0.5, 0.4, 0.9];
  private _secondary: [number, number, number] = [0.35, 0.35, 0.75];
  private _accent: [number, number, number] = [0.3, 0.55, 0.9];
  private _energy = 0.5;
  private _valence = 0.5;

  constructor(
    private config: Year3000Config,
    private utils: typeof Utils,
    private performanceAnalyzer: PerformanceAnalyzer,
    private musicSyncService: MusicSyncService,
    private settingsManager: SettingsManager,
    private rootSystem: any // Year3000System reference for future hooks
  ) {}

  // ---------------------------------------------------------------------------
  // IManagedSystem lifecycle
  // ---------------------------------------------------------------------------
  public async initialize(): Promise<void> {
    if (!this._shouldActivate()) {
      // Leave initialized=false so SystemHealthMonitor can mark as skipped.
      return;
    }

    try {
      await this._initWebGPU();
      this._startRenderLoop();
      this.initialized = true;
    } catch (err) {
      console.warn("[WebGPUBackgroundSystem] Initialization failed", err);
      this.initialized = false;
      this.destroy();
    }
  }

  public updateAnimation(_deltaMs: number): void {
    // No per-frame CPU work required; GPU loop handles drawing. Kept for API.
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    return {
      ok: this.initialized,
      details: this.initialized
        ? "WebGPU canvas active"
        : "WebGPU background inactive or failed to initialise",
    };
  }

  public destroy(): void {
    if (this._animationFrame !== null) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
    if (this._canvas && this._canvas.parentElement) {
      this._canvas.parentElement.removeChild(this._canvas);
    }
    this._device = null;
    this._ctx = null;
    this._canvas = null;
    this.initialized = false;
    if (this.config.enableDebug) {
      console.log("[WebGPUBackgroundSystem] Destroyed");
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------
  private _shouldActivate(): boolean {
    const webgpuSetting = this.settingsManager.get("sn-enable-webgpu");
    return (
      webgpuSetting === "true" &&
      typeof navigator !== "undefined" &&
      (navigator as any).gpu
    );
  }

  private async _initWebGPU(): Promise<void> {
    const adapter = await (navigator as any).gpu.requestAdapter();
    if (!adapter) throw new Error("GPU adapter unavailable");
    const device = await adapter.requestDevice();
    this._device = device;

    // Canvas setup
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "-1"; // behind all content
    canvas.id = "sn-webgpu-nebula";
    document.body.appendChild(canvas);
    this._canvas = canvas;

    const ctx = canvas.getContext("webgpu") as unknown as GPUCanvasContext;
    if (!ctx) throw new Error("Failed to get WebGPU context");
    this._ctx = ctx;

    const format = (navigator as any).gpu.getPreferredCanvasFormat();
    ctx.configure({
      device,
      format,
      alphaMode: "premultiplied",
    });

    // Create minimalist shader pipeline (single full-screen triangle)
    const shaderModule = device.createShaderModule({
      code: `@fragment fn fs_main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
        // Simple time-based RGB noise placeholder
        let r = fract(sin(dot(pos.xy, vec2<f32>(12.9898,78.233))) * 43758.5453);
        let g = fract(sin(dot(pos.xy, vec2<f32>(93.9898,67.345))) * 24634.6345);
        let b = fract(sin(dot(pos.xy, vec2<f32>(45.1131,98.245))) * 31415.9265);
        return vec4<f32>(r, g, b, 0.14);
      }
      @vertex fn vs_main(@builtin(vertex_index) idx : u32) -> @builtin(position) vec4<f32> {
        var pos = array<vec2<f32>, 3>(vec2<f32>(-1.0, -1.0), vec2<f32>(3.0, -1.0), vec2<f32>(-1.0, 3.0));
        return vec4<f32>(pos[idx], 0.0, 1.0);
      }`,
    });

    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: { module: shaderModule, entryPoint: "vs_main" },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_main",
        targets: [{ format }],
      },
      primitive: { topology: "triangle-list" },
    });

    // 👉 NEW: uniform buffer & bind group
    // 4 vec4<f32> = 64 bytes
    const uniformBuffer = device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroupLayout = pipeline.getBindGroupLayout(0);
    const bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    this._pipeline = pipeline;
    this._uniformBuffer = uniformBuffer;
    this._bindGroup = bindGroup;
  }

  private _startRenderLoop(): void {
    const render = (time: number) => {
      if (!this._device || !this._ctx || !this._pipeline) return;

      // Update theme colours occasionally (every 30 frames ~0.5s @60fps)
      if (this._frame % 30 === 0) {
        this._refreshThemeColors();
      }
      this._frame++;

      // Write uniform data
      const uni = new Float32Array(16);
      uni.set([this._primary[0], this._primary[1], this._primary[2], 1]);
      uni.set(
        [this._secondary[0], this._secondary[1], this._secondary[2], 1],
        4
      );
      uni.set([this._accent[0], this._accent[1], this._accent[2], 1], 8);
      uni.set([time * 0.001, this._energy, this._valence, 0], 12);
      // @ts-ignore experimental API & potential undefined
      (this._device as any).queue.writeBuffer(
        this._uniformBuffer as any,
        0,
        uni.buffer
      );

      // Render pass
      // @ts-ignore WebGPU types & potential undefined
      const encoder = (this._device as any).createCommandEncoder();
      // @ts-ignore WebGPU types & potential undefined
      const textureView = (this._ctx as any).getCurrentTexture().createView();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: textureView,
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });
      pass.setPipeline(this._pipeline);
      pass.setBindGroup(0, this._bindGroup as any);
      pass.draw(3);
      pass.end();
      // @ts-ignore WebGPU types
      (this._device as any).queue.submit([encoder.finish()]);

      this._animationFrame = requestAnimationFrame(render);
    };
    this._animationFrame = requestAnimationFrame(render);
  }

  private _refreshThemeColors(): void {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const parseRgb = (v: string): [number, number, number] | null => {
      const parts = v
        .trim()
        .split(/\s*,\s*/)
        .map(Number);
      if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
        return [parts[0]! / 255, parts[1]! / 255, parts[2]! / 255];
      }
      return null;
    };
    const p = parseRgb(styles.getPropertyValue("--sn-gradient-primary-rgb"));
    const s = parseRgb(styles.getPropertyValue("--sn-gradient-secondary-rgb"));
    const a = parseRgb(styles.getPropertyValue("--sn-gradient-accent-rgb"));
    if (p) this._primary = p;
    if (s) this._secondary = s;
    if (a) this._accent = a;

    const energyVar = parseFloat(
      styles.getPropertyValue("--sn-harmony-energy") || "0.5"
    );
    const valenceVar = parseFloat(
      styles.getPropertyValue("--sn-harmony-valence") || "0.5"
    );
    if (!isNaN(energyVar)) this._energy = energyVar;
    if (!isNaN(valenceVar)) this._valence = valenceVar;
  }
}

// Temporary ambient declarations for TypeScript when lib.dom.webgpu not enabled
// @ts-ignore
declare type GPUBuffer = any;
// @ts-ignore
declare type GPUBindGroup = any;
// @ts-ignore
declare type GPURenderPipeline = any;
// @ts-ignore
declare const GPUBufferUsage: any;
