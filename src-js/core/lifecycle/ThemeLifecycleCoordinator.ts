// Phase 4: Facade imports for unified system access
import { SystemIntegrationCoordinator } from "@/core/integration/SystemIntegrationCoordinator";

// Progressive enhancement imports
import {
  DegradedModeCoordinator,
  type ProgressiveEnhancementConfig,
} from "@/core/lifecycle/DegradedModeCoordinator";
import type { SpicetifyAPIs } from "@/core/lifecycle/ProgressiveAPILoader";

// Color event coordination imports
import { ColorEventCoordinator } from "@/core/lifecycle/ColorEventCoordinator";

// Settings import for typed access
import { settings } from "@/config";
import {
  ACCENT_COLOR_KEY,
  ARTISTIC_MODE_KEY,
  BRIGHTNESS_MODE_KEY,
  CATPPUCCIN_FLAVOR_KEY,
  GRADIENT_INTENSITY_KEY,
  HARMONIC_EVOLUTION_KEY,
  HARMONIC_INTENSITY_KEY,
  HARMONIC_MODE_KEY,
  PALETTE_SYSTEM_KEY,
} from "@/config/settingKeys";
import type { SettingsChangeEvent } from "@/config/typedSettingsManager";

// Color coordination imports for Strategy pattern
import { globalCSSColorController } from "@/core/css/CSSColorController";
import type { InfrastructureSystemKey } from "@/core/integration/InfrastructureSystemCoordinator";
import type { VisualSystemKey } from "@/visual/effects/VisualEffectsCoordinator";

// Event-driven integration imports
import { unifiedEventBus } from "@/core/events/EventBus";

// Essential configuration imports
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import * as Utils from "@/utils/core/ThemeUtilities";

// Utility function imports
import { startNowPlayingWatcher } from "@/utils/dom/NowPlayingDomWatcher";
import { applyStarryNightSettings } from "@/visual/base/starryNightEffects";

// Type for initialization results
interface InitializationResults {
  success: string[];
  failed: string[];
  skipped: string[];
}

// Type for available APIs tracking
interface AvailableAPIs {
  player?: any;
  platform?: any;
  config?: any;
  degradedMode: boolean;
}

interface VisualSystemConfig {
  name: string;
  Class: new (...args: any[]) => any;
  property:
    | "interactionTrackingSystem"
    | "beatSyncVisualSystem"
    | "behavioralPredictionEngine"
    | "predictiveMaterializationSystem"
    | "webGLGradientBackgroundSystem"
    | "particleFieldSystem"
    | "animationCoordinator"
    | "spotifyUIApplicationSystem"; // contextMenuSystem removed
}

/**
 * ThemeLifecycleCoordinator - Central Lifecycle Management System
 *
 * Coordinates the complete lifecycle of the Catppuccin StarryNight theme:
 * - System initialization and bootstrap
 * - Progressive API loading (degraded → full mode)
 * - Facade coordination via SystemIntegrationCoordinator
 * - Runtime configuration management
 * - Graceful shutdown and cleanup
 *
 * This class serves as the main entry point and orchestrates all theme subsystems
 * through the facade pattern, delegating actual functionality to specialized coordinators.
 *
 * @architecture Central coordinator following facade pattern
 * @see SystemIntegrationCoordinator for system access
 * @see InfrastructureSystemCoordinator for non-visual systems
 * @see VisualEffectsCoordinator for visual systems
 */
export class ThemeLifecycleCoordinator {
  public ADVANCED_SYSTEM_CONFIG: Year3000Config;
  public utils: typeof Utils;
  public initialized: boolean;
  private healthCheckInterval: number | null = null;

  // Phase 4: Facade Coordination System (replaces direct system properties)
  public facadeCoordinator: SystemIntegrationCoordinator | null = null;

  // Color State Management System
  public cssColorController: typeof globalCSSColorController | null = null;

  // Private initialization results storage
  private _initializationResults: any | null = null;

  // Private storage for dynamicCatppuccinBridge to allow setter
  private _dynamicCatppuccinBridge: any | null = null;

  private readonly _pendingLegacySettingKeys = new Set<string>();

  // Phase 3: Color event processing now delegated to ColorEventCoordinator
  // Legacy state properties kept for backward compatibility but unused
  private readonly PROCESSING_TIMEOUT = 5000; // Kept for reference
  private readonly MAX_CHAIN_LENGTH = 10; // Kept for reference
  private readonly COLOR_EVENT_CACHE_TTL = 2000; // Kept for reference

  // Phase 4: Pure Facade Access Property Getters

  // Performance Systems
  public get enhancedMasterAnimationCoordinator() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "AnimationFrameCoordinator"
      ) || null
    );
  }
  public get timerConsolidationSystem() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "TimerConsolidationSystem"
      ) || null
    );
  }
  public get cssVariableController() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem("CSSVariableWriter") ||
      null
    );
  }

  // New simplified performance system getters (primary)
  public get simplePerformanceCoordinator() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "SimplePerformanceCoordinator"
      ) || null
    );
  }
  public get simpleTierBasedPerformanceSystem() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "SimplePerformanceCoordinator"
      ) || null
    );
  }
  public get enhancedDeviceTierDetector() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "DeviceCapabilityDetector"
      ) || null
    );
  }
  public get webglSystemsIntegration() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "WebGLSystemsIntegration"
      ) || null
    );
  }

  // Legacy compatibility getters
  public get unifiedCSSManager() {
    return this.cssVariableController || null;
  }
  /** @deprecated Use simplePerformanceCoordinator instead - legacy complex performance system */
  public get performanceCoordinator() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "UnifiedPerformanceCoordinator"
      ) || null
    );
  }
  /** @deprecated Use enhancedDeviceTierDetector instead - legacy device detection system */
  public get deviceCapabilityDetector() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "DeviceCapabilityDetector"
      ) || null
    );
  }
  /** @deprecated Use simplePerformanceCoordinator instead - legacy complex performance system */
  public get performanceAnalyzer() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "SimplePerformanceCoordinator"
      ) || null
    );
  }
  /** @deprecated Use simplePerformanceCoordinator instead - legacy complex performance system */
  public get unifiedPerformanceCoordinator() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "UnifiedPerformanceCoordinator"
      ) || null
    );
  }
  public get performanceCSSIntegration() {
    return this.cssVariableController || null;
  }
  public get performanceOrchestrator() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "SimplePerformanceCoordinator"
      ) || null
    );
  }
  public get performanceBudgetManager() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "PerformanceBudgetManager"
      ) || null
    );
  }

  // Managers and Services
  public get systemHealthMonitor() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem("UnifiedDebugManager") ||
      null
    );
  }
  // NOTE: settingsManager getter removed - using TypedSettingsManager singleton via settings import
  public get colorHarmonyEngine() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem("ColorHarmonyEngine") ||
      null
    );
  }

  // 🔧 PHASE 3: Unified Color Processing Access
  public get unifiedColorProcessingEngine() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem("ColorProcessor") || null
    );
  }

  public get musicColorIntegrationBridge() {
    // TODO: Return actual MusicColorIntegrationBridge once implemented
    // Temporarily return null until the unified systems are created
    return null;
  }

  // 🔧 PHASE 3: Legacy Compatibility - Delegate to Unified Systems
  public get colorEventOrchestrator() {
    // Delegate to unified processing engine during transition
    const unified = this.unifiedColorProcessingEngine;
    return unified ? (unified as any) : null; // Type compatibility shim
  }

  public get colorOrchestrator() {
    // Delegate to unified processing engine during transition
    const unified = this.unifiedColorProcessingEngine;
    return unified ? (unified as any) : null;
  }

  public get enhancedColorOrchestrator() {
    // Delegate to unified processing engine during transition
    const unified = this.unifiedColorProcessingEngine;
    return unified ? (unified as any) : null;
  }

  public get colorEffectsState() {
    // 🔧 PHASE 4: Delegate to unified visual effects coordinator
    return this.visualEffectsCoordinator || null;
  }

  public get musicSyncService() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem("MusicSyncService") ||
      null
    );
  }
  public get glassmorphismManager() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "GlassmorphismManager"
      ) || null
    );
  }
  public get card3DManager() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem("Card3DManager") || null
    );
  }

  // Consciousness Systems
  // GenreGradientEvolution removed - functionality consolidated into GenreProfileManager
  // Access genre functionality via ColorHarmonyEngine or DepthLayeredGradientSystem
  public get musicEmotionAnalyzer() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "MusicEmotionAnalyzer"
      ) || null
    );
  }

  // 🔧 PHASE 4: Unified Visual Effects Coordination
  public get visualEffectsCoordinator() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "VisualEffectsCoordinator"
      ) || null
    );
  }

  // 🔧 PHASE 4: Backward compatibility delegation for consolidated visual effects systems
  public get colorEffectsManager() {
    return this.visualEffectsCoordinator || null;
  }
  public get dynamicCatppuccinBridge() {
    return (
      this._dynamicCatppuccinBridge || this.visualEffectsCoordinator || null
    );
  }

  public set dynamicCatppuccinBridge(bridge: any) {
    this._dynamicCatppuccinBridge = bridge;
  }

  // Visual Systems
  public get particleVisualEffectsModule() {
    return this.facadeCoordinator?.getVisualSystem("Particle") || null;
  }
  public get sidebarVisualEffectsController() {
    return (
      this.facadeCoordinator?.getVisualSystem("SidebarVisualEffects") || null
    );
  }

  public get uiVisualEffectsController() {
    return this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null;
  }

  public get headerVisualEffectsController() {
    return (
      this.facadeCoordinator?.getVisualSystem("HeaderVisualEffects") || null
    );
  }

  // Legacy compatibility getters
  public get lightweightParticleSystem() {
    return this.facadeCoordinator?.getVisualSystem("Particle") || null;
  }

  // UI Effects systems now consolidated into UIVisualEffectsController
  public get iridescentShimmerEffectsSystem() {
    return this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null;
  }
  public get interactionTrackingSystem() {
    return this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null;
  }
  public get whiteLayerDiagnosticSystem() {
    return this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null;
  }
  public get audioVisualController() {
    return this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null;
  }
  public get prismaticScrollSheenSystem() {
    return this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null;
  }
  public get beatSyncVisualSystem() {
    return (
      this.facadeCoordinator?.getVisualSystem("MusicBeatSync" as any) || null
    );
  }
  public get webGLGradientBackgroundSystem() {
    return this.facadeCoordinator?.getVisualSystem("WebGLBackground") || null;
  }
  // Legacy compatibility - particleFieldSystem consolidated into particleVisualEffectsModule
  public get particleFieldSystem() {
    return this.facadeCoordinator?.getVisualSystem("Particle") || null;
  }
  public get animationCoordinator() {
    // Animation coordination through AnimationFrameCoordinator
    return this.enhancedMasterAnimationCoordinator || null;
  }

  /** @deprecated Use animationCoordinator instead */
  public get emergentChoreographyEngine() {
    return this.animationCoordinator;
  }
  public get spotifyUIApplicationSystem() {
    return (
      this.facadeCoordinator?.getVisualSystem("SpotifyUIApplication" as any) ||
      null
    );
  }

  // Music Beat Synchronization System
  public get musicBeatSyncVisualEffects() {
    return (
      this.facadeCoordinator?.getVisualSystem("MusicBeatSync" as any) ||
      this.beatSyncVisualSystem
    );
  }

  // Integration Systems Getters
  public get sidebarSystemsIntegration() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "SidebarSystemsIntegration"
      ) || null
    );
  }

  // API availability tracking
  public availableAPIs: AvailableAPIs | null = null;
  private _songChangeHandler: (() => Promise<void>) | null = null;

  // Progressive enhancement coordination
  private degradedModeCoordinator: DegradedModeCoordinator | null = null;

  // Color event coordination
  private colorEventCoordinator: ColorEventCoordinator | null = null;

  // Stats
  private _lastInitializationTime: number | null = null;
  private readonly _initializationRetryHistory: any[] = [];
  private _systemStartTime: number | null = null;

  // Listen for live settings changes (registered early so no duplicates)
  private _boundExternalSettingsHandler: (event: Event) => void;
  // Bound handler for Artistic Mode change events
  private _boundArtisticModeHandler: (event: Event) => void;
  // NEW: Flush pending style updates when the tab becomes backgrounded
  private _boundVisibilityChangeHandler: () => void;
  // NEW: Bridge TypedSettingsManager onChange callbacks to legacy broadcast system
  private _boundTypedSettingsHandler: ((event: any) => void) | null = null;
  private _disposeNowPlayingWatcher: (() => void) | null = null;

  /**
   * Indicates whether automatic harmonic evolution is permitted. This mirrors the
   * `sn-harmonic-evolution` setting and `ADVANCED_SYSTEM_CONFIG.colorHarmonyEvolution`.
   * Sub-systems can read this flag instead of accessing the config directly so
   * that future scheduling logic (e.g. TimerConsolidationSystem) can rely on a
   * guaranteed field.
   */
  public allowHarmonicEvolution: boolean = true;

  /** Global switch other systems can read to know guardrails are active */
  public performanceGuardActive: boolean = false;

  constructor(
    config: AdvancedSystemConfig | Year3000Config = ADVANCED_SYSTEM_CONFIG
  ) {
    this.ADVANCED_SYSTEM_CONFIG = this._deepCloneConfig(config);
    if (typeof this.ADVANCED_SYSTEM_CONFIG.init === "function") {
      this.ADVANCED_SYSTEM_CONFIG.init();
    }
    // this.HARMONIC_MODES = harmonicModes; // Phase 4: Removed for facade pattern
    this.utils = Utils;
    this.initialized = false;
    this._systemStartTime = Date.now();

    // Phase 4: Properties now accessed via facade getters
    // All system properties are now getters that access this.facadeCoordinator
    // No more null property initialization needed

    this._initializationResults = null; // Private property for initialization results

    if (this.ADVANCED_SYSTEM_CONFIG?.enableDebug) {
      console.log(
        "🌟 [Year3000System] Constructor: Instance created with Enhanced Master Animation Coordinator"
      );
    }

    // DEPRECATED: DOM event listener kept for external compatibility only
    // TypedSettingsManager now uses onChange() callbacks (see _handleTypedSettingsChange)
    // This listener may be removed in future versions
    this._boundExternalSettingsHandler =
      this._handleExternalSettingsChange.bind(this);
    document.addEventListener(
      "year3000SystemSettingsChanged",
      this._boundExternalSettingsHandler
    );

    // Bind and register Artistic Mode change listener so that UI refreshes instantly
    this._boundArtisticModeHandler = this._onArtisticModeChanged.bind(this);
    document.addEventListener(
      "year3000ArtisticModeChanged",
      this._boundArtisticModeHandler
    );

    // Register TypedSettingsManager onChange callback (Phase 6B modern pattern)
    this._boundTypedSettingsHandler =
      this._handleTypedSettingsChange.bind(this);
    settings.onChange(this._boundTypedSettingsHandler);

    // NEW: Flush pending style updates when the tab becomes backgrounded
    this._boundVisibilityChangeHandler =
      this._handleVisibilityChange.bind(this);
    document.addEventListener(
      "visibilitychange",
      this._boundVisibilityChangeHandler
    );

    // Start NowPlaying DOM watcher (force-refresh variable)
    this._disposeNowPlayingWatcher = startNowPlayingWatcher(() => {
      const timestamp = Date.now().toString();
      this.queueCSSVariableUpdate("--sn-force-refresh", timestamp);

      // Publish event for systems that need to react to music changes
      // This replaces DOM watching with event-driven coordination
      unifiedEventBus.emit("music:track-changed", {
        timestamp: parseInt(timestamp),
        trackUri: "unknown",
        artist: "unknown",
        title: "unknown",
      });
    }, this.ADVANCED_SYSTEM_CONFIG.enableDebug);

    // Keep local convenience flag in sync with config default
    this.allowHarmonicEvolution =
      this.ADVANCED_SYSTEM_CONFIG.colorHarmonyEvolution ?? true;

    // Apply initial performance profile based on default artistic mode
    setTimeout(() => {
      this._applyPerformanceProfile();
    }, 0);
  }

  private _deepCloneConfig(
    config: AdvancedSystemConfig | Year3000Config
  ): Year3000Config {
    // From v0.9.15 we stop deep-cloning the shared configuration to avoid state
    // divergence between the global ADVANCED_SYSTEM_CONFIG (used by the settings UI)
    // and the copy referenced by subsystems. We simply keep the original object
    // reference so that all mutations are observed everywhere.
    return config;
  }

  public updateConfiguration(key: string, value: any): void {
    if (!this.ADVANCED_SYSTEM_CONFIG) {
      console.warn(
        "[Year3000System] Cannot update configuration - config not initialized"
      );
      return;
    }

    const keyPath = key.split(".").filter(Boolean);
    if (!keyPath.length) {
      return;
    }

    let current: any = this.ADVANCED_SYSTEM_CONFIG;
    const finalKey = keyPath.pop();

    if (!finalKey) {
      return;
    }

    for (const pathKey of keyPath) {
      if (typeof current[pathKey] !== "object" || current[pathKey] === null) {
        current[pathKey] = {};
      }
      current = current[pathKey];
    }

    const oldValue = current[finalKey];
    current[finalKey] = value;

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        `[Year3000System] Configuration updated: ${key} = ${value} (was: ${oldValue})`
      );
    }

    this._notifyConfigurationChange(key, value, oldValue);
  }

  private _notifyConfigurationChange(
    key: string,
    newValue: any,
    oldValue: any
  ): void {
    unifiedEventBus.emit("config:changed", {
      key,
      newValue,
      oldValue,
      timestamp: Date.now(),
    });

    this.facadeCoordinator?.broadcastSettingChange(key, newValue);

    if (key === ARTISTIC_MODE_KEY || key.includes("artisticMode")) {
      this._applyPerformanceProfile();
    }

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        `[Year3000System] Configuration change notified: ${key} changed from ${oldValue} to ${newValue}`
      );
    }
  }

  private async _applySettingChange(
    key: string,
    newValue: unknown,
    oldValue: unknown
  ): Promise<void> {
    const aliasMap: Record<string, string> = {
      artisticMode: ARTISTIC_MODE_KEY,
      harmonicIntensity: HARMONIC_INTENSITY_KEY,
      harmonicEvolution: HARMONIC_EVOLUTION_KEY,
      harmonicMode: HARMONIC_MODE_KEY,
      manualBaseColor: "sn-manual-base-color",
      flavor: CATPPUCCIN_FLAVOR_KEY,
      paletteSystem: PALETTE_SYSTEM_KEY,
      brightnessMode: BRIGHTNESS_MODE_KEY,
      gradientIntensity: GRADIENT_INTENSITY_KEY,
    };

    const normalizedKey = aliasMap[key] ?? key;
    let handledByConfiguration = false;

    try {
      switch (normalizedKey) {
        case ARTISTIC_MODE_KEY: {
          if (typeof newValue === "string" && newValue.length > 0) {
            this.updateConfiguration("artisticMode", newValue);
            handledByConfiguration = true;
          }
          break;
        }
        case HARMONIC_INTENSITY_KEY: {
          const numericValue =
            typeof newValue === "number"
              ? newValue
              : parseFloat(String(newValue ?? ""));
          if (!Number.isNaN(numericValue)) {
            this.ADVANCED_SYSTEM_CONFIG.colorHarmonyIntensity = numericValue;
            if (this.colorHarmonyEngine?.setIntensity) {
              this.colorHarmonyEngine.setIntensity(numericValue);
            }
            this.updateColorsFromCurrentTrack?.();
          }
          break;
        }
        case HARMONIC_EVOLUTION_KEY: {
          const enabled =
            typeof newValue === "boolean"
              ? newValue
              : newValue === "true" || newValue === "1";
          this.allowHarmonicEvolution = enabled;
          this.ADVANCED_SYSTEM_CONFIG.colorHarmonyEvolution = enabled;
          break;
        }
        case HARMONIC_MODE_KEY: {
          if (typeof newValue === "string" && newValue.length > 0) {
            this.ADVANCED_SYSTEM_CONFIG.currentColorHarmonyMode = newValue;
            this.updateColorsFromCurrentTrack?.();
          }
          break;
        }
        case "sn-manual-base-color": {
          if (
            typeof newValue === "string" &&
            newValue.trim() !== "" &&
            newValue.startsWith("#")
          ) {
            this.updateHarmonicBaseColor(newValue);
          }
          break;
        }
        case PALETTE_SYSTEM_KEY: {
          if (typeof newValue === "string" && newValue.length > 0) {
            this.ADVANCED_SYSTEM_CONFIG.paletteSystem = newValue as any;
            await this.applyInitialSettings("full");
          }
          break;
        }
        case ACCENT_COLOR_KEY: {
          if (typeof newValue === "string" && newValue.length > 0) {
            if (this.cssColorController?.initialized) {
              await this.cssColorController.updateColorState("accent");
              await this.refreshColorDependentSystems("accent");
            } else {
              await this._applyCatppuccinAccent(newValue);
            }
          }
          break;
        }
        case CATPPUCCIN_FLAVOR_KEY: {
          if (typeof newValue === "string" && newValue.length > 0) {
            if (typeof Spicetify !== "undefined" && Spicetify.Config) {
              const previous = Spicetify.Config.color_scheme;
              Spicetify.Config.color_scheme = newValue;
              if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
                console.log(
                  `🎨 [Year3000System] Synchronized Spicetify.Config.color_scheme: ${previous} → ${newValue}`
                );
              }
              Spicetify.colorScheme?.(newValue);
            }

            if (this.cssColorController?.initialized) {
              await this.cssColorController.applyInitialColorState();
            }

            await this.applyInitialSettings("flavor");
          }
          break;
        }
        case BRIGHTNESS_MODE_KEY: {
          await this.updateColorStateOnly("brightness");
          await this.refreshColorDependentSystems("brightness");
          break;
        }
        case GRADIENT_INTENSITY_KEY: {
          const stringValue = String(newValue ?? "balanced");
          const normalized =
            stringValue === "disabled" ||
            stringValue === "minimal" ||
            stringValue === "balanced" ||
            stringValue === "intense"
              ? (stringValue as "disabled" | "minimal" | "balanced" | "intense")
              : "balanced";
          await this._applyStarryNightSettings(normalized, normalized);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error(
        `[Year3000System] Failed to apply setting change for ${key}:`,
        error
      );
    }

    if (!handledByConfiguration) {
      this._notifyConfigurationChange(normalizedKey, newValue, oldValue);
    }

    this._refreshConditionalSystems();
  }

  public async initializeAllSystems(): Promise<void> {
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🌌 [Year3000System] initializeAllSystems(): Starting full system initialization..."
      );
    }
    this._systemStartTime = Date.now();
    const startTime = performance.now();
    const initializationResults: InitializationResults = {
      success: [],
      failed: [],
      skipped: [],
    };

    // Phase 4: Initialize Facade Coordination System (Pure Facade Pattern)
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🌌 [Year3000System] Initializing Facade Coordination System..."
      );
    }
    try {
      this.facadeCoordinator = new SystemIntegrationCoordinator(
        this.ADVANCED_SYSTEM_CONFIG,
        this.utils,
        this
      );
      await this.facadeCoordinator.initialize({
        mode: "unified",
        enableSharedDependencies: true,
        enableCrossFacadeCommunication: true,
        enableUnifiedPerformanceMonitoring: true,
        enableResourceOptimization: true,
        coordination: {
          enforceSequentialInitialization: true,
          dependencyValidation: true,
          enableInitializationGates: true,
          systemReadinessTimeout: 5000,
          phaseTransitionTimeout: 10000,
        },
        performanceThresholds: {
          maxTotalMemoryMB: 100,
          maxTotalInitTime: 5000,
          maxCrossCommLatency: 50,
        },
        coordinationPreferences: {
          preferSharedResources: true,
          enableEventPropagation: true,
          enableHealthCoordination: true,
        },
      });

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🌌 [Year3000System] Facade Coordination System initialized successfully"
        );
      }

      // EventMigrationManager removed - migration to UnifiedEventBus complete

      // Initialize CSSColorController
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Initializing CSSColorController...");
      }
      try {
        this.cssColorController = globalCSSColorController;
        if (!this.cssColorController.initialized) {
          await this.cssColorController.initialize();
        }
        initializationResults.success.push("CSSColorController");
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌌 [Year3000System] CSSColorController initialized successfully"
          );
        }
      } catch (error) {
        console.error(
          "🌌 [Year3000System] Failed to initialize CSSColorController:",
          error
        );
        initializationResults.failed.push("CSSColorController");
      }

      // Phase 4: Initialize core systems through facades
      await this._initializeFacadeSystems();
    } catch (error) {
      console.error(
        "🌌 [Year3000System] Failed to initialize Facade Coordination System:",
        error
      );
      throw error;
    }

    // Phase 4: Legacy system initializers commented out for facade migration
    /* const systemInitializers = [
      {
        name: "DeviceCapabilityDetector",
        init: () => {
          this.deviceCapabilityDetector = new DeviceCapabilityDetector();
          this.deviceCapabilityDetector.initialize();
        },
      },
      {
        name: "TimerConsolidationSystem",
        init: () => {
          this.timerConsolidationSystem = new TimerConsolidationSystem();
        },
      },
      // NOTE: PerformanceAnalyzer is now handled by facade coordinator using SimplePerformanceCoordinator
      // The old complex PerformanceAnalyzer has been replaced with a tier-based system
      {
        name: "CSSVariableWriter",
        init: () => {
          this.unifiedCSSManager = CSSVariableWriter.getInstance(
            this.ADVANCED_SYSTEM_CONFIG
          );

          // Initialize with performance analyzer and CSS variable batcher
          if (this.performanceAnalyzer && this.cssVariableController) {
            this.unifiedCSSManager.initialize(
              this.performanceAnalyzer,
              this.cssVariableController
            );
          }
        },
      },
      {
        name: "UnifiedPerformanceCoordinator",
        init: () => {
          if (this.performanceAnalyzer) {
            this.performanceCoordinator =
              UnifiedPerformanceCoordinator.getInstance(
                this.ADVANCED_SYSTEM_CONFIG,
                this.performanceAnalyzer
              );

            // Enable adaptive optimization
            this.performanceCoordinator.enableAdaptiveOptimization();

            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(
                "[Year3000System] UnifiedPerformanceCoordinator initialized with adaptive optimization"
              );
            }
          }
        },
      },
      // PerformanceOptimizationManager consolidated into UnifiedPerformanceCoordinator
      {
        name: "CSSVariableWriter",
        init: () => {
          if (this.unifiedCSSManager && this.unifiedPerformanceCoordinator) {
            this.performanceCSSIntegration =
              CSSVariableWriter.getInstance(
                this.ADVANCED_SYSTEM_CONFIG,
                this.unifiedCSSManager,
                this.unifiedPerformanceCoordinator
              );

            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(
                "[Year3000System] CSSVariableWriter initialized with CSS performance coordination"
              );
            }
          }
        },
      },
      // NOTE: SettingsManager removed - using typed settings singleton instead
      {
        name: "AnimationFrameCoordinator",
        init: () => {
          if (!this.performanceCoordinator) {
            throw new Error(
              "UnifiedPerformanceCoordinator is required for AnimationFrameCoordinator."
            );
          }

          // Create singleton instance of AnimationFrameCoordinator
          this.enhancedMasterAnimationCoordinator =
            AnimationFrameCoordinator.getInstance(
              this.ADVANCED_SYSTEM_CONFIG,
              this.performanceCoordinator
            );

          // Start the master animation loop
          this.enhancedMasterAnimationCoordinator.startMasterAnimationLoop();

          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log(
              "[Year3000System] AnimationFrameCoordinator initialized for Phase 4 consolidation"
            );
          }
        },
      },
      {
        name: "MusicSyncService",
        init: async () => {
          this.musicSyncService = new MusicSyncService({
            ADVANCED_SYSTEM_CONFIG: this.ADVANCED_SYSTEM_CONFIG,
            ThemeUtilities: this.utils,
            year3000System: this,
          });
          await this.musicSyncService.initialize();
          this.musicSyncService.subscribe(this, "Year3000System");
        },
      },
      {
        name: "ColorHarmonyEngine",
        init: async () => {
          if (!this.performanceAnalyzer) {
            throw new Error(
              "SimplePerformanceCoordinator is required for ColorHarmonyEngine."
            );
          }
          // NOTE: SpicetifyColorBridge should be provided by SystemIntegrationCoordinator
          // AdvancedThemeSystem uses old architecture - will use legacy fallback
          this.colorHarmonyEngine = new ColorHarmonyEngine(
            this.ADVANCED_SYSTEM_CONFIG,
            this.utils,
            this.performanceAnalyzer
            // No spicetifyBridge - will create legacy instance internally
          );
          await this.colorHarmonyEngine.initialize();

          if (this.musicSyncService) {
            this.musicSyncService.setColorHarmonyEngine(
              this.colorHarmonyEngine
            );
          }

          if (this.systemHealthMonitor) {
            this.systemHealthMonitor.registerSystem(
              "ColorHarmonyEngine",
              this.colorHarmonyEngine
            );
          }
        },
      },
      {
        name: "GlassmorphismManager",
        init: async () => {
          if (!this.performanceAnalyzer) {
            throw new Error(
              "SimplePerformanceCoordinator is required for GlassmorphismManager."
            );
          }
          this.glassmorphismManager = new GlassmorphismManager(
            this.ADVANCED_SYSTEM_CONFIG,
            this.utils,
            this.cssVariableController,
            this.performanceAnalyzer
          );
          await this.glassmorphismManager.initialize();
          if (this.systemHealthMonitor) {
            this.systemHealthMonitor.registerSystem(
              "GlassmorphismManager",
              this.glassmorphismManager
            );
          }
        },
      },
      {
        name: "Card3DManager",
        init: async () => {
          if (!this.performanceAnalyzer) {
            throw new Error(
              "SimplePerformanceCoordinator is required for Card3DManager."
            );
          }
          this.card3DManager = new Card3DManager(
            this.performanceAnalyzer,
            this.utils
          );
          await this.card3DManager.initialize();
          if (this.systemHealthMonitor && this.card3DManager) {
            this.systemHealthMonitor.registerSystem(
              "Card3DManager",
              this.card3DManager
            );
          }
        },
      },
      // ContextMenuSystem removed
    ]; */

    // Phase 4: Replace direct system initialization with facade initialization
    // All systems now accessible via facade patterns - no direct initialization needed
    initializationResults.success.push("FacadeCoordinationSystem");

    // Phase 4: Performance monitoring through facade
    if (this.performanceAnalyzer) {
      this.performanceAnalyzer.startMonitoring();
      this.performanceGuardActive = true;
    }

    /* for (const { name, init } of systemInitializers) {
      try {
        await init();
        initializationResults.success.push(name);
      } catch (error) {
        initializationResults.failed.push(name);
        console.error(`[Year3000System] Failed to initialize ${name}:`, error);
      }
    } */

    // Phase 4: Visual systems now initialized through facade
    // await this._initializeVisualSystems(initializationResults);

    // Phase 4: Unified System Integration managed by facade
    /* try {
      this.unifiedSystemIntegration = new UnifiedSystemIntegration(this);
      await this.unifiedSystemIntegration.initialize();
      initializationResults.success.push("UnifiedSystemIntegration");

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🔧 [Year3000System] Unified system integration initialized"
        );
      }
    } catch (error) {
      initializationResults.failed.push("UnifiedSystemIntegration");
      console.error(
        "[Year3000System] Failed to initialize unified system integration:",
        error
      );
    } */

    // Legacy Animation System Registration Phase - deprecated
    // Note: Animation registration now handled by AnimationFrameCoordinator

    // Phase 4: Enhanced Animation System Registration
    if (this.enhancedMasterAnimationCoordinator) {
      await this._registerEnhancedAnimationSystems();
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🎬 [Year3000System] Enhanced animation system registration phase complete"
        );
      }
    } else {
      console.warn(
        "[Year3000System] AnimationFrameCoordinator not available for enhanced registration phase"
      );
    }

    this._initializationResults = initializationResults;
    this.initialized = true;

    const endTime = performance.now();
    this._lastInitializationTime = endTime - startTime;

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        `[Year3000System] System initialization complete in ${this._lastInitializationTime.toFixed(
          2
        )}ms.`
      );
      console.log(
        `[Year3000System] Results: ${initializationResults.success.length} success, ${initializationResults.failed.length} failed.`
      );

      // NEW: Verbose breakdown for easier debugging of missing/failed systems
      if (initializationResults.failed.length > 0) {
        console.warn(
          `[Year3000System] Failed systems: ${initializationResults.failed.join(
            ", "
          )}`
        );
      }

      if (
        initializationResults.skipped &&
        initializationResults.skipped.length > 0
      ) {
        console.info(
          `[Year3000System] Skipped systems: ${initializationResults.skipped.join(
            ", "
          )}`
        );
      }

      if (initializationResults.success.length > 0) {
        console.info(
          `[Year3000System] Successful systems: ${initializationResults.success.join(
            ", "
          )}`
        );
      }

      // Log the detailed health report right after initialization
      if (this.systemHealthMonitor) {
        this.systemHealthMonitor.logHealthReport();
      }
    }
  }

  /**
   * Initialize essential systems for degraded mode (no Spicetify APIs)
   * Phase 4: Essential system initialization for degraded mode
   */
  private async _initializeEssentialFacadeSystems(): Promise<void> {
    if (!this.facadeCoordinator) {
      throw new Error(
        "Facade coordinator not available for essential system initialization"
      );
    }

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🌌 [Year3000System] Initializing essential systems for degraded mode..."
      );
    }

    try {
      // Initialize only essential systems that don't require Spicetify APIs
      const essentialSystems = [
        "SimplePerformanceCoordinator",
        "CSSVariableWriter",
        "UnifiedDebugManager",
        "DeviceCapabilityDetector",
        "TimerConsolidationSystem",
      ];

      for (const systemKey of essentialSystems) {
        try {
          const system = await this.facadeCoordinator.getNonVisualSystem(
            systemKey as any
          );
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(
                `🌌 [Year3000System] Essential: Initialized ${systemKey} via facade`
              );
            }
          }
        } catch (error) {
          console.error(
            `🌌 [Year3000System] Failed to initialize essential ${systemKey}:`,
            error
          );
        }
      }

      // Start performance monitoring if available
      if (this.performanceAnalyzer) {
        this.performanceAnalyzer.startMonitoring();
        this.performanceGuardActive = true;
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌌 [Year3000System] Essential: Performance monitoring started"
          );
        }
      }
    } catch (error) {
      console.error(
        "🌌 [Year3000System] Essential facade system initialization failed:",
        error
      );
      throw error;
    }
  }

  public async initializeDegradedMode(
    initialAPIs?: Partial<SpicetifyAPIs>,
    enhancementConfig?: ProgressiveEnhancementConfig
  ): Promise<void> {
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🌌 [Year3000System] initializeDegradedMode(): Starting degraded mode initialization..."
      );
    }

    this.availableAPIs = {
      player: initialAPIs?.player,
      platform: initialAPIs?.platform,
      config: initialAPIs?.config,
      degradedMode: true,
    } as AvailableAPIs;

    await this._initializeEssentialFacadeSystems();

    if (!this.degradedModeCoordinator) {
      this.degradedModeCoordinator = new DegradedModeCoordinator({
        enableDebug: this.ADVANCED_SYSTEM_CONFIG.enableDebug,
        ...(enhancementConfig ?? {}),
        onAPIsAvailable: async (apis) => {
          try {
            this.availableAPIs = { ...apis, degradedMode: false };
            await this.initializeAllSystems();
          } catch (error) {
            console.error(
              "❌ [Year3000System] Failed to upgrade from degraded mode:",
              error
            );
          }
        },
      });
    }

    this.degradedModeCoordinator.startMonitoring();
  }

  /**
   * Initialize essential systems through facade pattern
   * Phase 4: Core system initialization via facades
   */
  private async _initializeFacadeSystems(): Promise<void> {
    if (!this.facadeCoordinator) {
      throw new Error(
        "Facade coordinator not available for system initialization"
      );
    }

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🌌 [Year3000System] Initializing essential systems through facades..."
      );
    }

    try {
      // Performance optimization: Initialize systems in parallel groups based on dependencies
      // Group 1: Independent foundation systems (can initialize in parallel)
      const foundationSystems: InfrastructureSystemKey[] = [
        "SimplePerformanceCoordinator",
        "UnifiedDebugManager",
        "DeviceCapabilityDetector",
        "TimerConsolidationSystem",
      ];

      // Group 2: Systems that depend on foundation systems
      const dependentSystems: InfrastructureSystemKey[] = [
        "CSSVariableWriter", // Depends on SimplePerformanceCoordinator
        "UnifiedPerformanceCoordinator", // Depends on SimplePerformanceCoordinator
      ];

      // 🔧 PHASE 7: ColorProcessor initialization moved to SystemIntegrationCoordinator
      // ColorProcessor is now initialized in the services phase BEFORE MusicSyncService
      // This ensures it subscribes to 'colors:extracted' events before they are emitted

      // Group 3: Event-driven systems (can initialize in parallel after dependencies)
      // NOTE: ColorProcessor is now initialized by SystemIntegrationCoordinator BEFORE this group
      const eventDrivenSystems: InfrastructureSystemKey[] = [
        "MusicSyncService",
        "ColorHarmonyEngine", // 🎵 Now includes GenreProfileManager integration
        "MusicEmotionAnalyzer", // 🎭 Emotional intelligence for music analysis
      ];

      // Group 4: UI systems that depend on CSS variable management
      const uiSystems: InfrastructureSystemKey[] = [
        "GlassmorphismManager", // 🌊 Essential glassmorphism effects
        "Card3DManager", // 🎴 Essential 3D card transformations
      ];

      // Parallel initialization Group 1: Foundation systems
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🌌 [Year3000System] Initializing foundation systems in parallel..."
        );
      }
      const foundationPromises = foundationSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = await this.facadeCoordinator.getNonVisualSystem(
            systemKey as any
          );
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(
            `🌌 [Year3000System] ✗ Failed to initialize ${systemKey}:`,
            error
          );
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(foundationPromises);

      // Parallel initialization Group 2: Dependent systems
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🌌 [Year3000System] Initializing dependent systems in parallel..."
        );
      }
      const dependentPromises = dependentSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = await this.facadeCoordinator.getNonVisualSystem(
            systemKey as any
          );
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(
            `🌌 [Year3000System] ✗ Failed to initialize ${systemKey}:`,
            error
          );
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(dependentPromises);

      // Parallel initialization Group 3: Event-driven systems
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🌌 [Year3000System] Initializing event-driven systems in parallel..."
        );
      }
      const eventDrivenPromises = eventDrivenSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = await this.facadeCoordinator.getNonVisualSystem(
            systemKey as any
          );
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(
            `🌌 [Year3000System] ✗ Failed to initialize ${systemKey}:`,
            error
          );
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(eventDrivenPromises);

      // 🔧 PHASE 7.4: Setup music analysis event listeners after MusicSyncService initialization
      // This enables automatic color extraction on track changes
      if (this.musicSyncService) {
        this.setupMusicAnalysisAndColorExtraction();
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🎵 [Year3000System] Music analysis and color extraction event listeners registered"
          );
        }
      } else {
        console.warn(
          "⚠️ [Year3000System] MusicSyncService not available - automatic color extraction disabled"
        );
      }

      // Parallel initialization Group 4: UI systems
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🌌 [Year3000System] Initializing UI systems in parallel..."
        );
      }
      const uiPromises = uiSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = await this.facadeCoordinator.getNonVisualSystem(
            systemKey as any
          );
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(
            `🌌 [Year3000System] ✗ Failed to initialize ${systemKey}:`,
            error
          );
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(uiPromises);

      // 🔧 NOTE: ColorProcessor initialization MOVED to _initializeFacadeSystems()
      // It's now initialized BEFORE MusicSyncService (Group 2.5) to ensure event subscription happens first
      // This prevents the race condition where MusicSyncService emits colors:extracted before ColorProcessor subscribes

      // Start performance monitoring if available
      if (this.performanceAnalyzer) {
        this.performanceAnalyzer.startMonitoring();
        this.performanceGuardActive = true;
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log("🌌 [Year3000System] Performance monitoring started");
        }
      }

      // Parallel initialization of visual systems (performance optimization)
      const essentialVisualSystems: VisualSystemKey[] = [
        "Particle",
        "WebGLBackground",
        "SpotifyUIApplication",
        "MusicBeatSync",
        "HeaderVisualEffects",
        "UIVisualEffects",
        "InteractionTracking",
      ];

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🌌 [Year3000System] Initializing visual systems in parallel..."
        );
      }

      const visualPromises = essentialVisualSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = this.facadeCoordinator.getVisualSystem(
            systemKey as any
          );
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(
                `🌌 [Year3000System] ✓ Visual ${systemKey} initialized`
              );
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(
            `🌌 [Year3000System] ✗ Failed to initialize visual ${systemKey}:`,
            error
          );
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(visualPromises);

      // Link dependencies after initialization
      await this._linkSystemDependencies();

      // Perform facade integration validation (Phase 4 enhancement)
      await this._validateFacadeIntegration();

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🌌 [Year3000System] Facade system initialization complete"
        );
      }
    } catch (error) {
      console.error(
        "🌌 [Year3000System] Facade system initialization failed:",
        error
      );
      throw error;
    }
  }

  /**
   * Phase 4: Facade Integration Validation
   * Validates that all facade integration fixes are working correctly
   */
  private async _validateFacadeIntegration(): Promise<void> {
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🔍 [Year3000System] Performing facade integration validation..."
      );
    }

    const validationResults: {
      cssControllerAlias: boolean;
      strategyPatternSystems: boolean;
      parallelInitialization: boolean;
      facadeHealthCheck: boolean;
      errors: string[];
    } = {
      cssControllerAlias: false,
      strategyPatternSystems: false,
      parallelInitialization: false,
      facadeHealthCheck: false,
      errors: [],
    };

    try {
      // Test 1: Validate CSS Controller Registration
      if (this.facadeCoordinator) {
        try {
          const cssController = await this.facadeCoordinator.getNonVisualSystem(
            "CSSVariableWriter" as any
          );

          if (cssController) {
            validationResults.cssControllerAlias = true;
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log("✓ [Validation] CSS Controller registration working");
            }
          } else {
            validationResults.errors.push("CSS Controller registration failed");
          }
        } catch (error) {
          validationResults.errors.push(
            `CSS Controller validation error: ${error}`
          );
        }

        // Test 2: Validate Strategy Pattern Systems (Phase 2 fix)
        const strategyPatternSystems = [
          "ColorHarmonyEngine",
          "MusicEmotionAnalyzer",
        ];
        let strategySystemsFound = 0;

        for (const systemKey of strategyPatternSystems) {
          try {
            const system = await this.facadeCoordinator.getNonVisualSystem(
              systemKey as any
            );
            if (system) {
              strategySystemsFound++;
            }
          } catch (error) {
            validationResults.errors.push(
              `Strategy system ${systemKey} not found: ${error}`
            );
          }
        }

        validationResults.strategyPatternSystems =
          strategySystemsFound === strategyPatternSystems.length;
        if (
          validationResults.strategyPatternSystems &&
          this.ADVANCED_SYSTEM_CONFIG.enableDebug
        ) {
          console.log(
            "✓ [Validation] Strategy pattern systems registration working"
          );
        }

        // Test 3: Validate Parallel Initialization Performance (Phase 3 fix)
        const initStartTime = performance.now();
        try {
          // Test that we can initialize a small system quickly (should be <100ms for simple systems)
          const testSystem = await this.facadeCoordinator.getNonVisualSystem(
            "PerformanceAnalyzer" as any
          );
          const initEndTime = performance.now();
          const initTime = initEndTime - initStartTime;

          validationResults.parallelInitialization = initTime < 100; // Should be fast due to parallel optimization
          if (
            validationResults.parallelInitialization &&
            this.ADVANCED_SYSTEM_CONFIG.enableDebug
          ) {
            console.log(
              `✓ [Validation] Parallel initialization optimization working (${initTime.toFixed(
                2
              )}ms)`
            );
          } else if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.warn(
              `⚠ [Validation] Initialization may be slow (${initTime.toFixed(
                2
              )}ms)`
            );
          }
        } catch (error) {
          validationResults.errors.push(
            `Parallel initialization test failed: ${error}`
          );
        }

        // Test 4: Validate Facade Health Check (Phase 4 validation)
        try {
          const healthCheck = await this.facadeCoordinator.performHealthCheck();
          validationResults.facadeHealthCheck =
            healthCheck.overall === "excellent" ||
            healthCheck.overall === "good";

          if (
            validationResults.facadeHealthCheck &&
            this.ADVANCED_SYSTEM_CONFIG.enableDebug
          ) {
            console.log(
              `✓ [Validation] Facade health check passed (${healthCheck.overall})`
            );
          } else {
            validationResults.errors.push(
              `Facade health check failed: ${healthCheck.overall}`
            );
            if (healthCheck.recommendations?.length > 0) {
              console.warn(
                "🔧 [Validation] Health recommendations:",
                healthCheck.recommendations
              );
            }
          }
        } catch (error) {
          validationResults.errors.push(`Facade health check error: ${error}`);
        }
      } else {
        validationResults.errors.push(
          "Facade coordinator not available for validation"
        );
      }

      // Report validation results
      const totalTests = 4;
      const passedTests = [
        validationResults.cssControllerAlias,
        validationResults.strategyPatternSystems,
        validationResults.parallelInitialization,
        validationResults.facadeHealthCheck,
      ].filter(Boolean).length;

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          `🔍 [Year3000System] Facade validation complete: ${passedTests}/${totalTests} tests passed`
        );

        if (validationResults.errors.length > 0) {
          console.warn(
            "⚠ [Year3000System] Validation errors:",
            validationResults.errors
          );
        }

        if (passedTests === totalTests) {
          console.log(
            "🎉 [Year3000System] All facade integration fixes validated successfully!"
          );
        }
      }

      // Store validation results for debugging
      (window as any).Y3K_FACADE_VALIDATION = validationResults;
    } catch (error) {
      console.error("🔍 [Year3000System] Facade validation failed:", error);
      validationResults.errors.push(`Validation process error: ${error}`);
    }
  }

  /**
   * Link system dependencies after facade initialization
   * Phase 4: Connect systems that need cross-references
   */
  private async _linkSystemDependencies(): Promise<void> {
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log("🌌 [Year3000System] Linking system dependencies...");
    }

    try {
      // Link ColorHarmonyEngine to MusicSyncService
      if (this.musicSyncService && this.colorHarmonyEngine) {
        this.musicSyncService.setColorHarmonyEngine(this.colorHarmonyEngine);
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌌 [Year3000System] ColorHarmonyEngine linked to MusicSyncService"
          );
        }
      }

      // Link ColorHarmonyEngine to AnimationFrameCoordinator (adaptive functionality)
      if (this.colorHarmonyEngine && this.enhancedMasterAnimationCoordinator) {
        // Note: ColorHarmonyEngine expects EmergentChoreographyEngine interface
        // but now gets AnimationFrameCoordinator with adaptive functionality
        this.colorHarmonyEngine.setEmergentEngine(
          this.enhancedMasterAnimationCoordinator as any
        );
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌌 [Year3000System] AnimationFrameCoordinator (with adaptive functionality) linked to ColorHarmonyEngine"
          );
        }
      }

      // Register systems with health monitor if available
      if (this.systemHealthMonitor) {
        const systemsToRegister = [
          { name: "MusicSyncService", system: this.musicSyncService },
          { name: "ColorHarmonyEngine", system: this.colorHarmonyEngine },
        ];

        for (const { name, system } of systemsToRegister) {
          if (system) {
            this.systemHealthMonitor.registerSystem(name, system);
          }
        }

        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌌 [Year3000System] Systems registered with health monitor"
          );
        }
      }
    } catch (error) {
      console.error(
        "🌌 [Year3000System] Failed to link system dependencies:",
        error
      );
    }
  }

  /**
   * Legacy function - removed prediction systems entirely for performance optimization
   */
  private _shouldSkipPredictionSystem(systemName: string): boolean {
    // All prediction systems have been removed for performance optimization
    return false;
  }

  private async _initializeVisualSystems(
    results: InitializationResults
  ): Promise<void> {
    if (!this.performanceAnalyzer || !this.musicSyncService) {
      console.error(
        "[Year3000System] Cannot initialize visual systems due to missing core dependencies (SimplePerformanceCoordinator, MusicSyncService)."
      );
      const visualSystems = [
        "InteractionTrackingSystem",
        "BeatSyncVisualSystem",
        "SidebarSystemsIntegration",
        // "EmergentChoreographyEngine", // Consolidated into AnimationFrameCoordinator
      ];
      visualSystems.forEach((s) => results.skipped.push(s));
      return;
    }

    // Phase 4: Visual system configs commented out for facade migration
    /* const visualSystemConfigs: VisualSystemConfig[] = [
      {
        name: "InteractionTrackingSystem",
        Class: InteractionTrackingSystem,
        property: "interactionTrackingSystem",
      },
      {
        name: "BeatSyncVisualSystem",
        Class: BeatSyncVisualSystem,
        property: "beatSyncVisualSystem",
      },
      // EmergentChoreographyEngine consolidated into AnimationFrameCoordinator
      {
        name: "WebGLGradientBackgroundSystem",
        Class: WebGLGradientBackgroundSystem,
        property: "webGLGradientBackgroundSystem",
      },
      {
        name: "ParticleFieldSystem",
        Class: ParticleFieldSystem,
        property: "particleFieldSystem",
      },
      {
        name: "SpotifyUIApplicationSystem",
        Class: SpotifyUIApplicationSystem,
        property: "spotifyUIApplicationSystem",
      },
      // ContextMenuSystem removed
    ]; */

    // Phase 4: Visual systems now managed by facade - no direct initialization needed

    /* for (const config of visualSystemConfigs) {
      const { name, Class, property } = config;

      // Skip prediction systems on low-end devices for better performance
      if (this._shouldSkipPredictionSystem(name)) {
        results.skipped.push(name);
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.info(
            `[Year3000System] Skipping ${name} on low-end device for performance optimization`
          );
        }
        continue;
      }

      try {
        // Special case for SpotifyUIApplicationSystem - it has a different constructor signature
        let instance;
        if (name === "SpotifyUIApplicationSystem") {
          instance = new Class(this);
        } else {
          instance = new Class(
            this.ADVANCED_SYSTEM_CONFIG,
            this.utils,
            this.performanceAnalyzer,
            this.musicSyncService,
            this.settingsManager,
            this
          );
        }
        await instance.initialize();

        if (instance.initialized) {
          this[property] = instance;
          if (this.systemHealthMonitor) {
            this.systemHealthMonitor.registerSystem(name, instance);
          }
          results.success.push(name);
        } else {
          // Treat gracefully as skipped if the system self-disabled (e.g., env unsupported)
          results.skipped.push(name);
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.info(
              `[Year3000System] System ${name} opted out of activation (initialized=false). Marked as skipped.`
            );
          }
        }
      } catch (error) {
        results.failed.push(name);
        console.error(
          `[Year3000System] Failed to initialize visual system ${name}:`,
          error
        );
      }
    } */

    // Phase 4: Sidebar Systems Integration managed by facade
    /* try {
      this.sidebarSystemsIntegration = new SidebarSystemsIntegration(
        this.ADVANCED_SYSTEM_CONFIG
      );
      await this.sidebarSystemsIntegration._baseInitialize();

      // Register with enhanced animation coordinator if available
      if (this.enhancedMasterAnimationCoordinator) {
        // Note: SidebarSystemsIntegration will be registered via _registerEnhancedAnimationSystems
      }

      if (this.systemHealthMonitor) {
        this.systemHealthMonitor.registerSystem(
          "SidebarSystemsIntegration",
          this.sidebarSystemsIntegration
        );
      }

      results.success.push("SidebarSystemsIntegration");

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🔧 [Year3000System] Sidebar systems integration initialized with bilateral visual effects coordination"
        );
      }
    } catch (error) {
      results.failed.push("SidebarSystemsIntegration");
      console.error(
        "[Year3000System] Failed to initialize sidebar systems integration:",
        error
      );
    } */

    // After all visual systems are initialized, link the engines
    // Note: EmergentChoreography now integrated into AnimationFrameCoordinator
    if (this.colorHarmonyEngine && this.enhancedMasterAnimationCoordinator) {
      this.colorHarmonyEngine.setEmergentEngine(
        this.enhancedMasterAnimationCoordinator as any
      );
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🔗 [Year3000System] AnimationFrameCoordinator (adaptive functionality) linked to ColorHarmonyEngine."
        );
      }
    }
  }

  public async destroyAllSystems(): Promise<void> {
    // Phase 4: Destroy systems via facade coordinator
    if (this.facadeCoordinator) {
      await this.facadeCoordinator.destroy();
      this.facadeCoordinator = null;
    }

    // Reset private initialization results
    this._initializationResults = null;

    // Phase 4: All system cleanup is now handled by the facade coordinator
    // Individual system destruction is managed via the facades
    if (Spicetify?.Player && this._songChangeHandler) {
      Spicetify.Player.removeEventListener?.(
        "songchange",
        this._songChangeHandler
      );
    }

    this.initialized = false;
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log("🔥 [Year3000System] All systems have been destroyed.");
    }

    // Remove the listener before proceeding to original destroyAllSystems logic
    document.removeEventListener(
      "year3000SystemSettingsChanged",
      this._boundExternalSettingsHandler
    );

    // Clean up Artistic Mode change listener
    document.removeEventListener(
      "year3000ArtisticModeChanged",
      this._boundArtisticModeHandler
    );

    // NEW: Clean up visibilitychange listener
    document.removeEventListener(
      "visibilitychange",
      this._boundVisibilityChangeHandler
    );

    // Clean up TypedSettingsManager onChange listener
    if (this._boundTypedSettingsHandler) {
      settings.offChange(this._boundTypedSettingsHandler);
      this._boundTypedSettingsHandler = null;
    }

    // Dispose NowPlaying watcher
    if (this._disposeNowPlayingWatcher) {
      this._disposeNowPlayingWatcher();
      this._disposeNowPlayingWatcher = null;
    }
  }

  public async applyInitialSettings(
    trigger?: "flavor" | "brightness" | "accent" | "full"
  ): Promise<void> {
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        `🎨 [Year3000System] Inside applyInitialSettings. Trigger: ${
          trigger || "full"
        }`
      );
    }

    try {
      // Handle selective updates for color-related changes
      if (
        trigger === "flavor" ||
        trigger === "brightness" ||
        trigger === "accent"
      ) {
        console.log(
          `🎨 [Year3000System] Selective update for trigger: ${trigger}`
        );
        await this.updateColorStateOnly(trigger);
        await this.refreshColorDependentSystems(trigger);
        return;
      }

      // Full settings application (original behavior)
      console.log(
        "🎨 [Year3000System] applyInitialSettings: Getting initial settings..."
      );

      // Initialize CSSColorController if available
      if (this.cssColorController && !this.cssColorController.initialized) {
        console.log("🎨 [Year3000System] Initializing CSSColorController...");
        await this.cssColorController.initialize();
      }

      // Apply color state first (replaces old _applyCatppuccinAccent logic)
      if (this.cssColorController?.initialized) {
        console.log(
          "🎨 [Year3000System] Applying initial color state via CSSColorController..."
        );
        await this.cssColorController.applyInitialColorState();
      } else {
        console.warn(
          "🎨 [Year3000System] CSSColorController not available, using legacy color application"
        );
        // Fallback to legacy accent application
        const accent = settings.get("catppuccin-accentColor");
        if ((accent as string) !== "dynamic") {
          await this._applyCatppuccinAccent(accent);
        }
      }

      const gradient = settings.get("sn-gradient-intensity");
      // Use gradient intensity for both params since star density is consolidated
      const stars = gradient;

      // NEW – harmonic settings (TypedSettingsManager provides proper types)
      const intensity = settings.get("sn-harmonic-intensity");
      const evolutionEnabled = settings.get("sn-harmonic-evolution");

      // NEW – harmonic mode selection
      const harmonicModeKey = settings.get("sn-current-harmonic-mode");
      if (harmonicModeKey) {
        this.ADVANCED_SYSTEM_CONFIG.currentColorHarmonyMode =
          String(harmonicModeKey);
      }

      console.log(
        `🎨 [Year3000System] applyInitialSettings: Gradient=${gradient}, Stars=${stars}, ColorState=${!!this
          .cssColorController?.initialized}`
      );

      await this._applyStarryNightSettings(
        gradient as "disabled" | "minimal" | "balanced" | "intense",
        stars as "disabled" | "minimal" | "balanced" | "intense"
      );

      // Apply harmonic intensity once the engine is ready
      if (!Number.isNaN(intensity)) {
        if (this.colorHarmonyEngine) {
          (this.colorHarmonyEngine as any).setIntensity?.(intensity);
        }
        this.ADVANCED_SYSTEM_CONFIG.colorHarmonyIntensity = intensity;
      }

      // Persist evolution flag locally
      this.allowHarmonicEvolution = evolutionEnabled;
      this.ADVANCED_SYSTEM_CONFIG.colorHarmonyEvolution = evolutionEnabled;

      console.log(
        "🎨 [Year3000System] applyInitialSettings: Successfully applied initial settings."
      );
    } catch (error) {
      console.error("[Year3000System] Error applying initial settings:", error);
    }
  }

  /**
   * Update only color state without full settings reload
   */
  private async updateColorStateOnly(
    trigger: "flavor" | "brightness" | "accent"
  ): Promise<void> {
    if (!this.cssColorController?.initialized) {
      console.warn(
        `🎨 [Year3000System] CSSColorController not available for ${trigger} update`
      );
      return;
    }

    console.log(
      `🎨 [Year3000System] Updating color state for trigger: ${trigger}`
    );
    await this.cssColorController.updateColorState(trigger);
  }

  /**
   * Refresh only color-dependent systems efficiently
   */
  private async refreshColorDependentSystems(trigger: string): Promise<void> {
    if (!this.facadeCoordinator) {
      console.warn(
        `🎨 [Year3000System] No facade coordinator available for ${trigger} refresh`
      );
      return;
    }

    console.log(
      `🎨 [Year3000System] Refreshing color-dependent systems for trigger: ${trigger}`
    );
    await this.facadeCoordinator.refreshColorDependentSystems(trigger);
  }

  private async _applyCatppuccinAccent(selectedAccent: string): Promise<void> {
    if (selectedAccent === "dynamic") {
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🎨 [Year3000System] _applyCatppuccinAccent: 'dynamic' accent selected – skipping static accent overrides."
        );
      }
      return;
    }

    console.log(
      `🎨 [Year3000System] _applyCatppuccinAccent: Applying accent color '${selectedAccent}'`
    );
    const accent = selectedAccent === "none" ? "text" : selectedAccent;
    const colorScheme = Spicetify?.Config?.color_scheme || "mocha";
    const equalizerUrl = document.querySelector(
      "body > script.marketplaceScript"
    )
      ? `url('https://github.com/catppuccin/spicetify/blob/main/catppuccin/assets/${colorScheme}/equalizer-animated-${accent}.gif?raw=true')`
      : `url('${colorScheme}/equalizer-animated-${accent}.gif')`;

    this.cssVariableController?.queueCSSVariableUpdate(
      "--spice-text",
      `var(--spice-${accent})`
    );
    this.cssVariableController?.queueCSSVariableUpdate(
      "--spice-button-active",
      `var(--spice-${accent})`
    );
    this.cssVariableController?.queueCSSVariableUpdate(
      "--spice-equalizer",
      equalizerUrl
    );
    this.cssVariableController?.flushCSSVariableBatch();
    console.log(
      `🎨 [Year3000System] _applyCatppuccinAccent: Flushed CSS variables for accent color.`
    );
  }

  private async _applyStarryNightSettings(
    gradientIntensity: "disabled" | "minimal" | "balanced" | "intense",
    starDensity: "disabled" | "minimal" | "balanced" | "intense"
  ): Promise<void> {
    try {
      applyStarryNightSettings(gradientIntensity, starDensity);
    } catch (error) {
      console.error("[Year3000System] Failed to apply starry night settings");
    }
  }

  public applyColorsToTheme(extractedColors: any = {}): void {
    // DEPRECATED: This method now handles legacy direct calls only
    // New event-driven flow: colors/extracted → ColorOrchestrator → colors/harmonized → handleColorHarmonizedEvent
    let harmonizedColors = extractedColors;

    if (this.colorHarmonyEngine) {
      try {
        harmonizedColors =
          this.colorHarmonyEngine.blendWithCatppuccin(extractedColors);
      } catch (error) {
        console.error(
          "[Year3000System] ColorHarmonyEngine blend failed:",
          error
        );
      }
    }

    // Extract accent colors from harmonized colors for facade system
    const accentHex =
      harmonizedColors.accentHex ||
      harmonizedColors.VIBRANT ||
      harmonizedColors.PROMINENT ||
      Object.values(harmonizedColors)[0] ||
      "#37416b"; // Catppuccin fallback

    const accentRgb =
      harmonizedColors.accentRgb ||
      (() => {
        const rgb = this.utils.hexToRgb(accentHex as string);
        return rgb ? `${rgb.r},${rgb.g},${rgb.b}` : "166,173,200";
      })();

    this._applyColorsViaFacadeSystem(
      harmonizedColors,
      accentHex as string,
      accentRgb as string
    );
  }

  /**
   * @deprecated Phase 3: Color event handling now delegated to ColorEventCoordinator
   * This method is kept for backward compatibility but no longer used.
   * See ColorEventCoordinator for actual implementation.
   */
  private handleColorHarmonizedEvent(data: any): void {
    // DEPRECATED: This method is no longer called
    // Color events are now handled by ColorEventCoordinator
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.warn(
        "⚠️ [ThemeLifecycleCoordinator] handleColorHarmonizedEvent called directly - this is deprecated"
      );
    }
    return;
  }

  /**
   * @deprecated Phase 3: Replaced by ColorEventCoordinator - kept for reference only
   */
  private _handleColorHarmonizedEvent_DEPRECATED(data: any): void {
    // LEGACY CODE - Moved to ColorEventCoordinator
    // Keeping this commented out for reference during migration
    /* Phase 1: Loop Prevention - Check if already processing
    if (this.colorEventState.isProcessingColorEvent) {
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.warn(
          "🔄 [Year3000System] Already processing color event - skipping to prevent recursion"
        );
      }
      return;
    }

    // Phase 1: Generate event context hash for caching
    const eventContext = JSON.stringify(data).substring(0, 100);
    const eventHash = this._generateEventHash(eventContext);
    const now = Date.now();

    // Phase 1: Check event cache to prevent duplicate processing
    if (this.colorEventState.processedEvents.has(eventHash)) {
      const lastProcessed =
        this.colorEventState.processedEvents.get(eventHash)!;
      if (now - lastProcessed < this.COLOR_EVENT_CACHE_TTL) {
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.warn(
            "🔄 [Year3000System] Event recently processed - skipping duplicate"
          );
        }
        return;
      }
    }

    // Phase 1: Set processing state and cache event
    this.colorEventState.isProcessingColorEvent = true;
    this.colorEventState.processedEvents.set(eventHash, now);

    // Phase 1: Set safety timeout
    this.colorEventState.eventTimeout = window.setTimeout(() => {
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.warn(
          "🔄 [Year3000System] Color event processing timeout - resetting state"
        );
      }
      this._resetColorEventState();
    }, this.PROCESSING_TIMEOUT);

    try {
      // Phase 1: Add to processing chain for loop detection
      this.processingState.processingChain.push("handleColorHarmonizedEvent");

      // Phase 1: Check for processing chain overflow
      if (this.processingState.processingChain.length > this.MAX_CHAIN_LENGTH) {
        this.processingState.eventLoopDetected = true;
        console.error(
          "🔄 [Year3000System] CRITICAL: Event loop detected - chain length exceeded",
          this.processingState.processingChain
        );
        this._resetProcessingState();
        return;
      }

      // 🔧 CRITICAL FIX: Support both event format variations
      let processedColors: Record<string, string>;
      let accentHex: string;
      let accentRgb: string;
      let strategies: string[];
      let processingTime: number;

      // Handle new UnifiedEventBus format from ColorHarmonyEngine
      if (data.processedColors && data.accentHex && data.accentRgb) {
        processedColors = data.processedColors;
        accentHex = data.accentHex;
        accentRgb = data.accentRgb;
        strategies = data.strategies || ["ColorHarmonyEngine"];
        processingTime = data.processingTime || 0;
      }
      // Handle legacy ColorOrchestrator event format
      else if (data.payload && data.payload.processedColors) {
        processedColors = data.payload.processedColors;
        accentHex =
          data.payload.accentHex ||
          Object.values(processedColors)[0] ||
          "#a6adc8";
        accentRgb =
          this.utils.hexToRgb(accentHex)?.r +
            "," +
            this.utils.hexToRgb(accentHex)?.g +
            "," +
            this.utils.hexToRgb(accentHex)?.b || "166,173,200";
        strategies = [data.payload.metadata?.strategy || "Unknown"];
        processingTime = data.payload.metadata?.processingTime || 0;
      }
      // Handle direct data format
      else if (data.type === "colors/harmonized") {
        return; // Legacy format, skip processing
      } else {
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.warn(
            "🎨 [Year3000System] Unrecognized colors:harmonized event format:",
            data
          );
        }
        return;
      }

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🎨 [Year3000System] Processing colors:harmonized event:", {
          strategies: strategies,
          processingTime: processingTime,
          colorsCount: Object.keys(processedColors).length,
          accentHex: accentHex,
          accentRgb: accentRgb,
          chainLength: this.processingState.processingChain.length,
        });
      }

      // 🔧 CRITICAL FIX: Apply colors via unified CSS variable system (OKLAB-enabled)
      this._applyColorsViaFacadeSystem(processedColors, accentHex, accentRgb);
    } catch (error) {
      console.error(
        "[Year3000System] Failed to handle colors:harmonized event:",
        error
      );
    } finally {
      // Phase 1: Always clean up processing state
      this._resetColorEventState();

      // Phase 1: Remove from processing chain
      const chainIndex = this.processingState.processingChain.indexOf(
        "handleColorHarmonizedEvent"
      );
      if (chainIndex > -1) {
        this.processingState.processingChain.splice(chainIndex, 1);
      }
    }
    */
    // End of deprecated legacy code
  }

  /**
   * @deprecated Phase 3: Moved to ColorEventCoordinator.generateEventHash()
   */
  private _generateEventHash(context: string): string {
    // DEPRECATED: Hash generation now handled by ColorEventCoordinator
    return "";
  }

  /**
   * @deprecated Phase 3: Moved to ColorEventCoordinator.resetColorEventState()
   */
  private _resetColorEventState(): void {
    // DEPRECATED: State management now handled by ColorEventCoordinator
  }

  /**
   * @deprecated Phase 3: Moved to ColorEventCoordinator.resetProcessingState()
   */
  private _resetProcessingState(): void {
    // DEPRECATED: State management now handled by ColorEventCoordinator
  }

  /**
   * Apply colors via delegation to CSS authority systems
   * Delegates Spicetify variables to CSSColorController and DynamicCatppuccinBridge
   */
  private _applyColorsViaFacadeSystem(
    processedColors: Record<string, string>,
    accentHex: string,
    accentRgb: string
  ): void {
    try {
      // Delegate Spicetify variables to CSS authority systems
      // CSSColorController handles: --spice-accent, --spice-base, --spice-rgb-accent etc.
      // DynamicCatppuccinBridge handles: dynamic accent updates during playback

      // Only handle specialized variables not covered by CSS authority systems
      const cssVariables: Record<string, string> = {};

      // Add processed colors to CSS variables (filter for valid hex colors only)
      Object.entries(processedColors).forEach(([key, value]) => {
        // Only process values that are valid hex colors
        if (this.utils.isValidHexColor(value)) {
          const rgb = this.utils.hexToRgb(value);
          if (rgb) {
            cssVariables[`--sn-processed-${key.toLowerCase()}-hex`] = value;
            cssVariables[
              `--sn-processed-${key.toLowerCase()}-rgb`
            ] = `${rgb.r},${rgb.g},${rgb.b}`;
          }
        } else if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          // Log skipped non-hex values for debugging (only in debug mode)
          console.debug(
            `[Year3000System] Skipping non-hex processedColor: ${key}=${value}`
          );
        }
      });

      // 🎵 MUSICAL HARMONY VARIABLE PUBLISHING: Specialized variables for OKLAB → Musical Harmony → Gradient chain
      // Note: Spicetify variables (--spice-*) are handled by CSSColorController and DynamicCatppuccinBridge
      const musicalHarmonyMapping: Record<string, string> = {
        // Musical harmony RGB variables for OKLAB color science integration
        "--sn-musical-harmony-primary-rgb": (processedColors.VIBRANT ||
          processedColors.PRIMARY ||
          accentRgb) as string,
        "--sn-musical-harmony-secondary-rgb": (processedColors.DARK_VIBRANT ||
          processedColors.SECONDARY ||
          accentRgb) as string,
        "--sn-musical-harmony-tertiary-rgb":
          (processedColors.VIBRANT_NON_ALARMING ||
            processedColors.LIGHT_VIBRANT ||
            accentRgb) as string,
        "--sn-musical-harmony-quaternary-rgb": (processedColors.DESATURATED ||
          processedColors.EMOTIONAL_BLEND ||
          accentRgb) as string,

        // Musical harmony hex variables for gradient systems
        "--sn-musical-harmony-primary-hex": (processedColors.VIBRANT ||
          processedColors.PRIMARY ||
          accentHex) as string,
        "--sn-musical-harmony-secondary-hex": (processedColors.DARK_VIBRANT ||
          processedColors.SECONDARY ||
          accentHex) as string,
        "--sn-musical-harmony-tertiary-hex":
          (processedColors.VIBRANT_NON_ALARMING ||
            processedColors.LIGHT_VIBRANT ||
            accentHex) as string,
        "--sn-musical-harmony-quaternary-hex": (processedColors.DESATURATED ||
          processedColors.EMOTIONAL_BLEND ||
          accentHex) as string,

        // OKLAB processing results for color science systems
        "--sn-musical-oklab-primary-rgb": (processedColors.VIBRANT ||
          processedColors.PRIMARY ||
          processedColors.PROMINENT ||
          accentRgb) as string,
        "--sn-musical-oklab-accent-rgb": (processedColors.DARK_VIBRANT ||
          processedColors.DESATURATED ||
          accentRgb) as string,
        "--sn-musical-oklab-highlight-rgb":
          (processedColors.VIBRANT_NON_ALARMING ||
            processedColors.LIGHT_VIBRANT ||
            accentRgb) as string,
        "--sn-musical-oklab-shadow-rgb": (processedColors.DARK_VIBRANT ||
          processedColors.DESATURATED ||
          accentRgb) as string,
        "--sn-musical-oklab-complementary-rgb": (processedColors.SECONDARY ||
          processedColors.EMOTIONAL_BLEND ||
          accentRgb) as string,
        "--sn-musical-oklab-triadic-rgb": (processedColors.LIGHT_VIBRANT ||
          processedColors.VIBRANT_NON_ALARMING ||
          accentRgb) as string,
      };

      // Process Musical Harmony variables for OKLAB color science integration
      Object.entries(musicalHarmonyMapping).forEach(([cssVar, colorValue]) => {
        if (!colorValue || typeof colorValue !== "string") return;

        if (cssVar.includes("-hex")) {
          // Direct hex assignment for hex variables
          cssVariables[cssVar] = colorValue;
        } else if (cssVar.includes("-rgb")) {
          // Convert to RGB format for RGB variables
          if (this.utils.isValidHexColor(colorValue)) {
            const rgb = this.utils.hexToRgb(colorValue);
            if (rgb) {
              cssVariables[cssVar] = `${rgb.r},${rgb.g},${rgb.b}`;
            }
          } else if ((colorValue as string).includes(",")) {
            // Already in RGB format
            cssVariables[cssVar] = colorValue;
          }
        }
      });

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🎨 [Year3000System] Musical Harmony Color Processing:", {
          // ColorHarmonyEngine output
          colorHarmonyKeys: Object.keys(processedColors),
          colorHarmonyValues: processedColors,

          // Musical harmony bridge variables (specialized for OKLAB)
          musicalHarmonyVariables: musicalHarmonyMapping,

          // CSS variable chain status
          expectedCSSChain: [
            "--sn-musical-oklab-primary-rgb",
            "--sn-musical-harmony-primary-rgb",
            "--sn-gradient-primary-rgb",
          ],

          // Note: Spicetify variables handled by CSS authority systems
          totalVariablesSet: Object.keys(cssVariables).length,
          cssAuthorityDelegation:
            "CSSColorController + DynamicCatppuccinBridge",
        });
      }

      // Apply via CSS variable controller if available
      if (
        this.cssVariableController &&
        typeof this.cssVariableController.batchSetVariables === "function"
      ) {
        this.cssVariableController.batchSetVariables(
          "Year3000System-ColorHarmonized",
          cssVariables,
          "high",
          "color-harmony-event-application"
        );
      } else {
        // Fallback to direct application
        this._applyCSSVariables(cssVariables);
      }

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🔧 [Year3000System] Applied musical harmony variables via CSS coordination:",
          {
            totalVariables: Object.keys(cssVariables).length,
            accentColor: accentHex,
            cssControllerUsed: !!this.cssVariableController,
            spicetifyDelegation:
              "CSSColorController + DynamicCatppuccinBridge handle --spice-* variables",
          }
        );
      }
    } catch (error) {
      console.error(
        "[Year3000System] Failed to apply musical harmony variables:",
        error
      );

      // Minimal fallback - only essential musical harmony variables
      // Note: Spicetify variables handled by CSSColorController/DynamicCatppuccinBridge
      const fallbackVariables = {
        "--sn-musical-harmony-primary-hex": accentHex,
        "--sn-musical-harmony-primary-rgb": accentRgb,
      };
      this._applyCSSVariables(fallbackVariables);
    }
  }

  /**
   * Apply CSS variables directly (optimization for event-driven pattern)
   */
  private _applyCSSVariables(cssVariables: Record<string, string>): void {
    try {
      const root = document.documentElement;

      for (const [variable, value] of Object.entries(cssVariables)) {
        if (variable && value) {
          root.style.setProperty(variable, value);
        }
      }

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🎨 [Year3000System] Applied CSS variables directly", {
          variablesCount: Object.keys(cssVariables).length,
          variables: Object.keys(cssVariables),
        });
      }
    } catch (error) {
      console.error("[Year3000System] Failed to apply CSS variables:", error);
    }
  }

  // =============================================
  // 🎨 LEGACY METHOD REMOVED: _applyHarmonizedColorsToCss()
  // Replaced by comprehensive OKLAB-enabled _applyColorsViaFacadeSystem()
  // =============================================

  // =============================================
  // 🆕 PUBLIC WRAPPER – UNIFIED CSS VARIABLE BATCH API
  // =============================================
  /**
   * Queue a CSS variable update through the shared CSSVariableWriter. Falls
   * back to an immediate style mutation when the batcher is unavailable
   * (degraded mode or very early boot).
   *
   * @param property  The CSS custom property name (e.g. "--sn-nav-intensity")
   * @param value     The value to assign (raw string, keep units if needed)
   * @param element   Optional specific HTMLElement target. When omitted the
   *                  root <html> element is used so variables cascade.
   */
  public queueCSSVariableUpdate(
    property: string,
    value: string,
    element?: HTMLElement | null,
    priority: "low" | "normal" | "high" | "critical" = "normal",
    source = "theme-lifecycle"
  ): void {
    const cssWriter = this.facadeCoordinator?.getCachedNonVisualSystem(
      "CSSVariableWriter"
    ) as any;

    if (cssWriter && typeof cssWriter.queueCSSVariableUpdate === "function") {
      cssWriter.queueCSSVariableUpdate(
        property,
        value,
        element ?? null,
        priority,
        source
      );
      return;
    }

    if (this.cssColorController?.queueCSSVariableUpdate) {
      this.cssColorController.queueCSSVariableUpdate(property, value, priority);
      return;
    }

    const target =
      element ??
      (typeof document !== "undefined" ? document.documentElement : null);

    if (target) {
      target.style.setProperty(property, value);
    }
  }

  public setGradientParameters(): void {
    if (this.colorHarmonyEngine) {
      // This seems to be a UI concern, not a color engine concern.
      // Re-implement if this logic is truly needed here.
    }
  }

  public async updateColorsFromCurrentTrack(): Promise<void> {
    if (this.musicSyncService) {
      await this.musicSyncService.processSongUpdate();
    }
  }

  public evolveHarmonicSignature(
    selectedModeKey: string,
    baseSourceHex: string
  ): { derivedDarkVibrantHex: string; derivedLightVibrantHex: string } | null {
    if (this.colorHarmonyEngine) {
      const rgb = this.utils.hexToRgb(baseSourceHex);
      if (rgb) {
        const variations =
          this.colorHarmonyEngine.generateHarmonicVariations(rgb);
        return {
          derivedDarkVibrantHex: variations.darkVibrantHex,
          derivedLightVibrantHex: variations.lightVibrantHex,
        };
      }
    }
    return null;
  }

  public async waitForTrackData(maxRetries = 10, delayMs = 100): Promise<any> {
    for (let i = 0; i < maxRetries; i++) {
      if (Spicetify?.Player?.data?.track?.uri) {
        return Spicetify.Player.data;
      }
      await this.utils.sleep(delayMs);
    }
    return null;
  }

  public updateHarmonicBaseColor(hexColor: string): void {
    if (this.colorHarmonyEngine && this.cssVariableController) {
      const rgb = this.utils.hexToRgb(hexColor);
      if (rgb) {
        const variations =
          this.colorHarmonyEngine.generateHarmonicVariations(rgb);
        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-harmonic-base-dark-vibrant",
          variations.darkVibrantHex
        );
        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-harmonic-base-light-vibrant",
          variations.lightVibrantHex
        );
        this.cssVariableController.flushCSSVariableBatch();
      }
    }
  }

  /**
   * Process colors through the existing facade pattern architecture
   * Phase 1: Integration with SystemIntegrationCoordinator and ColorOrchestrator
   */
  public async processColorsViaFacade(context: any): Promise<void> {
    try {
      // Use existing facadeCoordinator to get ColorOrchestrator
      const colorOrchestrator =
        await this.facadeCoordinator?.getNonVisualSystem("ColorOrchestrator");

      if (
        colorOrchestrator &&
        typeof colorOrchestrator.handleColorExtraction === "function"
      ) {
        // Route through existing ColorOrchestrator strategy pattern
        await colorOrchestrator.handleColorExtraction(context);

        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🎨 [Year3000System] Color processing routed through facade pattern - ColorOrchestrator",
            {
              context: context?.trackUri || "unknown",
              rawColorsCount: context?.rawColors
                ? Object.keys(context.rawColors).length
                : 0,
            }
          );
        }
      } else {
        // Fallback to direct ColorHarmonyEngine if orchestrator not available
        if (
          this.colorHarmonyEngine &&
          typeof this.colorHarmonyEngine.processColors === "function"
        ) {
          await this.colorHarmonyEngine.processColors(context);

          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log(
              "🎨 [Year3000System] Color processing fallback to direct ColorHarmonyEngine"
            );
          }
        } else {
          console.warn(
            "[Year3000System] No color processing system available via facade pattern"
          );
        }
      }
    } catch (error) {
      console.error(
        "[Year3000System] Failed to process colors via facade pattern:",
        error
      );

      // Final fallback to legacy method
      if (context?.rawColors) {
        this.applyColorsToTheme(context.rawColors);
      }
    }
  }

  public setupMusicAnalysisAndColorExtraction(): void {
    console.log(
      "🎵 [Year3000System] setupMusicAnalysisAndColorExtraction called"
    );

    if (!this.musicSyncService) {
      console.error(
        "[Year3000System] MusicSyncService is not available to set up song change handler."
      );
      return;
    }

    console.log(
      "🎵 [Year3000System] MusicSyncService available, checking Spicetify Player..."
    );

    // Check if Spicetify.Player is available (might not be in degraded mode)
    if (!(window as any).Spicetify?.Player) {
      console.warn(
        "[Year3000System] Spicetify.Player not available - music analysis disabled"
      );
      return;
    }

    // Set up event-driven color harmonization via ColorEventCoordinator (Phase 3)
    this.colorEventCoordinator = new ColorEventCoordinator({
      maxChainLength: this.MAX_CHAIN_LENGTH,
      processingTimeout: this.PROCESSING_TIMEOUT,
      colorEventCacheTTL: this.COLOR_EVENT_CACHE_TTL,
      enableDebug: this.ADVANCED_SYSTEM_CONFIG.enableDebug,
      onApplyColors: (processedColors, accentHex, accentRgb) => {
        this._applyColorsViaFacadeSystem(processedColors, accentHex, accentRgb);
      },
    });

    this.colorEventCoordinator.startListening();

    const processSongUpdate = async () => {
      console.log(
        "🎵 [Year3000System] processSongUpdate triggered - checking MusicSyncService..."
      );
      if (this.musicSyncService) {
        console.log(
          "🎵 [Year3000System] Calling musicSyncService.processSongUpdate()"
        );
        await this.musicSyncService.processSongUpdate();
        console.log(
          "✅ [Year3000System] musicSyncService.processSongUpdate() completed"
        );
      } else {
        console.error(
          "❌ [Year3000System] MusicSyncService not available in processSongUpdate"
        );
      }
    };

    // Store the handler so it can be removed later
    this._songChangeHandler = processSongUpdate;

    try {
      console.log("🎵 [Year3000System] Adding songchange event listener...");
      (window as any).Spicetify.Player.addEventListener(
        "songchange",
        this._songChangeHandler
      );

      console.log(
        "✅ [Year3000System] Music analysis and color extraction set up successfully - song change listener active"
      );

      // Initial run for the currently playing track
      console.log("🎵 [Year3000System] Triggering initial song processing...");
      setTimeout(processSongUpdate, 1000);
    } catch (error) {
      console.error("[Year3000System] Failed to set up music analysis:", error);
      this._songChangeHandler = null;
    }
  }

  public updateFromMusicAnalysis(
    processedData: any,
    rawFeatures?: any,
    trackUri?: string | null
  ): void {
    if (!processedData) return;
    this._updateGlobalKinetics(processedData);
  }

  private _updateGlobalKinetics(data: any): void {
    const root = this.utils.getRootStyle();
    if (!root) return;

    // Phase P2 – Robustness guard: sanitize numeric inputs to avoid runtime errors
    const safe = (value: number | undefined, fallback = 0): number =>
      Number.isFinite(value) ? (value as number) : fallback;

    const processedEnergy = safe((data as any).processedEnergy);
    const valence = safe((data as any).valence);
    const enhancedBPM = safe((data as any).enhancedBPM);
    const beatInterval = safe((data as any).beatInterval);
    const animationSpeed = safe((data as any).animationSpeedFactor, 1);

    root.style.setProperty("--sn-kinetic-energy", processedEnergy.toFixed(3));
    root.style.setProperty("--sn-kinetic-valence", valence.toFixed(3));
    root.style.setProperty("--sn-kinetic-bpm", enhancedBPM.toFixed(2));
    root.style.setProperty(
      "--sn-kinetic-beat-interval",
      `${beatInterval.toFixed(0)}ms`
    );
    root.style.setProperty(
      "--sn-kinetic-animation-speed",
      animationSpeed.toFixed(3)
    );
  }

  // Animation System Registration Methods
  public registerAnimationSystem(
    name: string,
    system: any,
    priority: "background" | "normal" | "critical" = "normal",
    targetFPS: number = 60
  ): boolean {
    if (!this.enhancedMasterAnimationCoordinator) {
      console.warn(
        `[Year3000System] Cannot register ${name} - AnimationFrameCoordinator not ready`
      );
      return false;
    }

    this.enhancedMasterAnimationCoordinator.registerAnimationSystem(
      name,
      system,
      priority,
      targetFPS
    );
    return true;
  }

  public unregisterAnimationSystem(name: string): boolean {
    if (!this.enhancedMasterAnimationCoordinator) {
      return false;
    }

    this.enhancedMasterAnimationCoordinator.unregisterAnimationSystem(name);
    return true;
  }

  /**
   * Public accessor that returns a subsystem instance by its constructor name or
   * by the conventional camel-cased property key. This is primarily used for
   * loose coupling between visual systems (e.g. BehaviouralPredictionEngine ⇆
   * PredictiveMaterializationSystem). Returns `null` when the requested system
   * is not available or not yet initialised.
   */
  public getSystem<T = any>(name: string): T | null {
    if (!name) return null;

    // 1) Try facade systems first
    if (this.facadeCoordinator) {
      // Try visual systems
      const visualSystem = this.facadeCoordinator.getVisualSystem(name as any);
      if (visualSystem) return visualSystem as T;

      // Try non-visual systems
      const nonVisualSystem = this.facadeCoordinator.getCachedNonVisualSystem(
        name as any
      );
      if (nonVisualSystem) return nonVisualSystem as T;
    }

    // 2) Try camel-cased property convention (e.g. "PredictiveMaterializationSystem" → "predictiveMaterializationSystem")
    const camel = name.charAt(0).toLowerCase() + name.slice(1);
    if ((this as any)[camel]) return (this as any)[camel] as T;

    // 3) Fallback: iterate own properties and match by constructor name
    for (const key of Object.keys(this)) {
      const maybeInstance = (this as any)[key];
      if (maybeInstance && maybeInstance.constructor?.name === name) {
        return maybeInstance as T;
      }
    }

    return null;
  }

  /**
   * Get health status of all facade systems
   */
  public async getFacadeSystemHealthStatus() {
    if (!this.facadeCoordinator) return null;
    return await this.facadeCoordinator.performHealthCheck();
  }

  private async _registerAnimationSystems(): Promise<void> {
    if (!this.enhancedMasterAnimationCoordinator) {
      console.warn(
        "[Year3000System] AnimationFrameCoordinator not available for visual system registration"
      );
      return;
    }

    const visualSystems = [
      {
        name: "MusicBeatSynchronizer",
        system: this.musicBeatSyncVisualEffects,
        priority: "critical",
      },
      {
        name: "SpotifyUIApplication",
        system: this.spotifyUIApplicationSystem,
        priority: "normal",
      },
      {
        name: "UIVisualEffects",
        system: this.interactionTrackingSystem,
        priority: "normal",
      },
      {
        name: "ParticleVisualEffects",
        system: this.lightweightParticleSystem,
        priority: "background",
      },
      {
        name: "WebGLGradientBackground",
        system: this.webGLGradientBackgroundSystem,
        priority: "background",
      },
    ];

    for (const { name, system, priority } of visualSystems) {
      // Support both the new onAnimate hook and legacy updateAnimation
      if (
        system &&
        (typeof (system as any).onAnimate === "function" ||
          typeof (system as any).updateAnimation === "function")
      ) {
        // Performance-optimized priority and FPS determination
        let optimizedPriority = priority as
          | "background"
          | "normal"
          | "critical";
        let targetFPS = 60;

        // Determine target FPS based on system's performance profile
        const currentProfile = (system as any).currentPerformanceProfile;
        if (currentProfile?.frameRate) {
          targetFPS = currentProfile.frameRate;
        } else if (currentProfile?.quality) {
          const quality = currentProfile.quality;
          targetFPS = quality === "high" ? 60 : quality === "low" ? 30 : 45;
        }

        // Override priority based on system type for better performance
        if (name.includes("BeatSync")) {
          optimizedPriority = "critical";
        } else if (name.includes("Particle") || name.includes("DataGlyph")) {
          optimizedPriority = "background";
          targetFPS = Math.min(targetFPS, 30); // Cap background systems at 30fps
        }

        this.enhancedMasterAnimationCoordinator.registerAnimationSystem(
          name,
          system as any,
          optimizedPriority,
          targetFPS
        );

        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            `🎬 [Year3000System] Registered ${name} with Enhanced Master Animation Coordinator (${optimizedPriority} priority, ${targetFPS}fps) - using ${
              typeof (system as any).onAnimate === "function"
                ? "onAnimate"
                : "updateAnimation"
            } hook`
          );
        }
      }
    }
  }

  /**
   * Register visual systems with the AnimationFrameCoordinator
   * Phase 4: Animation System Consolidation
   */
  private async _registerEnhancedAnimationSystems(): Promise<void> {
    const coordinator = this.enhancedMasterAnimationCoordinator;
    if (!coordinator) {
      console.warn(
        "[Year3000System] AnimationFrameCoordinator not available for enhanced visual system registration"
      );
      return;
    }

    const candidateSystems: Array<{
      name: string;
      priority: "critical" | "normal" | "background";
      targetFPS: number;
      resolve: () => any;
    }> = [
      {
        name: "MusicBeatSynchronizer",
        priority: "critical",
        targetFPS: 60,
        resolve: () => this.musicBeatSyncVisualEffects,
      },
      {
        name: "UIVisualEffects",
        priority: "normal",
        targetFPS: 60,
        resolve: () => this.interactionTrackingSystem,
      },
      {
        name: "ParticleVisualEffects",
        priority: "background",
        targetFPS: 30,
        resolve: () => this.lightweightParticleSystem,
      },
      {
        name: "WebGLGradientBackground",
        priority: "background",
        targetFPS: 30,
        resolve: () => this.webGLGradientBackgroundSystem,
      },
      {
        name: "SpotifyUIApplication",
        priority: "normal",
        targetFPS: 30,
        resolve: () => this.spotifyUIApplicationSystem,
      },
    ];

    for (const candidate of candidateSystems) {
      const system = candidate.resolve();
      if (!system) {
        continue;
      }

      const onAnimate =
        typeof system.onAnimate === "function"
          ? system.onAnimate.bind(system)
          : typeof system.updateAnimation === "function"
          ? (delta: number) => system.updateAnimation(delta)
          : null;

      if (!onAnimate) {
        continue;
      }

      const animationAdapter = {
        onAnimate,
        onPerformanceModeChange:
          typeof system.onPerformanceModeChange === "function"
            ? system.onPerformanceModeChange.bind(system)
            : undefined,
      };

      try {
        coordinator.registerAnimationSystem(
          candidate.name,
          animationAdapter,
          candidate.priority,
          candidate.targetFPS
        );
      } catch (error) {
        console.error(
          `[Year3000System] Failed to register animation system ${candidate.name}:`,
          error
        );
      }
    }
  }

  // Progressive Loading Methods for Extension Support

  public async initializeWithAvailableAPIs(
    availableAPIs: AvailableAPIs
  ): Promise<void> {
    this.availableAPIs = availableAPIs;

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        `🌟 [Year3000System] Progressive initialization mode: ${
          availableAPIs.degradedMode ? "DEGRADED" : "FULL"
        }`
      );
      console.log(`🌟 [Year3000System] Available APIs:`, {
        player: !!availableAPIs.player,
        platform: !!availableAPIs.platform,
        config: !!availableAPIs.config,
      });
    }

    if (availableAPIs.degradedMode) {
      console.log(
        "🌟 [Year3000System] Initializing in degraded mode (visual-only systems)"
      );
      await this.initializeDegradedMode({
        player: availableAPIs.player,
        platform: availableAPIs.platform,
        config: availableAPIs.config,
      });
      return;
    }

    console.log("🌟 [Year3000System] Initializing in full mode (all systems)");
    await this.initializeAllSystems();
  }

  /**
   * Bridge TypedSettingsManager onChange callbacks to legacy broadcast system
   * Handles settings changes from TypedSettingsManager (Phase 6B modern pattern)
   */
  private _handleTypedSettingsChange(event: SettingsChangeEvent): void {
    const key = String(event.settingKey);
    const legacyAliasMap: Record<string, string> = {
      [ARTISTIC_MODE_KEY]: "artisticMode",
      [HARMONIC_INTENSITY_KEY]: "harmonicIntensity",
      [HARMONIC_EVOLUTION_KEY]: "harmonicEvolution",
      [HARMONIC_MODE_KEY]: "harmonicMode",
      "sn-manual-base-color": "manualBaseColor",
      [ACCENT_COLOR_KEY]: "accentColor",
      [CATPPUCCIN_FLAVOR_KEY]: "flavor",
      [PALETTE_SYSTEM_KEY]: "paletteSystem",
      [BRIGHTNESS_MODE_KEY]: "brightnessMode",
      [GRADIENT_INTENSITY_KEY]: "gradientIntensity",
    };

    const legacyKey = legacyAliasMap[key] ?? key;

    this._pendingLegacySettingKeys.add(legacyKey);

    void this._applySettingChange(key, event.newValue, event.oldValue);

    const legacyEvent = new CustomEvent("year3000SystemSettingsChanged", {
      detail: { key: legacyKey, value: event.newValue },
    });

    document.dispatchEvent(legacyEvent);
  }

  private _handleExternalSettingsChange(event: Event): void {
    const detail = (event as CustomEvent<{ key?: string; value?: unknown }>)
      .detail;
    const key =
      typeof detail?.key === "string" && detail.key.length > 0
        ? detail.key
        : null;

    if (!key) {
      return;
    }

    if (this._pendingLegacySettingKeys.has(key)) {
      this._pendingLegacySettingKeys.delete(key);
      return;
    }

    void this._applySettingChange(key, detail?.value, undefined);
  }

  /**
   * Apply the current performance profile to subsystems.
   */
  private _applyPerformanceProfile(): void {
    try {
      // Get current artistic mode multipliers from profile
      const multipliers = this.ADVANCED_SYSTEM_CONFIG.getCurrentMultipliers();

      if (!multipliers) {
        console.warn(
          "[ThemeLifecycleCoordinator] No multipliers available for performance profile"
        );
        return;
      }

      // Write performance profile variables as CSS variables for use by SCSS and JavaScript systems
      const cssVariables: Record<string, string> = {
        // Artistic effect multipliers
        "--sn-artistic-opacity": String(multipliers.opacity ?? 0.35),
        "--sn-artistic-saturation": String(multipliers.saturation ?? 1.0),
        "--sn-artistic-brightness": String(multipliers.brightness ?? 1.0),
        "--sn-artistic-contrast": String(multipliers.contrast ?? 1.0),
        "--sn-artistic-intensity": String(
          multipliers.animationIntensity ?? 0.8
        ),
        "--sn-artistic-music-boost": String(
          multipliers.musicEnergyBoost ?? 1.0
        ),
        "--sn-artistic-interaction": String(
          multipliers.interactionStrength ?? 0.6
        ),
        "--sn-artistic-visual-base": String(
          multipliers.visualIntensityBase ?? 1.0
        ),

        // Performance guard settings
        "--sn-performance-guard-active": String(
          this.performanceGuardActive ? "1" : "0"
        ),
        "--sn-performance-tier": String(
          this.simplePerformanceCoordinator?.currentTier ?? "medium"
        ),
        "--sn-performance-budget-active": String(
          this.performanceBudgetManager?.isActive() ? "1" : "0"
        ),
      };

      // Apply variables through CSS controller with batching
      if (this.cssVariableController?.batchSetVariables) {
        this.cssVariableController.batchSetVariables(
          "PerformanceProfile",
          cssVariables,
          "high",
          "performance-profile-application"
        );
      } else {
        // Fallback: direct DOM write
        const root = document.documentElement;
        Object.entries(cssVariables).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
      }

      // Apply performance profile to animation systems
      if (this.enhancedMasterAnimationCoordinator) {
        // Update animation speed based on performance profile
        const animationSpeedMultiplier = multipliers.animationIntensity ?? 0.8;
        this.enhancedMasterAnimationCoordinator.updateGlobalSpeedMultiplier?.(
          animationSpeedMultiplier
        );

        // Update performance guard settings
        this.enhancedMasterAnimationCoordinator.updatePerformanceGuard?.(
          this.performanceGuardActive
        );
      }

      // Apply performance profile to visual systems
      if (this.visualEffectsCoordinator) {
        // Update visual effects intensity based on performance profile
        const visualIntensityBase = multipliers.visualIntensityBase ?? 1.0;
        this.visualEffectsCoordinator.updateVisualIntensity?.(
          visualIntensityBase
        );

        // Update interaction strength
        const interactionStrength = multipliers.interactionStrength ?? 0.6;
        this.visualEffectsCoordinator.updateInteractionStrength?.(
          interactionStrength
        );
      }

      // Apply performance profile to particle systems
      if (this.lightweightParticleSystem) {
        // Update particle intensity based on performance profile
        const particleIntensity = multipliers.animationIntensity ?? 0.8;
        this.lightweightParticleSystem.updateIntensity?.(particleIntensity);
      }

      // Apply performance profile to WebGL systems
      if (this.webGLGradientBackgroundSystem) {
        // Update WebGL effects based on performance profile
        const webglIntensity = multipliers.visualIntensityBase ?? 1.0;
        this.webGLGradientBackgroundSystem.updateIntensity?.(webglIntensity);
      }

      // Notify systems of performance profile change using direct event emission
      const performanceEvent = new CustomEvent("performance:profile-changed", {
        detail: {
          multipliers,
          performanceGuardActive: this.performanceGuardActive,
          timestamp: Date.now(),
        },
      });
      document.dispatchEvent(performanceEvent);

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          `🎨 [ThemeLifecycleCoordinator] Applied performance profile CSS variables`,
          {
            multipliers,
            performanceGuardActive: this.performanceGuardActive,
            variablesCount: Object.keys(cssVariables).length,
          }
        );
      }
    } catch (error) {
      console.warn(
        "[ThemeLifecycleCoordinator] _applyPerformanceProfile error",
        error
      );
    }
  }

  /**
   * Refresh conditional visual systems (WebGL, ParticleField, etc.) depending
   * on capability and artistic mode settings.
   */
  private _refreshConditionalSystems(): void {
    try {
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🔄 [ThemeLifecycleCoordinator] Refreshing conditional visual systems..."
        );
      }

      // Get current artistic mode and performance settings
      const multipliers = this.ADVANCED_SYSTEM_CONFIG.getCurrentMultipliers();
      const currentPerformanceTier =
        this.simplePerformanceCoordinator?.currentTier ?? "medium";
      const isLowEndDevice =
        currentPerformanceTier === "low" ||
        currentPerformanceTier === "minimal";

      // Get current artistic mode for conditional system decisions
      const artisticMode =
        (settings.get(ARTISTIC_MODE_KEY) as string) || "balanced";
      const gradientIntensity =
        (settings.get(GRADIENT_INTENSITY_KEY) as string) || "balanced";

      // Determine which systems should be active based on capability and settings
      const shouldEnableWebGL =
        !isLowEndDevice && gradientIntensity !== "disabled";
      const shouldEnableParticles =
        !isLowEndDevice && artisticMode !== "minimal";
      const shouldEnableVisualEffects =
        multipliers?.animationIntensity ?? 0.8 > 0.3;

      // WebGL Background System
      if (this.webGLGradientBackgroundSystem) {
        const shouldActivate =
          shouldEnableWebGL &&
          typeof this.webGLGradientBackgroundSystem.activate === "function";
        const shouldDeactivate =
          !shouldEnableWebGL &&
          typeof this.webGLGradientBackgroundSystem.deactivate === "function";

        if (shouldActivate) {
          this.webGLGradientBackgroundSystem.activate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("✅ [Refresh] WebGL Background System activated");
          }
        } else if (shouldDeactivate) {
          this.webGLGradientBackgroundSystem.deactivate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("❌ [Refresh] WebGL Background System deactivated");
          }
        }
      }

      // Particle System
      if (this.lightweightParticleSystem) {
        const shouldActivate =
          shouldEnableParticles &&
          typeof this.lightweightParticleSystem.activate === "function";
        const shouldDeactivate =
          !shouldEnableParticles &&
          typeof this.lightweightParticleSystem.deactivate === "function";

        if (shouldActivate) {
          this.lightweightParticleSystem.activate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("✅ [Refresh] Particle System activated");
          }
        } else if (shouldDeactivate) {
          this.lightweightParticleSystem.deactivate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("❌ [Refresh] Particle System deactivated");
          }
        }

        // Update particle intensity based on performance profile
        if (shouldActivate && multipliers) {
          const particleIntensity = multipliers.animationIntensity ?? 0.8;
          this.lightweightParticleSystem.updateIntensity?.(particleIntensity);
        }
      }

      // Visual Effects System
      if (this.visualEffectsCoordinator) {
        const shouldActivate =
          shouldEnableVisualEffects &&
          typeof this.visualEffectsCoordinator.activate === "function";
        const shouldDeactivate =
          !shouldEnableVisualEffects &&
          typeof this.visualEffectsCoordinator.deactivate === "function";

        if (shouldActivate) {
          this.visualEffectsCoordinator.activate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("✅ [Refresh] Visual Effects System activated");
          }
        } else if (shouldDeactivate) {
          this.visualEffectsCoordinator.deactivate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("❌ [Refresh] Visual Effects System deactivated");
          }
        }

        // Update visual effects intensity based on performance profile
        if (shouldActivate && multipliers) {
          const visualIntensityBase = multipliers.visualIntensityBase ?? 1.0;
          const interactionStrength = multipliers.interactionStrength ?? 0.6;

          this.visualEffectsCoordinator.updateVisualIntensity?.(
            visualIntensityBase
          );
          this.visualEffectsCoordinator.updateInteractionStrength?.(
            interactionStrength
          );
        }
      }

      // Music Beat Sync System (always active but intensity varies)
      if (this.musicBeatSyncVisualEffects) {
        const shouldActivate =
          typeof this.musicBeatSyncVisualEffects.activate === "function";
        const shouldDeactivate =
          typeof this.musicBeatSyncVisualEffects.deactivate === "function";

        if (shouldActivate) {
          this.musicBeatSyncVisualEffects.activate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("✅ [Refresh] Music Beat Sync System activated");
          }
        } else if (shouldDeactivate) {
          this.musicBeatSyncVisualEffects.deactivate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("❌ [Refresh] Music Beat Sync System deactivated");
          }
        }

        // Update beat sync intensity based on artistic mode
        if (multipliers) {
          const beatSyncIntensity = multipliers.musicEnergyBoost ?? 1.0;
          this.musicBeatSyncVisualEffects.updateIntensity?.(beatSyncIntensity);
        }
      }

      // Header Visual Effects (conditional on artistic mode)
      if (this.headerVisualEffectsController) {
        const shouldActivate =
          artisticMode !== "minimal" &&
          typeof this.headerVisualEffectsController.activate === "function";
        const shouldDeactivate =
          artisticMode === "minimal" &&
          typeof this.headerVisualEffectsController.deactivate === "function";

        if (shouldActivate) {
          this.headerVisualEffectsController.activate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("✅ [Refresh] Header Visual Effects activated");
          }
        } else if (shouldDeactivate) {
          this.headerVisualEffectsController.deactivate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("❌ [Refresh] Header Visual Effects deactivated");
          }
        }
      }

      // Sidebar Visual Effects (conditional on performance)
      if (this.sidebarVisualEffectsController) {
        const shouldActivate =
          !isLowEndDevice &&
          typeof this.sidebarVisualEffectsController.activate === "function";
        const shouldDeactivate =
          isLowEndDevice &&
          typeof this.sidebarVisualEffectsController.deactivate === "function";

        if (shouldActivate) {
          this.sidebarVisualEffectsController.activate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("✅ [Refresh] Sidebar Visual Effects activated");
          }
        } else if (shouldDeactivate) {
          this.sidebarVisualEffectsController.deactivate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("❌ [Refresh] Sidebar Visual Effects deactivated");
          }
        }
      }

      // Spotify UI Application System (always active)
      if (this.spotifyUIApplicationSystem) {
        const shouldActivate =
          typeof this.spotifyUIApplicationSystem.activate === "function";
        const shouldDeactivate =
          typeof this.spotifyUIApplicationSystem.deactivate === "function";

        if (shouldActivate) {
          this.spotifyUIApplicationSystem.activate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log("✅ [Refresh] Spotify UI Application System activated");
          }
        } else if (shouldDeactivate) {
          this.spotifyUIApplicationSystem.deactivate();
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log(
              "❌ [Refresh] Spotify UI Application System deactivated"
            );
          }
        }
      }

      // Update performance guard settings across all systems
      if (this.enhancedMasterAnimationCoordinator) {
        this.enhancedMasterAnimationCoordinator.updatePerformanceGuard?.(
          this.performanceGuardActive
        );
      }

      // Notify systems of conditional system refresh using direct event emission
      const conditionalRefreshEvent = new CustomEvent(
        "systems:conditional-refresh",
        {
          detail: {
            activatedSystems: {
              webgl: shouldEnableWebGL,
              particles: shouldEnableParticles,
              visualEffects: shouldEnableVisualEffects,
              beatSync: true, // Always active
              header: artisticMode !== "minimal",
              sidebar: !isLowEndDevice,
              spotifyUI: true, // Always active
            },
            performanceTier: currentPerformanceTier,
            artisticMode,
            gradientIntensity,
            timestamp: Date.now(),
          },
        }
      );
      document.dispatchEvent(conditionalRefreshEvent);

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          `🔄 [ThemeLifecycleCoordinator] Conditional systems refresh complete - Tier: ${currentPerformanceTier}, WebGL: ${shouldEnableWebGL}, Particles: ${shouldEnableParticles}, VisualEffects: ${shouldEnableVisualEffects}`
        );
      }
    } catch (error) {
      console.warn(
        "[ThemeLifecycleCoordinator] _refreshConditionalSystems error",
        error
      );
    }
  }

  /**
   * Handle artistic-mode changes by triggering a colour refresh.
   */
  private _onArtisticModeChanged(): void {
    try {
      // Get current artistic mode multipliers from profile
      const multipliers = this.ADVANCED_SYSTEM_CONFIG.getCurrentMultipliers();

      if (!multipliers) {
        console.warn(
          "[ThemeLifecycleCoordinator] No multipliers available for artistic mode"
        );
        return;
      }

      // Write multipliers as CSS variables for use by SCSS and JavaScript systems
      const cssVariables: Record<string, string> = {
        "--sn-artistic-opacity": String(multipliers.opacity ?? 0.35),
        "--sn-artistic-saturation": String(multipliers.saturation ?? 1.0),
        "--sn-artistic-brightness": String(multipliers.brightness ?? 1.0),
        "--sn-artistic-contrast": String(multipliers.contrast ?? 1.0),
        "--sn-artistic-intensity": String(
          multipliers.animationIntensity ?? 0.8
        ),
        "--sn-artistic-music-boost": String(
          multipliers.musicEnergyBoost ?? 1.0
        ),
        "--sn-artistic-interaction": String(
          multipliers.interactionStrength ?? 0.6
        ),
        "--sn-artistic-visual-base": String(
          multipliers.visualIntensityBase ?? 1.0
        ),
      };

      // Apply variables through CSS controller with batching
      if (this.cssVariableController?.batchSetVariables) {
        this.cssVariableController.batchSetVariables(
          "ArtisticMode",
          cssVariables,
          "high",
          "artistic-mode-change"
        );
      } else {
        // Fallback: direct DOM write
        const root = document.documentElement;
        Object.entries(cssVariables).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
      }

      // Trigger color refresh with updated multipliers
      this.updateColorsFromCurrentTrack?.();

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          `🎨 [ThemeLifecycleCoordinator] Applied artistic mode CSS variables`,
          cssVariables
        );
      }
    } catch (e) {
      console.warn(
        "[ThemeLifecycleCoordinator] _onArtisticModeChanged error",
        e
      );
    }
  }

  private _handleVisibilityChange(): void {
    if (document.visibilityState !== "hidden") return;

    try {
      // Flush global batched CSS variables first
      this.cssVariableController?.flushCSSVariableBatch?.();

      // Force-flush NowPlayingCoordinator to avoid frame skew
      // NowPlayingCoordinator removed – its flush is handled via CSSVariableWriter

      // Force-flush SidebarPerformanceCoordinator if present
      try {
        // getSidebarPerformanceCoordinator()?.forceFlush(); // Phase 4: Managed by facade
      } catch {}

      if (this.ADVANCED_SYSTEM_CONFIG?.enableDebug) {
        console.log(
          "🌟 [Year3000System] Visibility hidden → forced flush of pending style updates"
        );
      }
    } catch (e) {
      if (this.ADVANCED_SYSTEM_CONFIG?.enableDebug) {
        console.warn("[Year3000System] VisibilityChange flush error", e);
      }
    }
  }

  /**
   * Destroy method for proper cleanup during testing
   */
  public async destroy(): Promise<void> {
    try {
      // Stop progressive enhancement monitoring
      if (this.degradedModeCoordinator) {
        this.degradedModeCoordinator.stopMonitoring();
        this.degradedModeCoordinator = null;
      }

      // Stop color event coordination
      if (this.colorEventCoordinator) {
        this.colorEventCoordinator.stopListening();
        this.colorEventCoordinator = null;
      }

      // Cleanup facade coordinator
      await this.destroyAllSystems();

      // Clear event listeners
      document.removeEventListener(
        "visibilitychange",
        this._handleVisibilityChange.bind(this)
      );

      // Reset state
      this.initialized = false;

      console.log("🌟 [AdvancedThemeSystem] System destroyed successfully");
    } catch (error) {
      console.error("❌ [AdvancedThemeSystem] Error during destroy:", error);
    }
  }
} // ← end of ThemeLifecycleCoordinator class

// -----------------------------------------------------------------------------
// 🌌  Modern Exports with Backward Compatibility
// -----------------------------------------------------------------------------

// Backward compatibility exports - maintain all legacy names
export {
  ThemeLifecycleCoordinator as AdvancedThemeSystem,
  ThemeLifecycleCoordinator as Year3000System,
};

// Singleton export
const themeLifecycleCoordinator = new ThemeLifecycleCoordinator();
if (typeof window !== "undefined") {
  (window as any).themeLifecycleCoordinator = themeLifecycleCoordinator;
  // Legacy global variables for backward compatibility
  (window as any).year3000System = themeLifecycleCoordinator;
  (window as any).advancedThemeSystem = themeLifecycleCoordinator;
}

export default themeLifecycleCoordinator;
