# Migration Quick Reference Guide
**Quick lookup for Phase 2-3 parallel execution**

## Phase 2: Token Migration Patterns

### Find & Replace Patterns
```bash
# Use with caution - validate each change
# Recommended: Manual review for each file

# Pattern 1: Beat Pulse Intensity
--sn-beat-pulse-intensity
→ --sn-music-beat-pulse-intensity

# Pattern 2: Rhythm Phase
--sn-rhythm-phase
→ --sn-music-rhythm-phase

# Pattern 3: Breathing Scale
--sn-breathing-scale
→ --sn-music-breathing-scale

# Pattern 4: Spectrum Phase
--sn-spectrum-phase
→ --sn-music-spectrum-phase

# Pattern 5: Energy Level
--sn-energy-level
→ --sn-music-energy-level

# Pattern 6: Valence
--sn-valence
→ --sn-music-valence

# Pattern 7: Tempo BPM
--sn-tempo-bpm
→ --sn-music-tempo-bpm
```

### Common Code Patterns

#### Before (Legacy)
```scss
// Glassmorphism beat sync
.glass-effect {
  opacity: calc(
    var(--base-opacity, 0.1) *
    (1 + var(--sn-beat-pulse-intensity, 0) * 0.5)
  );
  filter: hue-rotate(var(--sn-rhythm-phase, 0deg));
}

// Particle animation
.particle {
  transform: scale(var(--sn-breathing-scale, 1.0));
  animation-duration: calc(60s / var(--sn-tempo-bpm, 120));
}
```

#### After (Modern)
```scss
// Glassmorphism beat sync
.glass-effect {
  opacity: calc(
    var(--base-opacity, 0.1) *
    (1 + var(--sn-music-beat-pulse-intensity, 0) * 0.5)
  );
  filter: hue-rotate(var(--sn-music-rhythm-phase, 0deg));
}

// Particle animation
.particle {
  transform: scale(var(--sn-music-breathing-scale, 1.0));
  animation-duration: calc(60s / var(--sn-music-tempo-bpm, 120));
}
```

---

## Phase 3: Selector Migration Patterns

### Selector Replacement Map

```scss
/* Navigation & Layout */
.main-navBar-navBar              → .Root__nav-bar
.main-nowPlayingWidget-nowPlaying → .Root__now-playing-bar
.main-search-searchBar           → [data-testid='search-input']
.main-topBar-topBar              → .main-actionBar-ActionBarRow

/* Cards & Media */
.main-card-card                  → .sn-card, .main-card-card
.main-cardImage-image            → .main-cardImage-image (unchanged)

/* Track Lists */
.main-trackList-trackList        → [role='grid'][aria-label*='tracks']
.main-trackList-trackListRow     → .main-trackList-trackListRow (unchanged)

/* Queue */
.main-queue-queue                → .main-queue-trackList
```

### Dual Selector Pattern (Recommended)

#### Pattern: Add modern selector, keep legacy
```scss
/* BEFORE */
.main-navBar-navBar {
  background: var(--sn-bg-primary);

  &:hover {
    opacity: 0.8;
  }
}

/* AFTER - Dual selector for compatibility */
.Root__nav-bar,
.main-navBar-navBar {
  background: var(--sn-bg-primary);

  &:hover {
    opacity: 0.8;
  }
}
```

#### Pattern: Nested selectors
```scss
/* BEFORE */
.main-navBar-navBar {
  .nav-item {
    color: var(--text-primary);
  }
}

/* AFTER */
.Root__nav-bar,
.main-navBar-navBar {
  .nav-item {
    color: var(--text-primary);
  }
}
```

#### Pattern: Multiple selectors in same rule
```scss
/* BEFORE */
.main-card-card,
.playlist-card {
  border-radius: 8px;
}

/* AFTER */
.sn-card,
.main-card-card,
.playlist-card {
  border-radius: 8px;
}
```

---

## Validation Checklist (Per File)

### Phase 2: Token Migration
- [ ] Search file for all legacy token references
- [ ] Replace with modern `--sn-music-*` equivalents
- [ ] Check for fallback values - keep unchanged
- [ ] Verify no typos in new token names
- [ ] Run: `npm run build:css:dev`
- [ ] Visual check: Specific effect still works
- [ ] Commit with message: `phase2(filename): migrate music tokens`

### Phase 3: Selector Migration
- [ ] Identify all legacy selectors in file
- [ ] Add modern selectors (keep legacy for now)
- [ ] Use dual selector pattern (modern, legacy)
- [ ] Check nested selectors updated correctly
- [ ] Run: `npm run build:css:dev`
- [ ] Visual check: Elements still styled correctly
- [ ] DOM check: `document.querySelectorAll('.modern-selector')`
- [ ] Commit with message: `phase3(filename): modernize DOM selectors`

---

## Testing Commands

### Build Validation
```bash
# TypeScript check
npm run typecheck

# SCSS compilation
npm run build:css:dev

# Full validation
npm run validate

# Build size check
npm run build:css:prod
ls -lh user.css  # Check file size hasn't changed significantly
```

### Diff Validation
```bash
# Create baseline before starting
cp user.css user.css.baseline

# After each file change
npm run build:css:dev
diff user.css.baseline user.css | head -50

# Check specific token changes
grep -n "sn-music-beat-pulse-intensity" user.css
grep -n "sn-beat-pulse-intensity" user.css  # Should only be in legacy aliases
```

### Visual Testing Checklist
**Phase 2 - Music Sync:**
- [ ] Play music in Spotify
- [ ] Observe glassmorphism pulsing with beat
- [ ] Check particle animations respond to music
- [ ] Verify card hover effects pulse
- [ ] Test sidebar glow with rhythm
- [ ] Validate action bar responds to tempo

**Phase 3 - DOM Selectors:**
- [ ] Navigate to Home, Search, Library, Playlist
- [ ] Check navbar styling applied
- [ ] Verify card styles present
- [ ] Test now playing widget appearance
- [ ] Hover over interactive elements
- [ ] Check focus states work
- [ ] Validate modal/overlay styling

---

## Rollback Procedure

### If Migration Breaks Something

1. **Immediate rollback:**
```bash
git checkout HEAD -- src/path/to/broken-file.scss
npm run build:css:dev
```

2. **Identify issue:**
```bash
# Compare outputs
diff user.css.backup user.css > migration-diff.txt
# Look for unexpected changes
```

3. **Fix and retry:**
- Review migration pattern
- Check for typos in token/selector names
- Verify fallback values preserved
- Test in isolation

4. **Document issue:**
- Add to "Known Issues" section in main plan
- Update coordination document

---

## Common Issues & Solutions

### Issue: Token not defined
**Symptom:** CSS shows `var(--sn-music-undefined-token)`
**Solution:** Check token name spelling, verify exists in `tokens.scss`

### Issue: Selector not matching
**Symptom:** Styles not applying after selector update
**Solution:**
- Check modern selector exists in DOM (browser inspect)
- Use dual selector pattern (modern + legacy)
- Verify no typos in selector name

### Issue: Visual regression
**Symptom:** Effect looks different after migration
**Solution:**
- Diff the generated CSS before/after
- Check if fallback value changed
- Verify token cascade (cosmic → dynamic → color)

### Issue: Build fails
**Symptom:** SCSS compilation error
**Solution:**
- Check for syntax errors (missing semicolon, parenthesis)
- Verify variable interpolation syntax correct
- Look for circular dependencies

---

## Git Workflow

### Branch Management
```bash
# Phase 2 work
git checkout -b phase-2-token-alignment
# Make changes, commit
git add src/path/to/file.scss
git commit -m "phase2(filename): migrate music tokens"

# Phase 3 work (separate branch)
git checkout main
git checkout -b phase-3-selector-modern
# Make changes, commit
git add src/path/to/file.scss
git commit -m "phase3(filename): modernize selectors"
```

### Merge Strategy
```bash
# Merge Phase 2 exclusive files first
git checkout main
git merge phase-2-token-alignment --no-ff

# Then Phase 3 exclusive files
git merge phase-3-selector-modern --no-ff

# For conflict zone files, merge sequentially per file
# (coordinate which phase touches file first)
```

---

## Quick File Reference

### Phase 2 Only (Safe to work independently)
```
_mixins.scss
_interaction_mixins.scss
_action_bar_unified.scss
_top_bar.scss
_now_playing.scss
_particle_animation_system.scss
_fluid_morphing.scss
```

### Phase 3 Only (Safe to work independently)
```
_sn_card_base.scss
_sidebar_interactive.scss
_crystalline_glassmorphism.scss
_beat_synchronization.scss
_sn_active_loading_states.scss
_audio-reactive-atmospherics.scss
_white_layer_fixes.scss
_content_protection_system.scss
_genre_aware_ui.scss
_dynamic_interface.scss
_performance_mixins.scss
```

### Both Phases - Coordinate! ⚠️
```
_beat_sync_glassmorphism.scss  (P2 first)
_navbar.scss                   (P3 first)
_sn_enhanced_cards.scss        (P2 first)
_microinteractions.scss        (P2 first)
_css_interactions.scss         (P2 first)
_cosmic_depth_system.scss      (P2 first)
_text_visual_effects.scss      (P2 first)
_grid_navigation_mode.scss     (P2 first)
```

---

**Version**: 1.0
**Last Updated**: 2025-10-02
