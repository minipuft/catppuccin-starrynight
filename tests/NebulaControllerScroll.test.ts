// Phase 2: Stochastic Star-Dust Dither – Unit Tests for noise-scale mapping

import { CSSVariableBatcher } from "../src-js/core/CSSVariableBatcher";
import { NebulaController } from "../src-js/effects/NebulaController";

// Stub batcher that captures queued CSS variable updates synchronously.
class StubBatcher extends CSSVariableBatcher {
  public captured: Record<string, string> = {};
  constructor() {
    super({ batchIntervalMs: 0, maxBatchSize: 10 });
  }
  public queueCSSVariableUpdate(prop: string, value: string): void {
    this.captured[prop] = value;
  }
}

describe("NebulaController – Scroll velocity → noise-scale mapping", () => {
  let batcher: StubBatcher;
  let ctrl: NebulaController;

  beforeEach(() => {
    batcher = new StubBatcher();
    ctrl = new NebulaController(null, batcher);
  });

  it("should map +50 px/frame velocity to 200% noise scale", () => {
    // Access private method via type-cast; alternative would be
    // publishing an event but that adds complexity for unit scope.
    (ctrl as any)._handleScroll({ velocity: 50 });
    expect(batcher.captured["--sn-nebula-noise-scale-y"]).toBe("200.0%");
  });

  it("should map 0 velocity to the base 150% noise scale", () => {
    (ctrl as any)._handleScroll({ velocity: 0 });
    expect(batcher.captured["--sn-nebula-noise-scale-y"]).toBe("150.0%");
  });

  it("should clamp -50 px/frame velocity to minimum 140% noise scale", () => {
    (ctrl as any)._handleScroll({ velocity: -50 });
    expect(batcher.captured["--sn-nebula-noise-scale-y"]).toBe("140.0%");
  });
});
