# System Naming Analysis - Clarity Through Names
**Date**: 2025-10-04
**Goal**: Rename systems to reflect single-responsibility architecture

---

## Current Problems

### Naming Issues

| Current Name | Problem | Confusion |
|-------------|---------|-----------|
| **ColorHarmonyEngine** | "Engine" is vague | Implies complex stateful system |
| **ColorStateManager** | Generic "Manager" | Doesn't indicate CSS ownership |
| **ColorEventOrchestrator** | Actually good! | Minor: could be "Router" |
| **SemanticColorManager** | Generic "Manager" | Doesn't show it's a bridge |

### Architectural Misalignment

**ColorHarmonyEngine** (5625 lines):
- Current name suggests: Monolithic engine doing everything
- After refactor role: Pure OKLAB color processor
- Name should indicate: Processing, not orchestration

**ColorStateManager** (740 lines):
- Current name suggests: Generic state container
- After refactor role: Single source of truth for ALL CSS writes
- Name should indicate: CSS control authority

---

## Proposed Naming Strategy

### Option A: Role-Based Naming (Recommended)

Emphasizes WHAT each system does:

```
┌─────────────────────────────────────────────────────────────┐
│ ColorEventRouter (was ColorEventOrchestrator)               │
│ Pure event routing - no processing, no state                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ OKLABColorProcessor (was ColorHarmonyEngine)                │
│ Pure color science - OKLAB processing only                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ CSSColorController (was ColorStateManager)                  │
│ Single authority - owns ALL CSS variable writes             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ SpicetifyColorBridge (was SemanticColorManager)             │
│ Integration layer - Spicetify ↔ CSS variables               │
└─────────────────────────────────────────────────────────────┘
```

**Benefits**:
- ✅ Names describe function clearly
- ✅ "Processor" indicates pure functions
- ✅ "Controller" indicates authority
- ✅ "Bridge" indicates integration
- ✅ "Router" indicates event routing

### Option B: Layer-Based Naming

Emphasizes WHERE in the architecture:

```
ColorEventLayer     (was ColorEventOrchestrator)
ColorProcessingLayer (was ColorHarmonyEngine)
ColorStateLayer     (was ColorStateManager)
ColorIntegrationLayer (was SemanticColorManager)
```

**Benefits**:
- ✅ Clear architectural layering
- ❌ Less descriptive of actual function

### Option C: Year3000 Branding

Keep "Year3000" theme while clarifying:

```
Y3K_ColorRouter       (was ColorEventOrchestrator)
Y3K_OKLABProcessor   (was ColorHarmonyEngine)
Y3K_CSSController    (was ColorStateManager)
Y3K_SpicetifyBridge  (was SemanticColorManager)
```

**Benefits**:
- ✅ Brand consistency
- ❌ Verbose prefixes

---

## Recommended Renames (Option A)

### 1. ColorHarmonyEngine → OKLABColorProcessor

**Rationale**:
- Indicates pure processing (no side effects)
- Specific about algorithm (OKLAB color science)
- "Processor" pattern matches industry standards

**Current Responsibilities** (after Phase 2):
```typescript
class OKLABColorProcessor {
  // Pure function: colors in → processed colors out
  processAlbumColors(colors: ExtractedColors): ColorResult

  // Pure function: apply music analysis
  applyMusicAnalysis(colors: ColorResult, music: MusicData): ColorResult

  // Pure function: OKLAB transformations
  enhanceWithOKLAB(colors: RGBColor[], preset: string): OKLABResult
}
```

**Impact**: 29 import statements across codebase

### 2. ColorStateManager → CSSColorController

**Rationale**:
- "Controller" indicates authority and responsibility
- "CSS" makes it explicit what it controls
- Aligns with MVC pattern (Controller owns logic)

**Current Responsibilities** (after Phase 3):
```typescript
class CSSColorController {
  // OWNS: All CSS variable writes
  applyColorVariables(variables: ColorVariables): void

  // OWNS: State coordination
  updateFromMusicAnalysis(result: ColorResult): void
  updateFromSettings(config: ColorConfig): void

  // COORDINATES: Bridge systems
  syncWithSpicetify(): void
}
```

**Impact**: 11 import statements across codebase

### 3. ColorEventOrchestrator → ColorEventRouter

**Rationale**:
- "Router" is more accurate than "Orchestrator" for pure event routing
- Clearer that it doesn't process, just routes
- Standard networking terminology

**Current Responsibilities** (after Phase 4):
```typescript
class ColorEventRouter {
  // Pure event routing - no processing
  handleTrackChanged(event): void → route to processor
  handleSettingsChanged(event): void → route to controller

  // Event subscription management only
  subscribeToMusicEvents(): void
  subscribeToSettingsEvents(): void
}
```

**Impact**: 8 import statements across codebase

### 4. SemanticColorManager → SpicetifyColorBridge

**Rationale**:
- "Bridge" clearly indicates integration layer
- "Spicetify" makes it specific (not generic "Semantic")
- Follows Bridge design pattern naming

**Current Responsibilities**:
```typescript
class SpicetifyColorBridge {
  // Bidirectional bridge
  syncSpicetifyToCSS(): void
  syncCSSToSpicetify(): void

  // Semantic color mapping
  mapSemanticColor(semantic: SpicetifyColor): CSSVariable
}
```

**Impact**: 5 import statements across codebase

---

## Migration Strategy

### Phase 1: Alias Approach (Backward Compatible)

Create aliases while keeping old names:

```typescript
// ColorHarmonyEngine.ts
export class OKLABColorProcessor { /* ... */ }
export const ColorHarmonyEngine = OKLABColorProcessor; // DEPRECATED alias

// Exports
export {
  OKLABColorProcessor,
  ColorHarmonyEngine, // @deprecated Use OKLABColorProcessor
};
```

**Benefits**:
- ✅ Zero breaking changes
- ✅ Gradual migration path
- ✅ Both names work during transition

### Phase 2: Update Imports Incrementally

Update one file at a time:

```typescript
// Before
import { ColorHarmonyEngine } from '@/audio/ColorHarmonyEngine';

// After
import { OKLABColorProcessor } from '@/audio/OKLABColorProcessor';
```

**Process**:
1. Create new file with new name
2. Export old name as alias
3. Update imports file-by-file
4. Remove alias when all updated

### Phase 3: File Renames

Rename actual files after all imports updated:

```bash
# Rename files (preserving git history)
git mv src-js/audio/ColorHarmonyEngine.ts src-js/audio/OKLABColorProcessor.ts
git mv src-js/core/css/ColorStateManager.ts src-js/core/css/CSSColorController.ts
git mv src-js/core/events/ColorEventOrchestrator.ts src-js/core/events/ColorEventRouter.ts
git mv src-js/utils/spicetify/SemanticColorManager.ts src-js/utils/spicetify/SpicetifyColorBridge.ts
```

---

## Impact Analysis

### Files Requiring Updates

| System | Import Count | File Complexity | Estimated Effort |
|--------|-------------|-----------------|------------------|
| ColorHarmonyEngine → OKLABColorProcessor | 29 files | High (5625 lines) | 2-3 hours |
| ColorStateManager → CSSColorController | 11 files | Medium (740 lines) | 1 hour |
| ColorEventOrchestrator → ColorEventRouter | 8 files | Medium (960 lines) | 1 hour |
| SemanticColorManager → SpicetifyColorBridge | 5 files | Medium (1378 lines) | 30 minutes |
| **TOTAL** | **53 files** | - | **4-5 hours** |

### Risk Assessment

**Low Risk Changes**:
- ✅ Alias approach maintains compatibility
- ✅ TypeScript will catch broken imports
- ✅ No runtime behavior changes
- ✅ Can rollback at any point

**Medium Risk**:
- ⚠️ Documentation updates needed
- ⚠️ Tests may reference old names
- ⚠️ Git history may be less clear

---

## Alternative: Keep Current Names

### Arguments FOR Keeping Names

**"ColorHarmonyEngine"**:
- ✅ Already established in codebase
- ✅ Developers familiar with current name
- ✅ "Harmony" describes what it does (color harmonization)
- ✅ No migration cost

**Counter**: Name doesn't reflect new architecture (pure processor)

**"ColorStateManager"**:
- ✅ Clear state management role
- ✅ "Manager" is standard design pattern
- ✅ Widely used in codebase

**Counter**: Doesn't emphasize CSS ownership

### Arguments FOR Renaming

**Clarity Wins**:
- Names should reflect reality after refactor
- New developers will understand architecture faster
- Self-documenting code principle

**Consistency**:
- "Processor" for pure functions
- "Controller" for authority systems
- "Bridge" for integration layers
- "Router" for event routing

---

## Recommendation

### Immediate Action: **Option A with Alias Migration**

1. **Rename during refactoring phases**:
   - Phase 2: Rename ColorHarmonyEngine → OKLABColorProcessor
   - Phase 3: Rename ColorStateManager → CSSColorController
   - Phase 4: Rename ColorEventOrchestrator → ColorEventRouter
   - Phase 5: Rename SemanticColorManager → SpicetifyColorBridge

2. **Use alias approach**:
   - Zero breaking changes
   - Gradual migration
   - Update documentation

3. **Timeline**:
   - Rename with each phase refactor
   - Complete all renames by end of consolidation
   - Remove aliases after 1-2 weeks of stability

### Benefits of This Approach

✅ **Names match new architecture**
✅ **Backward compatible during transition**
✅ **Clear responsibilities at a glance**
✅ **Professional naming conventions**
✅ **Self-documenting code**

---

## Proposed Naming Table

| Current Name | New Name | Reason | Phase |
|-------------|----------|--------|-------|
| ColorHarmonyEngine | OKLABColorProcessor | Pure processor, OKLAB focus | Phase 2 |
| ColorStateManager | CSSColorController | CSS authority, controller pattern | Phase 3 |
| ColorEventOrchestrator | ColorEventRouter | Pure routing, no processing | Phase 4 |
| SemanticColorManager | SpicetifyColorBridge | Integration bridge pattern | Phase 5 |

---

## Next Steps

1. **Get user approval** on naming strategy
2. **Implement alias pattern** in Phase 2 refactor
3. **Update documentation** as we rename
4. **Track migration** in consolidation document
5. **Remove aliases** after validation

---

## Questions for Consideration

1. Do you prefer **OKLABColorProcessor** or **ColorHarmonyProcessor**?
   - "OKLAB" is more specific and technical
   - "Harmony" maintains current concept

2. Do you prefer **CSSColorController** or **ColorVariableController**?
   - "CSS" is more explicit
   - "Variable" is more precise

3. Should we use **Y3K** prefix for branding?
   - Pro: Brand consistency
   - Con: More verbose

4. Timeline preference:
   - Rename during refactoring phases (recommended)
   - Rename all at once after consolidation
   - Don't rename (keep current names)

---

**Recommendation**: Proceed with **Option A** (Role-Based Naming) using **alias migration** during consolidation phases.
