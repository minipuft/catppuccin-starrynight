import { getCanonicalAccent } from "../src-js/utils/Year3000Utilities";

/**
 * Ensures the canonical accent variables remain in sync. If either the HEX or
 * RGB counterpart drifts the test will fail, alerting us to an upstream typo
 * in the colour pipeline.
 */

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
