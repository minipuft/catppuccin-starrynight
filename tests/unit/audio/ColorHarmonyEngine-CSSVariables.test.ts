import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";

describe("ColorHarmonyEngine - CSS Variable Generation (Phase 4)", () => {
  let engine: ColorHarmonyEngine;
  let rootElement: HTMLElement;

  beforeEach(() => {
    rootElement = document.documentElement;
    rootElement.style.cssText = "";

    engine = new ColorHarmonyEngine({ enableDebug: false });
  });

  afterEach(() => {
    rootElement.style.cssText = "";
  });

  describe("OKLAB Shadow/Highlight Variable Generation", () => {
    it("should write --sn-oklab-shadow-rgb CSS variable", async () => {
      const mockColors = {
        SHADOW: "#1a1a1a",
      };

      (engine as any).processedColors = mockColors;
      const cssVars: Record<string, string> = {};
      (engine as any).generateOKLABVariables(cssVars, mockColors);

      expect(cssVars["--sn-oklab-shadow-rgb"]).toBeDefined();
      expect(cssVars["--sn-oklab-shadow-rgb"]).toMatch(/^\d+,\d+,\d+$/);
    });

    it("should write --sn-oklab-highlight-rgb CSS variable", async () => {
      const mockColors = {
        HIGHLIGHT: "#f0f0f0",
      };

      (engine as any).processedColors = mockColors;
      const cssVars: Record<string, string> = {};
      (engine as any).generateOKLABVariables(cssVars, mockColors);

      expect(cssVars["--sn-oklab-highlight-rgb"]).toBeDefined();
      expect(cssVars["--sn-oklab-highlight-rgb"]).toMatch(/^\d+,\d+,\d+$/);
    });

    it("should write both shadow and highlight variables when both colors present", async () => {
      const mockColors = {
        SHADOW: "#2c3e50",
        HIGHLIGHT: "#ecf0f1",
      };

      (engine as any).processedColors = mockColors;
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
      const mockColors = {
        SHADOW: "#3498db",
      };

      (engine as any).processedColors = mockColors;
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
      const mockColors = {
        HIGHLIGHT: "#e74c3c",
      };

      (engine as any).processedColors = mockColors;
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
      const mockColors = {
        SHADOW: "#000000",
        HIGHLIGHT: "#ffffff",
      };

      (engine as any).processedColors = mockColors;
      const cssVars: Record<string, string> = {};
      (engine as any).generateOKLABVariables(cssVars, mockColors);

      expect(cssVars).toHaveProperty("--sn-oklab-shadow-rgb");
      expect(cssVars).toHaveProperty("--sn-oklab-highlight-rgb");

      expect(cssVars).not.toHaveProperty("--sn-color-oklab-dynamic-shadow-rgb");
      expect(cssVars).not.toHaveProperty("--sn-color-oklab-bright-highlight-rgb");
    });

    it("should not write legacy variable names", () => {
      const mockColors = {
        SHADOW: "#1a1a1a",
        HIGHLIGHT: "#f5f5f5",
      };

      (engine as any).processedColors = mockColors;
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
      const mockColors = {
        VIBRANT: "#e74c3c",
        SHADOW: "#2c3e50",
        HIGHLIGHT: "#ecf0f1",
      };

      (engine as any).processedColors = mockColors;
      const cssVars: Record<string, string> = {};
      (engine as any).generateOKLABVariables(cssVars, mockColors);

      expect(Object.keys(cssVars).length).toBeGreaterThanOrEqual(2);
      expect(cssVars).toHaveProperty("--sn-oklab-shadow-rgb");
      expect(cssVars).toHaveProperty("--sn-oklab-highlight-rgb");
    });
  });

  describe("Fallback and Error Handling", () => {
    it("should gracefully handle missing shadow color", () => {
      const mockColors = {
        HIGHLIGHT: "#ffffff",
      };

      (engine as any).processedColors = mockColors;
      const cssVars: Record<string, string> = {};

      expect(() => {
        (engine as any).generateOKLABVariables(cssVars, mockColors);
      }).not.toThrow();

      expect(cssVars["--sn-oklab-highlight-rgb"]).toBeDefined();
      expect(cssVars["--sn-oklab-shadow-rgb"]).toBeUndefined();
    });

    it("should gracefully handle missing highlight color", () => {
      const mockColors = {
        SHADOW: "#000000",
      };

      (engine as any).processedColors = mockColors;
      const cssVars: Record<string, string> = {};

      expect(() => {
        (engine as any).generateOKLABVariables(cssVars, mockColors);
      }).not.toThrow();

      expect(cssVars["--sn-oklab-shadow-rgb"]).toBeDefined();
      expect(cssVars["--sn-oklab-highlight-rgb"]).toBeUndefined();
    });

    it("should handle invalid color hex gracefully", () => {
      const mockColors = {
        SHADOW: "invalid-hex",
      };

      (engine as any).processedColors = mockColors;
      const cssVars: Record<string, string> = {};

      expect(() => {
        (engine as any).generateOKLABVariables(cssVars, mockColors);
      }).not.toThrow();
    });
  });
});
