/**
 * VariantResolver - Maps Spicetify musical variants to CSS typography scales
 * Integrates with Year 3000 System's theming architecture for consistent typography
 */

// Import spicetify types via triple-slash directive
/// <reference path="../../../types/spicetify.d.ts" />
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";

declare const Spicetify: any;

export interface VariantConfig {
  enableDebug?: boolean;
  useSystemFontStack?: boolean;
  enableResponsiveScaling?: boolean;
  performanceMode?: 'standard' | 'optimized';
}

export interface VariantMapping {
  variant: Spicetify.Variant;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  cssClass: string;
  description: string;
  contextualUsage: string[];
}

export interface VariantContext {
  component: string;
  state: 'normal' | 'hover' | 'active' | 'disabled';
  musicContext?: {
    energy: number;
    tempo: number;
    valence: number;
  };
}

export class VariantResolver {
  private config: VariantConfig;
  private cssConsciousnessController: UnifiedCSSConsciousnessController | null = null;
  private variantCache: Map<string, VariantMapping> = new Map();
  private initialized: boolean = false;

  // Musical variant mappings following Spotify's typography hierarchy
  private static readonly VARIANT_MAPPINGS: VariantMapping[] = [
    // Smallest variants (fine text, captions)
    { 
      variant: "bass", 
      fontSize: "0.75rem", 
      fontWeight: "400", 
      lineHeight: "1.2", 
      letterSpacing: "0.01em",
      cssClass: "sn-text-bass",
      description: "Small caption text",
      contextualUsage: ["captions", "fine-print", "tooltips"]
    },
    { 
      variant: "forte", 
      fontSize: "0.8125rem", 
      fontWeight: "400", 
      lineHeight: "1.25", 
      letterSpacing: "0.005em",
      cssClass: "sn-text-forte",
      description: "Secondary body text",
      contextualUsage: ["secondary-text", "metadata", "descriptions"]
    },

    // Medium variants (body text, interface elements)
    { 
      variant: "brio", 
      fontSize: "0.875rem", 
      fontWeight: "400", 
      lineHeight: "1.35", 
      letterSpacing: "0em",
      cssClass: "sn-text-brio",
      description: "Standard body text",
      contextualUsage: ["body-text", "settings", "general-ui"]
    },
    { 
      variant: "altoBrio", 
      fontSize: "0.875rem", 
      fontWeight: "500", 
      lineHeight: "1.35", 
      letterSpacing: "0em",
      cssClass: "sn-text-alto-brio",
      description: "Medium-weight body text",
      contextualUsage: ["emphasized-body", "form-labels", "navigation"]
    },
    { 
      variant: "alto", 
      fontSize: "0.9375rem", 
      fontWeight: "400", 
      lineHeight: "1.4", 
      letterSpacing: "0em",
      cssClass: "sn-text-alto",
      description: "Large body text",
      contextualUsage: ["article-text", "settings-descriptions", "content"]
    },

    // Interface variants (buttons, controls)
    { 
      variant: "canon", 
      fontSize: "1rem", 
      fontWeight: "400", 
      lineHeight: "1.4", 
      letterSpacing: "0em",
      cssClass: "sn-text-canon",
      description: "Standard interface text",
      contextualUsage: ["buttons", "form-controls", "menu-items"]
    },
    { 
      variant: "celloCanon", 
      fontSize: "1rem", 
      fontWeight: "500", 
      lineHeight: "1.4", 
      letterSpacing: "0em",
      cssClass: "sn-text-cello-canon",
      description: "Medium-weight interface text",
      contextualUsage: ["primary-buttons", "active-states", "emphasis"]
    },
    { 
      variant: "cello", 
      fontSize: "1.125rem", 
      fontWeight: "400", 
      lineHeight: "1.45", 
      letterSpacing: "0em",
      cssClass: "sn-text-cello",
      description: "Large interface text",
      contextualUsage: ["large-buttons", "hero-text", "prominent-ui"]
    },

    // Content variants (headings, titles)
    { 
      variant: "ballad", 
      fontSize: "1.25rem", 
      fontWeight: "400", 
      lineHeight: "1.5", 
      letterSpacing: "-0.01em",
      cssClass: "sn-text-ballad",
      description: "Small heading text",
      contextualUsage: ["small-headings", "section-titles", "card-headers"]
    },
    { 
      variant: "balladBold", 
      fontSize: "1.25rem", 
      fontWeight: "600", 
      lineHeight: "1.5", 
      letterSpacing: "-0.01em",
      cssClass: "sn-text-ballad-bold",
      description: "Bold small heading text",
      contextualUsage: ["emphasized-headings", "modal-titles", "important-sections"]
    },
    { 
      variant: "viola", 
      fontSize: "1.5rem", 
      fontWeight: "400", 
      lineHeight: "1.4", 
      letterSpacing: "-0.015em",
      cssClass: "sn-text-viola",
      description: "Medium heading text",
      contextualUsage: ["page-titles", "section-headers", "prominent-text"]
    },
    { 
      variant: "violaBold", 
      fontSize: "1.5rem", 
      fontWeight: "600", 
      lineHeight: "1.4", 
      letterSpacing: "-0.015em",
      cssClass: "sn-text-viola-bold",
      description: "Bold medium heading text",
      contextualUsage: ["main-headings", "page-headers", "feature-titles"]
    },

    // Specialized variants
    { 
      variant: "mesto", 
      fontSize: "1.75rem", 
      fontWeight: "400", 
      lineHeight: "1.35", 
      letterSpacing: "-0.02em",
      cssClass: "sn-text-mesto",
      description: "Large heading text",
      contextualUsage: ["large-headings", "hero-titles", "landing-headers"]
    },
    { 
      variant: "mestoBold", 
      fontSize: "1.75rem", 
      fontWeight: "600", 
      lineHeight: "1.35", 
      letterSpacing: "-0.02em",
      cssClass: "sn-text-mesto-bold",
      description: "Bold large heading text",
      contextualUsage: ["primary-headings", "brand-text", "hero-emphasis"]
    },
    { 
      variant: "metronome", 
      fontSize: "0.875rem", 
      fontWeight: "500", 
      lineHeight: "1.2", 
      letterSpacing: "0.05em",
      cssClass: "sn-text-metronome",
      description: "Technical/monospace-style text",
      contextualUsage: ["technical-info", "timestamps", "counters", "debug-info"]
    },

    // Display variants (large, prominent text)
    { 
      variant: "finale", 
      fontSize: "2rem", 
      fontWeight: "400", 
      lineHeight: "1.25", 
      letterSpacing: "-0.025em",
      cssClass: "sn-text-finale",
      description: "Display text",
      contextualUsage: ["display-text", "splash-screens", "major-headings"]
    },
    { 
      variant: "finaleBold", 
      fontSize: "2rem", 
      fontWeight: "600", 
      lineHeight: "1.25", 
      letterSpacing: "-0.025em",
      cssClass: "sn-text-finale-bold",
      description: "Bold display text",
      contextualUsage: ["primary-display", "brand-headers", "major-emphasis"]
    },
    { 
      variant: "minuet", 
      fontSize: "2.5rem", 
      fontWeight: "400", 
      lineHeight: "1.2", 
      letterSpacing: "-0.03em",
      cssClass: "sn-text-minuet",
      description: "Large display text",
      contextualUsage: ["large-display", "splash-titles", "hero-text"]
    },
    { 
      variant: "minuetBold", 
      fontSize: "2.5rem", 
      fontWeight: "600", 
      lineHeight: "1.2", 
      letterSpacing: "-0.03em",
      cssClass: "sn-text-minuet-bold",
      description: "Bold large display text",
      contextualUsage: ["primary-display", "brand-showcase", "hero-emphasis"]
    }
  ];

  constructor(config: VariantConfig = {}) {
    this.config = {
      enableDebug: false,
      useSystemFontStack: false,
      enableResponsiveScaling: true,
      performanceMode: 'standard',
      ...config
    };
  }

  public initialize(cssConsciousnessController?: UnifiedCSSConsciousnessController): void {
    this.cssConsciousnessController = cssConsciousnessController || null;
    this.initialized = true;
    
    // Generate CSS variables for all variants
    this.generateVariantCSSVariables();
    
    if (this.config.enableDebug) {
      console.log("📝 [VariantResolver] Initialized with", {
        variants: VariantResolver.VARIANT_MAPPINGS.length,
        batcherAvailable: !!this.cssConsciousnessController,
        config: this.config
      });
    }
  }

  public getVariantMapping(variant: Spicetify.Variant): VariantMapping | null {
    return VariantResolver.VARIANT_MAPPINGS.find(m => m.variant === variant) || null;
  }

  public getVariantCSS(variant: Spicetify.Variant, context?: VariantContext): string {
    const mapping = this.getVariantMapping(variant);
    if (!mapping) {
      if (this.config.enableDebug) {
        console.warn(`[VariantResolver] Unknown variant: ${variant}`);
      }
      return '';
    }

    // Apply contextual adjustments
    let adjustedMapping = { ...mapping };
    if (context?.musicContext) {
      adjustedMapping = this.applyMusicContextAdjustments(adjustedMapping, context.musicContext);
    }

    return `
      font-size: ${adjustedMapping.fontSize};
      font-weight: ${adjustedMapping.fontWeight};
      line-height: ${adjustedMapping.lineHeight};
      letter-spacing: ${adjustedMapping.letterSpacing};
    `.trim();
  }

  public getVariantClass(variant: Spicetify.Variant): string {
    const mapping = this.getVariantMapping(variant);
    return mapping?.cssClass || `sn-text-${variant}`;
  }

  public applyVariantToElement(element: HTMLElement, variant: Spicetify.Variant, context?: VariantContext): void {
    const css = this.getVariantCSS(variant, context);
    const className = this.getVariantClass(variant);
    
    // Apply CSS properties directly
    const cssProps = css.split(';').filter(prop => prop.trim());
    cssProps.forEach(prop => {
      const [property, value] = prop.split(':').map(s => s.trim());
      if (property && value) {
        element.style.setProperty(property, value);
      }
    });
    
    // Add variant class for additional styling
    element.classList.add(className);
  }

  private generateVariantCSSVariables(): void {
    VariantResolver.VARIANT_MAPPINGS.forEach(mapping => {
      const prefix = `--sn-variant-${mapping.variant}`;
      
      this.setCSSVariable(`${prefix}-font-size`, mapping.fontSize);
      this.setCSSVariable(`${prefix}-font-weight`, mapping.fontWeight);
      this.setCSSVariable(`${prefix}-line-height`, mapping.lineHeight);
      this.setCSSVariable(`${prefix}-letter-spacing`, mapping.letterSpacing);
    });
    
    this.flushUpdates();
  }

  private applyMusicContextAdjustments(mapping: VariantMapping, musicContext: { energy: number; tempo: number; valence: number }): VariantMapping {
    const adjusted = { ...mapping };
    
    // Scale font size based on energy (0-1)
    const energyMultiplier = 1 + (musicContext.energy * 0.1); // Max 10% increase
    const currentSize = parseFloat(adjusted.fontSize);
    adjusted.fontSize = `${currentSize * energyMultiplier}rem`;
    
    // Adjust letter spacing based on tempo (subtle effect)
    const tempoAdjustment = (musicContext.tempo - 120) / 10000; // Very subtle
    const currentSpacing = parseFloat(adjusted.letterSpacing) || 0;
    adjusted.letterSpacing = `${currentSpacing + tempoAdjustment}em`;
    
    return adjusted;
  }

  private setCSSVariable(property: string, value: string): void {
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.queueCSSVariableUpdate(property, value);
    } else {
      document.documentElement.style.setProperty(property, value);
    }
  }

  public flushUpdates(): void {
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.flushCSSVariableBatch();
    }
  }

  public getRecommendedVariant(usage: string): Spicetify.Variant | null {
    for (const mapping of VariantResolver.VARIANT_MAPPINGS) {
      if (mapping.contextualUsage.includes(usage)) {
        return mapping.variant;
      }
    }
    return null;
  }

  public getAllVariants(): VariantMapping[] {
    return VariantResolver.VARIANT_MAPPINGS;
  }

  public destroy(): void {
    this.variantCache.clear();
    this.cssConsciousnessController = null;
    this.initialized = false;
  }
}