# OKLAB Color Architecture Migration Guide

**Last Updated**: 2025-10-03
**Consolidation Project**: [plans/oklab-color-architecture-consolidation.md](../plans/oklab-color-architecture-consolidation.md)

## Overview

This guide helps developers understand and use the consolidated OKLAB color architecture implemented in Phases 1-4. The consolidation unified color variable naming, added dynamic shadow/highlight colors, and migrated all SCSS to use the centralized `oklab-color()` helper function.

---

## Quick Reference

### Color Tokens Available

| Token | CSS Variable | Usage | Description |
|-------|--------------|-------|-------------|
| `'accent'` | `--sn-oklab-accent-rgb` | `oklab-color('accent', 0.8)` | Main accent color from album art |
| `'primary'` | `--sn-oklab-primary-rgb` | `oklab-color('primary', 0.6)` | Primary gradient color |
| `'secondary'` | `--sn-oklab-secondary-rgb` | `oklab-color('secondary', 0.4)` | Secondary gradient color |
| `'shadow'` | `--sn-oklab-shadow-rgb` | `oklab-color('shadow', 0.2)` | Dynamically derived shadow (dark) |
| `'highlight'` | `--sn-oklab-highlight-rgb` | `oklab-color('highlight', 0.9)` | Dynamically derived highlight (bright) |

### Before vs After Migration

#### ❌ Old Pattern (Deprecated)
```scss
// Direct variable usage - NO LONGER RECOMMENDED
background: rgba(var(--sn-accent-rgb), 0.2);
box-shadow: 0 4px 8px rgba(var(--sn-accent-rgb), 0.3);

// Legacy variable names - REMOVED in Phase 3
background: rgba(var(--sn-color-oklab-dynamic-shadow-rgb), 0.5);
```

#### ✅ New Pattern (Current)
```scss
// Use oklab-color() helper - RECOMMENDED
@use "../core/_design_tokens" as *;

background: oklab-color('accent', 0.2);
box-shadow: 0 4px 8px oklab-color('shadow', 0.3);
text-shadow: 0 2px 4px oklab-color('shadow', 0.5);
```

---

## Migration Steps

### Step 1: Import Design Tokens

Add the design tokens import at the top of your SCSS file:

```scss
@use "../core/_design_tokens" as *;
```

**Path variations** (adjust based on your file location):
- From `src/components/`: `@use "../core/_design_tokens" as *;`
- From `src/features/music-sync/`: `@use "../../core/_design_tokens" as *;`
- From `src/sidebar/`: `@use "../core/_design_tokens" as *;`

### Step 2: Replace Direct Variable Usage

Replace all direct `rgba(var(--sn-*-rgb))` calls with `oklab-color()` helper:

#### Example 1: Simple Replacement
```scss
// Before
background: rgba(var(--sn-accent-rgb), 0.15);

// After
background: oklab-color('accent', 0.15);
```

#### Example 2: Multiple Usages
```scss
// Before
.card {
  background: rgba(var(--sn-accent-rgb), 0.1);
  border: 1px solid rgba(var(--sn-accent-rgb), 0.3);
  box-shadow: 0 4px 8px rgba(var(--sn-accent-rgb), 0.2);
}

// After
.card {
  background: oklab-color('accent', 0.1);
  border: 1px solid oklab-color('accent', 0.3);
  box-shadow: 0 4px 8px oklab-color('accent', 0.2);
}
```

#### Example 3: CSS Variable Assignment (Requires Interpolation)
```scss
// Before
:root {
  --my-custom-bg: rgba(var(--sn-accent-rgb), 0.2);
}

// After
:root {
  --my-custom-bg: #{oklab-color('accent', 0.2)};
}
```

**Note**: When assigning to CSS variables in `:root` or other contexts, use `#{}` interpolation.

### Step 3: Use New Shadow/Highlight Tokens

The new `'shadow'` and `'highlight'` tokens provide dynamic, album art-derived colors:

```scss
// Shadow effects (dark, perceptually uniform)
.elevated-card {
  box-shadow:
    0 2px 4px oklab-color('shadow', 0.2),
    0 4px 8px oklab-color('shadow', 0.15);
}

// Highlight effects (bright, perceptually uniform)
.shimmer-effect {
  background: linear-gradient(
    135deg,
    oklab-color('accent', 0.3),
    oklab-color('highlight', 0.5)
  );
}

// Combined depth effect
.card-with-depth {
  background: oklab-color('primary', 0.1);
  border-top: 1px solid oklab-color('highlight', 0.2);
  border-bottom: 1px solid oklab-color('shadow', 0.3);
}
```

---

## Understanding the Architecture

### Phase 1: Dynamic Shadow/Highlight Derivation

Shadow and highlight colors are **automatically derived** from album art colors using OKLAB color space processing:

```typescript
// In ColorHarmonyEngine.ts (automatic, no action needed)
const shadowHighlightResult = this.oklabProcessor.processColor(
  primaryColorForDerivation,
  genreAdjustedPreset
);

processedColors.SHADOW = shadowHighlightResult.shadowHex;
processedColors.HIGHLIGHT = shadowHighlightResult.highlightHex;
```

**Derivation Strategy**:
- **Shadow**: Perceptually darker than primary (L reduced, slight desaturation)
- **Highlight**: Perceptually brighter than primary (L increased, slight desaturation)
- **Fallback Order**: PRIMARY → VIBRANT → PROMINENT

### Phase 2: SCSS Helper Function

The `oklab-color()` function provides a single point of access to all OKLAB-processed colors:

```scss
// Function definition (in _design_tokens.scss)
@function oklab-color($token, $opacity: 1) {
  @if $token == 'accent' {
    @return rgba(var(--sn-oklab-accent-rgb), $opacity);
  } @else if $token == 'shadow' {
    @return rgba(var(--sn-oklab-shadow-rgb), $opacity);
  } @else if $token == 'highlight' {
    @return rgba(var(--sn-oklab-highlight-rgb), $opacity);
  }
  // ... other tokens
}
```

**Benefits**:
- Single source of truth for color tokens
- Compile-time token validation
- Easy to extend with new tokens
- Centralized fallback chain management

### Phase 3: Variable Naming Convention

All CSS variables follow the consolidated naming pattern:

**Pattern**: `--sn-oklab-{token}-rgb`

**Examples**:
- `--sn-oklab-accent-rgb` (main accent color)
- `--sn-oklab-primary-rgb` (primary gradient color)
- `--sn-oklab-shadow-rgb` (derived shadow color)
- `--sn-oklab-highlight-rgb` (derived highlight color)

**Legacy Variables Removed** (Phase 3):
- ❌ `--sn-color-oklab-dynamic-shadow-rgb`
- ❌ `--sn-color-oklab-bright-highlight-rgb`
- ❌ `--sn-oklab-processed-*` (never actually written)

---

## Variable Scope and Boundaries

### ColorHarmonyEngine Variables (Migrated to oklab-color())

These variables are written by `ColorHarmonyEngine` and should use `oklab-color()`:

✅ **Use oklab-color() for these**:
- `--sn-accent-rgb`
- `--sn-bg-gradient-primary-rgb`
- `--sn-bg-gradient-secondary-rgb`
- `--sn-oklab-shadow-rgb` (new)
- `--sn-oklab-highlight-rgb` (new)

### Other System Variables (DO NOT Migrate)

These variables are written by other systems and should NOT use `oklab-color()`:

❌ **Do NOT migrate these**:
- `--sn-musical-oklab-*` (written by MusicSyncService, different lifecycle)
- `--sn-visual-effects-*` (written by visual effects systems)
- `--sn-gradient-primary-rgb` (different gradient system, no "bg-" prefix)
- `--sn-dynamic-accent-rgb` (different dynamic system)

**Rule of Thumb**: Only migrate variables that are explicitly written by `ColorHarmonyEngine`'s OKLAB processing pipeline.

---

## Common Migration Patterns

### Pattern 1: Card Background with Accent Glow

```scss
// Before
.music-card {
  background: rgba(var(--sn-accent-rgb), 0.08);
  box-shadow:
    0 4px 12px rgba(var(--sn-accent-rgb), 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

// After
@use "../core/_design_tokens" as *;

.music-card {
  background: oklab-color('accent', 0.08);
  box-shadow:
    0 4px 12px oklab-color('shadow', 0.3),
    inset 0 1px 0 oklab-color('highlight', 0.1);
}
```

**Improvements**:
- Shadow uses dynamic `'shadow'` token (perceptually darker)
- Highlight uses dynamic `'highlight'` token (perceptually brighter)
- Colors automatically adjust to album art

### Pattern 2: Gradient with Depth

```scss
// Before
.gradient-bg {
  background: linear-gradient(
    135deg,
    rgba(var(--sn-bg-gradient-primary-rgb), 0.3),
    rgba(var(--sn-bg-gradient-secondary-rgb), 0.15)
  );
}

// After
@use "../core/_design_tokens" as *;

.gradient-bg {
  background: linear-gradient(
    135deg,
    oklab-color('primary', 0.3),
    oklab-color('secondary', 0.15)
  );
}
```

### Pattern 3: Interactive Hover States

```scss
// Before
.button {
  background: rgba(var(--sn-accent-rgb), 0.1);

  &:hover {
    background: rgba(var(--sn-accent-rgb), 0.2);
  }

  &:active {
    background: rgba(var(--sn-accent-rgb), 0.3);
  }
}

// After
@use "../core/_design_tokens" as *;

.button {
  background: oklab-color('accent', 0.1);

  &:hover {
    background: oklab-color('accent', 0.2);
    box-shadow: 0 4px 8px oklab-color('shadow', 0.2);
  }

  &:active {
    background: oklab-color('accent', 0.3);
    box-shadow: inset 0 2px 4px oklab-color('shadow', 0.4);
  }
}
```

### Pattern 4: Text Effects with Shadows

```scss
// Before
.title {
  color: rgba(var(--sn-accent-rgb), 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

// After
@use "../core/_design_tokens" as *;

.title {
  color: oklab-color('accent', 0.9);
  text-shadow: 0 2px 4px oklab-color('shadow', 0.5);
}
```

---

## Validation and Testing

### Build Validation

After migration, validate your changes:

```bash
# TypeScript compilation
npm run typecheck

# SCSS compilation
npm run build:css:dev

# Full build
npm run build

# Run tests
npm test
```

### Visual Validation Checklist

- [ ] Colors appear correct in Spicetify runtime
- [ ] Shadow effects have appropriate depth
- [ ] Highlight effects are visible and perceptually brighter
- [ ] Color transitions are smooth (no jarring changes)
- [ ] Album art changes trigger color updates
- [ ] Performance remains smooth (60fps target)

### Performance Metrics

Monitor these metrics after migration:

- **Build Time**: Should remain <100ms (typically 51-65ms)
- **Bundle Size**: Should remain stable (~434KB JS, ~75KB CSS gzipped)
- **Color Processing**: <100ms per album art change
- **CSS Updates**: <16ms for 60fps responsiveness

---

## Troubleshooting

### Issue: "oklab-color() function not found"

**Cause**: Missing design tokens import

**Solution**:
```scss
// Add this at the top of your SCSS file
@use "../core/_design_tokens" as *;
```

### Issue: Colors not updating with music

**Cause**: May be using non-ColorHarmonyEngine variables

**Solution**: Verify you're using the correct tokens:
- ✅ `oklab-color('accent')` - Updates with music
- ❌ `var(--sn-musical-oklab-accent-rgb)` - Different system

### Issue: CSS variable assignment not working

**Cause**: Missing `#{}` interpolation

**Solution**:
```scss
// Wrong
:root {
  --my-var: oklab-color('accent', 0.2);  // Won't compile
}

// Correct
:root {
  --my-var: #{oklab-color('accent', 0.2)};  // Works!
}
```

### Issue: Build warnings or errors

**Cause**: Incorrect variable names or syntax

**Solution**:
1. Check token name spelling: `'accent'`, `'shadow'`, `'highlight'` (lowercase)
2. Verify import path is correct for your file location
3. Run `npm run typecheck` and `npm run build` to see specific errors

---

## Advanced Usage

### Creating Custom Shadow Presets

```scss
@use "../core/_design_tokens" as *;

// Multi-layered shadows for depth
@mixin elevated-shadow($elevation: 1) {
  @if $elevation == 1 {
    box-shadow:
      0 1px 2px oklab-color('shadow', 0.1),
      0 2px 4px oklab-color('shadow', 0.08);
  } @else if $elevation == 2 {
    box-shadow:
      0 2px 4px oklab-color('shadow', 0.12),
      0 4px 8px oklab-color('shadow', 0.1),
      0 8px 16px oklab-color('shadow', 0.08);
  } @else if $elevation == 3 {
    box-shadow:
      0 4px 8px oklab-color('shadow', 0.15),
      0 8px 16px oklab-color('shadow', 0.12),
      0 16px 32px oklab-color('shadow', 0.1);
  }
}

// Usage
.card-low { @include elevated-shadow(1); }
.card-mid { @include elevated-shadow(2); }
.card-high { @include elevated-shadow(3); }
```

### Dynamic Color Mixing

```scss
@use "../core/_design_tokens" as *;
@use "sass:color";

// Blend accent with shadow for depth
.depth-card {
  background: oklab-color('accent', 0.15);
  border-bottom: 2px solid oklab-color('shadow', 0.4);

  &::after {
    content: '';
    background: linear-gradient(
      to bottom,
      oklab-color('highlight', 0.1),
      transparent
    );
  }
}
```

### Conditional Token Usage

```scss
@use "../core/_design_tokens" as *;

// Use different tokens based on context
.card {
  &--primary {
    background: oklab-color('primary', 0.1);
    border: 1px solid oklab-color('primary', 0.3);
  }

  &--accent {
    background: oklab-color('accent', 0.1);
    border: 1px solid oklab-color('accent', 0.3);
  }

  &--elevated {
    background: oklab-color('accent', 0.08);
    box-shadow:
      0 4px 12px oklab-color('shadow', 0.25),
      inset 0 1px 0 oklab-color('highlight', 0.15);
  }
}
```

---

## API Reference

### oklab-color() Function

```scss
oklab-color($token, $opacity: 1)
```

**Parameters**:
- `$token` (string): Color token name - `'accent'`, `'primary'`, `'secondary'`, `'shadow'`, `'highlight'`
- `$opacity` (number): Opacity value 0-1 (default: 1)

**Returns**: `rgba()` color value

**Examples**:
```scss
oklab-color('accent')           // rgba(var(--sn-oklab-accent-rgb), 1)
oklab-color('shadow', 0.2)      // rgba(var(--sn-oklab-shadow-rgb), 0.2)
oklab-color('highlight', 0.8)   // rgba(var(--sn-oklab-highlight-rgb), 0.8)
```

### CSS Variables Reference

| Variable | Format | Source | Updates |
|----------|--------|--------|---------|
| `--sn-oklab-accent-rgb` | `r,g,b` | ColorHarmonyEngine | On track change |
| `--sn-oklab-primary-rgb` | `r,g,b` | ColorHarmonyEngine | On track change |
| `--sn-oklab-secondary-rgb` | `r,g,b` | ColorHarmonyEngine | On track change |
| `--sn-oklab-shadow-rgb` | `r,g,b` | ColorHarmonyEngine (derived) | On track change |
| `--sn-oklab-highlight-rgb` | `r,g,b` | ColorHarmonyEngine (derived) | On track change |

---

## Resources

### Documentation
- [Implementation Plan](../plans/oklab-color-architecture-consolidation.md) - Complete consolidation plan
- [MASTER_ARCHITECTURE_OVERVIEW.md](./MASTER_ARCHITECTURE_OVERVIEW.md) - System architecture
- [Design Tokens](../src/core/_design_tokens.scss) - SCSS helper function source

### Source Files
- **TypeScript**: `src-js/audio/ColorHarmonyEngine.ts` (lines 4024-4077, 1354-1391)
- **TypeScript**: `src-js/utils/color/OKLABColorProcessor.ts` (lines 368-441)
- **SCSS**: `src/core/_design_tokens.scss` (lines 36-56)

### Test Files
- **Unit Tests**: `tests/unit/utils/OKLABColorProcessor.test.ts`
- **Integration Tests**: `tests/unit/audio/ColorHarmonyEngine-CSSVariables.test.ts`
- **Performance Tests**: `tests/performance/OKLABColorProcessing.perf.test.ts`

---

## Support

For questions or issues:
1. Check this migration guide first
2. Review the [implementation plan](../plans/oklab-color-architecture-consolidation.md)
3. Inspect `_design_tokens.scss` for helper function details
4. Run validation: `npm run validate`

**Last Updated**: 2025-10-03
**Migration Status**: ✅ Complete (Phases 1-4 implemented)
