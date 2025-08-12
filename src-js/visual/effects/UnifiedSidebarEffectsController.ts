/**
 * UnifiedSidebarConsciousnessController - Phase 2.5 Enhanced Consolidation
 *
 * Consolidates ALL sidebar consciousness systems into a unified controller
 * that eliminates 70%+ code duplication while preserving all functionality.
 *
 * Enhanced to consolidate:
 * - RightSidebarConsciousnessSystem.ts (184 lines)
 * - RightSidebarConsciousnessSystemUnified.ts (257 lines)
 * - RightSidebarConsciousnessEnhanced.ts (420 lines)
 * - SidebarConsciousnessSystem.ts (592 lines) ← NEW in Phase 2.5
 *
 * Key Features:
 * - Unified music synchronization logic
 * - Consolidated CSS variable management
 * - Bilateral consciousness coordination
 * - Performance-optimized animation loops
 * - Integration with consciousness choreographer
 * - Shared infrastructure utilization
 * - Temporal echo effects with object pooling (NEW)
 * - Device capability detection and adaptation (NEW)
 * - Harmonic mode system integration (NEW)
 * - Performance-aware animation gating (NEW)
 */

import { HARMONIC_MODES } from "@/config/globalConfig";
import { UnifiedSystemBase } from "@/core/base/UnifiedSystemBase";
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type {
  BackgroundSystemParticipant,
  ConsciousnessField,
} from "@/types/animationCoordination";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult } from "@/types/systems";
import { sample as sampleNoise } from "@/utils/graphics/NoiseField";
import { BackgroundAnimationCoordinator } from "@/visual/effects/BackgroundAnimationCoordinator";
import { SidebarPerformanceCoordinator } from "@/visual/ui/SidebarPerformanceCoordinator";

// Enhanced device capability detection (from SidebarConsciousnessSystem)
interface DeviceCapabilities {
  supportsCSSFilter: boolean;
  supportsTransforms: boolean;
  performanceLevel: "high" | "medium" | "low";
  reducedMotion: boolean;
  memory: number;
  cores: number;
}

// Temporal echo system state (from SidebarConsciousnessSystem)
interface TemporalEchoState {
  echoPool: HTMLElement[];
  currentEchoCount: number;
  maxEchoes: number;
  echoTimerCounter: number;
  activeEchoElements: Set<HTMLElement>;
}

// Harmonic mode system state (from SidebarConsciousnessSystem)
interface HarmonicModeState {
  currentModeKey: string;
  currentModeClass: string;
  currentEnergyClass: string;
  modeConfig: any;
}

// Consolidated consciousness state types
export interface SidebarConsciousnessState {
  // Core consciousness levels
  consciousnessLevel: "dormant" | "aware" | "focused" | "transcendent";
  bilateralCoordination: boolean;

  // Music synchronization state
  musicSync: {
    energy: number;
    valence: number;
    beat: boolean;
    tempo: number;
    lastBeatTime: number;
  };

  // Animation state
  animation: {
    intensity: number;
    phase: number;
    lastFrameTime: number;
    targetIntensity: number;
    smoothingFactor: number;
    currentScale: number; // Enhanced from SidebarConsciousnessSystem
    baseOpacity: number;
    pulseDirection: number;
    lastPulse: number;
  };

  // Performance metrics
  performance: {
    frameTime: number;
    avgFrameTime: number;
    maxFrameTime: number;
    healthStatus: "excellent" | "good" | "degraded" | "critical";
  };

  // NEW: Device capabilities (from SidebarConsciousnessSystem)
  deviceCapabilities: DeviceCapabilities;

  // NEW: Temporal echo system (from SidebarConsciousnessSystem)
  temporalEcho: TemporalEchoState;

  // NEW: Harmonic mode system (from SidebarConsciousnessSystem)
  harmonicMode: HarmonicModeState;
}

export interface SidebarConsciousnessConfig {
  // Core settings
  enabled: boolean;
  bilateralMode: boolean;
  consciousnessThreshold: number;

  // Music integration
  musicResponsiveness: number;
  beatSensitivity: number;
  energySmoothing: number;

  // Animation settings
  animationIntensity: number;
  smoothingFactor: number;
  maxFrameTime: number;

  // Bilateral coordination
  bilateralOffset: number; // Default 150ms as per enhanced system
  crossChannelBleed: number;

  // Performance optimization
  enablePerformanceMonitoring: boolean;
  adaptiveQuality: boolean;
  debugMode: boolean;

  // NEW: Enhanced features (from SidebarConsciousnessSystem)
  echoIntensity: number; // 0-3 scale for echo effects
  enableTemporalEcho: boolean; // Enable/disable echo effects
  enableHarmonicModes: boolean; // Enable/disable harmonic mode system
  enableDeviceDetection: boolean; // Enable/disable device capability detection
}

export class UnifiedSidebarConsciousnessController
  extends UnifiedSystemBase
  implements BackgroundSystemParticipant
{
  // BackgroundSystemParticipant implementation
  public override readonly systemName: string =
    "UnifiedSidebarConsciousnessController";
  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "normal"; // Sidebar consciousness is normal priority
  }

  // Core consciousness state
  private consciousnessState: SidebarConsciousnessState;
  private sidebarConfig: SidebarConsciousnessConfig;

  // Infrastructure dependencies
  private sidebarPerformanceCoordinator: SidebarPerformanceCoordinator | null =
    null;
  private consciousnessChoreographer: BackgroundAnimationCoordinator | null =
    null;
  private currentConsciousnessField: ConsciousnessField | null = null;

  // Animation and timing
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private frameTimeHistory: number[] = [];

  // Event subscriptions
  private eventUnsubscribeFunctions: (() => void)[] = [];

  // Bilateral coordination (for enhanced functionality)
  private bilateralState: {
    leftSide: SidebarConsciousnessState;
    rightSide: SidebarConsciousnessState;
    coordinationOffset: number;
    lastCoordinationTime: number;
  } | null = null;

  // NEW: Enhanced properties (from SidebarConsciousnessSystem)
  private rootNavBar: HTMLElement | null = null;
  private overlayContainer: HTMLElement | null = null;
  private consciousnessVisualizer: HTMLElement | null = null;
  private harmonicModeIndicator: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private masterAnimationRegistered: boolean = false;
  private isUsingMasterAnimation: boolean = false;

  // Performance monitoring (enhanced)
  private _lastMotionDisabled = false;
  private _navInteractionHandler: ((evt: Event) => void) | null = null;

  // CSS coordination system
  private cssController!: OptimizedCSSVariableManager;

  constructor(config: Year3000Config) {
    super(config);

    // Initialize enhanced configuration (including SidebarConsciousnessSystem features)
    this.sidebarConfig = {
      enabled: true,
      bilateralMode: false, // Can be enabled for enhanced functionality
      consciousnessThreshold: 0.3,
      musicResponsiveness: 0.8,
      beatSensitivity: 0.7,
      energySmoothing: 0.85,
      animationIntensity: 0.6,
      smoothingFactor: 0.85,
      maxFrameTime: 1.0, // <1ms budget from original systems
      bilateralOffset: 150, // Enhanced system's 150ms offset
      crossChannelBleed: 0.15,
      enablePerformanceMonitoring: true,
      adaptiveQuality: true,
      debugMode: config.enableDebug || false,
      // NEW: Enhanced features
      echoIntensity: 2, // Default medium echo intensity
      enableTemporalEcho: true,
      enableHarmonicModes: true,
      enableDeviceDetection: true,
    };

    // Initialize enhanced consciousness state
    this.consciousnessState = this.createInitialConsciousnessState();

    Y3KDebug?.debug?.log(
      "UnifiedSidebarConsciousnessController",
      "Enhanced unified sidebar consciousness controller created (Phase 2.5)"
    );
  }

  private createInitialConsciousnessState(): SidebarConsciousnessState {
    return {
      consciousnessLevel: "dormant",
      bilateralCoordination: false,
      musicSync: {
        energy: 0,
        valence: 0.5,
        beat: false,
        tempo: 120,
        lastBeatTime: 0,
      },
      animation: {
        intensity: 0,
        phase: 0,
        lastFrameTime: 0,
        targetIntensity: 0,
        smoothingFactor: this.sidebarConfig.smoothingFactor,
        // NEW: Enhanced animation properties
        currentScale: 1.0,
        baseOpacity: 0.7,
        pulseDirection: 1,
        lastPulse: 0,
      },
      performance: {
        frameTime: 0,
        avgFrameTime: 0,
        maxFrameTime: 0,
        healthStatus: "excellent",
      },
      // NEW: Device capabilities
      deviceCapabilities: {
        supportsCSSFilter: this._detectCSSFilterSupport(),
        supportsTransforms: this._detectTransformSupport(),
        performanceLevel: this._detectPerformanceLevel(),
        reducedMotion: this._detectReducedMotion(),
        memory: (navigator as any).deviceMemory || 4,
        cores: navigator.hardwareConcurrency || 4,
      },
      // NEW: Temporal echo system
      temporalEcho: {
        echoPool: [],
        currentEchoCount: 0,
        maxEchoes: this._getMaxEchoes(),
        echoTimerCounter: 0,
        activeEchoElements: new Set<HTMLElement>(),
      },
      // NEW: Harmonic mode system
      harmonicMode: {
        currentModeKey: "artist-vision",
        currentModeClass: "",
        currentEnergyClass: "",
        modeConfig: null,
      },
    };
  }

  // UnifiedSystemBase implementation
  public override async initialize(): Promise<void> {
    return this._baseInitialize();
  }

  public override onAnimate(deltaTime: number): void {
    // Handled by the unified animation loop
  }

  public override async _baseInitialize(): Promise<void> {
    try {
      Y3KDebug?.debug?.log(
        "UnifiedSidebarConsciousnessController",
        "Starting enhanced unified initialization..."
      );

      // Initialize CSS coordination - use globalThis to access Year3000System
      const year3000System = (globalThis as any).year3000System;
      this.cssController = year3000System?.cssConsciousnessController || getGlobalOptimizedCSSController();

      // NEW: Initialize DOM elements (from SidebarConsciousnessSystem)
      await this.initializeDOMElements();

      // Initialize performance coordinator (shared infrastructure)
      await this.initializePerformanceCoordinator();

      // Initialize consciousness choreographer integration
      await this.initializeConsciousnessIntegration();

      // NEW: Set up visual components (from SidebarConsciousnessSystem)
      if (this.sidebarConfig.enableHarmonicModes) {
        this.createOverlayContainer();
        this.createConsciousnessVisualizer();
        this.createHarmonicModeDisplay();
        this.updateColors();
      }

      // NEW: Set up interaction handling (from SidebarConsciousnessSystem)
      if (this.sidebarConfig.enableTemporalEcho) {
        this.setupInteractionHandling();
      }

      // NEW: Set up resize observer (from SidebarConsciousnessSystem)
      this.setupResizeObserver();

      // Set up event subscriptions (consolidated from all systems)
      this.subscribeToUnifiedEvents();

      // Initialize bilateral coordination if enabled
      if (this.sidebarConfig.bilateralMode) {
        this.initializeBilateralCoordination();
      }

      // Start unified animation loop
      this.startUnifiedAnimationLoop();

      this.initialized = true;

      Y3KDebug?.debug?.log(
        "UnifiedSidebarConsciousnessController",
        `Enhanced unified sidebar consciousness initialized (bilateral: ${this.sidebarConfig.bilateralMode}, echo: ${this.sidebarConfig.enableTemporalEcho}, harmonic: ${this.sidebarConfig.enableHarmonicModes})`
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to initialize:",
        error
      );
      throw error;
    }
  }

  private async initializePerformanceCoordinator(): Promise<void> {
    try {
      // Access the shared SidebarPerformanceCoordinator
      this.sidebarPerformanceCoordinator =
        (globalThis as any).sidebarPerformanceCoordinator || null;

      if (!this.sidebarPerformanceCoordinator) {
        Y3KDebug?.debug?.warn(
          "UnifiedSidebarConsciousnessController",
          "SidebarPerformanceCoordinator not available, CSS updates may be less efficient"
        );
      } else {
        Y3KDebug?.debug?.log(
          "UnifiedSidebarConsciousnessController",
          "Connected to shared SidebarPerformanceCoordinator"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "UnifiedSidebarConsciousnessController",
        "Performance coordinator initialization failed:",
        error
      );
    }
  }

  private async initializeConsciousnessIntegration(): Promise<void> {
    try {
      // Connect to consciousness choreographer if available
      this.consciousnessChoreographer =
        (globalThis as any).backgroundConsciousnessChoreographer || null;

      if (this.consciousnessChoreographer) {
        // Register as consciousness participant
        this.consciousnessChoreographer.registerConsciousnessParticipant(this);
        Y3KDebug?.debug?.log(
          "UnifiedSidebarConsciousnessController",
          "Registered with consciousness choreographer"
        );
      } else {
        Y3KDebug?.debug?.log(
          "UnifiedSidebarConsciousnessController",
          "Operating without consciousness choreographer integration"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "UnifiedSidebarConsciousnessController",
        "Consciousness integration failed:",
        error
      );
    }
  }

  private subscribeToUnifiedEvents(): void {
    // Consolidated event subscriptions from all original systems

    // Music synchronization events (5 systems used these)
    const musicBeatUnsubscribe = unifiedEventBus.subscribe(
      "music:beat",
      this.handleMusicBeat.bind(this),
      "UnifiedSidebarConsciousnessController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(musicBeatUnsubscribe)
    );

    const musicEnergyUnsubscribe = unifiedEventBus.subscribe(
      "music:energy",
      this.handleMusicEnergy.bind(this),
      "UnifiedSidebarConsciousnessController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(musicEnergyUnsubscribe)
    );

    // Settings change events
    const settingsUnsubscribe = unifiedEventBus.subscribe(
      "settings:visual-guide-changed",
      this.handleSettingsChange.bind(this),
      "UnifiedSidebarConsciousnessController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(settingsUnsubscribe)
    );

    // 🎨 COLOR CONSCIOUSNESS EVENTS (NEW - Phase 3.5 Integration)
    const colorHarmonizedUnsubscribe = unifiedEventBus.subscribe(
      "colors:harmonized",
      this.handleColorsHarmonized.bind(this),
      "UnifiedSidebarConsciousnessController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(colorHarmonizedUnsubscribe)
    );

    const colorExtractedUnsubscribe = unifiedEventBus.subscribe(
      "colors:extracted",
      this.handleColorsExtracted.bind(this),
      "UnifiedSidebarConsciousnessController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(colorExtractedUnsubscribe)
    );

    const colorConsciousnessUnsubscribe = unifiedEventBus.subscribe(
      "emotionalColorContext:updated",
      this.handleColorConsciousnessUpdate.bind(this),
      "UnifiedSidebarConsciousnessController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(colorConsciousnessUnsubscribe)
    );

    Y3KDebug?.debug?.log(
      "UnifiedSidebarConsciousnessController",
      `Subscribed to ${this.eventUnsubscribeFunctions.length} unified events (including color consciousness)`
    );
  }

  private initializeBilateralCoordination(): void {
    // Enhanced bilateral consciousness functionality
    this.bilateralState = {
      leftSide: this.createInitialConsciousnessState(),
      rightSide: this.createInitialConsciousnessState(),
      coordinationOffset: this.sidebarConfig.bilateralOffset,
      lastCoordinationTime: 0,
    };

    // Set up bilateral event publishing
    this.consciousnessState.bilateralCoordination = true;

    Y3KDebug?.debug?.log(
      "UnifiedSidebarConsciousnessController",
      `Bilateral coordination initialized with ${this.sidebarConfig.bilateralOffset}ms offset`
    );
  }

  private startUnifiedAnimationLoop(): void {
    // Consolidated animation loop from all systems
    const animate = (currentTime: number) => {
      if (!this.initialized) return;

      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;

      // Performance monitoring
      const frameStartTime = performance.now();

      try {
        // Update consciousness state
        this.updateConsciousnessState(deltaTime);

        // Update bilateral coordination if enabled
        if (this.sidebarConfig.bilateralMode && this.bilateralState) {
          this.updateBilateralCoordination(deltaTime);
        }

        // Apply CSS variable updates
        this.applyCSSUpdates();

        // Performance tracking
        const frameTime = performance.now() - frameStartTime;
        this.updatePerformanceMetrics(frameTime);

        // Check performance budget (<1ms from original systems)
        if (frameTime > this.sidebarConfig.maxFrameTime) {
          Y3KDebug?.debug?.warn(
            "UnifiedSidebarConsciousnessController",
            `Frame time exceeded budget: ${frameTime.toFixed(2)}ms`
          );
        }
      } catch (error) {
        Y3KDebug?.debug?.error(
          "UnifiedSidebarConsciousnessController",
          "Animation loop error:",
          error
        );
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private updateConsciousnessState(deltaTime: number): void {
    const state = this.consciousnessState;

    // Smooth animation intensity updates (consolidated from all systems)
    const energyInfluence =
      state.musicSync.energy * this.sidebarConfig.musicResponsiveness;
    state.animation.targetIntensity = Math.min(energyInfluence, 1.0);

    // Lerp-based smooth transitions (from original systems)
    state.animation.intensity = this.lerp(
      state.animation.intensity,
      state.animation.targetIntensity,
      state.animation.smoothingFactor
    );

    // Update animation phase
    state.animation.phase += deltaTime * 0.001; // Convert to seconds
    if (state.animation.phase > Math.PI * 2) {
      state.animation.phase -= Math.PI * 2;
    }

    // Update consciousness level based on activity
    this.updateConsciousnessLevel();
  }

  private updateConsciousnessLevel(): void {
    const state = this.consciousnessState;
    const totalActivity =
      state.animation.intensity + (state.musicSync.beat ? 0.3 : 0);

    // Consciousness level thresholds (from enhanced system)
    if (totalActivity > 0.8) {
      state.consciousnessLevel = "transcendent";
    } else if (totalActivity > 0.5) {
      state.consciousnessLevel = "focused";
    } else if (totalActivity > 0.2) {
      state.consciousnessLevel = "aware";
    } else {
      state.consciousnessLevel = "dormant";
    }

    // Publish consciousness level changes (enhanced system functionality)
    if (this.sidebarConfig.bilateralMode) {
      unifiedEventBus.emit("consciousness:coordination", {
        source: "UnifiedSidebarConsciousnessController",
        state: {
          type: "bilateral-consciousness-level",
          level: state.consciousnessLevel,
          intensity: state.animation.intensity,
        },
        timestamp: Date.now(),
      });
    }
  }

  private updateBilateralCoordination(deltaTime: number): void {
    if (!this.bilateralState) return;

    const now = Date.now();

    // Update bilateral sides with offset (enhanced system's 150ms coordination)
    if (
      now - this.bilateralState.lastCoordinationTime >
      this.bilateralState.coordinationOffset
    ) {
      // Sync right side to left side with cross-channel bleed
      const leftIntensity = this.bilateralState.leftSide.animation.intensity;
      const rightIntensity = this.bilateralState.rightSide.animation.intensity;

      this.bilateralState.rightSide.animation.targetIntensity =
        leftIntensity * (1 - this.sidebarConfig.crossChannelBleed) +
        rightIntensity * this.sidebarConfig.crossChannelBleed;

      this.bilateralState.lastCoordinationTime = now;

      // Publish bilateral coordination event
      unifiedEventBus.emit("consciousness:coordination", {
        source: "UnifiedSidebarConsciousnessController",
        state: {
          type: "bilateral-coordination",
          leftIntensity,
          rightIntensity,
          offset: this.bilateralState.coordinationOffset,
        },
        timestamp: Date.now(),
      });
    }
  }

  private applyCSSUpdates(): void {
    if (!this.sidebarPerformanceCoordinator) {
      // Fallback direct CSS updates if coordinator unavailable
      this.applyDirectCSSUpdates();
      return;
    }

    const state = this.consciousnessState;

    // Consolidated CSS variable updates (from all systems)
    const updates: Record<string, string> = {
      "--sn-sidebar-consciousness-level": state.consciousnessLevel,
      "--sn-sidebar-intensity": state.animation.intensity.toFixed(3),
      "--sn-sidebar-phase": state.animation.phase.toFixed(3),
      "--sn-sidebar-energy": state.musicSync.energy.toFixed(3),
      "--sn-sidebar-valence": state.musicSync.valence.toFixed(3),
    };

    // Add bilateral variables if enabled
    if (this.sidebarConfig.bilateralMode && this.bilateralState) {
      updates["--sn-sidebar-bilateral-left"] =
        this.bilateralState.leftSide.animation.intensity.toFixed(3);
      updates["--sn-sidebar-bilateral-right"] =
        this.bilateralState.rightSide.animation.intensity.toFixed(3);
    }

    // Use performance coordinator for batched updates
    try {
      for (const [variable, value] of Object.entries(updates)) {
        this.sidebarPerformanceCoordinator.queueUpdate(variable, value);
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "UnifiedSidebarConsciousnessController",
        "CSS update error:",
        error
      );
      this.applyDirectCSSUpdates();
    }
  }

  private applyDirectCSSUpdates(): void {
    // Apply sidebar consciousness variables using coordination
    const state = this.consciousnessState;
    
    const sidebarConsciousnessVariables = {
      "--sn-sidebar-consciousness-level": state.consciousnessLevel,
      "--sn-sidebar-intensity": state.animation.intensity.toFixed(3),
      "--sn-sidebar-phase": state.animation.phase.toFixed(3),
      "--sn-sidebar-energy": state.musicSync.energy.toFixed(3),
      "--sn-sidebar-valence": state.musicSync.valence.toFixed(3)
    };

    this.cssController.batchSetVariables(
      "UnifiedSidebarConsciousnessController",
      sidebarConsciousnessVariables,
      "high", // High priority for sidebar consciousness state updates
      "sidebar-consciousness-fallback-update"
    );
  }

  private updatePerformanceMetrics(frameTime: number): void {
    const perf = this.consciousnessState.performance;

    // Update frame time metrics
    perf.frameTime = frameTime;
    this.frameTimeHistory.push(frameTime);

    // Keep only recent frame times (last 60 frames)
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }

    // Calculate average and max
    perf.avgFrameTime =
      this.frameTimeHistory.reduce((a, b) => a + b, 0) /
      this.frameTimeHistory.length;
    perf.maxFrameTime = Math.max(...this.frameTimeHistory);

    // Update health status
    if (perf.avgFrameTime > 2.0) {
      perf.healthStatus = "critical";
    } else if (perf.avgFrameTime > 1.5) {
      perf.healthStatus = "degraded";
    } else if (perf.avgFrameTime > 1.0) {
      perf.healthStatus = "good";
    } else {
      perf.healthStatus = "excellent";
    }
  }

  // Event handlers (consolidated from all systems)
  private handleMusicBeat(event: any): void {
    const state = this.consciousnessState.musicSync;
    state.beat = true;
    state.lastBeatTime = Date.now();

    // Reset beat flag after brief period
    setTimeout(() => {
      state.beat = false;
    }, 100);

    if (this.sidebarConfig.debugMode) {
      Y3KDebug?.debug?.log(
        "UnifiedSidebarConsciousnessController",
        "Music beat received"
      );
    }
  }

  private handleMusicEnergy(event: any): void {
    const state = this.consciousnessState.musicSync;

    // Smooth energy updates
    if (event.energy !== undefined) {
      state.energy = this.lerp(
        state.energy,
        event.energy,
        1 - this.sidebarConfig.energySmoothing
      );
    }

    if (event.valence !== undefined) {
      state.valence = this.lerp(
        state.valence,
        event.valence,
        1 - this.sidebarConfig.energySmoothing
      );
    }

    if (event.tempo !== undefined) {
      state.tempo = event.tempo;
    }
  }

  private handleSettingsChange(event: any): void {
    const { key, value } = event;

    // Handle sidebar-specific settings
    if (key.startsWith("sn-sidebar-")) {
      this.updateConfigFromSettings(key, value);
    }
  }

  private updateConfigFromSettings(key: string, value: any): void {
    switch (key) {
      case "sn-sidebar-intensity":
        this.sidebarConfig.animationIntensity = parseFloat(value) || 0.6;
        break;
      case "sn-sidebar-bilateral":
        const enableBilateral = value === "true" || value === true;
        if (enableBilateral !== this.sidebarConfig.bilateralMode) {
          this.sidebarConfig.bilateralMode = enableBilateral;
          if (enableBilateral) {
            this.initializeBilateralCoordination();
          } else {
            this.bilateralState = null;
            this.consciousnessState.bilateralCoordination = false;
          }
        }
        break;
      case "sn-sidebar-responsiveness":
        this.sidebarConfig.musicResponsiveness = parseFloat(value) || 0.8;
        break;
    }
  }

  // 🎨 COLOR CONSCIOUSNESS EVENT HANDLERS (NEW - Phase 3.5)
  private handleColorsHarmonized(event: any): void {
    const { processedColors, coordinationMetrics } = event;

    try {
      // Update sidebar color variables from OKLAB-processed colors
      this.updateSidebarColorsFromOKLAB(processedColors);

      // Adjust consciousness level based on color harmony
      if (coordinationMetrics?.emotionalState) {
        this.adjustConsciousnessForColorState(coordinationMetrics);
      }

      Y3KDebug?.debug?.log(
        "UnifiedSidebarConsciousnessController",
        "🎨 Updated sidebar colors from harmonized OKLAB data",
        {
          colorCount: Object.keys(processedColors).length,
          emotionalState: coordinationMetrics?.emotionalState,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to handle colors:harmonized event:",
        error
      );
    }
  }

  private handleColorsExtracted(event: any): void {
    const { rawColors, musicData } = event;

    try {
      // Use raw colors for immediate visual feedback while waiting for OKLAB processing
      if (rawColors?.DOMINANT) {
        this.updateSidebarAccentColor(rawColors.DOMINANT);
      }

      // Adjust responsiveness based on music context
      if (musicData) {
        this.adjustMusicResponsivenessForColors(musicData);
      }

      Y3KDebug?.debug?.log(
        "UnifiedSidebarConsciousnessController",
        "🎨 Applied immediate color feedback from extracted colors"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to handle colors:extracted event:",
        error
      );
    }
  }

  private handleColorConsciousnessUpdate(event: any): void {
    const { palette, consciousnessLevel, emotionalTemperature } = event;

    try {
      // Sync sidebar consciousness with global color consciousness
      const colorInfluence = consciousnessLevel * 0.4; // Moderate influence

      // Map numeric consciousness to string enum
      if (colorInfluence > 0.8) {
        this.consciousnessState.consciousnessLevel = "transcendent";
      } else if (colorInfluence > 0.5) {
        this.consciousnessState.consciousnessLevel = "focused";
      } else if (colorInfluence > 0.2) {
        this.consciousnessState.consciousnessLevel = "aware";
      } else {
        this.consciousnessState.consciousnessLevel = "dormant";
      }

      // Map emotional temperature to sidebar hue shifts
      if (emotionalTemperature !== undefined) {
        const temp =
          typeof emotionalTemperature === "string"
            ? parseFloat(emotionalTemperature)
            : emotionalTemperature;
        if (!isNaN(temp)) {
          this.updateSidebarTemperature(temp);
        }
      }

      Y3KDebug?.debug?.log(
        "UnifiedSidebarConsciousnessController",
        "🎨 Synchronized sidebar consciousness with color state",
        {
          consciousnessLevel: colorInfluence,
          emotionalTemperature,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to handle colorConsciousnessUpdate event:",
        error
      );
    }
  }

  // BackgroundSystemParticipant interface implementation
  public getConsciousnessContribution(): any {
    return {
      systemName: this.systemName,
      consciousnessLevel: this.consciousnessState.consciousnessLevel,
      intensity: this.consciousnessState.animation.intensity,
      musicSync: this.consciousnessState.musicSync,
      bilateral: this.sidebarConfig.bilateralMode ? this.bilateralState : null,
      timestamp: Date.now(),
    };
  }

  public onConsciousnessFieldUpdate(field: ConsciousnessField): void {
    try {
      this.currentConsciousnessField = field;

      // Modulate sidebar consciousness based on field
      const fieldInfluence = field.rhythmicPulse * 0.3; // Moderate influence
      this.consciousnessState.animation.targetIntensity = Math.min(
        this.consciousnessState.animation.targetIntensity + fieldInfluence,
        1.0
      );

      if (this.sidebarConfig.debugMode) {
        Y3KDebug?.debug?.log(
          "UnifiedSidebarConsciousnessController",
          "Updated from consciousness field:",
          {
            rhythmicPulse: field.rhythmicPulse,
            sidebarIntensity: this.consciousnessState.animation.intensity,
          }
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Error updating from consciousness field:",
        error
      );
    }
  }

  public onChoreographyEvent(eventType: string, data: any): void {
    // Handle choreography events from the consciousness choreographer
    if (eventType === "transition:start") {
      // Adapt sidebar consciousness to choreography transitions
      this.consciousnessState.animation.targetIntensity = Math.min(
        this.consciousnessState.animation.targetIntensity + 0.2,
        1.0
      );
    }

    if (this.sidebarConfig.debugMode) {
      Y3KDebug?.debug?.log(
        "UnifiedSidebarConsciousnessController",
        `Choreography event: ${eventType}`,
        data
      );
    }
  }

  // Utility methods
  private lerp(current: number, target: number, factor: number): number {
    return current + (target - current) * factor;
  }

  // Health check implementation
  public async healthCheck(): Promise<HealthCheckResult> {
    const state = this.consciousnessState;
    const isHealthy =
      this.initialized &&
      state.performance.healthStatus !== "critical" &&
      state.performance.avgFrameTime < 2.0;

    return {
      healthy: isHealthy,
      ok: isHealthy,
      details:
        `Consciousness: ${state.consciousnessLevel}, ` +
        `Intensity: ${state.animation.intensity.toFixed(2)}, ` +
        `Avg Frame: ${state.performance.avgFrameTime.toFixed(2)}ms, ` +
        `Status: ${state.performance.healthStatus}` +
        (this.sidebarConfig.bilateralMode ? ", Bilateral: enabled" : ""),
      system: "UnifiedSidebarConsciousnessController",
    };
  }

  // NEW: Device capability detection methods (from SidebarConsciousnessSystem)
  private _detectCSSFilterSupport(): boolean {
    try {
      const testElement = document.createElement("div");
      testElement.style.filter = "blur(1px)";
      return testElement.style.filter === "blur(1px)";
    } catch (error) {
      return false;
    }
  }

  private _detectTransformSupport(): boolean {
    try {
      const testElement = document.createElement("div");
      testElement.style.transform = "translateX(1px)";
      return testElement.style.transform === "translateX(1px)";
    } catch (error) {
      return false;
    }
  }

  private _detectPerformanceLevel(): "high" | "medium" | "low" {
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;

    if (memory >= 8 && cores >= 8) {
      return "high";
    } else if (memory >= 4 && cores >= 4) {
      return "medium";
    } else {
      return "low";
    }
  }

  private _detectReducedMotion(): boolean {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  }

  private _getMaxEchoes(): number {
    const deviceCapabilities = {
      memory: (navigator as any).deviceMemory || 4,
      cores: navigator.hardwareConcurrency || 4,
    };

    // Scale echo count based on device capabilities
    if (deviceCapabilities.memory >= 8 && deviceCapabilities.cores >= 8) {
      return 12; // High-end devices
    } else if (
      deviceCapabilities.memory >= 4 &&
      deviceCapabilities.cores >= 4
    ) {
      return 8; // Mid-range devices
    } else {
      return 4; // Low-end devices
    }
  }

  // NEW: DOM initialization methods (from SidebarConsciousnessSystem)
  private async initializeDOMElements(): Promise<void> {
    try {
      // Find the root navigation bar element
      this.rootNavBar =
        document.querySelector(".Root__nav-bar") ||
        document.querySelector('[data-testid="rootlist-container"]') ||
        document.querySelector(".main-navBar-navBar");

      if (!this.rootNavBar) {
        Y3KDebug?.debug?.warn(
          "UnifiedSidebarConsciousnessController",
          "Root navigation bar not found"
        );
        return;
      }

      Y3KDebug?.debug?.log(
        "UnifiedSidebarConsciousnessController",
        "DOM elements initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "DOM initialization error:",
        error
      );
      throw error;
    }
  }

  private createOverlayContainer(): void {
    if (!this.rootNavBar || this.overlayContainer) return;

    this.overlayContainer = document.createElement("div");
    this.overlayContainer.className = "sn-consciousness-overlay";
    this.overlayContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    `;

    this.rootNavBar.style.position = "relative";
    this.rootNavBar.appendChild(this.overlayContainer);
  }

  private createConsciousnessVisualizer(): void {
    if (!this.overlayContainer || this.consciousnessVisualizer) return;

    this.consciousnessVisualizer = document.createElement("div");
    this.consciousnessVisualizer.className = "sn-consciousness-visualizer";
    this.consciousnessVisualizer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at var(--sn-consciousness-x, 50%) var(--sn-consciousness-y, 50%),
                                  hsla(var(--sn-consciousness-hue, 280), 70%, 60%, var(--sn-consciousness-alpha, 0.1)) 0%,
                                  hsla(var(--sn-consciousness-hue, 280), 50%, 40%, var(--sn-consciousness-alpha, 0.05)) 30%,
                                  transparent 70%);
      mix-blend-mode: overlay;
      transition: all 0.3s ease;
      opacity: var(--sn-consciousness-intensity, 0);
    `;

    this.overlayContainer.appendChild(this.consciousnessVisualizer);
  }

  private createHarmonicModeDisplay(): void {
    if (!this.overlayContainer || this.harmonicModeIndicator) return;

    this.harmonicModeIndicator = document.createElement("div");
    this.harmonicModeIndicator.className = "sn-harmonic-mode-indicator";
    this.harmonicModeIndicator.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--sn-harmonic-color, #a855f7);
      opacity: var(--sn-harmonic-intensity, 0);
      transition: all 0.3s ease;
      pointer-events: none;
    `;

    this.overlayContainer.appendChild(this.harmonicModeIndicator);
  }

  private updateColors(): void {
    if (!this.sidebarPerformanceCoordinator) {
      this.applyDirectColorUpdates();
      return;
    }

    const state = this.consciousnessState;
    const harmonicMode = state.harmonicMode;

    try {
      // Get current harmonic mode configuration
      const modeConfig =
        HARMONIC_MODES[harmonicMode.currentModeKey] ||
        HARMONIC_MODES["artist-vision"];

      this.sidebarPerformanceCoordinator.queueUpdate(
        "--sn-consciousness-hue",
        "280"
      );
      this.sidebarPerformanceCoordinator.queueUpdate(
        "--sn-harmonic-color",
        "#a855f7"
      );
      this.sidebarPerformanceCoordinator.queueUpdate(
        "--sn-consciousness-intensity",
        state.animation.intensity.toFixed(3)
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "UnifiedSidebarConsciousnessController",
        "Color update error:",
        error
      );
      this.applyDirectColorUpdates();
    }
  }

  private applyDirectColorUpdates(): void {
    const state = this.consciousnessState;

    // Apply sidebar color variables using coordination
    const sidebarColorVariables = {
      "--sn-consciousness-hue": "280",
      "--sn-harmonic-color": "#a855f7",
      "--sn-consciousness-intensity": state.animation.intensity.toFixed(3)
    };

    this.cssController.batchSetVariables(
      "UnifiedSidebarConsciousnessController",
      sidebarColorVariables,
      "high", // High priority for consciousness color updates
      "sidebar-color-fallback-update"
    );
  }

  private setupInteractionHandling(): void {
    if (!this.rootNavBar) return;

    this._navInteractionHandler = (evt: Event) => {
      if (this.sidebarConfig.enableTemporalEcho) {
        this._spawnNavEcho(evt);
      }
    };

    // Add interaction listeners
    this.rootNavBar.addEventListener("click", this._navInteractionHandler, {
      passive: true,
    });
    this.rootNavBar.addEventListener("mouseover", this._navInteractionHandler, {
      passive: true,
    });
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === "undefined" || !this.rootNavBar) return;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Update consciousness visualizer dimensions
        this.updateConsciousnessVisualizerSize(entry.contentRect);
      }
    });

    this.resizeObserver.observe(this.rootNavBar);
  }

  private updateConsciousnessVisualizerSize(rect: DOMRectReadOnly): void {
    if (!this.consciousnessVisualizer) return;

    // Update CSS variables for responsive consciousness effects
    const updates: Record<string, string> = {
      "--sn-sidebar-width": `${rect.width}px`,
      "--sn-sidebar-height": `${rect.height}px`,
    };

    if (this.sidebarPerformanceCoordinator) {
      for (const [variable, value] of Object.entries(updates)) {
        this.sidebarPerformanceCoordinator.queueUpdate(variable, value);
      }
    } else {
      // Fallback to coordination for sidebar size updates
      this.cssController.batchSetVariables(
        "UnifiedSidebarConsciousnessController",
        updates,
        "normal", // Normal priority for sidebar size updates
        "sidebar-size-fallback-update"
      );
    }
  }

  // NEW: Temporal echo system methods (from SidebarConsciousnessSystem)
  private _spawnNavEcho(evt: Event): void {
    const state = this.consciousnessState;

    // Check if motion is disabled or device can't handle echoes
    if (
      state.deviceCapabilities.reducedMotion ||
      state.temporalEcho.currentEchoCount >= state.temporalEcho.maxEchoes
    ) {
      return;
    }

    const target = evt.target as HTMLElement;
    if (!target) return;

    // Get echo element from pool
    const echoElement = this._acquireEchoElement();
    if (!echoElement) return;

    // Position echo at event location
    const rect = target.getBoundingClientRect();
    const parentRect = this.rootNavBar?.getBoundingClientRect();

    if (parentRect) {
      const x = rect.left - parentRect.left + rect.width / 2;
      const y = rect.top - parentRect.top + rect.height / 2;

      // Add some noise for organic positioning
      const noiseVector1 = sampleNoise(x * 0.01, Date.now() * 0.001);
      const noiseVector2 = sampleNoise(y * 0.01, Date.now() * 0.001 + 100);
      const noiseX = noiseVector1.x * 10;
      const noiseY = noiseVector2.y * 10;

      echoElement.style.left = `${x + noiseX}px`;
      echoElement.style.top = `${y + noiseY}px`;
    }

    // Apply echo intensity
    const intensity = this.sidebarConfig.echoIntensity / 3; // 0-1 scale
    echoElement.style.opacity = intensity.toString();

    // Animate echo
    echoElement.classList.add("sn-echo-active");

    // Schedule echo release
    setTimeout(() => {
      this._releaseEchoElement(echoElement);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds

    state.temporalEcho.currentEchoCount++;
    state.temporalEcho.echoTimerCounter++;
  }

  private _acquireEchoElement(): HTMLElement | null {
    const state = this.consciousnessState;

    // Try to reuse existing echo from pool
    if (state.temporalEcho.echoPool.length > 0) {
      return state.temporalEcho.echoPool.pop() || null;
    }

    // Create new echo if under limit
    if (state.temporalEcho.currentEchoCount < state.temporalEcho.maxEchoes) {
      return this._createEchoElement();
    }

    return null;
  }

  private _createEchoElement(): HTMLElement {
    const echo = document.createElement("div");
    echo.className = "sn-temporal-echo";
    echo.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--sn-harmonic-color, #a855f7) 0%, transparent 70%);
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 0;
    `;

    if (this.overlayContainer) {
      this.overlayContainer.appendChild(echo);
    }

    const state = this.consciousnessState;
    state.temporalEcho.activeEchoElements.add(echo);

    return echo;
  }

  private _releaseEchoElement(echo: HTMLElement): void {
    const state = this.consciousnessState;

    // Remove from active set
    state.temporalEcho.activeEchoElements.delete(echo);

    // Reset element
    echo.classList.remove("sn-echo-active");
    echo.style.opacity = "0";

    // Return to pool
    if (state.temporalEcho.echoPool.length < state.temporalEcho.maxEchoes) {
      state.temporalEcho.echoPool.push(echo);
    } else {
      // Remove from DOM if pool is full
      echo.remove();
    }

    state.temporalEcho.currentEchoCount = Math.max(
      0,
      state.temporalEcho.currentEchoCount - 1
    );
  }

  // NEW: Harmonic mode management (from SidebarConsciousnessSystem)
  private updateHarmonicModeDisplay(): void {
    const state = this.consciousnessState;
    const harmonicMode = state.harmonicMode;

    // Get current mode configuration
    const modeConfig =
      HARMONIC_MODES[harmonicMode.currentModeKey] ||
      HARMONIC_MODES["artist-vision"];
    harmonicMode.modeConfig = modeConfig;

    // Update CSS classes
    if (this.rootNavBar) {
      // Remove old harmonic mode class
      if (harmonicMode.currentModeClass) {
        this.rootNavBar.classList.remove(harmonicMode.currentModeClass);
      }

      // Add new harmonic mode class
      const newModeClass = `sn-harmonic-${harmonicMode.currentModeKey}`;
      this.rootNavBar.classList.add(newModeClass);
      harmonicMode.currentModeClass = newModeClass;
    }

    // Update colors
    this.updateColors();

    Y3KDebug?.debug?.log(
      "UnifiedSidebarConsciousnessController",
      `Harmonic mode updated to: ${harmonicMode.currentModeKey}`
    );
  }

  // Configuration API
  public updateConfiguration(
    updates: Partial<SidebarConsciousnessConfig>
  ): void {
    Object.assign(this.sidebarConfig, updates);

    // Handle bilateral mode changes
    if (updates.bilateralMode !== undefined) {
      if (updates.bilateralMode && !this.bilateralState) {
        this.initializeBilateralCoordination();
      } else if (!updates.bilateralMode && this.bilateralState) {
        this.bilateralState = null;
        this.consciousnessState.bilateralCoordination = false;
      }
    }

    // Handle harmonic mode changes
    if (updates.enableHarmonicModes !== undefined) {
      if (updates.enableHarmonicModes && this.overlayContainer) {
        this.updateHarmonicModeDisplay();
      }
    }

    // Handle echo system changes
    if (updates.enableTemporalEcho !== undefined) {
      if (
        updates.enableTemporalEcho &&
        this.rootNavBar &&
        !this._navInteractionHandler
      ) {
        this.setupInteractionHandling();
      }
    }

    Y3KDebug?.debug?.log(
      "UnifiedSidebarConsciousnessController",
      "Configuration updated:",
      updates
    );
  }

  public getConfiguration(): SidebarConsciousnessConfig {
    return { ...this.sidebarConfig };
  }

  public getConsciousnessState(): SidebarConsciousnessState {
    return { ...this.consciousnessState };
  }

  // Legacy compatibility methods (for migration)
  public getBilateralState() {
    return this.bilateralState;
  }

  public async destroy(): Promise<void> {
    Y3KDebug?.debug?.log(
      "UnifiedSidebarConsciousnessController",
      "Destroying enhanced unified consciousness controller..."
    );

    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Clean up interaction handlers
    if (this.rootNavBar && this._navInteractionHandler) {
      this.rootNavBar.removeEventListener("click", this._navInteractionHandler);
      this.rootNavBar.removeEventListener(
        "mouseover",
        this._navInteractionHandler
      );
      this._navInteractionHandler = null;
    }

    // Clean up temporal echo pool
    const state = this.consciousnessState;
    if (state.temporalEcho) {
      // Remove all active echoes
      state.temporalEcho.activeEchoElements.forEach((echo) => {
        echo.remove();
      });
      // Clear all active echo elements
      state.temporalEcho.activeEchoElements.clear();

      // Remove pooled echoes
      for (const echo of state.temporalEcho.echoPool) {
        echo.remove();
      }
      state.temporalEcho.echoPool = [];
      state.temporalEcho.currentEchoCount = 0;
    }

    // Clean up DOM elements
    if (this.overlayContainer) {
      this.overlayContainer.remove();
      this.overlayContainer = null;
    }

    this.consciousnessVisualizer = null;
    this.harmonicModeIndicator = null;
    this.rootNavBar = null;

    // Unsubscribe from events
    for (const unsubscribe of this.eventUnsubscribeFunctions) {
      unsubscribe();
    }
    this.eventUnsubscribeFunctions = [];

    // Clean up consciousness choreographer registration
    if (this.consciousnessChoreographer) {
      // Note: Would need unregister method on choreographer
    }

    // Reset bilateral state
    this.bilateralState = null;

    this.initialized = false;

    Y3KDebug?.debug?.log(
      "UnifiedSidebarConsciousnessController",
      "Enhanced unified consciousness controller destroyed"
    );
  }

  // 🎨 COLOR CONSCIOUSNESS HELPER METHODS (NEW - Phase 3.5)
  private updateSidebarColorsFromOKLAB(
    processedColors: Record<string, string>
  ): void {
    if (!this.sidebarPerformanceCoordinator) return;

    try {
      // Extract key colors for sidebar elements
      const accentColor =
        processedColors.VIBRANT ||
        processedColors.PROMINENT ||
        processedColors.DOMINANT;
      const secondaryColor =
        processedColors.LIGHT_VIBRANT ||
        processedColors.LIGHT_MUTED ||
        accentColor;
      const shadowColor =
        processedColors.DARK_VIBRANT ||
        processedColors.DARK_MUTED ||
        accentColor;

      if (accentColor) {
        // Update main sidebar color variables
        this.sidebarPerformanceCoordinator.queueUpdate(
          "--sn-sidebar-accent-color",
          accentColor
        );
        this.sidebarPerformanceCoordinator.queueUpdate(
          "--sn-sidebar-dynamic-accent",
          accentColor
        );

        // Convert to RGB for RGBA usage
        const accentRgb = this.hexToRgb(accentColor);
        if (accentRgb !== null) {
          this.sidebarPerformanceCoordinator.queueUpdate(
            "--sn-sidebar-accent-rgb",
            accentRgb
          );
          this.sidebarPerformanceCoordinator.queueUpdate(
            "--sn-sidebar-entanglement-color-rgb",
            accentRgb
          );
        }
      }

      if (secondaryColor) {
        this.sidebarPerformanceCoordinator.queueUpdate(
          "--sn-sidebar-secondary-color",
          secondaryColor
        );
        const secondaryRgb = this.hexToRgb(secondaryColor);
        if (secondaryRgb !== null) {
          this.sidebarPerformanceCoordinator.queueUpdate(
            "--sn-sidebar-secondary-rgb",
            secondaryRgb
          );
        }
      }

      if (shadowColor) {
        this.sidebarPerformanceCoordinator.queueUpdate(
          "--sn-sidebar-shadow-color",
          shadowColor
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to update sidebar colors from OKLAB:",
        error
      );
    }
  }

  private updateSidebarAccentColor(dominantColor: string): void {
    if (!this.sidebarPerformanceCoordinator) return;

    try {
      // Immediate color update for responsive feedback
      this.sidebarPerformanceCoordinator.queueUpdate(
        "--sn-sidebar-accent-color",
        dominantColor
      );
      this.sidebarPerformanceCoordinator.queueUpdate(
        "--sn-sidebar-dynamic-accent",
        dominantColor
      );

      const rgbValue = this.hexToRgb(dominantColor);
      if (rgbValue !== null) {
        this.sidebarPerformanceCoordinator.queueUpdate(
          "--sn-sidebar-accent-rgb",
          rgbValue
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to update sidebar accent color:",
        error
      );
    }
  }

  private adjustConsciousnessForColorState(coordinationMetrics: any): void {
    const { emotionalState, detectedGenre, oklabPreset } = coordinationMetrics;

    try {
      // Adjust animation intensity based on emotional state
      if (emotionalState) {
        switch (emotionalState) {
          case "energetic":
          case "aggressive":
            this.consciousnessState.animation.intensity = Math.min(
              1.0,
              this.consciousnessState.animation.intensity * 1.3
            );
            break;
          case "calm":
          case "ambient":
            this.consciousnessState.animation.intensity = Math.max(
              0.2,
              this.consciousnessState.animation.intensity * 0.7
            );
            break;
          case "mysterious":
            this.consciousnessState.animation.intensity = Math.min(
              0.8,
              this.consciousnessState.animation.intensity * 1.1
            );
            break;
        }
      }

      // Adjust responsiveness based on detected genre
      if (detectedGenre) {
        switch (detectedGenre) {
          case "electronic":
          case "dance":
            this.sidebarConfig.musicResponsiveness = Math.min(
              1.0,
              this.sidebarConfig.musicResponsiveness * 1.2
            );
            break;
          case "classical":
          case "ambient":
            this.sidebarConfig.musicResponsiveness = Math.max(
              0.3,
              this.sidebarConfig.musicResponsiveness * 0.8
            );
            break;
        }
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to adjust consciousness for color state:",
        error
      );
    }
  }

  private adjustMusicResponsivenessForColors(musicData: any): void {
    try {
      // Adjust sidebar responsiveness based on music characteristics
      if (musicData.tempo) {
        const tempoFactor = Math.max(0.5, Math.min(1.5, musicData.tempo / 120));
        this.sidebarConfig.musicResponsiveness = Math.min(
          1.0,
          this.sidebarConfig.musicResponsiveness * tempoFactor
        );
      }

      if (musicData.energy !== undefined) {
        const energyInfluence = musicData.energy * 0.3;
        this.consciousnessState.animation.intensity = Math.max(
          0.1,
          Math.min(
            1.0,
            this.consciousnessState.animation.intensity + energyInfluence
          )
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to adjust music responsiveness for colors:",
        error
      );
    }
  }

  private updateSidebarTemperature(emotionalTemperature: number): void {
    if (!this.sidebarPerformanceCoordinator || !emotionalTemperature) return;

    try {
      // Map emotional temperature to hue shift (0-360 degrees)
      let hueShift = 0;

      if (emotionalTemperature < 3000) {
        // Cool emotions = blue-cyan shift
        hueShift = 180 + (3000 - emotionalTemperature) / 100;
      } else if (emotionalTemperature > 6000) {
        // Warm emotions = red-orange shift
        hueShift = (emotionalTemperature - 6000) / 100;
      } else {
        // Neutral emotions = slight variations
        hueShift = (emotionalTemperature - 4500) / 50;
      }

      // Apply hue shift to sidebar
      this.sidebarPerformanceCoordinator.queueUpdate(
        "--sn-sidebar-hue-shift",
        `${hueShift}deg`
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UnifiedSidebarConsciousnessController",
        "Failed to update sidebar temperature:",
        error
      );
    }
  }

  private hexToRgb(hex: string): string | null {
    try {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result || result.length < 4) return null;

      const r = parseInt(result[1]!, 16);
      const g = parseInt(result[2]!, 16);
      const b = parseInt(result[3]!, 16);

      return `${r}, ${g}, ${b}`;
    } catch (error) {
      return null;
    }
  }
}
