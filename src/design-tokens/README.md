# Design Token System

Unified design token architecture for the Catppuccin StarryNight Year 3000 System.

## Token Namespaces

### `--sn.bg.*` - Background System
Controls WebGL/WebGPU backgrounds, gradients, nebula layers, and particle systems.

**Critical Variables (CSSVariableBatcher fast-path):**
- `--sn.bg.webgl.ready` - WebGL context status
- `--sn.bg.gradient.primary.rgb` - Dynamic primary gradient color

### `--sn.music.*` - Music Synchronization  
Real-time audio analysis and beat-synchronized visual effects.

**Critical Variables (Real-time updates):**
- `--sn.music.beat.pulse.intensity` - Beat pulse intensity (0-1)
- `--sn.music.rhythm.phase` - Rhythm phase angle (0-360deg)
- `--sn.music.breathing.scale` - Breathing scale factor (0.8-1.2)

### `--sn.anim.*` - Animation System
Easing functions, transitions, 3D transforms, and motion intelligence.

### `--sn.perf.*` - Performance System
Hardware capabilities, quality scaling, and performance monitoring.

### `--sn.ui.*` - UI Components
Card system, glass effects, navigation, sidebar, buttons.

### `--sn.text.*` - Text System  
Typography scale, text effects, and glow intensity.

### `--sn.ix.*` - Interaction System
Feedback, ripples, magnetic effects, and temporal echoes.

### `--sn.color.*` - Color System
Dynamic accent management and OKLab color processing.

### `--sn.layout.*` - Layout System
Z-index management, spacing scale, and border radius.

## Migration Guide

### Phase 1: Critical Variables
Update TypeScript files that set real-time variables:
```typescript
// Old
CSSVariableBatcher.setProperty('--sn-beat-pulse-intensity', intensity);

// New  
CSSVariableBatcher.setProperty('--sn.music.beat.pulse.intensity', intensity);
```

### Phase 2: Background System
Update SCSS files using gradient variables:
```scss
// Old
background: rgb(var(--sn-gradient-primary-rgb));

// New
background: rgb(var(--sn.bg.gradient.primary.rgb));
```

### Phase 3: UI Components
Update component-specific variables:
```scss
// Old
opacity: var(--card-energy-level);

// New  
opacity: var(--sn.ui.card.energy.level);
```

## Backward Compatibility

Legacy aliases are maintained in `tokens.scss` during the transition period:
```scss
--sn-beat-pulse-intensity: var(--sn.music.beat.pulse.intensity);
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