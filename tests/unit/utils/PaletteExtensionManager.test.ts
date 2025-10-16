import { PaletteExtensionManager } from "@/utils/core/PaletteExtensionManager";
import type { AdvancedSystemConfig } from "@/types/models";
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";

type Oklch = { L: number; C: number; H: number };

const createManager = () =>
  new PaletteExtensionManager(
    { enableDebug: false } as unknown as AdvancedSystemConfig,
    ThemeUtilities
  );

const toOklch = (hex: string): Oklch => {
  const rgb = ThemeUtilities.hexToRgb(hex);
  if (!rgb) {
    throw new Error(`Unable to convert ${hex} to RGB`);
  }

  const oklab = ThemeUtilities.rgbToOklab(rgb.r, rgb.g, rgb.b);
  const C = Math.sqrt(oklab.a ** 2 + oklab.b ** 2);
  const H = ((Math.atan2(oklab.b, oklab.a) * 180) / Math.PI + 360) % 360;

  return { L: oklab.L, C, H };
};

const hueDistance = (a: number, b: number): number => {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

const expectHexClose = (actual: string, expected: string, tolerance = 0.02) => {
  const actualOklch = toOklch(actual);
  const expectedOklch = toOklch(expected);

  expect(Math.abs(actualOklch.L - expectedOklch.L)).toBeLessThanOrEqual(
    tolerance
  );
  expect(Math.abs(actualOklch.C - expectedOklch.C)).toBeLessThanOrEqual(
    tolerance * 2
  );
  expect(hueDistance(actualOklch.H, expectedOklch.H)).toBeLessThan(8);
};

describe("PaletteExtensionManager – Unified OKLAB adoption", () => {
  let manager: PaletteExtensionManager;

  beforeEach(() => {
    document.documentElement.style.cssText = "";
    manager = createManager();
  });

  it("generates OKLAB-based accent variations with expected hue shifts", () => {
    document.documentElement.style.setProperty("--spice-main", "#1e1e2e");
    document.documentElement.style.setProperty("--spice-base", "#1e1e2e");
    document.documentElement.style.setProperty(
      "--sn-gradient-accent",
      "#89b4fa"
    );
    document.documentElement.style.setProperty(
      "--sn-dynamic-accent",
      "#cba6f7"
    );

    const palette = manager.generateFallbackPalette("custom-theme");

    expectHexClose(palette.accents.primary, "#89b4fa");

    const baseAccent = toOklch("#89b4fa");
    const complementAccent = toOklch(palette.accents.complement);
    const complementDelta = Math.abs(hueDistance(complementAccent.H, baseAccent.H) - 180);
    expect(complementDelta).toBeLessThan(8);

    const baseNeutral = toOklch(palette.neutrals.base);
    const textNeutral = toOklch(palette.neutrals.text);
    expect(textNeutral.L).toBeGreaterThan(baseNeutral.L);
    expect(hueDistance(textNeutral.H, baseNeutral.H)).toBeLessThan(3);
    expect(textNeutral.C).toBeLessThan(baseNeutral.C + 0.02);
  });

  it("applies genre modifiers in OKLAB space", () => {
    document.documentElement.style.setProperty("--spice-main", "#1e1e2e");
    document.documentElement.style.setProperty("--sn-gradient-accent", "#89b4fa");

    const palette = manager.generateFallbackPalette("oklab-source");
    const modified = manager.applyGenreAwareModifications(palette, "jazz");

    const originalPrimary = toOklch(palette.accents.primary);
    const modifiedPrimary = toOklch(modified.accents.primary);

    expect(hueDistance(modifiedPrimary.H, originalPrimary.H)).toBeGreaterThan(10);
    expect(hueDistance(modifiedPrimary.H, originalPrimary.H)).toBeLessThan(25);
    expect(modifiedPrimary.C).toBeGreaterThan(originalPrimary.C);
  });

  it("falls back to default OKLAB palette when root styles are missing", () => {
    const palette = manager.generateFallbackPalette("default");

    expectHexClose(palette.accents.primary, "#8caaee", 0.03);

    const baseNeutral = toOklch(palette.neutrals.base);
    const expectedBase = toOklch("#1e1e2e");
    expect(Math.abs(baseNeutral.L - expectedBase.L)).toBeLessThan(0.02);
    expect(hueDistance(baseNeutral.H, expectedBase.H)).toBeLessThan(3);
  });
});
