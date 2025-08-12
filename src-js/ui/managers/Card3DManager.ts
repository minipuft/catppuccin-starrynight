// NOTE: CARD_3D_LEVEL_KEY has been removed in settings rationalization
import type { SimplePerformanceCoordinator, QualityCapability, QualityLevel, QualityScalingCapable, PerformanceMetrics } from "@/core/performance/SimplePerformanceCoordinator";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import type { SettingsManager } from "@/ui/managers/SettingsManager";
import type * as Utils from "@/utils/core/Year3000Utilities";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { EmotionalTemperatureMapper, type EmotionalTemperatureResult } from "@/utils/color/EmotionalTemperatureMapper";
import { OKLABColorProcessor, type EnhancementPreset } from "@/utils/color/OKLABColorProcessor";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import type { BeatData, MusicEmotion } from "@/types/colorStubs";
// NOTE: QualityLevel types imported from simplified performance system

// ===================================================================
// 🃏 3D CARD MANAGER - Year 3000 Visual System
// ===================================================================
// Manages 3D transformations and effects for interactive cards.

interface Card3DConfig {
  perspective: number;
  maxRotation: number;
  scale: number;
  transitionSpeed: string;
  glowOpacity: number;
  selector: string;
  // Year 3000 music-responsive enhancements
  depthMultiplier: number;
  musicResponseStrength: number;
  beatSyncIntensity: number;
  effectIntensityMultiplier: number;
}

interface Card3DEffectState {
  currentEmotion: string;
  emotionalIntensity: number;
  beatPhase: number;
  lastBeatTime: number;
  effectIntensityLevel: number;
  dynamicAccentHex: string;
  dynamicAccentRgb: string;
  overallIntensityLevel: number;
}

export class Card3DManager implements IManagedSystem, QualityScalingCapable {
  public initialized = false;
  private static instance: Card3DManager;
  private config: Card3DConfig;
  private performanceMonitor: SimplePerformanceCoordinator;
  private settingsManager: SettingsManager;
  private utils: typeof Utils;
  private cards: NodeListOf<HTMLElement>;
  private cardQuerySelector =
    ".main-card-card, .main-gridContainer-gridContainer.main-gridContainer-fixedWidth";
  private cardEventHandlers: WeakMap<
    HTMLElement,
    {
      move: EventListenerOrEventListenerObject;
      leave: EventListenerOrEventListenerObject;
    }
  > = new WeakMap();

  private boundHandleSettingsChange: (event: Event) => void;
  
  // Year 3000 consciousness integration
  private musicSyncService: MusicSyncService | null = null;
  private emotionalMapper: EmotionalTemperatureMapper;
  private oklabProcessor: OKLABColorProcessor;
  private effectState: Card3DEffectState;
  private cinematicPreset: EnhancementPreset;
  
  // Quality scaling state
  private currentQualityLevel: QualityLevel | null = null;
  private qualityCapabilities: QualityCapability[] = [];
  
  // Cross-system consciousness coordination
  private consciousnessCoordinationCallbacks: Set<(state: Card3DEffectState) => void> = new Set();

  public constructor(
    performanceMonitor: SimplePerformanceCoordinator,
    settingsManager: SettingsManager,
    utils: typeof Utils
  ) {
    this.config = {
      perspective: 1000,
      maxRotation: 5,
      scale: 1.02,
      transitionSpeed: "200ms",
      glowOpacity: 0.8,
      selector:
        ".main-card-card, .main-grid-grid > *, .main-shelf-shelf > * > *",
      // Year 3000 consciousness enhancements
      depthMultiplier: 1.5,
      musicResponseStrength: 0.8,
      beatSyncIntensity: 0.6,
      effectIntensityMultiplier: 1.2,
    };
    this.performanceMonitor = performanceMonitor;
    this.settingsManager = settingsManager;
    this.utils = utils;
    this.cards = document.querySelectorAll(this.config.selector);

    // Initialize Year 3000 consciousness systems
    this.emotionalMapper = new EmotionalTemperatureMapper(true);
    this.oklabProcessor = new OKLABColorProcessor(true);
    this.cinematicPreset = OKLABColorProcessor.getPreset('VIBRANT');
    
    // Initialize consciousness state
    this.effectState = {
      currentEmotion: 'neutral',
      emotionalIntensity: 0.5,
      beatPhase: 0,
      lastBeatTime: 0,
      effectIntensityLevel: 0,
      dynamicAccentHex: '#cba6f7', // Catppuccin mauve fallback
      dynamicAccentRgb: '203,166,247',
      overallIntensityLevel: 0.5
    };

    // Bind event handler once
    this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
  }

  public static getInstance(
    performanceMonitor: SimplePerformanceCoordinator,
    settingsManager: SettingsManager,
    utils: typeof Utils
  ): Card3DManager {
    if (!Card3DManager.instance) {
      Card3DManager.instance = new Card3DManager(
        performanceMonitor,
        settingsManager,
        utils
      );
    }
    return Card3DManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    const quality = this.performanceMonitor.shouldReduceQuality();
    if (quality) {
      // NOTE: 3D effects setting has been removed - always disabled for performance
      if (false) { // Always disabled since setting was removed
        console.log(
          `[Card3DManager] Performance is low. 3D effects disabled. Current quality: ${quality}`
        );
        return;
      }
    }
    // Re-query cards because the DOM may have changed since construction
    this.cards = document.querySelectorAll(this.config.selector);

    await this.applyEventListeners();
    
    // Initialize Year 3000 consciousness integrations
    await this.initializeConsciousnessIntegration();
    
    // Initialize cross-system consciousness coordination
    this.initializeCrossSystemCoordination();

    // Listen for live settings changes
    document.addEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );

    this.initialized = true;
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const elements = document.querySelectorAll(this.cardQuerySelector);
    if (elements.length > 0) {
      return { 
        healthy: true,
        ok: true, 
        details: `Found ${elements.length} cards to manage.`,
        issues: [],
        system: 'Card3DManager',
      };
    }
    return {
      healthy: false,
      ok: false,
      details: "No card elements found with the configured selector.",
      issues: ["No card elements found with the configured selector."],
      system: 'Card3DManager',
    };
  }

  public updateAnimation(deltaTime: number): void {
    // All animations are handled by CSS transitions triggered by mouse events.
  }

  public apply3DMode(mode: string): void {
    // TODO: Implement logic for different 3D morphing modes
    console.log(`[Card3DManager] Applying 3D mode: ${mode}`);
    if (mode === "disabled") {
      this.destroy();
    } else {
      this.initialize();
    }
  }

  private get shouldEnable3DEffects(): boolean {
    const quality = this.performanceMonitor.shouldReduceQuality();
    const setting = this.settingsManager.get("sn-enable3dCards" as any);
    return !quality && setting !== "disabled";
  }

  private async applyEventListeners(): Promise<void> {
    this.cards.forEach((card) => {
      // Skip if handlers for this card are already registered
      if (this.cardEventHandlers.has(card)) return;

      const moveHandler = (e: Event) =>
        this.handleMouseMove(card, e as MouseEvent);
      const leaveHandler = () => this.handleMouseLeave(card);

      this.cardEventHandlers.set(card, {
        move: moveHandler,
        leave: leaveHandler,
      });

      card.addEventListener("mousemove", moveHandler);
      card.addEventListener("mouseleave", leaveHandler);
    });
  }

  private handleMouseMove(card: HTMLElement, e: MouseEvent): void {
    if (!this.shouldEnable3DEffects) return;

    const { clientX, clientY } = e;
    const { top, left, width, height } = card.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;

    const rotateX = (this.config.maxRotation * (y - height / 2)) / (height / 2);
    const rotateY = (-this.config.maxRotation * (x - width / 2)) / (width / 2);

    card.style.transform = `perspective(${this.config.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.config.scale}, ${this.config.scale}, ${this.config.scale})`;
    card.style.transition = `transform ${this.config.transitionSpeed} ease-out`;

    this.applyGlow(card, x, y, width, height);
  }

  private handleMouseLeave(card: HTMLElement): void {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    card.style.transition = "transform 600ms ease-in-out";
    this.removeGlow(card);
  }

  private applyGlow(
    card: HTMLElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    let glowElement = card.querySelector(".card-glow") as HTMLElement;
    if (!glowElement) {
      glowElement = document.createElement("div");
      glowElement.className = "card-glow";
      card.appendChild(glowElement);
    }

    // Use consciousness-aware OKLAB-processed dynamic accent colors
    const { dynamicAccentRgb, emotionalIntensity, beatPhase, effectIntensityLevel } = this.effectState;
    
    // Calculate consciousness-enhanced opacity
    const baseOpacity = this.config.glowOpacity;
    const emotionalModulation = 1 + (emotionalIntensity - 0.5) * this.config.musicResponseStrength;
    const beatModulation = 1 + Math.sin(beatPhase) * this.config.beatSyncIntensity * 0.3;
    const cinematicModulation = 1 + effectIntensityLevel * this.config.effectIntensityMultiplier * 0.4;
    
    const consciousnessOpacity = baseOpacity * emotionalModulation * beatModulation * cinematicModulation;
    const finalOpacity = Math.max(0.1, Math.min(1.0, consciousnessOpacity));
    
    // Create organic, breathing glow radius
    const baseRadius = 40;
    const breathingRadius = baseRadius + Math.sin(beatPhase * 0.5) * 8 * this.config.beatSyncIntensity;
    
    glowElement.style.background = `radial-gradient(circle at ${x}px ${y}px, 
      rgba(${dynamicAccentRgb}, ${finalOpacity}) 0%, 
      rgba(${dynamicAccentRgb}, ${finalOpacity * 0.6}) 20%, 
      transparent ${breathingRadius}%)`;
  }

  private removeGlow(card: HTMLElement): void {
    const glowElement = card.querySelector(".card-glow") as HTMLElement;
    if (glowElement) {
      glowElement.style.background = "transparent";
    }
  }

  public destroy(): void {
    this.cards.forEach((card) => {
      const handlers = this.cardEventHandlers.get(card);
      if (handlers) {
        card.removeEventListener("mousemove", handlers.move);
        card.removeEventListener("mouseleave", handlers.leave);
        this.cardEventHandlers.delete(card);
      }

      this.removeGlow(card);
      card.style.transform = "";
      card.style.transition = "";
    });
    this.initialized = false;

    // Remove global listener
    document.removeEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );
  }

  private handleSettingsChange(event: Event): void {
    const { key, value } = (event as CustomEvent).detail || {};
    // NOTE: 3D effects setting has been removed - this event handler is disabled
    if (false) {
      this.apply3DMode(value);
    }
  }

  // ===================================================================
  // Year 3000 Consciousness Integration Methods
  // ===================================================================

  /**
   * Initialize consciousness integration with music sync and emotional systems
   */
  private async initializeConsciousnessIntegration(): Promise<void> {
    try {
      // Subscribe to unified color events
      unifiedEventBus.subscribe('colors:extracted', (event) => {
        this.onColorsExtracted(event);
      }, 'Card3DManager');

      unifiedEventBus.subscribe('colors:harmonized', (event) => {
        this.onColorsHarmonized(event);
      }, 'Card3DManager');

      // Subscribe to music and consciousness events
      unifiedEventBus.subscribe('music:beat', (event) => {
        this.onMusicBeat(event);
      }, 'Card3DManager');

      unifiedEventBus.subscribe('consciousness:dramatic-moment', (event) => {
        this.onCinematicDramaEvent(event);
      }, 'Card3DManager');

      // Get initial dynamic accent color
      this.updateDynamicAccentColor();

      console.log('[Card3DManager] ✅ Year 3000 consciousness integration initialized');
    } catch (error) {
      console.error('[Card3DManager] Failed to initialize consciousness integration:', error);
    }
  }

  /**
   * Handle color extraction events
   */
  private onColorsExtracted(event: any): void {
    const { rawColors, musicData } = event;
    
    if (musicData) {
      // Process emotional state
      const emotionalResult = this.emotionalMapper.mapMusicToEmotionalTemperature(musicData);
      this.updateEmotionalState(emotionalResult);
    }
  }

  /**
   * Handle color harmonization events
   */
  private onColorsHarmonized(event: any): void {
    const { processedColors, coordinationMetrics } = event;
    
    // Update dynamic accent with OKLAB-processed colors
    if (processedColors.VIBRANT) {
      const oklabResult = this.oklabProcessor.processColor(processedColors.VIBRANT, this.cinematicPreset);
      this.effectState.dynamicAccentHex = oklabResult.enhancedHex;
      this.effectState.dynamicAccentRgb = `${oklabResult.enhancedRgb.r},${oklabResult.enhancedRgb.g},${oklabResult.enhancedRgb.b}`;
    }

    // Update consciousness level based on coordination metrics
    if (coordinationMetrics?.overallIntensityLevel !== undefined) {
      this.effectState.overallIntensityLevel = coordinationMetrics.overallIntensityLevel;
    }
  }

  /**
   * Handle music beat events for rhythm-responsive 3D effects
   */
  private onMusicBeat(event: any): void {
    const { beat, intensity, timestamp } = event;
    
    // Update beat phase for organic animations
    this.effectState.beatPhase += Math.PI * 2 * this.config.beatSyncIntensity;
    this.effectState.lastBeatTime = timestamp || Date.now();
    
    // Apply beat-synchronized depth adjustments to all cards
    if (intensity > 0.7) {
      this.applyBeatSyncDepthPulse(intensity);
    }
  }

  /**
   * Handle cinematic drama events for intense 3D effects
   */
  private onCinematicDramaEvent(event: any): void {
    const { intensity, type } = event;
    
    this.effectState.effectIntensityLevel = intensity;
    
    // Apply dramatic 3D effects for intense moments
    if (intensity > 0.8) {
      this.applyDramaticDepthDistortion(intensity);
    }
  }

  /**
   * Update emotional state from music analysis
   */
  private updateEmotionalState(emotionalResult: EmotionalTemperatureResult): void {
    this.effectState.currentEmotion = emotionalResult.primaryEmotion;
    this.effectState.emotionalIntensity = emotionalResult.intensity;
    
    // Adjust cinematic preset based on emotion
    switch (emotionalResult.primaryEmotion) {
      case 'energetic':
      case 'aggressive':
        this.cinematicPreset = OKLABColorProcessor.getPreset('COSMIC');
        break;
      case 'calm':
      case 'ambient':
        this.cinematicPreset = OKLABColorProcessor.getPreset('SUBTLE');
        break;
      default:
        this.cinematicPreset = OKLABColorProcessor.getPreset('VIBRANT');
    }
  }

  /**
   * Apply beat-synchronized depth pulse to all cards
   */
  private applyBeatSyncDepthPulse(intensity: number): void {
    const pulseScale = 1 + intensity * 0.15 * this.config.beatSyncIntensity;
    
    this.cards.forEach(card => {
      if (card instanceof HTMLElement) {
        const currentTransform = card.style.transform || '';
        const scaledTransform = currentTransform.replace(/scale3d\([^)]*\)/, `scale3d(${pulseScale}, ${pulseScale}, ${pulseScale})`);
        
        card.style.transform = scaledTransform || `scale3d(${pulseScale}, ${pulseScale}, ${pulseScale})`;
        card.style.transition = 'transform 100ms ease-out';
        
        // Reset after pulse
        setTimeout(() => {
          if (card.style.transform.includes(`scale3d(${pulseScale}`)) {
            card.style.transform = card.style.transform.replace(/scale3d\([^)]*\)/, 'scale3d(1, 1, 1)');
          }
        }, 200);
      }
    });
  }

  /**
   * Apply dramatic depth distortion for cinematic moments
   */
  private applyDramaticDepthDistortion(intensity: number): void {
    const dramaticPerspective = this.config.perspective * (1 + intensity * this.config.effectIntensityMultiplier);
    const dramaticRotation = this.config.maxRotation * (1 + intensity * 0.8);
    
    this.cards.forEach(card => {
      if (card instanceof HTMLElement) {
        const dramaticTransform = `perspective(${dramaticPerspective}px) rotateX(${dramaticRotation * 0.3}deg) rotateY(${dramaticRotation * 0.2}deg)`;
        card.style.transform = dramaticTransform;
        card.style.transition = 'transform 800ms ease-out';
        
        // Reset after dramatic moment
        setTimeout(() => {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
          card.style.transition = 'transform 1200ms ease-in-out';
        }, 1500);
      }
    });
  }

  /**
   * Update dynamic accent color from CSS variables
   */
  private updateDynamicAccentColor(): void {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Try to get dynamic accent from the cascade system
    const dynamicAccentHex = computedStyle.getPropertyValue('--sn-dynamic-accent-hex').trim() ||
                             computedStyle.getPropertyValue('--sn-color-accent-hex').trim() ||
                             computedStyle.getPropertyValue('--spice-accent').trim();
                             
    const dynamicAccentRgb = computedStyle.getPropertyValue('--sn-dynamic-accent-rgb').trim() ||
                            computedStyle.getPropertyValue('--sn-color-accent-rgb').trim() ||
                            computedStyle.getPropertyValue('--spice-rgb-accent').trim();
    
    if (dynamicAccentHex && dynamicAccentHex !== '') {
      this.effectState.dynamicAccentHex = dynamicAccentHex;
    }
    
    if (dynamicAccentRgb && dynamicAccentRgb !== '') {
      this.effectState.dynamicAccentRgb = dynamicAccentRgb;
    }
  }

  /**
   * Set music sync service for consciousness integration
   */
  public setMusicSyncService(musicSyncService: MusicSyncService): void {
    this.musicSyncService = musicSyncService;
  }

  /**
   * Get current consciousness state for debugging
   */
  public getConsciousnessState(): Card3DEffectState {
    return { ...this.effectState };
  }

  // ===================================================================
  // Quality Scaling Implementation (QualityScalingCapable)
  // ===================================================================

  /**
   * Set quality level for 3D effects
   */
  public setQualityLevel(level: QualityLevel): void {
    this.currentQualityLevel = level;
    
    // Update 3D config based on quality level
    switch (level) {
      case 'low':
        this.config.perspective = 900;
        this.config.maxRotation = 3;
        this.config.depthMultiplier = 1.2;
        this.config.musicResponseStrength = 0.5;
        this.config.beatSyncIntensity = 0.4;
        this.config.effectIntensityMultiplier = 0.8;
        break;
      case 'medium':
        this.config.perspective = 1000;
        this.config.maxRotation = 5;
        this.config.depthMultiplier = 1.5;
        this.config.musicResponseStrength = 0.8;
        this.config.beatSyncIntensity = 0.6;
        this.config.effectIntensityMultiplier = 1.2;
        break;
      case 'high':
        this.config.perspective = 1200;
        this.config.maxRotation = 7;
        this.config.depthMultiplier = 1.8;
        this.config.musicResponseStrength = 1.0;
        this.config.beatSyncIntensity = 0.8;
        this.config.effectIntensityMultiplier = 1.5;
        break;
      default:
        // Default to medium quality for unknown levels
        this.config.perspective = 1000;
        this.config.maxRotation = 5;
        this.config.depthMultiplier = 1.5;
        this.config.musicResponseStrength = 0.8;
        this.config.beatSyncIntensity = 0.6;
        this.config.effectIntensityMultiplier = 1.2;
        break;
    }
    
    console.log(`[Card3DManager] Quality level set to: ${level}`);
  }

  /**
   * Adjust quality level (QualityScalingCapable interface)
   */
  public adjustQuality(level: QualityLevel): void {
    this.setQualityLevel(level);
  }

  /**
   * Get current performance impact metrics
   */
  public getPerformanceImpact(): PerformanceMetrics {
    const cardCount = this.cards.length;
    const baseImpact = cardCount * 0.1; // Base impact per card
    const consciousnessImpact = this.config.depthMultiplier * 0.2;
    const emotionalImpact = this.config.musicResponseStrength * 0.15;
    const cinematicImpact = this.config.effectIntensityMultiplier * 0.1;
    
    return {
      fps: 60,
      frameTime: baseImpact + consciousnessImpact + emotionalImpact + cinematicImpact,
      memoryUsage: cardCount * 0.05, // Minimal memory impact
      cpuUsage: (baseImpact + consciousnessImpact) * 100,
    };
  }

  /**
   * Reduce quality level
   */
  public reduceQuality(amount: number): void {
    if (!this.currentQualityLevel) return;
    
    // Reduce consciousness modulation factors
    this.config.depthMultiplier = Math.max(0.5, this.config.depthMultiplier - amount);
    this.config.musicResponseStrength = Math.max(0.1, this.config.musicResponseStrength - amount);
    this.config.beatSyncIntensity = Math.max(0.1, this.config.beatSyncIntensity - amount);
    this.config.effectIntensityMultiplier = Math.max(0.5, this.config.effectIntensityMultiplier - amount);
    
    console.log(`[Card3DManager] Quality reduced by ${amount}`);
  }

  /**
   * Increase quality level
   */
  public increaseQuality(amount: number): void {
    if (!this.currentQualityLevel) return;
    
    // Increase consciousness modulation factors
    this.config.depthMultiplier = Math.min(2.0, this.config.depthMultiplier + amount);
    this.config.musicResponseStrength = Math.min(1.5, this.config.musicResponseStrength + amount);
    this.config.beatSyncIntensity = Math.min(1.0, this.config.beatSyncIntensity + amount);
    this.config.effectIntensityMultiplier = Math.min(2.0, this.config.effectIntensityMultiplier + amount);
    
    console.log(`[Card3DManager] Quality increased by ${amount}`);
  }

  /**
   * Get quality capabilities for this system
   */
  public getQualityCapabilities(): QualityCapability[] {
    if (this.qualityCapabilities.length === 0) {
      this.qualityCapabilities = [
        {
          name: '3D Perspective',
          enabled: true,
          qualityLevel: 'medium'
        },
        {
          name: 'Consciousness Glow',
          enabled: true,
          qualityLevel: 'low'
        },
        {
          name: 'Beat Sync Effects',
          enabled: true,
          qualityLevel: 'low'
        },
        {
          name: 'Dramatic Distortion',
          enabled: true,
          qualityLevel: 'medium'
        },
        {
          name: 'Emotional Modulation',
          enabled: true,
          qualityLevel: 'low'
        }
      ];
    }
    return this.qualityCapabilities;
  }

  /**
   * Refresh color state for efficient color system updates
   */
  public async refreshColorState(trigger: string): Promise<void> {
    try {
      // Update dynamic accent color from cascade system
      this.updateDynamicAccentColor();
      
      // Reprocess colors with current OKLAB preset
      if (this.effectState.dynamicAccentHex) {
        const oklabResult = this.oklabProcessor.processColor(
          this.effectState.dynamicAccentHex, 
          this.cinematicPreset
        );
        this.effectState.dynamicAccentHex = oklabResult.enhancedHex;
        this.effectState.dynamicAccentRgb = `${oklabResult.enhancedRgb.r},${oklabResult.enhancedRgb.g},${oklabResult.enhancedRgb.b}`;
      }
      
      console.log(`[Card3DManager] Color state refreshed for trigger: ${trigger}`);
    } catch (error) {
      console.error('[Card3DManager] Error refreshing color state:', error);
    }
  }

  // ===================================================================
  // Cross-System Consciousness Coordination
  // ===================================================================

  /**
   * Register for consciousness coordination updates
   */
  public onConsciousnessCoordination(callback: (state: Card3DEffectState) => void): () => void {
    this.consciousnessCoordinationCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.consciousnessCoordinationCallbacks.delete(callback);
    };
  }

  /**
   * Synchronize consciousness state with other systems
   */
  public synchronizeConsciousnessState(sharedState: Partial<Card3DEffectState>): void {
    // Update our consciousness state with shared values
    if (sharedState.currentEmotion) {
      this.effectState.currentEmotion = sharedState.currentEmotion;
    }
    if (sharedState.emotionalIntensity !== undefined) {
      this.effectState.emotionalIntensity = sharedState.emotionalIntensity;
    }
    if (sharedState.beatPhase !== undefined) {
      this.effectState.beatPhase = sharedState.beatPhase;
    }
    if (sharedState.effectIntensityLevel !== undefined) {
      this.effectState.effectIntensityLevel = sharedState.effectIntensityLevel;
    }
    if (sharedState.overallIntensityLevel !== undefined) {
      this.effectState.overallIntensityLevel = sharedState.overallIntensityLevel;
    }
    if (sharedState.dynamicAccentHex) {
      this.effectState.dynamicAccentHex = sharedState.dynamicAccentHex;
    }
    if (sharedState.dynamicAccentRgb) {
      this.effectState.dynamicAccentRgb = sharedState.dynamicAccentRgb;
    }
    
    // Notify other systems of our updated state
    this.broadcastConsciousnessState();
  }

  /**
   * Broadcast consciousness state to coordinated systems
   */
  private broadcastConsciousnessState(): void {
    this.consciousnessCoordinationCallbacks.forEach(callback => {
      try {
        callback(this.effectState);
      } catch (error) {
        console.error('[Card3DManager] Error in consciousness coordination callback:', error);
      }
    });
  }

  /**
   * Enhanced emotional state update with coordination
   */
  private updateEmotionalStateWithCoordination(emotionalResult: EmotionalTemperatureResult): void {
    this.updateEmotionalState(emotionalResult);
    
    // Broadcast updated state to coordinated systems
    this.broadcastConsciousnessState();
    
    // Emit unified consciousness coordination event
    unifiedEventBus.emit('consciousness:coordination', {
      source: 'Card3DManager',
      state: this.effectState,
      timestamp: Date.now()
    });
  }

  /**
   * Enhanced beat event with coordination
   */
  private onMusicBeatWithCoordination(event: any): void {
    this.onMusicBeat(event);
    
    // Broadcast synchronized beat state
    this.broadcastConsciousnessState();
    
    // Emit beat coordination event for synchronized effects
    unifiedEventBus.emit('consciousness:beat-sync', {
      source: 'Card3DManager',
      beatPhase: this.effectState.beatPhase,
      lastBeatTime: this.effectState.lastBeatTime,
      timestamp: Date.now()
    });
  }

  /**
   * Enhanced dramatic event with coordination
   */
  private onCinematicDramaEventWithCoordination(event: any): void {
    this.onCinematicDramaEvent(event);
    
    // Broadcast synchronized dramatic state
    this.broadcastConsciousnessState();
    
    // Emit dramatic coordination event for unified effects
    unifiedEventBus.emit('consciousness:dramatic-sync', {
      source: 'Card3DManager',
      dramaticLevel: this.effectState.effectIntensityLevel,
      type: event.type,
      timestamp: Date.now()
    });
  }

  /**
   * Initialize cross-system consciousness coordination
   */
  private initializeCrossSystemCoordination(): void {
    try {
      // Subscribe to coordination events from other systems
      unifiedEventBus.subscribe('consciousness:coordination', (event) => {
        if (event.source !== 'Card3DManager') {
          this.synchronizeConsciousnessState(event.state);
        }
      }, 'Card3DManager');

      unifiedEventBus.subscribe('consciousness:beat-sync', (event) => {
        if (event.source !== 'Card3DManager') {
          // Synchronize beat phase with other systems
          this.effectState.beatPhase = event.beatPhase;
          this.effectState.lastBeatTime = event.lastBeatTime;
        }
      }, 'Card3DManager');

      unifiedEventBus.subscribe('consciousness:dramatic-sync', (event) => {
        if (event.source !== 'Card3DManager') {
          // Synchronize dramatic level with other systems
          this.effectState.effectIntensityLevel = event.dramaticLevel;
        }
      }, 'Card3DManager');

      console.log('[Card3DManager] ✅ Cross-system consciousness coordination initialized');
    } catch (error) {
      console.error('[Card3DManager] Failed to initialize cross-system coordination:', error);
    }
  }
}
