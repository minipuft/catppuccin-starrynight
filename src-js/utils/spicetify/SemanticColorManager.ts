/**
 * SemanticColorManager - Manages Spicetify semantic color tokens for Year 3000 System
 * Provides a bridge between Spicetify's semantic color system and our theming architecture
 */

// Import spicetify types via triple-slash directive
/// <reference path="../../../types/spicetify.d.ts" />
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import * as Utils from "@/utils/core/Year3000Utilities";

declare const Spicetify: any;

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

export class SemanticColorManager {
  private config: SemanticColorConfig;
  private cssVariableBatcher: CSSVariableBatcher | null = null;
  private colorCache: Map<Spicetify.SemanticColor, string> = new Map();
  private lastCacheUpdate: number = 0;
  private initialized: boolean = false;

  // Semantic color mappings to our CSS variables
  private static readonly SEMANTIC_MAPPINGS: SemanticColorMapping[] = [
    // Text colors
    { semanticColor: "textBase", cssVariable: "--spice-text", fallbackColor: "#cdd6f4", description: "Primary text color" },
    { semanticColor: "textSubdued", cssVariable: "--spice-subtext", fallbackColor: "#a6adc8", description: "Secondary text color" },
    { semanticColor: "textBrightAccent", cssVariable: "--spice-accent", fallbackColor: "#cba6f7", description: "Accent text color" },
    { semanticColor: "textNegative", cssVariable: "--spice-red", fallbackColor: "#f38ba8", description: "Error text color" },
    { semanticColor: "textWarning", cssVariable: "--spice-yellow", fallbackColor: "#f9e2af", description: "Warning text color" },
    { semanticColor: "textPositive", cssVariable: "--spice-green", fallbackColor: "#a6e3a1", description: "Success text color" },
    { semanticColor: "textAnnouncement", cssVariable: "--spice-blue", fallbackColor: "#89b4fa", description: "Info text color" },

    // Essential colors (for icons, controls)
    { semanticColor: "essentialBase", cssVariable: "--spice-button", fallbackColor: "#cdd6f4", description: "Primary button color" },
    { semanticColor: "essentialSubdued", cssVariable: "--spice-button-disabled", fallbackColor: "#6c7086", description: "Disabled button color" },
    { semanticColor: "essentialBrightAccent", cssVariable: "--spice-button-active", fallbackColor: "#cba6f7", description: "Active button color" },
    { semanticColor: "essentialNegative", cssVariable: "--spice-notification-error", fallbackColor: "#f38ba8", description: "Error button color" },
    { semanticColor: "essentialWarning", cssVariable: "--spice-notification-warning", fallbackColor: "#f9e2af", description: "Warning button color" },
    { semanticColor: "essentialPositive", cssVariable: "--spice-notification-success", fallbackColor: "#a6e3a1", description: "Success button color" },

    // Background colors
    { semanticColor: "backgroundBase", cssVariable: "--spice-main", fallbackColor: "#1e1e2e", description: "Main background color" },
    { semanticColor: "backgroundHighlight", cssVariable: "--spice-highlight", fallbackColor: "#313244", description: "Highlight background color" },
    { semanticColor: "backgroundPress", cssVariable: "--spice-press", fallbackColor: "#45475a", description: "Press state background color" },
    { semanticColor: "backgroundElevatedBase", cssVariable: "--spice-card", fallbackColor: "#181825", description: "Card background color" },
    { semanticColor: "backgroundElevatedHighlight", cssVariable: "--spice-card-highlight", fallbackColor: "#313244", description: "Card highlight background" },
    { semanticColor: "backgroundTintedBase", cssVariable: "--spice-sidebar", fallbackColor: "#313244", description: "Sidebar background color" },
    { semanticColor: "backgroundTintedHighlight", cssVariable: "--spice-sidebar-highlight", fallbackColor: "#45475a", description: "Sidebar highlight background" },

    // Decorative colors
    { semanticColor: "decorativeBase", cssVariable: "--spice-decorative", fallbackColor: "#cdd6f4", description: "Decorative element color" },
    { semanticColor: "decorativeSubdued", cssVariable: "--spice-decorative-subdued", fallbackColor: "#9399b2", description: "Subdued decorative color" },
  ];

  constructor(config: SemanticColorConfig = {}) {
    this.config = {
      enableDebug: false,
      fallbackToSpiceColors: true,
      cacheDuration: 5000, // 5 seconds
      ...config
    };
  }

  public initialize(cssVariableBatcher?: CSSVariableBatcher): void {
    this.cssVariableBatcher = cssVariableBatcher || null;
    this.initialized = true;

    if (this.config.enableDebug) {
      console.log("🎨 [SemanticColorManager] Initialized with", {
        mappings: SemanticColorManager.SEMANTIC_MAPPINGS.length,
        batcherAvailable: !!this.cssVariableBatcher,
        spicetifyAvailable: this.isSpicetifyAvailable()
      });
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

    try {
      for (const mapping of SemanticColorManager.SEMANTIC_MAPPINGS) {
        const color = await this.getSemanticColor(mapping.semanticColor);
        this.applyColorToCSS(mapping.cssVariable, color);
        
        // Also create RGB variant for transparency support
        const rgbColor = Utils.hexToRgb(color);
        if (rgbColor) {
          const rgbVariable = mapping.cssVariable.replace('--spice-', '--spice-rgb-');
          this.applyColorToCSS(rgbVariable, `${rgbColor.r},${rgbColor.g},${rgbColor.b}`);
        }
      }

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
      if (this.isSpicetifyAvailable() && Spicetify.Platform?.getSemanticColors) {
        const semanticColors = await Spicetify.Platform.getSemanticColors();
        color = semanticColors[semanticColor];
      } else {
        // Fallback to mapping logic
        color = this.getFallbackColor(semanticColor);
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(`[SemanticColorManager] Failed to get semantic color ${semanticColor}:`, error);
      }
      color = this.getFallbackColor(semanticColor);
    }

    // Cache the result
    this.colorCache.set(semanticColor, color);
    return color;
  }

  private getFallbackColor(semanticColor: Spicetify.SemanticColor): string {
    const mapping = SemanticColorManager.SEMANTIC_MAPPINGS.find(m => m.semanticColor === semanticColor);
    if (mapping) {
      return mapping.fallbackColor;
    }

    // Ultimate fallback based on semantic color category
    if (semanticColor.startsWith('text')) {
      return '#cdd6f4'; // Catppuccin Mocha text
    } else if (semanticColor.startsWith('background')) {
      return '#1e1e2e'; // Catppuccin Mocha base
    } else if (semanticColor.startsWith('essential')) {
      return '#cba6f7'; // Catppuccin Mocha mauve
    } else if (semanticColor.startsWith('decorative')) {
      return '#9399b2'; // Catppuccin Mocha overlay1
    }

    return '#cdd6f4'; // Default fallback
  }

  private applyColorToCSS(cssVariable: string, color: string): void {
    if (this.cssVariableBatcher) {
      this.cssVariableBatcher.queueCSSVariableUpdate(cssVariable, color);
    } else {
      // Direct application fallback
      document.documentElement.style.setProperty(cssVariable, color);
    }
  }

  private isSpicetifyAvailable(): boolean {
    return typeof Spicetify !== 'undefined' && 
           Spicetify.Platform && 
           typeof Spicetify.Platform.getSemanticColors === 'function';
  }

  public flushUpdates(): void {
    if (this.cssVariableBatcher) {
      this.cssVariableBatcher.flushCSSVariableBatch();
    }
  }

  public clearCache(): void {
    this.colorCache.clear();
    this.lastCacheUpdate = 0;
  }

  public getColorMappings(): SemanticColorMapping[] {
    return SemanticColorManager.SEMANTIC_MAPPINGS;
  }

  public destroy(): void {
    this.clearCache();
    this.cssVariableBatcher = null;
    this.initialized = false;
  }
}