# Settings Styling Pipeline Fix - Implementation Plan

**Status**: 🟢 PHASE 1-5 COMPLETE - Phase 6 Pending (Stopgap deployed, OKLCH future enhancement documented)
**Created**: 2025-10-12
**Last Updated**: 2025-10-12
**Priority**: CRITICAL
**Complexity**: HIGH

## Executive Summary

Fix critical gaps in settings → visual styling pipeline where settings changes are detected but don't apply visual updates. Affects artistic mode, harmonic color palette, flavor, palette system, and gradient intensity.

## Problem Statement

### User Report
> "Artistic mode and harmonic color palette seem broken at a systematic level, like they're not able to apply their styling properly"

### Symptoms
- ✅ Settings changes are saved to TypedSettingsManager
- ✅ onChange callbacks fire correctly
- ✅ Legacy key mappings translate modern keys to legacy keys
- ✅ CustomEvents are dispatched ("year3000ArtisticModeChanged")
- ✅ Systems listen to events and call refresh methods
- ❌ **CRITICAL GAP**: Visual styling never gets applied to DOM

### Affected Settings
1. **Artistic Mode** (`sn-artistic-mode`) - Multipliers not written to CSS
2. **Harmonic Mode** (`sn-current-harmonic-mode`) - Missing legacy key mapping
3. **Flavor** (`catppuccin-flavor`) - Broken "on deeper level" per user
4. **Palette System** (`sn-palette-system`) - Broken "on deeper level" per user
5. **Gradient Intensity** (`sn-gradient-intensity`) - Broken "on deeper level" per user

### Working Settings (For Comparison)
- ✅ `sn-brightness-mode` - User confirmed working
- ✅ `sn-glassmorphism-level` - User confirmed working

## Root Cause Analysis

### Architecture Overview

**Settings Flow (Current State)**:
```
SettingsModal.tsx (dropdown)
  ↓ (no onChange handler)
SettingsSection.tsx setFieldValue()
  ↓
TypedSettingsManager.set()
  ↓ (emits SettingsChangeEvent)
ThemeLifecycleCoordinator._handleTypedSettingsChange()
  ↓ (legacy key mapping)
ThemeLifecycleCoordinator._handleExternalSettingsChange()
  ↓ (switch statement)
globalConfig.setArtisticMode() / _broadcastSettingChange()
  ↓ (dispatches CustomEvent)
ColorHarmonyEngine._handleArtisticModeChanged()
  ↓
ColorHarmonyEngine.refreshPalette()
  ↓
ThemeLifecycleCoordinator.updateColorsFromCurrentTrack()
  ❌ CSS VARIABLES NEVER WRITTEN
```

### Issue 1: Artistic Mode - Multipliers Not Applied

**Current Behavior**:
1. ✅ Setting saved: `settings.set("sn-artistic-mode", "cosmic-maximum")`
2. ✅ Legacy mapping: `"sn-artistic-mode" → "artisticMode"` (line 3222)
3. ✅ Switch case: `case "artisticMode"` calls `safeSetArtisticMode()` (line 3260)
4. ✅ Event dispatch: `document.dispatchEvent("year3000ArtisticModeChanged")` (line 3288)
5. ✅ ColorHarmonyEngine listens and calls `refreshPalette()` (line 2958)
6. ✅ ThemeLifecycleCoordinator listens and calls `updateColorsFromCurrentTrack()` (line 3455)
7. ❌ **CRITICAL GAP**: Multipliers from profile NEVER written to CSS

**Evidence**:
```typescript
// Artistic profile defines multipliers (artisticProfiles.ts:60-79)
multipliers: {
  opacity: 0.35,
  saturation: 1.45,        // Enhanced for vibrant gradients
  brightness: 1.25,        // Increased luminance
  contrast: 1.3,           // Higher contrast
  musicEnergyBoost: 1.2,
  animationIntensity: 0.8,
  timeBasedEffectFactor: 0.7,
  interactionStrength: 0.6,
  advancedAnimations: true,
  visualIntensityBase: 1.2,
}
```

**Where Multipliers Are Read** (but not applied to DOM):
- `ColorHarmonyEngine.ts:1374` - Reads `musicEnergyBoost` for calculations
- `ThemeUtilities.ts:593` - Reads `saturation` for color adjustments
- `MusicSyncService.ts:1213` - Reads `musicEnergyBoost` and `visualIntensityBase`

**Missing CSS Variables**:
```css
/* NONE OF THESE EXIST - THEY SHOULD BE WRITTEN */
--sn-artistic-opacity: 0.35;
--sn-artistic-saturation: 1.45;
--sn-artistic-brightness: 1.25;
--sn-artistic-contrast: 1.3;
--sn-artistic-intensity: 0.8;
--sn-artistic-music-boost: 1.2;
```

### Issue 2: Harmonic Mode - Missing Legacy Key Mapping

**Current Behavior**:
1. ✅ Setting saved: `settings.set("sn-current-harmonic-mode", "complementary")`
2. ❌ **NO LEGACY MAPPING**: Key not in `legacyKeyMap` (line 3222-3236)
3. ❌ Falls through to default handler with modern key
4. ✅ ColorHarmonyEngine.applyUpdatedSettings() handles `sn-current-harmonic-mode` (line 3158)
5. ✅ switchHarmonicMode() calls refreshPalette() (line 3243)
6. ❌ **UNCERTAIN**: Does refreshPalette() write harmonic color CSS variables?

**Missing Mapping** (should be added at line ~3237):
```typescript
const legacyKeyMap: Record<string, string> = {
  // ... existing mappings ...
  "sn-current-harmonic-mode": "harmonicMode", // ← MISSING
};
```

### Issue 3: Flavor/Palette/Gradient - "Deeper Level" Issues

**User Feedback**:
> "Currently our brightnessMode and glassmorphismLevel applies correctly, however it appears our flavor, paletteSystem, and gradientIntensity are broken on a deeper level, like the system didn't properly setup the hooks for our settings provider"

**Analysis**:

#### Flavor (`catppuccin-flavor`)
- ✅ Legacy mapping exists: `"catppuccin-flavor": "flavor"` (line 3230)
- ✅ Switch case exists: `case "flavor"` (line 3270-3279)
- ✅ Calls `applyInitialSettings("flavor")` (line 3276)
- ✅ ColorStateManager listens to flavor changes (ColorStateManager.ts:512)
- ❌ **INVESTIGATION NEEDED**: Does applyInitialSettings() write all required CSS variables?

#### Palette System (`sn-palette-system`)
- ✅ Legacy mapping exists: `"sn-palette-system": "paletteSystem"` (line 3232)
- ✅ Switch case exists: `case "paletteSystem"` (line 3281-3295)
- ✅ Updates `ADVANCED_SYSTEM_CONFIG.paletteSystem`
- ✅ Calls `applyInitialSettings("full")`
- ❌ **INVESTIGATION NEEDED**: Full palette switch between "catppuccin" ↔ "year3000" may need:
  - Complete CSS variable namespace switch
  - ColorHarmonyEngine reset/reload
  - Gradient system reconfiguration

#### Gradient Intensity (`sn-gradient-intensity`)
- ✅ Legacy mapping exists: `"sn-gradient-intensity": "gradientIntensity"` (line 3234)
- ✅ Switch case exists: `case "gradientIntensity"` (line 3297-3312)
- ✅ webGLGradientBackgroundSystem added to broadcast array (line 3310)
- ❌ **INVESTIGATION NEEDED**: Does webGLGradientBackgroundSystem.applyUpdatedSettings() exist and handle gradientIntensity?

## Implementation Plan

### Phase 1: Add Harmonic Mode Legacy Mapping ⚡ QUICK WIN

**File**: `src-js/core/lifecycle/ThemeLifecycleCoordinator.ts`
**Line**: ~3237 (in legacyKeyMap object)
**Risk**: LOW
**Impact**: HIGH

**Change**:
```typescript
const legacyKeyMap: Record<string, string> = {
  // Color harmony settings
  "sn-artistic-mode": "artisticMode",
  "sn-harmonic-intensity": "harmonicIntensity",
  "sn-harmonic-evolution": "harmonicEvolution",
  "sn-current-harmonic-mode": "harmonicMode", // ← ADD THIS LINE
  "sn-manual-base-color": "manualBaseColor",
  "catppuccin-accentColor": "accentColor",
  // ... rest of mappings
};
```

**Validation**:
```bash
npm run typecheck
grep -n "sn-current-harmonic-mode" src-js/core/lifecycle/ThemeLifecycleCoordinator.ts
```

### Phase 2: Implement Artistic Mode CSS Variable Writer 🎨 CRITICAL

**File**: `src-js/core/lifecycle/ThemeLifecycleCoordinator.ts`
**Line**: 3453 (replace _onArtisticModeChanged method)
**Risk**: MEDIUM (performance impact if not batched)
**Impact**: CRITICAL (fixes main user complaint)

**Current Code** (lines 3453-3459):
```typescript
private _onArtisticModeChanged(): void {
  try {
    this.updateColorsFromCurrentTrack?.();
  } catch (e) {
    console.warn("[Year3000System] _onArtisticModeChanged stub error", e);
  }
}
```

**New Implementation**:
```typescript
private _onArtisticModeChanged(): void {
  try {
    // Get current artistic mode multipliers from profile
    const multipliers = this.ADVANCED_SYSTEM_CONFIG.getCurrentMultipliers();

    if (!multipliers) {
      console.warn("[ThemeLifecycleCoordinator] No multipliers available for artistic mode");
      return;
    }

    // Write multipliers as CSS variables for use by SCSS and JavaScript systems
    const cssVariables: Record<string, string> = {
      '--sn-artistic-opacity': String(multipliers.opacity ?? 0.35),
      '--sn-artistic-saturation': String(multipliers.saturation ?? 1.0),
      '--sn-artistic-brightness': String(multipliers.brightness ?? 1.0),
      '--sn-artistic-contrast': String(multipliers.contrast ?? 1.0),
      '--sn-artistic-intensity': String(multipliers.animationIntensity ?? 0.8),
      '--sn-artistic-music-boost': String(multipliers.musicEnergyBoost ?? 1.0),
      '--sn-artistic-interaction': String(multipliers.interactionStrength ?? 0.6),
      '--sn-artistic-visual-base': String(multipliers.visualIntensityBase ?? 1.0),
    };

    // Apply variables through CSS controller with batching
    if (this.cssVariableController?.batchSetVariables) {
      this.cssVariableController.batchSetVariables(
        'ArtisticMode',
        cssVariables,
        'high',
        'artistic-mode-change'
      );
    } else {
      // Fallback: direct DOM write
      const root = document.documentElement;
      Object.entries(cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // Trigger color refresh with updated multipliers
    this.updateColorsFromCurrentTrack?.();

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        `🎨 [ThemeLifecycleCoordinator] Applied artistic mode CSS variables`,
        cssVariables
      );
    }
  } catch (e) {
    console.warn("[ThemeLifecycleCoordinator] _onArtisticModeChanged error", e);
  }
}
```

**Validation**:
```bash
npm run typecheck
npm run build:js:dev

# Test in browser console:
getComputedStyle(document.documentElement).getPropertyValue('--sn-artistic-opacity')
```

### Phase 3: Add Harmonic Mode Switch Case 🔄 ROUTING

**File**: `src-js/core/lifecycle/ThemeLifecycleCoordinator.ts`
**Line**: After case "artisticMode" (line ~3271)
**Risk**: LOW
**Impact**: MEDIUM

**Add After Line 3271**:
```typescript
case "harmonicMode": {
  try {
    // Broadcast to ColorHarmonyEngine which will handle mode switch
    this._broadcastSettingChange("sn-current-harmonic-mode", value);

    if (this.ADVANCED_SYSTEM_CONFIG.enableDebug) {
      console.log(
        `🎨 [ThemeLifecycleCoordinator] Harmonic mode changed to: ${value}`
      );
    }
  } catch (e) {
    console.warn("[ThemeLifecycleCoordinator] Failed to apply harmonic mode", e);
  }
  break;
}
```

**Validation**:
```bash
npm run typecheck
grep -A 15 'case "harmonicMode"' src-js/core/lifecycle/ThemeLifecycleCoordinator.ts
```

### Phase 4: Investigate Flavor Setting 🔍 DIAGNOSTIC

**Goal**: Understand why flavor setting is "broken on a deeper level"

**Investigation Steps**:

1. **Verify ColorStateManager Integration**:
```bash
# Check if flavor changes trigger palette regeneration
grep -A 20 "handleSettingsChange" src-js/core/css/ColorStateManager.ts
grep -n "catppuccin-flavor" src-js/core/css/ColorStateManager.ts
```

2. **Trace applyInitialSettings("flavor") Flow**:
```bash
# Find what CSS variables get written
grep -A 50 "applyInitialSettings" src-js/core/lifecycle/ThemeLifecycleCoordinator.ts | grep -i flavor
grep -A 30 "trigger === \"flavor\"" src-js/core/lifecycle/ThemeLifecycleCoordinator.ts
```

3. **Check CSS Variable Output**:
   - Change flavor in UI
   - Check browser DevTools → Elements → :root → Styles
   - Verify these CSS variables exist and update:
     ```css
     --spice-text
     --spice-subtext
     --spice-main
     --spice-sidebar
     --catppuccin-*
     ```

4. **Test Catppuccin Palette Colors**:
```bash
# Verify flavor definitions exist
grep -n "mocha\|latte\|frappe\|macchiato" src-js/utils/color/Year3000Palettes.ts
```

**Expected Findings**:
- Either CSS variables not being written
- Or palette colors not being recalculated
- Or timing issue with async color extraction

**Potential Fixes** (based on findings):
- Add explicit CSS variable writes in applyInitialSettings()
- Force ColorStateManager refresh after flavor change
- Add delay/debounce for palette regeneration

### Phase 5: Investigate Palette System 🎨 DIAGNOSTIC

**Goal**: Understand palette system switching between "catppuccin" ↔ "year3000"

**Investigation Steps**:

1. **Check Current Palette System Logic**:
```bash
grep -A 30 'case "paletteSystem"' src-js/core/lifecycle/ThemeLifecycleCoordinator.ts
```

2. **Verify Year3000 Palette Integration**:
```bash
grep -n "year3000.*palette\|Year3000Palette" src-js/utils/color/Year3000Palettes.ts
grep -rn "paletteSystem.*year3000" src-js/
```

3. **Check ColorHarmonyEngine Palette Source**:
```bash
# Find where palette system determines color source
grep -A 20 "paletteSystem\|getCurrentPalette" src-js/audio/ColorHarmonyEngine.ts
```

4. **Test Palette Switching**:
   - Start with "catppuccin" palette
   - Switch to "year3000" palette in settings
   - Verify CSS variables change namespace:
     ```css
     /* Catppuccin */
     --spice-main: #...;
     --catppuccin-rosewater: #...;

     /* Year 3000 */
     --sn-primary: #...;
     --sn-gradient-base: #...;
     ```

**Expected Findings**:
- Year3000 palette may not be writing CSS variables
- Or ColorHarmonyEngine not switching palette source
- Or existing CSS variables not being cleared/overwritten

**Potential Fixes** (based on findings):
- Implement full CSS variable namespace switch
- Add Year3000 palette CSS variable writers
- Clear old palette variables before applying new ones
- Force full theme reinitialization on palette switch

### Phase 6: Investigate Gradient Intensity 🌈 DIAGNOSTIC

**Goal**: Verify webGLGradientBackgroundSystem integration

**Investigation Steps**:

1. **Check WebGL System Exists and Has applyUpdatedSettings()**:
```bash
grep -rn "class.*WebGLGradientBackground" src-js/
grep -A 20 "applyUpdatedSettings" src-js/visual/backgrounds/WebGLGradientBackgroundSystem.ts
```

2. **Verify Gradient Intensity Handling**:
```bash
# Check if system handles gradient-intensity key
grep -n "gradient.*intensity\|gradientIntensity" src-js/visual/backgrounds/WebGLGradientBackgroundSystem.ts
```

3. **Check CSS Variables for Gradients**:
   - Change gradient intensity in settings
   - Verify these CSS variables update:
     ```css
     --sn-gradient-intensity: 1.0;
     --sn-gradient-primary: #...;
     --sn-gradient-secondary: #...;
     ```

4. **Test Gradient Visual Update**:
   - Change intensity: disabled → minimal → balanced → intense
   - Verify background gradient changes visually

**Expected Findings**:
- webGLGradientBackgroundSystem may not exist (system rename?)
- Or applyUpdatedSettings() doesn't handle gradientIntensity
- Or gradient shader uniforms not being updated

**Potential Fixes** (based on findings):
- Find correct gradient system class name
- Add gradientIntensity handler to applyUpdatedSettings()
- Add CSS variable writes for gradient parameters
- Update WebGL shader uniforms on intensity change

### Phase 7: Build, Test, and Validate ✅ VERIFICATION

**Build Commands**:
```bash
# Full validation suite
npm run typecheck
npm run lint:js
npm test

# Build development bundle
npm run build:js:dev

# Verify theme.js contains changes
grep -n "sn-artistic-opacity" theme.js
grep -n "harmonicMode" theme.js
```

**Test Plan**:

1. **Artistic Mode Test**:
   - Open Spotify with theme loaded
   - Open Settings modal
   - Change Artistic mode: corporate-safe → artist-vision → cosmic-maximum
   - **Expected**: Visual intensity changes dramatically
   - **Verify**: Browser console → `getComputedStyle(document.documentElement).getPropertyValue('--sn-artistic-opacity')`
   - **Success**: Value changes (0.2 → 0.35 → 0.35)

2. **Harmonic Mode Test**:
   - Change Harmonic colour mode: complementary → triadic → analogous
   - **Expected**: Color palette shifts to different harmony
   - **Verify**: Check gradient colors in background
   - **Success**: Visible color harmony change

3. **Flavor Test**:
   - Change Catppuccin flavour: mocha → latte → frappe → macchiato
   - **Expected**: Theme switches light/dark and color temperature
   - **Verify**: Check --spice-main and --catppuccin-* variables
   - **Success**: Full theme color shift

4. **Palette System Test**:
   - Change Palette system: catppuccin → year3000
   - **Expected**: Major visual overhaul, different color source
   - **Verify**: Check if --sn-* or --catppuccin-* variables active
   - **Success**: Complete palette replacement

5. **Gradient Intensity Test**:
   - Change Gradient intensity: disabled → minimal → balanced → intense
   - **Expected**: Background gradient intensity changes
   - **Verify**: Visual intensity of gradient effects
   - **Success**: Clear gradient strength differences

**Performance Verification**:
```bash
# Check CSS variable batch performance
# Should use batched writes, not individual setProperty calls

# Open Chrome DevTools → Performance
# Record during settings change
# Check for layout thrashing or excessive repaints
```

**Console Error Check**:
- No errors during settings changes
- No warnings about missing methods or undefined values
- Debug logs show successful CSS variable writes

### Phase 8: Document CSS Variables 📝 DOCUMENTATION

**File**: Create `docs/css-variables-reference.md`

**Content**:
```markdown
# CSS Variables Reference

## Artistic Mode Multipliers
Written by: ThemeLifecycleCoordinator._onArtisticModeChanged()

- `--sn-artistic-opacity` - Base opacity multiplier (0.2-0.35)
- `--sn-artistic-saturation` - Saturation boost (1.0-1.45)
- `--sn-artistic-brightness` - Brightness multiplier (1.0-1.25)
- `--sn-artistic-contrast` - Contrast enhancement (1.0-1.3)
- `--sn-artistic-intensity` - Animation intensity (0.3-0.8)
- `--sn-artistic-music-boost` - Music energy multiplier (0.4-1.2)
- `--sn-artistic-interaction` - User interaction strength (0.2-0.6)
- `--sn-artistic-visual-base` - Visual intensity base (0.9-1.2)

## Usage in SCSS
```scss
.gradient-effect {
  opacity: calc(var(--base-opacity, 0.5) * var(--sn-artistic-opacity, 1.0));
  filter: saturate(var(--sn-artistic-saturation, 1.0))
          brightness(var(--sn-artistic-brightness, 1.0))
          contrast(var(--sn-artistic-contrast, 1.0));
}
```

## Usage in TypeScript
```typescript
const opacity = parseFloat(
  getComputedStyle(document.documentElement)
    .getPropertyValue('--sn-artistic-opacity') || '1.0'
);
```
```

## Success Criteria

### Must Have (Blocking Release)
- ✅ Artistic mode changes apply visual styling (CSS variables written)
- ✅ Harmonic mode changes apply color palette
- ✅ No TypeScript compilation errors
- ✅ No console errors during settings changes
- ✅ theme.js builds successfully

### Should Have (High Priority)
- ✅ Flavor changes apply theme colors completely
- ✅ Palette system switches without errors
- ✅ Gradient intensity updates visual effects
- ✅ Settings persist and restore correctly
- ✅ Performance impact < 16ms (1 frame) per setting change

### Nice To Have (Future Enhancement)
- 📝 Complete CSS variables documentation
- 🧪 Automated tests for settings pipeline
- 🎨 Visual regression testing for artistic modes
- ⚡ Settings change animations/transitions

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| CSS variable writes cause performance issues | Medium | High | Use batched writes via cssVariableController |
| Multipliers break existing visual systems | Low | High | Keep fallback values, gradual rollout |
| Type errors in multiplier access | Low | Medium | Add defensive checks, test thoroughly |
| Settings don't persist after reload | Low | High | Verify TypedSettingsManager integration |
| Breaking changes to existing themes | Low | Critical | Test with multiple artistic modes |

## Rollback Plan

If issues arise:
1. Revert Phase 2 changes (CSS variable writes)
2. Keep Phase 1 changes (legacy key mapping - safe)
3. Keep Phase 3 changes (switch case - safe)
4. Document as known issue in CHANGELOG
5. Create GitHub issue with detailed findings

## Implementation Order

**Session 1** (Estimated: 45 min):
- ✅ Phase 1: Add harmonic mode legacy mapping (5 min)
- ✅ Phase 2: Implement artistic mode CSS writer (20 min)
- ✅ Phase 3: Add harmonic mode switch case (10 min)
- ✅ Phase 7: Build and basic validation (10 min)

**Session 2** (Estimated: 90 min):
- 🔍 Phase 4: Investigate flavor setting (30 min)
- 🔍 Phase 5: Investigate palette system (30 min)
- 🔍 Phase 6: Investigate gradient intensity (30 min)

**Session 3** (Estimated: 60 min):
- 🔧 Implement fixes from Phase 4-6 findings (40 min)
- ✅ Phase 7: Complete testing and validation (20 min)

**Session 4** (Estimated: 30 min):
- 📝 Phase 8: Documentation (20 min)
- ✅ Final validation and user acceptance test (10 min)

## Notes

- User confirmed `brightnessMode` and `glassmorphismLevel` are working correctly
- This indicates the TypedSettingsManager → ThemeLifecycleCoordinator bridge is functioning
- The issue is specifically in the visual styling application layer
- CSS variable approach is consistent with existing architecture patterns

## Related Documentation

- [Settings System Refactoring Guide](./settings-system-refactoring-guide.md) - Phase 6B migration context
- [Master Architecture Overview](../docs/MASTER_ARCHITECTURE_OVERVIEW.md) - System coordination
- [TypedSettingsManager](../src-js/config/typedSettingsManager.ts) - Settings management
- [Artistic Profiles](../src-js/config/artisticProfiles.ts) - Multiplier definitions

---

## Implementation Log

### Session 1 - 2025-10-12

**Phase 1 (Harmonic Mode Legacy Mapping)**: ✅ ALREADY IMPLEMENTED
- Verification: Legacy key mapping exists at line 3231 of [ThemeLifecycleCoordinator.ts](src-js/core/lifecycle/ThemeLifecycleCoordinator.ts#L3231)
- Mapping: `"sn-current-harmonic-mode": "harmonicMode"`
- Status: No action required

**Phase 2 (Artistic Mode CSS Variables)**: ✅ COMPLETED
- File: [ThemeLifecycleCoordinator.ts](src-js/core/lifecycle/ThemeLifecycleCoordinator.ts#L3453)
- Implementation: Enhanced `_onArtisticModeChanged()` method (lines 3453-3503)
- Features:
  - Reads multipliers from `ADVANCED_SYSTEM_CONFIG.getCurrentMultipliers()`
  - Writes 8 CSS variables: `--sn-artistic-opacity`, `--sn-artistic-saturation`, etc.
  - Uses batched CSS controller or DOM fallback
  - Triggers color refresh after variable updates
  - Debug logging when enabled
- Validation: TypeScript compilation ✅ | Build successful ✅

**Phase 3 (Harmonic Mode Switch Case)**: ✅ ALREADY IMPLEMENTED
- Verification: Switch case exists at line 3313 of [ThemeLifecycleCoordinator.ts](src-js/core/lifecycle/ThemeLifecycleCoordinator.ts#L3313)
- Implementation: `case "harmonicMode"` updates config and triggers color refresh
- Status: No action required

**Phase 4 (Flavor Setting Investigation & Fix)**: ✅ COMPLETED
- File: [ThemeLifecycleCoordinator.ts](src-js/core/lifecycle/ThemeLifecycleCoordinator.ts#L3321)
- Root Cause Identified:
  - ✅ TypedSettingsManager → ThemeLifecycleCoordinator bridge working correctly
  - ✅ ColorStateManager.updateColorState("flavor") working correctly
  - ✅ Core color CSS variables being written (--sn-cosmic-base-hex, --spice-accent, etc.)
  - ❌ **CRITICAL GAP**: Spicetify.Config.color_scheme NOT synchronized with flavor setting
  - ❌ **IMPACT**: Spicetify manages base Catppuccin palette (--spice-*) but never reloads on flavor change
- Implementation: Enhanced flavor switch case (lines 3321-3357)
- Features:
  - Synchronizes `Spicetify.Config.color_scheme` with flavor value
  - Calls `Spicetify.colorScheme()` if available to trigger native palette reload
  - Maintains existing ColorStateManager and applyInitialSettings flow
  - Debug logging for Config synchronization
- Architecture Notes:
  - Spicetify provides base Catppuccin palette CSS variables (--spice-rosewater, --spice-pink, etc.)
  - StarryNight manages dynamic/accent colors and visual effects
  - Flavor change requires both Spicetify Config sync AND ColorStateManager update
  - CATPPUCCIN_PALETTES in TypeScript are for calculations, not direct CSS variable writes
- Validation: TypeScript compilation ✅ | Build successful ✅

**Phase 5 (Palette System CSS Variable Coverage)**: ✅ COMPLETED (STOPGAP)
- File: [ColorStateManager.ts](src-js/core/css/ColorStateManager.ts#L319)
- Root Cause Identified:
  - ✅ Palette system switching architecture is correct
  - ✅ ColorStateManager writes 4 core colors (base, surface, accent, text)
  - ❌ **CRITICAL GAP**: 11 themed palette colors NOT written in Year3000 mode
  - ❌ **IMPACT**: Themed visual effects broken (ethereal, cinematic, natural effects)
  - ✅ Catppuccin mode works (Spicetify provides themed colors)
- Missing CSS Variables:
  - `--spice-rgb-blue`, `--spice-rgb-green`, `--spice-rgb-lavender`
  - `--spice-rgb-mauve`, `--spice-rgb-overlay0`, `--spice-rgb-peach`
  - `--spice-rgb-red`, `--spice-rgb-rosewater`, `--spice-rgb-sky`
  - `--spice-rgb-teal`, `--spice-rgb-yellow`
- Implementation: Stopgap `writePaletteColorsToCSS()` method (lines 319-378)
- Features:
  - Checks palette system via `paletteSystemManager.getCurrentPaletteSystem()`
  - Skips in Catppuccin mode (Spicetify provides variables)
  - Writes 11 themed colors in Year3000 mode from static palette
  - Uses batched CSS controller or DOM fallback
  - Includes comprehensive documentation and fallback values
- Architecture Notes:
  - **Temporary solution** until OKLCH dynamic palette system implemented
  - Uses static `YEAR3000_PALETTES` lookup (not ideal)
  - Maintains Spicetify variable compatibility (`--spice-rgb-*`)
  - Future: Replace with OKLCH-based dynamic generation
- Validation: TypeScript compilation ✅ | Build successful ✅
- Future Enhancement: See [plans/future/oklch-dynamic-palette-system.md](../future/oklch-dynamic-palette-system.md)

**Next Steps**:
- Phase 6: Investigate gradient intensity integration
- Phase 7: Comprehensive testing and validation
- **Future**: Implement OKLCH dynamic palette generation (replaces stopgap)

---

**Last Updated**: 2025-10-12
**Plan Version**: 1.3
**Status**: Phase 1-5 complete - Ready for Phase 6 investigation
