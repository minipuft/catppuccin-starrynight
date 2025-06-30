# 🌀 Framerate-Independent Lerp Smoothing Integration

**Document Version:** 1.0
**Date:** Current Date (To be filled by version control)
**Status:** ✅ Implemented

## 🎯 Overview

This document details the implementation of a framerate-independent linear interpolation (lerp) smoothing utility, `lerpSmooth`, and its integration into various visual systems within the Catppuccin StarryNight theme. This utility provides a consistent and natural-feeling smoothing effect for animations, regardless of the client's display refresh rate or system performance.

The core formula allows properties to approach their target values exponentially, based on a "half-life" parameter, ensuring smooth transitions without being tied to fixed animation durations or frame counts.

---

## 🛠️ Core Utility: `Year3000Utilities.lerpSmooth`

The `lerpSmooth` function is the heart of our smoothing mechanism, implemented within the `Year3000Utilities` object in `theme.js`.

### Purpose

To provide a robust and reusable function for smoothly interpolating a numeric value towards a target value over time, independent of the application's frame rate.

### Formula

The function implements the following formula, derived from [Rory Driscoll's article on frame rate independent damping](https://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/):

```
newValue = target + (current - target) * Math.pow(2, -deltaTime / halfLife)
```

Where:

- `current`: The current value of the property being smoothed.
- `target`: The target value the property should move towards.
- `deltaTime`: The time elapsed since the last frame, in seconds.
- `halfLife`: The time (in seconds) it should take for the value to reach halfway to its target. A smaller `halfLife` results in faster smoothing.

### Parameters

- `current` (float): The current value of the property being smoothed.
- `target` (float): The target value the property should move towards.
- `deltaTime` (float): The time elapsed since the last frame, in seconds. This is crucial for framerate independence.
- `halfLife` (float): The time (in seconds) it should take for the value to reach halfway to its target. Determines the "snappiness" of the smoothing.

### Edge Case Handling

- If `halfLife` is zero, negative, or extremely close to zero (less than a small epsilon), the function immediately returns the `target` value to prevent division by zero or non-sensical behavior.
- If `deltaTime` is zero or negative (which can occur, for example, on the first frame of an animation loop before time has advanced), the function also snaps to the `target` value.

### Implementation Snippet (from `theme.js`)

```javascript
// Located within Year3000Utilities object
lerpSmooth(current, target, deltaTime, halfLife) {
  const EPSILON = 0.00001;
  if (halfLife <= EPSILON || deltaTime <= 0) {
    // Debug logging for edge cases can be enabled via YEAR3000_CONFIG.enableDebug
    return target;
  }
  return target + (current - target) * Math.pow(2, -deltaTime / halfLife);
}
```

---

## 🎶 Phase 2 Integration: `BeatSyncVisualSystem`

**Objective**: Replace abrupt beat pulses with smooth attack and decay animations using `lerpSmooth`.

### Key Changes & `lerpSmooth` Usage:

1.  **State Variables**:

    - `currentPulseIntensity`: Stores the current smoothed intensity of the beat pulse.
    - `targetPulseIntensity`: Set to the music's `visualIntensity` when a beat is detected.
    - `pulseHalfLifeAttack` (e.g., `0.05s`): Determines the speed of the pulse attack (intensity increasing).
    - `pulseHalfLifeDecay` (e.g., `0.15s`): Determines the speed of the pulse decay (intensity decreasing).
    - `pulseResetThreshold` (e.g., `0.005`): A small value to snap `currentPulseIntensity` to `0` and reset `targetPulseIntensity` once the pulse has effectively faded.

2.  **Animation Loop (`_animationLoop`)**:

    - Uses `requestAnimationFrame` for continuous updates.
    - Calculates `deltaTime` between frames.
    - In each frame, `currentPulseIntensity` is updated by calling:
      ```javascript
      this.currentPulseIntensity = Year3000Utilities.lerpSmooth(
        this.currentPulseIntensity,
        this.targetPulseIntensity,
        deltaTime,
        this.targetPulseIntensity > this.currentPulseIntensity
          ? this.pulseHalfLifeAttack
          : this.pulseHalfLifeDecay
      );
      ```
    - The smoothed `currentPulseIntensity` is then applied to the `--sn-beat-pulse-intensity` CSS variable.

3.  **`onBeatDetected` Modification**:
    - Instead of directly manipulating CSS or using `setTimeout` for resets, this method now simply sets `this.targetPulseIntensity = visualIntensity`. The animation loop handles the smoothing and decay.

**Outcome**: Beat-driven UI pulses now have a more organic and fluid appearance, smoothly rising on beat detection and gracefully fading out.

---

## 🌌 Phase 3 Integration: `DepthLayerSystem`

**Objective**: Smooth the parallax effects of depth layers in response to music analysis, making their movement and property changes more fluid.

### Key Changes & `lerpSmooth` Usage:

1.  **State Variables**:

    - `layerProperties`: An array where each element is an object storing `current` and `target` states for various CSS properties of a depth layer (e.g., `currentOffsetY`, `targetOffsetY`, `currentOpacity`, `targetOpacity`, etc.).
    - `parallaxHalfLife` (e.g., `0.15s`): A single half-life value used for smoothing all parallax-driven properties of the depth layers.

2.  **Initialization (`initializeDepthLayerProperties`)**:

    - Populates `this.layerProperties` with initial `current` and `target` values for each layer. These are initially the same (no animation at start) and are applied directly to CSS for the first frame.

3.  **Animation Loop (`_animationLoop`)**:

    - Continuously updates the `current` properties for each layer towards their respective `target` properties using `lerpSmooth`.
    - Example for `offsetY` for a layer `i`:
      ```javascript
      layer.currentOffsetY = Year3000Utilities.lerpSmooth(
        layer.currentOffsetY,
        layer.targetOffsetY,
        deltaTime,
        this.parallaxHalfLife
      );
      ```
    - This is repeated for `opacity`, `blur`, `hueRotate`, and `scale`.
    - The smoothed `current` values are then applied to their corresponding CSS variables (e.g., `--sn-depth-layer-<i>-offset-y`).

4.  **`updateFromMusicAnalysis` Modification**:
    - This method now updates the `target` properties within `this.layerProperties` based on `processedMusicData` (e.g., `layer.targetOffsetY = bandIntensity * (20 - i * 4);`).
    - The animation loop then takes care of smoothly transitioning the `current` values to these new targets.

**Outcome**: Parallax effects on depth layers respond more gracefully to changes in music, with smoother transitions in position, opacity, blur, and other visual attributes.

---

## ✨ Phase 4 Integration: `LightweightParticleSystem`

**Objective**: Apply smooth animations to particle movement, size, and opacity changes, creating a more natural and less jarring particle effect.

### Key Changes & `lerpSmooth` Usage:

1.  **State Variables (Class Level)**:

    - `lastFrameTime`: For `deltaTime` calculation in the render loop.
    - `particleHalfLife` (e.g., `0.08s`): Default half-life for smoothing particle properties. Can be adjusted for different effects (e.g., faster smoothing for visual properties like size/opacity).

2.  **Particle Object Structure (in `particlePool`)**:

    - Each particle object now stores:
      - `targetX`, `targetY`, `targetRotation`: Destination values for physics-driven updates.
      - `currentX`, `currentY`, `currentSize`, `currentOpacity`, `currentRotation`: The current, smoothed values of these properties.
      - `targetSize`, `targetOpacity`: Target values for visual properties, often updated based on particle `life`.
    - `baseSize` and `baseOpacity` are retained for reference.

3.  **`spawnParticle` Modification**:

    - Initializes `currentX/Y/Rotation` to be the same as `targetX/Y/Rotation` at the moment of spawn.
    - Initial `currentSize` and `currentOpacity` are set to `0` to allow them to smoothly animate in.

4.  **Render Loop (`render` function within `startRenderLoop`)**:
    - Calculates `deltaTime`.
    - **Physics Update**: `targetX`, `targetY`, `targetRotation` are updated based on particle velocity (`vx`, `vy`, `vr`) and `deltaTime`. This step determines where the particle _should_ be based on its physics.
    - **Smoothing Position & Rotation**:
      ```javascript
      p.currentX = Year3000Utilities.lerpSmooth(
        p.currentX,
        p.targetX,
        deltaTime,
        this.particleHalfLife
      );
      p.currentY = Year3000Utilities.lerpSmooth(
        p.currentY,
        p.targetY,
        deltaTime,
        this.particleHalfLife
      );
      p.currentRotation = Year3000Utilities.lerpSmooth(
        p.currentRotation,
        p.targetRotation,
        deltaTime,
        this.particleHalfLife
      );
      ```
    - **Visual Property Update**: `targetSize` and `targetOpacity` are updated based on particle `life` (e.g., fade out or shrink as life decreases).
    - **Smoothing Visuals**:
      ```javascript
      p.currentSize = Year3000Utilities.lerpSmooth(
        p.currentSize,
        p.targetSize,
        deltaTime,
        this.particleHalfLife * 0.8
      ); // Faster for visuals
      p.currentOpacity = Year3000Utilities.lerpSmooth(
        p.currentOpacity,
        p.targetOpacity,
        deltaTime,
        this.particleHalfLife * 0.8
      );
      ```
    - Particles are then drawn using their `current` (smoothed) properties.

**Outcome**: Particle movements are less jittery, and changes in size or opacity (like fading in/out or shrinking over time) are visually smoother and more aesthetically pleasing.

---

This systematic integration of `lerpSmooth` enhances the overall visual fluidity and responsiveness of the Catppuccin StarryNight theme, aligning with the "Year 3000" design philosophy.
