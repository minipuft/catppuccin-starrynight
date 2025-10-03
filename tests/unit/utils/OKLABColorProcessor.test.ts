import { OKLABColorProcessor } from "@/utils/color/OKLABColorProcessor";

describe("OKLABColorProcessor - Phase 4 Validation", () => {
  let processor: OKLABColorProcessor;

  beforeEach(() => {
    processor = new OKLABColorProcessor();
  });

  describe("Shadow Color Generation", () => {
    it("should generate shadow color darker than source", () => {
      const sourceColor = "#3498db";
      const result = processor.processColor(sourceColor, "default");

      expect(result.shadowHex).toBeDefined();
      expect(result.shadowRgb).toBeDefined();
      expect(result.oklabShadow).toBeDefined();

      const sourceLightness = result.oklabEnhanced.L;
      const shadowLightness = result.oklabShadow.L;
      expect(shadowLightness).toBeLessThan(sourceLightness);
    });

    it("should generate perceptually darker shadow using OKLAB", () => {
      const brightColor = "#ffcc00";
      const result = processor.processColor(brightColor, "default");

      expect(result.oklabShadow.L).toBeLessThan(result.oklabEnhanced.L);

      const { r, g, b } = result.shadowRgb;
      expect(r + g + b).toBeLessThan(255 * 3 * 0.5);
    });

    it("should maintain hue relationship in shadow", () => {
      const color = "#e74c3c";
      const result = processor.processColor(color, "default");

      const sourceA = result.oklabEnhanced.a;
      const sourceB = result.oklabEnhanced.b;
      const shadowA = result.oklabShadow.a;
      const shadowB = result.oklabShadow.b;

      const sourceHue = Math.atan2(sourceB, sourceA);
      const shadowHue = Math.atan2(shadowB, shadowA);

      expect(Math.abs(sourceHue - shadowHue)).toBeLessThan(Math.PI / 6);
    });
  });

  describe("Highlight Color Generation", () => {
    it("should generate highlight color brighter than source", () => {
      const sourceColor = "#2c3e50";
      const result = processor.processColor(sourceColor, "default");

      expect(result.highlightHex).toBeDefined();
      expect(result.highlightRgb).toBeDefined();
      expect(result.oklabHighlight).toBeDefined();

      const sourceLightness = result.oklabEnhanced.L;
      const highlightLightness = result.oklabHighlight.L;
      expect(highlightLightness).toBeGreaterThan(sourceLightness);
    });

    it("should generate perceptually brighter highlight using OKLAB", () => {
      const darkColor = "#1a1a1a";
      const result = processor.processColor(darkColor, "default");

      expect(result.oklabHighlight.L).toBeGreaterThan(result.oklabEnhanced.L);

      const { r, g, b } = result.highlightRgb;
      expect(r + g + b).toBeGreaterThan(255 * 3 * 0.3);
    });

    it("should maintain saturation characteristics in highlight", () => {
      const saturatedColor = "#9b59b6";
      const result = processor.processColor(saturatedColor, "default");

      const sourceChroma = Math.sqrt(
        result.oklabEnhanced.a ** 2 + result.oklabEnhanced.b ** 2
      );
      const highlightChroma = Math.sqrt(
        result.oklabHighlight.a ** 2 + result.oklabHighlight.b ** 2
      );

      expect(highlightChroma).toBeGreaterThan(0);
      expect(Math.abs(highlightChroma - sourceChroma)).toBeLessThan(sourceChroma * 0.5);
    });
  });

  describe("Perceptual Uniformity Validation", () => {
    it("should maintain OKLAB perceptual spacing between shadow/source/highlight", () => {
      const midColor = "#7f8c8d";
      const result = processor.processColor(midColor, "default");

      const shadowL = result.oklabShadow.L;
      const sourceL = result.oklabEnhanced.L;
      const highlightL = result.oklabHighlight.L;

      const shadowDelta = sourceL - shadowL;
      const highlightDelta = highlightL - sourceL;

      expect(shadowDelta).toBeGreaterThan(0);
      expect(highlightDelta).toBeGreaterThan(0);
      expect(Math.abs(shadowDelta - highlightDelta)).toBeLessThan(0.3);
    });

    it("should produce valid RGB values for all generated colors", () => {
      const testColors = ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000"];

      testColors.forEach(color => {
        const result = processor.processColor(color, "default");

        [result.enhancedRgb, result.shadowRgb, result.highlightRgb].forEach(rgb => {
          const { r, g, b } = rgb;
          expect(r).toBeGreaterThanOrEqual(0);
          expect(r).toBeLessThanOrEqual(255);
          expect(g).toBeGreaterThanOrEqual(0);
          expect(g).toBeLessThanOrEqual(255);
          expect(b).toBeGreaterThanOrEqual(0);
          expect(b).toBeLessThanOrEqual(255);
        });
      });
    });
  });

  describe("Fallback Behavior", () => {
    it("should provide valid fallback shadow/highlight values on error", () => {
      const invalidColor = "invalid-color";
      const result = processor.processColor(invalidColor, "default");

      expect(result.shadowHex).toBeDefined();
      expect(result.shadowRgb).toBeDefined();
      expect(result.shadowRgb.r).toBeGreaterThanOrEqual(0);
      expect(result.highlightHex).toBeDefined();
      expect(result.highlightRgb).toBeDefined();
      expect(result.highlightRgb.r).toBeGreaterThanOrEqual(0);
    });
  });

  describe("RGB Object Validation", () => {
    it("should generate valid RGB objects for CSS variable conversion", () => {
      const color = "#e67e22";
      const result = processor.processColor(color, "default");

      [result.enhancedRgb, result.shadowRgb, result.highlightRgb].forEach(rgb => {
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(255);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(255);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(255);
      });
    });

    it("should format RGB objects as CSS variable strings", () => {
      const color = "#e67e22";
      const result = processor.processColor(color, "default");

      const formatRgb = (rgb: { r: number; g: number; b: number }) =>
        `${rgb.r},${rgb.g},${rgb.b}`;

      const shadowString = formatRgb(result.shadowRgb);
      const highlightString = formatRgb(result.highlightRgb);

      expect(shadowString).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
      expect(highlightString).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
    });
  });
});
