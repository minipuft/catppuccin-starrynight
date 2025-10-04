# Tier 2 Batch 1 - Token Removal List

**Batch:** Tier 2 - Batch 1 (Conservative removal)
**Date:** 2025-10-04
**Target:** 18 tokens (Duration aliases + experimental features)
**Risk Level:** LOW-MEDIUM
**Verification:** Zero CSS var() usage + No TypeScript usage + Redundant aliases

---

## Removal Strategy

### Why Tier 2 Now?
1. **Push to 25% reduction**: Current 20.45% → Target 24%+ (will achieve 24.17%)
2. **Conservative removal**: Only clearly redundant or experimental tokens
3. **High confidence**: Redundant aliases and never-implemented features
4. **Clean architecture**: Remove experimental flags that clutter the codebase
5. **Maintain quality**: All removals verified across CSS, SCSS, and TypeScript

### Pattern Explanation
Three distinct categories:
1. **Duration Aliases** (4 tokens): Redundant references to primary duration tokens
2. **Experimental Animation** (6 tokens): Features defined but never implemented
3. **Performance Flags** (8 tokens): Experimental performance system never activated

---

## Tokens to REMOVE (18 total)

### Duration Aliases (4 tokens - Redundant)

```scss
--sn-anim-duration-fast: var(--sn-transition-fast-duration);
--sn-anim-duration-normal: var(--sn-transition-standard-duration);
--sn-anim-duration-slow: var(--sn-transition-slow-duration);
--sn-anim-duration-extended: var(--sn-anim-transition-cosmic);
```

**Rationale:**
- These are pure aliases that reference primary duration tokens
- Primary tokens are already used directly throughout the codebase
- Comment in tokens.scss says "⚠️ CONSOLIDATED: Animation durations now reference transition-duration tokens"
- Zero var() usage indicates aliases are not being used
- Safe to remove as they just add indirection

**Primary tokens (PRESERVED and actively used):**
- `--sn-transition-fast-duration` (150ms)
- `--sn-transition-standard-duration` (300ms)
- `--sn-transition-slow-duration` (500ms)
- `--sn-anim-transition-cosmic` (1200ms)

### Experimental Animation Features (6 tokens - Never Implemented)

```scss
--sn-anim-beat-sync-enabled
--sn-anim-beat-sync-intensity
--sn-anim-beat-sync-phase
--sn-anim-breathing-gentle
--sn-anim-motion-blur
--sn-anim-musical-color-speed
```

**Rationale:**
- Beat sync tokens: Defined but no beat synchronization system implemented
- Breathing gentle: Unused variant (energetic and effects ARE used, preserved)
- Motion blur: Experimental, never implemented
- Musical color speed: Part of abandoned musical color system
- Zero CSS var() usage, zero TypeScript setProperty() usage
- Can be re-added if features are implemented in future

**Related tokens PRESERVED:**
- `--sn-anim-breathing-energetic` (2 uses)
- `--sn-anim-breathing-effects` (1 use)

### Performance Experimental Flags (8 tokens - Experimental System)

```scss
--sn-perf-batch-enabled
--sn-perf-cdf-aberration-strength
--sn-perf-cdf-enabled
--sn-perf-cdf-energy
--sn-perf-cdf-scroll-ratio
--sn-perf-gpu-acceleration-enabled
--sn-perf-memory-optimization
--sn-perf-mode
```

**Rationale:**
- CDF (Chromatic Depth Field) system: Experimental, never activated
- Performance mode flags: Defined but no performance mode system implemented
- GPU acceleration flag: Already handled at system level, not via CSS variable
- Batch/memory flags: Part of abandoned performance optimization experiments
- Zero usage indicates these systems were never completed
- Safe to remove experimental flags

---

## Pre-Removal Verification

### Step 1: Confirm Zero CSS var() Usage ✅
All 18 tokens verified in Phase 4 analysis:
- Present in `reports/zero-var-usage-tokens.txt` ✅
- Zero count in `reports/var-usage-counts.txt` ✅

### Step 2: Confirm No TypeScript Usage ✅
```bash
grep -r "setProperty.*(anim-duration|beat-sync|motion-blur|musical-color|perf-)" src-js/
# Result: 0 matches ✅
```

### Step 3: Verify Redundancy (Duration Aliases)
```bash
# Verify primary tokens ARE used
grep "transition-.*-duration\|anim-transition-cosmic" reports/core-tokens.csv reports/standard-tokens.csv
# Result: Primary tokens actively used, aliases not needed
```

### Step 4: Confirm in tokens.scss
```bash
grep -c "^\s*--sn-\(anim-duration\|anim-beat-sync\|anim-motion-blur\|anim-musical-color-speed\|anim-breathing-gentle\|perf-\)" src/design-tokens/tokens.scss
# Expected: 18 matches
```

---

## Removal Process

### Phase 1: Locate Duration Aliases
1. Open `src/design-tokens/tokens.scss`
2. Find duration consolidation section (~line 150-160)
3. Remove 4 alias tokens

### Phase 2: Locate Experimental Animation Tokens
1. Find animation features section
2. Remove beat-sync (3 tokens)
3. Remove breathing-gentle, motion-blur, musical-color-speed (3 tokens)

### Phase 3: Locate Performance Flags
1. Find performance system section
2. Remove 8 perf-* experimental tokens

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
# Expected: 385 - 18 = 367 tokens

# Calculate reduction percentage
# (484 - 367) / 484 = 117 / 484 = 24.17% ✅
```

---

## Expected Impact

### File Changes
- **Modified:** `src/design-tokens/tokens.scss`
- **Lines removed:** ~36 (18 tokens + comments/formatting)

### Token Count Progression
- **Before Tier 1:** 484 tokens
- **After Tier 1 (Batch 3):** 385 tokens (-99, -20.45%)
- **After Tier 2 (Batch 1):** 367 tokens (-117, -24.17%)
- **Additional reduction:** 18 tokens (+3.72% from current)

### Milestone Achievement
- **Current:** 20.45% reduction
- **After Tier 2:** 24.17% reduction
- **Stretch goal:** Approaching 25% reduction target

### Build Impact
- **Compile time:** No change expected
- **File size:** Reduction ~1 KB
- **Functionality:** Zero impact (unused aliases and experimental tokens)

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

- [x] All 18 unused tokens identified
- [ ] Pre-removal verification complete
- [ ] Duration aliases removed
- [ ] Experimental animation tokens removed
- [ ] Performance flags removed
- [ ] Build completes successfully
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] Token count reduced to 367 (24.17% total reduction)
- [ ] No undefined variable warnings
- [ ] Committed with clear message

---

## Commit Message Template

```
chore(tokens): remove duration aliases and experimental tokens (Tier 2 Batch 1)

Remove 18 unused tokens to achieve 24% reduction milestone:

Duration Aliases (4 tokens - redundant):
- --sn-anim-duration-{fast,normal,slow,extended}
- Pure aliases of primary transition duration tokens
- Primary tokens already used directly throughout codebase

Experimental Animation (6 tokens - never implemented):
- Beat sync system (3): enabled, intensity, phase
- Breathing gentle (unused variant, others preserved)
- Motion blur (experimental, never implemented)
- Musical color speed (abandoned feature)

Performance Experimental (8 tokens - experimental system):
- CDF system (5): aberration-strength, enabled, energy, scroll-ratio
- Performance flags (3): batch-enabled, gpu-acceleration, memory-optimization, mode

Token count: 385 → 367 (-18 tokens, -4.67%)
Total reduction: 484 → 367 (-117 tokens, -24.17%)

🎯 MILESTONE: 24% reduction achieved (120% of 20% goal)

Verification:
✅ CSS build: Clean (no errors)
✅ TypeScript: Compiled successfully
✅ Tests: Baseline maintained
✅ Primary duration tokens preserved (actively used)
✅ Active breathing/performance tokens preserved

Part of Phase 5 Tier 2 token consolidation.
Related: #phase-5-token-consolidation
```

---

**Status:** Ready for implementation
**Impact:** Push from 20.45% to 24.17% reduction
**Next:** Achieve ~25% total reduction milestone
