# Tier 1 Batch 1 - Token Removal List

**Batch:** 1 of 3-4
**Date:** 2025-10-04
**Target:** 36 tokens (Emotion OKLAB attributes)
**Risk Level:** LOW
**Verification:** Zero CSS var() usage + No TypeScript usage

---

## Removal Strategy

### Why These Tokens First?
1. **Clear pattern**: All follow `--sn-emotion-{name}-oklab-{attribute}` naming
2. **Definitively unused**: Zero CSS var() references
3. **Not TypeScript-managed**: Not in any setProperty() calls
4. **Safe removal**: Emotion primary/accent RGB tokens ARE used, but these attributes are not
5. **Easy verification**: Simple grep to confirm no hidden usage

### Pattern Explanation
Each emotion has 4 OKLAB attribute tokens that are never used:
- `-oklab-chroma`: Chroma value (colorfulness)
- `-oklab-hue`: Hue value (color angle)
- `-oklab-luminance`: Luminance value (brightness)
- `-oklab-atmosphere-rgb`: Atmospheric color variant

**Used tokens** (preserved): `-oklab-primary-rgb` and `-oklab-accent-rgb`

---

## Tokens to Remove (36 total)

### Aggressive Emotion (4 tokens)
```scss
--sn-emotion-aggressive-oklab-atmosphere-rgb
--sn-emotion-aggressive-oklab-chroma
--sn-emotion-aggressive-oklab-hue
--sn-emotion-aggressive-oklab-luminance
```

### Ambient Emotion (4 tokens)
```scss
--sn-emotion-ambient-oklab-atmosphere-rgb
--sn-emotion-ambient-oklab-chroma
--sn-emotion-ambient-oklab-hue
--sn-emotion-ambient-oklab-luminance
```

### Calm Emotion (4 tokens)
```scss
--sn-emotion-calm-oklab-atmosphere-rgb
--sn-emotion-calm-oklab-chroma
--sn-emotion-calm-oklab-hue
--sn-emotion-calm-oklab-luminance
```

### Energetic Emotion (4 tokens)
```scss
--sn-emotion-energetic-oklab-atmosphere-rgb
--sn-emotion-energetic-oklab-chroma
--sn-emotion-energetic-oklab-hue
--sn-emotion-energetic-oklab-luminance
```

### Epic Emotion (4 tokens)
```scss
--sn-emotion-epic-oklab-atmosphere-rgb
--sn-emotion-epic-oklab-chroma
--sn-emotion-epic-oklab-hue
--sn-emotion-epic-oklab-luminance
```

### Happy Emotion (4 tokens)
```scss
--sn-emotion-happy-oklab-atmosphere-rgb
--sn-emotion-happy-oklab-chroma
--sn-emotion-happy-oklab-hue
--sn-emotion-happy-oklab-luminance
```

### Melancholy Emotion (4 tokens)
```scss
--sn-emotion-melancholy-oklab-atmosphere-rgb
--sn-emotion-melancholy-oklab-chroma
--sn-emotion-melancholy-oklab-hue
--sn-emotion-melancholy-oklab-luminance
```

### Mysterious Emotion (4 tokens)
```scss
--sn-emotion-mysterious-oklab-atmosphere-rgb
--sn-emotion-mysterious-oklab-chroma
--sn-emotion-mysterious-oklab-hue
--sn-emotion-mysterious-oklab-luminance
```

### Romantic Emotion (4 tokens)
```scss
--sn-emotion-romantic-oklab-atmosphere-rgb
--sn-emotion-romantic-oklab-chroma
--sn-emotion-romantic-oklab-hue
--sn-emotion-romantic-oklab-luminance
```

---

## Pre-Removal Verification

### Step 1: Confirm Zero CSS var() Usage ✅
All 36 tokens verified in Phase 4 analysis:
- Present in `reports/zero-var-usage-tokens.txt` ✅
- Zero count in `reports/var-usage-counts.txt` ✅

### Step 2: Confirm No TypeScript Usage ✅
Verified no setProperty() calls for these specific tokens:
```bash
grep -r "setProperty.*emotion.*\(chroma\|hue\|luminance\|atmosphere\)" src-js/
# Result: No matches ✅
```

### Step 3: Confirm in tokens.scss
```bash
grep -c "^\s*--sn-emotion-.*-oklab-\(chroma\|hue\|luminance\|atmosphere-rgb\)" src/design-tokens/tokens.scss
# Expected: 36 matches
```

### Step 4: Confirm No SCSS References
```bash
grep -r "\-\-sn-emotion-.*-oklab-\(chroma\|hue\|luminance\|atmosphere\)" src/ --include="*.scss" | grep -v "tokens.scss"
# Expected: No results (only definitions, no usage)
```

---

## Removal Process

### Phase 1: Locate Tokens
1. Open `src/design-tokens/tokens.scss`
2. Search for emotion OKLAB tokens section
3. Identify lines containing the 36 tokens

### Phase 2: Remove Tokens
1. Delete all lines matching the pattern
2. Preserve `-oklab-primary-rgb` and `-oklab-accent-rgb` tokens (USED)
3. Preserve any comments or section headers

### Phase 3: Verify Build
```bash
npm run build:css:dev
# Expected: Clean build, no undefined variable warnings
```

### Phase 4: Test
```bash
npm run typecheck
npm test
# Expected: All tests pass
```

### Phase 5: Verify Token Count
```bash
grep "^\s*--sn-" src/design-tokens/tokens.scss | wc -l
# Expected: 484 - 36 = 448 tokens
```

---

## Expected Impact

### File Changes
- **Modified:** `src/design-tokens/tokens.scss`
- **Lines removed:** ~36-72 (depends on formatting)

### Token Count Progression
- **Before:** 484 tokens
- **After:** 448 tokens
- **Reduction:** 36 tokens (7.4%)

### Build Impact
- **Compile time:** No change expected (minimal impact)
- **File size:** Slight reduction (~1-2 KB)
- **Functionality:** Zero impact (unused tokens)

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

- [x] All 36 tokens identified
- [ ] Pre-removal verification complete
- [ ] Tokens removed from tokens.scss
- [ ] Build completes successfully
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] Token count reduced to 448
- [ ] No undefined variable warnings
- [ ] Committed with clear message

---

## Commit Message Template

```
chore(tokens): remove unused emotion OKLAB attribute tokens (Batch 1)

Remove 36 unused emotion OKLAB attribute tokens identified in Phase 4 audit:
- 9 emotions × 4 attributes (chroma, hue, luminance, atmosphere-rgb)
- Zero CSS var() usage confirmed
- No TypeScript runtime usage
- Preserved actively used primary-rgb and accent-rgb tokens

Token count: 484 → 448 (-36 tokens, -7.4%)

Part of Phase 5 Tier 1 token consolidation.
Related: #phase-5-token-consolidation
```

---

**Status:** Ready for implementation
**Next:** Execute removal and verification
