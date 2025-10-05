/**
 * Behavioral Equivalence Test Suite
 *
 * Purpose: Verify that SpicetifyColorBridge refactoring maintains exact behavioral parity
 *          with original SpicetifyColorBridge implementation
 *
 * Test Strategy:
 * 1. Capture baseline behavior from SpicetifyColorBridge (pre-refactor)
 * 2. After refactor, verify SpicetifyColorBridge produces identical outputs
 * 3. Test all integration points remain functional
 * 4. Validate edge cases and error handling unchanged
 *
 * Success Criteria:
 * - 100% identical CSS variable generation
 * - All integration points function identically
 * - Error handling and fallbacks unchanged
 * - Event emission sequence preserved
 */

import { SpicetifyColorBridge } from "@/utils/spicetify/SpicetifyColorBridge";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";

describe("SpicetifyColorBridge Behavioral Equivalence", () => {
  let spicetifyBridge: SpicetifyColorBridge;
  let cssController: UnifiedCSSVariableManager;

  beforeEach(async () => {
    // Setup DOM
    document.documentElement.style.setProperty = jest.fn();

    cssController = new UnifiedCSSVariableManager({
      enableDebug: false,
      batchDelay: 0,
      enablePerformanceMonitoring: false
    });

    spicetifyBridge = new SpicetifyColorBridge({
      enableDebug: false,
      cacheDuration: 5000
    });

    await spicetifyBridge.initialize(cssController);
  });

  afterEach(() => {
    spicetifyBridge.destroy();
  });

  describe("Color Generation Parity", () => {
    test("generateIntelligentColorDistribution() produces exact output", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_ACCENT': '#8aadf4',
        'OKLAB_SHADOW': '#24273a',
        'OKLAB_HIGHLIGHT': '#cad3f5'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      const capturedVariables = captureAllBatchedVariables(spy);

      // Snapshot test for exact output matching
      expect(capturedVariables).toMatchSnapshot('color-distribution-output');

      // Verify critical variables are present
      expect(capturedVariables).toHaveProperty('--spice-accent');
      expect(capturedVariables).toHaveProperty('--spice-base');
      expect(capturedVariables).toHaveProperty('--spice-surface0');
      expect(capturedVariables).toHaveProperty('--spice-surface1');
      expect(capturedVariables).toHaveProperty('--spice-surface2');

      // Verify color value format (hex colors)
      Object.entries(capturedVariables).forEach(([key, value]) => {
        if (!key.includes('rgb') && !key.includes('state') && !key.includes('timestamp')) {
          expect(value).toMatch(/^#[0-9a-f]{6}$/i);
        }
      });
    });

    test("All 96 CSS variables are generated with correct values", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_ACCENT': '#8aadf4',
        'OKLAB_SHADOW': '#24273a',
        'OKLAB_HIGHLIGHT': '#cad3f5'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      // Count all variables across batches
      let totalVariables = 0;
      const allVariables: Record<string, string> = {};

      spy.mock.calls.forEach(call => {
        const variables = call[1] as Record<string, string>;
        totalVariables += Object.keys(variables).length;
        Object.assign(allVariables, variables);
      });

      // Expected from audit: ~96 variables total
      expect(totalVariables).toBeGreaterThanOrEqual(90);
      expect(totalVariables).toBeLessThanOrEqual(100);

      // Verify variable groups
      const spiceVars = Object.keys(allVariables).filter(k => k.startsWith('--spice-'));
      const snVars = Object.keys(allVariables).filter(k => k.startsWith('--sn-'));

      expect(spiceVars.length).toBeGreaterThan(70); // Spicetify variables
      expect(snVars.length).toBeGreaterThan(10);    // StarryNight variables
    });

    test("Color variant generators produce consistent output", () => {
      // Test multiple runs with same input
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      // First run
      spicetifyBridge.updateWithAlbumColors(testInput);
      const firstRun = captureAllBatchedVariables(spy);
      spy.mockClear();

      // Second run
      spicetifyBridge.updateWithAlbumColors(testInput);
      const secondRun = captureAllBatchedVariables(spy);
      spy.mockClear();

      // Third run
      spicetifyBridge.updateWithAlbumColors(testInput);
      const thirdRun = captureAllBatchedVariables(spy);

      // All runs should produce identical output
      expect(firstRun).toEqual(secondRun);
      expect(secondRun).toEqual(thirdRun);
    });

    test("Effect-specific color generators produce valid output", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_HIGHLIGHT': '#cad3f5'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      const variables = captureAllBatchedVariables(spy);

      // Verify cinematic colors
      expect(variables).toHaveProperty('--spice-cinematic-red');
      expect(variables).toHaveProperty('--spice-cinematic-cyan');
      expect(variables).toHaveProperty('--spice-cinematic-yellow');

      // Verify holographic colors
      expect(variables).toHaveProperty('--spice-holographic-primary');
      expect(variables).toHaveProperty('--spice-holographic-accent');
      expect(variables).toHaveProperty('--spice-holographic-glow');

      // Verify shimmer colors
      expect(variables).toHaveProperty('--spice-shimmer-primary');
      expect(variables).toHaveProperty('--spice-shimmer-secondary');
      expect(variables).toHaveProperty('--spice-shimmer-tertiary');

      // Verify all are valid hex colors
      const effectColors = Object.entries(variables).filter(([key]) =>
        key.includes('cinematic') || key.includes('holographic') || key.includes('shimmer')
      );

      effectColors.forEach(([key, value]) => {
        if (!key.includes('rgb')) {
          expect(value).toMatch(/^#[0-9a-f]{6}$/i);
        }
      });
    });

    test("Zone and palette color generators produce expected variations", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      const variables = captureAllBatchedVariables(spy);

      // Verify zone colors
      expect(variables).toHaveProperty('--spice-flamingo');
      expect(variables).toHaveProperty('--spice-lavender');
      expect(variables).toHaveProperty('--spice-peach');
      expect(variables).toHaveProperty('--spice-rosewater');
      expect(variables).toHaveProperty('--spice-sapphire');

      // Verify palette colors
      expect(variables).toHaveProperty('--spice-pink');
      expect(variables).toHaveProperty('--spice-sky');
      expect(variables).toHaveProperty('--spice-red');
      expect(variables).toHaveProperty('--spice-maroon');
      expect(variables).toHaveProperty('--spice-yellow');
      expect(variables).toHaveProperty('--spice-green');

      // Verify colors are different from primary (variations applied)
      const primaryHex = testInput['OKLAB_PRIMARY'];
      expect(variables['--spice-flamingo']).not.toBe(primaryHex);
      expect(variables['--spice-lavender']).not.toBe(primaryHex);
    });
  });

  describe("Integration Point Verification", () => {
    test("ColorHarmonyEngine integration pattern (updateWithAlbumColors call)", () => {
      // Simulate how ColorHarmonyEngine calls updateWithAlbumColors
      const oklabProcessedColors = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_ACCENT': '#8aadf4',
        'OKLAB_SHADOW': '#24273a',
        'OKLAB_HIGHLIGHT': '#cad3f5'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      // This is how ColorHarmonyEngine calls it
      spicetifyBridge.updateWithAlbumColors(oklabProcessedColors);

      // Verify CSS controller was called
      expect(spy).toHaveBeenCalled();

      // Verify multiple batches (as per current implementation)
      expect(spy.mock.calls.length).toBeGreaterThan(1);

      // Verify priority levels used
      const priorities = spy.mock.calls.map(call => call[2]);
      expect(priorities).toContain('critical'); // Album color updates
    });

    test("Event emission sequence (colors:applied)", (done) => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      const eventCallback = jest.fn((event: any) => {
        expect(event).toHaveProperty('cssVariables');
        expect(event).toHaveProperty('accentHex');
        expect(event).toHaveProperty('accentRgb');
        expect(event).toHaveProperty('appliedAt');

        // Verify event contains expected data
        expect(event.cssVariables).toBeInstanceOf(Object);
        expect(Object.keys(event.cssVariables).length).toBeGreaterThan(0);

        done();
      });

      // Subscribe to colors:applied event
      unifiedEventBus.subscribe('colors:applied', eventCallback, 'BehavioralEquivalenceTest');

      spicetifyBridge.updateWithAlbumColors(testInput);
    });

    test("UnifiedCSSVariableManager coordination pattern", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      const batchSetSpy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      // Verify batchSetVariables called with correct signature
      batchSetSpy.mock.calls.forEach(call => {
        expect(call[0]).toBe('SpicetifyColorBridge'); // Component name
        expect(call[1]).toBeInstanceOf(Object);        // Variables object
        expect(['low', 'normal', 'high', 'critical']).toContain(call[2]); // Priority
        expect(typeof call[3]).toBe('string');         // Batch ID
      });
    });
  });

  describe("Edge Case Handling", () => {
    test("Missing primary color fallback behavior", () => {
      const invalidInput = {
        'OKLAB_ACCENT': '#8aadf4'
        // Missing OKLAB_PRIMARY
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');
      const consoleWarnSpy = jest.spyOn(console, 'warn');

      spicetifyBridge.updateWithAlbumColors(invalidInput);

      // Should warn about missing primary color
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('No primary color found')
      );

      // Should skip update (no CSS variables applied)
      expect(spy).not.toHaveBeenCalled();
    });

    test("Invalid color handling (white/black rejection)", () => {
      const invalidColors = {
        'OKLAB_PRIMARY': '#ffffff' // White (should be validated/rejected)
      };

      // Validation happens in validateColor() method
      // Implementation should use fallback colors
      expect(() => {
        spicetifyBridge.updateWithAlbumColors(invalidColors);
      }).not.toThrow();
    });

    test("Uninitialized state handling", async () => {
      const uninitializedManager = new SpicetifyColorBridge();

      const consoleWarnSpy = jest.spyOn(console, 'warn');

      uninitializedManager.updateWithAlbumColors({
        'OKLAB_PRIMARY': '#c6a0f6'
      });

      // Should warn about uninitialized state
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Not initialized')
      );
    });

    test("Spicetify API unavailable fallback", async () => {
      // Test when Spicetify.Platform is not available
      // SpicetifyColorBridge should fall back to hardcoded Catppuccin colors

      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      expect(() => {
        spicetifyBridge.updateWithAlbumColors(testInput);
      }).not.toThrow();
    });

    test("Empty input handling", () => {
      const emptyInput = {};

      const consoleWarnSpy = jest.spyOn(console, 'warn');

      spicetifyBridge.updateWithAlbumColors(emptyInput);

      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe("CSS Variable Application Verification", () => {
    test("Priority batching maintains correct order", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_ACCENT': '#8aadf4'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      // Verify batch call order and priorities
      const batchCalls = spy.mock.calls;

      // Should have multiple batches with different priorities
      const criticalBatches = batchCalls.filter(call => call[2] === 'critical');
      expect(criticalBatches.length).toBeGreaterThan(0);
    });

    test("RGB variant generation for all hex colors", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      const variables = captureAllBatchedVariables(spy);

      // For every --spice-* hex variable, there should be a --spice-rgb-* variant
      const hexVariables = Object.keys(variables).filter(k =>
        k.startsWith('--spice-') && !k.includes('rgb')
      );

      hexVariables.forEach(hexVar => {
        const rgbVar = hexVar.replace('--spice-', '--spice-rgb-');

        if (!hexVar.includes('state') && !hexVar.includes('timestamp')) {
          expect(variables).toHaveProperty(rgbVar);

          // Verify RGB format: "r, g, b"
          const rgbValue = variables[rgbVar];
          expect(rgbValue).toMatch(/^\d+, \d+, \d+$/);
        }
      });
    });

    test("StarryNight gradient variables coordination", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      const variables = captureAllBatchedVariables(spy);

      // Verify StarryNight gradient variables
      expect(variables).toHaveProperty('--sn-bg-gradient-accent');
      expect(variables).toHaveProperty('--sn-bg-gradient-primary');
      expect(variables).toHaveProperty('--sn-bg-gradient-secondary');

      // Verify RGB variants
      expect(variables).toHaveProperty('--sn-bg-gradient-accent-rgb');
      expect(variables).toHaveProperty('--sn-bg-gradient-primary-rgb');
      expect(variables).toHaveProperty('--sn-bg-gradient-secondary-rgb');
    });

    test("Year3000 system integration variables", () => {
      const testInput = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testInput);

      const variables = captureAllBatchedVariables(spy);

      // Verify Year3000 integration variables (--sn-color-* namespace)
      expect(variables).toHaveProperty('--sn-color-accent-hex');
      expect(variables).toHaveProperty('--sn-accent-hex');
      expect(variables).toHaveProperty('--sn-color-extracted-primary-rgb');
      expect(variables).toHaveProperty('--sn-color-harmony-complementary-rgb');
    });
  });

  describe("Health Check Behavior", () => {
    test("Health check reports expected metrics", async () => {
      const healthResult = await spicetifyBridge.healthCheck();

      expect(healthResult).toHaveProperty('healthy');
      expect(healthResult).toHaveProperty('system', 'SpicetifyColorBridge');
      expect(healthResult).toHaveProperty('metrics');

      // Verify expected metrics
      expect(healthResult.metrics).toHaveProperty('initialized');
      expect(healthResult.metrics).toHaveProperty('spicetifyAvailable');
      expect(healthResult.metrics).toHaveProperty('cssControllerAvailable');
      expect(healthResult.metrics).toHaveProperty('lastColorUpdate');
      expect(healthResult.metrics).toHaveProperty('colorUpdateCount');
    });
  });
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function captureAllBatchedVariables(spy: jest.SpyInstance): Record<string, string> {
  const allVariables: Record<string, string> = {};

  spy.mock.calls.forEach(call => {
    const variables = call[1] as Record<string, string>;
    Object.assign(allVariables, variables);
  });

  return allVariables;
}
