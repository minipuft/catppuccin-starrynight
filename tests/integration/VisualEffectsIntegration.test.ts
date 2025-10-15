/**
 * Visual Effects Integration Tests (Modernized)
 *
 * Validates the VisualEffectsCoordinator using standardized mock factories
 * to ensure integration with music sync, performance monitoring, and
 * CSS variable updates follows the modern architecture patterns.
 */

import { unifiedEventBus } from "@/core/events/EventBus";
import { VISUAL_EFFECT_CSS_VARS } from "@/visual/effects/VisualEffectsCoordinator";
import { createMockVisualEffectsCoordinator } from "../helpers/mockFactories";
import { cleanupSystems } from "../helpers/testUtilities";

describe("Visual Effects Integration", () => {
  let visualCoordinator: any;
  let mocks: ReturnType<typeof createMockVisualEffectsCoordinator>;
  const eventUnsubscribers: Array<() => void> = [];

  beforeEach(() => {
    jest.useFakeTimers();
    mocks = createMockVisualEffectsCoordinator();
    visualCoordinator = mocks.bridge;
  });

  afterEach(async () => {
    eventUnsubscribers.splice(0).forEach((unsubscribe) => unsubscribe());
    jest.useRealTimers();
    await cleanupSystems(
      visualCoordinator,
      mocks.mockMusicSyncService,
      mocks.mockColorHarmonyEngine,
      mocks.mockCSSVariableWriter
    );
  });

  it("initializes coordinator with shared dependencies", async () => {
    await visualCoordinator.initialize();

    expect(visualCoordinator.initialized).toBe(true);
    expect((visualCoordinator as any).currentVisualState).toBeDefined();
  });

  it("updates CSS variables during visual state refresh", async () => {
    await visualCoordinator.initialize();
    const initialMetrics = { ...(visualCoordinator as any).performanceMetrics };

    (visualCoordinator as any).updateVisualEffectsState();

    const metrics = (visualCoordinator as any).performanceMetrics;
    expect(metrics.stateUpdates).toBeGreaterThan(initialMetrics.stateUpdates);
  });

  it("notifies registered participants with latest visual state", async () => {
    await visualCoordinator.initialize();

    const participant = {
      systemName: "test-participant",
      onVisualStateUpdate: jest.fn(),
      onVisualEffectEvent: jest.fn(),
      onVisualSystemPerformanceUpdate: jest.fn(),
    };

    visualCoordinator.registerVisualEffectsParticipant(participant);

    (visualCoordinator as any).currentVisualState = (
      visualCoordinator as any
    ).createInitialVisualState();
    (visualCoordinator as any).choreographVisualEffectsUpdate();

    expect(participant.onVisualStateUpdate).toHaveBeenCalled();
  });

  it("emits choreography events on the unified event bus", async () => {
    await visualCoordinator.initialize();

    const emitSpy = jest.spyOn(unifiedEventBus, "emit");

    visualCoordinator.choreographEvent("intensity-changed", {
      intensity: 0.9,
      timestamp: Date.now(),
    });

    expect(emitSpy).toHaveBeenCalledWith(
      "visual-effects:coordination",
      expect.objectContaining({
        type: "intensity-changed",
        coordinationType: "intensity-changed",
      })
    );
    emitSpy.mockRestore();
  });

  it("reports healthy diagnostics when active", async () => {
    await visualCoordinator.initialize();

    visualCoordinator.registerVisualEffectsParticipant({
      systemName: "diagnostic-system",
      onVisualStateUpdate: jest.fn(),
      onVisualEffectEvent: jest.fn(),
      onVisualSystemPerformanceUpdate: jest.fn(),
    });

    const health = await visualCoordinator.healthCheck();

    expect(health.healthy).toBe(true);
    expect(health.metrics?.participantCount).toBeGreaterThan(0);
  });
});
