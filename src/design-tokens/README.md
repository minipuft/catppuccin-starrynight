# Design Token System

Unified design token architecture for the Catppuccin StarryNight Year 3000 System.

## Token Namespaces

All design tokens use **hyphenated notation** for CSS custom property compatibility.

### `--sn-bg-*` - Background System
Controls WebGL/WebGPU backgrounds, gradients, nebula layers, and particle systems.

**Critical Variables (CSSVariableBatcher fast-path):**
- `--sn-bg-webgl-ready` - WebGL context status
- `--sn-bg-gradient-primary-rgb` - Dynamic primary gradient color
- `--sn-bg-gradient-secondary-rgb` - Secondary gradient color
- `--sn-bg-gradient-opacity` - Gradient opacity level
- `--sn-bg-particle-density` - Particle system density

### `--sn-music-*` - Music Synchronization
Real-time audio analysis and beat-synchronized visual effects.

**Critical Variables (Real-time updates):**
- `--sn-music-beat-pulse-intensity` - Beat pulse intensity (0-1) ⚡
- `--sn-music-rhythm-phase` - Rhythm phase angle (0-360deg) ⚡
- `--sn-music-breathing-scale` - Breathing scale factor (0.8-1.2) ⚡
- `--sn-music-spectrum-phase` - Spectrum phase angle ⚡
- `--sn-music-energy-level` - Current energy level (0-1)
- `--sn-music-tempo-bpm` - Tempo in beats per minute

### `--sn-anim-*` - Animation System
Easing functions, transitions, 3D transforms, and motion intelligence.

**Key Variables:**
- `--sn-anim-easing-emergence` - Emergence curve
- `--sn-anim-easing-organic` - Organic motion curve
- `--sn-anim-transition-fast` - Fast transition duration (200ms)
- `--sn-anim-transition-standard` - Standard duration (400ms)
- `--sn-anim-motion-intelligence-level` - Motion intelligence level (0-3)

### `--sn-perf-*` - Performance System
Hardware capabilities, quality scaling, and performance monitoring.

**Key Variables:**
- `--sn-perf-gpu-acceleration-enabled` - GPU acceleration status
- `--sn-perf-fps-target` - Target frame rate (60)
- `--sn-perf-quality-particles` - Particle quality scaling (0-1)
- `--sn-perf-quality-shadows` - Shadow quality scaling (0-1)

### `--sn-ui-*` - UI Components
Card system, glass effects, navigation, sidebar, buttons.

**Key Variables:**
- `--sn-ui-card-energy-level` - Card energy level
- `--sn-ui-glass-opacity` - Glass effect opacity
- `--sn-ui-glass-blur` - Glass blur radius
- `--sn-ui-button-cosmic-glow` - Button glow intensity

### `--sn-text-*` - Text System
Typography scale, text effects, and glow intensity.

**Key Variables:**
- `--sn-text-glow-intensity` - Text glow intensity ⚡
- `--sn-text-gradient-angle` - Text gradient angle
- `--sn-text-scale-base` - Base font size (1rem)
- `--sn-text-scale-lg` - Large font size (1.125rem)

### `--sn-ix-*` - Interaction System
Feedback, ripples, magnetic effects, and temporal echoes.

**Key Variables:**
- `--sn-ix-magnetic-hover-pull` - Hover magnetic pull (1.05)
- `--sn-ix-magnetic-focus-pull` - Focus magnetic pull (1.1)
- `--sn-ix-ripple-intensity` - Ripple effect intensity (0.6)
- `--sn-ix-ripple-duration` - Ripple animation duration (600ms)

### `--sn-color-*` - Color System
Dynamic accent management and OKLab color processing.

**Key Variables:**
- `--sn-color-accent-hex` - Accent color (hex)
- `--sn-color-accent-rgb` - Accent color (RGB components)
- `--sn-color-oklab-primary-r/g/b` - OKLAB processed primary RGB
- `--sn-color-oklab-accent-luminance` - Accent luminance value
- `--sn-cosmic-accent-rgb` - Cosmic theme accent
- `--sn-dynamic-accent-rgb` - Dynamic music-responsive accent

### `--sn-layout-*` - Layout System
Z-index management, spacing scale, and border radius.

**Key Variables:**
- `--sn-layout-z-background` - Background z-index (-11)
- `--sn-layout-z-content` - Content z-index (0)
- `--sn-layout-space-md` - Medium spacing (1rem)
- `--sn-layout-radius-md` - Medium radius (8px)

### `--sn-visual-effects-*` - Visual Effects Field System
Magnetic depth, 3D perspective, and visual field dynamics.

**Key Variables:**
- `--sn-visual-effects-depth-field` - 3D perspective (800px)
- `--sn-visual-effects-magnetic-hover-pull` - Magnetic hover distance (12px)
- `--sn-visual-effects-field-intensity` - Field intensity (0-1)
- `--sn-visual-effects-response-sensitivity` - Response sensitivity (0-1)

## Usage Examples

### TypeScript (CSSVariableBatcher)
```typescript
// Setting critical real-time variables
CSSVariableBatcher.setProperty('--sn-music-beat-pulse-intensity', intensity);
CSSVariableBatcher.setProperty('--sn-music-rhythm-phase', `${phase}deg`);

// Setting standard variables
CSSVariableBatcher.setProperty('--sn-color-accent-rgb', '203, 166, 247');
```

### SCSS (Design Token Usage)
```scss
// Using background system tokens
.my-background {
  background: rgb(var(--sn-bg-gradient-primary-rgb));
  opacity: var(--sn-bg-gradient-opacity);
}

// Using animation tokens
.my-element {
  transition: transform var(--sn-anim-transition-standard) var(--sn-anim-easing-organic);
}

// Using color tokens
.my-card {
  color: rgb(var(--sn-color-accent-rgb));
  box-shadow: 0 4px 12px rgba(var(--sn-color-oklab-primary-r), var(--sn-color-oklab-primary-g), var(--sn-color-oklab-primary-b), 0.2);
}
```

## Backward Compatibility

Legacy aliases are maintained in `tokens.scss` during the transition period:
```scss
// Legacy aliases (will be removed in v3.0)
--sn-beat-pulse-intensity: var(--sn-music-beat-pulse-intensity);
--sn-rhythm-phase: var(--sn-music-rhythm-phase);
--sn-accent-hex: var(--sn-color-accent-hex);
```

## Performance Notes

- Variables marked with ⚡ bypass CSSVariableBatcher for real-time updates
- All tokens support `prefers-reduced-motion` accessibility requirements
- Critical variables are optimized for 60fps performance targets

## Integration with Systems

- **ColorHarmonyEngine**: Updates `--sn.color.accent.*` variables
- **BeatSyncVisualSystem**: Updates `--sn.music.*` variables  
- **WebGLGradientBackgroundSystem**: Reads `--sn.bg.*` variables
- **CSSVariableBatcher**: Fast-path for critical variables