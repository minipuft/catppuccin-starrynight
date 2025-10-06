# Performance Optimization Guidelines

## Scope
Live performance targets, monitoring flow, and quality-scaling rules for Catppuccin StarryNight. Mirrors the behaviour of `PerformanceAnalyzer`, `SimplePerformanceCoordinator`, `EnhancedDeviceTierDetector`, and supporting services.

## Targets
- **Frame rate**: Aim for 60 FPS. Issue warnings below 50 FPS; degrade quality when frame time exceeds 16.67 ms, and aggressively reduce effects past 33 ms (30 FPS).
- **Memory**: Baseline ~25 MB; log warnings at ~50 MB and use cleanup strategies beyond ~100 MB via `performanceMonitor.getMemoryUsage()`.
- **CPU**: Keep active usage under 15%; reduce effect intensity or disable heavy systems when metrics sustain >25-30%.
- **GPU**: Target <20% utilization. When `EnhancedDeviceTierDetector` detects limited GPU or WebGL failure, `SimplePerformanceCoordinator` switches to CSS strategies.
- **Initialization**: Core systems should stabilize within ~100 ms after Spicetify readiness; degraded mode handles slower environments (see `docs/GRACEFUL_DEGRADATION_GUIDE.md`).

## Monitoring Flow
1. `PerformanceAnalyzer` singleton tracks subsystem metrics (frame time, FPS, CPU, memory) and publishes events through `unifiedEventBus`.
2. `PerformanceMonitor` records rAF timings via `startFrame()/endFrame()` and exposes helpers (`getFPS`, `getMemoryUsage`).
3. `SimplePerformanceCoordinator` consumes metrics and calls `setQualityLevel()` on registered systems (visual strategies, UI managers, WebGL integrations).
4. `EnhancedDeviceTierDetector` classifies device tier at startup and when capabilities change, feeding modes such as `battery`, `balanced`, `performance`, `premium`.
5. Optimization strategies (throttle, disable feature, memory cleanup) trigger when thresholds defined in `PerformanceAnalyzer.PERFORMANCE_THRESHOLDS` are exceeded.

## Quality Modes (Default Settings)
| Mode | Quality Level | Target FPS | Notes |
| --- | --- | --- | --- |
| Battery | 0.4 | 30 | Reduced animations, CSS-only visuals where possible. |
| Balanced | 0.8 | 60 | Default for most devices; mixed CSS/WebGL. |
| Performance | 1.0 | 60 | Full visual stack, high-quality shaders. |
| Premium | 1.0 | 60 | Adds extra effects (e.g. advanced shaders) on flagship hardware. |

Systems (e.g., `WebGLGradientStrategy`, `UnifiedParticleSystem`) must implement `setQualityLevel()` to respect these modes.

## Developer Checklist
- Inspect performance traces via `(window as any).Y3K.performance` in debug mode or review console warnings emitted by `PerformanceAnalyzer`.
- When modifying visual systems, test under low tiers by forcing `settings.performance.forceQualityLevel` or using `SimplePerformanceCoordinator.setQualityOverride()`.
- Update particle counts, shader options, and animation strengths to align with the table above.
- Document any new optimization strategies or thresholds in this guide and in `plans/documentation-cleanup.md`.
- Run `npm run test:performance` (see CI) after significant visual or coordinator changes.

## Verification Notes (2025-10-06)
- Cross-checked with `src-js/core/performance/PerformanceMonitor.ts`, `SimplePerformanceCoordinator.ts`, `EnhancedDeviceTierDetector.ts`, and `WebGLSystemsIntegration.ts`.

