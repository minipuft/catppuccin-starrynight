/**
 * Palette System Manager - Unified Color Palette Abstraction
 * 
 * Provides unified access to multiple palette systems (Catppuccin, Year 3000).
 * Enables seamless switching between aesthetic systems through configuration.
 * Maintains identical API to existing color utilities for zero breaking changes.
 * 
 * @architecture Central abstraction layer for all color palette access
 * @performance Static palette lookup with minimal overhead
 */

import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import type { 
  CatppuccinColor, 
  CatppuccinColorName, 
  CatppuccinFlavor, 
  CatppuccinPalette,
  getBrightnessAdjustedBaseColor as getCatppuccinBrightnessAdjustedBaseColor,
  getBrightnessAdjustedSurfaceColor as getCatppuccinBrightnessAdjustedSurfaceColor,
  getDefaultAccentColor as getCatppuccinDefaultAccentColor,
  getCatppuccinAccentColor
} from "@/utils/color/CatppuccinPalettes";
import { CATPPUCCIN_PALETTES } from "@/utils/color/CatppuccinPalettes";
import type {
  Year3000Color,
  Year3000ColorName,
  Year3000Flavor,
  Year3000Palette,
  getBrightnessAdjustedBaseColor as getYear3000BrightnessAdjustedBaseColor,
  getBrightnessAdjustedSurfaceColor as getYear3000BrightnessAdjustedSurfaceColor,
  getDefaultAccentColor as getYear3000DefaultAccentColor,
  getYear3000AccentColor,
  getCinematicGradientPair as getYear3000CinematicGradientPair,
  getAnimatedFlowColors as getYear3000AnimatedFlowColors
} from "@/utils/color/Year3000Palettes";
import { YEAR3000_PALETTES } from "@/utils/color/Year3000Palettes";

// Import actual functions dynamically to avoid circular dependencies
import * as CatppuccinUtils from "@/utils/color/CatppuccinPalettes";
import * as Year3000Utils from "@/utils/color/Year3000Palettes";

export type PaletteSystem = 'catppuccin' | 'year3000';
export type UnifiedFlavor = CatppuccinFlavor | Year3000Flavor;
export type UnifiedColorName = CatppuccinColorName | Year3000ColorName;
export type UnifiedColor = CatppuccinColor | Year3000Color;
export type UnifiedPalette = CatppuccinPalette | Year3000Palette;

/**
 * Central palette system manager providing unified access to all palette systems
 */
export class PaletteSystemManager {
  private static instance: PaletteSystemManager;
  
  private constructor() {}
  
  public static getInstance(): PaletteSystemManager {
    if (!PaletteSystemManager.instance) {
      PaletteSystemManager.instance = new PaletteSystemManager();
    }
    return PaletteSystemManager.instance;
  }
  
  /**
   * Get the currently active palette system from configuration
   */
  getCurrentPaletteSystem(): PaletteSystem {
    return ADVANCED_SYSTEM_CONFIG.paletteSystem || 'catppuccin';
  }
  
  /**
   * Get the current active palette based on configuration
   */
  getCurrentPalette(): Record<string, UnifiedPalette> {
    const system = this.getCurrentPaletteSystem();
    return system === 'year3000' ? YEAR3000_PALETTES : CATPPUCCIN_PALETTES;
  }
  
  /**
   * Get the current default flavor for the active palette system
   */
  getCurrentDefaultFlavor(): UnifiedFlavor {
    const system = this.getCurrentPaletteSystem();
    return system === 'year3000' ? 'balanced' : 'mocha';
  }
  
  /**
   * Get brightness-adjusted base color from current palette system
   */
  getBrightnessAdjustedBaseColor(
    flavor?: UnifiedFlavor,
    brightnessMode: 'bright' | 'balanced' | 'dark' = 'balanced'
  ): UnifiedColor {
    const system = this.getCurrentPaletteSystem();
    const activeFlavor = flavor || this.getCurrentDefaultFlavor();
    
    if (system === 'year3000') {
      return Year3000Utils.getBrightnessAdjustedBaseColor(
        activeFlavor as Year3000Flavor, 
        brightnessMode
      );
    } else {
      return CatppuccinUtils.getBrightnessAdjustedBaseColor(
        activeFlavor as CatppuccinFlavor, 
        brightnessMode
      );
    }
  }
  
  /**
   * Get brightness-adjusted surface color from current palette system
   */
  getBrightnessAdjustedSurfaceColor(
    flavor?: UnifiedFlavor,
    brightnessMode: 'bright' | 'balanced' | 'dark' = 'balanced'
  ): UnifiedColor {
    const system = this.getCurrentPaletteSystem();
    const activeFlavor = flavor || this.getCurrentDefaultFlavor();
    
    if (system === 'year3000') {
      return Year3000Utils.getBrightnessAdjustedSurfaceColor(
        activeFlavor as Year3000Flavor, 
        brightnessMode
      );
    } else {
      return CatppuccinUtils.getBrightnessAdjustedSurfaceColor(
        activeFlavor as CatppuccinFlavor, 
        brightnessMode
      );
    }
  }
  
  /**
   * Get default accent color from current palette system
   */
  getDefaultAccentColor(flavor?: UnifiedFlavor): UnifiedColor {
    const system = this.getCurrentPaletteSystem();
    const activeFlavor = flavor || this.getCurrentDefaultFlavor();
    
    if (system === 'year3000') {
      return Year3000Utils.getDefaultAccentColor(activeFlavor as Year3000Flavor);
    } else {
      return CatppuccinUtils.getDefaultAccentColor(activeFlavor as CatppuccinFlavor);
    }
  }
  
  /**
   * Get specific accent color from current palette system
   */
  getAccentColor(
    accentName: UnifiedColorName,
    flavor?: UnifiedFlavor
  ): UnifiedColor {
    const system = this.getCurrentPaletteSystem();
    const activeFlavor = flavor || this.getCurrentDefaultFlavor();
    
    if (system === 'year3000') {
      return Year3000Utils.getYear3000AccentColor(
        activeFlavor as Year3000Flavor,
        accentName as Year3000ColorName
      );
    } else {
      return CatppuccinUtils.getCatppuccinAccentColor(
        activeFlavor as CatppuccinFlavor,
        accentName as CatppuccinColorName
      );
    }
  }
  
  /**
   * Get cinematic gradient colors (Year 3000 specific, fallback for Catppuccin)
   */
  getCinematicGradientPair(
    flavor?: UnifiedFlavor,
    intensity: 'low' | 'medium' | 'high' = 'medium'
  ): [UnifiedColor, UnifiedColor] {
    const system = this.getCurrentPaletteSystem();
    const activeFlavor = flavor || this.getCurrentDefaultFlavor();
    
    if (system === 'year3000') {
      return Year3000Utils.getCinematicGradientPair(
        activeFlavor as Year3000Flavor,
        intensity
      );
    } else {
      // Fallback: use Catppuccin colors for gradient pairs
      const palette = CATPPUCCIN_PALETTES[activeFlavor as CatppuccinFlavor];
      switch (intensity) {
        case 'low':
          return [palette.mauve, palette.blue];
        case 'medium':
          return [palette.pink, palette.peach];
        case 'high':
          return [palette.red, palette.teal];
        default:
          return [palette.mauve, palette.pink];
      }
    }
  }
  
  /**
   * Get smooth flow colors (Year 3000 specific, fallback for Catppuccin)
   */
  getAnimatedFlowColors(flavor?: UnifiedFlavor): {
    primary: UnifiedColor;
    secondary: UnifiedColor;
    tertiary: UnifiedColor;
    atmosphere: UnifiedColor;
  } {
    const system = this.getCurrentPaletteSystem();
    const activeFlavor = flavor || this.getCurrentDefaultFlavor();
    
    if (system === 'year3000') {
      return Year3000Utils.getAnimatedFlowColors(activeFlavor as Year3000Flavor);
    } else {
      // Fallback: use Catppuccin colors for smooth flow
      const palette = CATPPUCCIN_PALETTES[activeFlavor as CatppuccinFlavor];
      return {
        primary: palette.mauve,
        secondary: palette.pink,
        tertiary: palette.blue,
        atmosphere: palette.base
      };
    }
  }
  
  /**
   * Check if current palette system supports cinematic features
   */
  supportsCinematicFeatures(): boolean {
    return this.getCurrentPaletteSystem() === 'year3000';
  }
  
  /**
   * Get palette system display name for UI
   */
  getPaletteSystemDisplayName(): string {
    const system = this.getCurrentPaletteSystem();
    return system === 'year3000' ? 'Year 3000 Cinematic' : 'Catppuccin Classic';
  }
}

// Singleton instance for global access
export const paletteSystemManager = PaletteSystemManager.getInstance();

// Convenience functions that mirror existing palette utilities
export function getBrightnessAdjustedBaseColor(
  flavor?: UnifiedFlavor,
  brightnessMode: 'bright' | 'balanced' | 'dark' = 'balanced'
): UnifiedColor {
  return paletteSystemManager.getBrightnessAdjustedBaseColor(flavor, brightnessMode);
}

export function getBrightnessAdjustedSurfaceColor(
  flavor?: UnifiedFlavor,
  brightnessMode: 'bright' | 'balanced' | 'dark' = 'balanced'
): UnifiedColor {
  return paletteSystemManager.getBrightnessAdjustedSurfaceColor(flavor, brightnessMode);
}

export function getDefaultAccentColor(flavor?: UnifiedFlavor): UnifiedColor {
  return paletteSystemManager.getDefaultAccentColor(flavor);
}

export function getAccentColor(
  accentName: UnifiedColorName,
  flavor?: UnifiedFlavor
): UnifiedColor {
  return paletteSystemManager.getAccentColor(accentName, flavor);
}

export function getCinematicGradientPair(
  flavor?: UnifiedFlavor,
  intensity: 'low' | 'medium' | 'high' = 'medium'
): [UnifiedColor, UnifiedColor] {
  return paletteSystemManager.getCinematicGradientPair(flavor, intensity);
}

export function getAnimatedFlowColors(flavor?: UnifiedFlavor): {
  primary: UnifiedColor;
  secondary: UnifiedColor;
  tertiary: UnifiedColor;
  atmosphere: UnifiedColor;
} {
  return paletteSystemManager.getAnimatedFlowColors(flavor);
}