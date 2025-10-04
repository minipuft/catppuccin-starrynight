# Token Governance Standards

**Catppuccin StarryNight Theme - Token Management Policies**

**Version:** 1.0.0
**Effective Date:** 2025-10-04
**Last Updated:** 2025-10-04
**Status:** Active

---

## Table of Contents

1. [Purpose](#purpose)
2. [Addition Policy](#addition-policy)
3. [Naming Standards](#naming-standards)
4. [Modification Policy](#modification-policy)
5. [Deprecation Process](#deprecation-process)
6. [Removal Policy](#removal-policy)
7. [Review Requirements](#review-requirements)
8. [Breaking Change Policy](#breaking-change-policy)
9. [Documentation Requirements](#documentation-requirements)

---

## Purpose

This document establishes governance standards for the StarryNight token system to:

1. **Prevent token proliferation**: Avoid creating unnecessary tokens
2. **Maintain consistency**: Enforce naming conventions and patterns
3. **Ensure quality**: Require review and validation before adding tokens
4. **Manage deprecation**: Provide clear process for removing outdated tokens
5. **Protect users**: Minimize breaking changes and provide migration paths

---

## Addition Policy

### When to Add New Tokens

✅ **Valid Reasons**:
- New feature requires unique, reusable value
- No existing token serves the same purpose
- Value will be used in 2+ locations
- Value may need runtime modification (TypeScript)
- Creates semantic clarity over hardcoded value

❌ **Invalid Reasons**:
- One-off value for single component
- Duplicate functionality of existing token
- Overly specific with no reuse potential
- Creating "just in case" tokens
- Experimental features without clear use case

### Pre-Addition Checklist

Before proposing a new token:

- [ ] **Search existing tokens**: Verify no token serves same purpose
- [ ] **Check usage**: Confirm value will be used in 2+ places
- [ ] **Consider alternatives**: Can existing token be reused?
- [ ] **Define purpose**: Clear semantic meaning documented
- [ ] **Follow conventions**: Name follows `--sn-{category}-{name}` pattern
- [ ] **Plan integration**: How will SCSS/TypeScript use this token?

### Token Addition Workflow

1. **Research Phase**:
   - Search `src/design-tokens/tokens.scss` for similar tokens
   - Run `./scripts/analyze-tokens.sh` to check for duplicates
   - Review [Token System Architecture](./token-system-architecture.md)

2. **Proposal Phase**:
   - Document token purpose, category, and usage
   - Provide example usage in SCSS/TypeScript
   - Explain why existing tokens insufficient
   - Submit PR with proposal

3. **Review Phase**:
   - PR review by maintainers
   - Naming convention validation
   - Duplicate check validation
   - Usage pattern review

4. **Implementation Phase**:
   - Add token to `src/design-tokens/tokens.scss`
   - Add inline comment explaining purpose
   - Update relevant documentation
   - Add usage examples to PR

---

## Naming Standards

### Required Format

All tokens **MUST** follow this pattern:

```
--sn-{category}-{name}[-{variant}]
```

**Components**:
- `--sn-`: **Required** theme prefix (StarryNight)
- `{category}`: **Required** system category (see taxonomy below)
- `{name}`: **Required** descriptive token name
- `{variant}`: **Optional** variant suffix (rgb, hex, duration, etc.)

### Category Taxonomy

| Category | Prefix | Use Case |
|----------|--------|----------|
| Animation | `--sn-anim-` | Easing functions, breathing effects |
| Transitions | `--sn-transition-` | Duration, timing, complete transitions |
| Color (base) | `--sn-color-` | Base color tokens |
| Cosmic Palette | `--sn-cosmic-` | Theme-specific color palette |
| Dynamic Color | `--sn-dynamic-` | Runtime-updated colors |
| OKLAB Processing | `--sn-oklab-` | OKLAB color space tokens |
| Musical OKLAB | `--sn-musical-oklab-` | Music-driven OKLAB colors |
| Layout | `--sn-layout-` | Spacing, z-index, border radius |
| Music Sync | `--sn-music-` | Music analysis, beat detection |
| Visual Effects | `--sn-visual-effects-` | Depth, magnetic fields, advanced effects |
| UI Components | `--sn-ui-` | Component-specific tokens |
| Background | `--sn-bg-` | Background gradients, particles |
| Performance | `--sn-perf-` | Performance flags, quality settings |
| Brightness | `--sn-brightness-` | Brightness mode variants |
| Genre | `--sn-genre-` | Genre-specific OKLAB adjustments |
| Emotion | `--sn-emotion-` | Emotion-specific palettes |

### Variant Suffix Standards

| Suffix | Type | Format | Example |
|--------|------|--------|---------|
| `-rgb` | Color | `R, G, B` | `203, 166, 247` |
| `-hex` | Color | `#RRGGBB` | `#cba6f7` |
| `-duration` | Time | `{N}ms` | `300ms` |
| `-intensity` | Decimal | `0.0` to `1.0` | `0.8` |
| `-opacity` | Decimal | `0.0` to `1.0` | `0.85` |
| `-enabled` | Boolean | `0` or `1` | `1` |
| `-level` | Integer | Whole number | `500` |
| `-pull` | Distance | `{N}px` | `8px` |

### Naming Rules

✅ **Allowed**:
- Lowercase letters: `a-z`
- Numbers: `0-9`
- Hyphens: `-`

❌ **Not Allowed**:
- Uppercase letters: `A-Z`
- Underscores: `_`
- Special characters: `!, @, #, $, etc.`
- Spaces

### Examples

✅ **Correct**:
```scss
--sn-color-accent-rgb: 203, 166, 247;
--sn-transition-fast-duration: 150ms;
--sn-music-beat-pulse-intensity: 0;
--sn-visual-effects-magnetic-hover-pull: 8px;
```

❌ **Incorrect**:
```scss
--sn-AccentColor: 203, 166, 247;          // Uppercase
--sn-transition_fast: 150ms;              // Underscore
--accent-rgb: 203, 166, 247;              // Missing --sn- prefix
--sn-rgb-accent: 203, 166, 247;           // Wrong order (category-name)
--sn-my-custom-token-123: 5px;            // Unclear category
```

### Validation

Run naming validation before committing:

```bash
./scripts/check-token-naming.sh
```

This script will:
- ✅ Check all tokens follow `--sn-{category}-{name}` pattern
- ✅ Verify category prefixes are valid
- ✅ Report any naming violations
- ✅ Exit with error if violations found

---

## Modification Policy

### Value Changes (Non-Breaking)

**When Allowed**:
- Adjusting numeric values for tuning (duration, opacity, spacing)
- Updating colors for visual consistency
- Changing easing functions for better UX
- Modifying runtime-updated tokens (TypeScript-managed)

**Requirements**:
- Document reason for change in commit message
- Test visual regression after change
- Verify no unintended side effects
- Update documentation if semantic meaning changes

**Example**:
```scss
// BEFORE
--sn-transition-fast-duration: 150ms;

// AFTER (tuned for better UX)
--sn-transition-fast-duration: 120ms;
```

**Commit Message**:
```
perf(tokens): reduce fast transition duration for snappier UI

Adjusted --sn-transition-fast-duration from 150ms to 120ms based on user
feedback that transitions felt slightly sluggish. Tested across all
interactive components with no negative visual impact.
```

### Delegation Changes (Caution Required)

**When Allowed**:
- Consolidating duplicate delegation chains
- Simplifying overly complex var() chains
- Updating delegation to use more semantic token

**Requirements**:
- Verify all references still work correctly
- Test computed values match previous behavior
- Check TypeScript integration still functions
- Full visual regression test required

**Example**:
```scss
// BEFORE (3-level chain)
--sn-ui-button-accent-rgb: var(--sn-color-accent-rgb);
--sn-color-accent-rgb: var(--sn-dynamic-accent-rgb);
--sn-dynamic-accent-rgb: var(--sn-cosmic-accent-rgb);

// AFTER (simplified to 2-level)
--sn-ui-button-accent-rgb: var(--sn-color-accent-rgb);
--sn-color-accent-rgb: var(--sn-cosmic-accent-rgb);
```

### Forbidden Changes (Breaking)

❌ **Never Without Major Version**:
- Changing token name
- Changing token type (rgb → hex, duration → opacity)
- Removing token delegation without deprecation
- Changing semantic meaning completely

---

## Deprecation Process

### When to Deprecate

Tokens should be deprecated when:
- Functionality no longer needed
- Replaced by better alternative
- Zero usage detected (verify with scripts)
- Part of removed feature

### Deprecation Steps

#### 1. Mark as Deprecated (Inline Comment)

```scss
// DEPRECATED (Phase 6): Use --sn-color-accent-rgb instead
// Will be removed in v5.0.0
--sn-accent-rgb: var(--sn-color-accent-rgb);
```

#### 2. Add to Migration Guide

Update `docs/LEGACY_TOKEN_MIGRATION.md`:

```markdown
| Legacy Token | Modern Token | Status |
|--------------|--------------|--------|
| `--sn-accent-rgb` | `--sn-color-accent-rgb` | 🟡 DEPRECATED (v4.1.0) |
```

#### 3. Announce in CHANGELOG

```markdown
### Deprecated

- `--sn-accent-rgb`: Replaced by `--sn-color-accent-rgb`. Will be removed in v5.0.0.
```

#### 4. Add to plans/deprecated-tokens-analysis.md

Document:
- Token name
- Reason for deprecation
- Replacement token
- Timeline for removal
- Migration instructions

#### 5. Minimum Deprecation Period

**Required**: At least **2-3 release cycles** before removal

**Example Timeline**:
- v4.1.0: Token deprecated
- v4.2.0: Deprecation warning remains
- v4.3.0: Final warning before removal
- v5.0.0: Token removed (breaking change)

### Migration Support

During deprecation period:
- ✅ Legacy token remains functional (delegation)
- ✅ Migration guide provided
- ✅ Search & replace patterns documented
- ✅ Warning in browser console (optional)
- ✅ Announcement in release notes

---

## Removal Policy

### When Tokens Can Be Removed

Tokens may be removed when:
- ✅ Deprecated for 2-3+ release cycles
- ✅ Zero usage confirmed in codebase
- ✅ Migration guide published
- ✅ Part of major version release (v5.0.0, v6.0.0)
- ✅ Announced in CHANGELOG

### Removal Workflow

#### 1. Verify Zero Usage

```bash
# Check CSS/SCSS usage
grep -r "var(--sn-deprecated-token)" src/ --include="*.scss"

# Check TypeScript usage
grep -r "setProperty.*--sn-deprecated-token" src-js/ --include="*.ts"
```

**Expected**: 0 results (except in tokens.scss itself)

#### 2. Check Compiled CSS

```bash
# Build and check compiled output
npm run build:css:dev
grep "\\-\\-sn-deprecated-token" user.css
```

**Expected**: 0 results (token should be optimized out)

#### 3. Remove Token Definition

Delete from `src/design-tokens/tokens.scss`:

```scss
// DELETE THIS:
// DEPRECATED: Use --sn-color-accent-rgb instead
--sn-accent-rgb: var(--sn-color-accent-rgb);
```

#### 4. Update Documentation

- Remove from migration guide (or mark as removed)
- Update CHANGELOG
- Update token count in architecture docs

#### 5. Test & Commit

```bash
# Build and test
npm run build:css:dev
npm run typecheck
npm test

# Validate tokens
./scripts/validate-tokens.sh

# Commit with clear message
git commit -m "chore(tokens)!: remove deprecated --sn-accent-rgb token

BREAKING CHANGE: Removed --sn-accent-rgb token deprecated in v4.1.0.
Use --sn-color-accent-rgb instead. See migration guide for details.

Deprecated: v4.1.0
Removed: v5.0.0
Migration: docs/LEGACY_TOKEN_MIGRATION.md
"
```

### Batch Removal Strategy

For multiple deprecated tokens:

1. **Group by category**: Remove related tokens together
2. **Batch size**: 10-20 tokens per commit
3. **Test after each batch**: Ensure no breakage
4. **Document in plan**: Create removal plan (see Phase 5 tier plans)

---

## Review Requirements

### Pull Request Requirements

All token changes **MUST** include:

#### 1. Clear Description

```markdown
## Token Change Summary

**Type**: Addition | Modification | Deprecation | Removal

**Affected Tokens**:
- `--sn-new-token: value`

**Reason**: Brief explanation of why this change is necessary

**Usage Examples**:
```scss
.my-component {
  property: var(--sn-new-token);
}
```

**Testing**:
- [ ] Build passes
- [ ] Visual regression tested
- [ ] Naming convention validated
```

#### 2. Validation Checklist

- [ ] Naming convention follows `--sn-{category}-{name}` pattern
- [ ] No duplicate functionality
- [ ] Inline comment explains purpose
- [ ] Documentation updated (if needed)
- [ ] Usage examples provided
- [ ] Build passes (npm run build:css:dev)
- [ ] TypeScript compiles (npm run typecheck)
- [ ] Naming validation passes (./scripts/check-token-naming.sh)
- [ ] Visual regression tested (if applicable)

#### 3. Reviewer Responsibilities

Reviewers should verify:

- ✅ Token naming follows conventions
- ✅ No duplicate functionality exists
- ✅ Purpose is clear and well-documented
- ✅ Usage examples make sense
- ✅ Tests pass
- ✅ No breaking changes (unless major version)
- ✅ Documentation updated appropriately

### Approval Requirements

**Token Additions/Modifications**:
- Minimum 1 maintainer approval required
- Naming validation must pass
- Build must pass

**Token Deprecations**:
- Minimum 1 maintainer approval required
- Migration guide must be updated
- Timeline for removal must be clear

**Token Removals**:
- Minimum 2 maintainer approvals required
- Zero usage must be verified
- Part of major version release
- CHANGELOG must be updated

---

## Breaking Change Policy

### Definition of Breaking Changes

A **breaking change** occurs when:
- Token is removed (no delegation fallback)
- Token name is changed (old name no longer works)
- Token type changes (rgb → hex, breaking expectations)
- Token semantic meaning changes significantly

### Major Version Releases

Breaking changes **ONLY** allowed in major versions:
- v4.0.0 → v5.0.0
- v5.0.0 → v6.0.0
- etc.

**Minor/Patch Releases** (v4.1.0, v4.0.1):
- ❌ Cannot remove tokens
- ❌ Cannot rename tokens
- ✅ Can deprecate tokens (with delegation)
- ✅ Can modify token values
- ✅ Can add new tokens

### Breaking Change Announcement

**Required Components**:

1. **CHANGELOG Entry**:
```markdown
## [5.0.0] - 2025-XX-XX

### BREAKING CHANGES

- **Removed deprecated tokens** (12 tokens):
  - `--sn-accent-rgb` → Use `--sn-color-accent-rgb`
  - `--sn-gradient-primary-rgb` → Use `--sn-bg-gradient-primary-rgb`
  - [Full list in migration guide]

### Migration Guide

See [LEGACY_TOKEN_MIGRATION.md](./docs/LEGACY_TOKEN_MIGRATION.md) for
detailed migration instructions and search/replace patterns.
```

2. **GitHub Release Notes**:
- Highlight breaking changes prominently
- Link to migration guide
- Provide timeline for community feedback
- Offer migration support

3. **Community Notice**:
- Announce in GitHub discussions
- Update README with migration notice
- Provide examples and support

### Semantic Versioning Adherence

StarryNight follows [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (v5.0.0): Breaking changes, token removals
- **MINOR** (v4.1.0): New tokens, deprecations, enhancements
- **PATCH** (v4.0.1): Bug fixes, value adjustments, documentation

---

## Documentation Requirements

### Inline Documentation (tokens.scss)

Every token **SHOULD** have inline comment:

```scss
// Primary accent color for theme (Catppuccin Mauve)
// Used for: buttons, highlights, focus states, musical accents
--sn-color-accent-rgb: 203, 166, 247;
```

**Comment Template**:
```scss
// {Purpose} ({Optional: source or design system reference})
// Used for: {use case 1}, {use case 2}, {use case 3}
{Optional: // TypeScript-managed: Updated by {SystemName}}
--sn-token-name: value;
```

### External Documentation

When adding **new categories** or **significant tokens**, update:

1. **Token System Architecture** (`docs/token-system-architecture.md`):
   - Add category to category list
   - Update token count by category table
   - Add usage examples

2. **Token Usage Guide** (`docs/token-usage-guide.md`):
   - Add usage examples
   - Document common patterns
   - Add to troubleshooting (if needed)

3. **README.md**:
   - Update token count (if significant change)
   - Update quick reference (if new category)

---

## Enforcement

### Automated Validation

Token governance is enforced through:

1. **Pre-commit Validation** (optional, can skip with `--no-verify`):
```bash
# Runs on every commit
./scripts/validate-tokens.sh
```

2. **CI/CD Pipeline**:
```yaml
# Runs on every PR
- name: Validate Token System
  run: npm run validate:tokens
```

3. **PR Review Checklist**:
- Naming convention compliance
- Duplicate functionality check
- Documentation requirements

### Violation Handling

**Minor Violations** (naming, documentation):
- Request changes in PR review
- Provide guidance on fixing
- Approve after fixes

**Major Violations** (breaking changes in minor release):
- Block PR merge
- Require major version bump
- Ensure proper migration path

---

## Appendix: Token Addition Template

Use this template when proposing new tokens:

```markdown
## Token Addition Proposal

### Token Definition
```scss
--sn-{category}-{name}[-{variant}]: value;
```

### Purpose
Brief explanation of why this token is needed and what problem it solves.

### Category
- Category: {Animation|Color|Layout|Music|Visual Effects|UI|Background|Performance}
- Prefix: `--sn-{category}-`

### Usage Examples

**SCSS**:
```scss
.my-component {
  property: var(--sn-new-token);
}
```

**TypeScript** (if applicable):
```typescript
document.documentElement.style.setProperty('--sn-new-token', newValue);
```

### Validation Checklist
- [ ] No existing token serves same purpose
- [ ] Follows naming convention
- [ ] Will be used in 2+ locations
- [ ] Purpose documented
- [ ] Examples provided
- [ ] Build tested

### Migration Impact
- [ ] No breaking changes
- [ ] Backwards compatible
- [ ] Deprecates existing token: {token name} (if applicable)
```

---

**Governance Version:** 1.0.0
**Status:** Active
**Next Review:** After major version release or significant token system changes

---

## Related Documentation

- **[Token System Architecture](./token-system-architecture.md)**: System overview and categories
- **[Token Usage Guide](./token-usage-guide.md)**: Developer guide with examples
- **[Legacy Token Migration](./LEGACY_TOKEN_MIGRATION.md)**: Migration guide for deprecated tokens
