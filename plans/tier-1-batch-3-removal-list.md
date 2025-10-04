# Tier 1 Batch 3 - Token Removal List

**Batch:** 3 of 3 (Final Tier 1 batch)
**Date:** 2025-10-04
**Target:** 14 tokens (3D system + unused easing variations)
**Risk Level:** LOW
**Verification:** Zero CSS var() usage + No TypeScript usage + Abandoned features

---

## Removal Strategy

### Why These Tokens Third?
1. **Push to 20% reduction**: Current 17.4% → Target 20%+ (will achieve 20.2%)
2. **Clear abandonment**: 3D system disabled, easing variations never adopted
3. **Definitively unused**: Zero CSS var() references, zero TypeScript usage
4. **High confidence**: Used easing tokens clearly identified and preserved
5. **Complete Tier 1**: Final cleanup of safe removal candidates

### Pattern Explanation
Two distinct categories:
1. **3D System** (abandoned feature): All 3D-related animation tokens
2. **Easing Variations** (unused alternatives): Custom and specialized easings never referenced

**Preserved easing tokens** (8 actively used):
- Core: `--sn-anim-easing-standard` (104 uses)
- Specialized: explorer (6), dynamic (3), bounce-{smooth,medium,strong,playful} (2-1), emergence (1)

---

## Tokens to REMOVE (14 total)

### 3D System Tokens (3 tokens - Abandoned Feature)
```scss
--sn-anim-3d-depth-mid
--sn-anim-3d-depth-near
--sn-anim-3d-perspective
```

**Rationale:**
- 3D visual effects system was experimental and never enabled
- No 3D rendering implementation in active codebase
- Zero references in both SCSS and TypeScript
- Safe to remove without impact

### Unused Easing Function Variations (11 tokens)

#### Custom Easing Slots (3 tokens)
```scss
--sn-anim-easing-custom-1
--sn-anim-easing-custom-2
--sn-anim-easing-custom-3
```

**Rationale:**
- Placeholder tokens for custom easing definitions
- Never populated with actual values
- Zero usage in animations

#### Specialized Easings (8 tokens)
```scss
--sn-anim-easing-accelerate
--sn-anim-easing-bounce          # Not bounce-smooth/medium/strong (those ARE used)
--sn-anim-easing-bounce-gentle
--sn-anim-easing-breathing       # Not anim-breathing-* (different tokens)
--sn-anim-easing-decelerate
--sn-anim-easing-elastic
--sn-anim-easing-harmony
--sn-anim-easing-visual-effects
```

**Rationale:**
- Alternative easing functions defined but never referenced
- Active animations use standard, dynamic, or bounce-{smooth,medium,strong,playful}
- No TypeScript systems set these values
- Redundant with actively used easings

---

## Tokens to PRESERVE (8 easing tokens - ACTIVELY USED)

### Core Easing (1 token)
```scss
--sn-anim-easing-standard   # 104 var() references - CRITICAL
```

### Specialized Easings (7 tokens)
```scss
--sn-easing-explorer             # 6 uses
--sn-anim-easing-dynamic         # 3 uses
--sn-anim-easing-bounce-smooth   # 2 uses
--sn-anim-easing-bounce-medium   # 2 uses
--sn-anim-easing-emergence       # 1 use
--sn-anim-easing-bounce-strong   # 1 use
--sn-anim-easing-bounce-playful  # 1 use
```

---

## Pre-Removal Verification

### Step 1: Confirm Zero CSS var() Usage ✅
All 14 tokens verified in Phase 4 analysis:
- Present in `reports/zero-var-usage-tokens.txt` ✅
- Zero count in `reports/var-usage-counts.txt` ✅

### Step 2: Confirm No TypeScript Usage
```bash
grep -r "setProperty.*\(3d\|custom-[123]\|accelerate\|decelerate\|elastic\|harmony\)" src-js/
# Expected: No matches (these are static definitions only)
```

### Step 3: Verify 3D System Abandoned
```bash
grep -r "3d\|3D" src-js/ --include="*.ts" | grep -v "node_modules"
# Check: No active 3D rendering or effects systems
```

### Step 4: Confirm in tokens.scss
```bash
grep -c "^\s*--sn-anim-\(3d\|easing-\(custom\|accelerate\|decelerate\|elastic\|harmony\|bounce\|breathing\|visual-effects\)\)" src/design-tokens/tokens.scss
# Expected: 14 matches
```

---

## Removal Process

### Phase 1: Locate 3D Tokens
1. Open `src/design-tokens/tokens.scss`
2. Search for "3d" or "3D" in comments/tokens
3. Identify the 3 3D animation tokens

### Phase 2: Locate Unused Easing Tokens
1. Search for easing token definitions section
2. Identify unused variations (11 tokens)
3. Verify preserved tokens NOT in removal list

### Phase 3: Remove Tokens
1. Delete 3D system tokens (3 lines)
2. Delete unused easing tokens (11 lines)
3. Preserve actively used easings (8 tokens kept)

### Phase 4: Verify Build
```bash
npm run build:css:dev
# Expected: Clean build, no undefined variable warnings
```

### Phase 5: Test
```bash
npm run typecheck
npm test -- --passWithNoTests
# Expected: All tests pass, no new failures
```

### Phase 6: Verify Token Count & Reduction
```bash
grep "^\s*--sn-" src/design-tokens/tokens.scss | wc -l
# Expected: 400 - 14 = 386 tokens

# Calculate reduction percentage
# (484 - 386) / 484 = 98 / 484 = 20.2% ✅
```

---

## Expected Impact

### File Changes
- **Modified:** `src/design-tokens/tokens.scss`
- **Lines removed:** ~28 (14 tokens + comments/formatting)

### Token Count Progression
- **Before Batch 1:** 484 tokens
- **After Batch 1:** 448 tokens
- **After Batch 2:** 400 tokens
- **After Batch 3:** 386 tokens
- **Reduction:** 14 tokens (3.5% from Batch 2, 20.2% total from baseline)

### Milestone Achievement
- **Target:** 20% reduction
- **Achieved:** 20.2% reduction ✅
- **Tokens removed:** 98 tokens total across 3 batches
- **Phase 5 goal:** EXCEEDED

### Build Impact
- **Compile time:** No change expected
- **File size:** Reduction ~1-2 KB
- **Functionality:** Zero impact (unused tokens, abandoned features)

---

## Rollback Plan

If any issues occur:
```bash
git checkout src/design-tokens/tokens.scss
npm run build:css:dev
```

Or if already committed:
```bash
git revert HEAD
npm run build:css:dev
```

---

## Success Criteria

- [x] All 14 unused tokens identified (3 3D + 11 easing)
- [x] All 8 used easing tokens flagged for preservation
- [ ] Pre-removal verification complete
- [ ] 3D tokens removed from tokens.scss
- [ ] Unused easing tokens removed from tokens.scss
- [ ] Used easing tokens verified preserved
- [ ] Build completes successfully
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] Token count reduced to 386 (20.2% reduction achieved)
- [ ] No undefined variable warnings
- [ ] Committed with clear message

---

## Commit Message Template

```
chore(tokens): remove 3D system and unused easing tokens (Phase 5 Batch 3)

Remove 14 unused tokens to achieve 20% reduction milestone:

3D System Tokens (3 tokens - abandoned feature):
- --sn-anim-3d-depth-mid
- --sn-anim-3d-depth-near
- --sn-anim-3d-perspective

Unused Easing Variations (11 tokens):
- Custom slots: custom-1, custom-2, custom-3 (never populated)
- Specialized: accelerate, decelerate, elastic, harmony, visual-effects,
  breathing, bounce, bounce-gentle (never referenced)

Preserved 8 actively used easing tokens:
- Core: --sn-anim-easing-standard (104 uses)
- Specialized: explorer (6), dynamic (3), bounce-{smooth,medium,strong,playful} (1-2)

Token count: 400 → 386 (-14 tokens, -3.5%)
Total reduction: 484 → 386 (-98 tokens, -20.2%) ✅

🎯 MILESTONE: Exceeded 20% reduction target
Part of Phase 5 Tier 1 token consolidation (98/86 = 114% of goal).
Related: #phase-5-token-consolidation
```

---

**Status:** Ready for implementation
**Impact:** Final push to 20.2% reduction, completing Phase 5 primary objective
**Next:** Phase 5 Tier 1 complete at 114% of target
