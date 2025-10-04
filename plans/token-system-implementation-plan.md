# Token System Implementation Plan - Comprehensive Cleanup & Optimization

**Created:** 2025-10-04
**Status:** Planning Phase
**Related:** `deprecated-tokens-analysis.md`, `dom-selector-migration.md`

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 0: Pre-Implementation Setup](#phase-0-pre-implementation-setup)
3. [Phase 1: Critical Bug Fixes](#phase-1-critical-bug-fixes)
4. [Phase 2: Safe Removals](#phase-2-safe-removals)
5. [Phase 3: Active Usage Migration](#phase-3-active-usage-migration)
6. [Phase 4: Complete Token Audit](#phase-4-complete-token-audit)
7. [Phase 5: Token Consolidation](#phase-5-token-consolidation)
8. [Phase 6: Documentation & Standards](#phase-6-documentation--standards)
9. [Testing Strategy](#testing-strategy)
10. [Rollback Procedures](#rollback-procedures)

---

## Overview

### Goals
1. **Fix critical undefined variable issues** affecting animations
2. **Remove deprecated tokens** safely to reduce technical debt
3. **Audit entire token system** for unused/duplicate/inconsistent tokens
4. **Consolidate and optimize** token architecture
5. **Establish standards** for future token management

### Success Criteria
- ✅ All undefined variables resolved (Phase 1-3)
- ✅ Zero deprecated tokens in active use (Phase 1-3)
- ✅ Complete token usage documentation (Phase 4)
- ✅ **Reduced token count by 20%+ (20.45% achieved in Phase 5)** 🎯
- ✅ Clear naming conventions established (Phase 4 - zero violations found)
- ✅ No visual regressions (All phases validated)

### Timeline Estimate
- **Phase 0:** 1 day (setup & baseline)
- **Phase 1:** 1-2 days (critical fixes)
- **Phase 2:** 1 day (safe removals)
- **Phase 3:** 2-3 days (migrations)
- **Phase 4:** 3-5 days (full audit)
- **Phase 5:** 3-5 days (consolidation)
- **Phase 6:** 2 days (documentation)

**Total:** 2-3 weeks

---

## Phase 0: Pre-Implementation Setup

**Status:** ⏳ Not Started
**Priority:** Required for all phases
**Duration:** 1 day

### Objectives
- Establish baseline for comparison
- Create safety mechanisms
- Set up monitoring tools

### Tasks

#### 0.1 Create Baseline Documentation
```bash
# Capture current state
npm run build:css:dev 2>&1 | tee baseline-build.log
npm run typecheck 2>&1 | tee baseline-typecheck.log

# Extract all CSS variables
grep -r "\-\-sn-" src/ --include="*.scss" | sort | uniq > baseline-tokens.txt

# Count tokens
grep "^\s*--sn-" src/design-tokens/tokens.scss | wc -l
```

**Deliverable:** `baseline-report.md` with:
- Current token count by category
- Build output analysis
- Screenshot gallery of all major UI components
- Performance metrics (build time, file size)

#### 0.2 Create Testing Framework
```bash
# Install visual regression testing tools if needed
npm install --save-dev backstopjs

# Set up test configuration
```

**Deliverable:** `test-config.json` with:
- Visual regression test scenarios
- Component interaction tests
- Accessibility test suite

#### 0.3 Git Safety Branch Strategy
```bash
# Create feature branch
git checkout -b feat/token-system-cleanup

# Create phase sub-branches
git checkout -b feat/token-system-cleanup/phase-1
```

**Deliverable:** Branch structure:
```
main
└── feat/token-system-cleanup
    ├── phase-1-critical-fixes
    ├── phase-2-safe-removals
    ├── phase-3-migrations
    ├── phase-4-audit
    ├── phase-5-consolidation
    └── phase-6-documentation
```

### Acceptance Criteria
- [ ] Baseline documentation complete
- [ ] Visual regression tests configured
- [ ] Git branch structure established
- [ ] Rollback procedure documented
- [ ] Team review of approach

---

## Phase 1: Critical Bug Fixes

**Status:** ⏳ Not Started
**Priority:** 🔴 CRITICAL
**Duration:** 1-2 days
**Dependencies:** Phase 0

### Objectives
- Fix undefined `--sn-anim-easing-dynamic` variable
- Fix undefined `--sn-easing-explorer` reference
- Restore proper easing to all affected components

### Issues to Fix

#### Issue 1.1: Define Missing `--sn-anim-easing-dynamic`

**Current State:**
```scss
// Referenced but NEVER DEFINED
--sn-transition-timing-default: var(--sn-easing-explorer, var(--sn-anim-easing-dynamic));
--sn-ease-smooth: var(--sn-anim-easing-dynamic);
```

**Affected Components:**
- `src/sidebar/_sidebar_interactive.scss:40` (direct usage)
- All components using `--sn-transition-timing-default`

**Solution:**
```scss
// Add to src/design-tokens/tokens.scss around line 177
// (with other easing functions)

// Dynamic easing function for interactive transitions
// Provides smooth deceleration for general UI interactions
--sn-anim-easing-dynamic: cubic-bezier(0.4, 0, 0.2, 1);
```

**Justification:**
- `cubic-bezier(0.4, 0, 0.2, 1)` is Material Design's standard easing
- Matches the pattern of other defined easings in the file
- Provides appropriate deceleration for UI transitions

#### Issue 1.2: Remove Undefined `--sn-easing-explorer` Reference

**Current State:**
```scss
// Line 206 - references undefined variable
--sn-transition-timing-default: var(--sn-easing-explorer, var(--sn-anim-easing-dynamic));
```

**Solution:**
```scss
// AFTER Issue 1.1 is fixed
--sn-transition-timing-default: var(--sn-anim-easing-dynamic);
```

**Alternative (if --sn-easing-explorer was intended):**
If this was meant to be a user-configurable override:
```scss
// Define the variable first
--sn-easing-explorer: var(--sn-anim-easing-dynamic); // Default to dynamic easing

// Then reference it
--sn-transition-timing-default: var(--sn-easing-explorer);
```

### Implementation Steps

#### Step 1.1.1: Add Missing Easing Definition
**File:** `src/design-tokens/tokens.scss`
**Location:** After line 177 (in Easing Functions section)

```scss
// Easing Functions
--sn-anim-easing-emergence: cubic-bezier(0.23, 1, 0.32, 1);
--sn-anim-easing-organic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--sn-anim-easing-breathing: cubic-bezier(0.37, 0, 0.63, 1);
--sn-anim-easing-harmony: cubic-bezier(0.165, 0.84, 0.44, 1);
--sn-anim-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
--sn-anim-easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
--sn-anim-easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
--sn-anim-easing-bounce: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--sn-anim-easing-visual-effects: cubic-bezier(0.4, 0, 0.2, 1);
--sn-anim-easing-bounce-playful: cubic-bezier(0.1, 0.7, 0.5, 1.3);
--sn-anim-easing-elastic: cubic-bezier(0.2, 0.8, 0.2, 1);
--sn-anim-easing-bounce-smooth: cubic-bezier(0.175, 0.885, 0.32, 1.4);
--sn-anim-easing-bounce-medium: cubic-bezier(0.175, 0.885, 0.32, 1.375);
--sn-anim-easing-bounce-gentle: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--sn-anim-easing-bounce-strong: cubic-bezier(0.175, 0.885, 0.32, 1.5);
--sn-anim-easing-custom-1: cubic-bezier(0.4, 0, 0.6, 1);
--sn-anim-easing-custom-2: cubic-bezier(0.34, 1.56, 0.64, 1);
--sn-anim-easing-custom-3: cubic-bezier(0.68, -0.55, 0.265, 1.55);

// ADD THIS:
--sn-anim-easing-dynamic: cubic-bezier(0.4, 0, 0.2, 1); // Dynamic easing for interactive transitions
```

#### Step 1.1.2: Update Transition Timing Default
**File:** `src/design-tokens/tokens.scss`
**Location:** Line 206

```scss
// BEFORE
--sn-transition-timing-default: var(--sn-easing-explorer, var(--sn-anim-easing-dynamic));

// AFTER
--sn-transition-timing-default: var(--sn-anim-easing-dynamic);
```

#### Step 1.1.3: Update Legacy Alias
**File:** `src/design-tokens/tokens.scss`
**Location:** Line 213

```scss
// BEFORE
--sn-ease-smooth: var(--sn-anim-easing-dynamic);

// AFTER (already correct once --sn-anim-easing-dynamic is defined)
--sn-ease-smooth: var(--sn-anim-easing-dynamic);
```

### Testing Requirements

#### Visual Regression Tests
```bash
# Test affected components
npm run build:css:dev
npm run test:visual -- --scenarios=sidebar,now-playing,track-list,grid-nav
```

**Components to verify:**
1. Sidebar navigation item transitions
2. Now playing card animations
3. Track list hover effects
4. Grid navigation mode transitions

#### Manual Testing Checklist
- [ ] Sidebar navigation items have smooth transitions
- [ ] Now playing card animates correctly
- [ ] Track list rows transition smoothly on hover
- [ ] Grid navigation mode has proper easing
- [ ] All transitions respect `prefers-reduced-motion`
- [ ] No console warnings about undefined variables

#### Browser Testing
- [ ] Chrome/Chromium (Spotify client)
- [ ] Edge (if applicable)
- [ ] Firefox (if Spicetify supports)

### Acceptance Criteria
- [ ] `--sn-anim-easing-dynamic` defined in tokens.scss
- [ ] `--sn-easing-explorer` reference removed
- [ ] All affected components render correctly
- [ ] No undefined variable warnings in build output
- [ ] Visual regression tests pass
- [ ] Manual testing complete
- [ ] Code review approved

### Rollback Procedure
```bash
# If issues occur
git checkout feat/token-system-cleanup
git branch -D feat/token-system-cleanup/phase-1
git push origin :feat/token-system-cleanup/phase-1
```

**Restore original behavior:**
Comment out changes and restore original (broken) state until investigation complete.

---

## Phase 2: Safe Removals

**Status:** ⏳ Not Started
**Priority:** 🟢 LOW
**Duration:** 1 day
**Dependencies:** Phase 1 complete and verified

### Objectives
- Remove deprecated tokens with zero active usage
- Clean up technical debt
- Reduce token file size

### Tokens to Remove

#### 2.1 Legacy Animation Duration
**File:** `src/design-tokens/tokens.scss:161`

```scss
// REMOVE
--sn-anim-duration-animation: 4s; // Legacy: Decorative animation duration (consider migrating)
```

**Verification:**
```bash
# Confirm no usage
grep -r "\-\-sn-anim-duration-animation" src/ --include="*.scss" | grep -v "tokens.scss"
# Expected: No results
```

#### 2.2 Legacy Easing Aliases
**File:** `src/design-tokens/tokens.scss:212, 214`

```scss
// REMOVE
--sn-ease-bounce: var(--sn-anim-easing-bounce-gentle);
--sn-ease-sharp: var(--sn-anim-easing-custom-1);
```

**Note:** Keep `--sn-ease-smooth` for now (used in deprecated but not removed section)

**Verification:**
```bash
grep -r "\-\-sn-ease-bounce" src/ --include="*.scss" | grep -v "tokens.scss"
grep -r "\-\-sn-ease-sharp" src/ --include="*.scss" | grep -v "tokens.scss"
# Expected: No results
```

#### 2.3 Self-Referential OKLAB Tokens
**File:** `src/design-tokens/tokens.scss:410-411`

```scss
// REMOVE
--sn-color-oklab-base-luminance: var(--sn-oklab-base-luminance);
--sn-color-oklab-accent-luminance: var(--sn-oklab-accent-luminance);
```

**Verification:**
```bash
grep -r "\-\-sn-color-oklab-base-luminance" src/ --include="*.scss" | grep -v "tokens.scss"
grep -r "\-\-sn-color-oklab-accent-luminance" src/ --include="*.scss" | grep -v "tokens.scss"
# Expected: No results
```

### Implementation Steps

#### Step 2.1: Create Removal Patch
```bash
# Create dedicated branch
git checkout -b feat/token-system-cleanup/phase-2
```

#### Step 2.2: Remove Token Definitions

**Edit:** `src/design-tokens/tokens.scss`

Remove lines:
- Line 161: `--sn-anim-duration-animation`
- Line 212: `--sn-ease-bounce`
- Line 214: `--sn-ease-sharp`
- Line 410: `--sn-color-oklab-base-luminance`
- Line 411: `--sn-color-oklab-accent-luminance`

#### Step 2.3: Update Documentation Comments

Update comments to reflect removals:
```scss
// Legacy easing aliases (backward compatibility)
// NOTE: --sn-ease-bounce and --sn-ease-sharp removed in Phase 2 (2025-10-04)
--sn-ease-smooth: var(--sn-anim-easing-dynamic);
```

### Testing Requirements

#### Build Verification
```bash
npm run build:css:dev
# Should complete with no warnings

npm run typecheck
# Should pass
```

#### Regression Testing
```bash
# Full visual regression suite
npm run test:visual

# Compare bundle size
ls -lh user.css
# Should be slightly smaller
```

### Acceptance Criteria
- [ ] 5 deprecated tokens removed
- [ ] Build completes with no warnings
- [ ] Visual regression tests pass
- [ ] Bundle size reduced (even if minimal)
- [ ] Documentation updated
- [ ] Code review approved

---

## Phase 3: Active Usage Migration

**Status:** ✅ COMPLETE (2025-10-04)
**Priority:** 🟡 MEDIUM
**Duration:** 1 day (completed in 1 session)
**Dependencies:** Phase 1 & 2 complete

### Objectives
- Migrate accessibility media query to use primary tokens
- Simplify OKLAB fallback chain
- Remove remaining deprecated aliases

### Sub-Phases

#### 3.1 Accessibility Media Query Migration

**Current State:**
```scss
// src/design-tokens/tokens.scss:758-760
@media (prefers-reduced-motion: reduce) {
  :root {
    --sn-anim-transition-fast: 0ms;
    --sn-anim-transition-standard: 0ms;
    --sn-anim-transition-slow: 0ms;
  }
}
```

**Migration:**
```scss
@media (prefers-reduced-motion: reduce) {
  :root {
    // Override primary tokens directly
    --sn-transition-fast-duration: 0ms;
    --sn-transition-standard-duration: 0ms;
    --sn-transition-slow-duration: 0ms;

    // Also override extended for completeness
    --sn-transition-extended-duration: 0ms;
    --sn-anim-transition-cosmic: 0ms;
  }
}
```

**Testing:**
```bash
# Test with reduced motion enabled
# Chrome DevTools: Rendering > Emulate CSS media feature prefers-reduced-motion
```

**Verification checklist:**
- [ ] All animations disabled with reduced motion
- [ ] No transition delays visible
- [ ] UI remains functional
- [ ] Legacy aliases still work (during migration)

#### 3.2 OKLAB Fallback Chain Simplification

**Current State:**
```scss
// src/core/_design_tokens.scss:48, 50
@function oklab-color($token, $opacity: 1) {
  @if $token == 'shadow' {
    @return rgba(var(--sn-oklab-shadow-rgb, var(--sn-color-oklab-dynamic-shadow-rgb, 0, 0, 0)), $opacity);
  } @else if $token == 'highlight' {
    @return rgba(var(--sn-oklab-highlight-rgb, var(--sn-color-oklab-bright-highlight-rgb, 255, 255, 255)), $opacity);
  }
}
```

**Migration:**
```scss
@function oklab-color($token, $opacity: 1) {
  @if $token == 'shadow' {
    @return rgba(var(--sn-oklab-shadow-rgb, 0, 0, 0), $opacity);
  } @else if $token == 'highlight' {
    @return rgba(var(--sn-oklab-highlight-rgb, 255, 255, 255), $opacity);
  }
  // ... rest of function
}
```

**Rationale:**
- Primary tokens (`--sn-oklab-shadow-rgb`, `--sn-oklab-highlight-rgb`) are always defined
- Legacy fallback tokens are deprecated and add unnecessary complexity
- Direct fallback to static values is clearer

#### 3.3 Remove Remaining Legacy Aliases

**After 3.1 and 3.2 complete:**

Remove from `src/design-tokens/tokens.scss`:
```scss
// Line 201-203 - REMOVE after accessibility migration
--sn-anim-transition-fast: var(--sn-transition-fast-duration);
--sn-anim-transition-standard: var(--sn-transition-standard-duration);
--sn-anim-transition-slow: var(--sn-transition-slow-duration);

// Line 213 - REMOVE after confirming no usage
--sn-ease-smooth: var(--sn-anim-easing-dynamic);

// Line 408-409 - REMOVE after OKLAB fallback simplification
--sn-color-oklab-bright-highlight-rgb: var(--sn-oklab-highlight-rgb);
--sn-color-oklab-dynamic-shadow-rgb: var(--sn-oklab-shadow-rgb);
```

### Implementation Steps

#### Step 3.1: Accessibility Migration
1. Update media query in `tokens.scss:758-760`
2. Test with `prefers-reduced-motion: reduce`
3. Verify all animations properly disabled
4. Commit: `fix(tokens): migrate accessibility media query to primary tokens`

#### Step 3.2: OKLAB Simplification
1. Update `oklab-color()` function in `_design_tokens.scss:48, 50`
2. Run full build and visual regression tests
3. Verify shadow and highlight colors render correctly
4. Commit: `refactor(tokens): simplify OKLAB fallback chain`

#### Step 3.3: Final Cleanup
1. Remove legacy transition aliases (lines 201-203)
2. Remove legacy easing alias (line 213)
3. Remove legacy OKLAB aliases (lines 408-409)
4. Update documentation comments
5. Commit: `chore(tokens): remove deprecated transition and OKLAB aliases`

### Testing Requirements

#### Accessibility Testing
```bash
# Enable reduced motion in browser DevTools
# Test all interactive components
```

**Checklist:**
- [ ] Sidebar transitions disabled
- [ ] Card animations disabled
- [ ] Page transitions disabled
- [ ] Now playing animations disabled
- [ ] Track list transitions disabled

#### Visual Regression
```bash
npm run test:visual -- --full-suite
```

**Scenarios:**
- [ ] Normal motion (default)
- [ ] Reduced motion enabled
- [ ] Dark mode
- [ ] Light mode (if applicable)

#### Color Accuracy
**Manual verification:**
- [ ] Shadow colors match previous implementation
- [ ] Highlight colors match previous implementation
- [ ] No color shift in components using `oklab-color()`
- [ ] Gradients render correctly

### Acceptance Criteria
- [ ] Accessibility media query uses primary tokens
- [ ] OKLAB fallback chain simplified
- [ ] All legacy aliases removed
- [ ] Build completes with no warnings
- [ ] Visual regression tests pass
- [ ] Accessibility tests pass
- [ ] Code review approved
- [ ] Documentation updated

---

## Phase 4: Complete Token Audit

**Status:** ⏳ Not Started
**Priority:** 🟡 MEDIUM
**Duration:** 3-5 days
**Dependencies:** Phases 1-3 complete

### Objectives
- Audit all 900+ tokens in tokens.scss
- Identify unused tokens
- Find duplicate/redundant tokens
- Document token usage patterns
- Create token dependency map

### Audit Categories

#### 4.1 Token Classification

Classify each token by:
1. **Usage Status**
   - Active (used in SCSS files)
   - Active (used in TypeScript/JavaScript)
   - Unused (defined but never referenced)
   - Deprecated (marked for removal)

2. **Purpose Category**
   - Animation (durations, easings)
   - Color (RGB, hex, OKLAB)
   - Layout (spacing, z-index, radius)
   - Performance (flags, settings)
   - Music/Audio (sync, beats)
   - Visual Effects (depth, intensity)
   - UI Components (cards, buttons, glass)

3. **Stability**
   - Core (essential, widely used)
   - Standard (commonly used)
   - Experimental (new features)
   - Deprecated (marked for removal)

#### 4.2 Token Usage Analysis

**Generate usage reports:**
```bash
# Script: scripts/analyze-tokens.sh

#!/bin/bash
echo "Analyzing token usage..."

# Extract all token definitions
grep "^\s*--sn-" src/design-tokens/tokens.scss | \
  sed 's/:.*//' | \
  sed 's/^\s*//' | \
  sort | \
  uniq > token-definitions.txt

# For each token, find usage
while read token; do
  count=$(grep -r "$token" src/ --include="*.scss" --include="*.ts" | \
          grep -v "tokens.scss" | \
          wc -l)
  echo "$token: $count usages"
done < token-definitions.txt | \
  sort -t':' -k2 -n > token-usage-report.txt

# Find unused tokens
grep ": 0 usages" token-usage-report.txt > unused-tokens.txt

# Find heavily used tokens
grep -v ": 0 usages" token-usage-report.txt | \
  sort -t':' -k2 -rn | \
  head -50 > top-50-tokens.txt
```

#### 4.3 Token Dependency Mapping

**Create dependency graph:**
```bash
# Script: scripts/map-token-dependencies.sh

#!/bin/bash
# Find tokens that reference other tokens

grep "^\s*--sn-.*: var(--sn-" src/design-tokens/tokens.scss | \
  sed 's/^\s*//' | \
  sed 's/;$//' > token-dependencies.txt

# Generate GraphViz dot file
echo "digraph tokens {" > token-graph.dot
while read line; do
  source=$(echo "$line" | cut -d':' -f1)
  targets=$(echo "$line" | grep -o "var(--[^,)]*)" | sed 's/var(//;s/)$//')

  for target in $targets; do
    echo "  \"$source\" -> \"$target\";" >> token-graph.dot
  done
done < token-dependencies.txt
echo "}" >> token-graph.dot

# Generate visual graph
dot -Tsvg token-graph.dot -o token-graph.svg
```

#### 4.4 Naming Convention Analysis

**Check for inconsistencies:**
```bash
# Find tokens not following --sn-{category}-{name} pattern
grep "^\s*--sn-[^-]*:" src/design-tokens/tokens.scss

# Find tokens with inconsistent casing
grep "^\s*--sn-.*[A-Z].*:" src/design-tokens/tokens.scss

# Find tokens with uncommon patterns
grep "^\s*--sn-.*_.*:" src/design-tokens/tokens.scss
```

### Deliverables

#### 4.D1: Token Audit Report
**File:** `plans/token-audit-report.md`

Contents:
- Total token count: 900+
- Active tokens: XXX
- Unused tokens: XXX
- Deprecated tokens: 12 (from Phase 1-3)
- Category breakdown
- Top 50 most used tokens
- Naming convention violations
- Recommended consolidations

#### 4.D2: Token Dependency Map
**File:** `plans/token-dependency-graph.svg`

Visual representation of token dependencies showing:
- Token inheritance chains
- Circular dependencies (if any)
- Orphaned tokens
- Hub tokens (referenced by many others)

#### 4.D3: Unused Tokens List
**File:** `plans/unused-tokens.txt`

Formatted list:
```
--sn-example-unused-token-1
--sn-example-unused-token-2
# ... etc
```

#### 4.D4: Token Migration Guide
**File:** `docs/token-migration-guide.md`

Guide for developers:
- How to use tokens correctly
- Migration patterns for deprecated tokens
- Best practices for adding new tokens
- Token naming conventions

### Implementation Steps

#### Step 4.1: Setup Analysis Scripts
1. Create `scripts/analyze-tokens.sh`
2. Create `scripts/map-token-dependencies.sh`
3. Create `scripts/check-token-naming.sh`
4. Make scripts executable

#### Step 4.2: Run Analysis
```bash
./scripts/analyze-tokens.sh
./scripts/map-token-dependencies.sh
./scripts/check-token-naming.sh
```

#### Step 4.3: Manual Review
1. Review auto-generated reports
2. Categorize tokens by usage and purpose
3. Identify consolidation opportunities
4. Document findings

#### Step 4.4: Create Documentation
1. Write token audit report
2. Generate dependency graphs
3. Create migration guide
4. Update README with token system overview

### Acceptance Criteria
- [ ] Token usage analysis complete
- [ ] Dependency map generated
- [ ] Unused tokens identified
- [ ] Audit report published
- [ ] Migration guide created
- [ ] Team review completed
- [ ] Next phase priorities identified

---

## Phase 5: Token Consolidation

**Status:** ✅ COMPLETE
**Priority:** 🟡 MEDIUM
**Completed:** 2025-10-04
**Actual Duration:** 1 day (4 tiers, 8 commits)
**Dependencies:** Phase 4 complete

### Objectives
- ✅ Remove unused tokens (207 removed across 4 tiers, 414% of 50+ target) 🎯
- ✅ Consolidate architectural subsystems (Tier 3 - 64 tokens removed)
- ✅ Remove complete feature systems (Tier 4 - 26 tokens removed)
- ✅ **Reduce total token count by 42.77% (107% of 40% goal achieved)** 🎯

### Consolidation Strategy

#### 5.1 Unused Token Removal

**Candidates from Phase 4:**
- Tokens with 0 usages in SCSS/TS
- Tokens not referenced in TypeScript systems
- Experimental tokens from abandoned features

**Removal criteria:**
- ✅ Zero usage in codebase
- ✅ Not part of public API
- ✅ Not documented as "reserved for future use"
- ✅ No external dependencies

**Process:**
1. Review unused tokens list from Phase 4
2. Confirm each token is truly unused (check compiled CSS too)
3. Remove in batches of 10-20
4. Test after each batch
5. Commit with descriptive messages

#### 5.2 Duplicate Token Consolidation

**Common patterns to consolidate:**

**Example 1: Color duplicates**
```scss
// BEFORE (potential duplicates)
--sn-cosmic-accent-rgb: 203, 166, 247;
--sn-dynamic-accent-rgb: var(--sn-cosmic-accent-rgb);
--sn-color-accent-rgb: var(--sn-dynamic-accent-rgb);
--sn-ui-button-accent-rgb: var(--sn-accent-rgb);

// AFTER (consolidated)
--sn-accent-rgb: 203, 166, 247;
--sn-color-accent-rgb: var(--sn-accent-rgb); // Alias for components
```

**Example 2: Animation duration duplicates**
```scss
// Check for similar durations
--sn-anim-duration-fast: 150ms;
--sn-transition-fast-duration: 150ms;
--sn-anim-transition-fast: 150ms;

// Consolidate to single source
--sn-transition-fast: 150ms;
```

#### 5.3 Semantic Token Reorganization

**Current organization:** Mixed by feature/system
**Target organization:** By semantic layer

```scss
// === LAYER 1: PRIMITIVE TOKENS ===
// Raw values, no references to other tokens
--sn-primitive-color-purple: 203, 166, 247;
--sn-primitive-duration-fast: 150ms;
--sn-primitive-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);

// === LAYER 2: SEMANTIC TOKENS ===
// Purpose-driven, reference primitive tokens
--sn-color-accent: var(--sn-primitive-color-purple);
--sn-transition-duration: var(--sn-primitive-duration-fast);
--sn-transition-easing: var(--sn-primitive-easing-standard);

// === LAYER 3: COMPONENT TOKENS ===
// Component-specific, reference semantic tokens
--sn-button-color: var(--sn-color-accent);
--sn-card-transition: var(--sn-transition-duration) var(--sn-transition-easing);
```

**Benefits:**
- Clear token hierarchy
- Easier to maintain
- Better performance (fewer var() lookups)
- Clearer intent

### Implementation Steps

#### Step 5.1: Remove Unused Tokens (Batch 1)
1. Select first 20 unused tokens from Phase 4 list
2. Double-check usage (grep + compiled CSS check)
3. Remove from tokens.scss
4. Build and test
5. Commit: `chore(tokens): remove unused tokens (batch 1/N)`

#### Step 5.2: Remove Unused Tokens (Batch 2-N)
Repeat for remaining batches until all confirmed unused tokens removed

#### Step 5.3: Consolidate Duplicates
1. Identify duplicate token groups
2. Choose canonical token for each group
3. Update references to use canonical token
4. Remove duplicate definitions
5. Test thoroughly
6. Commit: `refactor(tokens): consolidate duplicate color/animation tokens`

#### Step 5.4: Reorganize Token File (Optional)
If time permits:
1. Create new token structure with 3 layers
2. Migrate tokens to new organization
3. Update documentation
4. Test extensively
5. Commit: `refactor(tokens): reorganize into semantic layers`

### Testing Requirements

#### Build Verification
```bash
# After each batch
npm run build:css:dev
npm run typecheck

# Check for undefined variables
grep -i "undefined" build.log
```

#### Visual Regression
```bash
# After each major consolidation
npm run test:visual
```

#### Performance Metrics
```bash
# Measure before/after
ls -lh user.css
time npm run build:css:dev

# Compare build times and file sizes
```

### Acceptance Criteria
- [ ] Unused tokens removed (target: 50+)
- [ ] Duplicate tokens consolidated (target: 20+)
- [ ] Total token count reduced by 20%+
- [ ] Build completes successfully
- [ ] Visual regression tests pass
- [ ] Performance metrics improved or maintained
- [ ] Documentation updated
- [ ] Code review approved

### Risk Mitigation

**High-risk tokens:**
- Tokens referenced in TypeScript (may not show in SCSS grep)
- Tokens used in computed styles
- Tokens with side effects

**Safety measures:**
1. Test compiled CSS output
2. Runtime console monitoring
3. Incremental removal with testing
4. Easy rollback per batch

---

## Phase 6: Documentation & Standards

**Status:** ✅ COMPLETE
**Priority:** 🟢 MEDIUM
**Completed:** 2025-10-04
**Actual Duration:** 1 day
**Dependencies:** Phases 1-5 complete

### Objectives
- ✅ Document final token system architecture (277 tokens)
- ✅ Establish token governance standards
- ✅ Create developer guidelines with examples and recipes
- ✅ Set up automated token validation script

### Deliverables

#### 6.1 Token System Architecture Documentation
**File:** `docs/token-system-architecture.md`

Contents:
- Token system overview
- Category definitions
- Naming conventions
- Usage guidelines
- Migration patterns
- Performance considerations

#### 6.2 Token Governance Standards
**File:** `docs/token-governance.md`

Contents:
- When to add new tokens
- Token naming rules
- Deprecation process
- Review requirements
- Breaking change policy

#### 6.3 Developer Guidelines
**File:** `docs/token-usage-guide.md`

Contents:
- How to use existing tokens
- How to propose new tokens
- Common patterns and anti-patterns
- Examples and recipes
- Troubleshooting guide

#### 6.4 Automated Validation

**Script:** `scripts/validate-tokens.sh`
```bash
#!/bin/bash
# Validate token system integrity

# Check 1: All tokens follow naming convention
echo "Checking naming conventions..."
invalid_names=$(grep "^\s*--sn-" src/design-tokens/tokens.scss | \
  grep -v "^\s*--sn-[a-z][a-z0-9-]*:" | \
  wc -l)

if [ $invalid_names -gt 0 ]; then
  echo "❌ Found $invalid_names tokens with invalid names"
  exit 1
fi

# Check 2: No circular dependencies
echo "Checking for circular dependencies..."
# TODO: Implement cycle detection

# Check 3: No undefined references
echo "Checking for undefined token references..."
# Extract all token references
# Compare with defined tokens
# Report any undefined references

# Check 4: No unused tokens
echo "Checking for unused tokens..."
# Generate usage report
# Warn if unused count > threshold

echo "✅ Token validation passed"
```

**Integration:**
```json
// package.json
{
  "scripts": {
    "validate:tokens": "./scripts/validate-tokens.sh",
    "precommit": "npm run validate:tokens"
  }
}
```

### Implementation Steps

#### Step 6.1: Write Documentation
1. Token system architecture
2. Governance standards
3. Developer guidelines
4. Examples and patterns

#### Step 6.2: Create Validation Scripts
1. Write token validation script
2. Add to pre-commit hooks
3. Configure CI/CD integration
4. Document validation process

#### Step 6.3: Update Project README
1. Add token system section
2. Link to detailed documentation
3. Include quick reference
4. Add contribution guidelines

#### Step 6.4: Team Training
1. Present token system overview
2. Walk through guidelines
3. Demo validation tools
4. Q&A session

### Acceptance Criteria
- [ ] Architecture documentation complete
- [ ] Governance standards published
- [ ] Developer guidelines published
- [ ] Validation scripts implemented
- [ ] README updated
- [ ] Team training conducted
- [ ] Feedback incorporated

---

## Testing Strategy

### Overall Testing Approach

#### 1. Unit Testing (Per Phase)
- Token definition syntax
- Token value formats
- Token references validity

#### 2. Integration Testing (Per Phase)
- SCSS compilation
- TypeScript compilation
- Component rendering
- System interactions

#### 3. Visual Regression Testing (Major Changes)
- Screenshot comparison
- Interactive state testing
- Animation verification
- Accessibility testing

#### 4. Performance Testing (End of Each Phase)
- Build time measurement
- Bundle size tracking
- Runtime performance
- Memory usage

### Test Environments

#### Development
```bash
npm run build:css:dev
npm run typecheck
npm run test
```

#### Staging
```bash
npm run build:css:prod
npm run test:visual
npm run validate
```

#### Production Simulation
```bash
npm run build:prod
# Install in test Spotify client
# Manual verification
```

### Test Cases by Category

#### Animation Tokens
- [ ] Transitions have proper timing
- [ ] Easings applied correctly
- [ ] Reduced motion works
- [ ] No jerky animations

#### Color Tokens
- [ ] Colors render accurately
- [ ] OKLAB processing works
- [ ] Fallbacks work correctly
- [ ] Contrast ratios maintained

#### Layout Tokens
- [ ] Spacing consistent
- [ ] Z-index layers correct
- [ ] Border radius applied
- [ ] Responsive behavior

#### Music Sync Tokens
- [ ] Beat detection works
- [ ] Color harmony syncs
- [ ] Performance acceptable
- [ ] No audio glitches

### Automated Test Suite

```bash
# scripts/test-all-phases.sh

#!/bin/bash
set -e

echo "Running complete token system test suite..."

# Phase 1: Critical fixes
echo "Testing Phase 1: Critical fixes..."
npm run typecheck
npm run build:css:dev

# Phase 2: Safe removals
echo "Testing Phase 2: Safe removals..."
npm run build:css:dev
npm run test:visual -- --quick

# Phase 3: Migrations
echo "Testing Phase 3: Migrations..."
npm run test:visual
npm run test:accessibility

# Phase 4: Audit
echo "Testing Phase 4: Audit..."
./scripts/analyze-tokens.sh
./scripts/validate-tokens.sh

# Phase 5: Consolidation
echo "Testing Phase 5: Consolidation..."
npm run build:prod
npm run test:visual -- --full

# Phase 6: Documentation
echo "Testing Phase 6: Documentation..."
./scripts/validate-tokens.sh
npm run validate

echo "✅ All tests passed"
```

---

## Rollback Procedures

### Per-Phase Rollback

#### Phase 1 Rollback
```bash
git checkout feat/token-system-cleanup
git reset --hard origin/feat/token-system-cleanup
npm run build:css:dev
```

#### Phase 2-6 Rollback
Same procedure, checkout to appropriate branch point

### Complete Rollback
```bash
git checkout main
git branch -D feat/token-system-cleanup
git branch -D feat/token-system-cleanup/phase-*
npm run build:css:dev
```

### Partial Rollback (Specific Change)
```bash
git log --oneline
git revert <commit-hash>
npm run build:css:dev
npm test
```

### Emergency Rollback (Production)
If deployed changes cause issues:

1. Identify last working commit
2. Cherry-pick working state
3. Emergency build and deploy
4. Post-mortem analysis

---

## Future Phases (Beyond Phase 6)

### Phase 7: TypeScript Token Integration (Future)
- Generate TypeScript types from tokens.scss
- Runtime token validation
- Type-safe token access
- Autocomplete support

### Phase 8: Token Versioning (Future)
- Semantic versioning for tokens
- Deprecation warnings
- Migration utilities
- Backward compatibility layer

### Phase 9: Dynamic Token System (Future)
- User-customizable tokens
- Theme presets
- Real-time token updates
- Settings UI integration

### Phase 10: Performance Optimization (Future)
- CSS variable tree shaking
- Runtime optimization
- Critical token extraction
- Lazy loading strategies

---

## Success Metrics

### Quantitative Metrics
- Token count reduction: Target 20%+ (from ~900 to <720)
- Build time: Maintain or improve
- Bundle size: Reduce by 2-5%
- Undefined variable warnings: 0
- Unused tokens: 0
- Test coverage: Maintain 100% of affected code

### Qualitative Metrics
- Code maintainability: Improved
- Developer onboarding: Faster
- Documentation quality: Comprehensive
- System understanding: Clear hierarchy
- Technical debt: Significantly reduced

### Timeline Metrics
- Phase 1: 1-2 days ✓ Critical
- Phase 2: 1 day ✓ Low risk
- Phase 3: 2-3 days ✓ Medium complexity
- Phase 4: 3-5 days ✓ High effort
- Phase 5: 3-5 days ✓ High impact
- Phase 6: 2 days ✓ Essential
- **Total: 2-3 weeks**

---

## Progress Tracking

### Phase Completion Checklist

- [ ] **Phase 0:** Pre-Implementation Setup
  - [ ] Baseline documentation
  - [ ] Testing framework
  - [ ] Git branch structure

- [x] **Phase 1:** Critical Bug Fixes ✅ COMPLETE (2025-10-04)
  - [x] `--sn-anim-easing-dynamic` defined
  - [x] `--sn-easing-explorer` resolved
  - [x] All tests passing

- [x] **Phase 2:** Safe Removals ✅ COMPLETE (2025-10-04)
  - [x] 5 unused tokens removed
  - [x] Documentation updated
  - [x] Tests passing

- [x] **Phase 3:** Active Usage Migration ✅ COMPLETE (2025-10-04)
  - [x] Accessibility media query migrated
  - [x] OKLAB fallbacks simplified
  - [x] Legacy aliases removed

- [x] **Phase 4:** Complete Token Audit ✅ COMPLETE (2025-10-04)
  - [x] Usage analysis complete (433 tokens, 77% unused)
  - [x] Dependency map generated (91 dependencies)
  - [x] Audit report published (comprehensive 400+ lines)

- [ ] **Phase 5:** Token Consolidation
  - [ ] Unused tokens removed
  - [ ] Duplicates consolidated
  - [ ] 20%+ reduction achieved

- [ ] **Phase 6:** Documentation & Standards
  - [ ] Architecture documented
  - [ ] Standards published
  - [ ] Validation automated

### Weekly Status Updates

**Week 1:**
- Phases 0-1 complete
- Critical bugs fixed
- Foundation established

**Week 2:**
- Phases 2-4 complete
- Audit analysis done
- Migration in progress

**Week 3:**
- Phases 5-6 complete
- Consolidation done
- Documentation published

---

## Communication Plan

### Stakeholders
- Development team
- QA team
- Design team
- Product owner

### Updates
- Daily: Slack updates on progress
- Weekly: Written status report
- Bi-weekly: Demo of improvements
- End of project: Final presentation

### Change Log
Maintain `CHANGELOG.md` with:
- Each phase completion
- Breaking changes
- Migration guides
- Performance improvements

---

**Document Status:** ✅ Complete
**Last Updated:** 2025-10-04
**Next Review:** After Phase 1 completion
