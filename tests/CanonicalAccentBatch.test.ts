import year3000System from "../src-js/core/lifecycle/year3000System";

// Create a simplified mock CSS Variable Batcher for testing
class MockCSSVariableBatcher {
  private queuedVariables: Map<string, string> = new Map();
  
  queueCSSVariableUpdate(property: string, value: string): void {
    this.queuedVariables.set(property, value);
  }
  
  flushCSSVariableBatch(): void {
    // Apply all queued variables to the document
    for (const [property, value] of this.queuedVariables) {
      document.documentElement.style.setProperty(property, value);
    }
    this.queuedVariables.clear();
  }
  
  destroy(): void {
    this.queuedVariables.clear();
  }
}

/**
 * When writeLegacyAccentVars=false the pipeline should emit ONLY the canonical
 * accent variables. This test mocks the batcher, triggers a palette apply, and
 * asserts no legacy StarryNight gradient vars are present.
 */

describe("Color pipeline emits only canonical token when legacy disabled", () => {
  it("queues only --sn-accent-* variables", () => {
    // Arrange
    const batcher = new MockCSSVariableBatcher();
    year3000System.cssVariableBatcher = batcher as any;

    // Clear any pre-existing vars on root
    document.documentElement.style.cssText = "";

    // Act – apply simple colour map
    year3000System.applyColorsToTheme({ VIBRANT: "#336699" });

    // Flush batch immediately
    batcher.flushCSSVariableBatch();

    const style = document.documentElement.style;
    const accentHex = style.getPropertyValue("--sn-canonical-accent-hex").trim();
    const accentRgb = style.getPropertyValue("--sn-canonical-accent-rgb").trim();

    // Assert – canonical present
    expect(accentHex).toBe("#336699");
    expect(accentRgb).toBe("51,102,153");

    // Assert – legacy vars absent (verify canonical vars are used instead of older patterns)
    expect(style.getPropertyValue("--sn-gradient-primary-rgb").trim()).toBe("");
    expect(style.getPropertyValue("--sn-dynamic-accent-rgb").trim()).toBe("");
    
    // Assert – canonical vars are being used (not background gradient vars)
    expect(accentHex).not.toBe("");
    expect(accentRgb).not.toBe("");
  });
});
