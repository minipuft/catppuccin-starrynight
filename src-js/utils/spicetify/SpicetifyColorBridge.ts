/**
 * SpicetifyColorBridge - Comprehensive Spicetify Variable Bridge for Year 3000 System
 *
 * PURPOSE:
 * Primary Spicetify-to-Year3000 color integration system that generates and applies
 * 96 CSS variables (--spice-* namespace) from OKLAB-processed album art colors.
 *
 * ARCHITECTURE ROLE:
 * - OWNS: --spice-* CSS variable namespace (Spicetify compatibility layer)
 * - GENERATES: 70+ Spicetify-specific variables with advanced color science
 * - COORDINATES: With ColorStateManager (--sn-* namespace) via CSSVariableWriter
 * - INTEGRATES: ColorHarmonyEngine OKLAB output → Spicetify CSS variables
 *
 * CORE FUNCTIONALITY:
 * 1. Spicetify Semantic Color Integration (20 fallback colors)
 *    - Provides Catppuccin Macchiato fallbacks when Spicetify API unavailable
 *    - Caches semantic color values (5-second duration)
 *
 * 2. Album Color Distribution (PRIMARY FUNCTION - 90% of code)
 *    - Receives OKLAB-processed colors from ColorHarmonyEngine
 *    - Generates comprehensive Spicetify variable coverage:
 *      • Core layout (base, surface0-2, overlays, crust, mantle)
 *      • Visual harmony (blue, mauve, teal)
 *      • Zone colors (flamingo, lavender, peach, rosewater, sapphire)
 *      • Palette colors (pink, sky, red, maroon, yellow, green)
 *      • Effect-specific (cinematic, holographic, shimmer, particle)
 *    - Applies 96 total variables per album change
 *
 * 3. CSS Variable Application Authority
 *    - Uses CSSVariableWriter with priority-based batching
 *    - Critical priority for album color coordination
 *    - High priority for semantic color system
 *    - Emits colors:applied event after application
 *
 * INTEGRATION PATTERN:
 * ```
 * ColorHarmonyEngine (OKLAB Processing)
 *    ↓ updateWithAlbumColors(oklabColors)
 * SpicetifyColorBridge (96 Spicetify variables)
 *    ↓ batchSetVariables() via CSSVariableWriter
 *    ↓ emits colors:applied event
 * DOM (CSS Variables: --spice-*)
 * ```
 *
 * PERFORMANCE CHARACTERISTICS:
 * - Target: <50ms per album color update cycle
 * - Generates 96 CSS variables per track change
 * - Uses priority batching for efficient DOM updates
 * - Validates colors to prevent white/invalid values
 *
 * NAMING RATIONALE:
 * Previously "SpicetifyColorBridge" - name significantly understated scope.
 * Renamed to "SpicetifyColorBridge" (2025-10-05) to accurately reflect:
 * - PRIMARY PURPOSE: Bridge between Year3000 color system and Spicetify
 * - SCOPE: Comprehensive Spicetify variable generation (not just semantic colors)
 * - ARCHITECTURE: Clear namespace ownership (--spice-* vs --sn-*)
 *
 * @see ColorHarmonyEngine - Calls updateWithAlbumColors() with OKLAB-processed colors
 * @see ColorStateManager - Coordinates --sn-* namespace variables
 * @see CSSVariableWriter - Shared CSS variable application authority
 * @see docs/architecture/adr/ADR-001-rename-semantic-color-manager.md
 */

// Import theme-specific Spicetify type extensions
/// <reference path="../../types/spicetify-extensions.d.ts" />
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import * as ColorGen from "@/utils/color/SpicetifyColorGenerators";

// Runtime utilities for safe Spicetify access
function safeGetSpicetify(): typeof Spicetify | null {
  return (typeof window !== 'undefined' && window.Spicetify) ? window.Spicetify : null;
}

function isSpicetifyPlatformAvailable(): boolean {
  const spicetify = safeGetSpicetify();
  return !!(spicetify?.Platform);
}
import { unifiedEventBus } from "@/core/events/EventBus";
import { IManagedSystem, HealthCheckResult } from "@/types/systems";
import * as Utils from "@/utils/core/ThemeUtilities";

export interface SpicetifyColorBridgeConfig {
  enableDebug?: boolean;
  fallbackToSpiceColors?: boolean;
  cacheDuration?: number;
}

/**
 * @deprecated Use SpicetifyColorBridgeConfig instead. Kept for backward compatibility.
 */
export type SemanticColorConfig = SpicetifyColorBridgeConfig;

export interface SemanticColorMapping {
  semanticColor: Spicetify.SemanticColor;
  cssVariable: string;
  fallbackColor: string;
  description: string;
}

/**
 * SpicetifyColorBridge - Primary Spicetify-to-Year3000 color integration system
 *
 * OWNS: --spice-* CSS variable namespace (96 variables)
 * COORDINATES: With ColorStateManager (--sn-* namespace)
 * INTEGRATES: ColorHarmonyEngine OKLAB output → Spicetify CSS variables
 */
export class SpicetifyColorBridge implements IManagedSystem {
  private config: SpicetifyColorBridgeConfig;
  private cssController!: CSSVariableWriter;
  private colorCache: Map<Spicetify.SemanticColor, string> = new Map();
  private lastCacheUpdate: number = 0;
  
  // IManagedSystem interface
  public initialized: boolean = false;
  
  // Event tracking for proper system integration
  private eventSubscriptionIds: string[] = [];
  private lastColorUpdate: number = 0;
  private colorUpdateCount: number = 0;

  // Performance optimization - change detection (Phase 3)
  private lastAppliedVariables: Record<string, string> = {};
  private lastUpdateDuration: number = 0;
  private updateDurations: number[] = [];
  private skippedUpdateCount: number = 0;

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

  constructor(config: SpicetifyColorBridgeConfig = {}) {
    this.config = {
      enableDebug: false,
      fallbackToSpiceColors: true,
      cacheDuration: 5000, // 5 seconds
      ...config
    };
  }

  public async initialize(cssController?: CSSVariableWriter): Promise<void> {
    if (this.initialized) {
      console.warn("[SpicetifyColorBridge] Already initialized, skipping");
      return;
    }

    try {
      this.cssController = cssController || getGlobalCSSVariableWriter();
      
      // Subscribe to UnifiedEventBus events for system integration
      this.setupEventSubscriptions();
      
      this.initialized = true;
      this.lastColorUpdate = Date.now();

      if (this.config.enableDebug) {
        console.log("🎨 [SpicetifyColorBridge] Initialized as IManagedSystem with", {
          mappings: SpicetifyColorBridge.SEMANTIC_MAPPINGS.length,
          batcherAvailable: !!this.cssController,
          spicetifyAvailable: this.isSpicetifyAvailable(),
          eventSubscriptions: this.eventSubscriptionIds.length
        });
      }

      // Emit system initialization event
      unifiedEventBus.emitSync('system:initialized', {
        systemName: 'SpicetifyColorBridge',
        timestamp: Date.now(),
        metadata: {
          mappings: SpicetifyColorBridge.SEMANTIC_MAPPINGS.length,
          spicetifyAvailable: this.isSpicetifyAvailable() ? 1 : 0
        }
      });
      
    } catch (error) {
      console.error("[SpicetifyColorBridge] Initialization failed:", error);
      
      unifiedEventBus.emitSync('system:error', {
        systemName: 'SpicetifyColorBridge',
        error: error instanceof Error ? error.message : 'Initialization failed',
        severity: 'critical',
        timestamp: Date.now()
      });
      
      throw error;
    }
  }

  public async updateSemanticColors(): Promise<void> {
    if (!this.initialized) {
      console.warn("[SpicetifyColorBridge] Not initialized, cannot update colors");
      return;
    }

    const now = Date.now();
    if (now - this.lastCacheUpdate < (this.config.cacheDuration || 5000)) {
      return; // Skip update if cache is still valid
    }

    // 🎨 CRITICAL: Log semantic color update process
    console.log("🎨 [SpicetifyColorBridge] Starting semantic color update...");

    try {
      const colorUpdateLog: Record<string, any> = {};
      const semanticColorUpdates: Record<string, string> = {};
      const rgbColorUpdates: Record<string, string> = {};

      // Collect all color updates first for batching
      for (const mapping of SpicetifyColorBridge.SEMANTIC_MAPPINGS) {
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
        "SpicetifyColorBridge",
        semanticColorUpdates,
        "high", // High priority for semantic color system
        "semantic-color-update"
      );

      // Apply all RGB variants in batch with high priority
      this.cssController.batchSetVariables(
        "SpicetifyColorBridge",
        rgbColorUpdates,
        "high", // High priority for RGB color variants
        "semantic-rgb-update"
      );

      // 🎨 CRITICAL: Log all color updates
      console.log("🎨 [SpicetifyColorBridge] Color update complete:", colorUpdateLog);

      this.lastCacheUpdate = now;

      if (this.config.enableDebug) {
        console.log("🎨 [SpicetifyColorBridge] Updated all semantic colors");
      }
    } catch (error) {
      console.error("[SpicetifyColorBridge] Failed to update semantic colors:", error);
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
        console.log(`🎨 [SpicetifyColorBridge] Spicetify returned for ${semanticColor}:`, {
          rawValue: color,
          type: typeof color,
          isWhite: color === '#ffffff' || color === '#fff' || color === 'white',
          isInvalid: !color || color === 'undefined' || color === 'null'
        });
      } else {
        // Fallback to mapping logic
        console.warn(`🎨 [SpicetifyColorBridge] Spicetify not available, using fallback for ${semanticColor}`);
        color = this.getFallbackColor(semanticColor);
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(`[SpicetifyColorBridge] Failed to get semantic color ${semanticColor}:`, error);
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
        console.warn(`🔧 [SpicetifyColorBridge] Invalid color "${color}" for ${semanticColor}, using fallback: ${fallbackColor}`);
      }
      
      return fallbackColor;
    }
    
    // Additional validation: ensure it's a proper hex color
    if (!normalizedColor.match(/^#[0-9a-f]{6}$/i) && !normalizedColor.match(/^#[0-9a-f]{3}$/i)) {
      const fallbackColor = this.getFallbackColor(semanticColor);
      
      if (this.config.enableDebug) {
        console.warn(`🔧 [SpicetifyColorBridge] Malformed color "${color}" for ${semanticColor}, using fallback: ${fallbackColor}`);
      }
      
      return fallbackColor;
    }
    
    return color;
  }

  private getFallbackColor(semanticColor: Spicetify.SemanticColor): string {
    const mapping = SpicetifyColorBridge.SEMANTIC_MAPPINGS.find(m => m.semanticColor === semanticColor);
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
      "SpicetifyColorBridge",
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
   * 🔧 PHASE 7.2: Enhanced to accept full event data with OKLAB metadata
   * Update Spicetify variables directly with OKLAB-processed album colors
   * This bypasses CSS fallback chains and prevents Spotify overrides
   *
   * Now extracts and applies:
   * - OKLAB metadata (enhanced hex, rgb, shadow, OKLCH coordinates)
   * - Dynamic accent variables
   * - Music energy variables
   * - Living gradient variables
   * - Visual effects variables
   */
  public updateWithAlbumColors(
    oklabColorsOrEventData: { [key: string]: string } | any
  ): void {
    console.log("🎨 [SpicetifyColorBridge] ═══ updateWithAlbumColors() CALLED ═══");

    // 🔧 PHASE 7.2: Support both legacy (colors only) and new (full event data) formats
    const isEventData = 'processedColors' in oklabColorsOrEventData;
    const oklabColors = isEventData
      ? oklabColorsOrEventData.processedColors
      : oklabColorsOrEventData;
    const metadata = isEventData ? oklabColorsOrEventData.metadata : null;

    console.log("🎨 [SpicetifyColorBridge] Input data:", {
      isEventData,
      hasMetadata: !!metadata,
      hasOKLABMetadata: !!metadata?.oklabMetadata,
      colorKeys: Object.keys(oklabColors),
      colorCount: Object.keys(oklabColors).length,
      colors: oklabColors
    });

    if (!this.initialized) {
      console.error("🎨 [SpicetifyColorBridge] ❌ CRITICAL: Not initialized, cannot update with album colors!");
      console.warn("[SpicetifyColorBridge] Not initialized, cannot update with album colors");
      return;
    }

    try {
      // Performance timing (Phase 3 optimization)
      const updateStartTime = performance.now();

      // Extract key colors from OKLAB processing result
      console.log("🎨 [SpicetifyColorBridge] Extracting key colors from OKLAB result...");
      const primaryColor = oklabColors['OKLAB_PRIMARY'] || oklabColors['VIBRANT'] || oklabColors['PRIMARY'];
      const accentColor = oklabColors['OKLAB_ACCENT'] || oklabColors['LIGHT_VIBRANT'] || oklabColors['SECONDARY'];
      const shadowColor = oklabColors['OKLAB_SHADOW'] || oklabColors['DARK_VIBRANT'] || oklabColors['DARK'];
      const highlightColor = oklabColors['OKLAB_HIGHLIGHT'] || oklabColors['VIBRANT_NON_ALARMING'] || oklabColors['LIGHT'];

      console.log("🎨 [SpicetifyColorBridge] Extracted colors:", {
        primary: primaryColor,
        accent: accentColor,
        shadow: shadowColor,
        highlight: highlightColor
      });

      if (!primaryColor) {
        console.error("🎨 [SpicetifyColorBridge] ❌ CRITICAL: No primary color found in OKLAB result!");
        console.warn("[SpicetifyColorBridge] No primary color found in OKLAB result, skipping update");
        return;
      }

      // Generate intelligent color distribution for comprehensive coverage
      const colorDistribution = ColorGen.generateIntelligentColorDistribution(
        primaryColor, accentColor, shadowColor, highlightColor
      );

      // Convert all colors to RGB for CSS variables
      const rgbDistribution = ColorGen.convertColorsToRgb(colorDistribution) as Required<Record<keyof typeof colorDistribution, string>>;

      // 🔧 PHASE 7.2: Extract OKLAB metadata from strategy (if available)
      const oklabMetadata = metadata?.oklabMetadata;
      console.log("🎨 [SpicetifyColorBridge] OKLAB metadata:", {
        hasOKLABMetadata: !!oklabMetadata,
        enhancedHex: oklabMetadata?.enhancedHex,
        shadowHex: oklabMetadata?.shadowHex,
        oklchL: oklabMetadata?.oklchL,
        oklchC: oklabMetadata?.oklchC,
        oklchH: oklabMetadata?.oklchH,
      });

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
        '--spice-text': ColorGen.generateTextColor(colorDistribution.base),
        '--spice-rgb-text': ColorGen.hexToRgb(ColorGen.generateTextColor(colorDistribution.base)),
        '--spice-subtext': ColorGen.generateSubtextColor(colorDistribution.base),
        '--spice-rgb-subtext': ColorGen.hexToRgb(ColorGen.generateSubtextColor(colorDistribution.base)),
        '--spice-highlight-elevated': colorDistribution.surface2,
        '--spice-rgb-highlight-elevated': rgbDistribution.surface2,

        // Missing Catppuccin overlay system (CRITICAL for background hierarchy)
        '--spice-overlay0': ColorGen.generateOverlayColor(colorDistribution.base, 0.04),
        '--spice-rgb-overlay0': ColorGen.hexToRgb(ColorGen.generateOverlayColor(colorDistribution.base, 0.04)),
        '--spice-overlay1': ColorGen.generateOverlayColor(colorDistribution.base, 0.08),
        '--spice-rgb-overlay1': ColorGen.hexToRgb(ColorGen.generateOverlayColor(colorDistribution.base, 0.08)),
        '--spice-overlay2': ColorGen.generateOverlayColor(colorDistribution.base, 0.12),
        '--spice-rgb-overlay2': ColorGen.hexToRgb(ColorGen.generateOverlayColor(colorDistribution.base, 0.12)),
        '--spice-crust': ColorGen.generateCrustColor(colorDistribution.base),
        '--spice-rgb-crust': ColorGen.hexToRgb(ColorGen.generateCrustColor(colorDistribution.base)),
        '--spice-mantle': ColorGen.generateMantleColor(colorDistribution.base),
        '--spice-rgb-mantle': ColorGen.hexToRgb(ColorGen.generateMantleColor(colorDistribution.base)),
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
        '--spice-flamingo': ColorGen.generateZoneColor(colorDistribution.primary, 'flamingo'), // Zone home secondary
        '--spice-rgb-flamingo': ColorGen.hexToRgb(ColorGen.generateZoneColor(colorDistribution.primary, 'flamingo')),
        '--spice-lavender': ColorGen.generateZoneColor(colorDistribution.highlight, 'lavender'), // Zone playlist/search primary
        '--spice-rgb-lavender': ColorGen.hexToRgb(ColorGen.generateZoneColor(colorDistribution.highlight, 'lavender')),
        '--spice-peach': ColorGen.generateZoneColor(colorDistribution.surface2, 'peach'), // Zone artist primary
        '--spice-rgb-peach': ColorGen.hexToRgb(ColorGen.generateZoneColor(colorDistribution.surface2, 'peach')),
        '--spice-rosewater': ColorGen.generateZoneColor(colorDistribution.surface1, 'rosewater'), // Zone artist/home secondary
        '--spice-rgb-rosewater': ColorGen.hexToRgb(ColorGen.generateZoneColor(colorDistribution.surface1, 'rosewater')),
        '--spice-sapphire': ColorGen.generateZoneColor(colorDistribution.harmonyPrimary, 'sapphire'), // Zone search secondary
        '--spice-rgb-sapphire': ColorGen.hexToRgb(ColorGen.generateZoneColor(colorDistribution.harmonyPrimary, 'sapphire')),
      };

      // MISSING CATPPUCCIN PALETTE: Additional colors used in theme
      const paletteSpicetifyUpdates = {
        '--spice-pink': ColorGen.generatePaletteColor(colorDistribution.primary, 'pink'),
        '--spice-rgb-pink': ColorGen.hexToRgb(ColorGen.generatePaletteColor(colorDistribution.primary, 'pink')),
        '--spice-sky': ColorGen.generatePaletteColor(colorDistribution.harmonyPrimary, 'sky'),
        '--spice-rgb-sky': ColorGen.hexToRgb(ColorGen.generatePaletteColor(colorDistribution.harmonyPrimary, 'sky')),
        '--spice-red': ColorGen.generatePaletteColor(colorDistribution.highlight, 'red'), // Used for errors
        '--spice-rgb-red': ColorGen.hexToRgb(ColorGen.generatePaletteColor(colorDistribution.highlight, 'red')),
        '--spice-maroon': ColorGen.generatePaletteColor(colorDistribution.shadow, 'maroon'),
        '--spice-rgb-maroon': ColorGen.hexToRgb(ColorGen.generatePaletteColor(colorDistribution.shadow, 'maroon')),
        '--spice-yellow': ColorGen.generatePaletteColor(colorDistribution.surface2, 'yellow'), // Used for warnings
        '--spice-rgb-yellow': ColorGen.hexToRgb(ColorGen.generatePaletteColor(colorDistribution.surface2, 'yellow')),
        '--spice-green': ColorGen.generatePaletteColor(colorDistribution.harmonyTertiary, 'green'), // Used for success
        '--spice-rgb-green': ColorGen.hexToRgb(ColorGen.generatePaletteColor(colorDistribution.harmonyTertiary, 'green')),
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
        '--spice-cinematic-red': ColorGen.generateCinematicRed(colorDistribution.primary),
        '--spice-rgb-cinematic-red': ColorGen.hexToRgb(ColorGen.generateCinematicRed(colorDistribution.primary)),
        '--spice-cinematic-cyan': ColorGen.generateCinematicCyan(colorDistribution.primary),
        '--spice-rgb-cinematic-cyan': ColorGen.hexToRgb(ColorGen.generateCinematicCyan(colorDistribution.primary)),
        '--spice-cinematic-yellow': ColorGen.generateCinematicYellow(colorDistribution.highlight),
        '--spice-rgb-cinematic-yellow': ColorGen.hexToRgb(ColorGen.generateCinematicYellow(colorDistribution.highlight)),

        // Holographic UI colors (luminous variants)
        '--spice-holographic-primary': ColorGen.generateHolographicPrimary(colorDistribution.primary),
        '--spice-rgb-holographic-primary': ColorGen.hexToRgb(ColorGen.generateHolographicPrimary(colorDistribution.primary)),
        '--spice-holographic-accent': ColorGen.generateHolographicAccent(colorDistribution.harmonyPrimary),
        '--spice-rgb-holographic-accent': ColorGen.hexToRgb(ColorGen.generateHolographicAccent(colorDistribution.harmonyPrimary)),
        '--spice-holographic-glow': ColorGen.generateHolographicGlow(colorDistribution.highlight),
        '--spice-rgb-holographic-glow': ColorGen.hexToRgb(ColorGen.generateHolographicGlow(colorDistribution.highlight)),
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

      // Also update our own StarryNight gradient variables to ensure consistency
      const starryNightUpdates = {
        '--sn-bg-gradient-accent': colorDistribution.primary,
        '--sn-bg-gradient-accent-rgb': rgbDistribution.primary,
        '--sn-bg-gradient-primary': colorDistribution.primary,
        '--sn-bg-gradient-primary-rgb': rgbDistribution.primary,
        '--sn-bg-gradient-secondary': colorDistribution.surface1,
        '--sn-bg-gradient-secondary-rgb': rgbDistribution.surface1,
      };

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

      // 🔧 PHASE 7.2: Dynamic Accent Variables (from DynamicAccentColorStrategy)
      // These variables were previously set by DynamicCatppuccinBridge (legacy system)
      // Now SpicetifyColorBridge is the single source of truth for ALL CSS variables
      const dynamicAccentUpdates: Record<string, string> = {};

      if (metadata?.dynamicAccentEnabled && oklabMetadata) {
        // Apply OKLAB-enhanced accent colors
        dynamicAccentUpdates['--sn-dynamic-accent-hex'] = oklabMetadata.enhancedHex;
        dynamicAccentUpdates['--sn-dynamic-accent-rgb'] = oklabMetadata.enhancedRgb;
        dynamicAccentUpdates['--sn-dynamic-accent-shadow-hex'] = oklabMetadata.shadowHex;
        dynamicAccentUpdates['--sn-dynamic-accent-shadow-rgb'] = oklabMetadata.shadowRgb;

        // OKLCH coordinate variables for advanced CSS features
        dynamicAccentUpdates['--sn-oklch-l'] = String(oklabMetadata.oklchL);
        dynamicAccentUpdates['--sn-oklch-c'] = String(oklabMetadata.oklchC);
        dynamicAccentUpdates['--sn-oklch-h'] = String(oklabMetadata.oklchH);

        // Original color preservation (for comparison/debugging)
        dynamicAccentUpdates['--sn-dynamic-accent-original-hex'] = oklabMetadata.originalHex;
        dynamicAccentUpdates['--sn-dynamic-accent-original-rgb'] = oklabMetadata.originalRgb;

        console.log("🎨 [SpicetifyColorBridge] Applied OKLAB dynamic accent variables:", {
          enhancedHex: oklabMetadata.enhancedHex,
          shadowHex: oklabMetadata.shadowHex,
          oklchCoordinates: `L:${oklabMetadata.oklchL} C:${oklabMetadata.oklchC} H:${oklabMetadata.oklchH}`
        });
      }

      // 🔧 PHASE 7.2: Music Energy Variables (from DynamicAccentColorStrategy)
      const musicEnergyUpdates: Record<string, string> = {};

      if (metadata?.musicEnergy !== undefined) {
        musicEnergyUpdates['--sn-music-energy'] = String(metadata.musicEnergy);
        musicEnergyUpdates['--sn-energy-response-multiplier'] = String(metadata.energyResponseMultiplier || 1.0);

        console.log("🎨 [SpicetifyColorBridge] Applied music energy variables:", {
          energy: metadata.musicEnergy,
          multiplier: metadata.energyResponseMultiplier
        });
      }

      // 🔧 PHASE 7.2: Living Gradient Variables (from DynamicAccentColorStrategy)
      const livingGradientUpdates: Record<string, string> = {};

      if (metadata?.baseTransformationEnabled && oklabMetadata) {
        // Use OKLAB-enhanced colors for living gradient
        livingGradientUpdates['--sn-living-base-hex'] = oklabMetadata.enhancedHex;
        livingGradientUpdates['--sn-living-base-rgb'] = oklabMetadata.enhancedRgb;

        console.log("🎨 [SpicetifyColorBridge] Applied living gradient variables");
      }

      // 🔧 PHASE 7.2: Visual Effects Variables (from DynamicAccentColorStrategy)
      const visualEffectsUpdates: Record<string, string> = {};

      if (metadata?.visualEffectsIntegrationEnabled && oklabMetadata) {
        // Use OKLAB-enhanced colors for visual effects
        visualEffectsUpdates['--sn-visual-effects-accent-hex'] = oklabMetadata.enhancedHex;
        visualEffectsUpdates['--sn-visual-effects-accent-rgb'] = oklabMetadata.enhancedRgb;
        visualEffectsUpdates['--sn-visual-effects-shadow-hex'] = oklabMetadata.shadowHex;
        visualEffectsUpdates['--sn-visual-effects-shadow-rgb'] = oklabMetadata.shadowRgb;

        console.log("🎨 [SpicetifyColorBridge] Applied visual effects variables");
      }

      // Combine ALL variables for change detection (Phase 3 optimization)
      const allVariableUpdates = {
        ...allSpicetifyUpdates,
        ...starryNightUpdates,
        ...snColorUpdates,
        // 🔧 PHASE 7.2: Add new OKLAB-enhanced variable sets
        ...dynamicAccentUpdates,
        ...musicEnergyUpdates,
        ...livingGradientUpdates,
        ...visualEffectsUpdates,
      };

      // Detect only changed variables to avoid redundant DOM updates
      const changedVariables = this.detectChangedVariables(allVariableUpdates);

      // Skip update if no changes detected (optimization)
      if (Object.keys(changedVariables).length === 0) {
        this.skippedUpdateCount++;
        if (this.config.enableDebug) {
          console.log(`🎨 [SpicetifyColorBridge] No color changes, skipping update (${this.skippedUpdateCount} skipped)`);
        }
        return;
      }

      // Apply only changed variables in a single batch with critical priority
      this.cssController.batchSetVariables(
        "SpicetifyColorBridge",
        changedVariables,
        "critical", // Critical priority for album color coordination
        "album-color-update-optimized"
      );

      // Update cache with all variables (even if not all were applied)
      this.lastAppliedVariables = { ...this.lastAppliedVariables, ...allVariableUpdates };

      // Clear semantic color cache to force refresh
      this.clearCache();

      // Track performance metrics (Phase 3 optimization)
      const updateDuration = performance.now() - updateStartTime;
      this.lastUpdateDuration = updateDuration;
      this.updateDurations.push(updateDuration);

      // Keep last 10 update durations for rolling average
      if (this.updateDurations.length > 10) {
        this.updateDurations.shift();
      }

      // Track color update metrics
      this.lastColorUpdate = Date.now();
      this.colorUpdateCount++;

      // Calculate metrics and emit color system event
      const totalVariablesCalculated = Object.keys(allVariableUpdates).length;
      const totalVariablesApplied = Object.keys(changedVariables).length;

      unifiedEventBus.emitSync('colors:applied', {
        cssVariables: allVariableUpdates, // Emit all variables for external consumers
        accentHex: colorDistribution.primary,
        accentRgb: rgbDistribution.primary,
        appliedAt: this.lastColorUpdate
      });

      if (this.config.enableDebug) {
        console.log("🎨 [SpicetifyColorBridge] Optimized color update with change detection:", {
          primaryColor: colorDistribution.primary,
          accentColor: colorDistribution.surface1,
          shadowColor: colorDistribution.shadow,
          highlightColor: colorDistribution.highlight,
          surfaceProgression: [colorDistribution.base, colorDistribution.surface0, colorDistribution.surface1, colorDistribution.surface2],
          harmonyColors: [colorDistribution.harmonyPrimary, colorDistribution.harmonySecondary, colorDistribution.harmonyTertiary],
          performanceMetrics: {
            updateDuration: updateDuration.toFixed(2) + 'ms',
            totalVariablesCalculated,
            totalVariablesApplied,
            skippedVariables: totalVariablesCalculated - totalVariablesApplied,
            changeDetectionEfficiency: ((totalVariablesCalculated - totalVariablesApplied) / totalVariablesCalculated * 100).toFixed(1) + '%',
            totalSkippedUpdates: this.skippedUpdateCount
          },
          effectColors: {
            shimmerColors: 4, // primary, secondary, tertiary, quaternary
            particleColors: 3, // glow, core, trail
            cinematicColors: 3, // red, cyan, yellow
            holographicColors: 3, // primary, accent, glow
          },
          eventEmitted: true
        });
      }

      console.log("🎨 [SpicetifyColorBridge] ═══ updateWithAlbumColors() COMPLETE ═══");
      console.log("🎨 [SpicetifyColorBridge] ✅ Successfully updated CSS variables:", {
        updateDuration: `${updateDuration.toFixed(2)}ms`,
        totalVariablesCalculated,
        totalVariablesApplied,
        primaryColor: colorDistribution.primary
      });

    } catch (error) {
      console.error("🎨 [SpicetifyColorBridge] ❌ FAILED to update with album colors:", error);
      console.error("[SpicetifyColorBridge] Failed to update with album colors:", error);
    }
  }

  public getColorMappings(): SemanticColorMapping[] {
    return SpicetifyColorBridge.SEMANTIC_MAPPINGS;
  }

  /**
   * Detect changed variables to avoid redundant DOM updates (Phase 3 optimization)
   * Compares new variables against last applied values
   *
   * @param newVariables - New CSS variable values to apply
   * @returns Only the variables that have changed
   */
  private detectChangedVariables(newVariables: Record<string, string>): Record<string, string> {
    const changed: Record<string, string> = {};
    let changeCount = 0;

    Object.entries(newVariables).forEach(([key, value]) => {
      if (this.lastAppliedVariables[key] !== value) {
        changed[key] = value;
        changeCount++;
      }
    });

    if (this.config.enableDebug && changeCount === 0) {
      console.log(`🎨 [SpicetifyColorBridge] No changes detected in ${Object.keys(newVariables).length} variables`);
    }

    return changed;
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

      // Reset Phase 3 performance tracking
      this.lastAppliedVariables = {};
      this.lastUpdateDuration = 0;
      this.updateDurations = [];
      this.skippedUpdateCount = 0;
      
      // Emit system destruction event
      unifiedEventBus.emitSync('system:destroyed', {
        systemName: 'SpicetifyColorBridge',
        timestamp: Date.now(),
        reason: 'Manual destruction'
      });
      
      if (this.config.enableDebug) {
        console.log("🎨 [SpicetifyColorBridge] System destroyed and cleaned up");
      }
      
    } catch (error) {
      console.error("[SpicetifyColorBridge] Error during destruction:", error);
    }
  }
  
  /**
   * IManagedSystem interface implementation
   */
  public updateAnimation(deltaTime: number): void {
    // SpicetifyColorBridge doesn't need animation updates
    // This is here to satisfy the IManagedSystem interface
  }
  
  /**
   * IManagedSystem health check implementation
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    // Calculate average update duration
    const avgUpdateDuration = this.updateDurations.length > 0
      ? this.updateDurations.reduce((sum, d) => sum + d, 0) / this.updateDurations.length
      : 0;

    // Calculate change detection efficiency
    const totalUpdates = this.colorUpdateCount + this.skippedUpdateCount;
    const changeDetectionEfficiency = totalUpdates > 0
      ? (this.skippedUpdateCount / totalUpdates * 100)
      : 0;

    const healthResult: HealthCheckResult = {
      system: 'SpicetifyColorBridge',
      healthy: true,
      details: 'SpicetifyColorBridge operational',
      issues: [],
      metrics: {
        initialized: this.initialized,
        spicetifyAvailable: this.isSpicetifyAvailable(),
        cssControllerAvailable: !!this.cssController,
        lastColorUpdate: this.lastColorUpdate,
        colorUpdateCount: this.colorUpdateCount,
        eventSubscriptions: this.eventSubscriptionIds.length,
        cacheSize: this.colorCache.size,
        lastCacheUpdate: this.lastCacheUpdate,
        // Phase 3 performance metrics
        lastUpdateDuration: parseFloat(this.lastUpdateDuration.toFixed(2)),
        averageUpdateDuration: parseFloat(avgUpdateDuration.toFixed(2)),
        skippedUpdateCount: this.skippedUpdateCount,
        changeDetectionEfficiency: parseFloat(changeDetectionEfficiency.toFixed(1)),
        cssVariablesManaged: 96, // Total CSS variables managed by this system
        updatePerformanceStatus: avgUpdateDuration < 50 ? 'optimal' : avgUpdateDuration < 100 ? 'acceptable' : 'needs-optimization'
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

    // Performance health checks (Phase 3)
    if (avgUpdateDuration > 100 && this.colorUpdateCount > 5) {
      healthResult.issues!.push(`Average update duration ${avgUpdateDuration.toFixed(2)}ms exceeds 100ms threshold`);
    }

    if (avgUpdateDuration > 50 && avgUpdateDuration <= 100 && this.colorUpdateCount > 5) {
      healthResult.issues!.push(`Average update duration ${avgUpdateDuration.toFixed(2)}ms exceeds optimal 50ms target (acceptable)`);
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
          console.log('🎨 [SpicetifyColorBridge] Track changed, preparing for color refresh:', data.trackUri);
        }
        // Clear cache to ensure fresh colors on track change
        this.clearCache();
      },
      'SpicetifyColorBridge'
    );

    // Listen for settings changes that might affect color processing
    const settingsChangeId = unifiedEventBus.subscribe(
      'settings:changed',
      async (data) => {
        if (data.settingKey.includes('color') || data.settingKey.includes('theme')) {
          if (this.config.enableDebug) {
            console.log('🎨 [SpicetifyColorBridge] Color-related setting changed:', data.settingKey);
          }
          this.clearCache();
        }
      },
      'SpicetifyColorBridge'
    );

    // 🔧 PHASE 5 FIX: Listen for harmonized colors from ColorProcessor
    // This reconnects the pathway broken during Phase 2 consolidation
    // ColorProcessor processes colors:extracted → emits colors:harmonized → SpicetifyColorBridge updates
    console.log("🎨 [SpicetifyColorBridge] Subscribing to 'colors:harmonized' event...");
    const colorsHarmonizedId = unifiedEventBus.subscribe(
      'colors:harmonized',
      (data: any) => {
        console.log("🎨 [SpicetifyColorBridge] ═══ RECEIVED 'colors:harmonized' EVENT ═══");
        console.log("🎨 [SpicetifyColorBridge] Event data:", {
          hasProcessedColors: !!data?.processedColors,
          colorCount: data?.processedColors ? Object.keys(data.processedColors).length : 0,
          accentHex: data?.accentHex,
          accentRgb: data?.accentRgb,
          strategies: data?.strategies,
          processingTime: data?.processingTime
        });

        if (data.processedColors) {
          console.log("🎨 [SpicetifyColorBridge] Processed colors received:", data.processedColors);

          if (this.config.enableDebug) {
            console.log('🎨 [SpicetifyColorBridge] Received harmonized colors from ColorProcessor:', {
              colorCount: Object.keys(data.processedColors).length,
              strategies: data.strategies,
              processingTime: data.processingTime
            });
          }

          // 🔧 PHASE 7.2: Pass full event data including metadata
          // Update Spicetify variables with OKLAB-processed colors
          console.log("🎨 [SpicetifyColorBridge] Updating CSS variables with album colors...");
          this.updateWithAlbumColors(data); // Pass full event data
          console.log("🎨 [SpicetifyColorBridge] ✅ CSS variables updated");
        } else {
          console.warn("🎨 [SpicetifyColorBridge] ⚠️ No processed colors in event data!");
        }
      },
      'SpicetifyColorBridge'
    );
    console.log("🎨 [SpicetifyColorBridge] ✅ Subscribed to 'colors:harmonized'");

    this.eventSubscriptionIds = [trackChangeId, settingsChangeId, colorsHarmonizedId];

    if (this.config.enableDebug) {
      console.log('🎨 [SpicetifyColorBridge] Event subscriptions established:', this.eventSubscriptionIds.length);
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
      console.log('🎨 [SpicetifyColorBridge] Event subscriptions cleaned up');
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

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================================================

/**
 * @deprecated Use SpicetifyColorBridge instead. This alias is provided for backward compatibility.
 * Will be removed in a future version after all imports are updated.
 *
 * MIGRATION RATIONALE:
 * SemanticColorManager has been renamed to SpicetifyColorBridge (2025-10-05) to accurately
 * reflect its role as the comprehensive Spicetify variable bridge (96 CSS variables) rather
 * than just semantic color management (20 variables).
 *
 * MIGRATION PATH:
 * ```typescript
 * // Old (deprecated - still works during transition)
 * import { SemanticColorManager } from '@/utils/spicetify/SemanticColorManager';
 *
 * // New (recommended - update imports to this)
 * import { SpicetifyColorBridge } from '@/utils/spicetify/SpicetifyColorBridge';
 *
 * // OR with alias (for gradual migration)
 * import { SpicetifyColorBridge as SemanticColorManager } from '@/utils/spicetify/SpicetifyColorBridge';
 * ```
 *
 * FILES TO UPDATE (3 total):
 * - src-js/audio/ColorHarmonyEngine.ts:37
 * - src-js/core/integration/SystemIntegrationCoordinator.ts:65
 * - src-js/utils/spicetify/NotificationManager.ts:8
 *
 * @see docs/architecture/adr/ADR-001-rename-semantic-color-manager.md
 */
export const SemanticColorManager = SpicetifyColorBridge;

/**
 * @deprecated Use SpicetifyColorBridge type instead. This type alias is provided for backward compatibility.
 * Will be removed in a future version after all type annotations are updated.
 */
export type SemanticColorManager = SpicetifyColorBridge;