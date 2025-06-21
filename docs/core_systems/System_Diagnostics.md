# 🏥 System Diagnostics Suite

## Overview

The **System Diagnostics Suite** combines two core utilities that safeguard the Year 3000 visual stack:

1. **System Health Monitor (SHM)** – Long-term watchdog that performs periodic health-checks on every registered visual system and emits alerts/recovery actions.
2. **System Integration Tester (SIT)** – On-demand, developer-triggered test harness that validates DOM selectors, cross-system integration and performance metrics.

- **Sources:**
  - `src-js/debug/SystemHealthMonitor.ts`
  - `src-js/debug/SystemIntegrationTester.ts`
- **Domain:** Core debug / reliability tooling (tree-shaken out of production builds if desired).
- **Related CSS:** none (uses inline console colours).

---

## 1 ▪ Key Concepts

| Concept                | Purpose                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| **SystemData**         | Registries inside SHM that track criticality, failures, selectors and health history.            |
| **HealthResult**       | Rich object returned by each check with `score`, `issues`, `recommendations`.                    |
| **Alert**              | SHM-generated event when consecutive failures > threshold. Severity based on system criticality. |
| **Integration Report** | Consolidated JSON produced by SIT combining DOM, system and performance tests.                   |
| **Quantum Empathy**    | _N/A here_ – diagnostics remain pure JS, no ML.                                                  |

---

## 2 ▪ Component Responsibilities

### 2.1 System Health Monitor

- Registers visual systems via `registerSystem(name, instance, options)`.
- Runs **health check loop** every `checkIntervalMs` (default 10 000 ms).
- Evaluates:
  - availability of instance & initialise state
  - presence of required methods & DOM selectors
  - optional `instance.healthCheck()` custom probe
- Emits alerts and attempts recovery up to `maxRecoveryAttempts`.

### 2.2 System Integration Tester

- Manually instantiated (or via global `window.runIntegrationTest()`).
- Steps:
  1. DOM Validation against `MODERN_SELECTORS` & gravity targets.
  2. Individual system selector checks (`BehavioralPredictionEngine`, `DataGlyphSystem`, etc.).
  3. Cross-system conflict detection (over-classed critical elements).
  4. Performance micro-benchmarks (selector query speed, heap usage).
- Produces colourised console report + returns structured JSON.

---

## 3 ▪ Configuration

### 3.1 SHM Defaults

```ts
const config = {
  checkIntervalMs: 10_000,
  healthRetentionHours: 24,
  maxRecoveryAttempts: 3,
  alertThreshold: 3, // failures before alert (scaled by criticality)
};
```

Options can be tweaked by editing the constructor or hot-patching `window.SystemHealthMonitor.config`.

---

## 4 ▪ Public APIs

| Utility | Method                                      | Description                                     |
| ------- | ------------------------------------------- | ----------------------------------------------- |
| **SHM** | `registerSystem(name, instance, opts)`      | Add a visual system to the watchdog.            |
|         | `unregisterSystem(name)`                    | Stop tracking a system.                         |
|         | `startMonitoring()` / `stopMonitoring()`    | Control the periodic loop.                      |
|         | `logHealthReport()`                         | Pretty console summary of current status.       |
|         | `getHealthReport()`                         | Return raw JSON for UI overlay.                 |
| **SIT** | `runFullIntegrationTest()`                  | Async end-to-end test; resolves to report JSON. |
|         | `testGradients()` / `logCurrentVariables()` | Quick helper functions for colour debugging.    |
|         | `getInstance()`                             | Obtain a fresh tester instance.                 |

Both utilities are **auto-attached to `window`** in dev builds:

```js
window.SystemHealthMonitor; // singleton instance
window.SystemIntegrationTester; // fresh instance per test
window.runIntegrationTest(); // convenience wrapper
```

---

## 5 ▪ Health Check Algorithm (SHM)

```
for each system:
  checks = [instance available, initialized flag, required methods, DOM selectors]
  if custom healthCheck() exists ➜ include result
  score = passed / total * 100
  derive status: HEALTHY ≥90, WARNING ≥70, DEGRADED ≥50, else FAILING/CRITICAL
  update history & consecutiveFailures
  if status bad ➜ maybe attempt recovery ➜ maybe emit alert
```

Alert severity mapping:

| Criticality | Consecutive failures to alert | Alert severity |
| ----------- | ----------------------------- | -------------- |
| CRITICAL    | 1                             | CRITICAL       |
| HIGH        | 2                             | HIGH           |
| MEDIUM      | 3                             | MEDIUM         |
| LOW         | 5                             | LOW            |

---

## 6 ▪ Example Usage

```ts
import { SystemHealthMonitor } from "@/debug/SystemHealthMonitor";
import { DataGlyphSystem } from "@/systems/visual/DataGlyphSystem";

const health = new SystemHealthMonitor();
health.registerSystem("DataGlyphSystem", glyphSystemInstance, {
  criticalLevel: "HIGH",
  requiredSelectors: [".main-yourLibraryX-listItem"],
  recoveryMethod: "initialize", // attempt re-init on failure
});

// Later in dev console
health.logHealthReport();
await window.runIntegrationTest();
```

---

## 7 ▪ Best Practices

1. **Register early** – systems should register during their own `initialize()`.
2. **Keep custom `healthCheck()` cheap** – < 5 ms to avoid blocking loop.
3. **Recovery method idempotent** – should be safe to call multiple times.
4. **Use SIT before commit** – to catch selector drift after Spotify UI updates.

---

## 8 ▪ Roadmap

| Phase | Item                                                             |
| ----- | ---------------------------------------------------------------- |
| 3     | Surface SHM alerts in in-app debug overlay panel.                |
| 3     | Web Worker offload of heavy checks.                              |
| 4     | Push anonymous telemetry (opt-in) for aggregate stability stats. |
| 4     | Extend SIT to auto-generate selector migration patches.          |

---

## 9 ▪ Status

- **Stable** – Core of dev workflow.
- **Introduced:** v0.8 (Apr 2025)

---

_“Healthy systems, happy pixels.”_
