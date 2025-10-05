/**
 * Unit Tests for SpicetifyColorGenerators
 *
 * PURPOSE: Verify behavioral parity with original SpicetifyColorBridge implementation
 * STRATEGY: Test each pure function in isolation with comprehensive coverage
 * GOAL: 100% line coverage, 100% branch coverage
 *
 * Test Categories:
 * 1. Core Color Distribution
 * 2. Color Variants (darker, lighter, hue rotation)
 * 3. Effect-Specific Generators (cinematic, holographic)
 * 4. UI-Specific Generators (text, overlay, zone, palette)
 * 5. Color Conversion Utilities
 * 6. Edge Cases and Error Handling
 */

import * as SpicetifyColorGen from '@/utils/color/SpicetifyColorGenerators';

describe('SpicetifyColorGenerators', () => {
  describe('Core Color Distribution', () => {
    test('generateIntelligentColorDistribution with all parameters', () => {
      const result = SpicetifyColorGen.generateIntelligentColorDistribution(
        '#c6a0f6', // primary
        '#8aadf4', // accent
        '#24273a', // shadow
        '#cad3f5'  // highlight
      );

      expect(result).toHaveProperty('primary', '#c6a0f6');
      expect(result).toHaveProperty('surface1', '#8aadf4'); // accent becomes surface1
      expect(result).toHaveProperty('shadow', '#24273a');
      expect(result).toHaveProperty('highlight', '#cad3f5');
      expect(result).toHaveProperty('base');
      expect(result).toHaveProperty('surface0');
      expect(result).toHaveProperty('surface2');
      expect(result).toHaveProperty('harmonyPrimary');
      expect(result).toHaveProperty('harmonySecondary');
      expect(result).toHaveProperty('harmonyTertiary');

      // Verify all values are hex colors
      Object.values(result).forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    test('generateIntelligentColorDistribution with only primary color', () => {
      const result = SpicetifyColorGen.generateIntelligentColorDistribution('#c6a0f6');

      // Should generate all required colors
      expect(result.primary).toBe('#c6a0f6');
      expect(result.surface1).toBe('#c6a0f6'); // accent defaults to primary
      expect(result.shadow).not.toBe('#c6a0f6'); // should be darker
      expect(result.highlight).not.toBe('#c6a0f6'); // should be lighter
    });

    test('convertColorsToRgb converts all colors to RGB strings', () => {
      const distribution = SpicetifyColorGen.generateIntelligentColorDistribution('#c6a0f6');
      const rgbDistribution = SpicetifyColorGen.convertColorsToRgb(distribution);

      // Verify all keys match
      expect(Object.keys(rgbDistribution)).toEqual(Object.keys(distribution));

      // Verify RGB format: "r, g, b"
      Object.values(rgbDistribution).forEach(rgb => {
        expect(rgb).toMatch(/^\d+, \d+, \d+$/);
      });
    });
  });

  describe('Color Variants', () => {
    describe('generateDarkerVariant', () => {
      test('darkens color by specified factor', () => {
        const original = '#c6a0f6'; // Purple
        const darker = SpicetifyColorGen.generateDarkerVariant(original, 0.3);

        expect(darker).toMatch(/^#[0-9a-f]{6}$/i);
        expect(darker).not.toBe(original);

        // Verify it's actually darker
        const origRgb = SpicetifyColorGen.hexToRgbObject(original)!;
        const darkRgb = SpicetifyColorGen.hexToRgbObject(darker)!;
        expect(darkRgb.r).toBeLessThan(origRgb.r);
        expect(darkRgb.g).toBeLessThan(origRgb.g);
        expect(darkRgb.b).toBeLessThan(origRgb.b);
      });

      test('handles factor of 0 (no change)', () => {
        const original = '#c6a0f6';
        const result = SpicetifyColorGen.generateDarkerVariant(original, 0);
        expect(result).toBe(original);
      });

      test('handles factor of 1 (black)', () => {
        const result = SpicetifyColorGen.generateDarkerVariant('#c6a0f6', 1);
        expect(result).toBe('#000000');
      });

      test('returns original on invalid input', () => {
        const invalid = 'invalid-color';
        const result = SpicetifyColorGen.generateDarkerVariant(invalid, 0.5);
        expect(result).toBe(invalid);
      });
    });

    describe('generateLighterVariant', () => {
      test('lightens color by specified factor', () => {
        const original = '#c6a0f6';
        const lighter = SpicetifyColorGen.generateLighterVariant(original, 0.2);

        expect(lighter).toMatch(/^#[0-9a-f]{6}$/i);
        expect(lighter).not.toBe(original);

        // Verify it's actually lighter
        const origRgb = SpicetifyColorGen.hexToRgbObject(original)!;
        const lightRgb = SpicetifyColorGen.hexToRgbObject(lighter)!;
        expect(lightRgb.r).toBeGreaterThan(origRgb.r);
        expect(lightRgb.g).toBeGreaterThan(origRgb.g);
        expect(lightRgb.b).toBeGreaterThan(origRgb.b);
      });

      test('handles factor of 0 (no change)', () => {
        const original = '#c6a0f6';
        const result = SpicetifyColorGen.generateLighterVariant(original, 0);
        expect(result).toBe(original);
      });

      test('handles factor of 1 (white)', () => {
        const result = SpicetifyColorGen.generateLighterVariant('#c6a0f6', 1);
        expect(result).toBe('#ffffff');
      });
    });

    describe('generateHueRotatedColor', () => {
      test('rotates hue by specified degrees', () => {
        const original = '#c6a0f6'; // Purple
        const rotated = SpicetifyColorGen.generateHueRotatedColor(original, 120);

        expect(rotated).toMatch(/^#[0-9a-f]{6}$/i);
        expect(rotated).not.toBe(original);
      });

      test('handles positive rotation', () => {
        const result = SpicetifyColorGen.generateHueRotatedColor('#ff0000', 120);
        expect(result).toMatch(/^#[0-9a-f]{6}$/i);
      });

      test('handles negative rotation', () => {
        const result = SpicetifyColorGen.generateHueRotatedColor('#ff0000', -60);
        expect(result).toMatch(/^#[0-9a-f]{6}$/i);
      });

      test('handles rotation > 360 (wraps around)', () => {
        const result1 = SpicetifyColorGen.generateHueRotatedColor('#ff0000', 360);
        const result2 = SpicetifyColorGen.generateHueRotatedColor('#ff0000', 0);
        // Should be approximately the same (may have rounding differences)
        expect(result1).toBe(result2);
      });
    });
  });

  describe('Effect-Specific Generators', () => {
    test('generateCinematicRed creates dramatic red', () => {
      const result = SpicetifyColorGen.generateCinematicRed('#c6a0f6');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);

      const rgb = SpicetifyColorGen.hexToRgbObject(result)!;
      // Should have boosted red channel
      expect(rgb.r).toBeGreaterThan(150);
    });

    test('generateCinematicCyan creates dramatic cyan', () => {
      const result = SpicetifyColorGen.generateCinematicCyan('#c6a0f6');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);

      const rgb = SpicetifyColorGen.hexToRgbObject(result)!;
      // Should have high green and blue channels
      expect(rgb.g).toBeGreaterThan(100);
      expect(rgb.b).toBeGreaterThan(100);
    });

    test('generateCinematicYellow creates bright yellow', () => {
      const result = SpicetifyColorGen.generateCinematicYellow('#cad3f5');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);

      const rgb = SpicetifyColorGen.hexToRgbObject(result)!;
      // Should have high red and green channels
      expect(rgb.r).toBeGreaterThan(150);
      expect(rgb.g).toBeGreaterThan(150);
    });

    test('generateHolographicPrimary enhances saturation', () => {
      const original = '#c6a0f6';
      const result = SpicetifyColorGen.generateHolographicPrimary(original);
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
      expect(result).not.toBe(original);
    });

    test('generateHolographicAccent applies prismatic shift', () => {
      const result = SpicetifyColorGen.generateHolographicAccent('#8aadf4');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    test('generateHolographicGlow creates luminous glow', () => {
      const result = SpicetifyColorGen.generateHolographicGlow('#cad3f5');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);

      const rgb = SpicetifyColorGen.hexToRgbObject(result)!;
      // Should be very light (high RGB values)
      expect(rgb.r).toBeGreaterThan(200);
      expect(rgb.g).toBeGreaterThan(200);
      expect(rgb.b).toBeGreaterThan(200);
    });
  });

  describe('UI-Specific Generators', () => {
    test('generateTextColor returns light text for dark background', () => {
      const darkBg = '#24273a';
      const textColor = SpicetifyColorGen.generateTextColor(darkBg);
      expect(textColor).toBe('#CAD3F5'); // Catppuccin light text
    });

    test('generateTextColor returns dark text for light background', () => {
      const lightBg = '#f0f0f0';
      const textColor = SpicetifyColorGen.generateTextColor(lightBg);
      expect(textColor).toBe('#24273A'); // Catppuccin dark text
    });

    test('generateSubtextColor returns appropriate contrast', () => {
      const darkBg = '#24273a';
      const subtextColor = SpicetifyColorGen.generateSubtextColor(darkBg);
      expect(subtextColor).toBe('#A5ADCB'); // Catppuccin medium light
    });

    test('generateOverlayColor lightens for dark backgrounds', () => {
      const darkBg = '#24273a';
      const overlay = SpicetifyColorGen.generateOverlayColor(darkBg, 0.1);
      expect(overlay).toMatch(/^#[0-9a-f]{6}$/i);

      const bgRgb = SpicetifyColorGen.hexToRgbObject(darkBg)!;
      const overlayRgb = SpicetifyColorGen.hexToRgbObject(overlay)!;
      // Overlay should be lighter than background
      expect(overlayRgb.r).toBeGreaterThanOrEqual(bgRgb.r);
    });

    test('generateCrustColor creates border color', () => {
      const result = SpicetifyColorGen.generateCrustColor('#24273a');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    test('generateMantleColor creates intermediate color', () => {
      const result = SpicetifyColorGen.generateMantleColor('#24273a');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    test('generateZoneColor creates zone-specific variants', () => {
      const baseColor = '#c6a0f6';
      const zones: SpicetifyColorGen.ZoneColorType[] = ['flamingo', 'lavender', 'peach', 'rosewater', 'sapphire'];

      zones.forEach(zone => {
        const result = SpicetifyColorGen.generateZoneColor(baseColor, zone);
        expect(result).toMatch(/^#[0-9a-f]{6}$/i);
        // Each zone should produce a different color
        expect(result).not.toBe(baseColor);
      });
    });

    test('generatePaletteColor creates palette-specific variants', () => {
      const baseColor = '#c6a0f6';
      const palettes: SpicetifyColorGen.PaletteColorType[] = ['pink', 'sky', 'red', 'maroon', 'yellow', 'green'];

      palettes.forEach(palette => {
        const result = SpicetifyColorGen.generatePaletteColor(baseColor, palette);
        expect(result).toMatch(/^#[0-9a-f]{6}$/i);
        // Each palette should produce a different color
        expect(result).not.toBe(baseColor);
      });
    });
  });

  describe('Color Conversion Utilities', () => {
    describe('hexToRgbObject', () => {
      test('converts 6-character hex to RGB', () => {
        const result = SpicetifyColorGen.hexToRgbObject('#c6a0f6');
        expect(result).toEqual({ r: 198, g: 160, b: 246 });
      });

      test('converts 3-character hex to RGB', () => {
        const result = SpicetifyColorGen.hexToRgbObject('#abc');
        expect(result).toEqual({ r: 170, g: 187, b: 204 });
      });

      test('handles hex without # prefix', () => {
        const result = SpicetifyColorGen.hexToRgbObject('c6a0f6');
        expect(result).toEqual({ r: 198, g: 160, b: 246 });
      });

      test('returns null for invalid hex', () => {
        expect(SpicetifyColorGen.hexToRgbObject('invalid')).toBeNull();
        expect(SpicetifyColorGen.hexToRgbObject('#12')).toBeNull();
        expect(SpicetifyColorGen.hexToRgbObject('#1234567')).toBeNull();
      });
    });

    describe('rgbToHex', () => {
      test('converts RGB values to hex', () => {
        const result = SpicetifyColorGen.rgbToHex(198, 160, 246);
        expect(result).toBe('#c6a0f6');
      });

      test('handles edge case values', () => {
        expect(SpicetifyColorGen.rgbToHex(0, 0, 0)).toBe('#000000');
        expect(SpicetifyColorGen.rgbToHex(255, 255, 255)).toBe('#ffffff');
      });

      test('clamps out-of-range values', () => {
        expect(SpicetifyColorGen.rgbToHex(-10, 300, 128)).toBe('#00ff80');
      });
    });

    describe('rgbToHsl and hslToRgb roundtrip', () => {
      test('RGB -> HSL -> RGB roundtrip maintains values', () => {
        const originalRgb = { r: 198, g: 160, b: 246 };

        const hsl = SpicetifyColorGen.rgbToHsl(originalRgb.r, originalRgb.g, originalRgb.b);
        const convertedRgb = SpicetifyColorGen.hslToRgb(hsl.h, hsl.s, hsl.l);

        // Allow for small rounding errors
        expect(Math.abs(convertedRgb.r - originalRgb.r)).toBeLessThan(2);
        expect(Math.abs(convertedRgb.g - originalRgb.g)).toBeLessThan(2);
        expect(Math.abs(convertedRgb.b - originalRgb.b)).toBeLessThan(2);
      });

      test('handles achromatic colors (grayscale)', () => {
        const hsl = SpicetifyColorGen.rgbToHsl(128, 128, 128);
        expect(hsl.s).toBe(0); // No saturation for gray
        expect(hsl.h).toBe(0); // Hue is 0 for achromatic
      });
    });

    describe('hexToRgb (CSS format)', () => {
      test('converts hex to CSS RGB string', () => {
        const result = SpicetifyColorGen.hexToRgb('#c6a0f6');
        expect(result).toBe('198, 160, 246');
      });

      test('handles invalid hex gracefully', () => {
        const result = SpicetifyColorGen.hexToRgb('invalid');
        expect(result).toBe('0, 0, 0');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('all generators handle invalid input gracefully', () => {
      const invalidColor = 'not-a-color';

      // Should not throw errors
      expect(() => {
        SpicetifyColorGen.generateDarkerVariant(invalidColor, 0.5);
        SpicetifyColorGen.generateLighterVariant(invalidColor, 0.5);
        SpicetifyColorGen.generateHueRotatedColor(invalidColor, 120);
        SpicetifyColorGen.generateCinematicRed(invalidColor);
        SpicetifyColorGen.generateCinematicCyan(invalidColor);
        SpicetifyColorGen.generateCinematicYellow(invalidColor);
        SpicetifyColorGen.generateHolographicPrimary(invalidColor);
        SpicetifyColorGen.generateHolographicAccent(invalidColor);
        SpicetifyColorGen.generateHolographicGlow(invalidColor);
        SpicetifyColorGen.generateTextColor(invalidColor);
        SpicetifyColorGen.generateSubtextColor(invalidColor);
        SpicetifyColorGen.generateOverlayColor(invalidColor, 0.1);
        SpicetifyColorGen.generateCrustColor(invalidColor);
        SpicetifyColorGen.generateMantleColor(invalidColor);
        SpicetifyColorGen.generateZoneColor(invalidColor, 'flamingo');
        SpicetifyColorGen.generatePaletteColor(invalidColor, 'pink');
      }).not.toThrow();
    });

    test('generates fallback colors for effect generators on error', () => {
      const invalid = 'invalid';

      expect(SpicetifyColorGen.generateCinematicRed(invalid)).toBe('#FF0000');
      expect(SpicetifyColorGen.generateCinematicCyan(invalid)).toBe('#00FFFF');
      expect(SpicetifyColorGen.generateCinematicYellow(invalid)).toBe('#FFFF00');
      expect(SpicetifyColorGen.generateHolographicPrimary(invalid)).toBe('#8A2BE2');
      // generateHolographicAccent returns original on error (graceful degradation)
      expect(SpicetifyColorGen.generateHolographicAccent(invalid)).toBe(invalid);
      expect(SpicetifyColorGen.generateHolographicGlow(invalid)).toBe('#E0E0FF');
    });

    test('UI generators return Catppuccin fallbacks on error', () => {
      const invalid = 'invalid';

      expect(SpicetifyColorGen.generateTextColor(invalid)).toBe('#CAD3F5');
      expect(SpicetifyColorGen.generateSubtextColor(invalid)).toBe('#A5ADCB');
      expect(SpicetifyColorGen.generateCrustColor(invalid)).toBe('#232634');
      expect(SpicetifyColorGen.generateMantleColor(invalid)).toBe('#1e2030');
    });

    test('zone and palette generators return original color on error', () => {
      const invalid = 'invalid';

      expect(SpicetifyColorGen.generateZoneColor(invalid, 'flamingo')).toBe(invalid);
      expect(SpicetifyColorGen.generatePaletteColor(invalid, 'pink')).toBe(invalid);
    });
  });

  describe('Behavioral Parity with Original Implementation', () => {
    test('color distribution matches expected structure', () => {
      const distribution = SpicetifyColorGen.generateIntelligentColorDistribution(
        '#c6a0f6',
        '#8aadf4',
        '#24273a',
        '#cad3f5'
      );

      // Verify depth progression (base is darkest, surface2 is lightest)
      const baseRgb = SpicetifyColorGen.hexToRgbObject(distribution.base)!;
      const surface0Rgb = SpicetifyColorGen.hexToRgbObject(distribution.surface0)!;
      const surface1Rgb = SpicetifyColorGen.hexToRgbObject(distribution.surface1)!;
      const surface2Rgb = SpicetifyColorGen.hexToRgbObject(distribution.surface2)!;

      // Calculate average brightness for each
      const baseBrightness = (baseRgb.r + baseRgb.g + baseRgb.b) / 3;
      const surface0Brightness = (surface0Rgb.r + surface0Rgb.g + surface0Rgb.b) / 3;
      const surface2Brightness = (surface2Rgb.r + surface2Rgb.g + surface2Rgb.b) / 3;

      // Surface progression should generally increase in brightness
      expect(surface0Brightness).toBeGreaterThan(baseBrightness);
      expect(surface2Brightness).toBeGreaterThanOrEqual(surface0Brightness);
    });

    test('harmony colors are distinct from primary', () => {
      const distribution = SpicetifyColorGen.generateIntelligentColorDistribution('#c6a0f6');

      expect(distribution.harmonyPrimary).not.toBe(distribution.primary);
      expect(distribution.harmonySecondary).not.toBe(distribution.primary);
      expect(distribution.harmonyTertiary).not.toBe(distribution.primary);

      // Harmony colors should also be distinct from each other
      expect(distribution.harmonyPrimary).not.toBe(distribution.harmonySecondary);
      expect(distribution.harmonySecondary).not.toBe(distribution.harmonyTertiary);
    });
  });
});
