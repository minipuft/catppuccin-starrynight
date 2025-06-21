# ✨ Predictive Materialization & Behavioral Prediction Systems

> "Anticipate the click, warm the pixel."

---

## Overview

The **Predictive Materialization System (PMS)** and **Behavioral Prediction Engine (BPE)** work in tandem to _anticipate_ user intent and surface gentle visual cues before an interaction occurs.

- **Sources:**
  - `src-js/systems/visual/PredictiveMaterializationSystem.ts`
  - `src-js/systems/visual/BehavioralPredictionEngine.ts`
- **Domain:** Year 3000 visual stack (managed by `MasterAnimationCoordinator`).
- **Related Style Modules:**
  - `src/systems/_sn_behavioral_prediction.scss` (_base highlight & glow_)
  - `_sn_prediction_effects.scss` (future Phase 3 fancy pulses)

BPE does the _thinking_ (learning patterns, predicting targets); PMS does the _feeling_ (mega-echo bursts, resonance glows, anticipatory warmth).

---

## 1 ▪ Key Concepts

| Concept                 | Purpose                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Quantum Empathy**     | Lightweight ML-inspired layer inside BPE that learns interaction patterns and computes confidence scores.                               |
| **Imminence / Clarity** | Two realtime KPIs produced by PMS from music/segment analytics (0-1 range). Combined heuristic decides when to fire a resonance effect. |
| **Anticipatory Warmth** | Sub-250 ms glow applied on high-confidence element to subtly prime the user. Triggered via `triggerAnticipatoryWarmth()` helper.        |
| **Mega Echo**           | Larger concentric ripple used when imminence ≥ 0.7 (high certainty of imminent action).                                                 |

---

## 2 ▪ Event & Data Flow

```
┌───────── MusicSyncService (energy/valence/segment) ─────────┐
│                                                            │
│   processedMusicData ──► PMS.updateFromMusicAnalysis()     │
│                                                            │
└─────────────────────────────────────────────────────────────┘
           ▲                                   │ CSS vars
           │                                   ▼
User DOM ──► BPE.learnFromInteraction()   --sn-materialize-*
           │                                   │
           └─ predictions + confidence ──► PMS.setTargetElement() & .triggerAnticipatoryWarmth()
```

---

## 3 ▪ Configuration Snippet

Both systems honour the common **modeConfig** pattern passed via `updateModeConfiguration()`.

```ts
interface ModeConfig {
  enabled?: boolean; // master on/off
  animations?: boolean; // allow expensive animations
  intensity?: number; // 0.5 … 2 multiplier
  predictionSettings?: {
    sensitivity?: number; // BPE confidence gate
    responsiveness?: number; // highlight fade-in speed
    confidenceThreshold?: number; // empathy threshold
  };
}
```

---

## 4 ▪ Public APIs

| System  | Method                                | Description                                                               |
| ------- | ------------------------------------- | ------------------------------------------------------------------------- |
| **PMS** | `onAnimate(delta)`                    | Frame hook – fires resonance when (`imminence*0.7 + clarity*0.3`) > 0.6.  |
|         | `setTargetElement(el)`                | Externally set element to receive resonance glows. Usually called by BPE. |
|         | `triggerAnticipatoryWarmth(el, opts)` | Public utility to spawn hue-shifted warmth glow for `durationMs`.         |
|         | `updateFromMusicAnalysis(data)`       | Smooth‐lerps imminence & clarity, updates CSS vars.                       |
| **BPE** | `initializeOptimizedQuantumEmpathy()` | Starts interaction tracking & prediction loops.                           |
|         | `updateFromMusicAnalysis(data)`       | Feeds latest music context into prediction algorithm.                     |
|         | `updateModeConfiguration(cfg)`        | Adjusts sensitivity, thresholds, empathy on/off.                          |

---

## 5 ▪ Algorithm Walk-Through

### 5.1 Behavioral Prediction Engine (thinking)

1. **Interaction Logging** – listens to `click` and `focus`, storing a signature (`class:btn|tag:button`).
2. **Pattern DB** – tracks `frequency`, `lastUsed`, `contexts` array (energy/valence/timeSegment).
3. **Confidence Calculation** – `confidence = f(freq, recency)`.
4. **Context Similarity** – each past context compared to current music context; final confidence multiplied by similarity.
5. **Highlight Application** – top 5 predictions get `sn-predictive-highlight` classes; strong variants if `confidence>0.75`.

### 5.2 Predictive Materialization System (feeling)

1. **Music-Driven Signals** – imminence & clarity derived from `segmentTransitionConfidence`, `energy`, `visualIntensity`, `valence`.
2. **animate() Loop** – when `(imminence*0.7 + clarity*0.3) > threshold` & cooldown elapsed, resonance fires.
3. **Resonance Decision** – mega-echo if imminence ≥ 0.7 else subtle `.sn-materialize-resonance` class.
4. **Anticipatory Warmth** – exported helper; also automatically called by BPE for top prediction.

---

## 6 ▪ SCSS Integration

| Variable / Class                  | Owner     | Purpose                                                                          |
| --------------------------------- | --------- | -------------------------------------------------------------------------------- |
| `--sn-materialize-imminence`      | PMS       | 0-1 numeric – used in shaders or filter strengths.                               |
| `--sn-materialize-clarity`        | PMS       | 0-1 numeric – secondary channel.                                                 |
| `.sn-materialize-resonance`       | PMS       | Keyframe animation to create a soft glow ripple.                                 |
| `.sn-temporal-echo`               | PMS & ECE | Re-usable ripple element (mega echo).                                            |
| `.sn-predictive-highlight`        | BPE       | Base highlight for predicted targets.                                            |
| `.sn-predictive-highlight-strong` | BPE       | Stronger variant (`confidence>0.75`).                                            |
| `.sn-anticipatory-warmth`         | Shared    | Glow class with CSS vars `--sn-anticipatory-intensity`, `--sn-anticipatory-hue`. |

> All these classes live (or will live) inside `_sn_behavioral_prediction.scss` and `_sn_prediction_effects.scss`. PMS/BPE only set CSS variables; they **never** hard-code colours.

---

## 7 ▪ Usage Example

```ts
import { BehavioralPredictionEngine } from "@/systems/visual/BehavioralPredictionEngine";
import { PredictiveMaterializationSystem } from "@/systems/visual/PredictiveMaterializationSystem";

const prediction = new BehavioralPredictionEngine(
  cfg,
  utils,
  perf,
  music,
  settings,
  y3k
);
const materialize = new PredictiveMaterializationSystem(
  cfg,
  utils,
  perf,
  music,
  settings,
  y3k
);

prediction.updateModeConfiguration({
  predictionSettings: { sensitivity: 0.6 },
});
materialize.setTargetElement(
  document.querySelector("[data-testid='play-button']")
);
```

---

## 8 ▪ Best Practices

1. **Let BPE call PMS** – avoid duplicating anticipation logic.
2. **Cooldowns matter** – don't lower `_resonanceCooldownMs` unless FPS budget allows.
3. **Match colours to theme** – rely on CSS vars not hard-coded RGBA.
4. **Respect `prefers-reduced-motion`.** Both systems early-return if the user prefers reduced motion.

---

## 9 ▪ Roadmap

| Phase | Item                                                                  |
| ----- | --------------------------------------------------------------------- |
| 3     | ML-powered attention graph to improve context similarity.             |
| 3     | Add CSS Houdini Paint API for echo rendering.                         |
| 4     | Integrate genre-familiarity (`UserGenreHistory`) to modulate clarity. |
| 5     | Surface predictions as tooltip hints for accessibility.               |

---

## 10 ▪ Status

- **Alpha** – APIs may change prior to v1.0.
- **Introduced:** v0.10 (June 2025)

---

_"All art is prediction."_
