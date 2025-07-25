declare const Spicetify: any;

// Phase 4: Facade imports for unified system access
import { SystemCoordinator } from "@/core/integration/SystemCoordinator";
import { VisualSystemFacade } from "@/visual/integration/VisualSystemFacade";
import { NonVisualSystemFacade } from "@/core/integration/NonVisualSystemFacade";

// Color orchestration imports for Strategy pattern
import { globalColorOrchestrator } from "@/visual/integration/ColorOrchestrator";

// Event-driven integration imports
import { GlobalEventBus } from "@/core/events/EventBus";
import type { ColorHarmonizedEvent } from "@/types/colorStrategy";

// Essential configuration imports
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import type { Year3000Config } from "@/types/models";
import * as Utils from "@/utils/core/Year3000Utilities";

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
    | "lightweightParticleSystem"
    | "interactionTrackingSystem"
    | "beatSyncVisualSystem"
    | "behavioralPredictionEngine"
    | "predictiveMaterializationSystem"
    | "webGLGradientBackgroundSystem"
    | "particleFieldSystem"
    | "emergentChoreographyEngine"
    | "spotifyUIApplicationSystem"; // contextMenuSystem removed
}

export class Year3000System {
  public YEAR3000_CONFIG: Year3000Config;
  public utils: typeof Utils;
  public initialized: boolean;

  // Phase 4: Facade Coordination System (replaces direct system properties)
  public facadeCoordinator: SystemCoordinator | null = null;
  
  // Private initialization results storage
  private _initializationResults: any | null = null;

  // Phase 4: Pure Facade Access Property Getters

  // Performance Systems
  public get enhancedMasterAnimationCoordinator() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('EnhancedMasterAnimationCoordinator') || null;
  }
  public get timerConsolidationSystem() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('TimerConsolidationSystem') || null;
  }
  public get cssVariableBatcher() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('CSSVariableBatcher') || null;
  }
  public get unifiedCSSManager() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('UnifiedCSSVariableManager') || null;
  }
  public get performanceCoordinator() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('UnifiedPerformanceCoordinator') || null;
  }
  public get deviceCapabilityDetector() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('DeviceCapabilityDetector') || null;
  }
  public get performanceAnalyzer() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('PerformanceAnalyzer') || null;
  }
  public get unifiedPerformanceCoordinator() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('UnifiedPerformanceCoordinator') || null;
  }
  public get performanceCSSIntegration() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('PerformanceCSSIntegration') || null;
  }

  // Managers and Services
  public get systemHealthMonitor() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('UnifiedDebugManager') || null;
  }
  public get settingsManager() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('SettingsManager') || null;
  }
  public get colorHarmonyEngine() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('ColorHarmonyEngine') || null;
  }
  public get musicSyncService() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('MusicSyncService') || null;
  }
  public get glassmorphismManager() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('GlassmorphismManager') || null;
  }
  public get card3DManager() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('Card3DManager') || null;
  }

  // Visual Systems
  public get lightweightParticleSystem() {
    return this.facadeCoordinator?.getVisualSystem('Particle') || null;
  }
  public get interactionTrackingSystem() {
    return this.facadeCoordinator?.getVisualSystem('InteractionTracking') || null;
  }
  public get beatSyncVisualSystem() {
    return this.facadeCoordinator?.getVisualSystem('OrganicBeatSync') || null;
  }
  public get webGLGradientBackgroundSystem() {
    return this.facadeCoordinator?.getVisualSystem('WebGLBackground') || null;
  }
  public get particleFieldSystem() {
    return this.facadeCoordinator?.getVisualSystem('ParticleField') || null;
  }
  public get emergentChoreographyEngine() {
    // EmergentChoreography functionality integrated into EnhancedMasterAnimationCoordinator
    return this.enhancedMasterAnimationCoordinator || null;
  }
  public get spotifyUIApplicationSystem() {
    return this.facadeCoordinator?.getVisualSystem('SpotifyUIApplication') || null;
  }
  
  // Organic Consciousness System (Year 3000 Philosophy)
  public get organicBeatSyncConsciousness() {
    return this.facadeCoordinator?.getVisualSystem('OrganicBeatSync') || this.beatSyncVisualSystem;
  }

  // Integration Systems Getters
  public get sidebarSystemsIntegration() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('SidebarSystemsIntegration') || null;
  }
  public get unifiedSystemIntegration() {
    return this.facadeCoordinator?.getCachedNonVisualSystem('UnifiedSystemIntegration') || null;
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
   * `sn-harmonic-evolution` setting and `YEAR3000_CONFIG.harmonicEvolution`.
   * Sub-systems can read this flag instead of accessing the config directly so
   * that future scheduling logic (e.g. TimerConsolidationSystem) can rely on a
   * guaranteed field.
   */
  public allowHarmonicEvolution: boolean = true;

  /** Global switch other systems can read to know guardrails are active */
  public performanceGuardActive: boolean = false;

  constructor(
    config: Year3000Config = YEAR3000_CONFIG
  ) {
    this.YEAR3000_CONFIG = this._deepCloneConfig(config);
    if (typeof this.YEAR3000_CONFIG.init === "function") {
      this.YEAR3000_CONFIG.init();
    }
    // this.HARMONIC_MODES = harmonicModes; // Phase 4: Removed for facade pattern
    this.utils = Utils;
    this.initialized = false;
    this._systemStartTime = Date.now();

    // Phase 4: Properties now accessed via facade getters
    // All system properties are now getters that access this.facadeCoordinator
    // No more null property initialization needed
    
    this._initializationResults = null; // Private property for initialization results

    if (this.YEAR3000_CONFIG?.enableDebug) {
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
      this.queueCSSVariableUpdate("--sn-force-refresh", Date.now().toString());
    }, this.YEAR3000_CONFIG.enableDebug);

    // Keep local convenience flag in sync with config default
    this.allowHarmonicEvolution =
      this.YEAR3000_CONFIG.harmonicEvolution ?? true;

    // Apply initial performance profile based on default artistic mode
    setTimeout(() => {
      this._applyPerformanceProfile();
    }, 0);
  }

  private _deepCloneConfig(config: Year3000Config): Year3000Config {
    // From v0.9.15 we stop deep-cloning the shared configuration to avoid state
    // divergence between the global YEAR3000_CONFIG (used by the settings UI)
    // and the copy referenced by subsystems. We simply keep the original object
    // reference so that all mutations are observed everywhere.
    return config;
  }

  public updateConfiguration(key: string, value: any): void {
    if (!this.YEAR3000_CONFIG) {
      console.warn(
        "[Year3000System] Cannot update configuration - config not initialized"
      );
      return;
    }

    const keyPath = key.split(".").filter(Boolean);
    if (!keyPath.length) {
      return;
    }

    let current: any = this.YEAR3000_CONFIG;
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

    if (this.YEAR3000_CONFIG.enableDebug) {
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
    if (this.YEAR3000_CONFIG.enableDebug) {
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
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🌌 [Year3000System] Initializing Facade Coordination System...");
    }
    try {
      this.facadeCoordinator = new SystemCoordinator(
        this.YEAR3000_CONFIG,
        this.utils,
        this
      );
      await this.facadeCoordinator.initialize({
        mode: 'unified',
        enableSharedDependencies: true,
        enableCrossFacadeCommunication: true,
        enableUnifiedPerformanceMonitoring: true,
        enableResourceOptimization: true,
        performanceThresholds: {
          maxTotalMemoryMB: 100,
          maxTotalInitTime: 5000,
          maxCrossCommLatency: 50
        },
        coordinationPreferences: {
          preferSharedResources: true,
          enableEventPropagation: true,
          enableHealthCoordination: true
        }
      });
      
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Facade Coordination System initialized successfully");
      }
      
      // Phase 4: Initialize core systems through facades
      await this._initializeFacadeSystems();
      
    } catch (error) {
      console.error("🌌 [Year3000System] Failed to initialize Facade Coordination System:", error);
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
      {
        name: "PerformanceAnalyzer",
        init: () => {
          this.performanceAnalyzer = new PerformanceAnalyzer({
            enableDebug: this.YEAR3000_CONFIG.enableDebug,
          });

          // Start continuous monitoring immediately and enable guard flag
          this.performanceAnalyzer.startMonitoring();
          this.performanceGuardActive = true;
        },
      },
      {
        name: "UnifiedCSSVariableManager",
        init: () => {
          this.unifiedCSSManager = UnifiedCSSVariableManager.getInstance(
            this.YEAR3000_CONFIG
          );

          // Initialize with performance analyzer and CSS variable batcher
          if (this.performanceAnalyzer && this.cssVariableBatcher) {
            this.unifiedCSSManager.initialize(
              this.performanceAnalyzer,
              this.cssVariableBatcher
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
                this.YEAR3000_CONFIG,
                this.performanceAnalyzer
              );

            // Enable adaptive optimization
            this.performanceCoordinator.enableAdaptiveOptimization();

            if (this.YEAR3000_CONFIG.enableDebug) {
              console.log(
                "[Year3000System] UnifiedPerformanceCoordinator initialized with adaptive optimization"
              );
            }
          }
        },
      },
      // PerformanceOptimizationManager consolidated into UnifiedPerformanceCoordinator
      {
        name: "PerformanceCSSIntegration",
        init: () => {
          if (this.unifiedCSSManager && this.unifiedPerformanceCoordinator) {
            this.performanceCSSIntegration =
              PerformanceCSSIntegration.getInstance(
                this.YEAR3000_CONFIG,
                this.unifiedCSSManager,
                this.unifiedPerformanceCoordinator
              );

            if (this.YEAR3000_CONFIG.enableDebug) {
              console.log(
                "[Year3000System] PerformanceCSSIntegration initialized with CSS performance coordination"
              );
            }
          }
        },
      },
      {
        name: "SettingsManager",
        init: async () => {
          this.settingsManager = new SettingsManager();
          if (this.systemHealthMonitor) {
            this.systemHealthMonitor.registerSystem(
              "SettingsManager",
              this.settingsManager
            );
          }
        },
      },
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
              this.YEAR3000_CONFIG,
              this.performanceCoordinator
            );

          // Start the master animation loop
          this.enhancedMasterAnimationCoordinator.startMasterAnimationLoop();

          if (this.YEAR3000_CONFIG.enableDebug) {
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
            YEAR3000_CONFIG: this.YEAR3000_CONFIG,
            Year3000Utilities: this.utils,
            settingsManager: this.settingsManager,
            year3000System: this,
          });
          await this.musicSyncService.initialize();
          this.musicSyncService.subscribe(this, "Year3000System");
        },
      },
      {
        name: "ColorHarmonyEngine",
        init: async () => {
          if (!this.performanceAnalyzer || !this.settingsManager) {
            throw new Error(
              "PerformanceAnalyzer and SettingsManager are required for ColorHarmonyEngine."
            );
          }
          this.colorHarmonyEngine = new ColorHarmonyEngine(
            this.YEAR3000_CONFIG,
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
        },
      },
      {
        name: "GlassmorphismManager",
        init: async () => {
          if (!this.performanceAnalyzer || !this.settingsManager) {
            throw new Error(
              "PerformanceAnalyzer and SettingsManager are required for GlassmorphismManager."
            );
          }
          this.glassmorphismManager = new GlassmorphismManager(
            this.YEAR3000_CONFIG,
            this.utils,
            this.cssVariableBatcher,
            this.performanceAnalyzer,
            this.settingsManager
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
          if (!this.performanceAnalyzer || !this.settingsManager) {
            throw new Error(
              "PerformanceAnalyzer and SettingsManager are required for Card3DManager."
            );
          }
          this.card3DManager = new Card3DManager(
            this.performanceAnalyzer,
            this.settingsManager,
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

      if (this.YEAR3000_CONFIG.enableDebug) {
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
      if (this.YEAR3000_CONFIG.enableDebug) {
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

    if (this.YEAR3000_CONFIG.enableDebug) {
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
      throw new Error("Facade coordinator not available for essential system initialization");
    }

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🌌 [Year3000System] Initializing essential systems for degraded mode...");
    }

    try {
      // Initialize only essential systems that don't require Spicetify APIs
      const essentialSystems = [
        'PerformanceAnalyzer',
        'CSSVariableBatcher',
        'UnifiedDebugManager',
        'DeviceCapabilityDetector',
        'TimerConsolidationSystem'
      ];

      for (const systemKey of essentialSystems) {
        try {
          const system = await this.facadeCoordinator.getNonVisualSystem(systemKey as any);
          if (system && typeof system.initialize === 'function') {
            await system.initialize();
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] Essential: Initialized ${systemKey} via facade`);
            }
          }
        } catch (error) {
          console.error(`🌌 [Year3000System] Failed to initialize essential ${systemKey}:`, error);
        }
      }

      // Start performance monitoring if available
      if (this.performanceAnalyzer) {
        this.performanceAnalyzer.startMonitoring();
        this.performanceGuardActive = true;
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log("🌌 [Year3000System] Essential: Performance monitoring started");
        }
      }

    } catch (error) {
      console.error("🌌 [Year3000System] Essential facade system initialization failed:", error);
      throw error;
    }
  }

  /**
   * Initialize essential systems through facade pattern
   * Phase 4: Core system initialization via facades
   */
  private async _initializeFacadeSystems(): Promise<void> {
    if (!this.facadeCoordinator) {
      throw new Error("Facade coordinator not available for system initialization");
    }

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🌌 [Year3000System] Initializing essential systems through facades...");
    }

    try {
      // Initialize essential non-visual systems first
      const essentialNonVisualSystems = [
        'PerformanceAnalyzer',
        'CSSVariableBatcher', 
        'UnifiedDebugManager',
        'SettingsManager',
        'DeviceCapabilityDetector',
        'TimerConsolidationSystem',
        'UnifiedPerformanceCoordinator',
        'MusicSyncService',
        'ColorHarmonyEngine',
        'GlassmorphismManager',   // 🌊 Essential glassmorphism effects
        'Card3DManager'           // 🎴 Essential 3D card transformations
      ];

      for (const systemKey of essentialNonVisualSystems) {
        try {
          const system = await this.facadeCoordinator.getNonVisualSystem(systemKey as any);
          if (system && typeof system.initialize === 'function') {
            await system.initialize();
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] Initialized ${systemKey} via facade`);
            }
          }
        } catch (error) {
          console.error(`🌌 [Year3000System] Failed to initialize ${systemKey}:`, error);
        }
      }

      // Initialize ColorOrchestrator for Strategy pattern coordination
      try {
        await globalColorOrchestrator.initialize();
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log("🎨 [Year3000System] ColorOrchestrator initialized for strategy pattern coordination");
        }
      } catch (error) {
        console.error("🎨 [Year3000System] Failed to initialize ColorOrchestrator:", error);
      }

      // Start performance monitoring if available
      if (this.performanceAnalyzer) {
        this.performanceAnalyzer.startMonitoring();
        this.performanceGuardActive = true;
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log("🌌 [Year3000System] Performance monitoring started");
        }
      }

      // Initialize visual systems
      const essentialVisualSystems = [
        'Particle',
        'ParticleField', 
        'WebGLBackground',         // 🌌 Enable WebGL gradient backgrounds
        'SpotifyUIApplication',    // 🎨 Core UI color application
        'OrganicBeatSync',
        'InteractionTracking'
        // EmergentChoreography integrated into EnhancedMasterAnimationCoordinator
      ];

      for (const systemKey of essentialVisualSystems) {
        try {
          const system = this.facadeCoordinator.getVisualSystem(systemKey as any);
          if (system && typeof system.initialize === 'function') {
            await system.initialize();
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.log(`🌌 [Year3000System] Initialized visual ${systemKey} via facade`);
            }
          }
        } catch (error) {
          console.error(`🌌 [Year3000System] Failed to initialize visual ${systemKey}:`, error);
        }
      }

      // Link dependencies after initialization
      await this._linkSystemDependencies();

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("🌌 [Year3000System] Facade system initialization complete");
      }

    } catch (error) {
      console.error("🌌 [Year3000System] Facade system initialization failed:", error);
      throw error;
    }
  }

  /**
   * Link system dependencies after facade initialization
   * Phase 4: Connect systems that need cross-references
   */
  private async _linkSystemDependencies(): Promise<void> {
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🌌 [Year3000System] Linking system dependencies...");
    }

    try {
      // Link ColorHarmonyEngine to MusicSyncService
      if (this.musicSyncService && this.colorHarmonyEngine) {
        this.musicSyncService.setColorHarmonyEngine(this.colorHarmonyEngine);
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log("🌌 [Year3000System] ColorHarmonyEngine linked to MusicSyncService");
        }
      }

      // Link ColorHarmonyEngine to EnhancedMasterAnimationCoordinator (emergent functionality)
      if (this.colorHarmonyEngine && this.enhancedMasterAnimationCoordinator) {
        // Note: ColorHarmonyEngine expects EmergentChoreographyEngine interface
        // but now gets EnhancedMasterAnimationCoordinator with emergent functionality
        this.colorHarmonyEngine.setEmergentEngine(this.enhancedMasterAnimationCoordinator as any);
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log("🌌 [Year3000System] EnhancedMasterAnimationCoordinator (with emergent functionality) linked to ColorHarmonyEngine");
        }
      }

      // Register systems with health monitor if available
      if (this.systemHealthMonitor) {
        const systemsToRegister = [
          { name: 'MusicSyncService', system: this.musicSyncService },
          { name: 'ColorHarmonyEngine', system: this.colorHarmonyEngine },
          { name: 'SettingsManager', system: this.settingsManager }
        ];

        for (const { name, system } of systemsToRegister) {
          if (system) {
            this.systemHealthMonitor.registerSystem(name, system);
          }
        }

        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log("🌌 [Year3000System] Systems registered with health monitor");
        }
      }

    } catch (error) {
      console.error("🌌 [Year3000System] Failed to link system dependencies:", error);
    }
  }

  /**
   * Legacy function - removed prediction systems entirely for performance optimization
   */
  private _shouldSkipPredictionSystem(systemName: string): boolean {
    // All prediction systems have been removed for performance optimization
    return false;

    // Skip if device capability detector is not available
    if (!this.deviceCapabilityDetector) {
      return false; // Default to allowing on unknown devices
    }

    // Get device performance recommendation
    const performanceLevel =
      this.deviceCapabilityDetector.recommendPerformanceQuality();

    // Skip prediction systems on low-end devices
    if (performanceLevel === "low") {
      return true;
    }

    // Also check if user has reduced motion preferences (accessibility)
    if (
      this.deviceCapabilityDetector.deviceCapabilities?.display?.reducedMotion
    ) {
      return true;
    }

    return false;
  }

  private async _initializeVisualSystems(
    results: InitializationResults
  ): Promise<void> {
    if (
      !this.performanceAnalyzer ||
      !this.musicSyncService ||
      !this.settingsManager
    ) {
      console.error(
        "[Year3000System] Cannot initialize visual systems due to missing core dependencies (PerformanceAnalyzer, MusicSyncService, or SettingsManager)."
      );
      const visualSystems = [
        "LightweightParticleSystem",
        "InteractionTrackingSystem",
        "BeatSyncVisualSystem",
        "SidebarSystemsIntegration"
        // "EmergentChoreographyEngine", // Consolidated into EnhancedMasterAnimationCoordinator
      ];
      visualSystems.forEach((s) => results.skipped.push(s));
      return;
    }

    // Phase 4: Visual system configs commented out for facade migration
    /* const visualSystemConfigs: VisualSystemConfig[] = [
      {
        name: "LightweightParticleSystem",
        Class: LightweightParticleSystem,
        property: "lightweightParticleSystem",
      },
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
        if (this.YEAR3000_CONFIG.enableDebug) {
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
            this.YEAR3000_CONFIG,
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
          if (this.YEAR3000_CONFIG.enableDebug) {
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
        this.YEAR3000_CONFIG
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

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "🔧 [Year3000System] Sidebar systems integration initialized with bilateral consciousness"
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
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "🔗 [Year3000System] EnhancedMasterAnimationCoordinator (emergent functionality) linked to ColorHarmonyEngine."
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
    if (this.YEAR3000_CONFIG.enableDebug) {
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

  public async applyInitialSettings(): Promise<void> {
    if (!this.settingsManager) {
      console.warn(
        "[Year3000System] SettingsManager not ready, cannot apply initial settings."
      );
      return;
    }
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "🎨 [Year3000System] Inside applyInitialSettings. SettingsManager valid:",
        !!this.settingsManager
      );
    }
    try {
      console.log(
        "🎨 [Year3000System] applyInitialSettings: Getting initial settings..."
      );
      const accent = this.settingsManager.get("catppuccin-accentColor");
      const gradient = this.settingsManager.get("sn-gradient-intensity");
      const stars = this.settingsManager.get("sn-star-density");

      // NEW – harmonic settings
      const intensityRaw = this.settingsManager.get("sn-harmonic-intensity");
      const evolutionRaw = this.settingsManager.get("sn-harmonic-evolution");

      // NEW – harmonic mode selection
      const harmonicModeKey = this.settingsManager.get(
        "sn-current-harmonic-mode"
      );
      if (harmonicModeKey) {
        this.YEAR3000_CONFIG.currentHarmonicMode = String(harmonicModeKey);
      }

      console.log(
        `🎨 [Year3000System] applyInitialSettings: Accent=${accent}, Gradient=${gradient}, Stars=${stars}`
      );
      if ((accent as string) !== "dynamic") {
        await this._applyCatppuccinAccent(accent);
      } else if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "🎨 [Year3000System] Skipping static accent application because 'dynamic' accent is selected."
        );
      }
      await this._applyStarryNightSettings(
        gradient as "disabled" | "minimal" | "balanced" | "intense",
        stars as "disabled" | "minimal" | "balanced" | "intense"
      );

      // Apply harmonic intensity once the engine is ready
      const intensity = parseFloat(intensityRaw as string);
      if (!Number.isNaN(intensity)) {
        if (this.colorHarmonyEngine) {
          (this.colorHarmonyEngine as any).setIntensity?.(intensity);
        }
        this.YEAR3000_CONFIG.harmonicIntensity = intensity;
      }

      // Persist evolution flag locally
      const evolutionEnabled = evolutionRaw === "true";
      this.allowHarmonicEvolution = evolutionEnabled;
      this.YEAR3000_CONFIG.harmonicEvolution = evolutionEnabled;

      console.log(
        "🎨 [Year3000System] applyInitialSettings: Successfully applied initial settings."
      );
    } catch (error) {
      console.error("[Year3000System] Error applying initial settings:", error);
    }
  }

  private async _applyCatppuccinAccent(selectedAccent: string): Promise<void> {
    if (selectedAccent === "dynamic") {
      if (this.YEAR3000_CONFIG.enableDebug) {
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

    this.cssVariableBatcher?.queueCSSVariableUpdate(
      "--spice-text",
      `var(--spice-${accent})`
    );
    this.cssVariableBatcher?.queueCSSVariableUpdate(
      "--spice-button-active",
      `var(--spice-${accent})`
    );
    this.cssVariableBatcher?.queueCSSVariableUpdate(
      "--spice-equalizer",
      equalizerUrl
    );
    this.cssVariableBatcher?.flushCSSVariableBatch();
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

    this._applyHarmonizedColorsToCss(harmonizedColors);
  }

  /**
   * Handle colors/harmonized event from ColorOrchestrator (Event-driven architecture)
   */
  private handleColorHarmonizedEvent(event: ColorHarmonizedEvent): void {
    if (event.type !== 'colors/harmonized') return;
    
    const { processedColors, cssVariables, metadata } = event.payload;
    
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🎨 [Year3000System] Received harmonized colors via event-driven pattern", {
        strategy: metadata.strategy,
        processingTime: metadata.processingTime,
        colorsCount: Object.keys(processedColors).length,
        cssVariablesCount: Object.keys(cssVariables).length
      });
    }
    
    try {
      // Apply harmonized colors using the new event-driven flow
      this._applyHarmonizedColorsToCss(processedColors);
      
      // Apply CSS variables directly if provided (optimization)
      if (cssVariables && Object.keys(cssVariables).length > 0) {
        this._applyCSSVariables(cssVariables);
      }
      
    } catch (error) {
      console.error("[Year3000System] Failed to apply harmonized colors from event:", error);
      
      // Fallback to basic color application
      this._applyHarmonizedColorsToCss(processedColors);
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
      
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("🎨 [Year3000System] Applied CSS variables directly", {
          variablesCount: Object.keys(cssVariables).length,
          variables: Object.keys(cssVariables)
        });
      }
      
    } catch (error) {
      console.error("[Year3000System] Failed to apply CSS variables:", error);
    }
  }

  // =============================================
  // 🎨 INTERNAL – APPLY COLOR MAP TO CSS VARIABLES
  // =============================================
  private _applyHarmonizedColorsToCss(
    colors: { [key: string]: string } = {}
  ): void {
    if (!colors || Object.keys(colors).length === 0) {
      colors = { VIBRANT: "#a6adc8" }; // neutral fallback accent
    }

    // Heuristic mapping – favour extractor roles first, then fallbacks
    const primaryHex =
      colors["VIBRANT"] ||
      colors["PROMINENT"] ||
      colors["PRIMARY"] ||
      Object.values(colors)[0];
    const secondaryHex =
      colors["DARK_VIBRANT"] ||
      colors["DESATURATED"] ||
      colors["SECONDARY"] ||
      primaryHex;
    const accentHex =
      colors["VIBRANT_NON_ALARMING"] || colors["LIGHT_VIBRANT"] || primaryHex;

    const queueUpdate = (prop: string, value: string) => {
      if (this.cssVariableBatcher) {
        this.cssVariableBatcher.queueCSSVariableUpdate(prop, value);
      } else {
        document.documentElement.style.setProperty(prop, value);
      }
    };

    // Phase 5 – Legacy StarryNight gradient tokens have been removed. Only
    // canonical `--sn-accent-*` variables are now emitted. Hex gradients for
    // primary/secondary are no longer required by any visual system.

    // Mirror accent into core Spicetify vars (buttons, sliders, etc.)
    if (accentHex) {
      queueUpdate("--spice-accent", accentHex);
      queueUpdate("--spice-button", accentHex);
      queueUpdate("--spice-button-active", accentHex);
      if (primaryHex) queueUpdate("--spice-player", primaryHex);
    }
    // Preserve text colour; do NOT overwrite --spice-main (maintains Catppuccin readability)

    // RGB variants for transparency support
    const addRgb = (prop: string, hex: string | undefined) => {
      if (!hex) return;
      const rgb = this.utils.hexToRgb(hex);
      if (rgb) {
        queueUpdate(prop, `${rgb.r},${rgb.g},${rgb.b}`);
      }
    };

    // Phase 1 — Canonical accent token (single source-of-truth)
    if (accentHex) {
      queueUpdate('--sn-canonical-accent-hex', accentHex);
    }
    addRgb('--sn-canonical-accent-rgb', accentHex);

    // Generate RGB versions of all spice variables for SCSS compatibility
    addRgb("--spice-rgb-accent", accentHex);
    addRgb("--spice-rgb-button", accentHex);

    // Explicit RGB for player colour so SCSS gradients have guaranteed source
    addRgb("--spice-rgb-player", primaryHex);

    // Generate RGB versions of existing spice variables by reading their current hex values
    const root = this.utils.getRootStyle();
    if (root) {
      const computedStyle = getComputedStyle(root);

      // Helper to safely get and convert existing spice variables to RGB
      const addSpiceRgb = (
        rgbProp: string,
        hexProp: string,
        fallbackHex: string
      ) => {
        const hexValue =
          computedStyle.getPropertyValue(hexProp).trim() || fallbackHex;
        addRgb(rgbProp, hexValue);
      };

      // Add RGB versions of all spice variables that SCSS files expect
      addSpiceRgb("--spice-rgb-main", "--spice-main", "#cdd6f4");
      addSpiceRgb("--spice-rgb-base", "--spice-base", "#1e1e2e");
      addSpiceRgb("--spice-rgb-player", "--spice-player", "#181825");
      addSpiceRgb("--spice-rgb-sidebar", "--spice-sidebar", "#313244");
      addSpiceRgb("--spice-rgb-surface0", "--spice-surface0", "#313244");
      addSpiceRgb("--spice-rgb-surface1", "--spice-surface1", "#45475a");
      addSpiceRgb("--spice-rgb-text", "--spice-text", "#cdd6f4");
    }

    // Flush batched updates immediately for visual responsiveness
    if (this.cssVariableBatcher) {
      this.cssVariableBatcher.flushCSSVariableBatch();
    }

    // Notify glassmorphism manager so its colours stay in sync
    try {
      if (this.glassmorphismManager && primaryHex && secondaryHex) {
        this.glassmorphismManager.updateGlassColors(primaryHex, secondaryHex);
      }
    } catch (e) {
      console.warn(
        "[Year3000System] GlassmorphismManager colour update failed:",
        e
      );
    }

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🎨 [Year3000System] Applied harmonized colours", {
        primaryHex,
        secondaryHex,
        accentHex,
      });
    }
  }

  // =============================================
  // 🆕 PUBLIC WRAPPER – UNIFIED CSS VARIABLE BATCH API
  // =============================================
  /**
   * Queue a CSS variable update through the shared CSSVariableBatcher. Falls
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
    } else if (this.cssVariableBatcher) {
      // Fallback to CSS variable batcher
      this.cssVariableBatcher.queueCSSVariableUpdate(
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
    if (this.colorHarmonyEngine && this.cssVariableBatcher) {
      const rgb = this.utils.hexToRgb(hexColor);
      if (rgb) {
        const variations =
          this.colorHarmonyEngine.generateHarmonicVariations(rgb);
        this.cssVariableBatcher.queueCSSVariableUpdate(
          "--sn-harmonic-base-dark-vibrant",
          variations.darkVibrantHex
        );
        this.cssVariableBatcher.queueCSSVariableUpdate(
          "--sn-harmonic-base-light-vibrant",
          variations.lightVibrantHex
        );
        this.cssVariableBatcher.flushCSSVariableBatch();
      }
    }
  }

  public setupMusicAnalysisAndColorExtraction(): void {
    if (!this.musicSyncService) {
      console.error(
        "[Year3000System] MusicSyncService is not available to set up song change handler."
      );
      return;
    }

    // Check if Spicetify.Player is available (might not be in degraded mode)
    if (!(window as any).Spicetify?.Player) {
      console.warn(
        "[Year3000System] Spicetify.Player not available - music analysis disabled"
      );
      return;
    }

    // Set up event-driven color harmonization (NEW ARCHITECTURE)
    try {
      GlobalEventBus.subscribe('colors/harmonized', (event: any) => {
        this.handleColorHarmonizedEvent(event);
      });
      
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("🎨 [Year3000System] Subscribed to colors/harmonized events for event-driven color application");
      }
    } catch (error) {
      console.error("[Year3000System] Failed to subscribe to colors/harmonized events:", error);
    }

    const processSongUpdate = async () => {
      if (this.musicSyncService) {
        await this.musicSyncService.processSongUpdate();
      }
    };

    // Store the handler so it can be removed later
    this._songChangeHandler = processSongUpdate;

    try {
      (window as any).Spicetify.Player.addEventListener(
        "songchange",
        this._songChangeHandler
      );

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "[Year3000System] Music analysis and color extraction set up successfully"
        );
      }

      // Initial run for the currently playing track
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

    // 1) Try unified system registry first
    if (this.unifiedSystemIntegration) {
      const unifiedSystem = this.unifiedSystemIntegration.getSystem(name);
      if (unifiedSystem) return unifiedSystem as T;
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
   * Get the unified system registry for direct access
   */
  public getUnifiedSystemRegistry() {
    return this.unifiedSystemIntegration?.getRegistry();
  }

  /**
   * Get health status of all unified systems
   */
  public async getUnifiedSystemHealthStatus() {
    return this.unifiedSystemIntegration?.getHealthStatus();
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
        name: "LightweightParticleSystem",
        system: this.lightweightParticleSystem,
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

        if (this.YEAR3000_CONFIG.enableDebug) {
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
        name: "LightweightParticleSystem",
        system: this.lightweightParticleSystem,
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

          if (registered && this.YEAR3000_CONFIG.enableDebug) {
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

    if (this.YEAR3000_CONFIG.enableDebug) {
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
    if (this.YEAR3000_CONFIG.enableDebug) {
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
      {
        name: "PerformanceAnalyzer",
        init: () => {
          this.performanceAnalyzer = new PerformanceAnalyzer({
            enableDebug: this.YEAR3000_CONFIG.enableDebug,
          });
        },
      },
      {
        name: "EnhancedMasterAnimationCoordinator",
        init: () => {
          if (!this.performanceAnalyzer) {
            throw new Error(
              "PerformanceAnalyzer is required for EnhancedMasterAnimationCoordinator."
            );
          }
          // In degraded mode, we don't have UnifiedPerformanceCoordinator, so pass undefined
          this.enhancedMasterAnimationCoordinator =
            EnhancedMasterAnimationCoordinator.getInstance(
              this.YEAR3000_CONFIG
            );
          this.enhancedMasterAnimationCoordinator.startMasterAnimationLoop();
        },
      },
    ]; */

    // Phase 4: Initialize facade coordination system for degraded mode
    try {
      this.facadeCoordinator = new SystemCoordinator(
        this.YEAR3000_CONFIG,
        this.utils,
        this
      );
      await this.facadeCoordinator.initialize({
        mode: 'performance-optimized',
        enableSharedDependencies: true,
        enableCrossFacadeCommunication: false,
        enableUnifiedPerformanceMonitoring: true,
        enableResourceOptimization: true,
        performanceThresholds: {
          maxTotalMemoryMB: 50,
          maxTotalInitTime: 3000,
          maxCrossCommLatency: 100
        },
        coordinationPreferences: {
          preferSharedResources: true,
          enableEventPropagation: false,
          enableHealthCoordination: true
        }
      });
      
      // Initialize essential systems only for degraded mode
      await this._initializeEssentialFacadeSystems();
      
      initializationResults.success.push("FacadeCoordinationSystem");
    } catch (error) {
      console.error("🌌 [Year3000System] Failed to initialize degraded facade system:", error);
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

    if (this.YEAR3000_CONFIG.enableDebug) {
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
    if (this.YEAR3000_CONFIG.enableDebug) {
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
        if (this.YEAR3000_CONFIG.enableDebug) {
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
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "🌟 [Year3000System] Progressive enhancement monitoring stopped (timeout)"
          );
        }
        clearInterval(enhancementInterval);
      }
    }, 2000); // Check every 2 seconds
  }

  public async upgradeToFullMode(): Promise<void> {
    if (this.YEAR3000_CONFIG.enableDebug) {
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

      // Phase 4: SettingsManager managed by facade
      try {
        // this.settingsManager = new SettingsManager(); // Managed by facade
        if (this.systemHealthMonitor) {
          this.systemHealthMonitor.registerSystem(
            "SettingsManager",
            this.settingsManager
          );
        }
        upgradeResults.success.push("SettingsManager");
      } catch (error) {
        upgradeResults.failed.push("SettingsManager");
        console.error(
          `[Year3000System] Failed to upgrade SettingsManager:`,
          error
        );
      }

      // Phase 4: MusicSyncService managed by facade
      if (this.settingsManager) {
        try {
          /* this.musicSyncService = new MusicSyncService({
            YEAR3000_CONFIG: this.YEAR3000_CONFIG,
            Year3000Utilities: this.utils,
            settingsManager: this.settingsManager,
            year3000System: this,
          });
          await this.musicSyncService.initialize();
          this.musicSyncService.subscribe(this, "Year3000System");
          upgradeResults.success.push("MusicSyncService"); */
        } catch (error) {
          /* upgradeResults.failed.push("MusicSyncService");
          console.error(
            `[Year3000System] Failed to upgrade MusicSyncService:`,
            error
          ); */
        }
      }

      // Initialize remaining systems...
      if (this.performanceAnalyzer && this.settingsManager) {
        // Phase 4: ColorHarmonyEngine managed by facade
        try {
          /* this.colorHarmonyEngine = new ColorHarmonyEngine(
            this.YEAR3000_CONFIG,
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
      if (this.musicSyncService && this.availableAPIs.player) {
        this.setupMusicAnalysisAndColorExtraction();
      }

      // Apply initial settings if available
      if (this.settingsManager) {
        await this.applyInitialSettings();
      }

      if (this.YEAR3000_CONFIG.enableDebug) {
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

    // Guard when settingsManager or subsystems are not ready yet
    if (!key) return;

    switch (key) {
      case 'artisticMode': {
        try {
          if (
            typeof (this.YEAR3000_CONFIG as any).safeSetArtisticMode ===
            "function"
          ) {
            (this.YEAR3000_CONFIG as any).safeSetArtisticMode(value);
          }
        } catch (e) {
          console.warn("[Year3000System] Failed to apply artistic mode", e);
        }
        break;
      }
      case 'harmonicIntensity': {
        // Expect numeric string or number 0-1
        const num = parseFloat(value);
        if (!Number.isNaN(num)) {
          this.YEAR3000_CONFIG.harmonicIntensity = num;
          if (this.colorHarmonyEngine) {
            (this.colorHarmonyEngine as any).setIntensity?.(num);
            // Re-blend colours
            this.updateColorsFromCurrentTrack?.();
          }
        }
        break;
      }
      case 'harmonicEvolution': {
        const enabled = value === "true" || value === true;
        this.allowHarmonicEvolution = enabled;
        this.YEAR3000_CONFIG.harmonicEvolution = enabled;
        break;
      }
      case 'manualBaseColor': {
        if (typeof value === "string" && value.startsWith("#")) {
          this.updateHarmonicBaseColor(value);
        }
        break;
      }
      case 'harmonicMode': {
        if (value !== null && value !== undefined) {
          this.YEAR3000_CONFIG.currentHarmonicMode = String(value);
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
      this.cssVariableBatcher?.flushCSSVariableBatch?.();

      // Force-flush NowPlayingCoordinator to avoid frame skew
      // NowPlayingCoordinator removed – its flush is handled via CSSVariableBatcher

      // Force-flush RightSidebarCoordinator if present
      try {
        // getSidebarPerformanceCoordinator()?.forceFlush(); // Phase 4: Managed by facade
      } catch {}

      if (this.YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "🌟 [Year3000System] Visibility hidden → forced flush of pending style updates"
        );
      }
    } catch (e) {
      if (this.YEAR3000_CONFIG?.enableDebug) {
        console.warn("[Year3000System] VisibilityChange flush error", e);
      }
    }
  }
} // ← end of Year3000System class

// -----------------------------------------------------------------------------
// 🌌  Singleton export
// -----------------------------------------------------------------------------
const year3000System = new Year3000System();
if (typeof window !== "undefined") {
  (window as any).year3000System = year3000System;
}
export default year3000System;
