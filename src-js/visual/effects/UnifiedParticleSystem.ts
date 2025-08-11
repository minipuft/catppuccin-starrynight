/**
 * ParticleConsciousnessModule - Unified Particle System with Consciousness Integration
 *
 * Consolidates LightweightParticleSystem and ParticleFieldSystem into a single
 * consciousness-aware particle system that dances organically with the musical flow.
 *
 * Core Philosophy:
 * - "Every particle breathes with the consciousness field"
 * - "Unified rendering eliminates duplicate canvas management and lifecycle logic"
 * - "Organic choreography creates emergent beauty through shared awareness"
 *
 * Architecture:
 * - Unified particle management with adaptive rendering modes
 * - Full BackgroundSystemParticipant integration with consciousness field
 * - Shared canvas management eliminating duplicate code
 * - Performance-aware particle density and quality adaptation
 *
 * @architecture Phase 2.3 Particle Consciousness Integration
 * @target Bundle reduction: 30-40KB through consolidation
 */

import { MusicSyncService } from "@/audio/MusicSyncService";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult } from "@/types/systems";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";
import { BaseVisualSystem } from "../base/BaseVisualSystem";

// Import consciousness integration
import type {
  BackgroundAnimationCoordinator,
  BackgroundSystemParticipant,
  ConsciousnessField,
} from "./BackgroundAnimationCoordinator";
import {
  ChoreographyEventResponder,
  BackgroundEventResponder,
  MusicSyncUtilities,
} from "./SharedBackgroundUtilities";

// ===================================================================
// UNIFIED PARTICLE INTERFACES
// ===================================================================

/**
 * Particle rendering modes supporting both legacy system behaviors
 */
export type ParticleMode = "lightweight" | "field" | "hybrid" | "consciousness";

/**
 * Unified particle interface supporting both lightweight and field particle types
 */
export interface UnifiedParticle {
  // Core properties (shared across all modes)
  active: boolean;
  x: number;
  y: number;
  currentSize: number;
  targetSize: number;
  currentOpacity: number;
  targetOpacity: number;
  life: number;
  maxLife: number;

  // Velocity and movement
  vx: number;
  vy: number;

  // Visual properties
  color: string;
  currentRotation: number;
  targetRotation: number;

  // Mode-specific behavior
  mode: ParticleMode;

  // Lightweight mode properties
  lightweightProps?: {
    baseSize: number;
    baseOpacity: number;
    radius: number;
    vr: number; // rotation velocity
  };

  // Field mode properties
  fieldProps?: {
    baseSize: number;
    pulse: number;
    speedX: number;
    speedY: number;
  };

  // Consciousness integration
  consciousnessResonance: number; // 0-1 how strongly this particle resonates with consciousness field
  organicGrowthPhase: number; // Phase offset for organic growth patterns
  breathingPhase: number; // Phase offset for breathing synchronization
  flowResonance: number; // How much this particle follows musical flow
}

/**
 * Particle system performance configuration
 */
export interface ParticlePerformanceConfig {
  maxParticles: number;
  maxFieldParticles: number;
  renderQuality: "low" | "medium" | "high";
  enableComplexEffects: boolean;
  frameRateTarget: number;
  memoryLimit: number; // MB
}

/**
 * Consciousness-driven particle behavior configuration
 */
export interface ParticleConsciousnessConfig {
  enableOrganicFlow: boolean;
  enableBreathingSynchronization: boolean;
  enableHarmonicResonance: boolean;
  enableCellularGrowth: boolean;
  consciousnessStrength: number; // 0-1 how much consciousness affects particles
  animationTransitionSpeed: number; // Speed of animation transitions
}

// ===================================================================
// SHARED CANVAS MANAGEMENT UTILITIES
// ===================================================================

/**
 * Unified canvas management eliminating duplicate canvas creation/management
 */
class SharedCanvasManager {
  private canvases: Map<string, HTMLCanvasElement> = new Map();
  private contexts: Map<string, CanvasRenderingContext2D> = new Map();
  private resizeHandlers: Map<string, () => void> = new Map();

  /**
   * Get or create a canvas for particle rendering
   */
  public getCanvas(
    id: string,
    zIndex: number = 3,
    mixBlendMode: string = "screen"
  ): HTMLCanvasElement {
    if (this.canvases.has(id)) {
      return this.canvases.get(id)!;
    }

    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = zIndex.toString();
    canvas.style.mixBlendMode = mixBlendMode;

    // Setup device pixel ratio scaling
    this.setupCanvasScaling(canvas);

    // Add to DOM
    document.body.appendChild(canvas);

    // Store canvas and context
    this.canvases.set(id, canvas);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      this.contexts.set(id, ctx);
    }

    // Setup resize handler
    const resizeHandler = () => this.handleResize(id);
    window.addEventListener("resize", resizeHandler);
    this.resizeHandlers.set(id, resizeHandler);

    Y3KDebug?.debug?.log(
      "SharedCanvasManager",
      `Created canvas: ${id} with z-index: ${zIndex}`
    );
    return canvas;
  }

  /**
   * Get canvas rendering context
   */
  public getContext(id: string): CanvasRenderingContext2D | null {
    return this.contexts.get(id) || null;
  }

  /**
   * Setup proper device pixel ratio scaling
   */
  private setupCanvasScaling(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  }

  /**
   * Handle canvas resize
   */
  private handleResize(id: string): void {
    const canvas = this.canvases.get(id);
    if (canvas) {
      this.setupCanvasScaling(canvas);
    }
  }

  /**
   * Clean up canvas and resources
   */
  public removeCanvas(id: string): void {
    const canvas = this.canvases.get(id);
    const resizeHandler = this.resizeHandlers.get(id);

    if (canvas) {
      canvas.remove();
      this.canvases.delete(id);
    }

    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      this.resizeHandlers.delete(id);
    }

    this.contexts.delete(id);

    Y3KDebug?.debug?.log("SharedCanvasManager", `Removed canvas: ${id}`);
  }

  /**
   * Clean up all canvases
   */
  public cleanup(): void {
    for (const id of this.canvases.keys()) {
      this.removeCanvas(id);
    }
  }
}

// ===================================================================
// CONSCIOUSNESS-AWARE PARTICLE RENDERER
// ===================================================================

/**
 * Unified particle renderer with consciousness-driven adaptive rendering
 */
class ConsciousnessParticleRenderer {
  private canvasManager: SharedCanvasManager;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasManager: SharedCanvasManager, canvasId: string) {
    this.canvasManager = canvasManager;
    this.canvas = canvasManager.getCanvas(canvasId, 3, "screen");
    this.ctx = canvasManager.getContext(canvasId)!;
  }

  /**
   * Render particles with consciousness-aware adaptive rendering
   */
  public render(
    particles: UnifiedParticle[],
    consciousnessField: ConsciousnessField | null,
    performanceConfig: ParticlePerformanceConfig
  ): void {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Skip rendering if no particles are active
    const activeParticles = particles.filter((p) => p.active);
    if (activeParticles.length === 0) return;

    // Apply consciousness-driven global effects
    this.applyConsciousnessGlobalEffects(consciousnessField);

    // Render particles based on performance config
    switch (performanceConfig.renderQuality) {
      case "high":
        this.renderHighQuality(activeParticles, consciousnessField);
        break;
      case "medium":
        this.renderMediumQuality(activeParticles, consciousnessField);
        break;
      case "low":
        this.renderLowQuality(activeParticles, consciousnessField);
        break;
    }
  }

  /**
   * Apply global consciousness-driven effects to the canvas
   */
  private applyConsciousnessGlobalEffects(
    field: ConsciousnessField | null
  ): void {
    if (!field || !this.ctx) return;

    // Apply consciousness-driven global alpha modulation
    const breathingAlpha =
      BackgroundEventResponder.calculateBreathingModulation(
        0.9,
        field.breathingCycle,
        0.1
      );
    this.ctx.globalAlpha = breathingAlpha;

    // Apply subtle global transformation based on musical flow
    if (field.musicalFlow.x !== 0 || field.musicalFlow.y !== 0) {
      this.ctx.translate(field.musicalFlow.x * 0.5, field.musicalFlow.y * 0.5);
    }
  }

  /**
   * High quality rendering with all effects
   */
  private renderHighQuality(
    particles: UnifiedParticle[],
    field: ConsciousnessField | null
  ): void {
    if (!this.ctx) return;

    particles.forEach((particle) => {
      this.ctx.save();

      // Position
      this.ctx.translate(particle.x, particle.y);

      // Rotation with consciousness resonance
      if (particle.currentRotation !== 0) {
        const consciousRotation = field
          ? particle.currentRotation +
            field.rhythmicPulse * particle.consciousnessResonance * Math.PI
          : particle.currentRotation;
        this.ctx.rotate(consciousRotation);
      }

      // Consciousness-modulated opacity
      const consciousOpacity = field
        ? BackgroundEventResponder.calculateRhythmicResponse(
            particle.currentOpacity,
            field.rhythmicPulse,
            particle.flowResonance
          )
        : particle.currentOpacity;
      this.ctx.globalAlpha = consciousOpacity;

      // Render based on particle mode
      this.renderParticleByMode(particle, field, "high");

      this.ctx.restore();
    });
  }

  /**
   * Medium quality rendering with some effects
   */
  private renderMediumQuality(
    particles: UnifiedParticle[],
    field: ConsciousnessField | null
  ): void {
    if (!this.ctx) return;

    particles.forEach((particle) => {
      this.ctx.save();

      // Position
      this.ctx.translate(particle.x, particle.y);

      // Basic opacity
      this.ctx.globalAlpha = particle.currentOpacity;

      // Render simplified version
      this.renderParticleByMode(particle, field, "medium");

      this.ctx.restore();
    });
  }

  /**
   * Get theme-aware particle colors using enhanced spice variables from Phase 3
   * Falls back through: particle-specific → accent → text → Catppuccin mauve → Never white
   */
  private getThemeParticleColor(opacity: number = 0.8): string {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // 🎨 PHASE 3: Try particle-specific colors first (NEW)
    const particleGlowRgb = computedStyle
      .getPropertyValue("--spice-rgb-particle-glow")
      .trim();
    if (
      particleGlowRgb &&
      particleGlowRgb !== "" &&
      !particleGlowRgb.includes("undefined")
    ) {
      return `rgba(${particleGlowRgb}, ${opacity})`;
    }

    const particleCoreRgb = computedStyle
      .getPropertyValue("--spice-rgb-particle-core")
      .trim();
    if (
      particleCoreRgb &&
      particleCoreRgb !== "" &&
      !particleCoreRgb.includes("undefined")
    ) {
      return `rgba(${particleCoreRgb}, ${opacity})`;
    }

    // Try to get dynamic accent from DynamicCatppuccinBridge (fallback)
    const accentRgb = computedStyle
      .getPropertyValue("--spice-rgb-accent")
      .trim();
    if (accentRgb && accentRgb !== "" && !accentRgb.includes("undefined")) {
      return `rgba(${accentRgb}, ${opacity})`;
    }

    // Fall back to text color
    const textRgb = computedStyle.getPropertyValue("--spice-rgb-text").trim();
    if (textRgb && textRgb !== "" && !textRgb.includes("undefined")) {
      return `rgba(${textRgb}, ${opacity})`;
    }

    // Final fallback: Catppuccin mauve (theme-appropriate, never white)
    return `rgba(203, 166, 247, ${opacity})`; // #cba6f7 in RGB
  }

  /**
   * Low quality rendering - simple circles only
   */
  private renderLowQuality(
    particles: UnifiedParticle[],
    field: ConsciousnessField | null
  ): void {
    if (!this.ctx) return;

    this.ctx.fillStyle = this.getThemeParticleColor(0.7);

    particles.forEach((particle) => {
      this.ctx.globalAlpha = particle.currentOpacity * 0.7; // Reduced opacity for performance
      this.ctx.beginPath();
      this.ctx.arc(
        particle.x,
        particle.y,
        particle.currentSize * 0.5,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    });
  }

  /**
   * Render individual particle based on its mode and quality level
   */
  private renderParticleByMode(
    particle: UnifiedParticle,
    field: ConsciousnessField | null,
    quality: "high" | "medium" | "low"
  ): void {
    if (!this.ctx) return;

    switch (particle.mode) {
      case "lightweight":
        this.renderLightweightParticle(particle, field, quality);
        break;
      case "field":
        this.renderFieldParticle(particle, field, quality);
        break;
      case "hybrid":
        this.renderHybridParticle(particle, field, quality);
        break;
      case "consciousness":
        this.renderConsciousnessParticle(particle, field, quality);
        break;
    }
  }

  /**
   * Render lightweight-style particle (complex effects)
   */
  private renderLightweightParticle(
    particle: UnifiedParticle,
    field: ConsciousnessField | null,
    quality: "high" | "medium" | "low"
  ): void {
    if (!this.ctx || !particle.lightweightProps) return;

    if (quality === "high") {
      // Complex gradient rendering
      const gradient = this.ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        particle.currentSize
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, "transparent");

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, particle.currentSize, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      // Simple circle
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, particle.currentSize * 0.7, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Render field-style particle (simple with pulse)
   */
  private renderFieldParticle(
    particle: UnifiedParticle,
    field: ConsciousnessField | null,
    quality: "high" | "medium" | "low"
  ): void {
    if (!this.ctx || !particle.fieldProps) return;

    // Pulse effect based on consciousness field
    const pulseSize = field
      ? particle.currentSize * (1 + field.rhythmicPulse * 0.3)
      : particle.currentSize;

    if (quality === "high" && field) {
      // Subtle gradient for high quality using theme colors
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, pulseSize);
      gradient.addColorStop(0, this.getThemeParticleColor(0.8));
      gradient.addColorStop(1, this.getThemeParticleColor(0.1));

      this.ctx.fillStyle = gradient;
    } else {
      this.ctx.fillStyle = this.getThemeParticleColor(0.6);
    }

    this.ctx.beginPath();
    this.ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Render hybrid particle (combines both approaches)
   */
  private renderHybridParticle(
    particle: UnifiedParticle,
    field: ConsciousnessField | null,
    quality: "high" | "medium" | "low"
  ): void {
    // Hybrid rendering combines lightweight color with field pulsing
    const hasLightweight = particle.lightweightProps;
    const hasField = particle.fieldProps;

    if (hasLightweight && hasField) {
      // Use lightweight color with field pulse behavior
      const pulseSize = field
        ? particle.currentSize * (1 + field.rhythmicPulse * 0.2)
        : particle.currentSize;

      if (quality === "high") {
        const gradient = this.ctx!.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          pulseSize
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, "transparent");
        this.ctx!.fillStyle = gradient;
      } else {
        this.ctx!.fillStyle = particle.color;
      }

      this.ctx!.beginPath();
      this.ctx!.arc(0, 0, pulseSize, 0, Math.PI * 2);
      this.ctx!.fill();
    } else if (hasLightweight) {
      this.renderLightweightParticle(particle, field, quality);
    } else if (hasField) {
      this.renderFieldParticle(particle, field, quality);
    }
  }

  /**
   * Render consciousness-enhanced particle (new organic mode)
   */
  private renderConsciousnessParticle(
    particle: UnifiedParticle,
    field: ConsciousnessField | null,
    quality: "high" | "medium" | "low"
  ): void {
    if (!this.ctx || !field) {
      // Fallback to hybrid rendering if no consciousness field
      this.renderHybridParticle(particle, field, quality);
      return;
    }

    // Organic size modulation
    const organicSize =
      BackgroundEventResponder.calculateBreathingModulation(
        particle.currentSize,
        particle.breathingPhase,
        0.2
      );

    // Flow-responsive color temperature
    const flowIntensity = Math.sqrt(
      field.musicalFlow.x ** 2 + field.musicalFlow.y ** 2
    );
    const colorTemp = 0.5 + flowIntensity * 0.5;

    if (quality === "high") {
      // Organic gradient with consciousness colors
      const gradient = this.ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        organicSize
      );
      gradient.addColorStop(0, `hsl(${200 + colorTemp * 60}, 70%, 70%)`);
      gradient.addColorStop(0.5, `hsl(${200 + colorTemp * 60}, 50%, 50%)`);
      gradient.addColorStop(1, "transparent");

      this.ctx.fillStyle = gradient;
    } else {
      this.ctx.fillStyle = `hsl(${200 + colorTemp * 60}, 60%, 60%)`;
    }

    this.ctx.beginPath();
    this.ctx.arc(0, 0, organicSize, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Clean up renderer resources
   */
  public cleanup(): void {
    // Renderer cleanup is handled by SharedCanvasManager
  }
}

// ===================================================================
// MAIN PARTICLE CONSCIOUSNESS MODULE
// ===================================================================

/**
 * Unified Particle Consciousness Module
 * Consolidates LightweightParticleSystem and ParticleFieldSystem
 */
export class ParticleConsciousnessModule
  extends BaseVisualSystem
  implements BackgroundSystemParticipant
{
  // Required BackgroundSystemParticipant implementation
  public override readonly systemName: string = "ParticleConsciousnessModule";
  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "normal"; // Particles are normal priority for visual enhancement
  }

  // Unified particle management
  private particlePool: UnifiedParticle[] = [];
  private activeParticles: UnifiedParticle[] = [];

  // Rendering and canvas management
  private canvasManager: SharedCanvasManager;
  private renderer: ConsciousnessParticleRenderer;

  // Configuration
  private performanceConfig: ParticlePerformanceConfig;
  private consciousnessConfig: ParticleConsciousnessConfig;

  // Consciousness integration
  private consciousnessChoreographer: BackgroundAnimationCoordinator | null =
    null;
  private currentConsciousnessField: ConsciousnessField | null = null;

  // Music synchronization
  private musicSyncBound: ((event: Event) => void) | null = null;
  private lastMusicUpdate = 0;
  private animationPhase = 0;

  // Performance monitoring
  private lastFrameTime = 0;
  private frameCount = 0;
  private averageFrameTime = 16.67; // Target 60fps

  constructor(
    config: Year3000Config,
    utils: typeof Year3000Utilities,
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);

    // Get consciousness choreographer from year3000System if available
    this.consciousnessChoreographer =
      year3000System?.backgroundConsciousnessChoreographer || null;

    // Initialize shared canvas manager
    this.canvasManager = new SharedCanvasManager();

    // Initialize renderer
    this.renderer = new ConsciousnessParticleRenderer(
      this.canvasManager,
      "sn-particle-consciousness-canvas"
    );

    // Initialize configurations
    this.performanceConfig = this.createPerformanceConfig();
    this.consciousnessConfig = this.createConsciousnessConfig();

    // Bind event handlers
    this.musicSyncBound = this.handleMusicSync.bind(this);

    Y3KDebug?.debug?.log(
      "ParticleConsciousnessModule",
      "Unified particle system initialized"
    );
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    try {
      // Initialize particle pool
      this.initializeParticlePool();

      // Subscribe to music sync events
      this.subscribeToMusicSync();

      // Register with consciousness choreographer
      this.registerWithConsciousnessChoreographer();

      Y3KDebug?.debug?.log(
        "ParticleConsciousnessModule",
        "Particle consciousness system initialized successfully"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ParticleConsciousnessModule",
        "Failed to initialize particle consciousness system:",
        error
      );
    }
  }

  /**
   * Create performance configuration based on device capabilities
   */
  private createPerformanceConfig(): ParticlePerformanceConfig {
    // Get device capabilities from consciousness choreographer if available, otherwise use fallback
    const capabilities =
      this.consciousnessChoreographer?.getCurrentConsciousnessField()
        ?.deviceCapabilities || {
        memoryGB: 4,
        cpuCores: 4,
        performanceTier: "medium" as const,
        gpuAcceleration: false,
      };
    const memoryGB = capabilities.memoryGB || 4;
    const cpuCores = capabilities.cpuCores || 4;

    // Adaptive configuration based on device
    if (memoryGB >= 8 && cpuCores >= 8) {
      return {
        maxParticles: 150,
        maxFieldParticles: 400,
        renderQuality: "high",
        enableComplexEffects: true,
        frameRateTarget: 60,
        memoryLimit: 50,
      };
    } else if (memoryGB >= 4 && cpuCores >= 4) {
      return {
        maxParticles: 75,
        maxFieldParticles: 250,
        renderQuality: "medium",
        enableComplexEffects: true,
        frameRateTarget: 60,
        memoryLimit: 30,
      };
    } else {
      return {
        maxParticles: 35,
        maxFieldParticles: 150,
        renderQuality: "low",
        enableComplexEffects: false,
        frameRateTarget: 30,
        memoryLimit: 20,
      };
    }
  }

  /**
   * Create consciousness configuration
   */
  private createConsciousnessConfig(): ParticleConsciousnessConfig {
    return {
      enableOrganicFlow: true,
      enableBreathingSynchronization: true,
      enableHarmonicResonance: true,
      enableCellularGrowth: true,
      consciousnessStrength: 0.7,
      animationTransitionSpeed: 1.0,
    };
  }

  /**
   * Initialize unified particle pool
   */
  private initializeParticlePool(): void {
    this.particlePool = [];
    const totalParticles =
      this.performanceConfig.maxParticles +
      this.performanceConfig.maxFieldParticles;

    for (let i = 0; i < totalParticles; i++) {
      this.particlePool.push(this.createPooledParticle());
    }

    Y3KDebug?.debug?.log(
      "ParticleConsciousnessModule",
      `Initialized particle pool with ${totalParticles} particles`
    );
  }

  /**
   * Create a pooled particle with default values
   */
  private createPooledParticle(): UnifiedParticle {
    return {
      active: false,
      x: 0,
      y: 0,
      currentSize: 0,
      targetSize: 0,
      currentOpacity: 0,
      targetOpacity: 0,
      life: 0,
      maxLife: 0,
      vx: 0,
      vy: 0,
      color: "rgba(203, 166, 247, 0.8)", // Default fallback - will be updated dynamically to album colors
      currentRotation: 0,
      targetRotation: 0,
      mode: "hybrid",
      consciousnessResonance: Math.random(),
      organicGrowthPhase: Math.random() * Math.PI * 2,
      breathingPhase: Math.random() * Math.PI * 2,
      flowResonance: Math.random() * 0.5 + 0.25,
    };
  }

  /**
   * Subscribe to music sync events
   */
  private subscribeToMusicSync(): void {
    if (this.musicSyncBound) {
      document.addEventListener("music-sync:beat", this.musicSyncBound);
      document.addEventListener(
        "music-sync:energy-changed",
        this.musicSyncBound
      );
      document.addEventListener(
        "music-sync:valence-changed",
        this.musicSyncBound
      );
    }
  }

  /**
   * Handle music sync events with consciousness awareness
   */
  private handleMusicSync(event: Event): void {
    const currentTime = performance.now();

    // Throttle music updates to 30fps for performance
    if (!MusicSyncUtilities.shouldUpdateMusic(this.lastMusicUpdate, 33)) return;
    this.lastMusicUpdate = currentTime;

    const customEvent = event as CustomEvent;
    const { type, detail } = customEvent;

    switch (type) {
      case "music-sync:beat":
        this.handleBeatEvent(detail.intensity || 0.5);
        break;

      case "music-sync:energy-changed":
        this.handleEnergyChange(detail.energy || 0);
        break;

      case "music-sync:valence-changed":
        this.handleValenceChange(detail.valence || 0);
        break;
    }
  }

  /**
   * Handle beat events - spawn particles and trigger effects
   */
  private handleBeatEvent(intensity: number): void {
    // Increment animation phase
    this.animationPhase = MusicSyncUtilities.incrementAnimationPhase(
      this.animationPhase,
      intensity,
      0.1
    );

    // Spawn particles based on beat intensity
    const spawnCount = Math.floor(intensity * 3) + 1;
    for (let i = 0; i < spawnCount; i++) {
      this.spawnParticle("lightweight", intensity);

      // Spawn field particles for strong beats
      if (intensity > 0.7) {
        this.spawnParticle("field", intensity * 0.6);
      }
    }

    // Update existing particles with beat pulse
    this.activeParticles.forEach((particle) => {
      if (particle.active) {
        // Apply beat pulse to target size
        const pulseMultiplier =
          1 + intensity * particle.consciousnessResonance * 0.5;
        particle.targetSize = Math.min(
          particle.targetSize * pulseMultiplier,
          20
        );

        // Apply beat influence to opacity
        particle.targetOpacity = Math.min(
          particle.targetOpacity + intensity * 0.2,
          1
        );
      }
    });
  }

  /**
   * Handle energy changes - adjust particle behavior
   */
  private handleEnergyChange(energy: number): void {
    // Adjust spawn rates based on energy
    this.performanceConfig.maxParticles = Math.floor(
      this.performanceConfig.maxParticles * (0.5 + energy * 0.5)
    );

    // Update particle flow patterns
    this.activeParticles.forEach((particle) => {
      if (particle.active) {
        // Energy affects particle velocity
        particle.vx *= 0.8 + energy * 0.4;
        particle.vy *= 0.8 + energy * 0.4;
      }
    });
  }

  /**
   * Handle valence changes - adjust visual aesthetics
   */
  private handleValenceChange(valence: number): void {
    // Valence affects color temperature and particle behavior
    const colorTemp = valence * 360; // Map to hue range

    this.activeParticles.forEach((particle) => {
      if (particle.active) {
        // Update color based on valence
        particle.color = `hsl(${colorTemp}, 70%, 70%)`;

        // Valence affects organic growth patterns
        particle.organicGrowthPhase += valence * 0.1;
      }
    });
  }

  /**
   * Register with consciousness choreographer
   */
  private registerWithConsciousnessChoreographer(): void {
    if (!this.consciousnessChoreographer) {
      Y3KDebug?.debug?.log(
        "ParticleConsciousnessModule",
        "Consciousness choreographer not available, skipping registration"
      );
      return;
    }

    try {
      this.consciousnessChoreographer.registerConsciousnessParticipant(this);
      Y3KDebug?.debug?.log(
        "ParticleConsciousnessModule",
        "Successfully registered with consciousness choreographer"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ParticleConsciousnessModule",
        "Failed to register with consciousness choreographer:",
        error
      );
    }
  }

  /**
   * Spawn a new particle with specified mode and intensity
   */
  private spawnParticle(
    mode: ParticleMode,
    intensity: number
  ): UnifiedParticle | null {
    // Find inactive particle from pool
    const particle = this.particlePool.find((p) => !p.active);
    if (!particle) return null;

    // Reset particle properties
    particle.active = true;
    particle.mode = mode;
    particle.x = Math.random() * window.innerWidth;
    particle.y = Math.random() * window.innerHeight;
    particle.life = 0;
    particle.maxLife = 2000 + Math.random() * 3000; // 2-5 seconds

    // Set properties based on mode
    switch (mode) {
      case "lightweight":
        this.initializeLightweightParticle(particle, intensity);
        break;
      case "field":
        this.initializeFieldParticle(particle, intensity);
        break;
      case "hybrid":
        this.initializeHybridParticle(particle, intensity);
        break;
      case "consciousness":
        this.initializeConsciousnessParticle(particle, intensity);
        break;
    }

    // Add to active particles
    if (!this.activeParticles.includes(particle)) {
      this.activeParticles.push(particle);
    }

    return particle;
  }

  /**
   * Initialize lightweight-style particle
   */
  private initializeLightweightParticle(
    particle: UnifiedParticle,
    intensity: number
  ): void {
    const baseSize = 2 + Math.random() * 4;
    const baseOpacity = 0.4 + Math.random() * 0.4;

    particle.currentSize = baseSize * 0.1;
    particle.targetSize = baseSize * (0.5 + intensity * 0.5);
    particle.currentOpacity = 0;
    particle.targetOpacity = baseOpacity * (0.7 + intensity * 0.3);

    particle.vx = (Math.random() - 0.5) * 2;
    particle.vy = (Math.random() - 0.5) * 2;
    particle.currentRotation = 0;
    particle.targetRotation = Math.random() * Math.PI * 2;

    // Color based on intensity
    const hue = 200 + intensity * 60;
    particle.color = `hsl(${hue}, 70%, 70%)`;

    // Lightweight-specific properties
    particle.lightweightProps = {
      baseSize: baseSize,
      baseOpacity: baseOpacity,
      radius: baseSize,
      vr: (Math.random() - 0.5) * 0.1,
    };
  }

  /**
   * Initialize field-style particle
   */
  private initializeFieldParticle(
    particle: UnifiedParticle,
    intensity: number
  ): void {
    const baseSize = 1 + Math.random() * 2;

    particle.currentSize = baseSize;
    particle.targetSize = baseSize * (1 + intensity * 0.5);
    particle.currentOpacity = 0.3 + Math.random() * 0.4;
    particle.targetOpacity = particle.currentOpacity;

    particle.vx = (Math.random() - 0.5) * 0.5;
    particle.vy = (Math.random() - 0.5) * 0.5;
    // Phase 3: Set color dynamically using album-aware particle colors
    // (Using getThemeParticleColor method for dynamic album colors)
    particle.color = "rgba(203, 166, 247, 0.8)"; // Will be refreshed by render methods

    // Field-specific properties
    particle.fieldProps = {
      baseSize: baseSize,
      pulse: 0,
      speedX: particle.vx,
      speedY: particle.vy,
    };
  }

  /**
   * Initialize hybrid particle (combines both approaches)
   */
  private initializeHybridParticle(
    particle: UnifiedParticle,
    intensity: number
  ): void {
    // Initialize both lightweight and field properties
    this.initializeLightweightParticle(particle, intensity);
    this.initializeFieldParticle(particle, intensity * 0.8);

    // Blend characteristics
    particle.currentSize =
      (particle.currentSize + (particle.fieldProps?.baseSize || 2)) * 0.5;
    particle.targetSize =
      (particle.targetSize + (particle.fieldProps?.baseSize || 2) * 1.5) * 0.5;
    particle.currentOpacity = Math.min(particle.currentOpacity * 1.2, 0.9);
  }

  /**
   * Initialize consciousness-enhanced particle
   */
  private initializeConsciousnessParticle(
    particle: UnifiedParticle,
    intensity: number
  ): void {
    // Start with hybrid base
    this.initializeHybridParticle(particle, intensity);

    // Enhanced consciousness properties
    particle.consciousnessResonance = 0.7 + Math.random() * 0.3;
    particle.flowResonance = 0.6 + Math.random() * 0.4;

    // Organic color variations
    const hue = 180 + Math.random() * 120; // Blue to purple range
    particle.color = `hsl(${hue}, 60%, 65%)`;

    // Enhanced organic growth phase
    particle.organicGrowthPhase = Math.random() * Math.PI * 2;
    particle.breathingPhase = Math.random() * Math.PI * 2 + Math.PI; // Offset from other particles
  }

  public override updateAnimation(deltaTime: number): void {
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);

    // Update particle lifecycle and physics
    this.updateParticles(deltaTime);

    // Render particles with consciousness awareness
    this.renderParticles();

    // Clean up inactive particles
    this.cleanupInactiveParticles();
  }

  /**
   * Update performance metrics for adaptive quality
   */
  private updatePerformanceMetrics(deltaTime: number): void {
    this.frameCount++;
    const currentTime = performance.now();

    if (this.lastFrameTime > 0) {
      const frameTime = currentTime - this.lastFrameTime;
      this.averageFrameTime = this.averageFrameTime * 0.9 + frameTime * 0.1;

      // Adaptive quality based on performance
      if (
        this.averageFrameTime > 20 &&
        this.performanceConfig.renderQuality !== "low"
      ) {
        this.performanceConfig.renderQuality = "medium";
        Y3KDebug?.debug?.log(
          "ParticleConsciousnessModule",
          "Reduced render quality due to performance"
        );
      } else if (this.averageFrameTime > 25) {
        this.performanceConfig.renderQuality = "low";
        Y3KDebug?.debug?.log(
          "ParticleConsciousnessModule",
          "Switched to low quality rendering"
        );
      } else if (
        this.averageFrameTime < 16 &&
        this.performanceConfig.renderQuality !== "high"
      ) {
        this.performanceConfig.renderQuality = "high";
      }
    }

    this.lastFrameTime = currentTime;
  }

  /**
   * Update all active particles
   */
  private updateParticles(deltaTime: number): void {
    const dt = Math.min(deltaTime, 50); // Cap delta time to prevent large jumps

    this.activeParticles.forEach((particle) => {
      if (!particle.active) return;

      // Update life
      particle.life += dt;
      if (particle.life >= particle.maxLife) {
        particle.active = false;
        return;
      }

      // Update position
      particle.x += particle.vx * dt * 0.016; // Normalize to 60fps
      particle.y += particle.vy * dt * 0.016;

      // Apply consciousness field influence
      this.applyConsciousnessInfluence(particle, dt);

      // Smooth transitions towards targets
      this.updateParticleTransitions(particle, dt);

      // Apply physics and constraints
      this.applyParticlePhysics(particle);
    });
  }

  /**
   * Apply consciousness field influence to particle
   */
  private applyConsciousnessInfluence(
    particle: UnifiedParticle,
    deltaTime: number
  ): void {
    if (
      !this.currentConsciousnessField ||
      !this.consciousnessConfig.enableOrganicFlow
    )
      return;

    const field = this.currentConsciousnessField;
    const strength = this.consciousnessConfig.consciousnessStrength;

    // Apply musical flow influence
    if (this.consciousnessConfig.enableOrganicFlow) {
      const flowInfluence = particle.flowResonance * strength;
      particle.vx += field.musicalFlow.x * flowInfluence * 0.01;
      particle.vy += field.musicalFlow.y * flowInfluence * 0.01;
    }

    // Apply breathing synchronization
    if (this.consciousnessConfig.enableBreathingSynchronization) {
      const breathingInfluence =
        BackgroundEventResponder.calculateBreathingModulation(
          1.0,
          field.breathingCycle + particle.breathingPhase,
          0.1
        );
      particle.targetSize *= breathingInfluence;
    }

    // Apply cellular growth
    if (this.consciousnessConfig.enableCellularGrowth) {
      const growthPhase =
        particle.organicGrowthPhase + field.cellularGrowthRate;
      const growthInfluence = Math.sin(growthPhase) * 0.05 + 1.0;
      particle.targetSize *= growthInfluence;
      particle.organicGrowthPhase = growthPhase;
    }

    // Apply rhythmic pulse
    const rhythmicInfluence =
      BackgroundEventResponder.calculateRhythmicResponse(
        1.0,
        field.rhythmicPulse,
        particle.consciousnessResonance
      );
    particle.targetOpacity *= rhythmicInfluence;
  }

  /**
   * Update smooth transitions towards target values
   */
  private updateParticleTransitions(
    particle: UnifiedParticle,
    deltaTime: number
  ): void {
    const transitionSpeed =
      this.consciousnessConfig.animationTransitionSpeed * 0.002;
    const dt = deltaTime * transitionSpeed;

    // Smooth size transitions
    const sizeDiff = particle.targetSize - particle.currentSize;
    particle.currentSize += sizeDiff * dt;

    // Smooth opacity transitions
    const opacityDiff = particle.targetOpacity - particle.currentOpacity;
    particle.currentOpacity += opacityDiff * dt;

    // Smooth rotation transitions
    const rotationDiff = particle.targetRotation - particle.currentRotation;
    particle.currentRotation += rotationDiff * dt;

    // Clamp values
    particle.currentSize = Math.max(0, particle.currentSize);
    particle.currentOpacity = Math.max(0, Math.min(1, particle.currentOpacity));
  }

  /**
   * Apply physics constraints and effects
   */
  private applyParticlePhysics(particle: UnifiedParticle): void {
    // Boundary constraints with wrapping
    if (particle.x < -50) particle.x = window.innerWidth + 50;
    if (particle.x > window.innerWidth + 50) particle.x = -50;
    if (particle.y < -50) particle.y = window.innerHeight + 50;
    if (particle.y > window.innerHeight + 50) particle.y = -50;

    // Apply drag
    particle.vx *= 0.99;
    particle.vy *= 0.99;

    // Life-based fadeout
    const lifeRatio = particle.life / particle.maxLife;
    if (lifeRatio > 0.8) {
      const fadeRatio = (lifeRatio - 0.8) / 0.2;
      particle.currentOpacity *= 1 - fadeRatio;
    }
  }

  /**
   * Render all particles with consciousness awareness
   */
  private renderParticles(): void {
    this.renderer.render(
      this.activeParticles,
      this.currentConsciousnessField,
      this.performanceConfig
    );
  }

  /**
   * Clean up inactive particles from active list
   */
  private cleanupInactiveParticles(): void {
    this.activeParticles = this.activeParticles.filter((p) => p.active);
  }

  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================

  public getConsciousnessContribution(): any {
    return {
      particleDensity:
        this.activeParticles.length / this.performanceConfig.maxParticles,
      energyContribution: this.averageParticleEnergy(),
      organicFlowContribution: this.calculateOrganicFlowContribution(),
      renderingLoad:
        this.performanceConfig.renderQuality === "high"
          ? 1.0
          : this.performanceConfig.renderQuality === "medium"
          ? 0.6
          : 0.3,
    };
  }

  public onConsciousnessFieldUpdate(field: ConsciousnessField): void {
    try {
      this.currentConsciousnessField = field;

      // Update particle behaviors based on consciousness field
      this.adaptToConsciousnessField(field);

      Y3KDebug?.debug?.log(
        "ParticleConsciousnessModule",
        "Updated from consciousness field:",
        {
          rhythmicPulse: field.rhythmicPulse,
          particleCount: this.activeParticles.length,
          renderQuality: this.performanceConfig.renderQuality,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ParticleConsciousnessModule",
        "Error updating from consciousness field:",
        error
      );
    }
  }

  public onChoreographyEvent(eventType: string, payload: any): void {
    try {
      switch (eventType) {
        case "choreography:rhythm-shift":
          this.handleRhythmShift(payload);
          break;

        case "choreography:energy-surge":
          this.handleEnergySurge(payload);
          break;

        case "consciousness:breathing-cycle":
          this.handleBreathingCycle(payload);
          break;

        case "consciousness:cellular-growth":
          this.handleCellularGrowth(payload);
          break;

        case "consciousness:performance-adapt":
          this.handlePerformanceAdapt(payload);
          break;
      }

      Y3KDebug?.debug?.log(
        "ParticleConsciousnessModule",
        `Handled choreography event: ${eventType}`,
        payload
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ParticleConsciousnessModule",
        `Error handling choreography event ${eventType}:`,
        error
      );
    }
  }

  /**
   * Adapt particle system to consciousness field changes
   */
  private adaptToConsciousnessField(field: ConsciousnessField): void {
    // Adapt particle density based on energy resonance
    const targetParticleCount = Math.floor(
      this.performanceConfig.maxParticles * (0.3 + field.energyResonance * 0.7)
    );

    // Spawn more particles if needed
    while (this.activeParticles.length < targetParticleCount) {
      const mode = field.liquidDensity > 0.7 ? "consciousness" : "hybrid";
      this.spawnParticle(mode, field.rhythmicPulse);
    }

    // Update existing particles with field influence
    this.activeParticles.forEach((particle) => {
      if (particle.active) {
        // Update consciousness resonance based on field
        particle.consciousnessResonance = Math.min(
          1.0,
          particle.consciousnessResonance + field.energyResonance * 0.1
        );
      }
    });
  }

  /**
   * Handle rhythm shift events
   */
  private handleRhythmShift(payload: any): void {
    const newBPM = payload.newRhythm?.bpm || 120;
    const rhythmMultiplier = ChoreographyEventResponder.handleRhythmShift(
      1.0,
      newBPM
    );

    // Adjust particle spawn rates and behavior based on rhythm
    this.performanceConfig.maxParticles = Math.floor(
      this.performanceConfig.maxParticles * rhythmMultiplier
    );

    // Update existing particles
    this.activeParticles.forEach((particle) => {
      if (particle.active) {
        particle.vx *= rhythmMultiplier;
        particle.vy *= rhythmMultiplier;
      }
    });
  }

  /**
   * Handle energy surge events
   */
  private handleEnergySurge(payload: any): void {
    const surgeIntensity = payload.intensity || 1.0;

    // Spawn additional particles during energy surges
    const surgeParticleCount = Math.floor(surgeIntensity * 10);
    for (let i = 0; i < surgeParticleCount; i++) {
      this.spawnParticle("consciousness", surgeIntensity);
    }

    // Enhance existing particle effects
    this.activeParticles.forEach((particle) => {
      if (particle.active) {
        particle.targetSize *= ChoreographyEventResponder.handleEnergySurge(
          1.0,
          surgeIntensity
        );
        particle.targetOpacity = Math.min(
          1.0,
          particle.targetOpacity + surgeIntensity * 0.3
        );
      }
    });
  }

  /**
   * Handle breathing cycle events
   */
  private handleBreathingCycle(payload: any): void {
    const breathingPhase = payload.phase || 0;
    const breathingIntensity = payload.intensity || 0.5;

    // Synchronize all particles with breathing cycle
    this.activeParticles.forEach((particle) => {
      if (particle.active) {
        particle.breathingPhase =
          breathingPhase + particle.consciousnessResonance * Math.PI;
        const breathingEffect = ChoreographyEventResponder.handleBreathingCycle(
          1.0,
          breathingPhase,
          breathingIntensity
        );
        particle.targetSize *= breathingEffect;
      }
    });
  }

  /**
   * Handle cellular growth events
   */
  private handleCellularGrowth(payload: any): void {
    const growthRate = payload.growthRate || 1.0;

    // Apply cellular growth to particle organic growth phases
    this.activeParticles.forEach((particle) => {
      if (particle.active) {
        particle.organicGrowthPhase += growthRate * 0.1;

        // Organic growth affects size and opacity
        const growthInfluence =
          Math.sin(particle.organicGrowthPhase) * 0.2 + 1.0;
        particle.targetSize *= growthInfluence;
      }
    });
  }

  /**
   * Handle performance adaptation events
   */
  private handlePerformanceAdapt(payload: any): void {
    const newMode = payload.newMode;
    if (!newMode) return;

    // Adapt rendering quality based on performance mode
    if (newMode.qualityLevel < 0.3) {
      this.performanceConfig.renderQuality = "low";
      this.performanceConfig.maxParticles = Math.floor(
        this.performanceConfig.maxParticles * 0.5
      );
    } else if (newMode.qualityLevel < 0.7) {
      this.performanceConfig.renderQuality = "medium";
      this.performanceConfig.maxParticles = Math.floor(
        this.performanceConfig.maxParticles * 0.8
      );
    } else {
      this.performanceConfig.renderQuality = "high";
    }

    // Adjust frame rate target
    this.performanceConfig.frameRateTarget = newMode.frameRate || 60;

    Y3KDebug?.debug?.log(
      "ParticleConsciousnessModule",
      `Adapted to performance mode: ${newMode.name}`,
      {
        quality: this.performanceConfig.renderQuality,
        maxParticles: this.performanceConfig.maxParticles,
      }
    );
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  /**
   * Calculate average particle energy for consciousness contribution
   */
  private averageParticleEnergy(): number {
    if (this.activeParticles.length === 0) return 0;

    const totalEnergy = this.activeParticles.reduce((sum, particle) => {
      return (
        sum +
        particle.currentSize *
          particle.currentOpacity *
          particle.consciousnessResonance
      );
    }, 0);

    return totalEnergy / this.activeParticles.length;
  }

  /**
   * Calculate organic flow contribution for consciousness field
   */
  private calculateOrganicFlowContribution(): { x: number; y: number } {
    if (this.activeParticles.length === 0) return { x: 0, y: 0 };

    const flowVector = this.activeParticles.reduce(
      (sum, particle) => {
        return {
          x: sum.x + particle.vx * particle.flowResonance,
          y: sum.y + particle.vy * particle.flowResonance,
        };
      },
      { x: 0, y: 0 }
    );

    return {
      x: flowVector.x / this.activeParticles.length,
      y: flowVector.y / this.activeParticles.length,
    };
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const activeCount = this.activeParticles.length;
    const poolCount = this.particlePool.length;
    const renderQuality = this.performanceConfig.renderQuality;
    const avgFrameTime = this.averageFrameTime;

    const isHealthy =
      activeCount >= 0 &&
      poolCount > 0 &&
      avgFrameTime < 25 &&
      this.canvasManager !== null;

    return {
      healthy: isHealthy,
      ok: isHealthy,
      details:
        `Particles: ${activeCount}/${this.performanceConfig.maxParticles}, ` +
        `Pool: ${poolCount}, Quality: ${renderQuality}, ` +
        `Avg Frame: ${avgFrameTime.toFixed(1)}ms`,
      system: "ParticleConsciousnessModule",
    };
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Unregister from consciousness choreographer
    if (this.consciousnessChoreographer) {
      try {
        this.consciousnessChoreographer.unregisterConsciousnessParticipant(
          "ParticleConsciousnessModule"
        );
        Y3KDebug?.debug?.log(
          "ParticleConsciousnessModule",
          "Unregistered from consciousness choreographer"
        );
      } catch (error) {
        Y3KDebug?.debug?.error(
          "ParticleConsciousnessModule",
          "Error unregistering from consciousness choreographer:",
          error
        );
      }
    }

    // Clean up music sync event listeners
    if (this.musicSyncBound) {
      document.removeEventListener("music-sync:beat", this.musicSyncBound);
      document.removeEventListener(
        "music-sync:energy-changed",
        this.musicSyncBound
      );
      document.removeEventListener(
        "music-sync:valence-changed",
        this.musicSyncBound
      );
      this.musicSyncBound = null;
    }

    // Clean up particles
    this.activeParticles = [];
    this.particlePool = [];

    // Clean up canvas and renderer
    this.renderer.cleanup();
    this.canvasManager.cleanup();

    Y3KDebug?.debug?.log(
      "ParticleConsciousnessModule",
      "System cleanup completed"
    );
  }

  // ===================================================================
  // PUBLIC API FOR COMPATIBILITY
  // ===================================================================

  /**
   * Spawn particle (public API for compatibility)
   */
  public spawnParticleCompat(
    energy: number,
    intensity: number,
    speedFactor: number = 1.0,
    mood: string = "neutral"
  ): void {
    // Map to new API
    const mode: ParticleMode =
      energy > 0.7
        ? "consciousness"
        : intensity > 0.6
        ? "hybrid"
        : "lightweight";
    this.spawnParticle(mode, intensity);
  }

  /**
   * Set particle density (public API)
   */
  public setParticleDensity(density: number): void {
    const maxParticles = Math.floor(density * 200); // Scale to reasonable range
    this.performanceConfig.maxParticles = Math.max(
      10,
      Math.min(300, maxParticles)
    );
  }

  /**
   * Set render quality (public API)
   */
  public setRenderQuality(quality: "low" | "medium" | "high"): void {
    this.performanceConfig.renderQuality = quality;

    // Update complex effects based on quality
    this.performanceConfig.enableComplexEffects = quality !== "low";
  }

  /**
   * Get current particle statistics
   */
  public getParticleStats(): {
    active: number;
    total: number;
    renderQuality: string;
    avgFrameTime: number;
    consciousnessIntegration: boolean;
  } {
    return {
      active: this.activeParticles.length,
      total: this.performanceConfig.maxParticles,
      renderQuality: this.performanceConfig.renderQuality,
      avgFrameTime: this.averageFrameTime,
      consciousnessIntegration: this.currentConsciousnessField !== null,
    };
  }
}
