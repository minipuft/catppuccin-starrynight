import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { MusicSyncService } from "@/services/MusicSyncService";
import type { Year3000Config } from "@/types/models";
import { Year3000System } from "../../core/year3000System";
import {
  MODERN_SELECTORS,
  ORBITAL_ELEMENTS,
  findElementsWithFallback,
} from "../../debug/SpotifyDOMSelectors";
import { SettingsManager } from "../../managers/SettingsManager";
import * as Year3000Utilities from "../../utils/Year3000Utilities";
import { BaseVisualSystem } from "../BaseVisualSystem";

// Type definitions for internal state
interface QuantumEmpathy {
  enabled: boolean;
  empathyScore: number;
  confidenceThreshold: number;
  learningCurve: number;
  patternDatabase: Map<string, any>;
  actionProbabilities: Map<string, any>;
  interactionHistory: any[];
  maxHistoryLength: number;
  learningThrottleMs: number;
  predictionUpdateMs: number;
  maxActiveAnimations: number;
  maxWarmthIntensity: number;
  currentActiveAnimations: number;
}

interface Prediction {
  target: string;
  type: string;
  confidence: number;
  element?: HTMLElement | Element;
}

// YEAR 3000 BEHAVIORAL PREDICTION ENGINE - Performance Optimized
export class BehavioralPredictionEngine extends BaseVisualSystem {
  // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
  public override onAnimate(deltaMs: number): void {
    // Basic implementation - can be enhanced in future phases
  }
  public modeConfig: any;
  private year3000System: Year3000System | null;
  private predictionModel: any;
  private activeHighlights: WeakMap<Element, string>;
  private predictionSensitivity: number;
  private highlightResponsiveness: number;
  private _activeTimers: NodeJS.Timeout[];
  private _eventListeners: {
    element: any;
    event: string;
    handler: (event: any) => void;
  }[];
  private quantumEmpathy: QuantumEmpathy;
  private quantumEmpathyInitialized: boolean = false;
  private predictionTimer: NodeJS.Timeout | null = null;
  private animationTimer: NodeJS.Timeout | null = null;
  private lastPredictionTime: number = 0;
  private _predictiveSystem?: any;

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
    this.modeConfig = {}; // Initialize modeConfig
    this.predictionModel = this.initializePredictionModel();
    this.activeHighlights = new WeakMap();
    this.predictionSensitivity = 0.5;
    this.highlightResponsiveness = 0.8;
    this._activeTimers = [];
    this._eventListeners = [];

    this.quantumEmpathy = {
      enabled: false,
      empathyScore: 0.5,
      confidenceThreshold: 0.6,
      learningCurve: 0.8,
      patternDatabase: new Map(),
      actionProbabilities: new Map(),
      interactionHistory: [],
      maxHistoryLength: 50,
      learningThrottleMs: 1000,
      predictionUpdateMs: 500,
      maxActiveAnimations: 5,
      maxWarmthIntensity: 0.8,
      currentActiveAnimations: 0,
    };

    // Link to PredictiveMaterializationSystem if available for resonance coordination
    this._predictiveSystem =
      year3000System && (year3000System as any).getSystem
        ? (year3000System as any).getSystem("PredictiveMaterializationSystem")
        : null;

    if (this.config?.enableDebug) {
      console.log(
        `🌌 [${this.systemName}] Optimized Quantum Empathy system initialized.`
      );
    }
  }

  public override async initialize() {
    await super.initialize();
    if (this.modeConfig?.quantumEmpathyEnabled) {
      this.initializeOptimizedQuantumEmpathy();
    }
    if (this.config?.enableDebug) {
      console.log(
        `🧠 [${this.systemName}] Initialized with empathy status: ${
          this.modeConfig?.quantumEmpathyEnabled ? "COSMIC ACTIVE" : "DORMANT"
        }.`
      );
    }
  }

  initializeOptimizedQuantumEmpathy() {
    if (this.quantumEmpathyInitialized) return;
    this.setupOptimizedInteractionTracking();
    this.startOptimizedPredictiveHighlighting();
    this.setupSelectiveAnticipatoryAnimations();
    this.quantumEmpathyInitialized = true;
    if (this.config?.enableDebug) {
      console.log(
        `🌟 [${this.systemName}] Optimized Quantum Empathy online - sensing with cosmic efficiency...`
      );
    }
  }

  setupOptimizedInteractionTracking() {
    const keyInteractionEvents = ["click", "focus"];
    let lastLearningTime = 0;
    keyInteractionEvents.forEach((eventType) => {
      const handler = (event: Event) => {
        const now = Date.now();
        if (now - lastLearningTime > this.quantumEmpathy.learningThrottleMs) {
          this.recordOptimizedInteraction(event);
          lastLearningTime = now;
        }
      };
      document.addEventListener(eventType, handler, { passive: true });
      this._eventListeners.push({
        element: document,
        event: eventType,
        handler: handler,
      });
    });
  }

  recordOptimizedInteraction(event: Event) {
    if (!this.modeConfig?.quantumEmpathyEnabled) return;
    const interaction = {
      type: event.type,
      target: this.getElementSignature(event.target as HTMLElement),
      timestamp: Date.now(),
      context: this.getCurrentMusicContext(),
    };
    this.quantumEmpathy.interactionHistory.push(interaction);
    if (
      this.quantumEmpathy.interactionHistory.length >
      this.quantumEmpathy.maxHistoryLength
    ) {
      this.quantumEmpathy.interactionHistory.shift();
    }
    this.learnFromInteractionOptimized(interaction);
  }

  getElementSignature(element: HTMLElement | null): string {
    if (!element) return "unknown";
    const signatures = [];
    if (element.className && typeof element.className === "string")
      signatures.push(`class:${element.className.split(" ")[0]}`);
    if (element.tagName)
      signatures.push(`tag:${element.tagName.toLowerCase()}`);
    return signatures.join("|") || "anonymous";
  }

  getCurrentMusicContext(): {
    energy: number;
    valence: number;
    timeSegment: number;
  } {
    const latestMusicData =
      this.musicSyncService?.getLatestProcessedData?.() || {};
    return {
      energy: latestMusicData.processedEnergy || 0.5,
      valence: latestMusicData.valence || 0.5,
      timeSegment: Math.floor(new Date().getHours() / 6),
    };
  }

  learnFromInteractionOptimized(interaction: any) {
    const patternKey = `${interaction.target}:${interaction.type}`;
    if (!this.quantumEmpathy.patternDatabase.has(patternKey)) {
      this.quantumEmpathy.patternDatabase.set(patternKey, {
        frequency: 0,
        contexts: [],
        lastUsed: 0,
        confidence: 0.1,
      });
    }
    const pattern = this.quantumEmpathy.patternDatabase.get(patternKey);
    pattern.frequency += 1;
    pattern.lastUsed = Date.now();
    pattern.contexts.push(interaction.context);
    if (pattern.contexts.length > 3) {
      pattern.contexts.shift();
    }
    const recencyFactor = Math.exp(-(Date.now() - pattern.lastUsed) / 60000);
    pattern.confidence = Math.min(1.0, (pattern.frequency / 5) * recencyFactor);
    if (this.quantumEmpathy.patternDatabase.size > 100) {
      this.cleanupOldPatterns();
    }
  }

  cleanupOldPatterns() {
    const cutoffTime = Date.now() - 300000; // 5 minutes
    for (const [
      key,
      pattern,
    ] of this.quantumEmpathy.patternDatabase.entries()) {
      if (pattern.lastUsed < cutoffTime && pattern.confidence < 0.3) {
        this.quantumEmpathy.patternDatabase.delete(key);
      }
    }
  }

  startOptimizedPredictiveHighlighting() {
    if (this.predictionTimer) clearInterval(this.predictionTimer);
    this.predictionTimer = setInterval(() => {
      this.applySelectivePredictiveHighlighting();
    }, this.quantumEmpathy.predictionUpdateMs);
    this._activeTimers.push(this.predictionTimer);
  }

  calculateOptimizedPredictions(): Prediction[] {
    const currentContext = this.getCurrentMusicContext();
    const predictions: Prediction[] = [];
    if (!this.quantumEmpathy.patternDatabase) return predictions;
    for (const [
      key,
      pattern,
    ] of this.quantumEmpathy.patternDatabase.entries()) {
      const confidence = pattern.confidence || 0;
      if (confidence < this.quantumEmpathy.confidenceThreshold) continue;
      const contextSimilarity = this.calculateSimplifiedContextSimilarity(
        pattern.contexts,
        currentContext
      );
      const finalConfidence = confidence * contextSimilarity;
      if (finalConfidence > this.predictionSensitivity) {
        const [target, type] = key.split(":");
        if (target && type) {
          predictions.push({
            target,
            type,
            confidence: finalConfidence,
          });
        }
      }
    }
    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  calculateSimplifiedContextSimilarity(
    pastContexts: any[],
    currentContext: any
  ): number {
    if (pastContexts.length === 0) return 0.5;
    let totalSimilarity = 0;
    for (const pContext of pastContexts) {
      const energyDiff = Math.abs(pContext.energy - currentContext.energy);
      const valenceDiff = Math.abs(pContext.valence - currentContext.valence);
      const timeDiff =
        pContext.timeSegment === currentContext.timeSegment ? 0 : 1;
      const similarity = 1 - (energyDiff + valenceDiff + timeDiff) / 3;
      totalSimilarity += similarity;
    }
    return totalSimilarity / pastContexts.length;
  }

  applySelectivePredictiveHighlighting() {
    const predictions = this.calculateOptimizedPredictions();
    const topPredictions = predictions.slice(0, 5);
    const elementsToHighlight = new Map<Element, number>();
    for (const prediction of topPredictions) {
      const elements = this.findElementsBySignature(prediction.target);
      for (const element of elements) {
        if (
          !elementsToHighlight.has(element) ||
          (elementsToHighlight.get(element) ?? 0) < prediction.confidence
        ) {
          elementsToHighlight.set(element, prediction.confidence);
        }
      }
    }
    document.querySelectorAll(".sn-predictive-highlight").forEach((el) => {
      if (!elementsToHighlight.has(el)) {
        el.classList.remove("sn-predictive-highlight");
        el.classList.remove("sn-predictive-highlight-strong");
      }
    });
    for (const [element, confidence] of elementsToHighlight.entries()) {
      element.classList.add("sn-predictive-highlight");
      if (confidence > 0.75) {
        element.classList.add("sn-predictive-highlight-strong");
      }
    }
  }

  findElementsBySignature(signature: string): (Element | HTMLElement)[] {
    if (!signature || typeof signature !== "string") return [];
    try {
      const parts = signature.split("|");
      let selector = "";
      parts.forEach((part) => {
        const [type, value] = part.split(":");
        if (type === "class" && value) {
          selector += `.${value}`;
        } else if (type === "tag" && value) {
          selector += `${value}`;
        }
      });
      if (selector) {
        return Array.from(document.querySelectorAll(selector));
      }
    } catch (error) {
      console.warn(
        `[${this.systemName}] Invalid selector signature:`,
        signature,
        error
      );
    }
    return [];
  }

  setupSelectiveAnticipatoryAnimations() {
    if (this.animationTimer) clearInterval(this.animationTimer);
    this.animationTimer = setInterval(() => {
      if (
        this.quantumEmpathy.currentActiveAnimations <
        this.quantumEmpathy.maxActiveAnimations
      ) {
        const predictions = this.calculateOptimizedPredictions();
        const prediction = predictions[0];
        if (prediction) {
          const elements = this.findElementsBySignature(prediction.target);
          const firstElement = elements[0];
          if (firstElement && prediction.type) {
            this.triggerOptimizedAnticipatoryAnimation(
              firstElement,
              prediction.type,
              prediction.confidence
            );
          }
        }
      }
    }, this.quantumEmpathy.predictionUpdateMs * 2);
    this._activeTimers.push(this.animationTimer);
  }

  triggerOptimizedAnticipatoryAnimation(
    element: Element,
    actionType: string,
    confidence: number
  ) {
    // Phase 4 – Respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // Skip anticipatory warmth animation entirely
    }
    // Share predicted interaction target with PredictiveMaterializationSystem for resonance visuals
    if (this._predictiveSystem?.setTargetElement) {
      this._predictiveSystem.setTargetElement(element as HTMLElement);
    }

    this.quantumEmpathy.currentActiveAnimations++;

    // Map confidence (0.6-1) to warmth intensity 0.15-0.35 and duration 900-1500ms
    const clamped = Math.max(0.6, Math.min(1, confidence));
    const intensity = 0.15 + ((clamped - 0.6) / 0.4) * 0.2; // 0.15 → 0.35
    const durationMs = 1500 - ((clamped - 0.6) / 0.4) * 600; // 1500 → 900ms

    const hueShift = (Math.random() * 40 - 20).toFixed(1); // gentle hue variance

    if (this._predictiveSystem?.triggerAnticipatoryWarmth) {
      // Delegate warmth animation for color harmony with Materialization system
      this._predictiveSystem.triggerAnticipatoryWarmth(element as HTMLElement, {
        hue: parseFloat(hueShift),
        intensity,
        durationMs,
      });
    } else {
      // Fallback: apply class & vars directly
      element.classList.add("sn-anticipatory-warmth");
      (element as HTMLElement).style.setProperty(
        "--sn-anticipatory-intensity",
        intensity.toFixed(3)
      );
      (element as HTMLElement).style.setProperty(
        "--sn-anticipatory-hue",
        `${hueShift}deg`
      );
      (element as HTMLElement).style.setProperty(
        "--sn-warmth-intensity",
        intensity.toFixed(3)
      );
      (element as HTMLElement).style.setProperty(
        "--sn-warmth-duration",
        `${durationMs}ms`
      );
      const animationEndHandler = () => {
        element.classList.remove("sn-anticipatory-warmth");
        this.quantumEmpathy.currentActiveAnimations--;
        element.removeEventListener("animationend", animationEndHandler);
      };
      element.addEventListener("animationend", animationEndHandler);
    }
  }

  public override updateFromMusicAnalysis(
    processedMusicData: any,
    timestamp?: number
  ): void {
    if (!this.initialized || !this.modeConfig?.quantumEmpathyEnabled) return;
    const now = Date.now();
    if (
      now - this.lastPredictionTime >
      this.quantumEmpathy.predictionUpdateMs
    ) {
      this.predictUserInteractions(
        processedMusicData,
        now - this.lastPredictionTime
      );
      this.lastPredictionTime = now;
    }
  }

  generatePredictions(context: any): Prediction[] {
    const predictions: Prediction[] = [];
    Object.keys(this.predictionModel).forEach((action) => {
      const actionModel = this.predictionModel[action];
      let score = actionModel.base;
      Object.keys(context).forEach((feature) => {
        if (actionModel[feature]) {
          score += (actionModel[feature] * context[feature]) / 100;
        }
      });
      if (score > (actionModel.threshold ?? this.predictionSensitivity)) {
        predictions.push({
          target: action,
          type: "highlight",
          confidence: score,
        });
      }
    });
    return predictions;
  }

  applyHighlights(predictions: Prediction[]) {
    const elementsToDeactivate = new Set(
      Object.keys(MODERN_SELECTORS).map((key) => key.toLowerCase())
    );
    predictions.forEach((prediction) => {
      const key = prediction.target.toLowerCase();
      const selector =
        (MODERN_SELECTORS as any)[key] || (ORBITAL_ELEMENTS as any)[key];
      if (selector) {
        elementsToDeactivate.delete(key);
        const elements = findElementsWithFallback(key);
        elements.forEach((element) => {
          const highlightClass = this.getHighlightClasses(
            prediction.confidence > 0.7 ? "strong" : "default"
          );
          if (!this.activeHighlights.has(element)) {
            element.classList.add(...highlightClass);
            this.activeHighlights.set(element, highlightClass.join(" "));
          }
        });
      }
    });
    elementsToDeactivate.forEach((key) => {
      const elements = findElementsWithFallback(key);
      elements.forEach((element) => {
        const classes = this.activeHighlights.get(element);
        if (classes) {
          element.classList.remove(...classes.split(" "));
          this.activeHighlights.delete(element);
        }
      });
    });
  }

  /**
   * Map confidence buckets to CSS classes defined in _sn_prediction_effects.scss.
   * The naming now aligns with the unified "sn-predict-" convention.
   */
  getHighlightClasses(_type: "default" | "strong" = "default"): string[] {
    return ["sn-anticipatory-warmth"];
  }

  override updateModeConfiguration(modeConfig: any) {
    super.updateModeConfiguration(modeConfig);
    this.updatePredictionBehaviorForMode();
    if (this.modeConfig?.quantumEmpathyEnabled) {
      this.initializeOptimizedQuantumEmpathy();
    } else {
      this.destroy();
    }
  }

  updatePredictionBehaviorForMode() {
    if (!this.modeConfig) return;
    const settings = this.modeConfig.predictionSettings;
    if (settings) {
      this.predictionSensitivity = settings.sensitivity ?? 0.5;
      this.highlightResponsiveness = settings.responsiveness ?? 0.8;
      this.quantumEmpathy.confidenceThreshold =
        settings.confidenceThreshold ?? 0.6;
    }
  }

  override destroy() {
    super.destroy();
    this._activeTimers.forEach(clearInterval);
    this._eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this._activeTimers = [];
    this._eventListeners = [];
    this.quantumEmpathyInitialized = false;
    if (this.config?.enableDebug) {
      console.log(
        `[${this.systemName}] Destroyed. No longer predicting user behavior.`
      );
    }
  }

  testUpdatedSelectors() {
    console.log("===== BehavioralPredictionEngine: Selector Test =====");
    let allFound = true;
    Object.keys(MODERN_SELECTORS).forEach((key) => {
      const elements = findElementsWithFallback(key);
      if (elements.length > 0) {
        console.log(`✅ Found ${elements.length} for key: ${key}`);
      } else {
        console.error(`❌ Missing element for key: ${key}`);
        allFound = false;
      }
    });
    console.log(
      allFound
        ? "✅ All primary selectors are valid."
        : "❌ Some selectors failed."
    );
  }

  simulateHighlighting() {
    const mockPredictions: Prediction[] = Object.keys(MODERN_SELECTORS)
      .map((key) => ({
        target: key,
        type: "highlight",
        confidence: Math.random(),
      }))
      .slice(0, 3);
    console.log(
      "Simulating highlights for:",
      mockPredictions.map((p) => p.target)
    );
    this.applyHighlights(mockPredictions);

    setTimeout(() => {
      console.log("Clearing simulated highlights.");
      this.applyHighlights([]);
    }, 2000);
  }

  initializePredictionModel() {
    return {
      playButton: { base: 60, energy: 20, tempo: -10, threshold: 65 },
      nextButton: { base: 40, energy: 15, valence: -15, threshold: 50 },
      progressBar: { base: 30, energy: -10, loudness: 10 },
      likeButton: { base: 50, valence: 30, energy: 10, threshold: 60 },
      sidebarPlaylists: { base: 25, acousticness: -15 },
    };
  }

  override  updateAnimation(timestamp: number, deltaTime: number) {
    if (!this.initialized || !this.modeConfig?.quantumEmpathyEnabled) return;
    // This system's primary updates are interval-based, not frame-based
  }

  predictUserInteractions(musicData: any, deltaTime: number) {
    if (!musicData) return;
    const context = {
      energy: musicData.energy || 0,
      valence: musicData.valence || 0,
      tempo: musicData.tempo || 0,
      loudness: musicData.loudness || 0,
    };
    const predictions = this.generatePredictions(context);
    if (predictions.length > 0) {
      this.applyHighlights(predictions);
    }
  }
}
