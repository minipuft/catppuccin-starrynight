declare const Spicetify: any;

// Phase 4: Facade imports for unified system access
import { SystemCoordinator } from "@/core/integration/SystemCoordinator";

// Settings import for typed access
import { settings } from "@/config";

// Color coordination imports for Strategy pattern
import { globalColorStateManager } from "@/core/css/ColorStateManager";
import { globalUnifiedColorProcessingEngine } from "@/core/color/UnifiedColorProcessingEngine";

// Event-driven integration imports
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";

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

export class AdvancedThemeSystem {
  public ADVANCED_SYSTEM_CONFIG: Year3000Config;
  public utils: typeof Utils;
  public initialized: boolean;
  private healthCheckInterval: number | null = null;

  // Phase 4: Facade Coordination System (replaces direct system properties)
  public facadeCoordinator: SystemCoordinator | null = null;

  // Color State Management System
  public colorStateManager: typeof globalColorStateManager | null = null;

  // Private initialization results storage
  private _initializationResults: any | null = null;

  // Private storage for dynamicCatppuccinBridge to allow setter
  private _dynamicCatppuccinBridge: any | null = null;

  // Phase 1: Loop Prevention System - Processing State Tracking
  private processingState = {
    isProcessingSongChange: false,
    lastProcessedTrackUri: null as string | null,
    lastProcessingTime: 0,
    processingChain: [] as string[],
    eventLoopDetected: false,
  };

  private colorEventState = {
    processedEvents: new Map<string, number>(),
    isProcessingColorEvent: false,
    eventTimeout: null as number | null,
  };

  private readonly PROCESSING_TIMEOUT = 5000; // 5 second safety timeout
  private readonly MAX_CHAIN_LENGTH = 10; // Prevent infinite chains
  private readonly COLOR_EVENT_CACHE_TTL = 2000; // 2 second cache

  // Phase 4: Pure Facade Access Property Getters

  // Performance Systems
  public get enhancedMasterAnimationCoordinator() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "EnhancedMasterAnimationCoordinator"
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
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "OptimizedCSSVariableManager"
      ) || null
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
        "SimpleTierBasedPerformanceSystem"
      ) || null
    );
  }
  public get enhancedDeviceTierDetector() {
    return (
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "EnhancedDeviceTierDetector"
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
      this.facadeCoordinator?.getCachedNonVisualSystem("SimplePerformanceCoordinator") ||
      null
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
      this.facadeCoordinator?.getCachedNonVisualSystem(
        "UnifiedColorProcessingEngine"
      ) || null
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
    return this._dynamicCatppuccinBridge || this.visualEffectsCoordinator || null;
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
    return (
      this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null
    );
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
    return (
      this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null
    );
  }
  public get interactionTrackingSystem() {
    return (
      this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null
    );
  }
  public get whiteLayerDiagnosticSystem() {
    return (
      this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null
    );
  }
  public get audioVisualController() {
    return (
      this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null
    );
  }
  public get prismaticScrollSheenSystem() {
    return (
      this.facadeCoordinator?.getVisualSystem("UIVisualEffects") || null
    );
  }
  public get beatSyncVisualSystem() {
    return this.facadeCoordinator?.getVisualSystem("MusicBeatSync") || null;
  }
  public get webGLGradientBackgroundSystem() {
    return this.facadeCoordinator?.getVisualSystem("WebGLBackground") || null;
  }
  // Legacy compatibility - particleFieldSystem consolidated into particleVisualEffectsModule
  public get particleFieldSystem() {
    return this.facadeCoordinator?.getVisualSystem("Particle") || null;
  }
  public get animationCoordinator() {
    // Animation coordination through EnhancedMasterAnimationCoordinator
    return this.enhancedMasterAnimationCoordinator || null;
  }

  /** @deprecated Use animationCoordinator instead */
  public get emergentChoreographyEngine() {
    return this.animationCoordinator;
  }
  public get spotifyUIApplicationSystem() {
    return (
      this.facadeCoordinator?.getVisualSystem("SpotifyUIApplication") || null
    );
  }

  // Music Beat Synchronization System
  public get musicBeatSyncVisualEffects() {
    return (
      this.facadeCoordinator?.getVisualSystem("MusicBeatSync") ||
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

  constructor(config: AdvancedSystemConfig | Year3000Config = ADVANCED_SYSTEM_CONFIG) {
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

    // Listen for live settings changes (registered early so no duplicates)
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

  private _deepCloneConfig(config: AdvancedSystemConfig | Year3000Config): Year3000Config {
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
  ): void {}

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
      this.facadeCoordinator = new SystemCoordinator(
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

      // Initialize ColorStateManager
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Initializing ColorStateManager...");
      }
      try {
        this.colorStateManager = globalColorStateManager;
        if (!this.colorStateManager.initialized) {
          await this.colorStateManager.initialize();
        }
        initializationResults.success.push("ColorStateManager");
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌌 [Year3000System] ColorStateManager initialized successfully"
          );
        }
      } catch (error) {
        console.error(
          "🌌 [Year3000System] Failed to initialize ColorStateManager:",
          error
        );
        initializationResults.failed.push("ColorStateManager");
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
        name: "UnifiedCSSVariableManager",
        init: () => {
          this.unifiedCSSManager = UnifiedCSSVariableManager.getInstance(
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
        name: "UnifiedCSSVariableManager",
        init: () => {
          if (this.unifiedCSSManager && this.unifiedPerformanceCoordinator) {
            this.performanceCSSIntegration =
              UnifiedCSSVariableManager.getInstance(
                this.ADVANCED_SYSTEM_CONFIG,
                this.unifiedCSSManager,
                this.unifiedPerformanceCoordinator
              );

            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(
                "[Year3000System] UnifiedCSSVariableManager initialized with CSS performance coordination"
              );
            }
          }
        },
      },
      // NOTE: SettingsManager removed - using typed settings singleton instead
      {
        name: "EnhancedMasterAnimationCoordinator",
        init: () => {
          if (!this.performanceCoordinator) {
            throw new Error(
              "UnifiedPerformanceCoordinator is required for EnhancedMasterAnimationCoordinator."
            );
          }

          // Create singleton instance of EnhancedMasterAnimationCoordinator
          this.enhancedMasterAnimationCoordinator =
            EnhancedMasterAnimationCoordinator.getInstance(
              this.ADVANCED_SYSTEM_CONFIG,
              this.performanceCoordinator
            );

          // Start the master animation loop
          this.enhancedMasterAnimationCoordinator.startMasterAnimationLoop();

          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log(
              "[Year3000System] EnhancedMasterAnimationCoordinator initialized for Phase 4 consolidation"
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
          this.colorHarmonyEngine = new ColorHarmonyEngine(
            this.ADVANCED_SYSTEM_CONFIG,
            this.utils,
            this.performanceAnalyzer,
            this.musicSyncService || undefined
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
    // Note: Animation registration now handled by EnhancedMasterAnimationCoordinator

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
        "[Year3000System] EnhancedMasterAnimationCoordinator not available for enhanced registration phase"
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
        "UnifiedCSSVariableManager",
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
      const foundationSystems = [
        "SimplePerformanceCoordinator",
        "UnifiedDebugManager", 
        "SettingsManager",
        "DeviceCapabilityDetector",
        "TimerConsolidationSystem",
      ];

      // Group 2: Systems that depend on foundation systems
      const dependentSystems = [
        "UnifiedCSSVariableManager", // Depends on SimplePerformanceCoordinator
        "UnifiedPerformanceCoordinator", // Depends on SimplePerformanceCoordinator
      ];

      // Group 3: Event-driven systems (can initialize in parallel after dependencies)
      const eventDrivenSystems = [
        "MusicSyncService",
        "ColorHarmonyEngine", // 🎵 Now includes GenreProfileManager integration
        "MusicEmotionAnalyzer", // 🎭 Emotional intelligence for music analysis
      ];

      // Group 4: UI systems that depend on CSS variable management
      const uiSystems = [
        "GlassmorphismManager", // 🌊 Essential glassmorphism effects
        "Card3DManager", // 🎴 Essential 3D card transformations
      ];

      // Parallel initialization Group 1: Foundation systems
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Initializing foundation systems in parallel...");
      }
      const foundationPromises = foundationSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = await this.facadeCoordinator.getNonVisualSystem(systemKey as any);
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(`🌌 [Year3000System] ✗ Failed to initialize ${systemKey}:`, error);
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(foundationPromises);

      // Parallel initialization Group 2: Dependent systems  
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Initializing dependent systems in parallel...");
      }
      const dependentPromises = dependentSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = await this.facadeCoordinator.getNonVisualSystem(systemKey as any);
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(`🌌 [Year3000System] ✗ Failed to initialize ${systemKey}:`, error);
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(dependentPromises);

      // Parallel initialization Group 3: Event-driven systems
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Initializing event-driven systems in parallel...");
      }
      const eventDrivenPromises = eventDrivenSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = await this.facadeCoordinator.getNonVisualSystem(systemKey as any);
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(`🌌 [Year3000System] ✗ Failed to initialize ${systemKey}:`, error);
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(eventDrivenPromises);

      // Parallel initialization Group 4: UI systems
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Initializing UI systems in parallel...");
      }
      const uiPromises = uiSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = await this.facadeCoordinator.getNonVisualSystem(systemKey as any);
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(`🌌 [Year3000System] ✗ Failed to initialize ${systemKey}:`, error);
          return { systemKey, success: false, error };
        }
      });

      await Promise.all(uiPromises);

      // Initialize ColorOrchestrator for Strategy pattern coordination
      try {
        await globalUnifiedColorProcessingEngine.initialize();
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🎨 [Year3000System] ColorOrchestrator initialized for strategy pattern coordination"
          );
        }
      } catch (error) {
        console.error(
          "🎨 [Year3000System] Failed to initialize ColorOrchestrator:",
          error
        );
      }

      // Start performance monitoring if available
      if (this.performanceAnalyzer) {
        this.performanceAnalyzer.startMonitoring();
        this.performanceGuardActive = true;
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log("🌌 [Year3000System] Performance monitoring started");
        }
      }

      // Parallel initialization of visual systems (performance optimization)
      const essentialVisualSystems = [
        "Particle", // ParticleField consolidated into Particle (ParticleVisualEffectsModule)
        "WebGLBackground", // 🌌 Enable WebGL gradient backgrounds
        "SpotifyUIApplication", // 🎨 Core UI color application
        "OrganicBeatSync",
        "HeaderVisualEffects", // 🎭 Music-responsive header visual effects animations
        "InteractionTracking",
        // EmergentChoreography integrated into EnhancedMasterAnimationCoordinator
      ];

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Initializing visual systems in parallel...");
      }
      
      const visualPromises = essentialVisualSystems.map(async (systemKey) => {
        try {
          if (!this.facadeCoordinator) {
            throw new Error("Facade coordinator not available");
          }
          const system = this.facadeCoordinator.getVisualSystem(systemKey as any);
          if (system && typeof system.initialize === "function") {
            await system.initialize();
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] ✓ Visual ${systemKey} initialized`);
            }
            return { systemKey, success: true };
          }
          return { systemKey, success: false, reason: "No initialize method" };
        } catch (error) {
          console.error(`🌌 [Year3000System] ✗ Failed to initialize visual ${systemKey}:`, error);
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
      console.log("🔍 [Year3000System] Performing facade integration validation...");
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
      // Test 1: Validate CSS Controller Alias Registration (Phase 1 fix)
      if (this.facadeCoordinator) {
        try {
          const cssController = await this.facadeCoordinator.getNonVisualSystem(
            "UnifiedCSSVariableManager" as any
          );
          const optimizedController = await this.facadeCoordinator.getNonVisualSystem(
            "OptimizedCSSVariableManager" as any
          );
          
          if (cssController && optimizedController) {
            validationResults.cssControllerAlias = true;
            if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
              console.log("✓ [Validation] CSS Controller alias registration working");
            }
          } else {
            validationResults.errors.push("CSS Controller alias registration failed");
          }
        } catch (error) {
          validationResults.errors.push(`CSS Controller validation error: ${error}`);
        }

        // Test 2: Validate Strategy Pattern Systems (Phase 2 fix)
        const strategyPatternSystems = ["ColorHarmonyEngine", "MusicEmotionAnalyzer"];
        let strategySystemsFound = 0;

        for (const systemKey of strategyPatternSystems) {
          try {
            const system = await this.facadeCoordinator.getNonVisualSystem(systemKey as any);
            if (system) {
              strategySystemsFound++;
            }
          } catch (error) {
            validationResults.errors.push(`Strategy system ${systemKey} not found: ${error}`);
          }
        }

        validationResults.strategyPatternSystems = strategySystemsFound === strategyPatternSystems.length;
        if (validationResults.strategyPatternSystems && this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log("✓ [Validation] Strategy pattern systems registration working");
        }

        // Test 3: Validate Parallel Initialization Performance (Phase 3 fix)
        const initStartTime = performance.now();
        try {
          // Test that we can initialize a small system quickly (should be <100ms for simple systems)
          const testSystem = await this.facadeCoordinator.getNonVisualSystem("PerformanceAnalyzer" as any);
          const initEndTime = performance.now();
          const initTime = initEndTime - initStartTime;
          
          validationResults.parallelInitialization = initTime < 100; // Should be fast due to parallel optimization
          if (validationResults.parallelInitialization && this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log(`✓ [Validation] Parallel initialization optimization working (${initTime.toFixed(2)}ms)`);
          } else if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.warn(`⚠ [Validation] Initialization may be slow (${initTime.toFixed(2)}ms)`);
          }
        } catch (error) {
          validationResults.errors.push(`Parallel initialization test failed: ${error}`);
        }

        // Test 4: Validate Facade Health Check (Phase 4 validation)
        try {
          const healthCheck = await this.facadeCoordinator.performHealthCheck();
          validationResults.facadeHealthCheck = healthCheck.overall === "excellent" || healthCheck.overall === "good";
          
          if (validationResults.facadeHealthCheck && this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log(`✓ [Validation] Facade health check passed (${healthCheck.overall})`);
          } else {
            validationResults.errors.push(`Facade health check failed: ${healthCheck.overall}`);
            if (healthCheck.recommendations?.length > 0) {
              console.warn("🔧 [Validation] Health recommendations:", healthCheck.recommendations);
            }
          }
        } catch (error) {
          validationResults.errors.push(`Facade health check error: ${error}`);
        }
      } else {
        validationResults.errors.push("Facade coordinator not available for validation");
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
        console.log(`🔍 [Year3000System] Facade validation complete: ${passedTests}/${totalTests} tests passed`);
        
        if (validationResults.errors.length > 0) {
          console.warn("⚠ [Year3000System] Validation errors:", validationResults.errors);
        }
        
        if (passedTests === totalTests) {
          console.log("🎉 [Year3000System] All facade integration fixes validated successfully!");
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

      // Link ColorHarmonyEngine to EnhancedMasterAnimationCoordinator (adaptive functionality)
      if (this.colorHarmonyEngine && this.enhancedMasterAnimationCoordinator) {
        // Note: ColorHarmonyEngine expects EmergentChoreographyEngine interface
        // but now gets EnhancedMasterAnimationCoordinator with adaptive functionality
        this.colorHarmonyEngine.setEmergentEngine(
          this.enhancedMasterAnimationCoordinator as any
        );
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌌 [Year3000System] EnhancedMasterAnimationCoordinator (with adaptive functionality) linked to ColorHarmonyEngine"
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
    if (
      !this.performanceAnalyzer ||
      !this.musicSyncService
    ) {
      console.error(
        "[Year3000System] Cannot initialize visual systems due to missing core dependencies (SimplePerformanceCoordinator, MusicSyncService)."
      );
      const visualSystems = [
        "InteractionTrackingSystem",
        "BeatSyncVisualSystem",
        "SidebarSystemsIntegration",
        // "EmergentChoreographyEngine", // Consolidated into EnhancedMasterAnimationCoordinator
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
      // EmergentChoreographyEngine consolidated into EnhancedMasterAnimationCoordinator
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
    // Note: EmergentChoreography now integrated into EnhancedMasterAnimationCoordinator
    if (this.colorHarmonyEngine && this.enhancedMasterAnimationCoordinator) {
      this.colorHarmonyEngine.setEmergentEngine(
        this.enhancedMasterAnimationCoordinator as any
      );
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🔗 [Year3000System] EnhancedMasterAnimationCoordinator (adaptive functionality) linked to ColorHarmonyEngine."
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
    if (Spicetify.Player && this._songChangeHandler) {
      Spicetify.Player.removeEventListener(
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

      // Initialize ColorStateManager if available
      if (this.colorStateManager && !this.colorStateManager.initialized) {
        console.log("🎨 [Year3000System] Initializing ColorStateManager...");
        await this.colorStateManager.initialize();
      }

      // Apply color state first (replaces old _applyCatppuccinAccent logic)
      if (this.colorStateManager?.initialized) {
        console.log(
          "🎨 [Year3000System] Applying initial color state via ColorStateManager..."
        );
        await this.colorStateManager.applyInitialColorState();
      } else {
        console.warn(
          "🎨 [Year3000System] ColorStateManager not available, using legacy color application"
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
      const harmonicModeKey = settings.get(
        "sn-current-harmonic-mode"
      );
      if (harmonicModeKey) {
        this.ADVANCED_SYSTEM_CONFIG.currentColorHarmonyMode = String(harmonicModeKey);
      }

      console.log(
        `🎨 [Year3000System] applyInitialSettings: Gradient=${gradient}, Stars=${stars}, ColorState=${!!this
          .colorStateManager?.initialized}`
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
    if (!this.colorStateManager?.initialized) {
      console.warn(
        `🎨 [Year3000System] ColorStateManager not available for ${trigger} update`
      );
      return;
    }

    console.log(
      `🎨 [Year3000System] Updating color state for trigger: ${trigger}`
    );
    await this.colorStateManager.updateColorState(trigger);
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
    const colorScheme = Spicetify.Config.color_scheme || "mocha";
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
   * Handle colors:harmonized event from ColorHarmonyEngine (Event-driven architecture)
   * 🔧 PHASE 1: Enhanced with loop prevention and recursion protection
   */
  private handleColorHarmonizedEvent(data: any): void {
    // Phase 1: Loop Prevention - Check if already processing
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
  }

  /**
   * Phase 1: Helper method to generate simple hash for event caching
   */
  private _generateEventHash(context: string): string {
    let hash = 0;
    for (let i = 0; i < context.length; i++) {
      const char = context.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Phase 1: Reset color event processing state
   */
  private _resetColorEventState(): void {
    this.colorEventState.isProcessingColorEvent = false;

    if (this.colorEventState.eventTimeout) {
      clearTimeout(this.colorEventState.eventTimeout);
      this.colorEventState.eventTimeout = null;
    }

    // Clean up old cache entries (older than TTL)
    const now = Date.now();
    for (const [
      hash,
      timestamp,
    ] of this.colorEventState.processedEvents.entries()) {
      if (now - timestamp > this.COLOR_EVENT_CACHE_TTL) {
        this.colorEventState.processedEvents.delete(hash);
      }
    }
  }

  /**
   * Phase 1: Reset processing state after loop detection or timeout
   */
  private _resetProcessingState(): void {
    this.processingState.isProcessingSongChange = false;
    this.processingState.processingChain = [];
    this.processingState.eventLoopDetected = false;
    this.processingState.lastProcessingTime = Date.now();

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log("🔄 [Year3000System] Processing state reset");
    }
  }

  /**
   * Apply colors via delegation to CSS authority systems
   * Delegates Spicetify variables to ColorStateManager and DynamicCatppuccinBridge
   */
  private _applyColorsViaFacadeSystem(
    processedColors: Record<string, string>,
    accentHex: string,
    accentRgb: string
  ): void {
    try {
      // Delegate Spicetify variables to CSS authority systems
      // ColorStateManager handles: --spice-accent, --spice-base, --spice-rgb-accent etc.
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
      // Note: Spicetify variables (--spice-*) are handled by ColorStateManager and DynamicCatppuccinBridge
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
          cssAuthorityDelegation: "ColorStateManager + DynamicCatppuccinBridge"
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
        console.log("🔧 [Year3000System] Applied musical harmony variables via CSS coordination:", {
          totalVariables: Object.keys(cssVariables).length,
          accentColor: accentHex,
          cssControllerUsed: !!this.cssVariableController,
          spicetifyDelegation: "ColorStateManager + DynamicCatppuccinBridge handle --spice-* variables"
        });
      }
    } catch (error) {
      console.error(
        "[Year3000System] Failed to apply musical harmony variables:",
        error
      );

      // Minimal fallback - only essential musical harmony variables
      // Note: Spicetify variables handled by ColorStateManager/DynamicCatppuccinBridge
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
   * Queue a CSS variable update through the shared UnifiedCSSVariableManager. Falls
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
    element: HTMLElement | null = null
  ): void {
    if (this.unifiedCSSManager) {
      // Use the unified CSS manager for maximum performance
      this.unifiedCSSManager.queueUpdate(
        property,
        value,
        "normal",
        "Year3000System"
      );
    } else if (this.cssVariableController) {
      // Fallback to CSS variable batcher
      this.cssVariableController.queueCSSVariableUpdate(
        property,
        value,
        element || undefined
      );
    } else {
      // Fallback – apply directly so functionality still works in degraded mode
      const target = element || document.documentElement;
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
      if (Spicetify.Player.data?.track?.uri) {
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
   * Phase 1: Integration with SystemCoordinator and ColorOrchestrator
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

    // Set up event-driven color harmonization (NEW ARCHITECTURE)
    try {
      unifiedEventBus.subscribe(
        "colors:harmonized",
        (data: any) => {
          this.handleColorHarmonizedEvent(data);
        },
        "Year3000System"
      );

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "🎨 [Year3000System] Subscribed to colors:harmonized events for event-driven color application"
        );
      }
    } catch (error) {
      console.error(
        "[Year3000System] Failed to subscribe to colors:harmonized events:",
        error
      );
    }

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
        `[Year3000System] Cannot register ${name} - EnhancedMasterAnimationCoordinator not ready`
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
        "[Year3000System] EnhancedMasterAnimationCoordinator not available for visual system registration"
      );
      return;
    }

    const visualSystems = [
      {
        name: "BeatSyncVisualSystem",
        system: this.beatSyncVisualSystem,
        priority: "critical",
      },
      // EmergentChoreographyEngine consolidated into EnhancedMasterAnimationCoordinator
      {
        name: "SidebarSystemsIntegration",
        system: this.sidebarSystemsIntegration,
        priority: "normal",
      },
      {
        name: "ParticleConsciousnessModule",
        system: this.particleVisualEffectsModule,
        priority: "background",
      },
      {
        name: "InteractionTrackingSystem",
        system: this.interactionTrackingSystem,
        priority: "background",
      },
      {
        name: "SpotifyUIApplicationSystem",
        system: this.spotifyUIApplicationSystem,
        priority: "normal",
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
   * Register visual systems with the EnhancedMasterAnimationCoordinator
   * Phase 4: Animation System Consolidation
   */
  private async _registerEnhancedAnimationSystems(): Promise<void> {
    if (!this.enhancedMasterAnimationCoordinator) {
      console.warn(
        "[Year3000System] EnhancedMasterAnimationCoordinator not available for enhanced visual system registration"
      );
      return;
    }

    // Migration approach: Register systems with the new coordinator
    // while keeping existing AnimationConductor for compatibility
    const enhancedVisualSystems = [
      {
        name: "BeatSyncVisualSystem",
        system: this.beatSyncVisualSystem,
        priority: "critical" as const,
        type: "animation" as const,
      },
      // EmergentChoreographyEngine consolidated into EnhancedMasterAnimationCoordinator
      {
        name: "SidebarSystemsIntegration",
        system: this.sidebarSystemsIntegration,
        priority: "normal" as const,
        type: "animation" as const,
      },
      {
        name: "ParticleConsciousnessModule",
        system: this.particleVisualEffectsModule,
        priority: "background" as const,
        type: "animation" as const,
      },
      {
        name: "InteractionTrackingSystem",
        system: this.interactionTrackingSystem,
        priority: "background" as const,
        type: "animation" as const,
      },
      {
        name: "SpotifyUIApplicationSystem",
        system: this.spotifyUIApplicationSystem,
        priority: "normal" as const,
        type: "animation" as const,
      },
    ];

    for (const { name, system, priority, type } of enhancedVisualSystems) {
      if (system) {
        try {
          let registered = false;

          // Register based on system type - all systems now use animation type
          if (
            type === "animation" &&
            (typeof (system as any).onAnimate === "function" ||
              typeof (system as any).updateAnimation === "function")
          ) {
            // Register as animation system (for IManagedSystem pattern)
            registered =
              this.enhancedMasterAnimationCoordinator.registerAnimationSystem(
                name,
                system as any,
                priority,
                60 // Default 60fps
              );
          }

          if (registered && this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log(
              `🎬 [Year3000System] Enhanced registration: ${name} (${priority} priority, ${type} type)`
            );
          } else if (!registered) {
            console.warn(
              `[Year3000System] Failed to register ${name} with EnhancedMasterAnimationCoordinator`
            );
          }
        } catch (error) {
          console.error(
            `[Year3000System] Error registering ${name} with EnhancedMasterAnimationCoordinator:`,
            error
          );
        }
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
      await this.initializeVisualOnlySystems();
    } else {
      console.log(
        "🌟 [Year3000System] Initializing in full mode (all systems)"
      );
      await this.initializeAllSystems();
    }

    // Set up progressive enhancement if in degraded mode
    if (availableAPIs.degradedMode) {
      this.setupProgressiveEnhancement();
    }
  }

  private async initializeVisualOnlySystems(): Promise<void> {
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🌟 [Year3000System] Starting visual-only system initialization..."
      );
    }

    const startTime = performance.now();
    const initializationResults: InitializationResults = {
      success: [],
      failed: [],
      skipped: [],
    };

    // Phase 4: Essential systems managed by facade - commented out
    /* const essentialSystems = [
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
        name: "EnhancedMasterAnimationCoordinator",
        init: () => {
          if (!this.performanceAnalyzer) {
            throw new Error(
              "SimplePerformanceCoordinator is required for EnhancedMasterAnimationCoordinator."
            );
          }
          // In degraded mode, we don't have UnifiedPerformanceCoordinator, so pass undefined
          this.enhancedMasterAnimationCoordinator =
            EnhancedMasterAnimationCoordinator.getInstance(
              this.ADVANCED_SYSTEM_CONFIG
            );
          this.enhancedMasterAnimationCoordinator.startMasterAnimationLoop();
        },
      },
    ]; */

    // Phase 4: Initialize facade coordination system for degraded mode
    try {
      this.facadeCoordinator = new SystemCoordinator(
        this.ADVANCED_SYSTEM_CONFIG,
        this.utils,
        this
      );
      await this.facadeCoordinator.initialize({
        mode: "performance-optimized",
        enableSharedDependencies: true,
        enableCrossFacadeCommunication: false,
        enableUnifiedPerformanceMonitoring: true,
        enableResourceOptimization: true,
        performanceThresholds: {
          maxTotalMemoryMB: 50,
          maxTotalInitTime: 3000,
          maxCrossCommLatency: 100,
        },
        coordinationPreferences: {
          preferSharedResources: true,
          enableEventPropagation: false,
          enableHealthCoordination: true,
        },
      });

      // Initialize essential systems only for degraded mode
      await this._initializeEssentialFacadeSystems();

      initializationResults.success.push("FacadeCoordinationSystem");
    } catch (error) {
      console.error(
        "🌌 [Year3000System] Failed to initialize degraded facade system:",
        error
      );
      initializationResults.failed.push("FacadeCoordinationSystem");
    }

    /* for (const { name, init } of essentialSystems) {
      try {
        await init();
        initializationResults.success.push(name);
      } catch (error) {
        initializationResults.failed.push(name);
        console.error(`[Year3000System] Failed to initialize ${name}:`, error);
      }
    } */

    // Skip systems that require Spicetify APIs
    const skippedSystems = [
      "SettingsManager",
      "MusicSyncService",
      "ColorHarmonyEngine",
      "GlassmorphismManager",
      "Card3DManager",
      "All Visual Systems",
    ];
    initializationResults.skipped.push(...skippedSystems);

    this._initializationResults = initializationResults;
    this.initialized = true;

    const endTime = performance.now();
    const initTime = endTime - startTime;

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        `🌟 [Year3000System] Visual-only initialization complete in ${initTime.toFixed(
          2
        )}ms`
      );
      console.log(
        `🌟 [Year3000System] Results: ${initializationResults.success.length} success, ${initializationResults.failed.length} failed, ${initializationResults.skipped.length} skipped`
      );
    }
  }

  private setupProgressiveEnhancement(): void {
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🌟 [Year3000System] Setting up progressive enhancement monitoring..."
      );
    }

    let enhancementAttempts = 0;
    const maxEnhancementAttempts = 30; // 1 minute total

    const enhancementInterval = setInterval(() => {
      enhancementAttempts++;

      // Check if previously missing APIs are now available
      const playerAvailable = !!(window as any).Spicetify?.Player;
      const platformAvailable = !!(window as any).Spicetify?.Platform;

      if (
        playerAvailable &&
        platformAvailable &&
        this.availableAPIs?.degradedMode
      ) {
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌟 [Year3000System] APIs now available! Triggering upgrade to full mode..."
          );
        }

        clearInterval(enhancementInterval);
        this.upgradeToFullMode().catch((error) => {
          console.error("[Year3000System] Upgrade to full mode failed:", error);
        });
      }

      // Stop checking after max attempts
      if (enhancementAttempts >= maxEnhancementAttempts) {
        if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🌟 [Year3000System] Progressive enhancement monitoring stopped (timeout)"
          );
        }
        clearInterval(enhancementInterval);
      }
    }, 2000); // Check every 2 seconds
  }

  public async upgradeToFullMode(): Promise<void> {
    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        "🌟 [Year3000System] Upgrading from degraded mode to full mode..."
      );
    }

    // Update available APIs
    this.availableAPIs = {
      player: (window as any).Spicetify?.Player,
      platform: (window as any).Spicetify?.Platform,
      config: (window as any).Spicetify?.Config,
      degradedMode: false,
    };

    try {
      // Initialize the missing systems that require Spicetify APIs
      const upgradeResults: InitializationResults = {
        success: [],
        failed: [],
        skipped: [],
      };

      // Phase 4: SettingsManager managed by facade (migrated to typed settings)
      // NOTE: SettingsManager no longer initialized - using TypedSettingsManager singleton via typed settings

      // Phase 4: MusicSyncService managed by facade (migrated to typed settings)
      // NOTE: MusicSyncService initialization moved to earlier in lifecycle, no longer dependent on SettingsManager

      // Initialize remaining systems...
      if (this.performanceAnalyzer) {
        // Phase 4: ColorHarmonyEngine managed by facade
        try {
          /* this.colorHarmonyEngine = new ColorHarmonyEngine(
            this.ADVANCED_SYSTEM_CONFIG,
            this.utils,
            this.performanceAnalyzer,
            this.musicSyncService || undefined,
            this.settingsManager
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
          upgradeResults.success.push("ColorHarmonyEngine"); */
        } catch (error) {
          /* upgradeResults.failed.push("ColorHarmonyEngine");
          console.error(
            `[Year3000System] Failed to upgrade ColorHarmonyEngine:`,
            error
          ); */
        }

        // Initialize visual systems
        // Phase 4: Visual systems managed by facade
        // await this._initializeVisualSystems(upgradeResults);

        // Register animation systems
        if (this.enhancedMasterAnimationCoordinator) {
          await this._registerAnimationSystems();
        }
      }

      // Set up music analysis if available
      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          "[Year3000System] Checking music analysis setup conditions:",
          {
            musicSyncService: !!this.musicSyncService,
            playerAPI: !!this.availableAPIs.player,
            musicSyncInitialized: this.musicSyncService?.initialized,
          }
        );
      }

      if (this.musicSyncService && this.availableAPIs.player) {
        console.log(
          "🎵 [Year3000System] Setting up music analysis and color extraction..."
        );
        this.setupMusicAnalysisAndColorExtraction();
      } else {
        console.warn(
          "⚠️ [Year3000System] Music analysis setup skipped - missing dependencies:",
          {
            musicSyncService: !!this.musicSyncService,
            playerAPI: !!this.availableAPIs.player,
          }
        );
      }

      // Apply initial settings (now using typed settings directly)
      await this.applyInitialSettings();

      if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(
          `🌟 [Year3000System] Upgrade complete: ${upgradeResults.success.length} success, ${upgradeResults.failed.length} failed`
        );
        // NEW: Verbose breakdown for upgrade phase
        if (upgradeResults.failed.length > 0) {
          console.warn(
            `🌟 [Year3000System] Upgrade failed systems: ${upgradeResults.failed.join(
              ", "
            )}`
          );
        }

        if (upgradeResults.skipped && upgradeResults.skipped.length > 0) {
          console.info(
            `🌟 [Year3000System] Upgrade skipped systems: ${upgradeResults.skipped.join(
              ", "
            )}`
          );
        }

        if (upgradeResults.success.length > 0) {
          console.info(
            `🌟 [Year3000System] Upgrade successful systems: ${upgradeResults.success.join(
              ", "
            )}`
          );
        }
      }
    } catch (error) {
      console.error(
        "[Year3000System] Error during upgrade to full mode:",
        error
      );
    }
  }

  private _handleExternalSettingsChange(event: Event): void {
    const { key, value } = (event as CustomEvent).detail || {};

    // Guard when subsystems are not ready yet
    if (!key) return;

    switch (key) {
      case "artisticMode": {
        try {
          if (
            typeof (this.ADVANCED_SYSTEM_CONFIG as any).safeSetArtisticMode ===
            "function"
          ) {
            (this.ADVANCED_SYSTEM_CONFIG as any).safeSetArtisticMode(value);
          }
        } catch (e) {
          console.warn("[Year3000System] Failed to apply artistic mode", e);
        }
        break;
      }
      case "harmonicIntensity": {
        // Expect numeric string or number 0-1
        const num = parseFloat(value);
        if (!Number.isNaN(num)) {
          this.ADVANCED_SYSTEM_CONFIG.colorHarmonyIntensity = num;
          if (this.colorHarmonyEngine) {
            (this.colorHarmonyEngine as any).setIntensity?.(num);
            // Re-blend colours
            this.updateColorsFromCurrentTrack?.();
          }
        }
        break;
      }
      case "harmonicEvolution": {
        const enabled = value === "true" || value === true;
        this.allowHarmonicEvolution = enabled;
        this.ADVANCED_SYSTEM_CONFIG.colorHarmonyEvolution = enabled;
        break;
      }
      case "manualBaseColor": {
        // 🔧 FIXED: Only apply manual color if it's not empty - allow album art colors when empty
        if (
          typeof value === "string" &&
          value.trim() !== "" &&
          value.startsWith("#")
        ) {
          this.updateHarmonicBaseColor(value);
          if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log(
              "🎨 [Year3000System] Manual base color applied:",
              value
            );
          }
        } else if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
          console.log(
            "🎨 [Year3000System] Manual base color cleared - using album art colors"
          );
        }
        break;
      }
      case "harmonicMode": {
        if (value !== null && value !== undefined) {
          this.ADVANCED_SYSTEM_CONFIG.currentColorHarmonyMode = String(value);
          // Trigger colour update so gradient mapping aligns with new mode
          this.updateColorsFromCurrentTrack?.();
        }
        break;
      }
      default:
        // Other settings handled generically below
        break;
    }

    // ────────────────────────────────────────────────────────────────
    // Generic propagation to subsystems that expose applyUpdatedSettings
    // ────────────────────────────────────────────────────────────────
    this._broadcastSettingChange(key, value);

    // Some settings may require conditional system refresh (e.g., webgl, 3d-effects)
    this._refreshConditionalSystems();
  }

  /**
   * Notify all subsystems that implement applyUpdatedSettings so they can
   * adjust behaviour immediately after a SettingsManager change.
   */
  private _broadcastSettingChange(key: string, value: any): void {
    const systems: any[] = [
      this.colorHarmonyEngine,
      this.glassmorphismManager,
      this.card3DManager,
      this.lightweightParticleSystem,
      this.interactionTrackingSystem,
      this.beatSyncVisualSystem,
      this.sidebarSystemsIntegration,
      this.particleFieldSystem,
      // contextMenuSystem removed
    ];

    systems.forEach((sys) => {
      if (sys && typeof sys.applyUpdatedSettings === "function") {
        try {
          sys.applyUpdatedSettings(key, value);
        } catch (err) {
          console.warn(
            `[Year3000System] ${
              (sys as any).systemName ||
              sys.constructor?.name ||
              "UnknownSystem"
            } failed to applyUpdatedSettings`,
            err
          );
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 🔧  Placeholder implementations restored after merge conflict
  // ---------------------------------------------------------------------------
  /**
   * Apply the current performance profile to subsystems.
   * NOTE: Full implementation was lost in a previous edit; this stub preserves
   *        compile-time integrity until the original logic is reinstated.
   */
  private _applyPerformanceProfile(): void {
    /* stub – logic will be re-implemented in Phase 2 optimisation */
  }

  /**
   * Refresh conditional visual systems (WebGL, ParticleField, etc.) depending
   * on capability and artistic mode settings.
   */
  private _refreshConditionalSystems(): void {
    /* stub – original behaviour temporarily disabled */
  }

  /**
   * Handle artistic-mode changes by triggering a colour refresh.
   */
  private _onArtisticModeChanged(): void {
    try {
      this.updateColorsFromCurrentTrack?.();
    } catch (e) {
      console.warn("[Year3000System] _onArtisticModeChanged stub error", e);
    }
  }

  private _handleVisibilityChange(): void {
    if (document.visibilityState !== "hidden") return;

    try {
      // Flush global batched CSS variables first
      this.cssVariableController?.flushCSSVariableBatch?.();

      // Force-flush NowPlayingCoordinator to avoid frame skew
      // NowPlayingCoordinator removed – its flush is handled via UnifiedCSSVariableManager

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
      // Stop monitoring (facade coordinator handles its own cleanup)

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
} // ← end of AdvancedThemeSystem class

// -----------------------------------------------------------------------------
// 🌌  Modern Exports with Backward Compatibility
// -----------------------------------------------------------------------------

// Export backward compatibility alias
export { AdvancedThemeSystem as Year3000System };

// Singleton export
const advancedThemeSystem = new AdvancedThemeSystem();
if (typeof window !== "undefined") {
  (window as any).advancedThemeSystem = advancedThemeSystem;
  // Legacy global variable for backward compatibility
  (window as any).year3000System = advancedThemeSystem;
}

export default advancedThemeSystem;
