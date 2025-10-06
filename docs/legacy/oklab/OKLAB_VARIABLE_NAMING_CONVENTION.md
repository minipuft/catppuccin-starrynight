# OKLAB Variable Naming Convention

**Version**: 2.0 (Consolidated)
**Last Updated**: 2025-10-03
**Status**: ✅ Active (Phases 1-4 Complete)

## Overview

This document defines the unified OKLAB color variable naming convention established through the OKLAB Color Architecture Consolidation project (Phases 1-4). All color variables follow a consistent, predictable pattern for clarity and maintainability.

---

## Naming Pattern

### Standard Format
```
--sn-oklab-{token}-rgb
```

**Components**:
- `--sn-` : StarryNight theme prefix
- `oklab-` : Indicates OKLAB color space processing
- `{token}` : Semantic color token name (lowercase)
- `-rgb` : RGB format (comma-separated r,g,b values)

---

## Active Variables (Phase 1-4)

### ColorHarmonyEngine Variables

These variables are written by `ColorHarmonyEngine` and updated on track changes:

| Variable | Token | Format | Source | Description |
|----------|-------|--------|--------|-------------|
| `--sn-oklab-accent-rgb` | `accent` | `r,g,b` | Album art primary | Main accent color |
| `--sn-oklab-primary-rgb` | `primary` | `r,g,b` | Album art processed | Primary gradient color |
| `--sn-oklab-secondary-rgb` | `secondary` | `r,g,b` | Album art processed | Secondary gradient color |
| `--sn-oklab-shadow-rgb` | `shadow` | `r,g,b` | Derived from primary | Perceptually darker variant |
| `--sn-oklab-highlight-rgb` | `highlight` | `r,g,b` | Derived from primary | Perceptually brighter variant |

**Usage Pattern** (via `oklab-color()` helper):
```scss
@use "../core/_design_tokens" as *;

.card {
  background: oklab-color('accent', 0.1);
  box-shadow: 0 4px 8px oklab-color('shadow', 0.3);
  border-top: 1px solid oklab-color('highlight', 0.2);
}
```

---

## Legacy Variables (Removed)

### Removed in Phase 3 (2025-10-02)

These variables have been **removed** and replaced with consolidated names:

| Old Variable | Replacement | Status |
|--------------|-------------|--------|
| `--sn-color-oklab-dynamic-shadow-rgb` | `--sn-oklab-shadow-rgb` | ❌ Removed |
| `--sn-color-oklab-bright-highlight-rgb` | `--sn-oklab-highlight-rgb` | ❌ Removed |
| `--sn-oklab-processed-primary-rgb` | Never written (dead code) | ❌ Removed |
| `--sn-oklab-processed-secondary-rgb` | Never written (dead code) | ❌ Removed |
| `--sn-oklab-processed-accent-rgb` | Never written (dead code) | ❌ Removed |

**Backward Compatibility**: Legacy variables are referenced as fallbacks in `src/design-tokens/tokens.scss` but are **not written** by TypeScript.

---

## Variable Lifecycle

### 1. Color Extraction (Spicetify API)
```typescript
// In ColorHarmonyEngine
const rawColors = await Spicetify.colorExtractor(trackUri);
// Returns: { colors: Array<{ hex, rgb, population }> }
```

### 2. OKLAB Processing (Phase 1)
```typescript
// Derive shadow and highlight from primary color
const primaryColor = processedColors.PRIMARY || processedColors.VIBRANT;
const result = oklabProcessor.processColor(primaryColor, preset);

processedColors.SHADOW = result.shadowHex;      // Perceptually darker
processedColors.HIGHLIGHT = result.highlightHex; // Perceptually brighter
```

### 3. CSS Variable Generation (Phase 3)
```typescript
// Generate consolidated CSS variables
cssVars["--sn-oklab-shadow-rgb"] = `${shadowRgb.r},${shadowRgb.g},${shadowRgb.b}`;
cssVars["--sn-oklab-highlight-rgb"] = `${highlightRgb.r},${highlightRgb.g},${highlightRgb.b}`;
```

### 4. SCSS Consumption (Phase 3.6)
```scss
// Access via oklab-color() helper
.component {
  background: oklab-color('shadow', 0.2);
}

// Compiles to:
.component {
  background: rgba(var(--sn-oklab-shadow-rgb), 0.2);
}
```

---

## Token Definitions

### `accent` Token
**Variable**: `--sn-oklab-accent-rgb`

**Source**: Primary album art color (VIBRANT or PROMINENT)
**Processing**: Genre-adjusted OKLAB enhancement
**Updates**: On track change
**Usage**: Main theme accent color, interactive elements

**Example**:
```scss
.button {
  background: oklab-color('accent', 0.15);
  border: 1px solid oklab-color('accent', 0.4);
}
```

### `primary` Token
**Variable**: `--sn-oklab-primary-rgb`

**Source**: Primary gradient color from album art
**Processing**: OKLAB enhancement with genre adjustments
**Updates**: On track change
**Usage**: Primary gradient backgrounds, major UI elements

**Example**:
```scss
.gradient-bg {
  background: linear-gradient(
    135deg,
    oklab-color('primary', 0.3),
    oklab-color('secondary', 0.15)
  );
}
```

### `secondary` Token
**Variable**: `--sn-oklab-secondary-rgb`

**Source**: Secondary gradient color from album art
**Processing**: OKLAB enhancement, harmonized with primary
**Updates**: On track change
**Usage**: Secondary gradient stops, complementary UI elements

**Example**:
```scss
.card::after {
  background: radial-gradient(
    circle at center,
    oklab-color('secondary', 0.2),
    transparent
  );
}
```

### `shadow` Token (New in Phase 1)
**Variable**: `--sn-oklab-shadow-rgb`

**Source**: Derived from PRIMARY/VIBRANT/PROMINENT color
**Processing**: OKLAB lightness reduction (L × shadowReduction), slight desaturation
**Algorithm**:
- Lightness: `max(0.02, L × preset.shadowReduction)` (typically 0.4-0.6)
- Chroma: `a × 0.8, b × 0.8` (80% saturation)
**Updates**: On track change
**Usage**: Drop shadows, depth effects, dark overlays

**Example**:
```scss
.elevated-card {
  box-shadow:
    0 2px 4px oklab-color('shadow', 0.15),
    0 4px 8px oklab-color('shadow', 0.1),
    0 8px 16px oklab-color('shadow', 0.08);
}
```

### `highlight` Token (New in Phase 1)
**Variable**: `--sn-oklab-highlight-rgb`

**Source**: Derived from PRIMARY/VIBRANT/PROMINENT color
**Processing**: OKLAB lightness increase (L × highlightBoost), slight desaturation
**Algorithm**:
- Lightness: `min(1.0, L × (2.0 - preset.shadowReduction))` (inverse of shadow)
- Chroma: `a × 0.9, b × 0.9` (90% saturation)
**Updates**: On track change
**Usage**: Inset highlights, bright accents, shimmer effects

**Example**:
```scss
.glass-card {
  background: oklab-color('accent', 0.08);
  border-top: 1px solid oklab-color('highlight', 0.15);
  border-bottom: 1px solid oklab-color('shadow', 0.2);
}
```

---

## Variable Scope Boundaries

### ColorHarmonyEngine Scope (Use `oklab-color()`)

**Include** these variables:
- ✅ `--sn-oklab-accent-rgb`
- ✅ `--sn-oklab-primary-rgb`
- ✅ `--sn-oklab-secondary-rgb`
- ✅ `--sn-oklab-shadow-rgb`
- ✅ `--sn-oklab-highlight-rgb`
- ✅ Legacy: `--sn-accent-rgb`, `--sn-bg-gradient-primary-rgb`, `--sn-bg-gradient-secondary-rgb`

### Other System Scopes (DO NOT use `oklab-color()`)

**Exclude** these variables:
- ❌ `--sn-musical-oklab-*` (MusicSyncService - different lifecycle)
- ❌ `--sn-visual-effects-*` (Visual effects systems)
- ❌ `--sn-gradient-primary-rgb` (Different gradient system, no "bg-" prefix)
- ❌ `--sn-dynamic-accent-rgb` (Different dynamic system)
- ❌ `--sn-color-oklab-*` (Legacy fallback variables, not primary)

**Rule**: Only use `oklab-color()` for variables explicitly written by `ColorHarmonyEngine`'s OKLAB processing pipeline.

---

## RGB Format Specification

### Format Requirements
```
r,g,b
```

**Rules**:
- **Values**: Integer 0-255
- **Separator**: Comma with no spaces (`,`)
- **Order**: Red, Green, Blue
- **No prefix**: No `rgb()` wrapper

**Examples**:
```css
/* Valid */
--sn-oklab-shadow-rgb: 44,62,80;
--sn-oklab-highlight-rgb: 236,240,241;

/* Invalid */
--sn-oklab-shadow-rgb: rgb(44, 62, 80);  /* Has rgb() wrapper */
--sn-oklab-shadow-rgb: 44, 62, 80;      /* Has spaces */
--sn-oklab-shadow-rgb: #2c3e50;         /* Hex format */
```

### Conversion in SCSS
```scss
// oklab-color() helper wraps in rgba()
oklab-color('shadow', 0.3)
// Compiles to:
rgba(var(--sn-oklab-shadow-rgb), 0.3)
// Evaluates to (if shadow is 44,62,80):
rgba(44, 62, 80, 0.3)
```

---

## Implementation Files

### TypeScript (Variable Generation)
**File**: `src-js/audio/ColorHarmonyEngine.ts`

**Shadow/Highlight Derivation** (lines 4024-4077):
```typescript
const shadowHighlightResult = this.oklabProcessor.processColor(
  primaryColorForDerivation,
  genreAdjustedPreset
);

processedColors.SHADOW = shadowHighlightResult.shadowHex;
processedColors.HIGHLIGHT = shadowHighlightResult.highlightHex;
```

**CSS Variable Generation** (lines 1354-1391):
```typescript
// Consolidated shadow/highlight variables
const shadowHex = processedColors["SHADOW"];
const highlightHex = processedColors["HIGHLIGHT"];

if (shadowHex) {
  const shadowRgb = this.utils.hexToRgb(shadowHex);
  cssVars["--sn-oklab-shadow-rgb"] = `${shadowRgb.r},${shadowRgb.g},${shadowRgb.b}`;
}

if (highlightHex) {
  const highlightRgb = this.utils.hexToRgb(highlightHex);
  cssVars["--sn-oklab-highlight-rgb"] = `${highlightRgb.r},${highlightRgb.g},${highlightRgb.b}`;
}
```

### SCSS (Variable Consumption)
**File**: `src/core/_design_tokens.scss`

**Helper Function** (lines 36-56):
```scss
@function oklab-color($token, $opacity: 1) {
  @if $token == 'accent' {
    @return rgba(var(--sn-oklab-accent-rgb), $opacity);
  } @else if $token == 'primary' {
    @return rgba(var(--sn-oklab-primary-rgb), $opacity);
  } @else if $token == 'secondary' {
    @return rgba(var(--sn-oklab-secondary-rgb), $opacity);
  } @else if $token == 'shadow' {
    @return rgba(var(--sn-oklab-shadow-rgb, var(--sn-color-oklab-dynamic-shadow-rgb, 0, 0, 0)), $opacity);
  } @else if $token == 'highlight' {
    @return rgba(var(--sn-oklab-highlight-rgb, var(--sn-color-oklab-bright-highlight-rgb, 255, 255, 255)), $opacity);
  }
}
```

---

## Naming Best Practices

### DO ✅

**Use semantic token names**:
```scss
// Good - semantic meaning
box-shadow: 0 4px 8px oklab-color('shadow', 0.3);
border-top: 1px solid oklab-color('highlight', 0.2);
```

**Use consistent opacity patterns**:
```scss
// Good - predictable opacity scale
.light-bg { background: oklab-color('accent', 0.1); }
.medium-bg { background: oklab-color('accent', 0.2); }
.strong-bg { background: oklab-color('accent', 0.3); }
```

**Import design tokens consistently**:
```scss
// Good - standard import
@use "../core/_design_tokens" as *;

.component {
  background: oklab-color('accent', 0.15);
}
```

### DON'T ❌

**Don't use direct variable access**:
```scss
// Bad - bypasses helper function
background: rgba(var(--sn-oklab-accent-rgb), 0.2);

// Good - use helper
background: oklab-color('accent', 0.2);
```

**Don't mix variable systems**:
```scss
// Bad - mixing different systems
background: oklab-color('accent', 0.2);
border: 1px solid var(--sn-musical-oklab-accent-rgb);

// Good - consistent system
background: oklab-color('accent', 0.2);
border: 1px solid oklab-color('accent', 0.4);
```

**Don't hardcode shadow/highlight values**:
```scss
// Bad - hardcoded shadow
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

// Good - dynamic shadow
box-shadow: 0 4px 8px oklab-color('shadow', 0.3);
```

---

## Version History

### Version 2.0 (2025-10-03) - Consolidated Architecture
- ✅ Added `--sn-oklab-shadow-rgb` (Phase 1)
- ✅ Added `--sn-oklab-highlight-rgb` (Phase 1)
- ✅ Consolidated naming convention (Phase 3)
- ✅ Removed legacy variable writes (Phase 3)
- ✅ Unified SCSS helper function (Phase 3.6)
- ✅ Complete SCSS migration (47 calls, 9 files)

### Version 1.0 (Pre-consolidation)
- Legacy variable naming patterns
- Mixed variable naming conventions
- Direct variable usage in SCSS
- No shadow/highlight derivation

---

## Related Documentation

- **Migration Guide**: [docs/OKLAB_COLOR_MIGRATION_GUIDE.md](./OKLAB_COLOR_MIGRATION_GUIDE.md)
- **Architecture Overview**: [docs/MASTER_ARCHITECTURE_OVERVIEW.md](./MASTER_ARCHITECTURE_OVERVIEW.md)
- **Implementation Plan**: [plans/oklab-color-architecture-consolidation.md](../plans/oklab-color-architecture-consolidation.md)

---

**Maintained by**: StarryNight Theme Development Team
**Last Review**: 2025-10-03
**Next Review**: When adding new color tokens or extending OKLAB processing
