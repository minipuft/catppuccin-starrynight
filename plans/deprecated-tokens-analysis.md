# Deprecated Tokens Analysis - Design Token System

**Analysis Date:** 2025-10-04
**Target File:** `src/design-tokens/tokens.scss`
**Status:** Initial Analysis Complete

---

## Executive Summary

This analysis identifies deprecated CSS custom properties in the design token system, tracks their current usage across the codebase, and provides migration recommendations.

### Key Findings:
- **12 deprecated tokens** identified with clear deprecation markers
- **5 tokens safe for immediate removal** (no active usage)
- **5 tokens require migration** (used as fallbacks or in media queries)
- **2 critical undefined variable issues** requiring immediate attention

---

## 1. Deprecated Tokens Inventory

### 1.1 Legacy Animation Duration Tokens
**Deprecation Marker:** `// ⚠️ CONSOLIDATED: Animation durations now reference transition-duration tokens`
**Location:** Lines 155-161, 200-203

| Token | Line | Status | Delegates To | Usage |
|-------|------|--------|--------------|-------|
| `--sn-anim-duration-animation` | 161 | ⚠️ LEGACY | None (4s literal) | ✓ Not used |
| `--sn-anim-transition-fast` | 201 | 🔄 ALIAS | `--sn-transition-fast-duration` | ⚠️ Used in media query |
| `--sn-anim-transition-standard` | 202 | 🔄 ALIAS | `--sn-transition-standard-duration` | ⚠️ Used in media query |
| `--sn-anim-transition-slow` | 203 | 🔄 ALIAS | `--sn-transition-slow-duration` | ⚠️ Used in media query |

**Migration Target:** Direct use of `--sn-transition-*-duration` tokens

### 1.2 Legacy Easing Aliases
**Deprecation Marker:** `// Legacy easing aliases (forward to primary tokens)`
**Location:** Lines 211-214

| Token | Line | Status | Delegates To | Usage |
|-------|------|--------|--------------|-------|
| `--sn-ease-bounce` | 212 | 🔄 ALIAS | `--sn-anim-easing-bounce-gentle` | ✓ Not used |
| `--sn-ease-smooth` | 213 | ❌ BROKEN | `--sn-anim-easing-dynamic` | ❌ UNDEFINED TARGET |
| `--sn-ease-sharp` | 214 | 🔄 ALIAS | `--sn-anim-easing-custom-1` | ✓ Not used |

**Migration Target:** Direct use of `--sn-anim-easing-*` tokens

### 1.3 Legacy OKLAB Color Tokens
**Deprecation Marker:** `// Legacy aliases for backward compatibility (Phase 4.2)`
**Location:** Lines 407-411

| Token | Line | Status | Delegates To | Usage |
|-------|------|--------|--------------|-------|
| `--sn-color-oklab-bright-highlight-rgb` | 408 | 🔄 ALIAS | `--sn-oklab-highlight-rgb` | ⚠️ Fallback in `_design_tokens.scss` |
| `--sn-color-oklab-dynamic-shadow-rgb` | 409 | 🔄 ALIAS | `--sn-oklab-shadow-rgb` | ⚠️ Fallback in `_design_tokens.scss` |
| `--sn-color-oklab-base-luminance` | 410 | 🔄 SELF-REF | `--sn-oklab-base-luminance` | ✓ Not used |
| `--sn-color-oklab-accent-luminance` | 411 | 🔄 SELF-REF | `--sn-oklab-accent-luminance` | ✓ Not used |

**Migration Target:** Direct use of `--sn-oklab-*` tokens

---

## 2. Usage Analysis

### 2.1 Safe for Removal (No Active Usage)

These tokens are only defined in `tokens.scss` but not referenced anywhere else in the codebase:

1. **`--sn-anim-duration-animation`** (line 161)
   - Only appears in: `src/design-tokens/tokens.scss`
   - Comment suggests migration: "Legacy: Decorative animation duration (consider migrating)"
   - **Action:** Safe to remove

2. **`--sn-ease-bounce`** (line 212)
   - Only appears in: `src/design-tokens/tokens.scss`
   - Delegates to `--sn-anim-easing-bounce-gentle`
   - **Action:** Safe to remove

3. **`--sn-ease-sharp`** (line 214)
   - Only appears in: `src/design-tokens/tokens.scss`
   - Delegates to `--sn-anim-easing-custom-1`
   - **Action:** Safe to remove

4. **`--sn-color-oklab-base-luminance`** (line 410)
   - Only appears in: `src/design-tokens/tokens.scss`
   - Self-referential (points to itself)
   - **Action:** Safe to remove

5. **`--sn-color-oklab-accent-luminance`** (line 411)
   - Only appears in: `src/design-tokens/tokens.scss`
   - Self-referential (points to itself)
   - **Action:** Safe to remove

### 2.2 Requires Migration (Active Usage)

#### Animation Transition Tokens (Accessibility Media Queries)

**Usage Location:** `src/design-tokens/tokens.scss:758-760`

```scss
@media (prefers-reduced-motion: reduce) {
  :root {
    --sn-anim-transition-fast: 0ms;
    --sn-anim-transition-standard: 0ms;
    --sn-anim-transition-slow: 0ms;
  }
}
```

**Issue:** These legacy aliases are being overridden in the accessibility media query instead of the primary tokens.

**Migration Required:**
- Replace with: `--sn-transition-fast-duration`, `--sn-transition-standard-duration`, `--sn-transition-slow-duration`
- Update accessibility media query to override primary tokens

#### OKLAB Color Tokens (Fallback Chain)

**Usage Location:** `src/core/_design_tokens.scss:48, 50`

```scss
@function oklab-color($token, $opacity: 1) {
  @if $token == 'shadow' {
    @return rgba(var(--sn-oklab-shadow-rgb, var(--sn-color-oklab-dynamic-shadow-rgb, 0, 0, 0)), $opacity);
  } @else if $token == 'highlight' {
    @return rgba(var(--sn-oklab-highlight-rgb, var(--sn-color-oklab-bright-highlight-rgb, 255, 255, 255)), $opacity);
  }
}
```

**Issue:** Deprecated tokens are used as intermediate fallbacks in the fallback chain.

**Migration Required:**
- Simplify fallback chain to use only primary tokens
- Remove intermediate legacy token fallbacks

---

## 3. Critical Issues - Undefined Variables

### 3.1 `--sn-easing-explorer` (UNDEFINED)

**Referenced In:** `src/design-tokens/tokens.scss:206`

```scss
--sn-transition-timing-default: var(--sn-easing-explorer, var(--sn-anim-easing-dynamic));
```

**Active Usage (6 files):**
1. `src/features/interactions/_microinteractions.scss`
2. `src/features/backgrounds/_grid_navigation_mode.scss`
3. `src/sidebar/_sidebar_interactive.scss`
4. `src/components/_now_playing.scss`
5. `src/components/_track_list_enhanced.scss`
6. `user.css` (compiled output)

**Problem:** This variable is referenced but **never defined anywhere** in the codebase. The fallback chain will resolve to the next variable.

**Impact:** All components using `--sn-transition-timing-default` will fall through to `--sn-anim-easing-dynamic`.

### 3.2 `--sn-anim-easing-dynamic` (UNDEFINED)

**Referenced In:**
- `src/design-tokens/tokens.scss:206` (as fallback for `--sn-easing-explorer`)
- `src/design-tokens/tokens.scss:213` (as target for `--sn-ease-smooth`)
- `src/sidebar/_sidebar_interactive.scss:40` (direct usage)

```scss
// Line 206
--sn-transition-timing-default: var(--sn-easing-explorer, var(--sn-anim-easing-dynamic));

// Line 213
--sn-ease-smooth: var(--sn-anim-easing-dynamic);
```

**Direct Usage:** `src/sidebar/_sidebar_interactive.scss:40`

```scss
transition: opacity var(--sn-nav-item-transition-duration) ease,
  background-color var(--sn-nav-item-transition-duration) ease,
  transform var(--sn-nav-item-transition-duration)
    var(--sn-anim-easing-dynamic),
  box-shadow var(--sn-nav-item-transition-duration) ease;
```

**Problem:** This variable is referenced but **never defined anywhere** in the codebase.

**Impact:**
- `--sn-transition-timing-default` will resolve to **nothing** (invalid CSS)
- `--sn-ease-smooth` will resolve to **nothing** (invalid CSS)
- Sidebar transitions will have no easing function specified

**Severity:** 🔴 HIGH - Causes invalid CSS and broken animations

---

## 4. Migration Recommendations

### Phase 1: Fix Critical Issues (IMMEDIATE)

**Priority: 🔴 CRITICAL**

1. **Define `--sn-anim-easing-dynamic`**
   - Determine intended easing function (likely `cubic-bezier(0.4, 0, 0.2, 1)` based on standard easing)
   - Add definition to tokens.scss
   - OR replace all references with an existing defined easing

2. **Remove or Define `--sn-easing-explorer`**
   - Either define this token with a specific easing value
   - OR remove the reference and use `--sn-anim-easing-dynamic` directly (once defined)

**Recommended Fix:**

```scss
// Add to tokens.scss around line 177 (with other easing functions)
--sn-anim-easing-dynamic: cubic-bezier(0.4, 0, 0.2, 1); // Dynamic easing for general transitions
```

Then update line 206:

```scss
// BEFORE
--sn-transition-timing-default: var(--sn-easing-explorer, var(--sn-anim-easing-dynamic));

// AFTER (remove undefined --sn-easing-explorer)
--sn-transition-timing-default: var(--sn-anim-easing-dynamic);
```

### Phase 2: Clean Up Safe Removals (LOW RISK)

**Priority: 🟢 LOW**

Remove tokens with no active usage:

```scss
// REMOVE from tokens.scss
--sn-anim-duration-animation: 4s;
--sn-ease-bounce: var(--sn-anim-easing-bounce-gentle);
--sn-ease-sharp: var(--sn-anim-easing-custom-1);
--sn-color-oklab-base-luminance: var(--sn-oklab-base-luminance);
--sn-color-oklab-accent-luminance: var(--sn-oklab-accent-luminance);
```

### Phase 3: Migrate Active Usage (MEDIUM RISK)

**Priority: 🟡 MEDIUM**

#### 3.1 Update Accessibility Media Query

**File:** `src/design-tokens/tokens.scss:758-760`

```scss
// BEFORE
@media (prefers-reduced-motion: reduce) {
  :root {
    --sn-anim-transition-fast: 0ms;
    --sn-anim-transition-standard: 0ms;
    --sn-anim-transition-slow: 0ms;
  }
}

// AFTER
@media (prefers-reduced-motion: reduce) {
  :root {
    --sn-transition-fast-duration: 0ms;
    --sn-transition-standard-duration: 0ms;
    --sn-transition-slow-duration: 0ms;
  }
}
```

#### 3.2 Simplify OKLAB Fallback Chain

**File:** `src/core/_design_tokens.scss:48, 50`

```scss
// BEFORE
@function oklab-color($token, $opacity: 1) {
  @if $token == 'shadow' {
    @return rgba(var(--sn-oklab-shadow-rgb, var(--sn-color-oklab-dynamic-shadow-rgb, 0, 0, 0)), $opacity);
  } @else if $token == 'highlight' {
    @return rgba(var(--sn-oklab-highlight-rgb, var(--sn-color-oklab-bright-highlight-rgb, 255, 255, 255)), $opacity);
  }
}

// AFTER
@function oklab-color($token, $opacity: 1) {
  @if $token == 'shadow' {
    @return rgba(var(--sn-oklab-shadow-rgb, 0, 0, 0), $opacity);
  } @else if $token == 'highlight' {
    @return rgba(var(--sn-oklab-highlight-rgb, 255, 255, 255), $opacity);
  }
}
```

#### 3.3 Remove Legacy Aliases

**File:** `src/design-tokens/tokens.scss:201-203, 212-214, 408-411`

After verifying all migrations are complete, remove the legacy alias definitions:

```scss
// REMOVE these lines (after Phase 3.1 and 3.2 complete)
--sn-anim-transition-fast: var(--sn-transition-fast-duration);
--sn-anim-transition-standard: var(--sn-transition-standard-duration);
--sn-anim-transition-slow: var(--sn-transition-slow-duration);

--sn-color-oklab-bright-highlight-rgb: var(--sn-oklab-highlight-rgb);
--sn-color-oklab-dynamic-shadow-rgb: var(--sn-oklab-shadow-rgb);
```

---

## 5. Component Flow Tracking

### Files Using Deprecated/Undefined Tokens

| File | Deprecated Token Used | Status |
|------|----------------------|--------|
| `src/design-tokens/tokens.scss` | All deprecated tokens | 🟡 Definition file |
| `src/core/_design_tokens.scss` | `--sn-color-oklab-dynamic-shadow-rgb`<br>`--sn-color-oklab-bright-highlight-rgb` | 🟡 Fallback usage |
| `src/sidebar/_sidebar_interactive.scss` | `--sn-anim-easing-dynamic` (UNDEFINED) | 🔴 Direct usage |
| `src/features/interactions/_microinteractions.scss` | `--sn-easing-explorer` (UNDEFINED) | 🔴 Indirect via `--sn-transition-timing-default` |
| `src/features/backgrounds/_grid_navigation_mode.scss` | `--sn-easing-explorer` (UNDEFINED) | 🔴 Indirect via `--sn-transition-timing-default` |
| `src/components/_now_playing.scss` | `--sn-easing-explorer` (UNDEFINED) | 🔴 Indirect via `--sn-transition-timing-default` |
| `src/components/_track_list_enhanced.scss` | `--sn-easing-explorer` (UNDEFINED) | 🔴 Indirect via `--sn-transition-timing-default` |

### Dependency Chain Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│ undefined: --sn-easing-explorer                                 │
│            (referenced but never defined)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ fallback to
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ undefined: --sn-anim-easing-dynamic                            │
│            (referenced but never defined)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ used in
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ --sn-transition-timing-default                                  │
│ (resolves to NOTHING - invalid CSS)                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │ used by
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Components:                                                      │
│ • _microinteractions.scss                                        │
│ • _grid_navigation_mode.scss                                     │
│ • _now_playing.scss                                              │
│ • _track_list_enhanced.scss                                      │
│ • _sidebar_interactive.scss (also direct usage)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Testing & Validation Plan

### Pre-Migration Tests
1. Document current visual behavior of components using undefined tokens
2. Screenshot comparison of:
   - Sidebar navigation transitions
   - Now playing animations
   - Track list interactions
   - Grid navigation mode

### Migration Tests
1. After fixing undefined variables:
   - Verify all transitions have proper easing
   - Test reduced motion accessibility override
   - Validate OKLAB color fallbacks

2. After removing safe tokens:
   - Run full SCSS compilation
   - Check for any warnings about undefined variables
   - Verify no breaking changes in compiled CSS

### Post-Migration Validation
1. Visual regression testing on all affected components
2. Accessibility testing with `prefers-reduced-motion: reduce`
3. Performance impact assessment (if any)

---

## 7. Timeline & Risk Assessment

### Immediate (This Week)
- **Phase 1:** Fix critical undefined variable issues
- **Risk:** 🔴 HIGH (current broken state)
- **Impact:** 🟢 LOW (fixing broken functionality)

### Short-term (Next Sprint)
- **Phase 2:** Remove safe tokens
- **Risk:** 🟢 LOW (no active usage)
- **Impact:** 🟢 LOW (cleanup only)

### Medium-term (Following Sprint)
- **Phase 3:** Migrate active usage and remove remaining deprecated tokens
- **Risk:** 🟡 MEDIUM (requires testing)
- **Impact:** 🟡 MEDIUM (affects accessibility and fallbacks)

---

## 8. Summary Statistics

| Category | Count |
|----------|-------|
| Total Deprecated Tokens | 12 |
| Safe for Removal | 5 |
| Requires Migration | 5 |
| Undefined Variables | 2 |
| Files Affected | 7 |
| Critical Priority | 2 |
| Medium Priority | 3 |
| Low Priority | 5 |

---

## Next Steps

1. ✅ Complete initial analysis (this document)
2. ⏳ Define `--sn-anim-easing-dynamic` and fix undefined variables (Phase 1)
3. ⏳ Remove safe tokens (Phase 2)
4. ⏳ Migrate active usage (Phase 3)
5. ⏳ Update documentation to reflect changes

---

**Last Updated:** 2025-10-04
**Analysis By:** Claude Code
**Review Status:** Pending Team Review
