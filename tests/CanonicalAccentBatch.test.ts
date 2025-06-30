import { CSSVariableBatcher } from "../src-js/core/CSSVariableBatcher";
import year3000System from "../src-js/core/year3000System";

/**
 * When writeLegacyAccentVars=false the pipeline should emit ONLY the canonical
 * accent variables. This test mocks the batcher, triggers a palette apply, and
 * asserts no legacy StarryNight gradient vars are present.
 */

describe("Color pipeline emits only canonical token when legacy disabled", () => {
  it("queues only --sn-accent-* variables", () => {
    // Arrange
    const batcher = new CSSVariableBatcher({ enableDebug: false });
    year3000System.cssVariableBatcher = batcher;

    // Clear any pre-existing vars on root
    document.documentElement.style.cssText = "";

    // Act – apply simple colour map
    year3000System.applyColorsToTheme({ VIBRANT: "#336699" });

    // Flush batch immediately
    batcher.flushCSSVariableBatch();

    const style = document.documentElement.style;
    const accentHex = style.getPropertyValue("--sn-accent-hex").trim();
    const accentRgb = style.getPropertyValue("--sn-accent-rgb").trim();

    // Assert – canonical present
    expect(accentHex).toBe("#336699");
    expect(accentRgb).toBe("51,102,153");

    // Assert – legacy vars absent
    expect(style.getPropertyValue("--sn-gradient-primary-rgb").trim()).toBe("");
    expect(style.getPropertyValue("--sn-dynamic-accent-rgb").trim()).toBe("");
  });
});
