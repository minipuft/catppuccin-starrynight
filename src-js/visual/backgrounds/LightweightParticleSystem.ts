import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { Year3000System } from "@/core/lifecycle/year3000System";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import type { Year3000Config } from "@/types/models";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  opacity: number;
  radius: number;
  color: string;
  currentX: number;
  currentY: number;
  currentSize: number;
  currentOpacity: number;
  currentRotation: number;
  targetX: number;
  targetY: number;
  targetSize: number;
  targetOpacity: number;
  targetRotation: number;
  baseSize: number;
  baseOpacity: number;
  vr: number;
}

export class LightweightParticleSystem extends BaseVisualSystem {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particlePool: Partial<Particle>[] = [];
  private maxParticles: number;
  private lastSpawnTime: number = 0;
  private spawnCooldown: number = 80;
  private year3000System: Year3000System | null;
  
  // LERP smoothing half-life values (in seconds) for framerate-independent particle animation
  private lerpHalfLifeValues = {
    position: 0.15,    // Fast position response for fluid movement
    size: 0.20,        // Moderate size transitions for smooth scaling
    opacity: 0.25,     // Gradual opacity changes for natural fading
    rotation: 0.18     // Quick rotation response for organic motion
  };

  constructor(
    config: Year3000Config,
    utils: typeof Year3000Utilities,
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService,
    settingsManager: SettingsManager,
    year3000System: Year3000System | null = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    this.year3000System = year3000System;
    this.maxParticles =
      (this.currentPerformanceProfile as any)?.maxParticles || 75;
  }

  override async initialize() {
    await super.initialize();
    this.createCanvas();
    this.initializeParticlePool();
    this._updateParticleSettingsFromProfile();
    this.startRenderLoop();
  }

  _updateParticleSettingsFromProfile() {
    this.maxParticles =
      (this.currentPerformanceProfile as any)?.maxParticles || 75;
  }

  createCanvas() {
    this.canvas = this._createCanvasElement("sn-particle-canvas", 3, "screen");
    this.ctx = this.canvas.getContext("2d");
  }

  initializeParticlePool() {
    this.particlePool = [];
    for (let i = 0; i < this.maxParticles * 2; i++) {
      this.particlePool.push({ active: false });
    }
  }

  startRenderLoop() {
    // Animation registration is now handled automatically by BaseVisualSystem
    // during initialization. This method is kept for any additional setup.
    if (this.config.enableDebug) {
      console.log(
        `[${this.systemName}] Render loop setup complete - using unified onAnimate hook`
      );
    }
  }

  spawnParticle(
    energy: number,
    intensity: number,
    speedFactor: number,
    mood: string
  ) {
    const particle = this.particlePool.find((p) => !p.active) as
      | Particle
      | undefined;
    if (!particle || !this.canvas) return;

    const rootStyle = window.getComputedStyle(Year3000Utilities.getRootStyle());

    const accentRgbStr =
      rootStyle.getPropertyValue("--sn-accent-rgb").trim() ||
      rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
      "202,158,230";

    // Use primary gradient colour when available (legacy). Otherwise fall back
    // to the canonical accent so particle palette remains coherent.
    const primaryRgbStr =
      rootStyle.getPropertyValue("--sn-gradient-primary-rgb").trim() ||
      accentRgbStr;

    particle.active = true;
    // Initialize current and target positions
    particle.currentX = Math.random() * this.canvas.width;
    particle.currentY = this.canvas.height + Math.random() * 30 + 20;
    particle.targetX = particle.currentX; // Start with no movement target
    particle.targetY = particle.currentY;
    
    // Velocity for physics-based movement
    particle.vx = (Math.random() - 0.5) * 3 * (speedFactor || 1);
    particle.vy =
      -(1.5 + Math.random() * 2.5 + energy * 3) * (speedFactor || 1);
    particle.maxLife = 2500 + Math.random() * 3500 * intensity;
    particle.life = particle.maxLife;
    
    // Initialize size with LERP targets - start small and grow
    particle.baseSize = 1.5 + Math.random() * 2.5 + intensity * 2.5;
    particle.currentSize = 0;
    particle.targetSize = particle.baseSize;
    
    // Initialize opacity with LERP targets - fade in smoothly
    particle.baseOpacity = 0.4 + Math.random() * 0.5;
    particle.currentOpacity = 0;
    particle.targetOpacity = particle.baseOpacity;
    const baseColor =
      (mood && mood.includes("happy")) || Math.random() > 0.6
        ? primaryRgbStr
        : accentRgbStr;
    particle.color = `rgba(${baseColor},1)`;
    
    // Initialize rotation with LERP targets
    particle.currentRotation = Math.random() * Math.PI * 2;
    particle.targetRotation = particle.currentRotation;
    particle.vr = (Math.random() - 0.5) * 0.08 * (speedFactor || 1);
  }

  /**
   * Per-frame callback from the MasterAnimationCoordinator. Delegates to the
   * established `updateAnimation` pathway so that particle rendering continues
   * to obey the existing logic – including potential fallback loops created
   * earlier in the system's lifecycle.
   *
   * @param deltaMs   Milliseconds elapsed since the previous frame.
   */
  public override onAnimate(deltaMs: number): void {
    if (!this.initialized) return;

    this.updateAnimation(performance.now(), deltaMs);
  }

  public override updateAnimation(timestamp: number, deltaTime: number) {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const deltaTimeSeconds = deltaTime / 1000;

    for (const p of this.particlePool) {
      const particle = p as Particle;
      if (!particle.active) continue;

      particle.life -= deltaTime;
      if (particle.life <= 0) {
        particle.active = false;
        continue;
      }

      // Update target positions based on physics
      particle.targetX += particle.vx * (deltaTime / 16);
      particle.targetY += particle.vy * (deltaTime / 16);
      particle.targetRotation += particle.vr * (deltaTime / 16);
      
      // Apply LERP smoothing for framerate-independent particle movement
      particle.currentX = Year3000Utilities.lerpSmooth(
        particle.currentX,
        particle.targetX,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.position
      );
      
      particle.currentY = Year3000Utilities.lerpSmooth(
        particle.currentY,
        particle.targetY,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.position
      );
      
      particle.currentRotation = Year3000Utilities.lerpSmooth(
        particle.currentRotation,
        particle.targetRotation,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.rotation
      );

      // Calculate life-based opacity and size factors
      const lifeRatio = particle.life / particle.maxLife;
      const fadeInDuration = 0.2;
      const fadeOutDuration = 0.5;
      let opacityFactor = 1;

      if (lifeRatio > 1 - fadeInDuration) {
        opacityFactor = (1 - lifeRatio) / fadeInDuration;
      } else if (lifeRatio < fadeOutDuration) {
        opacityFactor = lifeRatio / fadeOutDuration;
      }

      // Update target values for LERP smoothing
      particle.targetOpacity = particle.baseOpacity * opacityFactor;
      particle.targetSize = particle.baseSize * opacityFactor;
      
      // Apply LERP smoothing for size and opacity transitions
      particle.currentOpacity = Year3000Utilities.lerpSmooth(
        particle.currentOpacity,
        particle.targetOpacity,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.opacity
      );
      
      particle.currentSize = Year3000Utilities.lerpSmooth(
        particle.currentSize,
        particle.targetSize,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.size
      );

      this.ctx.save();
      this.ctx.translate(particle.currentX, particle.currentY);
      this.ctx.rotate(particle.currentRotation);
      this.ctx.fillStyle = particle.color.replace(
        "1)",
        `${particle.currentOpacity})`
      );
      this.ctx.beginPath();
      this.ctx.arc(0, 0, particle.currentSize, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  // --------------------------------------------------------------------
  // Central settings responder – adjust particle counts or reset pools
  // --------------------------------------------------------------------
  public override applyUpdatedSettings?(key: string, value: any): void {
    // Star density drives particle count
    if (key === "sn-star-density") {
      const mapping: Record<string, number> = {
        disabled: 0,
        minimal: 40,
        balanced: 75,
        intense: 120,
      } as const;

      const desired =
        mapping[value as keyof typeof mapping] ?? this.maxParticles;
      if (desired !== this.maxParticles) {
        this.maxParticles = desired;
        this.initializeParticlePool();
      }
    }
  }
}
