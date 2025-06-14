import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { SettingsManager } from "@/managers/SettingsManager";
import { MusicSyncService } from "@/services/MusicSyncService";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as Utils from "@/utils/Year3000Utilities";

interface Particle {
  x: number;
  y: number;
  baseSize: number;
  pulse: number;
  speedX: number;
  speedY: number;
}

/**
 * ParticleFieldSystem – Phase-2 beat-synced starfield.
 * Lightweight Canvas-2D implementation to avoid heavy dependencies. Roughly
 * 300 particles animate slowly; every detected beat triggers a size pulse and
 * slight drift to give a breathing effect. Respects prefers-reduced-motion.
 */
export class ParticleFieldSystem implements IManagedSystem {
  public initialized = false;
  private _canvas: HTMLCanvasElement | null = null;
  private _ctx: CanvasRenderingContext2D | null = null;
  private _particles: Particle[] = [];
  private _animationFrame: number | null = null;
  private _pulseStrength = 0;

  constructor(
    private config: Year3000Config,
    private utils: typeof Utils,
    private performanceAnalyzer: PerformanceAnalyzer,
    private musicSyncService: MusicSyncService,
    private settingsManager: SettingsManager,
    private rootSystem: any // Year3000System ref
  ) {}

  // ───────────────────────────── IManagedSystem ──────────────────────────────
  async initialize(): Promise<void> {
    // Only active in cosmic-maximum
    if (this.config.artisticMode !== "cosmic-maximum") return;

    // Motion pref check
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      this.settingsManager.get("sn-3d-effects-level") === "disabled"
    ) {
      return;
    }

    this._setupCanvas();
    this._createParticles(300);
    this._startLoop();

    // Subscribe to MusicSyncService updates
    this.musicSyncService.subscribe(this as any, "ParticleFieldSystem");

    this.initialized = true;
  }

  updateAnimation(_delta: number): void {
    // rendering handled in RAF loop
  }

  async healthCheck(): Promise<HealthCheckResult> {
    return { ok: this.initialized, details: "Particle field running" };
  }

  destroy(): void {
    if (this._animationFrame) cancelAnimationFrame(this._animationFrame);
    this.musicSyncService.unsubscribe("ParticleFieldSystem");
    if (this._canvas && this._canvas.parentElement) {
      this._canvas.parentElement.removeChild(this._canvas);
    }
    this._particles = [];
    this.initialized = false;
  }

  // ───────────────────────── MusicSyncSubscriber API ─────────────────────────
  updateFromMusicAnalysis(processedData: any): void {
    if (processedData?.beatOccurred) {
      this._pulseStrength = Math.min(1, processedData.energy || 0.5) * 3;
    }
  }

  // ───────────────────────────────── helpers ─────────────────────────────────
  private _setupCanvas(): void {
    const canvas = document.createElement("canvas");
    canvas.id = "sn-particle-field";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "-1";
    document.body.appendChild(canvas);
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
    this._resize();
    window.addEventListener("resize", this._resize.bind(this));
  }

  private _resize(): void {
    if (!this._canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = window.innerWidth * dpr;
    this._canvas.height = window.innerHeight * dpr;
    this._ctx?.scale(dpr, dpr);
  }

  private _createParticles(count: number): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      this._particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseSize: Math.random() * 1.5 + 0.5,
        pulse: 0,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
      });
    }
  }

  private _startLoop(): void {
    const tick = () => {
      this._step();
      this._animationFrame = requestAnimationFrame(tick);
    };
    this._animationFrame = requestAnimationFrame(tick);
  }

  private _step(): void {
    const ctx = this._ctx;
    if (!ctx || !this._canvas) return;

    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // Fade global pulse strength
    this._pulseStrength *= 0.93;

    for (const p of this._particles) {
      // Movement
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x += window.innerWidth;
      if (p.x > window.innerWidth) p.x -= window.innerWidth;
      if (p.y < 0) p.y += window.innerHeight;
      if (p.y > window.innerHeight) p.y -= window.innerHeight;

      // Draw
      const size = p.baseSize + p.pulse;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
      gradient.addColorStop(0, "rgba(255,255,255,0.8)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Update pulse decay
      p.pulse *= 0.9;

      // Inject new pulse from global
      if (this._pulseStrength > 0.1) {
        p.pulse += this._pulseStrength * 0.1 * Math.random();
      }
    }
  }
}
