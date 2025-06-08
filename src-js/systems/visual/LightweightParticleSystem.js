import { Year3000Utilities } from "../../utils/Year3000Utilities.js";
import { BaseVisualSystem } from "../BaseVisualSystem.js";

export class LightweightParticleSystem extends BaseVisualSystem {
  constructor(
    config,
    utils,
    performanceMonitor,
    musicSyncService,
    settingsManager,
    year3000System = null // PERFORMANCE OPTIMIZATION: Master Animation Coordinator access
  ) {
    super(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System
    );

    // === PERFORMANCE OPTIMIZATION: Store reference to Year3000System ===
    this.year3000System = year3000System;

    this.canvas = null;
    this.ctx = null;
    this.particlePool = [];

    if (this.config?.enableDebug) {
      console.log(
        `[${this.systemName} Constructor] Config after super():`,
        JSON.parse(JSON.stringify(this.config))
      );
    }

    this.maxParticles =
      this.config?.performanceProfiles?.balanced?.maxParticles || 75;
    this.animationId = null;
    this.lastSpawnTime = 0;
    this.spawnCooldown = 80;
    this.lastFrameTime = performance.now();
    this.particleHalfLife = 0.08;
    this.boundResizeCanvas = this.resizeCanvas.bind(this);

    // === PERFORMANCE OPTIMIZATION: Animation coordinator support ===
    this._animationRegistered = false;
    this._performanceMode = "auto";
    this._frameSkipCounter = 0;
    this._maxFrameSkip = 2; // Skip every 3rd frame in performance mode

    if (this.config?.enableDebug) {
      console.log(
        `[${this.systemName}] Constructor called with Master Animation Coordinator support. Initial max particles (from balanced profile or default): ${this.maxParticles}`
      );
    }
  }

  async initialize() {
    await super.initialize();
    this.createCanvas();
    this.initializeParticlePool();
    this._updateParticleSettingsFromProfile();
    this.lastFrameTime = performance.now();
    this.startRenderLoop();
    if (this.config?.enableDebug) {
      console.log(`[${this.systemName}] Initialized and render loop started.`);
    }
  }

  _applyPerformanceProfile(quality) {
    super._applyPerformanceProfile(quality);
    this._updateParticleSettingsFromProfile();
    if (this.config?.enableDebug) {
      console.log(
        `[${this.systemName}] Overridden _applyPerformanceProfile. Max particles now: ${this.maxParticles}`
      );
    }
  }

  _updateParticleSettingsFromProfile() {
    if (
      this.currentPerformanceProfile &&
      this.currentPerformanceProfile.maxParticles
    ) {
      this.maxParticles = this.currentPerformanceProfile.maxParticles;
    } else {
      this.maxParticles =
        this.config?.performanceProfiles?.balanced?.maxParticles || 75;
    }
  }

  createCanvas() {
    this.canvas = this._createCanvasElement("sn-particle-canvas", 3, "screen");
    this.ctx = this.canvas.getContext("2d");
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  initializeParticlePool() {
    this.particlePool = [];
    for (let i = 0; i < this.maxParticles * 2; i++) {
      this.particlePool.push({
        active: false,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        targetRotation: 0,
        vr: 0,
        currentX: 0,
        currentY: 0,
        currentSize: 0,
        currentOpacity: 0,
        currentRotation: 0,
        targetSize: 1,
        targetOpacity: 0,
        baseSize: 1,
        baseOpacity: 0.5,
        life: 0,
        maxLife: 1000,
        color: "rgba(255,255,255,0.5)",
      });
    }
  }

  updateFromMusicAnalysis(processedMusicData) {
    if (!this.isInitialized || !processedMusicData) return;
    const currentTime = performance.now();
    const {
      processedEnergy,
      visualIntensity,
      animationSpeedFactor,
      moodIdentifier,
    } = processedMusicData;

    const dynamicSpawnCooldown = Math.max(
      50,
      this.spawnCooldown / (animationSpeedFactor || 1)
    );

    if (
      processedEnergy > 0.45 &&
      visualIntensity > 0.3 &&
      currentTime - this.lastSpawnTime > dynamicSpawnCooldown
    ) {
      const numToSpawn = Math.max(
        1,
        Math.floor(visualIntensity * 5 + processedEnergy * 3)
      );
      for (let i = 0; i < numToSpawn; i++) {
        if (
          this.particlePool.filter((p) => p.active).length < this.maxParticles
        ) {
          this.spawnParticle(
            processedEnergy,
            visualIntensity,
            animationSpeedFactor,
            moodIdentifier
          );
        } else {
          if (this.config.YEAR3000_CONFIG.enableDebug && Math.random() < 0.1) {
            // console.log(`[${this.systemName}] Max particles reached, skipping spawn.`);
          }
          break;
        }
      }
      this.lastSpawnTime = currentTime;
    }
  }

  spawnParticle(energy, intensity, speedFactor, mood) {
    const particle = this.particlePool.find((p) => !p.active);
    if (!particle) return;

    const rootStyle = Year3000Utilities.getRootStyle();
    const primaryRgbStr =
      rootStyle.getPropertyValue("--sn-gradient-primary-rgb").trim() ||
      "202,158,230";
    const accentRgbStr =
      rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
      "140,170,238";

    particle.active = true;

    particle.currentX = Math.random() * this.canvas.width;
    particle.currentY = this.canvas.height + Math.random() * 30 + 20;
    particle.targetX = particle.currentX;
    particle.targetY = particle.currentY;

    particle.vx = (Math.random() - 0.5) * 3 * (speedFactor || 1);
    particle.vy =
      -(1.5 + Math.random() * 2.5 + energy * 3) * (speedFactor || 1);

    particle.maxLife = 2500 + Math.random() * 3500 * intensity;
    particle.life = particle.maxLife;

    particle.baseSize = 1.5 + Math.random() * 2.5 + intensity * 2.5;
    particle.currentSize = 0;
    particle.targetSize = particle.baseSize;

    particle.baseOpacity = 0.4 + Math.random() * 0.5;
    particle.currentOpacity = 0;
    particle.targetOpacity = particle.baseOpacity;

    const baseColor =
      (mood && mood.includes("happy")) || Math.random() > 0.6
        ? primaryRgbStr
        : accentRgbStr;
    particle.color = `rgba(${baseColor},1)`;

    particle.currentRotation = Math.random() * Math.PI * 2;
    particle.targetRotation = particle.currentRotation;
    particle.vr = (Math.random() - 0.5) * 0.08 * (speedFactor || 1);
  }

  startRenderLoop() {
    // === PERFORMANCE OPTIMIZATION: Register with Master Animation Coordinator ===
    if (this.year3000System && this.year3000System.registerAnimationSystem) {
      this.year3000System.registerAnimationSystem(
        "LightweightParticleSystem",
        this,
        "background", // Background priority for particle effects
        30 // 30fps target for particles (lower than critical systems)
      );

      this._animationRegistered = true;

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Registered with Master Animation Coordinator (background priority, 30fps)`
        );
      }
    } else {
      // Fallback to original self-managed loop if Master Animation Coordinator not available
      this._startSelfManagedLoop();

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Using fallback self-managed animation loop`
        );
      }
    }
  }

  /**
   * PERFORMANCE OPTIMIZATION: Animation update method for Master Animation Coordinator
   * Called by the master coordinator with controlled timing
   * @param {number} timestamp - Current timestamp
   * @param {number} deltaTime - Time since last frame
   */
  updateAnimation(timestamp, deltaTime) {
    if (!this.isInitialized || !this.canvas || !this.ctx) {
      return;
    }

    // Frame skipping for performance mode
    if (this._performanceMode === "performance") {
      this._frameSkipCounter++;
      if (this._frameSkipCounter < this._maxFrameSkip) {
        return; // Skip this frame
      }
      this._frameSkipCounter = 0;
    }

    // Convert deltaTime from ms to seconds for consistency
    const deltaSeconds = deltaTime / 1000;
    this.lastFrameTime = timestamp;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeParticleCount = 0;

    this.particlePool.forEach((p) => {
      if (p.active) {
        activeParticleCount++;

        p.life -= deltaSeconds * 1000;
        if (p.life <= 0) {
          p.active = false;
          p.currentOpacity = 0;
          return;
        }

        p.targetX += p.vx * deltaSeconds * 60;
        p.targetY += p.vy * deltaSeconds * 60;
        p.vy += 0.035 * (p.baseSize / 2) * deltaSeconds * 60;
        p.targetRotation += p.vr * deltaSeconds * 60;

        p.currentX = Year3000Utilities.lerpSmooth(
          p.currentX,
          p.targetX,
          deltaSeconds,
          this.particleHalfLife
        );
        p.currentY = Year3000Utilities.lerpSmooth(
          p.currentY,
          p.targetY,
          deltaSeconds,
          this.particleHalfLife
        );
        p.currentRotation = Year3000Utilities.lerpSmooth(
          p.currentRotation,
          p.targetRotation,
          deltaSeconds,
          this.particleHalfLife
        );

        const lifeRatio = Math.max(0, p.life / p.maxLife);
        p.targetSize = p.baseSize * (lifeRatio * 0.8 + 0.2);
        p.targetOpacity = p.baseOpacity * lifeRatio;

        p.currentSize = Year3000Utilities.lerpSmooth(
          p.currentSize,
          p.targetSize,
          deltaSeconds,
          this.particleHalfLife * 0.8
        );
        p.currentOpacity = Year3000Utilities.lerpSmooth(
          p.currentOpacity,
          p.targetOpacity,
          deltaSeconds,
          this.particleHalfLife * 0.8
        );

        if (p.currentOpacity > 0.01 && p.currentSize > 0.1) {
          this.ctx.save();
          this.ctx.translate(p.currentX, p.currentY);
          this.ctx.rotate(p.currentRotation);
          this.ctx.beginPath();
          this.ctx.arc(0, 0, Math.max(0, p.currentSize / 2), 0, Math.PI * 2);
          this.ctx.fillStyle = p.color.replace(
            /,\s*\d+(\.\d+)?\)/,
            `,${Math.max(0, Math.min(1, p.currentOpacity)).toFixed(3)})`
          );
          this.ctx.fill();
          this.ctx.restore();
        }
      }
    });

    // Performance monitoring - log occasionally if many particles
    if (
      this.config?.enableDebug &&
      activeParticleCount > this.maxParticles * 0.8 &&
      Math.random() < 0.01
    ) {
      console.log(
        `✨ [${this.systemName}] High particle load: ${activeParticleCount}/${this.maxParticles}`
      );
    }
  }

  /**
   * PERFORMANCE OPTIMIZATION: Handle performance mode changes from Master Animation Coordinator
   * @param {string} mode - Performance mode: 'performance' or 'quality'
   */
  onPerformanceModeChange(mode) {
    this._performanceMode = mode;

    if (mode === "performance") {
      // Reduce particle count and effects for better performance
      this.maxParticles = Math.floor(this.maxParticles * 0.6);
      this.spawnCooldown = Math.max(this.spawnCooldown * 1.5, 120);
      this._maxFrameSkip = 3; // Skip more frames
    } else {
      // Restore full quality
      this._updateParticleSettingsFromProfile(); // Restore original settings
      this._maxFrameSkip = 2; // Less frame skipping
    }

    if (this.config?.enableDebug) {
      console.log(
        `⚡ [${this.systemName}] Performance mode changed to: ${mode}, max particles: ${this.maxParticles}`
      );
    }
  }

  /**
   * Fallback self-managed animation loop for backward compatibility
   */
  _startSelfManagedLoop() {
    if (this.animationId) {
      this._cancelAnimationFrame(this.animationId);
    }

    const render = (timestamp) => {
      if (!this.isInitialized || !this.canvas || !this.ctx) {
        if (this.animationId) this._cancelAnimationFrame(this.animationId);
        this.animationId = null;
        return;
      }

      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;

      // Use the coordinated update method for consistency
      this.updateAnimation(timestamp, deltaTime);

      if (this.isInitialized) {
        this.animationId = this._requestAnimationFrame(render);
      }
    };

    this.animationId = this._requestAnimationFrame(render);
  }

  // ===== YEAR 3000 MODE CONFIGURATION =====

  /**
   * Update system configuration based on current artistic mode
   * @param {Object} modeConfig - Configuration from artistic mode profile
   */
  updateModeConfiguration(modeConfig) {
    if (!modeConfig) return;

    const { enabled, animations, intensity } = modeConfig;

    if (this.config?.enableDebug) {
      console.log(
        `🎨 [${this.systemName}] Updating mode configuration:`,
        modeConfig
      );
    }

    // Update system state based on mode
    this.modeConfig = {
      systemEnabled: enabled !== false,
      particleAnimationsEnabled: animations || false,
      intensityMultiplier: intensity || 1.0,
    };

    // Update particle system based on mode
    this.updateParticleSystemForMode();
  }

  /**
   * Update particle system behavior based on current mode
   */
  updateParticleSystemForMode() {
    if (!this.modeConfig) return;

    const baseMultiplier = this.modeConfig.intensityMultiplier || 1.0;

    // Adjust particle count based on mode
    if (this.modeConfig.systemEnabled) {
      const modeParticleCount = Math.floor(this.maxParticles * baseMultiplier);
      this.maxParticles = Math.min(modeParticleCount, this.maxParticles * 2); // Cap at 2x base
    } else {
      this.maxParticles = Math.floor(this.maxParticles * 0.3); // Minimal particles
    }

    // Update spawn cooldown based on mode
    this.spawnCooldown = this.modeConfig.particleAnimationsEnabled
      ? Math.max(30, 80 / baseMultiplier)
      : 150; // Faster spawn for active modes

    // Update particle properties
    this.particleHalfLife = this.modeConfig.particleAnimationsEnabled
      ? 0.08 * baseMultiplier
      : 0.04; // Longer life for active modes

    if (this.config?.enableDebug) {
      console.log(
        `✨ [${this.systemName}] Updated for mode - Max particles: ${this.maxParticles}, Spawn cooldown: ${this.spawnCooldown}`
      );
    }
  }

  destroy() {
    // === PERFORMANCE OPTIMIZATION: Unregister from Master Animation Coordinator ===
    if (
      this._animationRegistered &&
      this.year3000System &&
      this.year3000System.unregisterAnimationSystem
    ) {
      this.year3000System.unregisterAnimationSystem(
        "LightweightParticleSystem"
      );
      this._animationRegistered = false;

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Unregistered from Master Animation Coordinator`
        );
      }
    }

    if (this.animationId) {
      this._cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }

    this.ctx = null;
    this.particlePool = [];

    if (this.config?.enableDebug) {
      console.log(`[${this.systemName}] Destroyed and cleaned up.`);
    }
  }
}
