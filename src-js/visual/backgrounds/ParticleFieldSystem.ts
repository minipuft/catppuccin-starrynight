import { MusicSyncService } from "@/audio/MusicSyncService";
import type {
  FrameContext,
  IVisualSystem,
} from "@/core/animation/EnhancedMasterAnimationCoordinator";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import * as Utils from "@/utils/core/Year3000Utilities";

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
export class ParticleFieldSystem implements IManagedSystem, IVisualSystem {
  public initialized = false;
  private _canvas: HTMLCanvasElement | null = null;
  private _ctx: CanvasRenderingContext2D | null = null;
  private _particles: Particle[] = [];
  private _animationFrame: number | null = null;
  /** Whether we spawned our own requestAnimationFrame loop (fallback for standalone usage). */
  private _ownsRAF = false;

  /** Cached performance flag so we don\'t call shouldReduceQuality() every particle. */
  private _lowQualityMode = false;
  private _pulseStrength = 0;
  // Stores the resize handler reference for proper cleanup.
  private _boundResizeHandler: (() => void) | null = null;

  public readonly systemName = "ParticleFieldSystem";

  constructor(
    private config: Year3000Config,
    private utils: typeof Utils,
    private performanceAnalyzer: PerformanceAnalyzer,
    private musicSyncService: MusicSyncService,
    private settingsManager: SettingsManager,
    private rootSystem: any // Year3000System ref
  ) {}
  forceRepaint?(reason?: string): void {
    throw new Error("Method not implemented.");
  }

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

    // Determine particle density based on quality heuristics
    const particleCount = this._getParticleCount();
    this._createParticles(particleCount);

    // If no MasterAnimationCoordinator is present (stand-alone testing) we fall back
    // to our own rAF loop. In normal Year3000 usage the coordinator will invoke
    // onAnimate() after we get registered in Year3000System._refreshConditionalSystems.
    const hasMAC = !!(
      this.rootSystem && (this.rootSystem as any).masterAnimationCoordinator
    );

    if (!hasMAC) {
      this._startLoop();
      this._ownsRAF = true;
    }

    // Subscribe to MusicSyncService updates
    this.musicSyncService.subscribe(this as any, "ParticleFieldSystem");

    this.initialized = true;

    // Register with CDF VisualSystemRegistry when available.
    if ((this.rootSystem as any)?.registerVisualSystem) {
      (this.rootSystem as any).registerVisualSystem(this, "background");
    }
  }

  updateAnimation(_delta: number): void {
    // rendering handled in RAF loop (legacy path)
  }

  async healthCheck(): Promise<HealthCheckResult> {
    return { 
      healthy: this.initialized,
      ok: this.initialized, 
      details: "Particle field running",
      issues: this.initialized ? [] : ['System not initialized'],
      system: 'ParticleFieldSystem'
    };
  }

  destroy(): void {
    if (this._animationFrame) cancelAnimationFrame(this._animationFrame);
    this._ownsRAF = false;
    this.musicSyncService.unsubscribe("ParticleFieldSystem");
    if (this._canvas && this._canvas.parentElement) {
      this._canvas.parentElement.removeChild(this._canvas);
    }
    if (this._boundResizeHandler) {
      window.removeEventListener("resize", this._boundResizeHandler);
      this._boundResizeHandler = null;
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
    this._boundResizeHandler = this._resize.bind(this);
    window.addEventListener("resize", this._boundResizeHandler);
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

    // Evaluate quality flag once per frame.
    this._lowQualityMode =
      this.performanceAnalyzer.shouldReduceQuality() ||
      PerformanceAnalyzer.isLowEndDevice();

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

      if (this._lowQualityMode) {
        // Lightweight draw path – solid circle with global alpha.
        ctx.fillStyle = "rgba(255,255,255,0.75)";
      } else {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, "rgba(255,255,255,0.8)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
      }
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

  // -----------------------------------------------------------------------
  // VisualSystemRegistry hook – use registry cadence when available
  // -----------------------------------------------------------------------
  public onAnimate(_delta: number, _context: FrameContext): void {
    if (this._ownsRAF) return; // avoid duplicate renders
    this._step();
  }

  public onPerformanceModeChange?(mode: "performance" | "quality"): void {
    // Reduce particle count or effects in performance mode (future work)
  }

  // Helper to compute particle count based on performance mode
  private _getParticleCount(): number {
    if (
      this.performanceAnalyzer.shouldReduceQuality() ||
      PerformanceAnalyzer.isLowEndDevice()
    ) {
      return 180; // low quality
    }
    return 300; // default
  }
}
