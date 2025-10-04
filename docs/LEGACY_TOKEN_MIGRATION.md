# Legacy Token Migration Guide
**Catppuccin StarryNight Theme - CSS Custom Properties Migration**

**Last Updated**: 2025-10-04
**Applies to**: v3.x → v4.0.0 migration
**Phase**: Phase 6 (Documentation & Standards) complete

---

## Overview

StarryNight is migrating from legacy token names to a modern, organized namespace to improve maintainability and consistency. This migration will be completed gradually across multiple phases to ensure zero breaking changes until the final v4.0.0 release.

### Migration Timeline

| Phase | Status | Description | Timeline |
|-------|--------|-------------|----------|
| Phase 1 | ✅ Complete | Critical fixes & missing variables | Completed 2025-10-02 |
| Phase 2 | ✅ Complete | TypeScript-SCSS alignment | Completed 2025-10-02 |
| Phase 3 | ✅ Complete | **Legacy alias audit & documentation** | **Completed 2025-10-03** |
| Phase 4 | ⏳ Planned | Gradual SCSS migration (incremental) | Estimated: 2-4 weeks |
| Phase 5 | ✅ Complete | **Token consolidation & 42.77% reduction** | **Completed 2025-10-04** |
| Phase 6 | ✅ Complete | **Documentation & Standards** | **Completed 2025-10-04** |
| Phase 7 | ⏳ Planned | **Safe removal (Breaking Change)** | v4.0.0 release |

---

## Important Notes

### ✅ **No Immediate Action Required**

- **All legacy aliases remain functional** through v3.x releases
- Backward compatibility is **100% maintained** until v4.0.0
- You can continue using legacy token names without any issues
- Migration to modern tokens is **recommended but optional** for v3.x

### 📊 **Phase 5 & 6 Update (2025-10-04)**

**Phase 5 Token Consolidation Results**:
- **42.77% token reduction achieved** (484 → 277 tokens)
- **207 tokens removed** across 4 tiers (Tier 1-4)
- **100% backwards compatibility maintained** via delegation
- **0 build errors**, **0 test regressions**
- Tier 3: Background subsystem consolidation (64 tokens removed)
- Tier 4: Complete feature system removal (26 tokens removed)

**Phase 6 Documentation & Standards Complete**:
- ✅ Token System Architecture documentation created
- ✅ Token Governance Standards established
- ✅ Developer Usage Guide with examples and recipes
- ✅ Automated validation script (`npm run validate:tokens`)
- ✅ README updated with token system overview

**New Documentation Available**:
- [`docs/token-system-architecture.md`](./token-system-architecture.md) - Complete 277-token system overview
- [`docs/token-governance.md`](./token-governance.md) - Addition, modification, deprecation policies
- [`docs/token-usage-guide.md`](./token-usage-guide.md) - Developer guide with patterns and recipes
- [`scripts/validate-tokens.sh`](../scripts/validate-tokens.sh) - Automated integrity validation

### 🔴 **Breaking Changes in v4.0.0 (Phase 7)**

- Legacy aliases **will be removed** in the v4.0.0 major release (Phase 7)
- Custom CSS using legacy tokens **will need updating** before upgrading to v4.0.0
- **Migration guide provided** in this document and token documentation
- At least **2-3 release cycles** of deprecation warnings before removal

---

## Understanding the Token Migration

### Why is this migration happening?

1. **Namespace Organization**: Move from inconsistent naming to structured `--sn-*` prefix
2. **System Clarity**: Group tokens by system (music, color, background, visual effects, UI)
3. **Maintainability**: Reduce duplication and improve code quality
4. **TypeScript Alignment**: Ensure SCSS and TypeScript use consistent token names

### What changed?

**Old Pattern** (Legacy):
```css
--sn-beat-pulse-intensity
--sn-accent-rgb
--sn-gradient-primary-rgb
--magnetic-hover-pull
--text-glow-intensity
```

**New Pattern** (Modern):
```css
--sn-music-beat-pulse-intensity  /* Music system */
--sn-color-accent-rgb            /* Color system */
--sn-bg-gradient-primary-rgb     /* Background system */
--sn-visual-effects-magnetic-hover-pull  /* Visual effects system */
--sn-text-glow-intensity         /* UI component */
```

---

## Migration by System

### 🎵 Music System Tokens

**Status**: ✅ Safe for immediate migration (Zero usage detected)

| Legacy Token | Modern Token | Status |
|--------------|--------------|--------|
| `--sn-beat-pulse-intensity` | `--sn-music-beat-pulse-intensity` | ✅ Zero usage |
| `--sn-rhythm-phase` | `--sn-music-rhythm-phase` | ✅ Zero usage |
| `--sn-breathing-scale` | `--sn-music-breathing-scale` | ✅ Zero usage |

**Migration Example**:
```css
/* BEFORE (legacy) */
.my-custom-element {
  opacity: calc(1 - var(--sn-beat-pulse-intensity) * 0.3);
}

/* AFTER (modern) */
.my-custom-element {
  opacity: calc(1 - var(--sn-music-beat-pulse-intensity) * 0.3);
}
```

**Risk**: ✅ **SAFE** - These tokens have zero usage in core SCSS
**Action**: Update if you use these in custom CSS

---

### 🎨 Color System Tokens

**Status**: 🟡 Active usage detected (13 occurrences) - Will be migrated in Phase 4

| Legacy Token | Modern Token | Usage | Status |
|--------------|--------------|-------|--------|
| `--sn-accent-hex` | `--sn-color-accent-hex` | 1 file | 🟡 RISKY |
| `--sn-accent-rgb` | `--sn-color-accent-rgb` | 12 occurrences | 🟡 RISKY |
| `--sn-dynamic-accent` | `--sn-dynamic-accent-hex` | 0 files | ✅ SAFE |
| `--sn-cosmic-accent` | `--sn-cosmic-accent-hex` | Internal only | ✅ SAFE |
| `--sn-cosmic-base` | `--sn-cosmic-base-hex` | Internal only | ✅ SAFE |

**Migration Example**:
```css
/* BEFORE (legacy) */
.my-element {
  background: rgba(var(--sn-accent-rgb), 0.8);
  border-color: var(--sn-accent-hex);
}

/* AFTER (modern) */
.my-element {
  background: rgba(var(--sn-color-accent-rgb), 0.8);
  border-color: var(--sn-color-accent-hex);
}
```

**Risk**: 🟡 **RISKY** - Medium usage requires Phase 4 migration
**Action**: Continue using legacy tokens until Phase 4 migration complete

---

### 🌌 Background Gradient System Tokens

**Status**: 🔴 **CRITICAL USAGE** (152 occurrences across 13 files) - **Do NOT remove until Phase 4**

| Legacy Token | Modern Token | Usage | Status |
|--------------|--------------|-------|--------|
| `--sn-gradient-primary-rgb` | `--sn-bg-gradient-primary-rgb` | 48 occurrences | 🔴 UNSAFE |
| `--sn-gradient-accent-rgb` | `--sn-bg-gradient-accent-rgb` | 48 occurrences | 🔴 UNSAFE |
| `--sn-gradient-secondary-rgb` | `--sn-bg-gradient-secondary-rgb` | 27 occurrences | 🔴 UNSAFE |
| `--sn-gradient-flow-x` | `--sn-bg-gradient-flow-x` | Multiple files | 🔴 UNSAFE |
| `--sn-gradient-flow-y` | `--sn-bg-gradient-flow-y` | Multiple files | 🔴 UNSAFE |
| `--sn-webgl-ready` | `--sn-bg-webgl-ready` | 0 files | ✅ SAFE |

**Migration Example**:
```css
/* BEFORE (legacy) */
.cosmic-background {
  background: linear-gradient(
    135deg,
    rgba(var(--sn-gradient-primary-rgb), 0.2),
    rgba(var(--sn-gradient-accent-rgb), 0.3)
  );
  background-position:
    calc(var(--sn-gradient-flow-x) * 100%)
    calc(var(--sn-gradient-flow-y) * 100%);
}

/* AFTER (modern) */
.cosmic-background {
  background: linear-gradient(
    135deg,
    rgba(var(--sn-bg-gradient-primary-rgb), 0.2),
    rgba(var(--sn-bg-gradient-accent-rgb), 0.3)
  );
  background-position:
    calc(var(--sn-bg-gradient-flow-x) * 100%)
    calc(var(--sn-bg-gradient-flow-y) * 100%);
}
```

**Risk**: 🔴 **UNSAFE** - Highest usage in the codebase
**Action**: **DO NOT migrate manually** - Phase 4 will handle this incrementally
**Warning**: Removing these aliases before Phase 4 will break core functionality

---

### 🌈 OKLAB Color System Tokens

**Status**: 🟡 Medium usage (30+ occurrences) - Phase 5 consolidated, Phase 4 will migrate SCSS

| Legacy Token | Modern Token | Usage | Status |
|--------------|--------------|-------|--------|
| `--visual-effects-oklab-primary-rgb` | `--sn-oklab-primary-rgb` | 5 occurrences | 🟡 RISKY |
| `--visual-effects-oklab-accent-rgb` | `--sn-oklab-accent-rgb` | 5 occurrences | 🟡 RISKY |
| `--visual-effects-oklab-highlight-rgb` | `--sn-oklab-highlight-rgb` | 2 occurrences | 🟡 RISKY |
| `--visual-effects-oklab-shadow-rgb` | `--sn-oklab-shadow-rgb` | 1 occurrence | 🟡 RISKY |
| `--visual-effects-oklab-luminance` | `--sn-oklab-accent-luminance` | 8 occurrences | 🟡 RISKY |
| `--sn-oklab-processed-primary-rgb` | `--sn-oklab-primary-rgb` | 3 occurrences | ✅ SAFE |
| `--sn-oklab-processed-accent-rgb` | `--sn-oklab-accent-rgb` | 3 occurrences | ✅ SAFE |

**Migration Example**:
```css
/* BEFORE (legacy) */
.living-gradient {
  background: rgba(var(--visual-effects-oklab-primary-rgb),
                   var(--visual-effects-oklab-luminance));
}

/* AFTER (modern) */
.living-gradient {
  background: rgba(var(--sn-oklab-primary-rgb),
                   var(--sn-oklab-accent-luminance));
}
```

**Risk**: 🟡 **RISKY** - Phase 5 consolidated delegation, Phase 4 will migrate usage
**Action**: Wait for Phase 4 migration (5 files affected)

---

### 🎭 UI Component Tokens

**Status**: ✅ Mostly safe (low usage)

| Legacy Token | Modern Token | Usage | Status |
|--------------|--------------|-------|--------|
| `--text-glow-intensity` | `--sn-text-glow-intensity` | 0 files | ✅ SAFE |
| `--sn-glass-beat-opacity` | `--sn-ui-glass-beat-opacity` | 8 occurrences (1 file) | ✅ SAFE |
| `--card-energy-level` | `--sn-ui-card-energy-level` | 0 files | ✅ SAFE |

**Migration Example**:
```css
/* BEFORE (legacy) */
.glass-card {
  opacity: var(--sn-glass-beat-opacity);
  box-shadow: 0 0 var(--text-glow-intensity) rgba(255, 255, 255, 0.5);
}

/* AFTER (modern) */
.glass-card {
  opacity: var(--sn-ui-glass-beat-opacity);
  box-shadow: 0 0 var(--sn-text-glow-intensity) rgba(255, 255, 255, 0.5);
}
```

**Risk**: ✅ **SAFE** - Single file or zero usage
**Action**: Migrate anytime, or wait for Phase 4

---

### ✨ Visual Effects Field System Tokens

**Status**: ✅ All zero usage - Safe for immediate removal in Phase 6

| Legacy Token | Modern Token | Status |
|--------------|--------------|--------|
| `--magnetic-depth-field` | `--sn-visual-effects-depth-field` | ✅ Zero usage |
| `--magnetic-hover-pull` | `--sn-visual-effects-magnetic-hover-pull` | ✅ Zero usage |
| `--magnetic-focus-pull` | `--sn-visual-effects-magnetic-focus-pull` | ✅ Zero usage |
| `--magnetic-interest-pull` | `--sn-visual-effects-magnetic-interest-pull` | ✅ Zero usage |
| `--visual-effects-field-intensity` | `--sn-visual-effects-field-intensity` | ✅ Zero usage |
| And 6 more... | See tokens.scss for full list | ✅ Zero usage |

**Risk**: ✅ **SAFE** - No migration needed (zero usage)
**Action**: Update if you use these in custom CSS

---

### 🔮 Glyph & Serendipity System Tokens

**Status**: ✅ All zero usage - Safe for immediate removal in Phase 6

| Legacy Token | Modern Token | Status |
|--------------|--------------|--------|
| `--glyph-intensity` | `--sn-glyph-intensity` | ✅ Zero usage |
| `--glyph-glow` | `--sn-glyph-glow` | ✅ Zero usage |
| `--serendipity-idle-threshold` | `--sn-serendipity-idle-threshold` | ✅ Zero usage |
| `--serendipity-animation-duration` | `--sn-serendipity-animation-duration` | ✅ Zero usage |
| And 5 more... | See tokens.scss for full list | ✅ Zero usage |

**Risk**: ✅ **SAFE** - No migration needed (zero usage)
**Action**: Update if you use these in custom CSS

---

## Search & Replace Patterns

### For Custom CSS Users

If you have custom CSS that uses legacy tokens, use these search and replace patterns:

#### Music System
```
Find:    var(--sn-beat-pulse-intensity)
Replace: var(--sn-music-beat-pulse-intensity)

Find:    var(--sn-rhythm-phase)
Replace: var(--sn-music-rhythm-phase)
```

#### Color System
```
Find:    var(--sn-accent-rgb)
Replace: var(--sn-color-accent-rgb)

Find:    var(--sn-accent-hex)
Replace: var(--sn-color-accent-hex)
```

#### Background Gradients
```
Find:    var(--sn-gradient-primary-rgb)
Replace: var(--sn-bg-gradient-primary-rgb)

Find:    var(--sn-gradient-accent-rgb)
Replace: var(--sn-bg-gradient-accent-rgb)

Find:    var(--sn-gradient-secondary-rgb)
Replace: var(--sn-bg-gradient-secondary-rgb)
```

#### Visual Effects OKLAB
```
Find:    var(--visual-effects-oklab-primary-rgb)
Replace: var(--sn-oklab-primary-rgb)

Find:    var(--visual-effects-oklab-accent-rgb)
Replace: var(--sn-oklab-accent-rgb)
```

---

## Migration Checklist

### For Custom CSS Users

**Before v4.0.0 Release**:

- [ ] Review your custom CSS for legacy token usage
- [ ] Perform search and replace using patterns above
- [ ] Test your customizations with updated tokens
- [ ] Verify no visual regressions after migration

**Safe to Migrate Now** (Zero usage tokens):
- [ ] Music system tokens (`--sn-beat-*`, `--sn-rhythm-*`, `--sn-breathing-*`)
- [ ] UI component tokens (`--text-glow-intensity`, `--card-energy-level`)
- [ ] Magnetic field tokens (`--magnetic-*`)
- [ ] Glyph & Serendipity tokens

**Wait for Phase 4** (Active usage in core):
- [ ] Background gradient tokens (`--sn-gradient-*`) - **DO NOT MIGRATE YET**
- [ ] Visual effects OKLAB tokens (`--visual-effects-oklab-*`)
- [ ] Color accent tokens (`--sn-accent-rgb`, `--sn-accent-hex`)

---

## Breaking Changes Warning (v4.0.0)

### What will break?

All legacy aliases listed in this guide will be **permanently removed** in v4.0.0.

### When is v4.0.0 planned?

- **Timeline**: After Phase 4 SCSS migration complete (estimated 2-4 weeks from Phase 3)
- **Notice**: At least **2-3 release cycles** with deprecation warnings before v4.0.0
- **Communication**: Breaking changes will be announced in release notes and CHANGELOG

### How to prepare?

1. **Monitor deprecation warnings** in browser console (if implemented)
2. **Review and update custom CSS** using this migration guide
3. **Test changes** with v3.x releases before v4.0.0
4. **Subscribe to releases** to stay informed about v4.0.0 timeline

---

## Summary Statistics

### Phase 5 Final Token Counts (2025-10-04)

**Overall System**:
- **Total Active Tokens**: 277 (after 42.77% reduction from 484 original tokens)
- **Tokens Removed**: 207 across 4 tiers
- **Quality**: 0 build errors, 0 test regressions, 100% compatibility

**Token Distribution by Category**:
- Animation: 40 tokens
- Color: 35 tokens
- Music Sync: 15 tokens
- Visual Effects: 25 tokens
- UI Components: 25 tokens
- Layout: 18 tokens
- Background: 10 tokens
- Other: 109 tokens (performance, brightness, genre-specific, etc.)

### Legacy Token Migration Status (Phase 3 Audit)

| Category | Total Tokens | Active Usage | Zero Usage | Risk Level |
|----------|--------------|--------------|------------|------------|
| Music System | 3 | 0 | 3 | ✅ SAFE |
| Color System | 5 | 13 occurrences | 2 | 🟡 RISKY |
| Background Gradients | 6 | **152 occurrences** | 1 | 🔴 UNSAFE |
| OKLAB Processed | 3 | 3 occurrences | 0 | ✅ SAFE |
| Visual Effects OKLAB | 7 | ~30 occurrences | 0 | 🟡 RISKY |
| UI Components | 3 | 8 occurrences (1 file) | 2 | ✅ SAFE |
| Magnetic/Field System | 11 | 0 | 11 | ✅ SAFE |
| Enhanced Visual Effects | 9 | 0 | 9 | ✅ SAFE |
| Depth Priority | 4 | 0 | 4 | ✅ SAFE |
| Glyph System | 5 | 0 | 5 | ✅ SAFE |
| Serendipity System | 4 | 0 | 4 | ✅ SAFE |
| **LEGACY TOTAL** | **~70** | **~210** | **~50 (71%)** | **Mixed** |

**Note**: Many legacy systems (Tier 3-4) were fully removed in Phase 5, reducing the need for migration.

---

## Support & Questions

- **Documentation**: Check `src/design-tokens/tokens.scss` for inline deprecation comments
- **Issues**: Report migration issues on GitHub
- **Questions**: Open a discussion in the repository

---

**Version**: Phase 6 Complete - Documentation & Standards
**Last Updated**: 2025-10-04
**Next Update**: After Phase 4 SCSS migration (or v4.0.0 breaking changes)
