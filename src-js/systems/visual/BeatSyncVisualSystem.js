import { Year3000Utilities } from "../../utils/Year3000Utilities.js";
import { BaseVisualSystem } from "../BaseVisualSystem.js";

// YEAR 3000 BEATSYNC VISUAL SYSTEM
export class BeatSyncVisualSystem extends BaseVisualSystem {
  constructor(
    config,
    utils,
    performanceMonitor,
    musicSyncService,
    settingsManager,
    year3000System = null // PERFORMANCE OPTIMIZATION: Master Animation Coordinator access
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);

    // === PERFORMANCE OPTIMIZATION: Store reference to Year3000System ===
    this.year3000System = year3000System;

    this.beatFlashElement = null;
    this.animationFrameId = null;
    this.lastBeatTime = 0;
    this.beatIntensity = 0; // Current intensity, fades over time

    // NEW: Enhanced BPM synchronization properties (inspired by Cat Jam)
    this.currentBPM = 120;
    this.enhancedBPM = 120;
    this.beatInterval = 60000 / 120; // Milliseconds between beats
    this.nextBeatTime = 0;
    this.beatTimer = null;
    this.trackStartTime = Date.now();
    this.isSyncActive = false;
    this.beatCount = 0;

    // NEW: Rhythm phase tracking for breathing animations
    this.currentRhythmPhase = 0; // Current rhythm phase (0 to 2π)
    this.lastAnimationTime = performance.now(); // For delta time calculations
    this.performanceMetrics = {
      animationUpdates: 0,
      cssVariableUpdates: 0,
      memoryStartTime: performance.now(),
      memoryStartSize: this._getMemoryUsage(),
    }; // Track performance overhead

    this.isAnimating = false;
    this.animationFrameId = null;

    // NEW: Performance monitoring for Phase 6
    this.lastMemoryUsage = 0;
    this.frameCount = 0;
    this.performanceStartTime = Date.now();
    this.errorCount = 0;

    // NEW: Performance optimization flags
    this._performanceMode = false;
    this._reducedQualityMode = false;

    // Register with health monitor if available
    if (this.utils && this.utils.systemHealthMonitor) {
      this.utils.systemHealthMonitor.registerSystem(
        "BeatSyncVisualSystem",
        this
      );
    }

    // Register with centralized health monitor
    const healthMonitor = this.utils.getHealthMonitor();
    if (healthMonitor) {
      healthMonitor.registerSystem("BeatSyncVisualSystem", this);
    }

    if (this.config.enableDebug) {
      console.log(
        `[${this.systemName} Constructor] Initialized with Master Animation Coordinator support.`
      );
    }
  }

  _getMemoryUsage() {
    // Use performance.memory API if available, otherwise return 0
    if (typeof performance !== "undefined" && performance.memory) {
      return performance.memory.usedJSHeapSize || 0;
    }
    return 0;
  }

  async initialize() {
    await super.initialize();
    this._createBeatFlashElement();
    this._startAnimationLoop();
    if (this.config.enableDebug) {
      console.log(
        `[${this.systemName}] Initialized and animation loop started.`
      );
    }
  }

  _createBeatFlashElement() {
    this.beatFlashElement = document.createElement("div");
    this.beatFlashElement.id = "sn-beat-flash";
    this.beatFlashElement.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      background-color: rgba(255, 255, 255, 0);
      opacity: 0;
      z-index: 2;
      transition: background-color 150ms ease-out, opacity 250ms ease-out;
    `;
    document.body.appendChild(this.beatFlashElement);
  }

  _startAnimationLoop() {
    // === PERFORMANCE OPTIMIZATION: Register with Master Animation Coordinator ===
    if (this.year3000System && this.year3000System.registerAnimationSystem) {
      this.year3000System.registerAnimationSystem(
        "BeatSyncVisualSystem",
        this,
        "critical", // Critical priority for music synchronization
        60 // 60fps target
      );

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Registered with Master Animation Coordinator (critical priority)`
        );
      }
    } else {
      // Fallback to original self-managed loop if Master Animation Coordinator not available
      console.warn(
        `[${this.systemName}] Master Animation Coordinator not available, using fallback loop`
      );
      this._startFallbackAnimationLoop();
    }
  }

  _stopAnimationLoop() {
    // === PERFORMANCE OPTIMIZATION: Unregister from Master Animation Coordinator ===
    if (this.year3000System && this.year3000System.unregisterAnimationSystem) {
      this.year3000System.unregisterAnimationSystem("BeatSyncVisualSystem");

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Unregistered from Master Animation Coordinator`
        );
      }
    } else {
      // Fallback cleanup
      if (this.animationFrameId) {
        this._cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
  }

  /**
   * PERFORMANCE OPTIMIZATION: New method for Master Animation Coordinator
   * Replaces the self-managed _animationLoop with coordinated updates
   * @param {number} timestamp - Current timestamp from requestAnimationFrame
   * @param {number} deltaTime - Time since last frame
   */
  updateAnimation(timestamp, deltaTime) {
    if (!this.isAnimating || !this.isInitialized) return;

    const frameStart = performance.now();
    this.frameCount++;

    try {
      const currentTime = performance.now();
      const actualDeltaTime = currentTime - this.lastAnimationTime;
      this.lastAnimationTime = currentTime;

      // Get latest music data for breathing calculations
      const latestMusicData = this.musicSyncService?.getLatestProcessedData();
      const processedEnergy = latestMusicData?.processedEnergy || 0.5;
      const animationSpeedFactor = latestMusicData?.animationSpeedFactor || 1.0;

      // Calculate rhythm phase using new utility function
      this.currentRhythmPhase = Year3000Utilities.calculateRhythmPhase(
        currentTime,
        animationSpeedFactor
      );

      // Calculate breathing scale using new utility function
      const breathingScale = Year3000Utilities.calculateBreathingScale(
        this.currentRhythmPhase,
        processedEnergy
      );

      // Update CSS variables with performance monitoring
      this._updateCSSVariables(
        breathingScale,
        this.currentRhythmPhase,
        actualDeltaTime
      );

      // EXISTING: Check for beat timing based on enhanced BPM (preserve backward compatibility)
      if (this.isSyncActive && this.enhancedBPM > 0) {
        const now = Date.now();
        if (now >= this.nextBeatTime) {
          this._triggerBeat(now);
          this._scheduleNextBeat();
        }
      }

      // EXISTING: Beat flash logic (preserve backward compatibility)
      if (this.beatIntensity > 0 && this.beatFlashElement) {
        this.beatIntensity -= 0.025; // Fade speed
        if (this.beatIntensity < 0) this.beatIntensity = 0;

        const rootStyle = Year3000Utilities.getRootStyle();
        const accentRgb =
          rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
          "140,170,238";

        this.beatFlashElement.style.backgroundColor = `rgba(${accentRgb}, ${
          this.beatIntensity * 0.25
        })`;
        this.beatFlashElement.style.opacity = `${this.beatIntensity * 0.85}`;
      } else if (this.beatFlashElement) {
        this.beatFlashElement.style.opacity = "0";
      }

      // Performance tracking
      this.performanceMetrics.animationUpdates++;

      // NEW: Phase 6 Performance monitoring
      const frameTime = performance.now() - frameStart;
      this.updatePerformanceMetrics(frameTime);
    } catch (error) {
      this.errorCount++;
      console.warn(`[${this.systemName}] Animation update error:`, error);

      // Graceful degradation - notify Master Animation Coordinator of issues
      if (this.errorCount > 5) {
        console.warn(
          `[${this.systemName}] High error count, requesting performance mode`
        );

        // Notify master coordinator about performance issues
        if (
          this.year3000System &&
          this.year3000System._activatePerformanceMode
        ) {
          this.year3000System._activatePerformanceMode();
        }
      }
    }
  }

  /**
   * Handle performance mode changes from Master Animation Coordinator
   * @param {string} mode - 'performance' or 'quality'
   */
  onPerformanceModeChange(mode) {
    if (mode === "performance") {
      // Reduce update frequency and visual quality
      this._performanceMode = true;
      this._reducedQualityMode = true;

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Switched to performance mode - reducing quality`
        );
      }
    } else if (mode === "quality") {
      // Restore full quality
      this._performanceMode = false;
      this._reducedQualityMode = false;

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Switched to quality mode - full effects`
        );
      }
    }
  }

  /**
   * Fallback animation loop for backwards compatibility
   * Used when Master Animation Coordinator is not available
   */
  _startFallbackAnimationLoop() {
    if (this.animationFrameId) {
      this._cancelAnimationFrame(this.animationFrameId);
    }
    const loop = () => {
      this._animationLoop();
      this.animationFrameId = this._requestAnimationFrame(loop);
    };
    this.animationFrameId = this._requestAnimationFrame(loop);
  }

  _animationLoop() {
    if (!this.isAnimating || !this.isInitialized) return;

    const frameStart = performance.now();
    this.frameCount++;

    try {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastAnimationTime;
      this.lastAnimationTime = currentTime;

      // Get latest music data for breathing calculations
      const latestMusicData = this.musicSyncService?.getLatestProcessedData();
      const processedEnergy = latestMusicData?.processedEnergy || 0.5;
      const animationSpeedFactor = latestMusicData?.animationSpeedFactor || 1.0;

      // Calculate rhythm phase using new utility function
      this.currentRhythmPhase = Year3000Utilities.calculateRhythmPhase(
        currentTime,
        animationSpeedFactor
      );

      // Calculate breathing scale using new utility function
      const breathingScale = Year3000Utilities.calculateBreathingScale(
        this.currentRhythmPhase,
        processedEnergy
      );

      // Update CSS variables with performance monitoring
      this._updateCSSVariables(
        breathingScale,
        this.currentRhythmPhase,
        deltaTime
      );

      // EXISTING: Check for beat timing based on enhanced BPM (preserve backward compatibility)
      if (this.isSyncActive && this.enhancedBPM > 0) {
        const now = Date.now();
        if (now >= this.nextBeatTime) {
          this._triggerBeat(now);
          this._scheduleNextBeat();
        }
      }

      // EXISTING: Beat flash logic (preserve backward compatibility)
      if (this.beatIntensity > 0 && this.beatFlashElement) {
        this.beatIntensity -= 0.025; // Fade speed
        if (this.beatIntensity < 0) this.beatIntensity = 0;

        const rootStyle = Year3000Utilities.getRootStyle();
        const accentRgb =
          rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
          "140,170,238";

        this.beatFlashElement.style.backgroundColor = `rgba(${accentRgb}, ${
          this.beatIntensity * 0.25
        })`;
        this.beatFlashElement.style.opacity = `${this.beatIntensity * 0.85}`;
      } else if (this.beatFlashElement) {
        this.beatFlashElement.style.opacity = "0";
      }

      // Performance tracking
      this.performanceMetrics.animationUpdates++;

      // NEW: Phase 6 Performance monitoring
      const frameTime = performance.now() - frameStart;
      this.updatePerformanceMetrics(frameTime);
    } catch (error) {
      this.errorCount++;
      console.warn(`[${this.systemName}] Animation loop error:`, error);

      // Graceful degradation - reduce animation complexity
      if (this.errorCount > 5) {
        console.warn(
          `[${this.systemName}] High error count, throttling animations`
        );
        // Don't schedule next frame immediately to reduce load
        setTimeout(() => {
          if (this.isAnimating) {
            this.animationFrameId = requestAnimationFrame(() =>
              this._animationLoop()
            );
          }
        }, 100);
        return;
      }
    }
  }

  _updateCSSVariables(breathingScale, rhythmPhase, deltaTime) {
    if (deltaTime > 50) return; // Skip if frame took too long (>50ms)

    const rootStyle = Year3000Utilities.getRootStyle();
    if (!rootStyle) return;

    try {
      // === PERFORMANCE OPTIMIZATION: Use CSS variable batching ===
      const queueCSSUpdate = (property, value) => {
        if (this.year3000System && this.year3000System.queueCSSVariableUpdate) {
          this.year3000System.queueCSSVariableUpdate(property, value);
        } else {
          // Fallback to direct update
          rootStyle.style.setProperty(property, value);
        }
      };

      // Update breathing scale with bounds checking (batched)
      const clampedBreathingScale = Math.max(
        0.97,
        Math.min(1.02, breathingScale)
      );
      queueCSSUpdate("--sn-breathing-scale", clampedBreathingScale.toFixed(4));

      // Update rhythm phase with normalization (batched)
      const normalizedPhase = rhythmPhase % (Math.PI * 2);
      queueCSSUpdate("--sn-rhythm-phase", normalizedPhase.toFixed(4));

      this.performanceMetrics.cssVariableUpdates++;

      // Debug logging (sparse)
      if (this.config.enableDebug && Math.random() < 0.005) {
        // 0.5% chance
        console.log(
          `🌊 [${this.systemName}] Breathing: ${clampedBreathingScale.toFixed(
            3
          )}, ` +
            `Phase: ${normalizedPhase.toFixed(3)}, Delta: ${deltaTime.toFixed(
              1
            )}ms`
        );
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(`[${this.systemName}] CSS variable update failed:`, error);
      }
    }
  }

  getPerformanceReport() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.performanceMetrics.memoryStartTime;
    const currentMemory = this._getMemoryUsage();
    const memoryIncrease = Math.max(
      0,
      currentMemory - this.performanceMetrics.memoryStartSize
    );

    return {
      systemName: this.systemName,
      elapsedTime: elapsedTime.toFixed(1),
      animationUpdatesPerSecond: (
        this.performanceMetrics.animationUpdates /
        (elapsedTime / 1000)
      ).toFixed(1),
      cssUpdatesPerSecond: (
        this.performanceMetrics.cssVariableUpdates /
        (elapsedTime / 1000)
      ).toFixed(1),
      memoryIncreaseKB: (memoryIncrease / 1024).toFixed(1),
      currentRhythmPhase: this.currentRhythmPhase.toFixed(3),
      isSyncActive: this.isSyncActive,
    };
  }

  // NEW: Enhanced BPM-based beat synchronization (inspired by Cat Jam)
  _triggerBeat(timestamp) {
    if (!this.isInitialized) return;

    // Get latest music data for intensity
    const latestMusicData = this.musicSyncService?.getLatestProcessedData();
    const energy = latestMusicData?.energy || 0.5;
    const visualIntensity = latestMusicData?.visualIntensity || 0.5;

    this.onBeatDetected(timestamp, energy, visualIntensity);
  }

  _scheduleNextBeat() {
    this.beatInterval = 60000 / this.enhancedBPM; // Convert BPM to milliseconds
    this.nextBeatTime += this.beatInterval;
  }

  _startBeatSync(bpm) {
    this.enhancedBPM = bpm;
    this.beatInterval = 60000 / bpm;
    this.trackStartTime = Date.now();
    this.nextBeatTime = this.trackStartTime + this.beatInterval;
    this.beatCount = 0;
    this.isSyncActive = true;

    if (this.config.enableDebug) {
      console.log(
        `🎵 [${this.systemName}] Beat sync started - Enhanced BPM: ${bpm}, ` +
          `Interval: ${this.beatInterval.toFixed(1)}ms`
      );
    }
  }

  _stopBeatSync() {
    this.isSyncActive = false;
    if (this.beatTimer) {
      clearTimeout(this.beatTimer);
      this.beatTimer = null;
    }

    if (this.config.enableDebug) {
      console.log(`🛑 [${this.systemName}] Beat sync stopped`);
    }
  }

  updateFromMusicAnalysis(processedMusicData) {
    if (!this.isInitialized || !processedMusicData) return;
    super.updateFromMusicAnalysis(processedMusicData); // Call base for metrics etc.

    // NEW: Use enhanced BPM from the improved calculation
    const {
      enhancedBPM,
      baseBPM,
      bpmCalculationMethod,
      energy,
      visualIntensity,
    } = processedMusicData;

    if (enhancedBPM && enhancedBPM !== this.enhancedBPM) {
      if (this.config.enableDebug) {
        console.log(
          `🎵 [${this.systemName}] BPM updated: ${baseBPM} → ${enhancedBPM} ` +
            `(method: ${bpmCalculationMethod})`
        );
      }

      // Update BPM and restart sync
      this._startBeatSync(enhancedBPM);
    }

    // Legacy support: If beatOccurred is still provided, use it
    if (processedMusicData.beatOccurred) {
      this.onBeatDetected(performance.now(), energy, visualIntensity);
    }
  }

  onBeatDetected(currentTime, energy, visualIntensity) {
    this.lastBeatTime = currentTime;
    // Increase intensity based on energy and visualIntensity, cap at 1
    this.beatIntensity = Math.min(
      1,
      this.beatIntensity + (energy * 0.5 + visualIntensity * 0.5)
    );

    if (this.config.enableDebug && Math.random() < 0.2) {
      // Log more frequently for beats
      console.log(
        `[${this.systemName}] Beat detected. Energy: ${energy.toFixed(
          2
        )}, Visual Intensity: ${visualIntensity.toFixed(
          2
        )}. New beatIntensity: ${this.beatIntensity.toFixed(2)}`
      );
    }
  }

  destroy() {
    this._stopBeatSync();
    this._stopAnimationLoop();

    // Reset CSS variables to prevent sticking effects
    const rootStyle = Year3000Utilities.getRootStyle();
    if (rootStyle) {
      rootStyle.style.setProperty("--sn-breathing-scale", "1");
      rootStyle.style.setProperty("--sn-rhythm-phase", "0");
    }

    if (this.beatFlashElement && this.beatFlashElement.parentElement) {
      this.beatFlashElement.parentElement.removeChild(this.beatFlashElement);
      this.beatFlashElement = null;
    }

    // Log performance report if debug enabled
    if (this.config.enableDebug) {
      const report = this.getPerformanceReport();
      console.log(`[${this.systemName}] Performance Report:`, report);
      console.log(`[${this.systemName}] Destroyed.`);
    }

    super.destroy();
  }

  // ENHANCED: Handle music data updates with realistic BPM calculation
  handleMusicDataUpdate(musicData) {
    if (!musicData || !this.isActive) return;

    // Use enhanced BPM if available, fallback to base tempo
    const newBPM =
      musicData.enhancedBPM || musicData.baseBPM || musicData.tempo || 120;
    const method = musicData.bpmCalculationMethod || "basic";
    const multiplier = musicData.bpmMultiplier || 1.0;

    // Update energy for visual intensity (use estimated if real not available)
    this.currentEnergy = musicData.estimatedEnergy || musicData.energy || 0.5;

    if (newBPM !== this.currentBPM) {
      this.currentBPM = newBPM;
      this.beatInterval = this.utils.bpmToInterval(newBPM);

      // Reset beat tracking when BPM changes
      this.lastBeatTime = performance.now();
      this.beatCount = 0;

      if (this.config.enableDebug) {
        console.log(
          `🎵 [BeatSyncVisualSystem] BPM updated: ${
            musicData.baseBPM || musicData.tempo
          } → ${newBPM} (method: ${method}, mult: ${multiplier.toFixed(2)})`
        );
      }
    }

    // Use beat timing data if available for precision
    if (musicData.beats && musicData.beats.length > 0) {
      this.usePreciseBeatTiming(musicData.beats);
    }

    // Update visual parameters based on estimated characteristics
    if (musicData.estimatedDanceability !== undefined) {
      this.danceabilityFactor = musicData.estimatedDanceability;
    }

    // Apply energy-based visual adjustments
    this.updateVisualIntensity();
  }

  // NEW: Use precise beat timing from audio analysis if available
  usePreciseBeatTiming(beats) {
    if (!beats || beats.length === 0) return;

    // Calculate average beat interval for more accurate BPM
    const intervals = [];
    for (let i = 1; i < Math.min(beats.length, 20); i++) {
      intervals.push(beats[i].start - beats[i - 1].start);
    }

    if (intervals.length > 0) {
      const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      const preciseBPM = Math.round(60 / avgInterval);

      if (Math.abs(preciseBPM - this.currentBPM) > 2) {
        this.currentBPM = preciseBPM;
        this.beatInterval = avgInterval * 1000; // Convert to milliseconds

        if (this.config.enableDebug) {
          console.log(
            `🎵 [BeatSyncVisualSystem] Using precise beat timing: ${preciseBPM} BPM`
          );
        }
      }
    }
  }

  updatePerformanceMetrics(frameTime) {
    // Update performance data every 60 frames (approximately 1 second)
    if (this.frameCount % 60 === 0) {
      const memoryUsage = this._getMemoryUsage();
      const animationComplexity = this.calculateAnimationComplexity();

      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.updateSystemMetrics("BeatSyncVisualSystem", {
          frameCount: this.frameCount,
          averageFrameTime: frameTime,
          memoryUsage: memoryUsage,
          errorCount: this.errorCount,
          animationComplexity: animationComplexity,
        });
      }
    }
  }

  calculateAnimationComplexity() {
    // Calculate complexity based on active animations and update frequency
    let complexity = 0;
    if (this.isAnimating) complexity += 10;
    if (
      this.processedMusicData &&
      this.processedMusicData.visualIntensity > 0.7
    )
      complexity += 20;
    return complexity;
  }

  performCleanup() {
    // Reset error count periodically
    this.errorCount = Math.max(0, this.errorCount - 1);

    // Clear old performance data
    if (this.frameCount > 10000) {
      this.frameCount = Math.floor(this.frameCount / 2);
    }
  }

  // ===== YEAR 3000 MODE CONFIGURATION =====

  /**
   * Update system configuration based on current artistic mode
   * @param {Object} modeConfig - Configuration from artistic mode profile
   */
  updateModeConfiguration(modeConfig) {
    if (!modeConfig) return;

    const { enabled, animations, intensity, harmonicSync } = modeConfig;

    if (this.config?.enableDebug) {
      console.log(
        `🎨 [${this.systemName}] Updating mode configuration:`,
        modeConfig
      );
    }

    // Update system state based on mode features
    this.modeConfig = {
      systemEnabled: enabled !== false,
      harmonicSyncEnabled: harmonicSync || animations || false,
      oscillateEnabled: animations || false,
      intensityMultiplier: intensity || 1.0,
      temporalPlayEnabled: modeConfig.temporalPlay || false,
    };

    // Initialize harmonic sync if enabled
    if (this.modeConfig.harmonicSyncEnabled) {
      this.initializeHarmonicSync();
    } else {
      this.disableHarmonicSync();
    }

    // Update beat flash intensity based on mode
    this.updateBeatFlashIntensity();
  }

  // ===== HARMONIC OSCILLATION SYNC SYSTEM =====

  /**
   * Initialize harmonic oscillation sync across all visual systems
   */
  initializeHarmonicSync() {
    if (this.harmonicSyncInitialized) return;

    this.harmonicSync = {
      masterFrequency: 1.0, // Base frequency (1 = BPM/60)
      harmonicLayers: [
        { frequency: 1.0, phase: 0, amplitude: 1.0, name: "fundamental" },
        { frequency: 0.5, phase: 0, amplitude: 0.7, name: "sub-harmonic" },
        {
          frequency: 2.0,
          phase: Math.PI / 4,
          amplitude: 0.5,
          name: "second-harmonic",
        },
        {
          frequency: 0.25,
          phase: Math.PI / 2,
          amplitude: 0.8,
          name: "deep-pulse",
        },
      ],
      subscribedSystems: new Set(),
      syncEventChannel: "year3000HarmonicSync",
    };

    // Start harmonic calculation loop
    this.startHarmonicLoop();

    this.harmonicSyncInitialized = true;

    if (this.config?.enableDebug) {
      console.log(
        `🎵 [${this.systemName}] Harmonic sync initialized with ${this.harmonicSync.harmonicLayers.length} layers`
      );
    }
  }

  /**
   * Disable harmonic sync and cleanup
   */
  disableHarmonicSync() {
    if (!this.harmonicSyncInitialized) return;

    // Stop harmonic loop
    if (this.harmonicLoopId) {
      cancelAnimationFrame(this.harmonicLoopId);
      this.harmonicLoopId = null;
    }

    // Clear harmonic CSS variables
    this.clearHarmonicVariables();

    this.harmonicSync = null;
    this.harmonicSyncInitialized = false;

    if (this.config?.enableDebug) {
      console.log(`🎵 [${this.systemName}] Harmonic sync disabled`);
    }
  }

  /**
   * Start the harmonic oscillation calculation loop
   */
  startHarmonicLoop() {
    if (!this.harmonicSync) return;

    const harmonicLoop = (timestamp) => {
      if (!this.harmonicSync || !this.modeConfig?.harmonicSyncEnabled) return;

      this.updateHarmonicFrequencies();
      this.calculateHarmonicValues(timestamp);
      this.dispatchHarmonicSync(timestamp);

      this.harmonicLoopId = requestAnimationFrame(harmonicLoop);
    };

    this.harmonicLoopId = requestAnimationFrame(harmonicLoop);
  }

  /**
   * Update harmonic frequencies based on current BPM and music data
   */
  updateHarmonicFrequencies() {
    if (!this.isInitialized) return;

    // Use latest music data from the unified service
    const latestMusicData = this.musicSyncService?.getLatestProcessedData?.();
    if (!latestMusicData) return;

    const bpmFrequency = this.enhancedBPM / 60; // Convert BPM to Hz
    this.harmonicSync.masterFrequency = bpmFrequency;

    // Get latest music data for harmonic modulation
    const energy = latestMusicData?.processedEnergy || 0.5;
    const valence = latestMusicData?.valence || 0.5;

    // Modulate harmonic layers based on music characteristics
    this.harmonicSync.harmonicLayers.forEach((layer, index) => {
      switch (layer.name) {
        case "fundamental":
          layer.amplitude = 0.8 + energy * 0.4; // Energy drives fundamental
          break;
        case "sub-harmonic":
          layer.amplitude = 0.5 + valence * 0.3; // Valence drives sub-harmonic
          break;
        case "second-harmonic":
          layer.amplitude = 0.3 + energy * valence * 0.4; // Combined effect
          break;
        case "deep-pulse":
          layer.amplitude = 0.6 + (1 - valence) * 0.3; // Counter-valence
          break;
      }

      // Apply mode intensity multiplier
      layer.amplitude *= this.modeConfig?.intensityMultiplier || 1.0;
    });
  }

  /**
   * Calculate harmonic values for current timestamp
   * @param {number} timestamp - Current animation timestamp
   */
  calculateHarmonicValues(timestamp) {
    if (!this.harmonicSync) return;

    const timeInSeconds = timestamp / 1000;
    const harmonicData = {
      timestamp: timestamp,
      masterFrequency: this.harmonicSync.masterFrequency,
      layers: {},
      composite: {
        oscillation: 0,
        pulse: 0,
        flow: 0,
      },
    };

    // Calculate each harmonic layer
    this.harmonicSync.harmonicLayers.forEach((layer) => {
      const omega =
        2 * Math.PI * layer.frequency * this.harmonicSync.masterFrequency;
      const value =
        layer.amplitude * Math.sin(omega * timeInSeconds + layer.phase);

      harmonicData.layers[layer.name] = {
        frequency: layer.frequency * this.harmonicSync.masterFrequency,
        amplitude: layer.amplitude,
        value: value,
        phase: layer.phase,
      };

      // Contribute to composite values
      switch (layer.name) {
        case "fundamental":
        case "second-harmonic":
          harmonicData.composite.oscillation += value * 0.5;
          break;
        case "sub-harmonic":
        case "deep-pulse":
          harmonicData.composite.pulse += value * 0.3;
          break;
      }
    });

    // Calculate flow as a combination of all layers
    harmonicData.composite.flow =
      harmonicData.composite.oscillation * 0.6 +
      harmonicData.composite.pulse * 0.4;

    // Normalize composite values
    harmonicData.composite.oscillation = Math.max(
      -1,
      Math.min(1, harmonicData.composite.oscillation)
    );
    harmonicData.composite.pulse = Math.max(
      -1,
      Math.min(1, harmonicData.composite.pulse)
    );
    harmonicData.composite.flow = Math.max(
      -1,
      Math.min(1, harmonicData.composite.flow)
    );

    // Store for other systems to access
    this.currentHarmonicData = harmonicData;

    // Update CSS variables for immediate use
    this.updateHarmonicCSSVariables(harmonicData);
  }

  /**
   * Update CSS variables with harmonic data
   * @param {Object} harmonicData - Current harmonic data
   */
  updateHarmonicCSSVariables(harmonicData) {
    const root = document.documentElement;

    // Master harmonic variables
    root.style.setProperty(
      "--sn-harmonic-master-freq",
      harmonicData.masterFrequency.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmonic-oscillation",
      harmonicData.composite.oscillation.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmonic-pulse",
      harmonicData.composite.pulse.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmonic-flow",
      harmonicData.composite.flow.toFixed(3)
    );

    // Individual layer variables for advanced usage
    Object.entries(harmonicData.layers).forEach(([layerName, layerData]) => {
      root.style.setProperty(
        `--sn-harmonic-${layerName}`,
        layerData.value.toFixed(3)
      );
      root.style.setProperty(
        `--sn-harmonic-${layerName}-freq`,
        layerData.frequency.toFixed(3)
      );
    });

    // Derived kinetic variables
    const scalePulse = 1 + harmonicData.composite.pulse * 0.02; // Subtle scaling
    const rotationFlow = harmonicData.composite.flow * 0.5; // Gentle rotation
    const opacityOscillation = 0.8 + harmonicData.composite.oscillation * 0.1; // Opacity variation

    root.style.setProperty("--sn-harmonic-scale-pulse", scalePulse.toFixed(3));
    root.style.setProperty(
      "--sn-harmonic-rotation-flow",
      rotationFlow.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmonic-opacity-oscillation",
      opacityOscillation.toFixed(3)
    );
  }

  /**
   * Dispatch harmonic sync event to other systems
   * @param {number} timestamp - Current timestamp
   */
  dispatchHarmonicSync(timestamp) {
    if (!this.currentHarmonicData) return;

    // Create detailed sync event
    const syncEvent = new CustomEvent(this.harmonicSync.syncEventChannel, {
      detail: {
        ...this.currentHarmonicData,
        systemName: this.systemName,
        modeConfig: this.modeConfig,
      },
    });

    document.dispatchEvent(syncEvent);

    // Also set global harmonic state for direct access
    if (typeof window !== "undefined") {
      window.Year3000HarmonicState = this.currentHarmonicData;
    }
  }

  /**
   * Clear all harmonic CSS variables
   */
  clearHarmonicVariables() {
    const root = document.documentElement;

    const harmonicVars = [
      "--sn-harmonic-master-freq",
      "--sn-harmonic-oscillation",
      "--sn-harmonic-pulse",
      "--sn-harmonic-flow",
      "--sn-harmonic-scale-pulse",
      "--sn-harmonic-rotation-flow",
      "--sn-harmonic-opacity-oscillation",
    ];

    // Clear individual layer variables
    this.harmonicSync?.harmonicLayers?.forEach((layer) => {
      harmonicVars.push(`--sn-harmonic-${layer.name}`);
      harmonicVars.push(`--sn-harmonic-${layer.name}-freq`);
    });

    harmonicVars.forEach((varName) => {
      root.style.removeProperty(varName);
    });
  }

  /**
   * Update beat flash intensity based on current mode
   */
  updateBeatFlashIntensity() {
    if (!this.modeConfig) return;

    this.beatFlashIntensity = {
      base: 0.25 * (this.modeConfig.intensityMultiplier || 1.0),
      peak: 0.85 * (this.modeConfig.intensityMultiplier || 1.0),
      enabled:
        this.modeConfig.systemEnabled && this.modeConfig.oscillateEnabled,
    };

    if (this.config?.enableDebug) {
      console.log(
        `🔥 [${this.systemName}] Updated beat flash intensity:`,
        this.beatFlashIntensity
      );
    }
  }

  /**
   * Get current harmonic data for external access
   * @returns {Object|null} - Current harmonic data
   */
  getCurrentHarmonicData() {
    return this.currentHarmonicData || null;
  }
}
