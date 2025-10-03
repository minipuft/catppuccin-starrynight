# Phase 2-3 Parallel Execution Plan
**Catppuccin StarryNight - Design Tokens Migration**

## Status Dashboard

| Phase | Status | Progress | Lead | Started | ETA |
|-------|--------|----------|------|---------|-----|
| Phase 1: Foundation | ✅ COMPLETE | 100% | - | 2025-10-02 | 2025-10-02 |
| Phase 2: Token Alignment | 🔄 IN PROGRESS | 80% (12/15 files) | Claude | 2025-10-02 | Week 2-3 |
| Phase 3: Selector Modernization | 🔄 IN PROGRESS | 0% | TBD | 2025-10-02 | Week 4 |

**⚠️ PARALLEL EXECUTION ACTIVE**: Phase 2 and Phase 3 running simultaneously
**Coordination Method**: File ownership matrix + atomic commits + regular sync points

---

## Executive Summary

### Strategic Objectives
1. **Align TypeScript-SCSS token usage** (Phase 2) - Eliminate legacy token aliases
2. **Modernize DOM selectors** (Phase 3) - Align with SpotifyDOMSelectors.ts
3. **Preserve functionality** - Zero regressions, 100% backward compatibility
4. **Enable parallel execution** - Maximize velocity while minimizing conflicts

### Tactical Approach
- **File-based separation** for independent work streams
- **Sequential processing** for high-conflict files
- **Atomic commits** with clear phase prefixes
- **Continuous integration** via build validation after each commit

### Risk Mitigation
- **Primary Risk**: Git merge conflicts in overlapping files
- **Mitigation**: File ownership matrix, coordination protocol, automated testing
- **Fallback**: Sequential execution if conflicts exceed threshold (>20% files)

---

## Architecture Analysis

### Affected Systems

#### Phase 2: Token Variable References (16 files)
**Scope**: Replace legacy token variables with modern `--sn-music-*` namespace

| Priority | File | Token Types | Complexity |
|----------|------|-------------|------------|
| P0 | `_beat_sync_glassmorphism.scss` | beat-pulse, rhythm, breathing | HIGH |
| P0 | `_mixins.scss` | All music tokens | HIGH |
| P1 | `_interaction_mixins.scss` | beat-pulse, rhythm | MEDIUM |
| P1 | `_action_bar_unified.scss` | beat-pulse | MEDIUM |
| P1 | `_top_bar.scss` | beat-pulse | MEDIUM |
| P1 | `_now_playing.scss` | beat-pulse, rhythm | MEDIUM |
| P1 | `_navbar.scss` | beat-pulse | MEDIUM |
| P2 | `_sn_enhanced_cards.scss` | beat-pulse | LOW |
| P2 | `_microinteractions.scss` | beat-pulse | LOW |
| P2 | `_css_interactions.scss` | beat-pulse | LOW |
| P2 | `_particle_animation_system.scss` | beat-pulse | LOW |
| P2 | `_cosmic_depth_system.scss` | beat-pulse | LOW |
| P2 | `_fluid_morphing.scss` | beat-pulse | LOW |
| P2 | `_text_visual_effects.scss` | beat-pulse | LOW |
| P2 | `_grid_navigation_mode.scss` | beat-pulse | LOW |
| SKIP | `tokens.scss` | Defines aliases | REFERENCE ONLY |

#### Phase 3: DOM Selector Updates (20 files)
**Scope**: Replace legacy selectors with modern equivalents from SpotifyDOMSelectors.ts

| Priority | File | Selectors | Complexity |
|----------|------|-----------|------------|
| P0 | `_navbar.scss` | navBar-navBar → Root__nav-bar | HIGH |
| P0 | `_sn_card_base.scss` | main-card-card → .sn-card | HIGH |
| P1 | `_now_playing.scss` (if needed) | nowPlayingWidget → Root__now-playing-bar | MEDIUM |
| P1 | `_sidebar_interactive.scss` | navBar-navBar | MEDIUM |
| P1 | `_beat_sync_glassmorphism.scss` | Multiple selectors | MEDIUM |
| P2 | `_sn_enhanced_cards.scss` | main-card-card | LOW |
| P2 | `_crystalline_glassmorphism.scss` | nowPlayingWidget | LOW |
| P2 | `_beat_synchronization.scss` | Multiple | LOW |
| P2 | `_microinteractions.scss` | navBar | LOW |
| P2 | `_css_interactions.scss` | Multiple | LOW |
| P2 | `_sn_active_loading_states.scss` | Cards | LOW |
| P2 | `_cosmic_depth_system.scss` | Cards | LOW |
| P2 | `_audio-reactive-atmospherics.scss` | nowPlayingWidget | LOW |
| P2 | `_white_layer_fixes.scss` | Multiple | LOW |
| P2 | `_text_visual_effects.scss` | Multiple | LOW |
| P2 | `_content_protection_system.scss` | Multiple | LOW |
| P2 | `_genre_aware_ui.scss` | Multiple | LOW |
| P2 | `_grid_navigation_mode.scss` | Cards | LOW |
| P2 | `_dynamic_interface.scss` | Multiple | LOW |
| P2 | `_performance_mixins.scss` | Reference | LOW |

### High-Conflict Zone (8 files requiring both phases)
These files need **coordinated sequential processing**:

1. `_beat_sync_glassmorphism.scss` - P0 (Phase 2 first, then Phase 3)
2. `_navbar.scss` - P0 (Phase 3 first due to structural changes)
3. `_sn_enhanced_cards.scss` - P2 (Phase 2 first)
4. `_microinteractions.scss` - P2 (Phase 2 first)
5. `_css_interactions.scss` - P2 (Phase 2 first)
6. `_cosmic_depth_system.scss` - P2 (Phase 2 first)
7. `_text_visual_effects.scss` - P2 (Phase 2 first)
8. `_grid_navigation_mode.scss` - P2 (Phase 2 first)

---

## File Ownership Matrix

### Phase 2 Exclusive (8 files - Safe for parallel work)
✅ **No conflict risk** - Only Phase 2 touches these files

```
_mixins.scss                      - P0 Phase 2
_interaction_mixins.scss          - P1 Phase 2
_action_bar_unified.scss          - P1 Phase 2
_top_bar.scss                     - P1 Phase 2
_now_playing.scss                 - P1 Phase 2
_particle_animation_system.scss   - P2 Phase 2
_fluid_morphing.scss              - P2 Phase 2
tokens.scss                       - REFERENCE (no edits)
```

### Phase 3 Exclusive (12 files - Safe for parallel work)
✅ **No conflict risk** - Only Phase 3 touches these files

```
_sn_card_base.scss                - P0 Phase 3
_sidebar_interactive.scss         - P1 Phase 3
_crystalline_glassmorphism.scss   - P2 Phase 3
_beat_synchronization.scss        - P2 Phase 3
_sn_active_loading_states.scss    - P2 Phase 3
_audio-reactive-atmospherics.scss - P2 Phase 3
_white_layer_fixes.scss           - P2 Phase 3
_content_protection_system.scss   - P2 Phase 3
_genre_aware_ui.scss              - P2 Phase 3
_dynamic_interface.scss           - P2 Phase 3
_performance_mixins.scss          - P2 Phase 3
_design_tokens.scss               - P2 Phase 3 (validate only)
```

### Conflict Zone - Sequential Processing Required (8 files)
⚠️ **HIGH COORDINATION NEEDED** - One phase completes before other starts

```
File                              | Phase Order | Rationale
----------------------------------|-------------|------------------
_beat_sync_glassmorphism.scss     | 2 → 3       | Complex token usage, then selectors
_navbar.scss                      | 3 → 2       | Major selector restructure first
_sn_enhanced_cards.scss           | 2 → 3       | Token changes simpler than selectors
_microinteractions.scss           | 2 → 3       | Music sync primary concern
_css_interactions.scss            | 2 → 3       | Music sync primary concern
_cosmic_depth_system.scss         | 2 → 3       | Music sync primary concern
_text_visual_effects.scss         | 2 → 3       | Music sync primary concern
_grid_navigation_mode.scss        | 2 → 3       | Music sync primary concern
```

---

## Coordination Protocol

### Commit Message Convention
```
phase2(scope): description      # Phase 2 token changes
phase3(scope): description      # Phase 3 selector changes
phase2+3(scope): description    # Conflict resolution commits

Examples:
phase2(mixins): migrate music tokens to --sn-music-* namespace
phase3(navbar): update to Root__nav-bar modern selector
phase2+3(glassmorphism): resolve conflict - tokens then selectors
```

### Branching Strategy
```
main
 ├── phase-2-token-alignment     (Phase 2 work)
 └── phase-3-selector-modern     (Phase 3 work)
```

**Merge sequence**:
1. Phase 2 exclusive files → merge to main first
2. Phase 3 exclusive files → merge to main
3. Conflict zone files (sequential per file) → merge as completed
4. Final integration testing

### Sync Points (Required)
- **Daily**: File ownership status update in this document
- **Pre-merge**: Run full build + test suite
- **Post-merge**: Validate no regressions in user.css output
- **Conflict detection**: If merge conflict occurs, pause and coordinate

### Validation Gates
```bash
# Required before any commit
npm run typecheck          # TypeScript validation
npm run build:css:dev      # SCSS compilation check
npm run validate           # Full validation suite

# Visual validation
npm run build:css:dev && diff user.css user.css.backup
```

---

## Phase 2: Token Alignment - Tactical Implementation

### Objective
Replace legacy music token references with modern `--sn-music-*` namespace

### Token Migration Map
```scss
/* LEGACY → MODERN */
--sn-beat-pulse-intensity       → --sn-music-beat-pulse-intensity
--sn-rhythm-phase               → --sn-music-rhythm-phase
--sn-breathing-scale            → --sn-music-breathing-scale
--sn-spectrum-phase             → --sn-music-spectrum-phase
--sn-energy-level               → --sn-music-energy-level
--sn-valence                    → --sn-music-valence
--sn-tempo-bpm                  → --sn-music-tempo-bpm
--sn-intensity-boost            → --sn-music-intensity-boost
--sn-sync-enabled               → --sn-music-sync-enabled
```

### Implementation Sequence

#### Wave 1: Core Mixins (Week 2, Days 1-2)
**Files**: `_mixins.scss`, `_interaction_mixins.scss`
**Impact**: HIGH - These define reusable patterns used across theme
**Approach**:
1. Update mixin definitions to use modern tokens
2. Verify all mixin consumers still work
3. Run comprehensive build test

```scss
/* Example: _mixins.scss */
/* BEFORE */
@mixin beat-pulse-glow {
  filter: brightness(calc(1 + var(--sn-beat-pulse-intensity, 0) * 0.3));
}

/* AFTER */
@mixin beat-pulse-glow {
  filter: brightness(calc(1 + var(--sn-music-beat-pulse-intensity, 0) * 0.3));
}
```

#### Wave 2: High-Impact Components (Week 2, Days 3-4)
**Files**: `_beat_sync_glassmorphism.scss`, `_action_bar_unified.scss`, `_top_bar.scss`, `_now_playing.scss`, `_navbar.scss`
**Impact**: MEDIUM - User-visible components
**Approach**:
1. One file at a time with immediate testing
2. Visual regression check after each file
3. Document any unexpected behavior

#### Wave 3: Visual Effects (Week 2, Day 5)
**Files**: `_particle_animation_system.scss`, `_cosmic_depth_system.scss`, `_fluid_morphing.scss`
**Impact**: MEDIUM - Background/ambient effects
**Approach**: Batch process with visual validation

#### Wave 4: Interactions (Week 3, Days 1-2)
**Files**: `_microinteractions.scss`, `_css_interactions.scss`, `_text_visual_effects.scss`
**Impact**: LOW - Micro-animations
**Approach**: Batch process

#### Wave 5: Remaining Files (Week 3, Day 3)
**Files**: `_sn_enhanced_cards.scss`, `_grid_navigation_mode.scss`
**Impact**: LOW
**Approach**: Final cleanup

### Testing Strategy
```bash
# After each wave
npm run build:css:dev
diff user.css user.css.wave{N}.backup | grep "sn-music\|sn-beat\|sn-rhythm"

# Functional test
# 1. Play music in Spotify
# 2. Verify beat synchronization still works
# 3. Check glassmorphism pulses
# 4. Validate particle animations respond to music
```

---

## Phase 3: Selector Modernization - Tactical Implementation

### Objective
Replace legacy Spotify DOM selectors with modern equivalents

### Selector Migration Map
```scss
/* LEGACY → MODERN */
.main-nowPlayingWidget-nowPlaying  → .Root__now-playing-bar
.main-navBar-navBar                → .Root__nav-bar
.main-card-card                    → .sn-card, .main-card-card (keep both)
.main-search-searchBar             → [data-testid='search-input']
.main-topBar-topBar                → .main-actionBar-ActionBarRow
.main-queue-queue                  → .main-queue-trackList
```

### Implementation Sequence

#### Wave 1: Navigation Structure (Week 4, Days 1-2)
**Files**: `_navbar.scss`, `_sidebar_interactive.scss`
**Impact**: HIGH - Core navigation
**Approach**:
1. Add dual selectors (modern + legacy) for safety
2. Test navigation interactions
3. Validate hover states, active states

```scss
/* Dual selector pattern */
/* BEFORE */
.main-navBar-navBar {
  /* styles */
}

/* AFTER */
.Root__nav-bar,
.main-navBar-navBar {
  /* styles */
  /* TODO: Remove legacy .main-navBar-navBar in v3.0 */
}
```

#### Wave 2: Card System (Week 4, Day 3)
**Files**: `_sn_card_base.scss`, `_sn_enhanced_cards.scss`
**Impact**: HIGH - Card rendering
**Approach**:
1. Leverage existing `.sn-card` unified selector
2. Ensure CardDOMWatcher integration
3. Test across different card types (album, playlist, artist)

#### Wave 3: Glassmorphism & Effects (Week 4, Day 4)
**Files**: `_beat_sync_glassmorphism.scss`, `_crystalline_glassmorphism.scss`
**Impact**: MEDIUM - Visual effects application
**Approach**: Update selectors, verify effects apply correctly

#### Wave 4: Component Refinements (Week 4, Day 5)
**Files**: All remaining P2 files
**Impact**: LOW - Specific component styling
**Approach**: Batch update with validation

### Testing Strategy
```bash
# After each wave
npm run build:css:dev

# DOM validation (browser console)
document.querySelectorAll('.Root__nav-bar').length > 0  // Should be true
document.querySelectorAll('.sn-card').length > 0        // Should be true

# Visual regression
# 1. Navigate through all main app sections
# 2. Verify all interactive elements styled correctly
# 3. Check hover/focus states
# 4. Validate card 3D effects apply
```

---

## Progress Tracking

### Phase 2: Token Alignment Checklist

#### Wave 1: Core Mixins ✅ 2/2 COMPLETE
- [x] `_mixins.scss` - Migrated all music tokens in mixin definitions (10 references updated)
- [x] `_interaction_mixins.scss` - Updated interaction pattern mixins (12 references updated)

#### Wave 2: High-Impact Components 🔄 4/5 IN PROGRESS
- [x] `_beat_sync_glassmorphism.scss` - Migrated glassmorphism beat sync (4 references updated)
- [x] `_action_bar_unified.scss` - Migrated action bar beat response (3 references updated)
- [x] `_top_bar.scss` - Migrated top bar animations (5 references updated)
- [x] `_now_playing.scss` - Migrated now playing widget (1 reference updated)
- [ ] `_navbar.scss` - Migrate navbar beat sync (CONFLICT ZONE - coordinate with Phase 3)

#### Wave 3: Visual Effects ✅ 3/3 COMPLETE
- [x] `_particle_animation_system.scss` - Migrated particle beat sync (6 references updated)
- [x] `_cosmic_depth_system.scss` - Migrated depth layer responses (11 references updated)
- [x] `_fluid_morphing.scss` - Migrated fluid morphing animations (4 references updated)

#### Wave 4: Interactions ✅ 3/3 COMPLETE
- [x] `_microinteractions.scss` - Migrated micro-animation tokens (2 references updated)
- [x] `_css_interactions.scss` - Migrated CSS interaction patterns (4 references updated)
- [x] `_text_visual_effects.scss` - Migrated text effect tokens (3 references updated)

#### Wave 5: Remaining ⬜ 0/2
- [ ] `_sn_enhanced_cards.scss` - Update card beat sync
- [ ] `_grid_navigation_mode.scss` - Migrate grid animations

**Total: 12/15 files complete (80%)**

**Wave 1 Completed**: 2025-10-02
- CSS build: ✅ SUCCESS
- TypeScript check: ✅ SUCCESS
- CSS diff: ✅ VERIFIED (modern tokens in output)
- Tokens migrated: `--sn-rhythm-phase` → `--sn-music-rhythm-phase` (10 refs), `--sn-beat-pulse-intensity` → `--sn-music-beat-pulse-intensity` (12 refs)

**Wave 2 In Progress**: 2025-10-02
- `_beat_sync_glassmorphism.scss` complete:
  - Migrated `--sn-rhythm-phase` → `--sn-music-rhythm-phase` (4 references: 1 comment + 3 token refs)
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS
  - Modern tokens verified in user.css (26 references total)
- `_action_bar_unified.scss` complete:
  - Migrated `--sn-rhythm-phase` → `--sn-music-rhythm-phase` (2 references)
  - Migrated `--sn-breathing-scale` → `--sn-music-breathing-scale` (1 reference)
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS
- `_top_bar.scss` complete:
  - Migrated `--sn-rhythm-phase` → `--sn-music-rhythm-phase` (5 references: 1 comment + 4 token refs)
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS
- `_now_playing.scss` complete:
  - Migrated `--sn-rhythm-phase` → `--sn-music-rhythm-phase` (1 reference in progress bar gradient)
  - Preserved all consciousness effects (BLOOM, OSCILLATE, RIPPLE, HARMONIZE)
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS

**Wave 3 Completed**: 2025-10-02
- `_particle_animation_system.scss` complete:
  - Migrated `--sn-beat-pulse-intensity` → `--sn-music-beat-pulse-intensity` (6 references)
  - Updated selector: `.Root[style*="--sn-music-beat-pulse-intensity"]`
  - Aurora layer and particle pulse effects preserved
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS
- `_cosmic_depth_system.scss` complete:
  - Migrated `--sn-beat-pulse-intensity` → `--sn-music-beat-pulse-intensity` (10 references)
  - Migrated `--sn-rhythm-phase` → `--sn-music-rhythm-phase` (1 reference)
  - Updated selector: `.Root[style*="--sn-music-beat-pulse-intensity"]`
  - Cosmic expansion, stellar intensity, galactic rotation effects preserved
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS
- `_fluid_morphing.scss` complete:
  - Migrated `--sn-beat-pulse-intensity` → `--sn-music-beat-pulse-intensity` (4 references)
  - Updated selector: `.Root[style*="--sn-music-beat-pulse-intensity"]`
  - Fluid morphing, awakening animation, and organic backgrounds preserved
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS

**Wave 4 Completed**: 2025-10-02
- `_microinteractions.scss` complete:
  - Migrated `--sn-beat-pulse-intensity` → `--sn-music-beat-pulse-intensity` (1 reference)
  - Migrated `--sn-rhythm-phase` → `--sn-music-rhythm-phase` (1 reference)
  - All microinteraction effects preserved (ripple, bloom, refract, harmonize)
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS
- `_css_interactions.scss` complete:
  - Migrated `--sn-beat-pulse-intensity` → `--sn-music-beat-pulse-intensity` (4 references)
  - Updated selector: `.Root[style*="--sn-music-beat-pulse-intensity"]`
  - All CSS interaction patterns preserved (ripple, focus flow, hover lift)
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS
- `_text_visual_effects.scss` complete:
  - Migrated `--sn-beat-pulse-intensity` → `--sn-music-beat-pulse-intensity` (3 references)
  - Updated selector: `.Root[style*="--sn-music-beat-pulse-intensity"]`
  - All text visual effects preserved (shimmer, gradient text, glow effects)
  - CSS build: ✅ SUCCESS
  - TypeScript check: ✅ SUCCESS

---

### Phase 3: Selector Modernization Checklist

#### Wave 1: Navigation Structure ⬜ 0/2
- [ ] `_navbar.scss` - Update to .Root__nav-bar (dual selectors)
- [ ] `_sidebar_interactive.scss` - Migrate sidebar selectors

#### Wave 2: Card System ⬜ 0/2
- [ ] `_sn_card_base.scss` - Ensure .sn-card unified selector
- [ ] `_sn_enhanced_cards.scss` - Update card selectors

#### Wave 3: Glassmorphism & Effects ⬜ 0/2
- [ ] `_beat_sync_glassmorphism.scss` - Update selectors
- [ ] `_crystalline_glassmorphism.scss` - Migrate selectors

#### Wave 4: Component Refinements ⬜ 0/14
- [ ] `_beat_synchronization.scss` - Update selectors
- [ ] `_microinteractions.scss` - Migrate selectors
- [ ] `_css_interactions.scss` - Update selectors
- [ ] `_sn_active_loading_states.scss` - Migrate card selectors
- [ ] `_cosmic_depth_system.scss` - Update selectors
- [ ] `_audio-reactive-atmospherics.scss` - Migrate now playing selectors
- [ ] `_white_layer_fixes.scss` - Update selectors
- [ ] `_text_visual_effects.scss` - Migrate selectors
- [ ] `_content_protection_system.scss` - Update selectors
- [ ] `_genre_aware_ui.scss` - Migrate selectors
- [ ] `_grid_navigation_mode.scss` - Update selectors
- [ ] `_dynamic_interface.scss` - Migrate selectors
- [ ] `_performance_mixins.scss` - Validate selectors
- [ ] `_design_tokens.scss` - Validate references

**Total: 0/20 files complete (0%)**

---

## Risk Register

| Risk | Severity | Probability | Mitigation | Status |
|------|----------|-------------|------------|--------|
| Merge conflicts in conflict zone files | HIGH | 70% | Sequential processing, file ownership matrix | ACTIVE |
| Visual regression in user.css output | MEDIUM | 40% | Visual diff validation, dual selectors | MONITORING |
| Breaking changes to user-facing effects | MEDIUM | 30% | Incremental rollout, immediate testing | MONITORING |
| Performance degradation | LOW | 10% | Build time monitoring, CSS size tracking | MONITORING |
| Spotify DOM changes mid-migration | LOW | 15% | Dual selectors maintain compatibility | PLANNED |

---

## Success Criteria

### Phase 2 Completion
- ✅ All 15 SCSS files migrated to `--sn-music-*` tokens
- ✅ Zero legacy token references in production code (only aliases in tokens.scss)
- ✅ TypeScript compilation clean
- ✅ Build time unchanged or improved
- ✅ Music synchronization working identically to pre-migration

### Phase 3 Completion
- ✅ All 20 SCSS files using modern selectors (with legacy fallbacks where needed)
- ✅ DOM selector alignment: 95%+
- ✅ All visual effects apply to modern Spotify DOM
- ✅ Dual selectors maintain backward compatibility
- ✅ Zero visual regressions

### Overall Success
- ✅ Both phases complete within 4 weeks
- ✅ < 5 merge conflicts total
- ✅ Zero production incidents
- ✅ 100% backward compatibility
- ✅ Clean foundation for Phase 4 consolidation

---

## Communication Protocol

### Status Updates
**Frequency**: Daily
**Format**: Update progress checkboxes in this document
**Reviewers**: All contributors

### Blocker Escalation
**Immediate**: Document in "Current Blockers" section below
**Resolution**: Coordinate in comments or separate coordination document

### Current Blockers
*None - Updated: 2025-10-02*

---

## Next Actions

### Completed (2025-10-02)
1. ✅ Create this coordination document
2. ✅ Baseline: Backup current user.css for diff comparisons
3. ✅ Phase 2 Wave 1: Complete `_mixins.scss` migration (10 token refs)
4. ✅ Phase 2 Wave 1: Complete `_interaction_mixins.scss` migration (12 token refs)
5. ✅ Validation: Build + typecheck + CSS diff verification

### Next (Immediate)
1. ✅ Phase 2 Wave 2: Complete `_beat_sync_glassmorphism.scss` migration (DONE - 4 refs)
2. ✅ Phase 2 Wave 2: Complete `_action_bar_unified.scss` migration (DONE - 3 refs)
3. ✅ Phase 2 Wave 2: Complete `_top_bar.scss` migration (DONE - 5 refs)
4. ✅ Phase 2 Wave 2: Complete `_now_playing.scss` migration (DONE - 1 ref)
5. ✅ Phase 2 Wave 3: Complete `_particle_animation_system.scss` migration (DONE - 6 refs)
6. ✅ Phase 2 Wave 3: Complete `_cosmic_depth_system.scss` migration (DONE - 11 refs)
7. ⬜ Phase 2 Wave 3: Migrate `_fluid_morphing.scss` (NEXT - morphing animations)
8. ⬜ Phase 2 Wave 4: Start interactions files (microinteractions, css_interactions, text effects)
9. ⬜ Phase 2 Wave 5: Complete remaining files (enhanced cards, grid navigation)
10. ⬜ Phase 2 Wave 2: Migrate `_navbar.scss` (CONFLICT ZONE - defer until Phase 3 ready)

---

**Document Version**: 1.0
**Created**: 2025-10-02
**Last Updated**: 2025-10-02
**Next Review**: Daily during execution
