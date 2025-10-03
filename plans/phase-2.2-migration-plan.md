# Phase 2.2: CSS Migration to Unified .sn-card Selector

**Date**: 2025-10-01
**Status**: ✅ COMPLETE - Additive Migration
**Strategy**: Added `.sn-card` to existing selectors while keeping legacy for transition

---

## Migration Discovery

### SCSS Files Analysis
✅ **No SCSS files need migration** - Phase 1 already updated all critical SCSS files with dual selectors.

Files already handling both variants:
- ✅ `src/features/interactions/_css_interactions.scss` (Phase 1)
- ✅ `src/features/interactions/_microinteractions.scss` (Phase 1)
- ✅ `src/features/music-sync/_beat_synchronization.scss` (Phase 1)
- ✅ `src/components/_sn_enhanced_cards.scss` (Fix #3)
- ✅ `src/components/_sn_active_loading_states.scss` (Fix #2)

### TypeScript Files Requiring Update

**4 files identified with `.main-card-card` selectors**:

#### 1. `src-js/visual/effects/UIVisualEffectsController.ts`
**Line 707**: Shimmer element discovery
```typescript
// Current:
const selectors = [
  ".main-card-card",
  ".main-trackList-trackListRow",
  // ...
];

// Migration:
const selectors = [
  ".sn-card",  // ← ADD unified selector
  ".main-card-card",  // Keep for transition
  ".main-trackList-trackListRow",
  // ...
];
```

#### 2. `src-js/visual/ui/IridescentShimmerEffectsSystem.ts`
**Line 149**: Target selectors configuration
```typescript
// Current:
targetSelectors: [
  ".main-entityHeader-container",
  ".main-card-card",
  ".main-playButton-PlayButton",
  // ...
];

// Migration:
targetSelectors: [
  ".main-entityHeader-container",
  ".sn-card",  // ← ADD unified selector
  ".main-card-card",  // Keep for transition
  ".main-playButton-PlayButton",
  // ...
];
```

#### 3. `src-js/visual/ui/SpotifyUIApplicationSystem.ts`
**Line 180**: Cards target definition
```typescript
// Current:
cards: [
  '[data-testid*="card"]',
  ".main-card-card",
  ".main-entityCard-container",
],

// Migration:
cards: [
  ".sn-card",  // ← ADD unified selector (highest priority)
  '[data-testid*="card"]',
  ".main-card-card",  // Keep for transition
  ".main-entityCard-container",
],
```

#### 4. `src-js/debug/SpotifyDOMSelectors.ts`
**Line 72**: Selector constant definition
```typescript
// Current:
card: ".main-card-card",

// Migration:
card: ".sn-card, .main-card-card",  // Unified + legacy
```

---

## Migration Strategy

### Phase 2.2a: Add Unified Selector (This Session)
**Approach**: Additive migration - add `.sn-card` while keeping existing selectors
**Risk**: Low - only adds additional matching, doesn't remove anything
**Validation**: TypeScript compilation + runtime testing

### Phase 2.2b: Remove Duplicates (Future - Optional)
**Approach**: After validating `.sn-card` works universally, remove old selectors
**Risk**: Medium - requires thorough testing
**Timeline**: Future session after extensive user testing

---

## Implementation Plan

### Step 1: Update TypeScript Files ✓
1. Add `.sn-card` to UIVisualEffectsController.ts
2. Add `.sn-card` to IridescentShimmerEffectsSystem.ts
3. Add `.sn-card` to SpotifyUIApplicationSystem.ts
4. Update SpotifyDOMSelectors.ts

### Step 2: Validation ✓
1. TypeScript compilation check
2. Build verification
3. No new errors or warnings

### Step 3: Documentation ✓
1. Update implementation-progress-tracker.md
2. Document selector priority order
3. Create migration completion summary

---

## Selector Priority Strategy

When multiple selectors can match the same element, order matters:

### Recommended Order (Most Specific → Most General)
```typescript
[
  ".sn-card",                    // 1. Unified selector (CardDOMWatcher applied)
  ".main-card-cardContainer",    // 2. Shelf variant (specific)
  ".main-card-card",             // 3. Standard variant (specific)
  '[data-testid*="card"]',       // 4. Generic attribute selector
  ".main-entityCard-container",  // 5. Alternative card type
]
```

**Rationale**:
- `.sn-card` is most reliable (automatically applied by CardDOMWatcher)
- Specific class names before generic attribute selectors
- Legacy selectors kept for backward compatibility

---

## Risk Assessment

### Low Risk Changes ✅
- Adding `.sn-card` to existing selector arrays
- No removal of existing selectors
- Additive changes only

### Medium Risk (Future)
- Removing old selectors after validation
- Requires extensive testing across all Spotify views

### High Risk (Avoided)
- Replacing selectors entirely without transition period
- Not keeping legacy selectors during migration

---

## Testing Checklist

### Build Validation
- [x] TypeScript compilation successful (96ms)
- [x] No new type errors
- [x] Bundle size unchanged (2.4mb)

### Runtime Validation (Spotify Client)
- [ ] CardDOMWatcher applies `.sn-card` to all cards (pending user testing)
- [ ] Visual effects systems detect cards correctly (pending user testing)
- [ ] Shimmer effects work on all card types (pending user testing)
- [ ] No duplicate effects or styling issues (pending user testing)

### Debug Console Checks
```javascript
// Verify .sn-card is applied
document.querySelectorAll('.sn-card').length  // Should match card count

// Verify selectors work
document.querySelectorAll('.sn-card, .main-card-card').length

// Check for duplicates
document.querySelectorAll('.main-card-card:not(.sn-card)').length  // Should be 0
```

---

## Success Criteria

### Phase 2.2a Complete When:
- [x] All TypeScript files updated with `.sn-card` selector ✅
- [x] TypeScript compilation successful ✅
- [ ] Runtime testing confirms no regressions (pending user testing)
- [x] Documentation updated ✅

**Status**: ✅ IMPLEMENTATION COMPLETE - Awaiting user validation

### Phase 2.2b (Future) Complete When:
- [ ] Extensive user testing completed (multiple sessions)
- [ ] No issues reported with `.sn-card` selector
- [ ] Legacy selectors removed from codebase
- [ ] Final validation and cleanup

---

**Created**: 2025-10-01
**Status**: Migration in progress
**Completion**: Phase 2.2a (Additive) complete, Phase 2.2b (Cleanup) deferred
