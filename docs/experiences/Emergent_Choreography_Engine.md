# 🎶 Emergent Choreography Engine

> “When code meets cadence, visuals learn to dance.”

---

## Overview

The **Emergent Choreography Engine (ECE)** is the Year 3000 visual subsystem that teaches the UI to _learn_ the user's aesthetic taste and then adapt every frame to the current beat, colour harmony and device capability.
It sits on top of the core `BaseVisualSystem` and orchestrates **personal aesthetic signatures**, **cosmic multiplier profiles** and **visual-pulse events** that other systems (Depth Layers, Nebula, Glassmorphism, etc.) can subscribe to.

- **Source:** `src-js/systems/EmergentChoreographyEngine.ts`
- **Domain:** `GlobalEventBus` → real-time pub/sub layer
- **Down-stream consumers:** any component listening to `visual/pulse`, `emergent/frame` or `emergent/multipliersUpdated`.

---

## 1 ▪ Key Concepts

| Concept                        | Purpose                                                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PersonalAestheticSignature** | Persistent, per-user profile stored via `TemporalMemoryService`. Captures colour memories, kinetic tendencies, evolutionary trajectory, etc.                                     |
| **Cosmic Multipliers**         | Numeric coefficients (e.g. `kineticIntensity`, `visualIntensityBase`) that drive SCSS variables and shader uniforms.                                                             |
| **Visual Pulse**               | A small struct broadcast every rAF containing current BPM phase, hue shift and intensity. Down-stream systems can micro-sync animations without calculating the beat themselves. |
| **Evolutionary Trajectory**    | Slowly adapting values (`explorationFactor`, `adaptability`) updated every ~60 s based on historical energy/valence trends.                                                      |

---

## 2 ▪ Event Matrix

| Channel                       | Direction | Payload Shape                                    | Emitted / Consumed                   |
| ----------------------------- | --------- | ------------------------------------------------ | ------------------------------------ |
| `beat/frame`                  | ⬅️ in     | `{ timestamp, energy, valence }`                 | **consumed**                         |
| `colorharmony/frame`          | ⬅️ in     | `{ kineticState, palette }`                      | **consumed**                         |
| `beat/bpm`                    | ⬅️ in     | `{ bpm }`                                        | **consumed**                         |
| `beat/intensity`              | ⬅️ in     | `{ intensity }`                                  | **consumed**                         |
| `visual/pulse`                | ➡️ out    | `{ timestamp, bpm, intensity, phase, hueShift }` | **emitted every frame**              |
| `emergent/frame`              | ➡️ out    | `{ timestamp, deltaMs, … }`                      | **emitted every frame**              |
| `emergent/multipliersUpdated` | ➡️ out    | `MultiplierProfile`                              | **emitted when coefficients change** |

---

## 3 ▪ Configuration Snippet

ECE inherits the global `Year3000Config` but chiefly relies on the **`cosmicMultipliers` default block**:

```ts
interface Year3000Config {
  enableDebug: boolean;
  cosmicMultipliers: {
    kineticIntensity: number; // 0 … 1
    visualIntensityBase: number; // 0 … 1.5
    /* plus future coefficients */
  };
}
```

These defaults are dynamically overridden at runtime by `_calculateAdaptiveCoefficients()`.

---

## 4 ▪ Public API

| Method                    | Description                                                                                               |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `initialize()`            | Asynchronous setup – loads `PersonalAestheticSignature`, subscribes to bus and starts interval persister. |
| `healthCheck()`           | Lightweight readiness probe used by debug overlay.                                                        |
| `getCurrentMultipliers()` | Returns the _live_ `MultiplierProfile` last broadcast.                                                    |
| `updateAnimation(delta)`  | rAF-driven hook called by MasterAnimationCoordinator. Delegates to `onTick`.                              |
| `onTick(deltaMs)`         | Main loop: updates coefficients, issues pulses, runs evolutionary step every 60 s.                        |
| `destroy()`               | Unsubscribes from all channels and persists signature one last time.                                      |

_Note: all methods honour `config.enableDebug` for verbose logging._

---

## 5 ▪ Algorithm Walk-Through

1. **Beat & Harmony Intake**
   Incoming beat and harmony frames update `currentBpm`, `currentIntensity` and touch the signature.
2. **Adaptive Coefficient Re-calculation**
   Every frame `onTick()` recalculates `kineticIntensity` & `visualIntensityBase` using the latest signature's `explorationFactor` / `adaptability`.
3. **Visual Pulse Generation**
   A fast sinusoid anticipates the beat by _π/2_ so consumers can prepare visuals _just_ before the beat lands.
4. **Signature Evolution**
   Once per minute `_updateEvolutionaryTrajectory()` nudges `explorationFactor` & `adaptability` towards the long-term averages of energy & valence.
5. **Persistence Layer**
   `TemporalMemoryService.saveSignature()` is invoked every 30 s and on `destroy()` to durably store the evolving signature.

---

## 6 ▪ Related Services

| Service                      | Role in ECE                                                                                               | File                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **TemporalMemoryService**    | Persists & retrieves `PersonalAestheticSignature` via IndexedDB. Called every 30 s and on `destroy()`.    | `src-js/services/TemporalMemoryService.ts` |
| **DeviceCapabilityDetector** | Provides performance-quality recommendation consumed during `initialize()`.                               | `src-js/core/DeviceCapabilityDetector.ts`  |
| **UserGenreHistory**         | Lightweight localStorage store tracking discovered genres — used by Nebula & future signature enrichment. | `src-js/store/UserHistory.ts`              |

---

## 7 ▪ SCSS Integration

ECE does **not** write direct CSS but acts as the _source of truth_ for several CSS custom properties consumed by layout & feature modules.
Current mappings:

| Variable (declared in SCSS)   | Typical Source Value | Notes                                                                                         |
| ----------------------------- | -------------------- | --------------------------------------------------------------------------------------------- |
| `--choreography-harmony-sync` | `0.8s`               | Derivative of `kineticIntensity`; used in `_sn_header_actionBar.scss` for header transitions. |
| `--conscious-breath-rate`     | `8s` → `9-12s`       | Upper-bounds scale with `visualIntensityBase`.                                                |
| `--ethereal-glow-base`        | `0.2` → `0.4`        | Indirectly modulated via multipliers.                                                         |

> To introduce **new variables** expose them in a SCSS module and read the multiplier via `GlobalEventBus.subscribe("emergent/multipliersUpdated", cb)`.

---

## 8 ▪ Usage Example

```ts
import { GlobalEventBus } from "@/core/EventBus";

// React component that colour-shifts a border in phase with the music
useEffect(() => {
  const unsub = GlobalEventBus.subscribe(
    "visual/pulse",
    ({ phase, hueShift }) => {
      element.style.setProperty("--border-hue", `${hueShift}deg`);
      element.style.setProperty("--border-phase", phase.toFixed(3));
    }
  );
  return () => unsub();
}, []);
```

---

## 9 ▪ Best Practices

1. **Subscribe, don't poll.** Every public datum is delivered via the event bus.
2. **Cache your subscription callback**; allocations every frame will hurt GC.
3. **Respect `prefers-reduced-motion`.** ECE already factors it but your consumer should too.
4. When hot-reloading, always call `destroy()` on the old instance to avoid duplicate subscriptions.

---

## 10 ▪ Roadmap

| Phase | Item                                                                          |
| ----- | ----------------------------------------------------------------------------- |
| 3     | Deep-learning heuristic to extract dance-style from user play-history.        |
| 4     | Cross-device signature sync via cloud storage.                                |
| 4     | Expose _mood windows_ (happy, chill, intense) for Nebula colour remap.        |
| 5     | Integrate with **PredictiveMaterializationSystem** for anticipatory warm-ups. |

---

## 11 ▪ Status

- **Beta** – API may change before v1.0.
- **Introduced:** v0.9 (May 2025)

---

_“The UI remembers how you like to move.”_
