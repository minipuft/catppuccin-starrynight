/**
 * SemanticColorManager - Manages Spicetify semantic color tokens for Year 3000 System
 * Provides a bridge between Spicetify's semantic color system and our theming architecture
 */

// Import theme-specific Spicetify type extensions
/// <reference path="../../types/spicetify-extensions.d.ts" />
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";

// Runtime utilities for safe Spicetify access
function safeGetSpicetify(): typeof Spicetify | null {
  return (typeof window !== 'undefined' && window.Spicetify) ? window.Spicetify : null;
}

function isSpicetifyPlatformAvailable(): boolean {
  const spicetify = safeGetSpicetify();
  return !!(spicetify?.Platform);
}
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { IManagedSystem, HealthCheckResult } from "@/types/systems";
import * as Utils from "@/utils/core/ThemeUtilities";

export interface SemanticColorConfig {
  enableDebug?: boolean;
  fallbackToSpiceColors?: boolean;
  cacheDuration?: number;
}

export interface SemanticColorMapping {
  semanticColor: Spicetify.SemanticColor;
  cssVariable: string;
  fallbackColor: string;
  description: string;
}

export class SemanticColorManager implements IManagedSystem {
  private config: SemanticColorConfig;
  private cssController!: OptimizedCSSVariableManager;
  private colorCache: Map<Spicetify.SemanticColor, string> = new Map();
  private lastCacheUpdate: number = 0;
  
  // IManagedSystem interface
  public initialized: boolean = false;
  
  // Event tracking for proper system integration
  private eventSubscriptionIds: string[] = [];
  private lastColorUpdate: number = 0;
  private colorUpdateCount: number = 0;

  // Semantic color mappings to our CSS variables
  private static readonly SEMANTIC_MAPPINGS: SemanticColorMapping[] = [
    // Text colors (Catppuccin Macchiato)
    { semanticColor: "textBase", cssVariable: "--spice-text", fallbackColor: "#cad3f5", description: "Primary text color" },
    { semanticColor: "textSubdued", cssVariable: "--spice-subtext", fallbackColor: "#a5adcb", description: "Secondary text color" },
    { semanticColor: "textBrightAccent", cssVariable: "--spice-accent", fallbackColor: "#c6a0f6", description: "Accent text color" },
    { semanticColor: "textNegative", cssVariable: "--spice-red", fallbackColor: "#ed8796", description: "Error text color" },
    { semanticColor: "textWarning", cssVariable: "--spice-yellow", fallbackColor: "#eed49f", description: "Warning text color" },
    { semanticColor: "textPositive", cssVariable: "--spice-green", fallbackColor: "#a6da95", description: "Success text color" },
    { semanticColor: "textAnnouncement", cssVariable: "--spice-blue", fallbackColor: "#8aadf4", description: "Info text color" },

    // Essential colors (for icons, controls) - Catppuccin Macchiato
    { semanticColor: "essentialBase", cssVariable: "--spice-button", fallbackColor: "#cad3f5", description: "Primary button color" },
    { semanticColor: "essentialSubdued", cssVariable: "--spice-button-disabled", fallbackColor: "#6e738d", description: "Disabled button color" },
    { semanticColor: "essentialBrightAccent", cssVariable: "--spice-button-active", fallbackColor: "#c6a0f6", description: "Active button color" },
    { semanticColor: "essentialNegative", cssVariable: "--spice-notification-error", fallbackColor: "#ed8796", description: "Error button color" },
    { semanticColor: "essentialWarning", cssVariable: "--spice-notification-warning", fallbackColor: "#eed49f", description: "Warning button color" },
    { semanticColor: "essentialPositive", cssVariable: "--spice-notification-success", fallbackColor: "#a6da95", description: "Success button color" },

    // Background colors - Catppuccin Macchiato
    { semanticColor: "backgroundBase", cssVariable: "--spice-main", fallbackColor: "#24273a", description: "Main background color" },
    { semanticColor: "backgroundHighlight", cssVariable: "--spice-highlight", fallbackColor: "#363a4f", description: "Highlight background color" },
    { semanticColor: "backgroundPress", cssVariable: "--spice-press", fallbackColor: "#494d64", description: "Press state background color" },
    { semanticColor: "backgroundElevatedBase", cssVariable: "--spice-card", fallbackColor: "#1e2030", description: "Card background color" },
    { semanticColor: "backgroundElevatedHighlight", cssVariable: "--spice-card-highlight", fallbackColor: "#363a4f", description: "Card highlight background" },
    { semanticColor: "backgroundTintedBase", cssVariable: "--spice-sidebar", fallbackColor: "#363a4f", description: "Sidebar background color" },
    { semanticColor: "backgroundTintedHighlight", cssVariable: "--spice-sidebar-highlight", fallbackColor: "#494d64", description: "Sidebar highlight background" },

    // Decorative colors - Catppuccin Macchiato
    { semanticColor: "decorativeBase", cssVariable: "--spice-decorative", fallbackColor: "#cad3f5", description: "Decorative element color" },
    { semanticColor: "decorativeSubdued", cssVariable: "--spice-decorative-subdued", fallbackColor: "#939ab7", description: "Subdued decorative color" },
  ];

  constructor(config: SemanticColorConfig = {}) {
    this.config = {
      enableDebug: false,
      fallbackToSpiceColors: true,
      cacheDuration: 5000, // 5 seconds
      ...config
    };
  }

  public async initialize(cssController?: OptimizedCSSVariableManager): Promise<void> {
    if (this.initialized) {
      console.warn("[SemanticColorManager] Already initialized, skipping");
      return;
    }

    try {
      this.cssController = cssController || getGlobalOptimizedCSSController();
      
      // Subscribe to UnifiedEventBus events for system integration
      this.setupEventSubscriptions();
      
      this.initialized = true;
      this.lastColorUpdate = Date.now();

      if (this.config.enableDebug) {
        console.log("🎨 [SemanticColorManager] Initialized as IManagedSystem with", {
          mappings: SemanticColorManager.SEMANTIC_MAPPINGS.length,
          batcherAvailable: !!this.cssController,
          spicetifyAvailable: this.isSpicetifyAvailable(),
          eventSubscriptions: this.eventSubscriptionIds.length
        });
      }
      
      // Emit system initialization event
      unifiedEventBus.emitSync('system:initialized', {
        systemName: 'SemanticColorManager',
        timestamp: Date.now(),
        metadata: {
          mappings: SemanticColorManager.SEMANTIC_MAPPINGS.length,
          spicetifyAvailable: this.isSpicetifyAvailable() ? 1 : 0
        }
      });
      
    } catch (error) {
      console.error("[SemanticColorManager] Initialization failed:", error);
      
      unifiedEventBus.emitSync('system:error', {
        systemName: 'SemanticColorManager',
        error: error instanceof Error ? error.message : 'Initialization failed',
        severity: 'critical',
        timestamp: Date.now()
      });
      
      throw error;
    }
  }

  public async updateSemanticColors(): Promise<void> {
    if (!this.initialized) {
      console.warn("[SemanticColorManager] Not initialized, cannot update colors");
      return;
    }

    const now = Date.now();
    if (now - this.lastCacheUpdate < (this.config.cacheDuration || 5000)) {
      return; // Skip update if cache is still valid
    }

    // 🎨 CRITICAL: Log semantic color update process
    console.log("🎨 [SemanticColorManager] Starting semantic color update...");

    try {
      const colorUpdateLog: Record<string, any> = {};
      const semanticColorUpdates: Record<string, string> = {};
      const rgbColorUpdates: Record<string, string> = {};

      // Collect all color updates first for batching
      for (const mapping of SemanticColorManager.SEMANTIC_MAPPINGS) {
        const color = await this.getSemanticColor(mapping.semanticColor);
        
        // 🎨 CRITICAL: Log each color being applied
        colorUpdateLog[mapping.cssVariable] = {
          semanticColor: mapping.semanticColor,
          retrievedColor: color,
          fallbackColor: mapping.fallbackColor,
          description: mapping.description
        };

        semanticColorUpdates[mapping.cssVariable] = color;
        
        // Also create RGB variant for transparency support
        const rgbColor = Utils.hexToRgb(color);
        if (rgbColor) {
          const rgbVariable = mapping.cssVariable.replace('--spice-', '--spice-rgb-');
          rgbColorUpdates[rgbVariable] = `${rgbColor.r},${rgbColor.g},${rgbColor.b}`;
          colorUpdateLog[rgbVariable] = `${rgbColor.r},${rgbColor.g},${rgbColor.b}`;
        }
      }

      // Apply all semantic colors in batch with high priority for system colors
      this.cssController.batchSetVariables(
        "SemanticColorManager",
        semanticColorUpdates,
        "high", // High priority for semantic color system
        "semantic-color-update"
      );

      // Apply all RGB variants in batch with high priority
      this.cssController.batchSetVariables(
        "SemanticColorManager",
        rgbColorUpdates,
        "high", // High priority for RGB color variants
        "semantic-rgb-update"
      );

      // 🎨 CRITICAL: Log all color updates
      console.log("🎨 [SemanticColorManager] Color update complete:", colorUpdateLog);

      this.lastCacheUpdate = now;

      if (this.config.enableDebug) {
        console.log("🎨 [SemanticColorManager] Updated all semantic colors");
      }
    } catch (error) {
      console.error("[SemanticColorManager] Failed to update semantic colors:", error);
    }
  }

  public async getSemanticColor(semanticColor: Spicetify.SemanticColor): Promise<string> {
    // Check cache first
    const cached = this.colorCache.get(semanticColor);
    if (cached && (Date.now() - this.lastCacheUpdate) < (this.config.cacheDuration || 5000)) {
      return cached;
    }

    let color: string;

    try {
      // Try to get color from Spicetify's semantic color system
      const spicetify = safeGetSpicetify();
      if (this.isSpicetifyAvailable() && spicetify?.Platform?.getSemanticColors) {
        const semanticColors = await spicetify.Platform.getSemanticColors();
        color = semanticColors[semanticColor];
        
        // 🎨 CRITICAL: Log what Spicetify returns
        console.log(`🎨 [SemanticColorManager] Spicetify returned for ${semanticColor}:`, {
          rawValue: color,
          type: typeof color,
          isWhite: color === '#ffffff' || color === '#fff' || color === 'white',
          isInvalid: !color || color === 'undefined' || color === 'null'
        });
      } else {
        // Fallback to mapping logic
        console.warn(`🎨 [SemanticColorManager] Spicetify not available, using fallback for ${semanticColor}`);
        color = this.getFallbackColor(semanticColor);
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(`[SemanticColorManager] Failed to get semantic color ${semanticColor}:`, error);
      }
      color = this.getFallbackColor(semanticColor);
    }

    // 🔧 CRITICAL FIX: Add color validation to prevent white/invalid colors
    color = this.validateColor(color, semanticColor);

    // Cache the result
    this.colorCache.set(semanticColor, color);
    return color;
  }

  /**
   * Validate color to prevent white (#ffffff) or invalid colors from being applied
   */
  private validateColor(color: string, semanticColor: Spicetify.SemanticColor): string {
    // Normalize color format
    const normalizedColor = color?.toLowerCase().trim();
    
    // Check for invalid/problematic colors
    const invalidColors = [
      '#ffffff', '#fff', 'white',
      '#000000', '#000', 'black', 
      '', 'undefined', 'null', 'transparent'
    ];
    
    if (!normalizedColor || invalidColors.includes(normalizedColor)) {
      const fallbackColor = this.getFallbackColor(semanticColor);
      
      if (this.config.enableDebug) {
        console.warn(`🔧 [SemanticColorManager] Invalid color "${color}" for ${semanticColor}, using fallback: ${fallbackColor}`);
      }
      
      return fallbackColor;
    }
    
    // Additional validation: ensure it's a proper hex color
    if (!normalizedColor.match(/^#[0-9a-f]{6}$/i) && !normalizedColor.match(/^#[0-9a-f]{3}$/i)) {
      const fallbackColor = this.getFallbackColor(semanticColor);
      
      if (this.config.enableDebug) {
        console.warn(`🔧 [SemanticColorManager] Malformed color "${color}" for ${semanticColor}, using fallback: ${fallbackColor}`);
      }
      
      return fallbackColor;
    }
    
    return color;
  }

  private getFallbackColor(semanticColor: Spicetify.SemanticColor): string {
    const mapping = SemanticColorManager.SEMANTIC_MAPPINGS.find(m => m.semanticColor === semanticColor);
    if (mapping) {
      return mapping.fallbackColor;
    }

    // Ultimate fallback based on semantic color category (Catppuccin Macchiato)
    if (semanticColor.startsWith('text')) {
      return '#cad3f5'; // Catppuccin Macchiato text
    } else if (semanticColor.startsWith('background')) {
      return '#24273a'; // Catppuccin Macchiato base
    } else if (semanticColor.startsWith('essential')) {
      return '#c6a0f6'; // Catppuccin Macchiato mauve
    } else if (semanticColor.startsWith('decorative')) {
      return '#939ab7'; // Catppuccin Macchiato overlay2
    }

    return '#cad3f5'; // Default fallback
  }

  private applyColorToCSS(
    cssVariable: string, 
    color: string, 
    priority: "low" | "normal" | "high" | "critical" = "normal",
    source: string = "semantic-color-manager"
  ): void {
    // Use coordination-first approach with proper priority handling
    this.cssController.setVariable(
      "SemanticColorManager",
      cssVariable,
      color,
      priority,
      source
    );
  }

  private isSpicetifyAvailable(): boolean {
    return isSpicetifyPlatformAvailable();
  }

  public flushUpdates(): void {
    // Flush through optimized controller for proper batching
    if (this.cssController) {
      this.cssController.flushUpdates();
    }
  }

  public clearCache(): void {
    this.colorCache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Update Spicetify variables directly with OKLAB-processed album colors
   * This bypasses CSS fallback chains and prevents Spotify overrides
   * 
   * Enhanced for comprehensive override protection across all visual systems
   */
  public updateWithAlbumColors(oklabColors: { [key: string]: string }): void {
    if (!this.initialized) {
      console.warn("[SemanticColorManager] Not initialized, cannot update with album colors");
      return;
    }

    try {
      // Extract key colors from OKLAB processing result
      const primaryColor = oklabColors['OKLAB_PRIMARY'] || oklabColors['VIBRANT'] || oklabColors['PRIMARY'];
      const accentColor = oklabColors['OKLAB_ACCENT'] || oklabColors['LIGHT_VIBRANT'] || oklabColors['SECONDARY'];
      const shadowColor = oklabColors['OKLAB_SHADOW'] || oklabColors['DARK_VIBRANT'] || oklabColors['DARK'];
      const highlightColor = oklabColors['OKLAB_HIGHLIGHT'] || oklabColors['VIBRANT_NON_ALARMING'] || oklabColors['LIGHT'];

      if (!primaryColor) {
        console.warn("[SemanticColorManager] No primary color found in OKLAB result, skipping update");
        return;
      }

      // Generate intelligent color distribution for comprehensive coverage
      const colorDistribution = this.generateIntelligentColorDistribution(
        primaryColor, accentColor, shadowColor, highlightColor
      );

      // Convert all colors to RGB for CSS variables
      const rgbDistribution = this.convertColorsToRgb(colorDistribution);

      // === COMPREHENSIVE SPICETIFY VARIABLE UPDATES ===
      
      // Core accent and surface colors (original implementation)
      const coreSpicetifyUpdates = {
        '--spice-accent': colorDistribution.primary,
        '--spice-rgb-accent': rgbDistribution.primary,
        '--spice-surface1': colorDistribution.surface1,
        '--spice-rgb-surface1': rgbDistribution.surface1,
        '--spice-button-active': colorDistribution.primary,
        '--spice-rgb-button-active': rgbDistribution.primary,
        '--spice-highlight': colorDistribution.highlight,
        '--spice-rgb-highlight': rgbDistribution.highlight,
        '--spice-press': colorDistribution.shadow,
        '--spice-rgb-press': rgbDistribution.shadow,
      };

      // Critical missing variables (HIGH PRIORITY from analysis)
      const criticalSpicetifyUpdates = {
        '--spice-surface0': colorDistribution.surface0,
        '--spice-rgb-surface0': rgbDistribution.surface0,
        '--spice-surface2': colorDistribution.surface2,
        '--spice-rgb-surface2': rgbDistribution.surface2,
        '--spice-base': colorDistribution.base,
        '--spice-rgb-base': rgbDistribution.base,
      };

      // Core layout variables (CRITICAL PRIORITY - Background, Text, Layout)
      const coreLayoutSpicetifyUpdates = {
        '--spice-main': colorDistribution.base,
        '--spice-rgb-main': rgbDistribution.base,
        '--spice-main-elevated': colorDistribution.surface0,
        '--spice-rgb-main-elevated': rgbDistribution.surface0,
        '--spice-sidebar': colorDistribution.surface1,
        '--spice-rgb-sidebar': rgbDistribution.surface1,
        '--spice-text': this.generateTextColor(colorDistribution.base),
        '--spice-rgb-text': this.hexToRgb(this.generateTextColor(colorDistribution.base)),
        '--spice-subtext': this.generateSubtextColor(colorDistribution.base),
        '--spice-rgb-subtext': this.hexToRgb(this.generateSubtextColor(colorDistribution.base)),
        '--spice-highlight-elevated': colorDistribution.surface2,
        '--spice-rgb-highlight-elevated': rgbDistribution.surface2,
        
        // Missing Catppuccin overlay system (CRITICAL for background hierarchy)
        '--spice-overlay0': this.generateOverlayColor(colorDistribution.base, 0.04),
        '--spice-rgb-overlay0': this.hexToRgb(this.generateOverlayColor(colorDistribution.base, 0.04)),
        '--spice-overlay1': this.generateOverlayColor(colorDistribution.base, 0.08),
        '--spice-rgb-overlay1': this.hexToRgb(this.generateOverlayColor(colorDistribution.base, 0.08)),
        '--spice-overlay2': this.generateOverlayColor(colorDistribution.base, 0.12),
        '--spice-rgb-overlay2': this.hexToRgb(this.generateOverlayColor(colorDistribution.base, 0.12)),
        '--spice-crust': this.generateCrustColor(colorDistribution.base),
        '--spice-rgb-crust': this.hexToRgb(this.generateCrustColor(colorDistribution.base)),
        '--spice-mantle': this.generateMantleColor(colorDistribution.base),
        '--spice-rgb-mantle': this.hexToRgb(this.generateMantleColor(colorDistribution.base)),
      };

      // Visual harmony color variables (MEDIUM PRIORITY from analysis)
      const visualHarmonyColorUpdates = {
        '--spice-blue': colorDistribution.harmonyPrimary,
        '--spice-rgb-blue': rgbDistribution.harmonyPrimary,
        '--spice-mauve': colorDistribution.harmonySecondary,
        '--spice-rgb-mauve': rgbDistribution.harmonySecondary,
        '--spice-teal': colorDistribution.harmonyTertiary,
        '--spice-rgb-teal': rgbDistribution.harmonyTertiary,
        
        // ZONE SYSTEM: Context-aware color variables for different UI zones
        '--spice-flamingo': this.generateZoneColor(colorDistribution.primary, 'flamingo'), // Zone home secondary
        '--spice-rgb-flamingo': this.hexToRgb(this.generateZoneColor(colorDistribution.primary, 'flamingo')),
        '--spice-lavender': this.generateZoneColor(colorDistribution.highlight, 'lavender'), // Zone playlist/search primary
        '--spice-rgb-lavender': this.hexToRgb(this.generateZoneColor(colorDistribution.highlight, 'lavender')),
        '--spice-peach': this.generateZoneColor(colorDistribution.surface2, 'peach'), // Zone artist primary
        '--spice-rgb-peach': this.hexToRgb(this.generateZoneColor(colorDistribution.surface2, 'peach')),
        '--spice-rosewater': this.generateZoneColor(colorDistribution.surface1, 'rosewater'), // Zone artist/home secondary
        '--spice-rgb-rosewater': this.hexToRgb(this.generateZoneColor(colorDistribution.surface1, 'rosewater')),
        '--spice-sapphire': this.generateZoneColor(colorDistribution.harmonyPrimary, 'sapphire'), // Zone search secondary
        '--spice-rgb-sapphire': this.hexToRgb(this.generateZoneColor(colorDistribution.harmonyPrimary, 'sapphire')),
      };

      // MISSING CATPPUCCIN PALETTE: Additional colors used in theme
      const paletteSpicetifyUpdates = {
        '--spice-pink': this.generatePaletteColor(colorDistribution.primary, 'pink'),
        '--spice-rgb-pink': this.hexToRgb(this.generatePaletteColor(colorDistribution.primary, 'pink')),
        '--spice-sky': this.generatePaletteColor(colorDistribution.harmonyPrimary, 'sky'),
        '--spice-rgb-sky': this.hexToRgb(this.generatePaletteColor(colorDistribution.harmonyPrimary, 'sky')),
        '--spice-red': this.generatePaletteColor(colorDistribution.highlight, 'red'), // Used for errors
        '--spice-rgb-red': this.hexToRgb(this.generatePaletteColor(colorDistribution.highlight, 'red')),
        '--spice-maroon': this.generatePaletteColor(colorDistribution.shadow, 'maroon'),
        '--spice-rgb-maroon': this.hexToRgb(this.generatePaletteColor(colorDistribution.shadow, 'maroon')),
        '--spice-yellow': this.generatePaletteColor(colorDistribution.surface2, 'yellow'), // Used for warnings
        '--spice-rgb-yellow': this.hexToRgb(this.generatePaletteColor(colorDistribution.surface2, 'yellow')),
        '--spice-green': this.generatePaletteColor(colorDistribution.harmonyTertiary, 'green'), // Used for success
        '--spice-rgb-green': this.hexToRgb(this.generatePaletteColor(colorDistribution.harmonyTertiary, 'green')),
        '--spice-misc': colorDistribution.surface1, // Neutral grey from palette
        '--spice-rgb-misc': rgbDistribution.surface1,
      };

      // 🎨 PHASE 3: Visual Effect System Variables (NEW)
      // Generate effect-specific colors for visual systems currently using hardcoded values
      const effectsSpicetifyUpdates = {
        // Shimmer effect colors (harmony color variations for harmonious shimmer)
        '--spice-shimmer-primary': colorDistribution.harmonyPrimary,
        '--spice-rgb-shimmer-primary': rgbDistribution.harmonyPrimary,
        '--spice-shimmer-secondary': colorDistribution.harmonySecondary,
        '--spice-rgb-shimmer-secondary': rgbDistribution.harmonySecondary,
        '--spice-shimmer-tertiary': colorDistribution.harmonyTertiary,
        '--spice-rgb-shimmer-tertiary': rgbDistribution.harmonyTertiary,
        '--spice-shimmer-quaternary': colorDistribution.primary,
        '--spice-rgb-shimmer-quaternary': rgbDistribution.primary,
        
        // Particle effect colors
        '--spice-particle-glow': colorDistribution.highlight,
        '--spice-rgb-particle-glow': rgbDistribution.highlight,
        '--spice-particle-core': colorDistribution.primary,
        '--spice-rgb-particle-core': rgbDistribution.primary,
        '--spice-particle-trail': colorDistribution.shadow,
        '--spice-rgb-particle-trail': rgbDistribution.shadow,
        
        // Cinematic drama colors (high contrast variants)
        '--spice-cinematic-red': this.generateCinematicRed(colorDistribution.primary),
        '--spice-rgb-cinematic-red': this.hexToRgb(this.generateCinematicRed(colorDistribution.primary)),
        '--spice-cinematic-cyan': this.generateCinematicCyan(colorDistribution.primary),
        '--spice-rgb-cinematic-cyan': this.hexToRgb(this.generateCinematicCyan(colorDistribution.primary)),
        '--spice-cinematic-yellow': this.generateCinematicYellow(colorDistribution.highlight),
        '--spice-rgb-cinematic-yellow': this.hexToRgb(this.generateCinematicYellow(colorDistribution.highlight)),
        
        // Holographic UI colors (luminous variants)
        '--spice-holographic-primary': this.generateHolographicPrimary(colorDistribution.primary),
        '--spice-rgb-holographic-primary': this.hexToRgb(this.generateHolographicPrimary(colorDistribution.primary)),
        '--spice-holographic-accent': this.generateHolographicAccent(colorDistribution.harmonyPrimary),
        '--spice-rgb-holographic-accent': this.hexToRgb(this.generateHolographicAccent(colorDistribution.harmonyPrimary)),
        '--spice-holographic-glow': this.generateHolographicGlow(colorDistribution.highlight),
        '--spice-rgb-holographic-glow': this.hexToRgb(this.generateHolographicGlow(colorDistribution.highlight)),
      };

      // Combine all spicetify updates
      const allSpicetifyUpdates = {
        ...coreSpicetifyUpdates,
        ...criticalSpicetifyUpdates,
        ...coreLayoutSpicetifyUpdates,
        ...visualHarmonyColorUpdates,
        ...paletteSpicetifyUpdates,
        ...effectsSpicetifyUpdates,
      };

      // Apply all Spicetify updates in a single batch with critical priority for album color coordination
      this.cssController.batchSetVariables(
        "SemanticColorManager",
        allSpicetifyUpdates,
        "critical", // Critical priority for album color coordination
        "album-spicetify-update"
      );

      // Also update our own StarryNight gradient variables to ensure consistency
      const starryNightUpdates = {
        '--sn-bg-gradient-accent': colorDistribution.primary,
        '--sn-bg-gradient-accent-rgb': rgbDistribution.primary,
        '--sn-bg-gradient-primary': colorDistribution.primary,
        '--sn-bg-gradient-primary-rgb': rgbDistribution.primary,
        '--sn-bg-gradient-secondary': colorDistribution.surface1,
        '--sn-bg-gradient-secondary-rgb': rgbDistribution.surface1,
      };

      this.cssController.batchSetVariables(
        "SemanticColorManager",
        starryNightUpdates,
        "critical", // Critical priority for StarryNight gradient synchronization
        "album-starrynight-update"
      );

      // Enhanced SN Color Variables (Year 3000 System Integration - NAVBAR/HEADER FIX)
      const snColorUpdates = {
        '--sn-color-accent-hex': colorDistribution.primary,
        '--sn-color-accent-rgb': rgbDistribution.primary,
        '--sn-accent-hex': colorDistribution.primary,
        '--sn-accent-rgb': rgbDistribution.primary,
        '--sn-color-extracted-primary-rgb': rgbDistribution.primary,
        '--sn-color-extracted-secondary-rgb': rgbDistribution.surface1,
        '--sn-color-harmony-complementary-rgb': rgbDistribution.shadow,
        '--sn-color-harmony-analogous-rgb': rgbDistribution.highlight,
        '--sn-color-harmony-triadic-rgb': rgbDistribution.harmonyPrimary,
      };

      this.cssController.batchSetVariables(
        "SemanticColorManager",
        snColorUpdates,
        "critical", // Critical priority for Year 3000 System integration
        "album-y3k-integration-update"
      );

      // Clear semantic color cache to force refresh
      this.clearCache();
      
      // Track color update metrics
      this.lastColorUpdate = Date.now();
      this.colorUpdateCount++;
      
      // Emit color system events for Year 3000 System integration
      const totalVariablesUpdated = Object.keys(allSpicetifyUpdates).length + 
                                   Object.keys(starryNightUpdates).length + 
                                   Object.keys(snColorUpdates).length;
      
      unifiedEventBus.emitSync('colors:applied', {
        cssVariables: {
          ...allSpicetifyUpdates,
          ...starryNightUpdates,
          ...snColorUpdates
        },
        accentHex: colorDistribution.primary,
        accentRgb: rgbDistribution.primary,
        appliedAt: this.lastColorUpdate
      });

      if (this.config.enableDebug) {
        console.log("🎨 [SemanticColorManager] Comprehensive Spicetify variable update with OKLAB album colors:", {
          primaryColor: colorDistribution.primary,
          accentColor: colorDistribution.surface1,
          shadowColor: colorDistribution.shadow,
          highlightColor: colorDistribution.highlight,
          surfaceProgression: [colorDistribution.base, colorDistribution.surface0, colorDistribution.surface1, colorDistribution.surface2],
          harmonyColors: [colorDistribution.harmonyPrimary, colorDistribution.harmonySecondary, colorDistribution.harmonyTertiary],
          effectColors: {
            shimmerColors: 4, // primary, secondary, tertiary, quaternary
            particleColors: 3, // glow, core, trail
            cinematicColors: 3, // red, cyan, yellow
            holographicColors: 3, // primary, accent, glow
          },
          totalSpicetifyVariablesUpdated: Object.keys(allSpicetifyUpdates).length,
          coreLayoutVariablesUpdated: Object.keys(coreLayoutSpicetifyUpdates).length,
          starryNightVariablesUpdated: Object.keys(starryNightUpdates).length,
          snColorVariablesUpdated: Object.keys(snColorUpdates).length,
          effectVariablesAdded: Object.keys(effectsSpicetifyUpdates).length,
          eventEmitted: true,
          totalVariablesUpdated
        });
      }

    } catch (error) {
      console.error("[SemanticColorManager] Failed to update with album colors:", error);
    }
  }

  /**
   * Generate intelligent color distribution for comprehensive Spicetify variable coverage
   * Uses OKLAB-inspired color science for perceptually uniform depth progression and harmony color variations
   */
  private generateIntelligentColorDistribution(
    primaryColor: string,
    accentColor?: string,
    shadowColor?: string,
    highlightColor?: string
  ): {
    primary: string;
    surface0: string;
    surface1: string;
    surface2: string;
    base: string;
    shadow: string;
    highlight: string;
    harmonyPrimary: string;
    harmonySecondary: string;
    harmonyTertiary: string;
  } {
    // Use provided colors or generate intelligent fallbacks
    const primary = primaryColor;
    const accent = accentColor || primaryColor;
    const shadow = shadowColor || this.generateDarkerVariant(primaryColor, 0.3);
    const highlight = highlightColor || this.generateLighterVariant(primaryColor, 0.2);

    // Generate depth progression (base → surface0 → surface1 → surface2)
    // Each step becomes lighter for depth illusion
    const base = this.generateDarkerVariant(primaryColor, 0.6); // Deepest background
    const surface0 = this.generateDarkerVariant(primaryColor, 0.4); // Middle depth
    const surface1 = accent; // Use accent for surface1 (existing logic)
    const surface2 = this.generateLighterVariant(accent, 0.15); // Elevated surface

    // Generate harmony color variations using hue rotation
    // Create harmonious but distinct colors for visual systems
    const harmonyPrimary = this.generateHueRotatedColor(primaryColor, 120); // Blue-ish shift
    const harmonySecondary = this.generateHueRotatedColor(primaryColor, -60); // Mauve-ish shift  
    const harmonyTertiary = this.generateHueRotatedColor(primaryColor, 180); // Teal-ish shift

    return {
      primary,
      surface0,
      surface1,
      surface2,
      base,
      shadow,
      highlight,
      harmonyPrimary,
      harmonySecondary,
      harmonyTertiary,
    };
  }

  /**
   * Convert color distribution object to RGB strings for CSS variables
   */
  private convertColorsToRgb(colorDistribution: any): any {
    const rgbDistribution: any = {};
    
    Object.entries(colorDistribution).forEach(([key, hexColor]) => {
      rgbDistribution[key] = this.hexToRgb(hexColor as string);
    });
    
    return rgbDistribution;
  }

  /**
   * Generate a darker variant of a color by reducing lightness
   */
  private generateDarkerVariant(hexColor: string, factor: number): string {
    try {
      const rgb = this.hexToRgbObject(hexColor);
      if (!rgb) return hexColor;

      // Simple darkening by reducing RGB values
      const r = Math.max(0, Math.round(rgb.r * (1 - factor)));
      const g = Math.max(0, Math.round(rgb.g * (1 - factor)));
      const b = Math.max(0, Math.round(rgb.b * (1 - factor)));

      return this.rgbToHex(r, g, b);
    } catch (error) {
      console.warn("[SemanticColorManager] Failed to generate darker variant:", error);
      return hexColor;
    }
  }

  /**
   * Generate a lighter variant of a color by increasing lightness
   */
  private generateLighterVariant(hexColor: string, factor: number): string {
    try {
      const rgb = this.hexToRgbObject(hexColor);
      if (!rgb) return hexColor;

      // Simple lightening by moving RGB values toward white
      const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
      const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
      const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));

      return this.rgbToHex(r, g, b);
    } catch (error) {
      console.warn("[SemanticColorManager] Failed to generate lighter variant:", error);
      return hexColor;
    }
  }

  /**
   * Generate a hue-rotated variant of a color for visual harmony systems
   */
  private generateHueRotatedColor(hexColor: string, hueDegrees: number): string {
    try {
      const rgb = this.hexToRgbObject(hexColor);
      if (!rgb) return hexColor;

      // Convert RGB to HSL for hue rotation
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      // Rotate hue (wrap around 360 degrees)
      hsl.h = (hsl.h + hueDegrees) % 360;
      if (hsl.h < 0) hsl.h += 360;

      // Convert back to RGB
      const rotatedRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
      return this.rgbToHex(rotatedRgb.r, rotatedRgb.g, rotatedRgb.b);
    } catch (error) {
      console.warn("[SemanticColorManager] Failed to generate hue-rotated color:", error);
      return hexColor;
    }
  }

  /**
   * Convert hex color to RGB object
   */
  private hexToRgbObject(hex: string): { r: number; g: number; b: number } | null {
    const cleanHex = hex.replace('#', '');
    
    if (cleanHex.length !== 6) return null;
    
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    return { r, g, b };
  }

  /**
   * Convert RGB values to hex string
   */
  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Convert RGB to HSL for hue manipulation
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // Achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * Convert HSL back to RGB
   */
  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // Achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Convert hex color to RGB string for CSS variables
   */
  private hexToRgb(hex: string): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }

  public getColorMappings(): SemanticColorMapping[] {
    return SemanticColorManager.SEMANTIC_MAPPINGS;
  }

  // 🎨 PHASE 3: Effect-Specific Color Generators
  // Generate specialized colors for visual effect systems

  /**
   * Generate cinematic red color with high contrast characteristics
   * Based on album color psychology for dramatic effects
   */
  private generateCinematicRed(baseColor: string): string {
    try {
      const rgb = this.hexToRgbObject(baseColor);
      if (!rgb) return '#FF0000'; // Fallback

      // Create dramatic red with base color influence
      // Boost red channel significantly while maintaining base color warmth
      const dramaticRed = Math.min(255, rgb.r + 100);
      const warmGreen = Math.max(0, Math.min(rgb.g * 0.3, 100));
      const warmBlue = Math.max(0, Math.min(rgb.b * 0.2, 80));

      return this.rgbToHex(dramaticRed, warmGreen, warmBlue);
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate cinematic red:', error);
      return '#FF0000';
    }
  }

  /**
   * Generate cinematic cyan color complementary to the base color
   * Creates high contrast cyan for dramatic visual effects
   */
  private generateCinematicCyan(baseColor: string): string {
    try {
      const rgb = this.hexToRgbObject(baseColor);
      if (!rgb) return '#00FFFF'; // Fallback

      // Create dramatic cyan complementary to base color
      // High blue and green channels with base color influence
      const dramaticGreen = Math.min(255, rgb.g + 120);
      const dramaticBlue = Math.min(255, rgb.b + 140);
      const coolRed = Math.max(0, Math.min(rgb.r * 0.2, 60));

      return this.rgbToHex(coolRed, dramaticGreen, dramaticBlue);
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate cinematic cyan:', error);
      return '#00FFFF';
    }
  }

  /**
   * Generate cinematic yellow for accent dramatic effects
   * Bright, attention-grabbing yellow based on highlight color
   */
  private generateCinematicYellow(highlightColor: string): string {
    try {
      const rgb = this.hexToRgbObject(highlightColor);
      if (!rgb) return '#FFFF00'; // Fallback

      // Create bright yellow with highlight color characteristics
      const brightRed = Math.min(255, rgb.r + 80);
      const brightGreen = Math.min(255, rgb.g + 100);
      const subtleBlue = Math.max(0, Math.min(rgb.b * 0.3, 120));

      return this.rgbToHex(brightRed, brightGreen, subtleBlue);
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate cinematic yellow:', error);
      return '#FFFF00';
    }
  }

  /**
   * Generate holographic primary color with luminous characteristics
   * Creates iridescent, enhanced color based on album primary
   */
  private generateHolographicPrimary(baseColor: string): string {
    try {
      const rgb = this.hexToRgbObject(baseColor);
      if (!rgb) return '#8A2BE2'; // Fallback to violet

      // Create luminous holographic color with prismatic characteristics
      // Boost saturation and add prismatic shimmer
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      // Increase saturation for holographic effect
      const enhancedSaturation = Math.min(1, hsl.s + 0.3);
      // Adjust lightness for luminous glow
      const luminousLightness = Math.min(0.8, Math.max(0.4, hsl.l + 0.1));

      const enhancedRgb = this.hslToRgb(hsl.h, enhancedSaturation, luminousLightness);
      return this.rgbToHex(enhancedRgb.r, enhancedRgb.g, enhancedRgb.b);
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate holographic primary:', error);
      return '#8A2BE2';
    }
  }

  /**
   * Generate holographic accent color with prismatic shift
   * Creates complementary holographic color for accent effects
   */
  private generateHolographicAccent(harmonyColor: string): string {
    try {
      // Apply prismatic hue shift for holographic spectrum effect
      return this.generateHueRotatedColor(harmonyColor, 45);
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate holographic accent:', error);
      return '#FF00FF';
    }
  }

  /**
   * Generate holographic glow color for luminous lighting effects
   * Creates soft, luminous glow based on highlight color
   */
  private generateHolographicGlow(highlightColor: string): string {
    try {
      const rgb = this.hexToRgbObject(highlightColor);
      if (!rgb) return '#E0E0FF'; // Fallback to soft blue-white

      // Create soft, luminous glow by increasing all channels proportionally
      const glowIntensity = 0.7;
      const glowRed = Math.min(255, rgb.r + (255 - rgb.r) * glowIntensity);
      const glowGreen = Math.min(255, rgb.g + (255 - rgb.g) * glowIntensity);
      const glowBlue = Math.min(255, rgb.b + (255 - rgb.b) * glowIntensity);

      return this.rgbToHex(glowRed, glowGreen, glowBlue);
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate holographic glow:', error);
      return '#E0E0FF';
    }
  }

  /**
   * Generate high contrast text color based on background color
   * Creates optimal text readability for context-aware design
   */
  private generateTextColor(baseColor: string): string {
    try {
      const rgb = this.hexToRgbObject(baseColor);
      if (!rgb) return '#CAD3F5'; // Fallback to Catppuccin text

      // Calculate luminance to determine if background is light or dark
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      
      if (luminance > 0.5) {
        // Light background - use dark text
        return '#24273A'; // Catppuccin base (dark)
      } else {
        // Dark background - use light text
        return '#CAD3F5'; // Catppuccin text (light)
      }
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate text color:', error);
      return '#CAD3F5';
    }
  }

  /**
   * Generate medium contrast subdued text color
   * Creates secondary text with reduced contrast for hierarchy
   */
  private generateSubtextColor(baseColor: string): string {
    try {
      const rgb = this.hexToRgbObject(baseColor);
      if (!rgb) return '#A5ADCB'; // Fallback to Catppuccin subtext

      // Calculate luminance to determine background brightness
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      
      if (luminance > 0.5) {
        // Light background - use medium dark text
        return '#5B6078'; // Catppuccin overlay2 (medium dark)
      } else {
        // Dark background - use medium light text
        return '#A5ADCB'; // Catppuccin subtext (medium light)
      }
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate subtext color:', error);
      return '#A5ADCB';
    }
  }

  /**
   * Generate progressive overlay colors for background depth hierarchy
   * Creates Catppuccin-style overlay colors with OKLAB-enhanced base
   */
  private generateOverlayColor(baseColor: string, opacity: number): string {
    try {
      const rgb = this.hexToRgbObject(baseColor);
      if (!rgb) return `rgba(88,91,112,${opacity})`; // Fallback to Catppuccin overlay

      // Calculate luminance to determine lightening strategy
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      
      if (luminance > 0.5) {
        // Light background - darken for overlay
        const factor = 1 - (opacity * 2); // Progressive darkening
        const overlayRed = Math.max(0, Math.round(rgb.r * factor));
        const overlayGreen = Math.max(0, Math.round(rgb.g * factor));
        const overlayBlue = Math.max(0, Math.round(rgb.b * factor));
        return this.rgbToHex(overlayRed, overlayGreen, overlayBlue);
      } else {
        // Dark background - lighten for overlay
        const factor = opacity * 255; // Progressive lightening
        const overlayRed = Math.min(255, Math.round(rgb.r + factor));
        const overlayGreen = Math.min(255, Math.round(rgb.g + factor));
        const overlayBlue = Math.min(255, Math.round(rgb.b + factor));
        return this.rgbToHex(overlayRed, overlayGreen, overlayBlue);
      }
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate overlay color:', error);
      return `rgba(88,91,112,${opacity})`;
    }
  }

  /**
   * Generate window frame/border crust color
   * Creates subtle border color for window chrome elements
   */
  private generateCrustColor(baseColor: string): string {
    try {
      const rgb = this.hexToRgbObject(baseColor);
      if (!rgb) return '#232634'; // Fallback to Catppuccin crust

      // Calculate luminance to determine border strategy
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      
      if (luminance > 0.5) {
        // Light background - darker border
        const crustRed = Math.max(0, Math.round(rgb.r * 0.8));
        const crustGreen = Math.max(0, Math.round(rgb.g * 0.8));
        const crustBlue = Math.max(0, Math.round(rgb.b * 0.8));
        return this.rgbToHex(crustRed, crustGreen, crustBlue);
      } else {
        // Dark background - slightly lighter border
        const crustRed = Math.min(255, Math.round(rgb.r + 20));
        const crustGreen = Math.min(255, Math.round(rgb.g + 20));
        const crustBlue = Math.min(255, Math.round(rgb.b + 20));
        return this.rgbToHex(crustRed, crustGreen, crustBlue);
      }
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate crust color:', error);
      return '#232634';
    }
  }

  /**
   * Generate window background mantle color
   * Creates intermediate color between base and overlay0 for window backgrounds
   */
  private generateMantleColor(baseColor: string): string {
    try {
      const rgb = this.hexToRgbObject(baseColor);
      if (!rgb) return '#1e2030'; // Fallback to Catppuccin mantle

      // Calculate luminance for color strategy
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      
      if (luminance > 0.5) {
        // Light background - slightly darker mantle
        const mantleRed = Math.max(0, Math.round(rgb.r * 0.95));
        const mantleGreen = Math.max(0, Math.round(rgb.g * 0.95));
        const mantleBlue = Math.max(0, Math.round(rgb.b * 0.95));
        return this.rgbToHex(mantleRed, mantleGreen, mantleBlue);
      } else {
        // Dark background - slightly lighter mantle  
        const mantleRed = Math.min(255, Math.round(rgb.r + 10));
        const mantleGreen = Math.min(255, Math.round(rgb.g + 10));
        const mantleBlue = Math.min(255, Math.round(rgb.b + 10));
        return this.rgbToHex(mantleRed, mantleGreen, mantleBlue);
      }
    } catch (error) {
      console.warn('[SemanticColorManager] Failed to generate mantle color:', error);
      return '#1e2030';
    }
  }

  /**
   * Generate zone-specific colors with context-aware hue shifts
   * Creates contextual color variations for different UI zones (home, playlist, artist, search)
   */
  private generateZoneColor(baseColor: string, zoneType: 'flamingo' | 'lavender' | 'peach' | 'rosewater' | 'sapphire'): string {
    try {
      const rgb = Utils.hexToRgb(baseColor);
      if (!rgb) {
        console.warn(`🔧 [SemanticColorManager] Failed to parse RGB from ${baseColor}`);
        return baseColor;
      }
      
      // Zone-specific RGB adjustments for context-aware contextual coloring
      const zoneAdjustments = {
        flamingo: { rAdjust: 20, gAdjust: -10, bAdjust: -5 }, // Warm pink for home comfort
        lavender: { rAdjust: 10, gAdjust: -5, bAdjust: 15 }, // Cool purple for focus/playlist
        peach: { rAdjust: 25, gAdjust: 10, bAdjust: -15 }, // Warm orange for artist discovery
        rosewater: { rAdjust: 15, gAdjust: -8, bAdjust: 0 }, // Subtle pink for secondary elements
        sapphire: { rAdjust: -20, gAdjust: -10, bAdjust: 25 } // Deep blue for search precision
      };
      
      const config = zoneAdjustments[zoneType];
      
      // Apply zone-specific RGB adjustments
      const adjustedR = Math.max(0, Math.min(255, rgb.r + config.rAdjust));
      const adjustedG = Math.max(0, Math.min(255, rgb.g + config.gAdjust));
      const adjustedB = Math.max(0, Math.min(255, rgb.b + config.bAdjust));
      
      const zoneHex = Utils.rgbToHex(adjustedR, adjustedG, adjustedB);
      
      if (this.config.enableDebug) {
        console.log(`🎨 [SemanticColorManager] Generated ${zoneType} color: ${baseColor} → ${zoneHex} (RGB: ${rgb.r},${rgb.g},${rgb.b} → ${adjustedR},${adjustedG},${adjustedB})`);
      }
      
      return zoneHex;
    } catch (error) {
      console.warn(`🔧 [SemanticColorManager] Failed to generate ${zoneType} color for "${baseColor}":`, error);
      return baseColor; // Return original color if generation fails
    }
  }

  /**
   * Generate palette-specific colors with context-aware variations
   * Creates color variations for Catppuccin palette colors (pink, sky, red, maroon, yellow, green)
   */
  private generatePaletteColor(baseColor: string, paletteType: 'pink' | 'sky' | 'red' | 'maroon' | 'yellow' | 'green'): string {
    try {
      const rgb = Utils.hexToRgb(baseColor);
      if (!rgb) {
        console.warn(`🔧 [SemanticColorManager] Failed to parse RGB from ${baseColor}`);
        return baseColor;
      }
      
      // Palette-specific RGB adjustments for context-aware color mapping
      const paletteAdjustments = {
        pink: { rAdjust: 30, gAdjust: -20, bAdjust: -10 }, // Soft pink for decorative elements
        sky: { rAdjust: -30, gAdjust: 10, bAdjust: 30 }, // Bright sky blue for information
        red: { rAdjust: 35, gAdjust: -25, bAdjust: -15 }, // Vibrant red for errors/warnings
        maroon: { rAdjust: 25, gAdjust: -15, bAdjust: -10 }, // Deep maroon for emphasis
        yellow: { rAdjust: 30, gAdjust: 25, bAdjust: -30 }, // Bright yellow for warnings
        green: { rAdjust: -25, gAdjust: 30, bAdjust: -20 } // Natural green for success
      };
      
      const config = paletteAdjustments[paletteType];
      
      // Apply palette-specific RGB adjustments with context-aware boundaries
      const adjustedR = Math.max(0, Math.min(255, rgb.r + config.rAdjust));
      const adjustedG = Math.max(0, Math.min(255, rgb.g + config.gAdjust));
      const adjustedB = Math.max(0, Math.min(255, rgb.b + config.bAdjust));
      
      const paletteHex = Utils.rgbToHex(adjustedR, adjustedG, adjustedB);
      
      if (this.config.enableDebug) {
        console.log(`🎨 [SemanticColorManager] Generated ${paletteType} color: ${baseColor} → ${paletteHex} (RGB: ${rgb.r},${rgb.g},${rgb.b} → ${adjustedR},${adjustedG},${adjustedB})`);
      }
      
      return paletteHex;
    } catch (error) {
      console.warn(`🔧 [SemanticColorManager] Failed to generate ${paletteType} color for "${baseColor}":`, error);
      return baseColor; // Return original color if generation fails
    }
  }

  public destroy(): void {
    try {
      // Unsubscribe from all events
      this.cleanupEventSubscriptions();
      
      // Clear caches and references
      this.clearCache();
      this.cssController = null as any;
      
      // Reset state
      this.initialized = false;
      this.lastColorUpdate = 0;
      this.colorUpdateCount = 0;
      
      // Emit system destruction event
      unifiedEventBus.emitSync('system:destroyed', {
        systemName: 'SemanticColorManager',
        timestamp: Date.now(),
        reason: 'Manual destruction'
      });
      
      if (this.config.enableDebug) {
        console.log("🎨 [SemanticColorManager] System destroyed and cleaned up");
      }
      
    } catch (error) {
      console.error("[SemanticColorManager] Error during destruction:", error);
    }
  }
  
  /**
   * IManagedSystem interface implementation
   */
  public updateAnimation(deltaTime: number): void {
    // SemanticColorManager doesn't need animation updates
    // This is here to satisfy the IManagedSystem interface
  }
  
  /**
   * IManagedSystem health check implementation
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const healthResult: HealthCheckResult = {
      system: 'SemanticColorManager',
      healthy: true,
      details: 'SemanticColorManager operational',
      issues: [],
      metrics: {
        initialized: this.initialized,
        spicetifyAvailable: this.isSpicetifyAvailable(),
        cssControllerAvailable: !!this.cssController,
        lastColorUpdate: this.lastColorUpdate,
        colorUpdateCount: this.colorUpdateCount,
        eventSubscriptions: this.eventSubscriptionIds.length,
        cacheSize: this.colorCache.size,
        lastCacheUpdate: this.lastCacheUpdate
      }
    };
    
    // Check for issues
    if (!this.initialized) {
      healthResult.healthy = false;
      healthResult.issues!.push('System not initialized');
    }
    
    if (!this.isSpicetifyAvailable()) {
      healthResult.healthy = false;
      healthResult.issues!.push('Spicetify API not available');
    }
    
    if (this.colorUpdateCount === 0 && this.initialized) {
      healthResult.issues!.push('No color updates performed since initialization');
    }
    
    if (this.eventSubscriptionIds.length === 0 && this.initialized) {
      healthResult.issues!.push('No event subscriptions active');
    }
    
    // Update health status based on issues
    if (healthResult.issues!.length > 0) {
      healthResult.details = `Issues detected: ${healthResult.issues!.join(', ')}`;
      
      if (healthResult.issues!.length >= 2) {
        healthResult.healthy = false;
      }
    }
    
    return healthResult;
  }
  
  /**
   * Setup event subscriptions for system integration
   */
  private setupEventSubscriptions(): void {
    // Listen for track changes to automatically update colors
    const trackChangeId = unifiedEventBus.subscribe(
      'music:track-changed',
      async (data) => {
        if (this.config.enableDebug) {
          console.log('🎨 [SemanticColorManager] Track changed, preparing for color refresh:', data.trackUri);
        }
        // Clear cache to ensure fresh colors on track change
        this.clearCache();
      },
      'SemanticColorManager'
    );
    
    // Listen for settings changes that might affect color processing
    const settingsChangeId = unifiedEventBus.subscribe(
      'settings:changed',
      async (data) => {
        if (data.settingKey.includes('color') || data.settingKey.includes('theme')) {
          if (this.config.enableDebug) {
            console.log('🎨 [SemanticColorManager] Color-related setting changed:', data.settingKey);
          }
          this.clearCache();
        }
      },
      'SemanticColorManager'
    );
    
    this.eventSubscriptionIds = [trackChangeId, settingsChangeId];
    
    if (this.config.enableDebug) {
      console.log('🎨 [SemanticColorManager] Event subscriptions established:', this.eventSubscriptionIds.length);
    }
  }
  
  /**
   * Clean up event subscriptions
   */
  private cleanupEventSubscriptions(): void {
    for (const subscriptionId of this.eventSubscriptionIds) {
      unifiedEventBus.unsubscribe(subscriptionId);
    }
    this.eventSubscriptionIds = [];
    
    if (this.config.enableDebug) {
      console.log('🎨 [SemanticColorManager] Event subscriptions cleaned up');
    }
  }
  
  /**
   * Get system metrics for monitoring
   */
  public getSystemMetrics(): {
    initialized: boolean;
    lastColorUpdate: number;
    colorUpdateCount: number;
    eventSubscriptions: number;
    cacheSize: number;
    spicetifyAvailable: boolean;
  } {
    return {
      initialized: this.initialized,
      lastColorUpdate: this.lastColorUpdate,
      colorUpdateCount: this.colorUpdateCount,
      eventSubscriptions: this.eventSubscriptionIds.length,
      cacheSize: this.colorCache.size,
      spicetifyAvailable: this.isSpicetifyAvailable()
    };
  }
}