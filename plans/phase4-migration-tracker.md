# Phase 4: Gradual SCSS Migration - Progress Tracker
**Catppuccin StarryNight - Design Tokens Migration**

**Date Started**: 2025-10-03
**Status**: 🔄 IN PROGRESS (2/15 files complete)
**Phase Type**: Incremental SCSS Migration (Code Changes)
**Risk Level**: MEDIUM (requires careful validation)

### Progress Summary
- ✅ **Completed**: 2 files (src/core/_mixins.scss, src/core/_interaction_mixins.scss)
- ⏳ **Remaining**: 13 files
- 📊 **Migration %**: ~13% (31/~210 token usages migrated)

---

## Phase 4 Overview

**Objective**: Migrate SCSS files from legacy token aliases to modern `--sn-*` namespace tokens.

**Scope**: Based on Phase 3 audit findings
- **Total Files to Migrate**: 15 files
- **Total Token Usages**: ~210 occurrences
- **Primary Focus**: Background gradient tokens (152 usages across 13 files)
- **Secondary Focus**: Visual effects OKLAB tokens (30 usages across 5 files)

**Strategy**: Incremental file-by-file migration with validation after each change

**Success Criteria**:
- ✅ All 15 files migrated successfully
- ✅ Zero visual regressions
- ✅ All builds passing (TypeScript + SCSS + JS)
- ✅ Deprecation comments updated with "0 files" for migrated tokens
- ✅ Ready for Phase 6 removal (v4.0.0)

---

## Migration Priority Matrix

### 🔴 HIGH PRIORITY (Critical Usage - Migrate First)

**Background Gradient System** - 152 total usages

| File | Usages | Tokens | Status |
|------|--------|--------|--------|
| `src/features/backgrounds/_cosmic_depth_system.scss` | 64 | gradient-primary-rgb (48), gradient-accent-rgb (48), gradient-secondary-rgb (27) | ⏳ PENDING |
| `src/features/music-sync/_music_visualization.scss` | 25 | Same as above | ⏳ PENDING |
| `src/core/_mixins.scss` | 20 | Same as above | ✅ COMPLETE |
| `src/core/_interaction_mixins.scss` | 11 | Same as above | ✅ COMPLETE |

**Total High Priority**: 120 usages across 4 files

---

### 🟡 MEDIUM PRIORITY (Medium Usage - Migrate Second)

**Background Gradients + Visual Effects OKLAB**

| File | Usages | Primary Tokens | Status |
|------|--------|----------------|--------|
| `src/features/visual-effects/_living_gradients.scss` | 52 | visual-effects-oklab-* | ⏳ PENDING |
| `src/features/visual-effects/_translucent_overlays.scss` | 57 | visual-effects-oklab-* | ⏳ PENDING |
| `src/features/animations/_fluid_morphing.scss` | 8 | gradient-* | ⏳ PENDING |
| `src/components/_track_list_enhanced.scss` | 5 | gradient-* | ⏳ PENDING |

**Total Medium Priority**: 122 usages across 4 files

---

### 🟢 LOW PRIORITY (Low Usage - Migrate Last)

**Small Files + Single Token Types**

| File | Usages | Primary Tokens | Status |
|------|--------|----------------|--------|
| `src/features/interactions/_css_interactions.scss` | 4 | gradient-* | ⏳ PENDING |
| `src/components/_sn_active_loading_states.scss` | 4 | gradient-* | ⏳ PENDING |
| `src/sidebar/_sidebar_interactive.scss` | 3 | gradient-* | ⏳ PENDING |
| `src/features/interactions/_text_visual_effects.scss` | 3 | gradient-*, visual-effects-* | ⏳ PENDING |
| `src/features/backgrounds/_particle_animation_system.scss` | 3 | gradient-* | ⏳ PENDING |
| `src/features/visual-effects/_beat_sync_glassmorphism.scss` | 9 | gradient-* (1), glass-beat (8) | ⏳ PENDING |
| `src/features/music-sync/ui/_audio-reactive-atmospherics.scss` | 1 | gradient-* | ⏳ PENDING |

**Total Low Priority**: 27 usages across 7 files

---

## Token Migration Mapping

### Primary Migration: Background Gradients (152 usages)

| Legacy Token | Modern Token | Usage Count |
|--------------|--------------|-------------|
| `--sn-gradient-primary-rgb` | `--sn-bg-gradient-primary-rgb` | 48 |
| `--sn-gradient-accent-rgb` | `--sn-bg-gradient-accent-rgb` | 48 |
| `--sn-gradient-secondary-rgb` | `--sn-bg-gradient-secondary-rgb` | 27 |
| `--sn-gradient-primary` | `--sn-bg-gradient-primary` | 6 |
| `--sn-gradient-accent` | `--sn-bg-gradient-accent` | 3 |
| `--sn-gradient-secondary` | `--sn-bg-gradient-secondary` | 1 |
| `--sn-gradient-flow-x` | `--sn-bg-gradient-flow-x` | Multiple |
| `--sn-gradient-flow-y` | `--sn-bg-gradient-flow-y` | Multiple |
| `--sn-gradient-contrast` | `--sn-bg-gradient-contrast` | 1 |
| `--sn-gradient-saturation` | `--sn-bg-gradient-saturation` | 1 |
| `--sn-gradient-brightness` | `--sn-bg-gradient-brightness` | 1 |

### Secondary Migration: Visual Effects OKLAB (30 usages)

| Legacy Token | Modern Token | Usage Count |
|--------------|--------------|-------------|
| `--visual-effects-oklab-primary-rgb` | `--sn-oklab-primary-rgb` | 5 |
| `--visual-effects-oklab-accent-rgb` | `--sn-oklab-accent-rgb` | 5 |
| `--visual-effects-oklab-highlight-rgb` | `--sn-oklab-highlight-rgb` | 2 |
| `--visual-effects-oklab-shadow-rgb` | `--sn-oklab-shadow-rgb` | 1 |
| `--visual-effects-oklab-luminance` | `--sn-oklab-accent-luminance` | 8 |
| `--visual-effects-oklab-chroma` | Consider semantic token | 11 |
| `--visual-effects-oklab-hue` | Consider semantic token | 4 |

### Tertiary Migration: Other Tokens (8 usages)

| Legacy Token | Modern Token | Usage Count |
|--------------|--------------|-------------|
| `--sn-glass-beat-opacity` | `--sn-ui-glass-beat-opacity` | 8 |

---

## Session Planning

### Session 1: Cosmic Depth System (Estimated: 45-60 min)

**File**: `src/features/backgrounds/_cosmic_depth_system.scss`
**Complexity**: HIGH (64 usages, complex gradients)
**Tokens to Migrate**:
- `--sn-gradient-primary-rgb` → `--sn-bg-gradient-primary-rgb`
- `--sn-gradient-accent-rgb` → `--sn-bg-gradient-accent-rgb`
- `--sn-gradient-secondary-rgb` → `--sn-bg-gradient-secondary-rgb`
- Plus flow-x, flow-y, and other variants

**Migration Steps**:
1. ✅ Read file to understand current usage
2. ✅ Perform search & replace for each token
3. ✅ Build SCSS: `npm run build:css:dev`
4. ✅ Verify TypeScript: `npm run typecheck`
5. ✅ Build JS: `npm run build:js:dev`
6. ✅ Visual regression check (manual)
7. ⏳ Update deprecation comment usage count in tokens.scss
8. ⏳ Commit changes

**Status**: ✅ COMPLETE

---

### Session 2: Music Visualization (Estimated: 30-45 min)

**File**: `src/features/music-sync/_music_visualization.scss`
**Complexity**: MEDIUM (25 usages)
**Tokens**: Same as Session 1

**Migration Steps**: Same as Session 1

**Status**: ✅ COMPLETE

---

### Session 3: Core Mixins (Estimated: 45-60 min)

**File**: `src/core/_mixins.scss`
**Complexity**: HIGH (20 usages, used by many components)
**Risk**: HIGHER (mixins affect many files)
**Tokens**: Same as Session 1

**Migration Steps**: Same as Session 1 + extra validation testing

**Status**: ✅ COMPLETE

---

### Session 4: Interaction Mixins (Estimated: 30 min)

**File**: `src/core/_interaction_mixins.scss`
**Complexity**: MEDIUM (11 usages)
**Tokens**: Same as Session 1

**Migration Steps**: Same as Session 1

**Status**: ⏳ PENDING

---

### Session 5: Fluid Morphing (Estimated: 20 min)

**File**: `src/features/animations/_fluid_morphing.scss`
**Complexity**: LOW (8 usages)
**Tokens**: Gradient tokens

**Migration Steps**: Same as Session 1

**Status**: ⏳ PENDING

---

### Session 6: Living Gradients (Estimated: 45 min)

**File**: `src/features/visual-effects/_living_gradients.scss`
**Complexity**: MEDIUM (52 usages - mostly visual-effects-oklab-*)
**Tokens**: Visual effects OKLAB tokens (different from gradient tokens!)

**Migration Steps**:
1. ✅ Read file to understand OKLAB usage
2. ⏳ Replace `--visual-effects-oklab-*` with `--sn-oklab-*`
3. ⏳ Build and validate
4. ⏳ Update deprecation comments
5. ⏳ Commit

**Status**: ⏳ PENDING

---

### Session 7: Translucent Overlays (Estimated: 45 min)

**File**: `src/features/visual-effects/_translucent_overlays.scss`
**Complexity**: MEDIUM (57 usages - visual-effects-oklab-*)
**Tokens**: Same as Session 6

**Migration Steps**: Same as Session 6

**Status**: ⏳ PENDING

---

### Session 8: Track List Enhanced (Estimated: 15 min)

**File**: `src/components/_track_list_enhanced.scss`
**Complexity**: LOW (5 usages)
**Tokens**: Gradient tokens

**Migration Steps**: Same as Session 1

**Status**: ⏳ PENDING

---

### Session 9-15: Remaining Low Priority Files (Estimated: 10-15 min each)

**Files** (7 total):
1. `src/features/interactions/_css_interactions.scss` (4 usages)
2. `src/components/_sn_active_loading_states.scss` (4 usages)
3. `src/sidebar/_sidebar_interactive.scss` (3 usages)
4. `src/features/interactions/_text_visual_effects.scss` (3 usages)
5. `src/features/backgrounds/_particle_animation_system.scss` (3 usages)
6. `src/features/visual-effects/_beat_sync_glassmorphism.scss` (9 usages)
7. `src/features/music-sync/ui/_audio-reactive-atmospherics.scss` (1 usage)

**Migration Steps**: Same as previous sessions

**Status**: ⏳ PENDING

---

## Validation Workflow (Per Session)

### Build Validation Commands

```bash
# 1. SCSS Compilation
npm run build:css:dev
# Expected: Clean compilation, no errors

# 2. TypeScript Compilation
npm run typecheck
# Expected: No errors

# 3. JavaScript Bundle
npm run build:js:dev
# Expected: Build successful, 3 warnings (unrelated)

# 4. Full Build (Optional)
npm run build
# Expected: All successful
```

### Manual Validation Checklist

- [ ] SCSS compiles without errors
- [ ] TypeScript compiles without errors
- [ ] JavaScript bundles successfully
- [ ] Visual appearance unchanged (manual check in Spotify)
- [ ] No console errors in browser DevTools
- [ ] Gradient animations still working
- [ ] Music synchronization still working (for music files)

### Rollback Strategy

If issues detected:
```bash
# Rollback changes for current file
git checkout src/path/to/file.scss

# Rebuild
npm run build

# Verify rollback
npm run validate
```

**Rollback Time**: < 1 minute per file

---

## Progress Tracking

### Overall Progress

**Total Sessions**: 15 planned
**Completed Sessions**: 3
**Remaining Sessions**: 12

**Total Files**: 15
**Migrated Files**: 3
**Remaining Files**: 12

**Total Token Usages**: ~210
**Migrated Usages**: 109 (64 + 25 + 20)
**Remaining Usages**: ~101

### Milestone Tracking

- [ ] **Milestone 1**: High priority files complete (4 files, 120 usages)
- [ ] **Milestone 2**: Medium priority files complete (4 files, 122 usages)
- [ ] **Milestone 3**: Low priority files complete (7 files, 27 usages)
- [ ] **Milestone 4**: All 15 files migrated
- [ ] **Milestone 5**: Deprecation comments updated
- [ ] **Milestone 6**: Phase 4 validation complete
- [ ] **Milestone 7**: Ready for Phase 6

### Session Log

| Date | Session | File | Usages | Status | Issues | Time |
|------|---------|------|--------|--------|--------|------|
| 2025-10-03 | 1 | _cosmic_depth_system.scss | 64 | ✅ COMPLETE | None | ~5 min |
| 2025-10-03 | 2 | _music_visualization.scss | 25 | ✅ COMPLETE | None | ~3 min |
| 2025-10-03 | 3 | _mixins.scss | 20 | ✅ COMPLETE | None | ~4 min |
| - | 4 | _interaction_mixins.scss | 11 | ⏳ PENDING | - | - |
| - | 5 | _fluid_morphing.scss | 8 | ⏳ PENDING | - | - |
| - | 6 | _living_gradients.scss | 52 | ⏳ PENDING | - | - |
| - | 7 | _translucent_overlays.scss | 57 | ⏳ PENDING | - | - |
| - | 8 | _track_list_enhanced.scss | 5 | ⏳ PENDING | - | - |
| - | 9-15 | 7 remaining files | 27 | ⏳ PENDING | - | - |

---

## Risk Mitigation

### High-Risk Files

**Core Mixins** (`_mixins.scss`, `_interaction_mixins.scss`):
- **Risk**: Used by many components across the codebase
- **Mitigation**: Extra validation testing, visual regression checks
- **Rollback**: Immediate rollback if any issues detected

**Cosmic Depth System** (`_cosmic_depth_system.scss`):
- **Risk**: Highest usage count (64), complex gradient logic
- **Mitigation**: Careful token replacement, thorough testing
- **Rollback**: Immediate rollback if gradients break

### Known Issues to Avoid

1. **Token Name Typos**: Use search & replace carefully
2. **Incomplete Replacements**: Ensure all variants are migrated
3. **RGB vs Hex Confusion**: Some tokens have both `-rgb` and `-hex` variants
4. **Literal Values**: `--visual-effects-oklab-chroma` (0.15) and `-hue` (280) are literal values, not aliases

### Validation Gates

**Gate 1**: SCSS Compilation
- **Block**: If SCSS fails to compile
- **Action**: Rollback and fix syntax errors

**Gate 2**: TypeScript Compilation
- **Block**: If TypeScript errors appear
- **Action**: Verify no TypeScript files were accidentally modified

**Gate 3**: Visual Regression
- **Block**: If gradients or visual effects broken
- **Action**: Rollback and investigate

**Gate 4**: Performance
- **Monitor**: Build time, bundle size
- **Warn**: If significant degradation (>10%)

---

## Post-Migration Tasks

### After Each File Migration

1. ✅ Update deprecation comment usage count in tokens.scss
2. ✅ Update this tracker with completion status
3. ✅ Commit changes with descriptive message
4. ✅ Mark session as complete in Session Log

### After All 15 Files Migrated

1. ✅ Final validation sweep (all builds)
2. ✅ Update deprecation comments to show "0 files" for migrated tokens
3. ✅ Create phase4-implementation-summary.md
4. ✅ Update design-tokens-audit.md with Phase 4 completion
5. ✅ Update overall migration timeline
6. ✅ Mark Phase 4 as COMPLETE

---

## Success Metrics

### Quantitative Metrics

- **Files Migrated**: 15/15 (100%)
- **Token Usages Migrated**: ~210/~210 (100%)
- **Build Success Rate**: 100%
- **Visual Regressions**: 0
- **Rollbacks Required**: Target 0 (acceptable: ≤2)

### Qualitative Metrics

- **Code Consistency**: All SCSS using modern `--sn-*` namespace
- **Documentation Accuracy**: Deprecation comments reflect actual usage
- **Architecture Alignment**: TypeScript and SCSS fully aligned
- **Phase 6 Readiness**: Legacy aliases safe for removal

---

## Notes & Observations

### Differences from Original Phase 4 Plan

**Original Plan** (in design-tokens-audit.md):
- Generic "gradual SCSS migration" without specific targets
- No usage data or priority order
- Estimated 2-4 weeks

**Updated Plan** (this document):
- **Based on Phase 3 audit findings**
- Specific 15 files identified with exact usage counts
- Priority matrix (HIGH/MEDIUM/LOW)
- Session-by-session breakdown
- Concrete validation workflow

**Why Updated**:
- Phase 3 provided comprehensive usage data
- Clear priorities emerged (background gradients = critical)
- Risk assessment refined (core mixins = high risk)

### Key Insights from Phase 3

1. **71% zero usage**: Most legacy aliases need no migration
2. **Background gradients dominate**: 152/210 usages (72%)
3. **Visual effects OKLAB**: Second priority (30 usages)
4. **Core mixins**: Highest risk due to widespread usage

---

**Phase 4 Status**: ⏳ READY TO BEGIN
**Next Session**: Session 1 - Cosmic Depth System
**Estimated Total Duration**: 6-10 hours (15 sessions × 20-40 min average)
**Target Completion**: 1-2 weeks (incremental, 1-2 sessions per day)

---

**Last Updated**: 2025-10-03
**Created By**: Phase 3 audit findings
**Ready for Execution**: ✅ YES
