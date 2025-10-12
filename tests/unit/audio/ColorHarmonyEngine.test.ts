import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { createMockPerformanceAnalyzer } from "../../helpers/mockFactories";
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";
import { getCanonicalAccent } from "@/utils/core/ThemeUtilities";

describe("ColorHarmonyEngine", () => {
  let engine: ColorHarmonyEngine;
  let rootElement: HTMLElement;

  beforeEach(() => {
    rootElement = document.documentElement;
    rootElement.style.cssText = "";

    const mockUtils = {
      getRootStyle: () => rootElement,
      hexToRgb: ThemeUtilities.hexToRgb,
      rgbToOklab: ThemeUtilities.rgbToOklab,
      oklabToRgb: ThemeUtilities.oklabToRgb,
      rgbToHsl: ThemeUtilities.rgbToHsl,
      hslToRgb: ThemeUtilities.hslToRgb,
      rgbToHex: ThemeUtilities.rgbToHex,
      calculateContrastRatio: ThemeUtilities.calculateContrastRatio,
    };

    engine = new ColorHarmonyEngine({ enableDebug: false }, mockUtils as any, createMockPerformanceAnalyzer());
  });

  afterEach(() => {
    rootElement.style.cssText = "";
  });

  describe("CSS Variable Generation", () => {
    describe("OKLAB Shadow/Highlight Variable Generation", () => {
      it("should write --sn-oklab-shadow-rgb CSS variable", async () => {
        const mockColors: any = {
          processedColors: {
            SHADOW: "#1a1a1a",
          }
        };

        const cssVars: Record<string, string> = {};
        (engine as any).generateOKLABVariables(cssVars, mockColors);

        expect(cssVars["--sn-oklab-shadow-rgb"]).toBeDefined();
        expect(cssVars["--sn-oklab-shadow-rgb"]).toMatch(/^\d+,\d+,\d+$/);
      });

      it("should write --sn-oklab-highlight-rgb CSS variable", async () => {
        const mockColors: any = {
          processedColors: {
            HIGHLIGHT: "#f0f0f0",
          }
        };

        const cssVars: Record<string, string> = {};
        (engine as any).generateOKLABVariables(cssVars, mockColors);

        expect(cssVars["--sn-oklab-highlight-rgb"]).toBeDefined();
        expect(cssVars["--sn-oklab-highlight-rgb"]).toMatch(/^\d+,\d+,\d+$/);
      });

      it("should write both shadow and highlight variables when both colors present", async () => {
        const mockColors: any = {
          processedColors: {
            SHADOW: "#2c3e50",
            HIGHLIGHT: "#ecf0f1",
          }
        };

        const cssVars: Record<string, string> = {};
        (engine as any).generateOKLABVariables(cssVars, mockColors);

        expect(cssVars["--sn-oklab-shadow-rgb"]).toBeDefined();
        expect(cssVars["--sn-oklab-highlight-rgb"]).toBeDefined();
        expect(cssVars["--sn-oklab-shadow-rgb"]).toMatch(/^\d+,\d+,\d+$/);
        expect(cssVars["--sn-oklab-highlight-rgb"]).toMatch(/^\d+,\d+,\d+$/);
      });
    });

    describe("RGB Format Validation", () => {
      it("should generate valid RGB strings for shadow color", () => {
        const mockColors: any = {
          processedColors: {
            SHADOW: "#3498db",
          }
        };

        const cssVars: Record<string, string> = {};
        (engine as any).generateOKLABVariables(cssVars, mockColors);

        const rgb = cssVars["--sn-oklab-shadow-rgb"];
        const parts = rgb.split(',').map(p => parseInt(p.trim()));

        expect(parts).toHaveLength(3);
        parts.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThanOrEqual(255);
        });
      });

      it("should generate valid RGB strings for highlight color", () => {
        const mockColors: any = {
          processedColors: {
            HIGHLIGHT: "#e74c3c",
          }
        };

        const cssVars: Record<string, string> = {};
        (engine as any).generateOKLABVariables(cssVars, mockColors);

        const rgb = cssVars["--sn-oklab-highlight-rgb"];
        const parts = rgb.split(',').map(p => parseInt(p.trim()));

        expect(parts).toHaveLength(3);
        parts.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThanOrEqual(255);
        });
      });
    });

    describe("Variable Naming Convention Compliance", () => {
      it("should use consolidated naming convention --sn-oklab-{token}-rgb", () => {
        const mockColors: any = {
          processedColors: {
            SHADOW: "#000000",
            HIGHLIGHT: "#ffffff",
          }
        };

        const cssVars: Record<string, string> = {};
        (engine as any).generateOKLABVariables(cssVars, mockColors);

        expect(cssVars).toHaveProperty("--sn-oklab-shadow-rgb");
        expect(cssVars).toHaveProperty("--sn-oklab-highlight-rgb");

        expect(cssVars).not.toHaveProperty("--sn-color-oklab-dynamic-shadow-rgb");
        expect(cssVars).not.toHaveProperty("--sn-color-oklab-bright-highlight-rgb");
      });

      it("should not write legacy variable names", () => {
        const mockColors: any = {
          processedColors: {
            SHADOW: "#1a1a1a",
            HIGHLIGHT: "#f5f5f5",
          }
        };

        const cssVars: Record<string, string> = {};
        (engine as any).generateOKLABVariables(cssVars, mockColors);

        const legacyVariables = [
          "--sn-oklab-processed-dynamic-shadow-rgb",
          "--sn-oklab-processed-bright-highlight-rgb",
          "--sn-color-oklab-dynamic-shadow-rgb",
          "--sn-color-oklab-bright-highlight-rgb",
        ];

        legacyVariables.forEach(varName => {
          expect(cssVars).not.toHaveProperty(varName);
        });
      });
    });

    describe("Integration with Existing Variables", () => {
      it("should write shadow/highlight alongside existing OKLAB variables", () => {
        const mockColors: any = {
          processedColors: {
            VIBRANT: "#e74c3c",
            SHADOW: "#2c3e50",
            HIGHLIGHT: "#ecf0f1",
          }
        };

        const cssVars: Record<string, string> = {};
        (engine as any).generateOKLABVariables(cssVars, mockColors);

        expect(Object.keys(cssVars).length).toBeGreaterThanOrEqual(2);
        expect(cssVars).toHaveProperty("--sn-oklab-shadow-rgb");
        expect(cssVars).toHaveProperty("--sn-oklab-highlight-rgb");
      });
    });

    describe("Fallback and Error Handling", () => {
      it("should gracefully handle missing shadow color", () => {
        const mockColors: any = {
          processedColors: {
            HIGHLIGHT: "#ffffff",
          }
        };

        const cssVars: Record<string, string> = {};

        expect(() => {
          (engine as any).generateOKLABVariables(cssVars, mockColors);
        }).not.toThrow();

        expect(cssVars["--sn-oklab-highlight-rgb"]).toBeDefined();
        expect(cssVars["--sn-oklab-shadow-rgb"]).toBeUndefined();
      });

      it("should gracefully handle missing highlight color", () => {
        const mockColors: any = {
          processedColors: {
            SHADOW: "#000000",
          }
        };

        const cssVars: Record<string, string> = {};

        expect(() => {
          (engine as any).generateOKLABVariables(cssVars, mockColors);
        }).not.toThrow();

        expect(cssVars["--sn-oklab-shadow-rgb"]).toBeDefined();
        expect(cssVars["--sn-oklab-highlight-rgb"]).toBeUndefined();
      });

      it("should handle invalid color hex gracefully", () => {
        const mockColors: any = {
          processedColors: {
            SHADOW: "invalid-hex",
          }
        };

        const cssVars: Record<string, string> = {};

        expect(() => {
          (engine as any).generateOKLABVariables(cssVars, mockColors);
        }).not.toThrow();
      });
    });
  });

  describe("Canonical accent variable integrity", () => {
    it("returns identical RGB/HEX representations", () => {
      // Arrange – simulate palette update by manually setting CSS variables
      const root = document.documentElement;
      root.style.setProperty("--sn-accent-hex", "#112233");
      root.style.setProperty("--sn-accent-rgb", "17,34,51");

      // Act
      const { hex, rgb } = getCanonicalAccent();

      // Assert – RGB <-> HEX conversions are consistent
      expect(hex.toLowerCase()).toBe("#112233");
      expect(rgb).toBe("17,34,51");
    });
  });
});
