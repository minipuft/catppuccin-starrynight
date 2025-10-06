# Token Usage Guide

**Catppuccin StarryNight Theme - Developer Guide**

**Version:** 1.0.0
**Last Updated:** 2025-10-04
**Skill Level:** Beginner to Advanced

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Token Discovery](#token-discovery)
3. [Common Patterns](#common-patterns)
4. [Recipes & Examples](#recipes--examples)
5. [Best Practices](#best-practices)
6. [Anti-Patterns](#anti-patterns)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Techniques](#advanced-techniques)

---

## Quick Start

### Finding Tokens

**Token Definitions**: All tokens are defined in `src/design-tokens/tokens.scss`

**Quick Search**:
```bash
# Find color tokens
grep "^\\s*--sn-color-" src/design-tokens/tokens.scss

# Find animation tokens
grep "^\\s*--sn-anim-" src/design-tokens/tokens.scss

# Find music sync tokens
grep "^\\s*--sn-music-" src/design-tokens/tokens.scss
```

### Basic Usage Pattern

```scss
.my-element {
  // Color token
  background: rgba(var(--sn-color-accent-rgb), 0.8);

  // Transition token
  transition: all var(--sn-transition-fast-duration) var(--sn-anim-easing-organic);

  // Layout token
  padding: var(--sn-layout-space-md);
  border-radius: var(--sn-layout-radius-lg);
}
```

### IDE Autocomplete Setup

**VS Code** (`settings.json`):
```json
{
  "css.lint.unknownProperties": "ignore",
  "scss.lint.unknownProperties": "ignore",
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

---

## Token Discovery

### By Use Case

**Need a color?** → Look for `--sn-color-*`, `--sn-cosmic-*`, or `--sn-oklab-*`

**Need animation timing?** → Look for `--sn-transition-*-duration` or `--sn-anim-*`

**Need spacing?** → Look for `--sn-layout-space-*`

**Building music-reactive effect?** → Look for `--sn-music-*`

**Creating depth effect?** → Look for `--sn-visual-effects-depth-*`

**Styling UI component?** → Look for `--sn-ui-*`

### Token Categories Quick Reference

| Need | Token Prefix | Examples |
|------|--------------|----------|
| **Color** | `--sn-color-*`, `--sn-cosmic-*` | `--sn-color-accent-rgb`, `--sn-cosmic-base-hex` |
| **Animation** | `--sn-anim-*`, `--sn-transition-*` | `--sn-transition-fast-duration`, `--sn-anim-easing-organic` |
| **Spacing** | `--sn-layout-space-*` | `--sn-layout-space-md`, `--sn-layout-space-lg` |
| **Border Radius** | `--sn-layout-radius-*` | `--sn-layout-radius-md`, `--sn-layout-radius-full` |
| **Z-Index** | `--sn-layout-z-*` | `--sn-layout-z-ui`, `--sn-layout-z-modal` |
| **Music Sync** | `--sn-music-*` | `--sn-music-beat-pulse-intensity`, `--sn-music-rhythm-phase` |
| **Glass Effect** | `--sn-ui-glass-*` | `--sn-ui-glass-blur`, `--sn-ui-glass-opacity` |
| **OKLAB Colors** | `--sn-oklab-*` | `--sn-oklab-primary-rgb`, `--sn-oklab-highlight-rgb` |

---

## Common Patterns

### Pattern 1: Standard Component Styling

```scss
.custom-card {
  // Use semantic color tokens
  background: rgba(var(--sn-color-accent-rgb), 0.1);
  border: 1px solid rgba(var(--sn-color-accent-rgb), 0.3);

  // Use layout tokens for consistency
  padding: var(--sn-layout-space-md);
  border-radius: var(--sn-layout-radius-lg);

  // Use animation tokens for smooth transitions
  transition:
    background var(--sn-transition-fast-duration) var(--sn-anim-easing-organic),
    transform var(--sn-transition-fast-duration) var(--sn-anim-easing-organic);

  &:hover {
    background: rgba(var(--sn-color-accent-rgb), 0.2);
    transform: translateY(-2px);
  }
}
```

### Pattern 2: Music-Reactive Components

```scss
.music-reactive-card {
  // Base styling
  background: rgba(var(--sn-color-accent-rgb), 0.1);

  // Music-driven opacity (pulsates with beat)
  opacity: calc(1 - var(--sn-music-beat-pulse-intensity) * 0.3);

  // Music-driven scale (grows with energy)
  transform: scale(calc(1 + var(--sn-music-energy-level) * 0.05));

  // Smooth breathing effect synced to music
  animation: breathe calc(var(--sn-music-breathing-scale) * 4s) ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### Pattern 3: Glassmorphism Effect

```scss
.glass-card {
  // Glass blur and opacity
  backdrop-filter: blur(var(--sn-ui-glass-blur));
  background: rgba(var(--sn-color-accent-rgb), var(--sn-ui-glass-opacity));

  // Frost effect
  box-shadow:
    0 8px 32px 0 rgba(var(--sn-color-accent-rgb), 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, var(--sn-ui-glass-frost-intensity));

  // Standard layout tokens
  padding: var(--sn-layout-space-lg);
  border-radius: var(--sn-layout-radius-xl);
}
```

### Pattern 4: OKLAB Color Harmony

```scss
@use 'sass:color';
@use '../core/design_tokens' as *;

.oklab-harmonized {
  // Use OKLAB function for perceptually uniform colors
  color: oklab-color('highlight', 0.9);
  background: oklab-color('shadow', 0.1);

  // OKLAB tokens are automatically updated by ColorHarmonyEngine
  border-color: rgba(var(--sn-oklab-accent-rgb), 0.5);
}
```

### Pattern 5: Responsive Spacing

```scss
.responsive-container {
  // Base spacing
  padding: var(--sn-layout-space-md);
  gap: var(--sn-layout-space-sm);

  // Responsive breakpoints
  @media (min-width: 768px) {
    padding: var(--sn-layout-space-lg);
    gap: var(--sn-layout-space-md);
  }

  @media (min-width: 1200px) {
    padding: var(--sn-layout-space-xl);
    gap: var(--sn-layout-space-lg);
  }
}
```

### Pattern 6: Accessible Animations

```scss
.accessible-transition {
  // Normal transition
  transition: transform var(--sn-transition-standard-duration) var(--sn-anim-easing-organic);

  // Automatically respects prefers-reduced-motion
  // (duration tokens are set to 0ms when reduced motion is enabled)
}

// No need for manual @media (prefers-reduced-motion) - it's handled automatically!
```

---

## Recipes & Examples

### Recipe 1: Custom Music-Reactive Button

```scss
.music-button {
  // Base button styling
  background: rgba(var(--sn-ui-button-accent-rgb), 0.8);
  color: white;
  padding: var(--sn-layout-space-sm) var(--sn-layout-space-md);
  border: none;
  border-radius: var(--sn-layout-radius-full);

  // Music-reactive glow
  box-shadow:
    0 0 calc(var(--sn-music-beat-pulse-intensity) * 20px)
    rgba(var(--sn-ui-button-accent-rgb), var(--sn-music-beat-pulse-intensity));

  // Energy-based brightness
  filter: brightness(calc(1 + var(--sn-music-energy-level) * 0.2));

  // Smooth transitions
  transition:
    box-shadow var(--sn-transition-fast-duration) var(--sn-anim-easing-organic),
    filter var(--sn-transition-fast-duration) var(--sn-anim-easing-organic);

  &:hover {
    background: rgba(var(--sn-ui-button-accent-rgb), 1);
  }
}
```

### Recipe 2: Floating Card with Depth

```scss
.floating-card {
  // Base card styling
  background: rgba(var(--sn-color-accent-rgb), 0.1);
  padding: var(--sn-layout-space-lg);
  border-radius: var(--sn-layout-radius-xl);

  // Depth field effect
  transform: translateZ(var(--sn-visual-effects-depth-field));
  will-change: transform;

  // Magnetic pull on hover
  &:hover {
    transform: translateZ(calc(var(--sn-visual-effects-depth-field) +
                               var(--sn-visual-effects-magnetic-hover-pull)));
  }

  // Smooth transitions
  transition: transform var(--sn-transition-standard-duration) var(--sn-anim-easing-organic);
}
```

### Recipe 3: Breathing Background Gradient

```scss
.breathing-gradient {
  // Multi-layer gradient using token colors
  background:
    linear-gradient(
      135deg,
      rgba(var(--sn-bg-gradient-primary-rgb), 0.3),
      rgba(var(--sn-bg-gradient-accent-rgb), 0.2)
    );

  // Breathing animation synced to music
  animation: gradient-breathe var(--sn-anim-breathing-cosmic) ease-in-out infinite;

  @keyframes gradient-breathe {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
}
```

### Recipe 4: Dynamic Color Palette Component

```scss
.palette-card {
  // OKLAB-processed colors automatically harmonize
  --card-bg: rgba(var(--sn-musical-oklab-primary-rgb), 0.1);
  --card-accent: rgba(var(--sn-musical-oklab-accent-rgb), 0.8);
  --card-highlight: rgba(var(--sn-musical-oklab-highlight-rgb), 0.3);
  --card-shadow: rgba(var(--sn-musical-oklab-shadow-rgb), 0.5);

  background: var(--card-bg);
  border: 1px solid var(--card-accent);
  box-shadow:
    0 4px 12px var(--card-shadow),
    inset 0 1px 0 var(--card-highlight);

  // Colors automatically update when music changes!
}
```

### Recipe 5: Layered Z-Index System

```scss
.complex-layout {
  // Background layer
  .background-nebula {
    z-index: var(--sn-layout-z-background); // -100
  }

  // Particle effects
  .particle-layer {
    z-index: var(--sn-layout-z-particles); // 0
  }

  // Main content
  .content-layer {
    z-index: var(--sn-layout-z-content); // 100
  }

  // UI controls
  .ui-controls {
    z-index: var(--sn-layout-z-ui); // 500
  }

  // Modal overlay
  .modal-overlay {
    z-index: var(--sn-layout-z-modal); // 1000
  }
}
```

---

## Best Practices

### ✅ DO: Use Semantic Tokens

```scss
// GOOD: Semantic, clear purpose
.button {
  background: rgba(var(--sn-color-accent-rgb), 0.8);
  transition: all var(--sn-transition-fast-duration);
}
```

### ✅ DO: Delegate for Component Variants

```scss
.card {
  // Create component-specific token
  --card-accent: var(--sn-color-accent-rgb);
  background: rgba(var(--card-accent), 0.1);

  &.primary {
    --card-accent: var(--sn-cosmic-accent-rgb);
  }

  &.secondary {
    --card-accent: var(--sn-cosmic-secondary-rgb);
  }
}
```

### ✅ DO: Batch Transitions

```scss
// GOOD: Single transition property
.element {
  transition:
    background var(--sn-transition-fast-duration) var(--sn-anim-easing-organic),
    transform var(--sn-transition-fast-duration) var(--sn-anim-easing-organic),
    opacity var(--sn-transition-fast-duration) var(--sn-anim-easing-organic);
}
```

### ✅ DO: Use Calc() for Dynamic Values

```scss
// GOOD: Calculate opacity based on music intensity
.pulsing-element {
  opacity: calc(1 - var(--sn-music-beat-pulse-intensity) * 0.5);
}
```

---

## Anti-Patterns

### ❌ DON'T: Hardcode Values

```scss
// BAD: Hardcoded values
.button {
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 200ms ease;
}

// GOOD: Use tokens
.button {
  padding: var(--sn-layout-space-sm) var(--sn-layout-space-md);
  border-radius: var(--sn-layout-radius-md);
  transition: all var(--sn-transition-fast-duration) var(--sn-anim-easing-organic);
}
```

### ❌ DON'T: Create Unnecessary Tokens

```scss
// BAD: One-off token with no reuse
--my-button-specific-padding: 13px; // Used once

// GOOD: Use existing token or hardcode if truly one-off
padding: var(--sn-layout-space-sm);
```

### ❌ DON'T: Excessive Delegation Chains

```scss
// BAD: Too many levels
--level-1: 10px;
--level-2: var(--level-1);
--level-3: var(--level-2);
--level-4: var(--level-3); // Too deep!

// GOOD: Max 2-3 levels
--primitive: 10px;
--semantic: var(--primitive);
--component: var(--semantic);
```

### ❌ DON'T: Break Naming Conventions

```scss
// BAD: Inconsistent naming
--MyCustomToken: 10px;
--sn_invalid_token: 20px;
--custom-token: 30px; // Missing --sn- prefix

// GOOD: Follow conventions
--sn-layout-custom-spacing: 10px;
```

---

## Troubleshooting

### Issue: "Undefined Variable" Warning

**Symptom**: Build warnings about undefined CSS variables

**Cause**: Token referenced before it's defined or token doesn't exist

**Solution**:
```bash
# Check if token exists
grep "^\\s*--sn-your-token" src/design-tokens/tokens.scss

# Check for typos
grep -i "your-token" src/design-tokens/tokens.scss

# Run validation
./scripts/validate-tokens.sh
```

### Issue: Token Not Updating at Runtime

**Symptom**: TypeScript updates token but UI doesn't change

**Cause**: Token not used in SCSS or browser cache issue

**Solutions**:
1. Verify token is referenced in SCSS:
   ```bash
   grep "var(--sn-your-token)" src/ -r --include="*.scss"
   ```

2. Check browser DevTools computed styles:
   ```javascript
   getComputedStyle(document.documentElement).getPropertyValue('--sn-your-token')
   ```

3. Force repaint:
   ```typescript
   document.documentElement.style.setProperty('--sn-your-token', newValue);
   document.body.offsetHeight; // Force reflow
   ```

### Issue: Animations Not Respecting Reduced Motion

**Symptom**: Animations still play with `prefers-reduced-motion: reduce`

**Cause**: Using hardcoded durations instead of tokens

**Solution**:
```scss
// BAD: Hardcoded duration
animation: slide 300ms ease;

// GOOD: Token duration (automatically becomes 0ms with reduced motion)
animation: slide var(--sn-transition-standard-duration) var(--sn-anim-easing-organic);
```

### Issue: Color Not Harmonizing with Music

**Symptom**: Colors don't change with music

**Cause**: Using wrong OKLAB tokens or ColorHarmonyEngine not running

**Solutions**:
1. Use musical OKLAB tokens:
   ```scss
   // GOOD: Musical OKLAB (updates with music)
   color: rgba(var(--sn-musical-oklab-primary-rgb), 1);

   // BAD: Static OKLAB (doesn't update)
   color: rgba(var(--sn-oklab-primary-rgb), 1);
   ```

2. Check if ColorHarmonyEngine is enabled in TypeScript:
   ```typescript
   // Verify in browser console
   window.Y3K?.system?.colorHarmonyEngine?.initialized
   ```

### Issue: Build Performance Slow

**Symptom**: SCSS compilation takes too long

**Cause**: Excessive token references or complex calculations

**Solutions**:
1. Reduce delegation depth
2. Cache token values in component-scoped variables:
   ```scss
   .component {
     // Cache token value
     --cached-accent: var(--sn-color-accent-rgb);

     .child-1 {
       color: rgba(var(--cached-accent), 0.8);
     }

     .child-2 {
       background: rgba(var(--cached-accent), 0.1);
     }
   }
   ```

---

## Advanced Techniques

### Technique 1: Custom Token Scoping

```scss
// Create component-scoped token system
.custom-widget {
  // Override tokens for this component
  --sn-color-accent-rgb: 100, 200, 255; // Custom blue for widget
  --sn-layout-space-md: 2rem; // Larger spacing for widget

  // All children inherit overridden values
  .widget-child {
    color: rgba(var(--sn-color-accent-rgb), 1); // Uses 100, 200, 255
    padding: var(--sn-layout-space-md); // Uses 2rem
  }
}
```

### Technique 2: Runtime Token Generation

```typescript
// Generate dynamic tokens based on user preferences
class TokenGenerator {
  static generatePaletteFromColor(baseRgb: string) {
    const root = document.documentElement;

    // Generate harmonious palette
    root.style.setProperty('--sn-dynamic-primary-rgb', baseRgb);
    root.style.setProperty('--sn-dynamic-accent-rgb', this.shiftHue(baseRgb, 30));
    root.style.setProperty('--sn-dynamic-secondary-rgb', this.shiftHue(baseRgb, -30));
  }

  static shiftHue(rgb: string, degrees: number): string {
    // OKLAB hue shifting logic
    // ...
    return shifted;
  }
}
```

### Technique 3: Token Debugging

```scss
// Add debug overlay showing active token values
.debug-tokens {
  position: fixed;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 1rem;
  font-family: monospace;
  font-size: 12px;

  &::before {
    content: "Token Debug:";
    display: block;
    font-weight: bold;
  }

  &::after {
    content:
      "Accent RGB: " var(--sn-color-accent-rgb) "\\A"
      "Transition: " var(--sn-transition-fast-duration) "\\A"
      "Beat Pulse: " var(--sn-music-beat-pulse-intensity);
    white-space: pre;
  }
}
```

---

## Related Documentation

- **[Token System Architecture](./token-system-architecture.md)**: Complete system overview
- **[Token Governance](./token-governance.md)**: Standards for adding/modifying tokens
- **[Legacy Token Migration](./LEGACY_TOKEN_MIGRATION.md)**: Migration guide for deprecated tokens
- **[Design Tokens Source](../src/design-tokens/tokens.scss)**: Token definitions

---

**Guide Version:** 1.0.0
**Phase:** 6 (Documentation & Standards)
**Last Updated:** 2025-10-04
