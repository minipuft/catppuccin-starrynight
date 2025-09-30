# Variable Inventory - Phase 6.2 Analysis
**Complete Variable Audit for SCSS Modernization**

## Summary Statistics

| Category | Count | Status |
|----------|-------|--------|
| Total variables defined locally | 47 | Need centralization |
| Old metaphorical variable uses | 63 | Need migration |
| Files with local definitions | 5 | Need refactoring |
| Compatibility layer mappings | ~50 | Need removal |
| Unified-effects variables | 12 | ✅ Already centralized |

---

## File 1: `_particle_field.scss` (Star Field & Neural Network)

### Local Variable Definitions (27 variables)

#### Particle System (6 vars)
```scss
--particle-meditation-sync: 15s;              // Base animation rhythm
--particle-field-density: 0.4;                // Particle count multiplier (0-1)
--particle-life-cycle-speed: var(--particle-meditation-sync);  // Derived
--particle-neural-connection-range: 100px;    // Connection distance threshold
--particle-cosmic-scale: 1;                   // Overall scale factor
--particle-reality-phase: calc(...);          // Phase rotation (derived from music)
```

#### Star Field System (5 vars)
```scss
--star-field-depth: 4;                        // Number of depth layers
--star-brightness-variance: 0.3;              // Brightness randomization (0-1)
--star-size-range: 2px;                       // Max star size
--star-twinkle-frequency: 8s;                 // Twinkle animation duration
--star-parallax-intensity: 0.15;              // Parallax movement strength
```

#### Neural Network System (5 vars) ⚠️ OLD METAPHORICAL NAMES
```scss
--neural-synaptic-firing-speed: 6s;           // → --sn-particle-connect-speed
--neural-connection-opacity: 0.1;             // → --sn-particle-connection-opacity
--neural-pulse-propagation: 2s;               // → --sn-particle-pulse-speed
--neural-dendrite-growth: 3s;                 // → --sn-particle-growth-speed
--neural-network-complexity: 2;               // → --sn-particle-connection-complexity
```

#### Music Sync Variables (11 vars - mostly computed)
```scss
--particle-awakening-threshold: 0.3;          // Music energy threshold
--particle-transcendence-threshold: 0.6;      // High energy threshold
--music-particle-awakening-gate: max(...);    // Derived threshold gate
--music-particle-transcendence-gate: max(...);// Derived threshold gate
--music-particle-resonance: calc(...);        // Derived multiplier
--music-neural-intensity: calc(...);          // Derived multiplier
--music-flow-multiplier: calc(...);           // Derived multiplier
--particle-animation-duration: var(...);      // Alias to meditation-sync
--particle-depth-shift: calc(...);            // Derived 3D depth
--particle-color-shift: calc(...);            // Derived hue rotation
```

### Usage Analysis
- **16 uses** of old metaphorical variables (`--neural-*`)
- Heavy use of `--sn-beat-pulse-intensity`, `--sn-music-energy` (good! already centralized)
- Media queries adjust values for performance (mobile, low-power)

### Migration Strategy
**Centralize in `_unified-effects-engine.scss` under particle system section**

---

## File 2: `_crystalline_glassmorphism.scss`

### Local Variable Definitions (8 variables)

#### Crystal Effect Variables (4 vars) ⚠️ OLD METAPHORICAL NAMES
```scss
--crystal-base-intensity: 0.6;                // → --sn-glass-base-intensity
--crystal-music-multiplier: 1.0;              // → --sn-glass-music-multiplier
--crystal-float-height: 15px;                 // → --sn-glass-float-height
--crystal-float-rhythm: 4s;                   // → --sn-glass-float-rhythm
```

#### Compatibility Aliases (4 vars - point to unified system)
```scss
--crystal-pulse-intensity: var(--sn-unified-effect-intensity, 0.6);  // ✅ Good
--prism-intensity: calc(var(--sn-unified-music-energy, 0.5) * 0.8); // ✅ Good
--iridescence-flow-speed: var(--crystal-float-rhythm, 4s);          // Alias
```

### Usage Analysis
- **8 uses** of `--crystal-*` variables
- Actively uses `--sn-unified-effect-intensity` and `--sn-unified-music-energy` (good!)
- Sets unified variables locally in selectors for dynamic control
- Media queries for mobile/high-contrast

### Migration Strategy
**Rename crystal-* to sn-glass-*, centralize base definitions**

---

## File 3: `_fluid-gradient-base.scss` (Liquid Effects)

### Local Variable Definitions (8 variables)

#### Fluid Effect Variables (2 core vars)
```scss
--fluid-base-intensity: 0.5;                  // → --sn-gradient-base-intensity
--fluid-animation-duration: 12s;              // → --sn-gradient-flow-duration
```

#### Music Sync Aliases (2 vars - derived from centralized)
```scss
--fluid-phase: var(--sn-music-rhythm-phase, 0deg);           // ✅ Good alias
--fluid-amplitude: var(--sn-music-breathing-scale, 1.0);     // ✅ Good alias
```

#### Unified System Aliases (1 var)
```scss
--fluid-intensity: var(--sn-unified-effect-intensity, 0.5);  // ✅ Good alias
```

#### Gradient Rendering Aliases (4 vars - point to existing design tokens)
```scss
--fluid-gradients-opacity: var(--sn-ui-glass-opacity, 0.1);      // ✅ Points to token
--fluid-gradients-blur: var(--sn-ui-glass-blur, 20px);           // ✅ Points to token
--fluid-gradients-saturation: var(--sn-bg-gradient-saturation, 1.1); // ✅ Points to token
--fluid-gradients-duration: var(--sn-anim-transition-cosmic, 1200ms); // ✅ Points to token
```

### Usage Analysis
- **19 uses** of `--fluid-*` variables
- Most fluid-* are actually ALIASES to existing centralized variables (good pattern!)
- Only 2 unique variables need centralization: `--fluid-base-intensity`, `--fluid-animation-duration`
- Music sync integration well-designed

### Migration Strategy
**Keep alias pattern, centralize only 2 base variables, rename to sn-gradient-***

---

## File 4: `_shape_transitions.scss`

### Variable Usage (NO LOCAL DEFINITIONS)

#### Uses from _variable-compatibility.scss (11 uses)
```scss
--organic-corners                   // → --dynamic-corners
--organic-depth-near                // → --dynamic-depth-near
--organic-depth-mid                 // → --dynamic-depth-mid
--organic-depth-far                 // → --dynamic-depth-far
--organic-transition-medium         // → --dynamic-transition-medium
```

### Analysis
- NO local `:root` definitions (good!)
- All variables come from compatibility layer (which points to undefined vars)
- Currently works via fallback values in compatibility layer

### Migration Strategy
**Define dynamic-* variables in centralized system, update references**

---

## File 5: `_advanced_layer.scss` (Holographic Effects)

### Variable Usage (NO LOCAL DEFINITIONS)

#### Uses from _variable-compatibility.scss (9 uses)
```scss
--holographic-depth-layers          // → --layered-depth-count
--holographic-projection-distance   // → --layered-projection-distance
--holographic-glow-intensity        // → --layered-glow-intensity
--crystal-* variables               // From _crystalline_glassmorphism
```

### Analysis
- NO local `:root` definitions (good!)
- Depends on compatibility layer + crystal variables
- References undefined variables from compatibility layer

### Migration Strategy
**Define layered-* variables in centralized system, update references**

---

## Variable Dependency Graph

```
Centralized System (_unified-effects-engine.scss)
│
├─→ --sn-unified-effect-intensity (0-1)
│   ├─→ Used by: fluid-intensity, crystal-pulse-intensity, all mixins
│   └─→ TypeScript controllable
│
├─→ --sn-unified-music-energy (0-1)
│   ├─→ Used by: prism-intensity, particle resonance calculations
│   └─→ Real-time audio integration
│
├─→ --sn-unified-blur-amount (derived)
├─→ --sn-unified-scale-delta (derived)
├─→ --sn-unified-opacity-base (derived)
└─→ --sn-unified-glow-radius (derived)

Feature Files (Need Centralization)
│
├─→ Particle System (_particle_field.scss)
│   ├─→ 27 local variables
│   └─→ Depends on: sn-beat-pulse-intensity, sn-music-energy
│
├─→ Glass System (_crystalline_glassmorphism.scss)
│   ├─→ 8 local variables (4 unique, 4 aliases)
│   └─→ Depends on: unified-effect-intensity, unified-music-energy
│
├─→ Gradient System (_fluid-gradient-base.scss)
│   ├─→ 8 local variables (2 unique, 6 aliases)
│   └─→ Depends on: music-rhythm-phase, music-breathing-scale
│
├─→ Shape System (_shape_transitions.scss)
│   ├─→ 0 local definitions
│   └─→ Depends on: compatibility layer (hollow)
│
└─→ Layer System (_advanced_layer.scss)
    ├─→ 0 local definitions
    └─→ Depends on: compatibility layer (hollow)

Compatibility Layer (_variable-compatibility.scss) ⚠️ HOLLOW
│
├─→ Maps --organic-* → --dynamic-* (UNDEFINED targets)
├─→ Maps --neural-* → --audio-* (UNDEFINED targets)
├─→ Maps --crystal-* → --glassmorphism-* (UNDEFINED targets)
├─→ Maps --holographic-* → --layered-* (UNDEFINED targets)
└─→ Only works via fallback values
```

---

## Variable Naming Migration Map

### Particle System (Neural → Particle)
| Old Name (Metaphorical) | New Name (Technical) | Value | Type |
|------------------------|----------------------|-------|------|
| `--neural-synaptic-firing-speed` | `--sn-particle-connect-speed` | 6s | duration |
| `--neural-connection-opacity` | `--sn-particle-connection-opacity` | 0.1 | opacity |
| `--neural-pulse-propagation` | `--sn-particle-pulse-speed` | 2s | duration |
| `--neural-dendrite-growth` | `--sn-particle-growth-speed` | 3s | duration |
| `--neural-network-complexity` | `--sn-particle-connection-complexity` | 2 | integer |

### Glass System (Crystal → Glass)
| Old Name (Metaphorical) | New Name (Technical) | Value | Type |
|------------------------|----------------------|-------|------|
| `--crystal-base-intensity` | `--sn-glass-base-intensity` | 0.6 | 0-1 |
| `--crystal-music-multiplier` | `--sn-glass-music-multiplier` | 1.0 | 0-2 |
| `--crystal-float-height` | `--sn-glass-float-height` | 15px | length |
| `--crystal-float-rhythm` | `--sn-glass-float-rhythm` | 4s | duration |

### Gradient System (Fluid → Gradient)
| Old Name (Metaphorical) | New Name (Technical) | Value | Type |
|------------------------|----------------------|-------|------|
| `--fluid-base-intensity` | `--sn-gradient-base-intensity` | 0.5 | 0-1 |
| `--fluid-animation-duration` | `--sn-gradient-flow-duration` | 12s | duration |

### Shape System (Organic → Dynamic)
| Old Name (Metaphorical) | New Name (Technical) | Value | Type |
|------------------------|----------------------|-------|------|
| `--organic-corners` | `--sn-shape-corner-radius` | 16px | length |
| `--organic-depth-near` | `--sn-shape-depth-near` | translateZ(12px) | transform |
| `--organic-depth-mid` | `--sn-shape-depth-mid` | translateZ(6px) | transform |
| `--organic-depth-far` | `--sn-shape-depth-far` | translateZ(0px) | transform |
| `--organic-transition-medium` | `--sn-shape-transition-medium` | 0.5s | duration |

### Layer System (Holographic → Layered)
| Old Name (Metaphorical) | New Name (Technical) | Value | Type |
|------------------------|----------------------|-------|------|
| `--holographic-depth-layers` | `--sn-layered-depth-count` | 3 | integer |
| `--holographic-projection-distance` | `--sn-layered-projection-distance` | 30px | length |
| `--holographic-glow-intensity` | `--sn-layered-glow-intensity` | 0.8 | 0-1 |

---

## Centralization Plan

### New Structure in `_unified-effects-engine.scss`

```scss
:root {
  // === EXISTING UNIFIED SYSTEM (KEEP) ===
  --sn-unified-effect-intensity: 0.5;
  --sn-unified-music-energy: 0.5;
  --sn-unified-performance-quality: 1.0;
  // ... existing derived formulas ...

  // === PARTICLE FIELD SYSTEM (NEW) ===
  --sn-particle-base-speed: 15s;              // Meditation sync rhythm
  --sn-particle-field-density: 0.4;           // Particle count (0-1)
  --sn-particle-connection-range: 100px;      // Connection distance
  --sn-particle-connect-speed: 6s;            // Connection animation speed
  --sn-particle-connection-opacity: 0.1;      // Connection line opacity
  --sn-particle-pulse-speed: 2s;              // Pulse propagation
  --sn-particle-growth-speed: 3s;             // Growth animation
  --sn-particle-connection-complexity: 2;     // Max connections per particle

  // Star field sub-system
  --sn-star-depth-layers: 4;                  // Number of parallax layers
  --sn-star-brightness-variance: 0.3;         // Brightness randomization
  --sn-star-max-size: 2px;                    // Maximum star size
  --sn-star-twinkle-speed: 8s;                // Twinkle frequency
  --sn-star-parallax-intensity: 0.15;         // Parallax strength

  // === GLASSMORPHISM SYSTEM (NEW) ===
  --sn-glass-base-intensity: 0.6;             // Base glass effect (0-1)
  --sn-glass-music-multiplier: 1.0;           // Music reactivity (0-2)
  --sn-glass-float-height: 15px;              // Floating animation height
  --sn-glass-float-rhythm: 4s;                // Breathing rhythm

  // === GRADIENT SYSTEM (NEW) ===
  --sn-gradient-base-intensity: 0.5;          // Gradient strength (0-1)
  --sn-gradient-flow-duration: 12s;           // Flow animation speed

  // === SHAPE SYSTEM (NEW) ===
  --sn-shape-corner-radius: 16px;             // Default border radius
  --sn-shape-depth-near: translateZ(12px);    // 3D depth near plane
  --sn-shape-depth-mid: translateZ(6px);      // 3D depth mid plane
  --sn-shape-depth-far: translateZ(0px);      // 3D depth far plane
  --sn-shape-transition-medium: 0.5s;         // Standard transition time

  // === LAYERED EFFECTS SYSTEM (NEW) ===
  --sn-layered-depth-count: 3;                // Number of depth layers
  --sn-layered-projection-distance: 30px;     // Layer separation
  --sn-layered-glow-intensity: 0.8;           // Glow effect strength
}
```

---

## Migration Priorities

### Priority 1: High Impact, Low Risk
1. **Shape System** - 0 local definitions, just rename references ✅
2. **Layer System** - 0 local definitions, just rename references ✅

### Priority 2: Medium Complexity
3. **Gradient System** - Only 2 unique variables to centralize ✅
4. **Glass System** - 4 unique variables, well-structured ✅

### Priority 3: High Complexity
5. **Particle System** - 27 variables, many computed, complex dependencies ⚠️

---

## Risk Assessment

### LOW RISK (Priority 1 & 2)
- Files with no local definitions
- Simple variable renames
- Well-isolated systems
- Easy to test

### MEDIUM RISK (Priority 3)
- Large number of variables
- Complex computed values
- Music sync dependencies
- Requires careful testing

### MITIGATION STRATEGIES
1. Migrate one system at a time
2. Test visual output after each migration
3. Keep git commits granular
4. Document any visual changes
5. Test music synchronization thoroughly

---

**Status:** Phase 6.2 COMPLETE - Ready for Phase 6.3 (Centralization Design)
**Next Step:** Begin centralizing variables in `_unified-effects-engine.scss`
**Last Updated:** 2025-09-29