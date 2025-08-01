import { YEAR3000_CONFIG as Config } from "@/config/globalConfig";
import { GLASS_LEVEL_KEY, GLASS_LEVEL_OLD_KEY } from "@/config/settingKeys";
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import type { HealthCheckResult } from "@/types/systems";
import type { SettingsManager } from "@/ui/managers/SettingsManager";
import { ViewportAwareSystem, type ViewportSystemOptions } from "@/visual/base/ViewportAwareSystem";
import type { VisibilityState } from "@/utils/performance/ViewportAwarenessManager";
import * as Utils from "@/utils/core/Year3000Utilities";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { EmotionalTemperatureMapper, type EmotionalTemperatureResult } from "@/utils/color/EmotionalTemperatureMapper";
import { OKLABColorProcessor, type EnhancementPreset } from "@/utils/color/OKLABColorProcessor";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import type { BeatData, MusicEmotion } from "@/types/colorStubs";
import type { QualityLevel, QualityScalingCapable, QualityCapability, PerformanceMetrics } from "@/core/performance/PerformanceOrchestrator";

type GlassIntensity =
  | "disabled"
  | "minimal"
  | "balanced"
  | "intense"
  | "moderate";

interface GlassConsciousnessState {
  currentEmotion: string;
  emotionalIntensity: number;
  beatPhase: number;
  lastBeatTime: number;
  cinematicDramaLevel: number;
  dynamicAccentHex: string;
  dynamicAccentRgb: string;
  consciousnessLevel: number;
  genreStyle: string;
  breathingRate: number;
}

declare const Spicetify: any;

export class GlassmorphismManager extends ViewportAwareSystem implements QualityScalingCapable {
  private static instance: GlassmorphismManager;
  private config: typeof Config;
  private utils: typeof Utils;
  private cssBatcher: UnifiedCSSConsciousnessController | null = null;
  private performanceAnalyzer: PerformanceAnalyzer | null = null;
  private settingsManager: SettingsManager;
  private isSupported: boolean;
  private currentIntensity: GlassIntensity;
  private observers: MutationObserver[] = [];
  
  // Year 3000 consciousness integration
  private musicSyncService: MusicSyncService | null = null;
  private emotionalMapper: EmotionalTemperatureMapper;
  private oklabProcessor: OKLABColorProcessor;
  private consciousnessState: GlassConsciousnessState;
  private cinematicPreset: EnhancementPreset;
  
  // Quality scaling state
  private currentQualityLevel: QualityLevel | null = null;
  private qualityCapabilities: QualityCapability[] = [];
  
  // Cross-system consciousness coordination
  private consciousnessCoordinationCallbacks: Set<(state: GlassConsciousnessState) => void> = new Set();

  constructor(
    config: typeof Config = Config,
    utils: typeof Utils = Utils,
    cssBatcher: UnifiedCSSConsciousnessController | null = null,
    performanceAnalyzer: PerformanceAnalyzer | null = null,
    settingsManager: SettingsManager,
    viewportOptions: ViewportSystemOptions = {}
  ) {
    // Configure viewport awareness for glassmorphism effects
    super({
      visibilityThreshold: 0.2, // More generous threshold since glass effects are subtle
      pauseAnimationsWhenHidden: false, // Glass effects are mostly static
      pauseSettingsUpdatesWhenHidden: true, // Skip expensive glass calculations when hidden
      resumeDelay: 50, // Quick resume for UI effects
      ...viewportOptions
    });

    this.config = config;
    this.utils = utils;
    this.cssBatcher = cssBatcher;
    this.performanceAnalyzer = performanceAnalyzer;
    this.settingsManager = settingsManager;
    this.isSupported = this.detectBackdropFilterSupport();
    this.currentIntensity = "balanced";
    
    // Initialize Year 3000 consciousness systems
    this.emotionalMapper = new EmotionalTemperatureMapper(true);
    this.oklabProcessor = new OKLABColorProcessor(true);
    this.cinematicPreset = OKLABColorProcessor.getPreset('STANDARD');
    
    // Initialize consciousness state
    this.consciousnessState = {
      currentEmotion: 'neutral',
      emotionalIntensity: 0.5,
      beatPhase: 0,
      lastBeatTime: 0,
      cinematicDramaLevel: 0,
      dynamicAccentHex: '#cba6f7', // Catppuccin mauve fallback
      dynamicAccentRgb: '203,166,247',
      consciousnessLevel: 0.5,
      genreStyle: 'organic',
      breathingRate: 1.0
    };
  }

  public static getInstance(): GlassmorphismManager {
    if (!GlassmorphismManager.instance) {
      throw new Error("GlassmorphismManager instance not initialized");
    }
    return GlassmorphismManager.instance;
  }

  // Implement abstract methods from ViewportAwareSystem
  protected async initializeSystem(): Promise<void> {
    const initialIntensity = this.settingsManager.get("sn-glassmorphism-level");
    this.applyGlassmorphismSettings(initialIntensity);
    
    // Initialize Year 3000 consciousness integrations
    await this.initializeConsciousnessIntegration();
    
    // Event handling is now managed by ViewportAwareSystem via UnifiedEventBus
  }

  protected async performHealthCheck(): Promise<HealthCheckResult> {
    return { 
      healthy: true,
      ok: true, 
      details: "GlassmorphismManager is operational.",
      issues: [],
      system: 'GlassmorphismManager',
    };
  }

  protected performAnimationUpdate(deltaTime: number): void {
    // This manager is driven by events, not animation frames.
  }

  protected performDestroy(): void {
    // Event cleanup is now handled by ViewportAwareSystem
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  protected performSettingsUpdate(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail || {};
    if (key === GLASS_LEVEL_KEY || key === GLASS_LEVEL_OLD_KEY) {
      this.applyGlassmorphismSettings(value);
    }
  }

  // Override viewport awareness hooks for glassmorphism-specific behavior
  protected override onBecomingVisible(): void {
    // When becoming visible, refresh glass colors to ensure they're up to date
    if (this.currentIntensity !== "disabled") {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const accentRgb = computedStyle.getPropertyValue('--spice-rgb-accent').trim();
      if (accentRgb && accentRgb !== '') {
        this.updateGlassColors(`rgb(${accentRgb})`, `rgb(${accentRgb})`);
      }
    }
  }

  protected override onBecomingHidden(): void {
    // When becoming hidden, we can skip some expensive glass calculations
    // The CSS variables will remain in place, but we won't update them
  }

  // Settings change handling is now managed by ViewportAwareSystem base class

  private detectBackdropFilterSupport(): boolean {
    try {
      return (
        CSS.supports("backdrop-filter", "blur(1px)") ||
        CSS.supports("-webkit-backdrop-filter", "blur(1px)")
      );
    } catch (error) {
      console.warn(
        "StarryNight: CSS.supports not available, assuming no backdrop-filter support",
        error
      );
      return false;
    }
  }

  public applyGlassmorphismSettings(intensity: GlassIntensity): void {
    const body = document.body;
    body.classList.remove(
      "sn-glass-disabled",
      "sn-glass-minimal",
      "sn-glass-balanced",
      "sn-glass-intense"
    );
    body.classList.add(`sn-glass-${intensity}`);
    this.currentIntensity = intensity;
    this.updateGlassVariables(intensity);
  }

  private updateGlassVariables(intensity: GlassIntensity): void {
    const root = document.documentElement;
    const shouldReduceQuality =
      this.performanceAnalyzer?.shouldReduceQuality() || false;

    let blurValue: string, opacityValue: string, saturationValue: string;

    switch (intensity) {
      case "disabled":
        root.style.removeProperty("--glass-blur");
        root.style.removeProperty("--glass-opacity");
        root.style.removeProperty("--glass-saturation");
        return;
      case "minimal":
        blurValue = shouldReduceQuality ? "2px" : "3px";
        opacityValue = "0.05";
        saturationValue = "1.05";
        break;
      case "intense":
        blurValue = shouldReduceQuality ? "6px" : "8px";
        opacityValue = "0.15";
        saturationValue = "1.4";
        break;
      case "balanced":
      default:
        blurValue = shouldReduceQuality ? "4px" : "6px";
        opacityValue = "0.1";
        saturationValue = "1.2";
        break;
    }

    // Apply Year 3000 consciousness modulations
    const consciousnessModulations = this.calculateConsciousnessModulations();
    
    // Apply emotional and musical modulations to glass properties
    const finalBlur = this.modulateBlurValue(blurValue, consciousnessModulations);
    const finalOpacity = this.modulateOpacityValue(opacityValue, consciousnessModulations);
    const finalSaturation = this.modulateSaturationValue(saturationValue, consciousnessModulations);

    root.style.setProperty("--glass-blur", finalBlur);
    root.style.setProperty("--glass-opacity", finalOpacity);
    root.style.setProperty("--glass-saturation", finalSaturation);
    
    // Set consciousness-aware breathing rate for organic glass effects
    root.style.setProperty("--glass-breathing-rate", `${this.consciousnessState.breathingRate}s`);
    root.style.setProperty("--glass-consciousness-level", this.consciousnessState.consciousnessLevel.toString());
  }

  public updateGlassColors(primaryColor: string, secondaryColor: string): void {
    if (this.currentIntensity === "disabled") return;

    const root = document.documentElement;
    const glassPrimary = this.convertToGlassColor(primaryColor, 0.1);
    const glassSecondary = this.convertToGlassColor(secondaryColor, 0.08);

    root.style.setProperty("--glass-background", glassPrimary);
    root.style.setProperty("--glass-border", glassSecondary);
  }

  private convertToGlassColor(color: string, opacity: number): string {
    try {
      if (typeof color !== "string") {
        return this.getThemeAwareFallback(opacity);
      }
      if (color.startsWith("rgb")) {
        const values = color.match(/\d+/g);
        if (values && values.length >= 3) {
          return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
        }
      }
      if (color.startsWith("#")) {
        const hex = color.slice(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
      }
      return this.getThemeAwareFallback(opacity);
    } catch (error) {
      return this.getThemeAwareFallback(opacity);
    }
  }

  /**
   * Get theme-aware fallback color using Year 3000 dynamic accent cascade
   * Falls back through: --sn-dynamic-accent-rgb → --sn-color-accent-rgb → --spice-rgb-accent → Catppuccin mauve
   */
  private getThemeAwareFallback(opacity: number): string {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Use consciousness state first (most accurate)
    if (this.consciousnessState.dynamicAccentRgb && this.consciousnessState.dynamicAccentRgb !== '203,166,247') {
      return `rgba(${this.consciousnessState.dynamicAccentRgb}, ${opacity})`;
    }
    
    // Try to get dynamic accent from Year 3000 cascade system
    const dynamicAccentRgb = computedStyle.getPropertyValue('--sn-dynamic-accent-rgb').trim() ||
                            computedStyle.getPropertyValue('--sn-color-accent-rgb').trim() ||
                            computedStyle.getPropertyValue('--spice-rgb-accent').trim();
                            
    if (dynamicAccentRgb && dynamicAccentRgb !== '' && !dynamicAccentRgb.includes('undefined')) {
      return `rgba(${dynamicAccentRgb}, ${opacity})`;
    }
    
    // Fall back to text color
    const textRgb = computedStyle.getPropertyValue('--spice-rgb-text').trim();
    if (textRgb && textRgb !== '' && !textRgb.includes('undefined')) {
      return `rgba(${textRgb}, ${opacity})`;
    }
    
    // Final fallback: Catppuccin mauve (theme-appropriate, never white)
    return `rgba(203, 166, 247, ${opacity})`; // #cba6f7 in RGB
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
      }, 'GlassmorphismManager');

      unifiedEventBus.subscribe('colors:harmonized', (event) => {
        this.onColorsHarmonized(event);
      }, 'GlassmorphismManager');

      // Subscribe to music and consciousness events
      unifiedEventBus.subscribe('music:beat', (event) => {
        this.onMusicBeat(event);
      }, 'GlassmorphismManager');

      unifiedEventBus.subscribe('consciousness:dramatic-moment', (event) => {
        this.onCinematicDramaEvent(event);
      }, 'GlassmorphismManager');

      // Get initial dynamic accent color
      this.updateDynamicAccentColor();

      // Initialize cross-system consciousness coordination
      this.initializeCrossSystemCoordination();

      console.log('[GlassmorphismManager] ✅ Year 3000 consciousness integration initialized');
    } catch (error) {
      console.error('[GlassmorphismManager] Failed to initialize consciousness integration:', error);
    }
  }

  /**
   * Calculate consciousness modulations for glass properties
   */
  private calculateConsciousnessModulations(): {
    emotionalModulation: number;
    beatModulation: number;
    cinematicModulation: number;
    breathingModulation: number;
  } {
    const { emotionalIntensity, beatPhase, cinematicDramaLevel, consciousnessLevel } = this.consciousnessState;
    
    // Emotional modulation affects glass opacity and saturation
    const emotionalModulation = 1 + (emotionalIntensity - 0.5) * 0.4; // ±20% based on emotion
    
    // Beat modulation creates subtle rhythmic glass effects
    const beatModulation = 1 + Math.sin(beatPhase) * consciousnessLevel * 0.15; // ±7.5% rhythmic variation
    
    // Cinematic modulation for dramatic glass effects during intense moments
    const cinematicModulation = 1 + cinematicDramaLevel * 0.3; // +30% during dramatic moments
    
    // Organic breathing modulation for glass effects
    const breathingModulation = 1 + Math.sin(Date.now() * this.consciousnessState.breathingRate * 0.001) * 0.08; // ±4% breathing
    
    return {
      emotionalModulation,
      beatModulation,
      cinematicModulation,
      breathingModulation
    };
  }

  /**
   * Modulate blur value with consciousness awareness
   */
  private modulateBlurValue(baseBlur: string, modulations: any): string {
    const blurValue = parseFloat(baseBlur.replace('px', ''));
    const { emotionalModulation, beatModulation, breathingModulation } = modulations;
    
    // Apply modulations (emotional effects blur intensity, beat adds subtle pulse)
    const finalBlur = blurValue * emotionalModulation * beatModulation * breathingModulation;
    
    return `${Math.max(1, Math.round(finalBlur))}px`;
  }

  /**
   * Modulate opacity value with consciousness awareness
   */
  private modulateOpacityValue(baseOpacity: string, modulations: any): string {
    const opacityValue = parseFloat(baseOpacity);
    const { emotionalModulation, cinematicModulation, breathingModulation } = modulations;
    
    // Apply modulations (emotional and cinematic effects are more subtle for opacity)
    const finalOpacity = opacityValue * (1 + (emotionalModulation - 1) * 0.5) * cinematicModulation * breathingModulation;
    
    return Math.max(0.01, Math.min(1.0, finalOpacity)).toFixed(3);
  }

  /**
   * Modulate saturation value with consciousness awareness
   */
  private modulateSaturationValue(baseSaturation: string, modulations: any): string {
    const saturationValue = parseFloat(baseSaturation);
    const { emotionalModulation, beatModulation, cinematicModulation } = modulations;
    
    // Apply modulations (all modulations affect saturation for rich consciousness effects)
    const finalSaturation = saturationValue * emotionalModulation * beatModulation * cinematicModulation;
    
    return Math.max(1.0, Math.min(3.0, finalSaturation)).toFixed(2);
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
      this.consciousnessState.dynamicAccentHex = oklabResult.enhancedHex;
      this.consciousnessState.dynamicAccentRgb = `${oklabResult.enhancedRgb.r},${oklabResult.enhancedRgb.g},${oklabResult.enhancedRgb.b}`;
      
      // Update glass colors with new consciousness-aware accent
      this.updateGlassColors(oklabResult.enhancedHex, oklabResult.enhancedHex);
    }

    // Update consciousness level based on coordination metrics
    if (coordinationMetrics?.consciousnessLevel !== undefined) {
      this.consciousnessState.consciousnessLevel = coordinationMetrics.consciousnessLevel;
    }
  }

  /**
   * Handle music beat events for rhythm-responsive glass effects
   */
  private onMusicBeat(event: any): void {
    const { beat, intensity, timestamp } = event;
    
    // Update beat phase for organic glass breathing
    this.consciousnessState.beatPhase += Math.PI * 2 * 0.5; // Moderate beat responsiveness for glass
    this.consciousnessState.lastBeatTime = timestamp || Date.now();
    
    // Apply beat-synchronized glass pulse for intense beats
    if (intensity > 0.8 && this.currentIntensity !== 'disabled') {
      this.applyBeatSyncGlassPulse(intensity);
    }
  }

  /**
   * Handle cinematic drama events for intense glass effects
   */
  private onCinematicDramaEvent(event: any): void {
    const { intensity, type } = event;
    
    this.consciousnessState.cinematicDramaLevel = intensity;
    
    // Apply dramatic glass effects for intense moments
    if (intensity > 0.7 && this.currentIntensity !== 'disabled') {
      this.applyDramaticGlassDistortion(intensity);
    }
  }

  /**
   * Update emotional state from music analysis
   */
  private updateEmotionalState(emotionalResult: EmotionalTemperatureResult): void {
    this.consciousnessState.currentEmotion = emotionalResult.primaryEmotion;
    this.consciousnessState.emotionalIntensity = emotionalResult.intensity;
    
    // Adjust breathing rate based on emotion
    switch (emotionalResult.primaryEmotion) {
      case 'energetic':
      case 'aggressive':
        this.consciousnessState.breathingRate = 1.5; // Faster breathing for high energy
        this.cinematicPreset = OKLABColorProcessor.getPreset('COSMIC');
        break;
      case 'calm':
      case 'ambient':
        this.consciousnessState.breathingRate = 0.7; // Slower breathing for calm
        this.cinematicPreset = OKLABColorProcessor.getPreset('SUBTLE');
        break;
      default:
        this.consciousnessState.breathingRate = 1.0; // Normal breathing
        this.cinematicPreset = OKLABColorProcessor.getPreset('STANDARD');
    }
  }

  /**
   * Apply beat-synchronized glass pulse effect
   */
  private applyBeatSyncGlassPulse(intensity: number): void {
    if (!this.cssBatcher) return;
    
    const pulseBlur = intensity * 2; // +2px blur during pulse
    const pulseOpacity = intensity * 0.05; // +5% opacity during pulse
    
    // Apply pulse effect through CSS variable updates
    this.cssBatcher.queueCSSVariableUpdate('--glass-beat-pulse-blur', `${pulseBlur}px`);
    this.cssBatcher.queueCSSVariableUpdate('--glass-beat-pulse-opacity', pulseOpacity.toString());
    
    // Reset after pulse duration
    setTimeout(() => {
      if (this.cssBatcher) {
        this.cssBatcher.queueCSSVariableUpdate('--glass-beat-pulse-blur', '0px');
        this.cssBatcher.queueCSSVariableUpdate('--glass-beat-pulse-opacity', '0');
      }
    }, 150);
  }

  /**
   * Apply dramatic glass distortion for cinematic moments
   */
  private applyDramaticGlassDistortion(intensity: number): void {
    if (!this.cssBatcher) return;
    
    const dramaticBlur = intensity * 4; // +4px blur during dramatic moments
    const dramaticSaturation = 1 + intensity * 0.5; // +50% saturation during dramatic moments
    
    // Apply dramatic effect through CSS variable updates
    this.cssBatcher.queueCSSVariableUpdate('--glass-dramatic-blur', `${dramaticBlur}px`);
    this.cssBatcher.queueCSSVariableUpdate('--glass-dramatic-saturation', dramaticSaturation.toString());
    
    // Reset after dramatic moment
    setTimeout(() => {
      if (this.cssBatcher) {
        this.cssBatcher.queueCSSVariableUpdate('--glass-dramatic-blur', '0px');
        this.cssBatcher.queueCSSVariableUpdate('--glass-dramatic-saturation', '1');
      }
    }, 1200);
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
      this.consciousnessState.dynamicAccentHex = dynamicAccentHex;
    }
    
    if (dynamicAccentRgb && dynamicAccentRgb !== '') {
      this.consciousnessState.dynamicAccentRgb = dynamicAccentRgb;
    }
  }

  /**
   * Get current consciousness state for debugging
   */
  public getConsciousnessState(): GlassConsciousnessState {
    return { ...this.consciousnessState };
  }

  // ===================================================================
  // Quality Scaling Implementation (QualityScalingCapable)
  // ===================================================================

  /**
   * Set quality level for glass effects
   */
  public setQualityLevel(level: QualityLevel): void {
    this.currentQualityLevel = level;
    
    // Adjust glass intensity based on quality level
    let adjustedIntensity: GlassIntensity;
    
    switch (level.level) {
      case 'minimal':
        adjustedIntensity = 'minimal';
        break;
      case 'low':
        adjustedIntensity = 'minimal';
        break;
      case 'medium':
        adjustedIntensity = 'balanced';
        break;
      case 'high':
        adjustedIntensity = 'intense';
        break;
      case 'ultra':
        adjustedIntensity = 'intense';
        break;
    }
    
    // Apply the quality-adjusted intensity
    this.applyGlassmorphismSettings(adjustedIntensity);
    
    console.log(`[GlassmorphismManager] Quality level set to: ${level.level} (intensity: ${adjustedIntensity})`);
  }

  /**
   * Get current performance impact metrics
   */
  public getPerformanceImpact(): PerformanceMetrics {
    const intensityImpact = this.currentIntensity === 'disabled' ? 0 :
                           this.currentIntensity === 'minimal' ? 0.1 :
                           this.currentIntensity === 'balanced' ? 0.3 :
                           this.currentIntensity === 'intense' ? 0.5 : 0.2;
    
    const consciousnessImpact = this.consciousnessState.consciousnessLevel * 0.1;
    const breathingImpact = this.consciousnessState.breathingRate > 1 ? 0.05 : 0;
    
    return {
      fps: 60,
      frameTime: intensityImpact + consciousnessImpact + breathingImpact,
      memoryUsageMB: intensityImpact * 2, // Minimal memory impact
      cpuUsagePercent: (intensityImpact + consciousnessImpact) * 50,
      gpuUsagePercent: intensityImpact * 20, // Backdrop filter GPU usage
      renderTime: intensityImpact * 1.5,
      timestamp: Date.now()
    };
  }

  /**
   * Reduce quality level
   */
  public reduceQuality(amount: number): void {
    if (!this.currentQualityLevel) return;
    
    // Reduce consciousness effects
    this.consciousnessState.consciousnessLevel = Math.max(0.1, this.consciousnessState.consciousnessLevel - amount);
    this.consciousnessState.breathingRate = Math.max(0.5, this.consciousnessState.breathingRate - amount * 0.5);
    
    // Apply reduced glass intensity if needed
    if (amount > 0.5) {
      switch (this.currentIntensity) {
        case 'intense':
          this.applyGlassmorphismSettings('balanced');
          break;
        case 'balanced':
          this.applyGlassmorphismSettings('minimal');
          break;
        case 'minimal':
          this.applyGlassmorphismSettings('disabled');
          break;
      }
    }
    
    console.log(`[GlassmorphismManager] Quality reduced by ${amount}`);
  }

  /**
   * Increase quality level
   */
  public increaseQuality(amount: number): void {
    if (!this.currentQualityLevel) return;
    
    // Increase consciousness effects
    this.consciousnessState.consciousnessLevel = Math.min(1.0, this.consciousnessState.consciousnessLevel + amount);
    this.consciousnessState.breathingRate = Math.min(2.0, this.consciousnessState.breathingRate + amount * 0.5);
    
    // Apply increased glass intensity if needed
    if (amount > 0.5) {
      switch (this.currentIntensity) {
        case 'disabled':
          this.applyGlassmorphismSettings('minimal');
          break;
        case 'minimal':
          this.applyGlassmorphismSettings('balanced');
          break;
        case 'balanced':
          this.applyGlassmorphismSettings('intense');
          break;
      }
    }
    
    console.log(`[GlassmorphismManager] Quality increased by ${amount}`);
  }

  /**
   * Get quality capabilities for this system
   */
  public getQualityCapabilities(): QualityCapability[] {
    if (this.qualityCapabilities.length === 0) {
      this.qualityCapabilities = [
        {
          name: 'Backdrop Filter Blur',
          impact: 'high',
          enabled: this.isSupported && this.currentIntensity !== 'disabled',
          canToggle: true
        },
        {
          name: 'Glass Saturation',
          impact: 'low',
          enabled: this.currentIntensity !== 'disabled',
          canToggle: true
        },
        {
          name: 'Consciousness Breathing',
          impact: 'low',
          enabled: true,
          canToggle: true
        },
        {
          name: 'Beat Sync Pulse',
          impact: 'low',
          enabled: true,
          canToggle: true
        },
        {
          name: 'Dramatic Distortion',
          impact: 'medium',
          enabled: true,
          canToggle: true
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
      if (this.consciousnessState.dynamicAccentHex) {
        const oklabResult = this.oklabProcessor.processColor(
          this.consciousnessState.dynamicAccentHex, 
          this.cinematicPreset
        );
        this.consciousnessState.dynamicAccentHex = oklabResult.enhancedHex;
        this.consciousnessState.dynamicAccentRgb = `${oklabResult.enhancedRgb.r},${oklabResult.enhancedRgb.g},${oklabResult.enhancedRgb.b}`;
        
        // Update glass colors with consciousness-aware colors
        this.updateGlassColors(oklabResult.enhancedHex, oklabResult.enhancedHex);
      }
      
      console.log(`[GlassmorphismManager] Color state refreshed for trigger: ${trigger}`);
    } catch (error) {
      console.error('[GlassmorphismManager] Error refreshing color state:', error);
    }
  }

  // ===================================================================
  // Cross-System Consciousness Coordination
  // ===================================================================

  /**
   * Register for consciousness coordination updates
   */
  public onConsciousnessCoordination(callback: (state: GlassConsciousnessState) => void): () => void {
    this.consciousnessCoordinationCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.consciousnessCoordinationCallbacks.delete(callback);
    };
  }

  /**
   * Synchronize consciousness state with other systems
   */
  public synchronizeConsciousnessState(sharedState: Partial<GlassConsciousnessState>): void {
    // Update our consciousness state with shared values
    if (sharedState.currentEmotion) {
      this.consciousnessState.currentEmotion = sharedState.currentEmotion;
    }
    if (sharedState.emotionalIntensity !== undefined) {
      this.consciousnessState.emotionalIntensity = sharedState.emotionalIntensity;
    }
    if (sharedState.beatPhase !== undefined) {
      this.consciousnessState.beatPhase = sharedState.beatPhase;
    }
    if (sharedState.cinematicDramaLevel !== undefined) {
      this.consciousnessState.cinematicDramaLevel = sharedState.cinematicDramaLevel;
    }
    if (sharedState.consciousnessLevel !== undefined) {
      this.consciousnessState.consciousnessLevel = sharedState.consciousnessLevel;
    }
    if (sharedState.dynamicAccentHex) {
      this.consciousnessState.dynamicAccentHex = sharedState.dynamicAccentHex;
    }
    if (sharedState.dynamicAccentRgb) {
      this.consciousnessState.dynamicAccentRgb = sharedState.dynamicAccentRgb;
    }
    if (sharedState.genreStyle) {
      this.consciousnessState.genreStyle = sharedState.genreStyle;
    }
    if (sharedState.breathingRate !== undefined) {
      this.consciousnessState.breathingRate = sharedState.breathingRate;
    }
    
    // Apply consciousness state changes to glass effects
    this.updateGlassVariables(this.currentIntensity);
    
    // Notify other systems of our updated state
    this.broadcastConsciousnessState();
  }

  /**
   * Broadcast consciousness state to coordinated systems
   */
  private broadcastConsciousnessState(): void {
    this.consciousnessCoordinationCallbacks.forEach(callback => {
      try {
        callback(this.consciousnessState);
      } catch (error) {
        console.error('[GlassmorphismManager] Error in consciousness coordination callback:', error);
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
      source: 'GlassmorphismManager',
      state: this.consciousnessState,
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
    
    // Subscribe to beat sync events from other systems
    unifiedEventBus.subscribe('consciousness:beat-sync', (syncEvent) => {
      if (syncEvent.source !== 'GlassmorphismManager') {
        // Synchronize our beat phase with other systems
        this.consciousnessState.beatPhase = syncEvent.beatPhase;
        this.consciousnessState.lastBeatTime = syncEvent.lastBeatTime;
      }
    }, 'GlassmorphismManager');
  }

  /**
   * Enhanced dramatic event with coordination
   */
  private onCinematicDramaEventWithCoordination(event: any): void {
    this.onCinematicDramaEvent(event);
    
    // Broadcast synchronized dramatic state
    this.broadcastConsciousnessState();
    
    // Subscribe to dramatic sync events from other systems
    unifiedEventBus.subscribe('consciousness:dramatic-sync', (syncEvent) => {
      if (syncEvent.source !== 'GlassmorphismManager') {
        // Synchronize our dramatic level with other systems
        this.consciousnessState.cinematicDramaLevel = syncEvent.dramaticLevel;
        
        // Apply coordinated dramatic glass effects
        if (syncEvent.dramaticLevel > 0.7) {
          this.applyDramaticGlassDistortion(syncEvent.dramaticLevel);
        }
      }
    }, 'GlassmorphismManager');
  }

  /**
   * Initialize cross-system consciousness coordination
   */
  public initializeCrossSystemCoordination(): void {
    try {
      // Subscribe to coordination events from other systems
      unifiedEventBus.subscribe('consciousness:coordination', (event) => {
        if (event.source !== 'GlassmorphismManager') {
          this.synchronizeConsciousnessState(event.state);
        }
      }, 'GlassmorphismManager');

      unifiedEventBus.subscribe('consciousness:beat-sync', (event) => {
        if (event.source !== 'GlassmorphismManager') {
          // Synchronize beat phase with other systems
          this.consciousnessState.beatPhase = event.beatPhase;
          this.consciousnessState.lastBeatTime = event.lastBeatTime;
          // Apply coordinated beat pulse to glass effects
          this.applyCoordinatedBeatPulse(event.beatPhase);
        }
      }, 'GlassmorphismManager');

      unifiedEventBus.subscribe('consciousness:dramatic-sync', (event) => {
        if (event.source !== 'GlassmorphismManager') {
          // Synchronize dramatic level with other systems
          this.consciousnessState.cinematicDramaLevel = event.dramaticLevel;
          // Apply coordinated dramatic glass effects
          this.applyCoordinatedDramaticEffects(event.dramaticLevel, event.type || 'unknown');
        }
      }, 'GlassmorphismManager');

      console.log('[GlassmorphismManager] ✅ Cross-system consciousness coordination initialized');
    } catch (error) {
      console.error('[GlassmorphismManager] Failed to initialize cross-system coordination:', error);
    }
  }

  public checkPerformanceAndAdjust(): void {
    if (this.performanceAnalyzer?.shouldReduceQuality() || false) {
      if (this.currentIntensity === "intense") {
        this.applyGlassmorphismSettings("balanced");
      } else if (
        this.currentIntensity === "balanced" ||
        this.currentIntensity === "moderate"
      ) {
        this.applyGlassmorphismSettings("minimal");
      }
    }
  }

  public applyGlassmorphism(
    level: "disabled" | "minimal" | "moderate" | "intense"
  ): void {
    const glassConfig = this.config.glassmorphism[level];
    if (!this.cssBatcher) return;

    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-display",
      level === "disabled" ? "none" : "block"
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-blur",
      `${glassConfig.blur}px`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-saturation",
      `${glassConfig.saturation}`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-brightness",
      `${glassConfig.brightness}`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-noise-opacity",
      `${glassConfig.noiseOpacity}`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-border-opacity",
      `${glassConfig.borderOpacity}`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-shadow-opacity",
      `${glassConfig.shadowOpacity}`
    );

    this.cssBatcher.flushCSSVariableBatch();
    if (this.config.enableDebug) {
      console.log(`💎 [GlassmorphismManager] Applied level: ${level}`);
    }
  }

  // --------------------------------------------------------------------
  // Year3000System central settings broadcast hook
  // --------------------------------------------------------------------
  public applyUpdatedSettings?(key: string, value: any): void {
    if (key === "sn-glassmorphism-level") {
      this.applyGlassmorphismSettings(value as any);
    }
  }

  // ===================================================================
  // Cross-System Consciousness Coordination Methods
  // ===================================================================

  /**
   * Apply coordinated beat pulse to glass effects
   */
  private applyCoordinatedBeatPulse(beatPhase: number): void {
    const modulations = this.calculateConsciousnessModulations();
    const baseIntensity = this.getIntensityValue(this.currentIntensity);
    
    // Create synchronized beat pulse effect
    const beatPulse = 1 + Math.sin(beatPhase) * 0.15 * modulations.beatModulation;
    const pulseOpacity = baseIntensity.opacity * beatPulse;
    
    // Apply coordinated beat effects to glass variables
    this.cssBatcher?.queueCSSVariableUpdate("--sn-glass-opacity", pulseOpacity.toString());
    this.cssBatcher?.queueCSSVariableUpdate("--sn-glass-accent-opacity", (pulseOpacity * 0.8).toString());
    this.cssBatcher?.flushCSSVariableBatch();
  }

  /**
   * Apply coordinated dramatic effects to glass systems
   */
  private applyCoordinatedDramaticEffects(dramaticLevel: number, type: string): void {
    const modulations = this.calculateConsciousnessModulations();
    const baseIntensity = this.getIntensityValue(this.currentIntensity);
    
    // Calculate dramatic enhancement
    const dramaticMultiplier = 1 + dramaticLevel * 0.4;
    const dramaticOpacity = Math.min(1.0, baseIntensity.opacity * dramaticMultiplier);
    const dramaticBlur = Math.min(20, baseIntensity.blur * (1 + dramaticLevel * 0.3));
    
    // Apply coordinated dramatic effects
    this.cssBatcher?.queueCSSVariableUpdate("--sn-glass-opacity", dramaticOpacity.toString());
    this.cssBatcher?.queueCSSVariableUpdate("--sn-glass-blur", `${dramaticBlur}px`);
    this.cssBatcher?.queueCSSVariableUpdate("--sn-glass-accent-opacity", (dramaticOpacity * 0.9).toString());
    this.cssBatcher?.flushCSSVariableBatch();
    
    // Reset after dramatic moment
    setTimeout(() => {
      this.updateGlassVariables(this.currentIntensity);
    }, 1500);
  }

  /**
   * Get intensity values for glass effects
   */
  private getIntensityValue(intensity: GlassIntensity): { opacity: number; blur: number; saturation: number } {
    switch (intensity) {
      case "disabled":
        return { opacity: 0, blur: 0, saturation: 1 };
      case "minimal":
        return { opacity: 0.05, blur: 3, saturation: 1.05 };
      case "balanced":
        return { opacity: 0.1, blur: 6, saturation: 1.2 };
      case "intense":
        return { opacity: 0.15, blur: 8, saturation: 1.4 };
      case "moderate":
        return { opacity: 0.08, blur: 5, saturation: 1.15 };
      default:
        return { opacity: 0.1, blur: 6, saturation: 1.2 };
    }
  }

}
