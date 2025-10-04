# Tier 1 Batch 2 - Token Removal List

**Batch:** 2 of 3-4
**Date:** 2025-10-04
**Target:** 48 tokens (Unused Genre OKLAB tokens)
**Risk Level:** LOW
**Verification:** Zero CSS var() usage + No TypeScript usage + Preserved actively used tokens

---

## Removal Strategy

### Why These Tokens Second?
1. **Follow-up to Batch 1**: Same OKLAB token pattern, low risk
2. **Clear preservation**: 6 genre tokens ARE used, must preserve those
3. **Definitively unused**: 48 tokens have zero CSS var() references
4. **Not TypeScript-managed**: Genre systems don't dynamically set these specific tokens
5. **Safe removal**: Easy to verify which to keep vs. remove

### Pattern Explanation
Most genres have 6 OKLAB tokens:
- `-oklab-preset`: Genre preset name (all unused)
- `-oklab-primary-rgb`: Primary color (unused except rock has some usage elsewhere)
- `-oklab-accent-rgb`: Accent color (unused)
- `-oklab-chroma-boost`: Chroma boost value (6 USED - PRESERVE)
- `-oklab-lightness-boost`: Lightness boost value (6 USED - PRESERVE)
- `-oklab-hue-shift`: Hue shift value (unused except preserved genres)

**Genres**: ambient, classical, default, electronic, folk, hiphop, jazz, pop, rock

---

## Tokens to PRESERVE (6 tokens - ACTIVELY USED)

### Rock Genre (2 used tokens)
```scss
--sn-genre-rock-oklab-chroma-boost      # 2 var() references - KEEP
--sn-genre-rock-oklab-lightness-boost   # 1 var() reference - KEEP
```

### Electronic Genre (2 used tokens)
```scss
--sn-genre-electronic-oklab-chroma-boost      # 1 var() reference - KEEP
--sn-genre-electronic-oklab-lightness-boost   # 1 var() reference - KEEP
```

### Classical Genre (2 used tokens)
```scss
--sn-genre-classical-oklab-chroma-boost       # 1 var() reference - KEEP
--sn-genre-classical-oklab-lightness-boost    # 1 var() reference - KEEP
```

---

## Tokens to REMOVE (48 tokens - ZERO USAGE)

### Ambient Genre (6 tokens)
```scss
--sn-genre-ambient-oklab-preset
--sn-genre-ambient-oklab-primary-rgb
--sn-genre-ambient-oklab-accent-rgb
--sn-genre-ambient-oklab-chroma-boost
--sn-genre-ambient-oklab-lightness-boost
--sn-genre-ambient-oklab-hue-shift
```

### Classical Genre (4 tokens - preserve 2)
```scss
--sn-genre-classical-oklab-preset
--sn-genre-classical-oklab-primary-rgb
--sn-genre-classical-oklab-accent-rgb
--sn-genre-classical-oklab-hue-shift
# PRESERVE: chroma-boost, lightness-boost
```

### Default Genre (6 tokens)
```scss
--sn-genre-default-oklab-preset
--sn-genre-default-oklab-primary-rgb
--sn-genre-default-oklab-accent-rgb
--sn-genre-default-oklab-chroma-boost
--sn-genre-default-oklab-lightness-boost
--sn-genre-default-oklab-hue-shift
```

### Electronic Genre (4 tokens - preserve 2)
```scss
--sn-genre-electronic-oklab-preset
--sn-genre-electronic-oklab-primary-rgb
--sn-genre-electronic-oklab-accent-rgb
--sn-genre-electronic-oklab-hue-shift
# PRESERVE: chroma-boost, lightness-boost
```

### Folk Genre (6 tokens)
```scss
--sn-genre-folk-oklab-preset
--sn-genre-folk-oklab-primary-rgb
--sn-genre-folk-oklab-accent-rgb
--sn-genre-folk-oklab-chroma-boost
--sn-genre-folk-oklab-lightness-boost
--sn-genre-folk-oklab-hue-shift
```

### Hip-Hop Genre (6 tokens)
```scss
--sn-genre-hiphop-oklab-preset
--sn-genre-hiphop-oklab-primary-rgb
--sn-genre-hiphop-oklab-accent-rgb
--sn-genre-hiphop-oklab-chroma-boost
--sn-genre-hiphop-oklab-lightness-boost
--sn-genre-hiphop-oklab-hue-shift
```

### Jazz Genre (6 tokens)
```scss
--sn-genre-jazz-oklab-preset
--sn-genre-jazz-oklab-primary-rgb
--sn-genre-jazz-oklab-accent-rgb
--sn-genre-jazz-oklab-chroma-boost
--sn-genre-jazz-oklab-lightness-boost
--sn-genre-jazz-oklab-hue-shift
```

### Pop Genre (6 tokens)
```scss
--sn-genre-pop-oklab-preset
--sn-genre-pop-oklab-primary-rgb
--sn-genre-pop-oklab-accent-rgb
--sn-genre-pop-oklab-chroma-boost
--sn-genre-pop-oklab-lightness-boost
--sn-genre-pop-oklab-hue-shift
```

### Rock Genre (4 tokens - preserve 2)
```scss
--sn-genre-rock-oklab-preset
--sn-genre-rock-oklab-primary-rgb
--sn-genre-rock-oklab-accent-rgb
--sn-genre-rock-oklab-hue-shift
# PRESERVE: chroma-boost, lightness-boost
```

---

## Pre-Removal Verification

### Step 1: Confirm 48 Unused Tokens ✅
Verified in Phase 4 analysis:
- Present in `reports/zero-var-usage-tokens.txt` ✅
- Zero count in `reports/var-usage-counts.txt` ✅

### Step 2: Confirm 6 Used Tokens Preserved
Verified in Phase 4 analysis:
- Present in `reports/specialized-tokens.csv` ✅
- Usage counts: 1-2 var() references each ✅
- Will NOT be removed ✅

### Step 3: Confirm No TypeScript Usage
```bash
grep -r "setProperty.*genre.*\(preset\|primary-rgb\|accent-rgb\|hue-shift\)" src-js/
# Expected: No matches (only chroma-boost and lightness-boost may be managed)
```

### Step 4: Confirm in tokens.scss
```bash
grep -c "^\s*--sn-genre-" src/design-tokens/tokens.scss
# Expected: 54 total (48 to remove + 6 to preserve)
```

---

## Removal Process

### Phase 1: Locate Genre Tokens
1. Open `src/design-tokens/tokens.scss`
2. Find "=== GENRE-SPECIFIC OKLAB PRESETS ===" section
3. Identify which tokens to remove vs. preserve

### Phase 2: Remove Unused Tokens
1. Remove all preset, primary-rgb, accent-rgb, hue-shift tokens
2. Remove unused chroma-boost and lightness-boost (ambient, default, folk, hiphop, jazz, pop)
3. Preserve 6 actively used tokens (rock, electronic, classical - chroma/lightness boost)

### Phase 3: Verify Build
```bash
npm run build:css:dev
# Expected: Clean build, no undefined variable warnings
```

### Phase 4: Test
```bash
npm run typecheck
npm test -- --passWithNoTests
# Expected: All tests pass, no new failures
```

### Phase 5: Verify Token Count
```bash
grep "^\s*--sn-" src/design-tokens/tokens.scss | wc -l
# Expected: 448 - 48 = 400 tokens
```

---

## Expected Impact

### File Changes
- **Modified:** `src/design-tokens/tokens.scss`
- **Lines removed:** ~96-144 (depends on formatting, comments)

### Token Count Progression
- **Before Batch 1:** 484 tokens
- **After Batch 1:** 448 tokens
- **After Batch 2:** 400 tokens
- **Reduction:** 48 tokens (10.7% from Batch 1 baseline, 17.4% total)

### Build Impact
- **Compile time:** No change expected
- **File size:** Reduction ~2-3 KB
- **Functionality:** Zero impact (unused tokens, used tokens preserved)

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

- [x] All 48 unused tokens identified
- [x] All 6 used tokens flagged for preservation
- [ ] Pre-removal verification complete
- [ ] Unused tokens removed from tokens.scss
- [ ] Used tokens verified preserved
- [ ] Build completes successfully
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] Token count reduced to 400
- [ ] No undefined variable warnings
- [ ] Committed with clear message

---

## Commit Message Template

```
chore(tokens): remove unused genre OKLAB tokens (Phase 5 Batch 2)

Remove 48 unused genre OKLAB tokens identified in Phase 4 audit:
- 9 genres (ambient, classical, default, electronic, folk, hiphop, jazz, pop, rock)
- Removed unused: preset, primary-rgb, accent-rgb, hue-shift, and unused boost tokens
- Preserved 6 actively used tokens:
  * rock: chroma-boost (2 uses), lightness-boost (1 use)
  * electronic: chroma-boost (1 use), lightness-boost (1 use)
  * classical: chroma-boost (1 use), lightness-boost (1 use)

Token count: 448 → 400 (-48 tokens, -10.7%)
Total reduction from baseline: 484 → 400 (-84 tokens, -17.4%)

Part of Phase 5 Tier 1 token consolidation (84/86 complete).
Related: #phase-5-token-consolidation
```

---

**Status:** Ready for implementation
**Next:** Execute removal with preservation of 6 used tokens
