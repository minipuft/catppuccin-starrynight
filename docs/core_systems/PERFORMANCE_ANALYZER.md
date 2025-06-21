# 📊 Performance Analyzer

## Overview

The **PerformanceAnalyzer** offers continuous **client-side telemetry**: FPS, memory, paint timings, DOM size and network stats. It feeds health data to visual systems and can throttle effects when performance drops.

- **File:** `src-js/core/PerformanceAnalyzer.ts`
- **Typical lifecycle:**
  1. `const perf = new PerformanceAnalyzer({ enableDebug: false });`
  2. `perf.startMonitoring();` _(5000 ms interval by default)_
  3. Optionally call `perf.calculateHealthScore()` or `perf.shouldReduceQuality()` every frame.

---

## 1 ▪ Configuration

```ts
interface AnalyzerConfig {
  enableDebug?: boolean; // default false – verbose logging
  monitoringInterval?: number; // default 5000 ms
  retentionPeriod?: number; // default 300 000 ms (5 min history)
}
```

---

## 2 ▪ Metrics Collected

| Category    | Representative Fields                                   | Notes                                                       |
| ----------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| **memory**  | `used`, `utilization`, `available`                      | Uses `performance.memory` when available.                   |
| **timing**  | `domContentLoaded`, `largestContentfulPaint`            | Derived from `PerformanceNavigationTiming` & paint entries. |
| **fps**     | `current`, `average`, `min`, `max`, `isEstimate`        | Calculated via internal `FPSCounter` (rAF loop).            |
| **dom**     | `elements`, `styleSheets`, `images`, `scripts`, `links` | Snapshot counts.                                            |
| **network** | `effectiveType`, `downlink`, `saveData`                 | From `navigator.connection` where supported.                |

The analyzer stores a rolling history (default 5 min) for trend analysis.

---

## 3 ▪ Public API

| Method                                    | Purpose                                                       |
| ----------------------------------------- | ------------------------------------------------------------- |
| `startMonitoring()` / `stopMonitoring()`  | Begin / cease periodic sampling.                              |
| `calculateHealthScore()`                  | Returns 0-100 composite score (lower = worse).                |
| `getHealthLevel(score)`                   | Maps score → `'stable'`, `'warning'`, `'critical'`.           |
| `shouldReduceQuality()`                   | Convenience – returns `true` when health score < 60.          |
| `startTiming(op)` / `endTiming(op,start)` | Manual micro-timers for arbitrary ops. Keeps last 50 samples. |
| `getAverageTime(op)`                      | Average ms for a named operation.                             |
| `shouldUpdate(bucket, minIntervalMs)`     | Cheap rAF-rate throttling helper.                             |
| `emitTrace(msg, data?)`                   | Conditional debug logger.                                     |
| `destroy()`                               | Stop monitors & clear history.                                |

---

## 4 ▪ Usage Examples

### 4.1 Throttling expensive effect

```ts
if (perf.shouldUpdate("nebulaCtr", 1000)) {
  // expensive variable flush once per second
  nebulaController.syncStats();
}
```

### 4.2 Adaptive quality switch

```ts
requestAnimationFrame(() => {
  if (perf.shouldReduceQuality()) depthLayerSystem.setQuality("low");
});
```

### 4.3 Manual operation timing

```ts
const t0 = perf.startTiming("particle-step");
// … particle logic …
perf.endTiming("particle-step", t0);
console.log("avg particle step:", perf.getAverageTime("particle-step"), "ms");
```

---

## 5 ▪ Integration Matrix

| Subsystem                    | Interaction                                                          |
| ---------------------------- | -------------------------------------------------------------------- |
| **NebulaController**         | Uses `shouldUpdate()` to emit CSS vars at most every 16 ms (60 fps). |
| **DeviceCapabilityDetector** | Reads live FPS to refine capability level in the future roadmap.     |
| **Year3000 Debug Overlay**   | Visualises `performanceHistory` for developers.                      |

---

## 6 ▪ Best Practices

1. Keep `monitoringInterval` ≥ 2000 ms to avoid unnecessary overhead.
2. Call `destroy()` on hot-reload to prevent orphaned rAF loops.
3. Avoid reading `performanceHistory` on every frame; query when user opens dev overlay.

---

## 7 ▪ Roadmap

| Phase | Plan                                                                             |
| ----- | -------------------------------------------------------------------------------- |
| 2     | Send anonymous opt-in telemetry events via Web-Worker.                           |
| 3     | Integrate with DeviceCapabilityDetector to auto-downgrade/upgrade quality tiers. |
| 4     | Add `PerformanceAnalyzerPanel` inside in-app debug overlay.                      |

---

## 8 ▪ Status

- **Stable** – API locked until v2.0
- **First Introduced:** v1.0 (Jan 2025)

---

_“Measure twice, render once.”_
