# Color Flow Architecture - Sequence Diagram

## Overview

This document describes the complete flow of color processing from OKLAB color extraction through to DOM application, including the Phase 3 performance optimizations (change detection and metrics tracking).

## High-Level Flow

```
ColorHarmonyEngine (OKLAB processing)
  ↓ updateWithAlbumColors(oklabColors)
SpicetifyColorBridge
  ↓ detectChangedVariables() [Phase 3 optimization]
  ↓ batchSetVariables() (only changed variables)
UnifiedCSSVariableManager
  ↓ Priority batching & DOM application
DOM (--spice-* and --sn-* CSS variables)
  ↓ colors:applied event emission
System Integration & Subscribers
```

## Detailed Sequence Diagram

### Phase 1: Color Extraction and OKLAB Processing

```
┌─────────────────────┐
│ Album Art Change    │
│ (Track Navigation)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ ColorHarmonyEngine                      │
│                                         │
│ 1. Extract colors from album art       │
│ 2. Convert to OKLAB color space        │
│ 3. Process with color science          │
│ 4. Generate color distribution         │
│    - Primary, secondary, tertiary      │
│    - Vibrant, muted, dark, light       │
└──────────┬──────────────────────────────┘
           │
           │ oklabColors: Record<string, string>
           │ (96 color variations)
           ▼
```

### Phase 2: Color Bridge Processing (Entry Point)

```
┌──────────────────────────────────────────────────────────────────┐
│ SpicetifyColorBridge.updateWithAlbumColors(oklabColors)          │
│                                                                  │
│ Entry Point: Line 435                                           │
│ Receives: OKLAB-processed colors from ColorHarmonyEngine        │
└──────────┬───────────────────────────────────────────────────────┘
           │
           │ START PERFORMANCE TIMING (Phase 3)
           │ updateStartTime = performance.now()
           │
           ▼
```

### Phase 3: Color Variable Mapping

```
┌──────────────────────────────────────────────────────────────────┐
│ Variable Mapping Phase (Lines 437-620)                          │
│                                                                  │
│ 1. Extract Key Colors                                           │
│    primaryColor = oklabColors['OKLAB_PRIMARY'] || fallbacks     │
│    accentColor, textColor, backgroundColors, etc.               │
│                                                                  │
│ 2. Map to Spicetify Variables (--spice-*)                       │
│    allSpicetifyUpdates = {                                      │
│      '--spice-text': textColor,                                 │
│      '--spice-main': accentColor,                               │
│      '--spice-accent': accentColor,                             │
│      ... (34 Spicetify variables)                               │
│    }                                                             │
│                                                                  │
│ 3. Map to StarryNight Legacy Variables (--*)                    │
│    starryNightUpdates = {                                       │
│      '--main-color': primaryColor,                              │
│      '--accent-color': accentColor,                             │
│      ... (compatibility variables)                              │
│    }                                                             │
│                                                                  │
│ 4. Map to Modern StarryNight Variables (--sn-color-*)           │
│    snColorUpdates = {                                           │
│      '--sn-color-primary': primaryColor,                        │
│      '--sn-color-accent': accentColor,                          │
│      ... (62 modern variables)                                  │
│    }                                                             │
└──────────┬───────────────────────────────────────────────────────┘
           │
           │ Total: 96 CSS variables mapped
           │
           ▼
```

### Phase 4: Change Detection (Phase 3 Optimization)

```
┌──────────────────────────────────────────────────────────────────┐
│ Change Detection Phase (Lines 621-649)                          │
│                                                                  │
│ 1. Combine All Variable Updates                                 │
│    allVariableUpdates = {                                       │
│      ...allSpicetifyUpdates,                                    │
│      ...starryNightUpdates,                                     │
│      ...snColorUpdates                                          │
│    }                                                             │
│                                                                  │
│ 2. Detect Changed Variables (NEW in Phase 3)                    │
│    changedVariables = detectChangedVariables(allVariableUpdates)│
│                                                                  │
│    Algorithm (Lines 703-719):                                   │
│    ┌────────────────────────────────────────────────────┐      │
│    │ for each (key, value) in newVariables:            │      │
│    │   if lastAppliedVariables[key] !== value:         │      │
│    │     changed[key] = value                           │      │
│    │     changeCount++                                  │      │
│    └────────────────────────────────────────────────────┘      │
│                                                                  │
│ 3. Early Return Optimization                                    │
│    if (changedVariables.length === 0):                          │
│      skippedUpdateCount++                                       │
│      return (skip DOM update entirely)                          │
│                                                                  │
│ Expected Efficiency: ~90% skip rate during same-album playback  │
└──────────┬───────────────────────────────────────────────────────┘
           │
           │ Only changed variables proceed
           │
           ▼
```

### Phase 5: CSS Controller Integration

```
┌──────────────────────────────────────────────────────────────────┐
│ UnifiedCSSVariableManager Integration (Line 640)                 │
│                                                                  │
│ cssController.batchSetVariables(                                │
│   source: "SpicetifyColorBridge",                               │
│   variables: changedVariables,  // Only changed vars            │
│   priority: "critical",                                         │
│   reason: "album-color-update-optimized"                        │
│ )                                                                │
└──────────┬───────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│ UnifiedCSSVariableManager Processing                             │
│                                                                  │
│ 1. Priority Queue Management                                    │
│    - Critical priority = immediate processing                   │
│    - Batches variables for efficient DOM update                 │
│                                                                  │
│ 2. DOM Application                                               │
│    for each (key, value) in changedVariables:                   │
│      document.documentElement.style.setProperty(key, value)     │
│                                                                  │
│ 3. Performance Optimization                                      │
│    - Single batch operation reduces reflows                     │
│    - Critical priority bypasses queue                           │
└──────────┬───────────────────────────────────────────────────────┘
           │
           ▼
```

### Phase 6: DOM Update and Cache

```
┌──────────────────────────────────────────────────────────────────┐
│ DOM Updated (Lines 645-666)                                      │
│                                                                  │
│ 1. CSS Variables Applied to :root                               │
│    Only changed variables written to DOM                        │
│                                                                  │
│ 2. Update Cache (Line 645)                                      │
│    lastAppliedVariables = {                                     │
│      ...lastAppliedVariables,                                   │
│      ...allVariableUpdates  // Cache ALL for next comparison    │
│    }                                                             │
│                                                                  │
│ 3. Track Performance Metrics (Lines 654-666, Phase 3)           │
│    updateDuration = performance.now() - updateStartTime         │
│    lastUpdateDuration = updateDuration                          │
│    updateDurations.push(updateDuration)                         │
│    if (updateDurations.length > 10):                            │
│      updateDurations.shift()  // Keep rolling window            │
│                                                                  │
│ 4. Update Counters                                               │
│    lastColorUpdate = Date.now()                                 │
│    colorUpdateCount++                                           │
└──────────┬───────────────────────────────────────────────────────┘
           │
           ▼
```

### Phase 7: Event Emission and System Integration

```
┌──────────────────────────────────────────────────────────────────┐
│ Event Emission (Lines 669-677)                                   │
│                                                                  │
│ unifiedEventBus.emitSync('colors:applied', {                    │
│   cssVariables: allVariableUpdates,  // All vars for consumers  │
│   accentHex: colorDistribution.primary,                         │
│   accentRgb: rgbDistribution.primary,                           │
│   appliedAt: this.lastColorUpdate                               │
│ })                                                               │
└──────────┬───────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│ System Integration & Subscribers                                 │
│                                                                  │
│ Potential subscribers to 'colors:applied' event:                │
│ - UIVisualEffectsController (glow effects)                      │
│ - Background systems (color harmonization)                      │
│ - Other visual systems needing color sync                       │
│                                                                  │
│ All subscribers receive full color set for their needs          │
└──────────────────────────────────────────────────────────────────┘
```

## Performance Metrics (Phase 3)

### Tracked Metrics

The system tracks these performance indicators (exposed via `healthCheck()`):

```typescript
metrics: {
  // Existing metrics
  initialized: boolean
  spicetifyAvailable: boolean
  cssControllerAvailable: boolean
  lastColorUpdate: timestamp
  colorUpdateCount: number
  eventSubscriptions: number
  cacheSize: number
  lastCacheUpdate: timestamp

  // Phase 3 performance metrics
  lastUpdateDuration: number          // Most recent update time (ms)
  averageUpdateDuration: number       // Rolling average of last 10 updates (ms)
  skippedUpdateCount: number          // Updates skipped via change detection
  changeDetectionEfficiency: number   // % of updates skipped (0-100)
  cssVariablesManaged: 96            // Total variables under management
  updatePerformanceStatus: string     // 'optimal' | 'acceptable' | 'needs-optimization'
}
```

### Performance Thresholds

```
Optimal:      < 50ms average update duration
Acceptable:   50-100ms average update duration
Needs Work:   > 100ms average update duration
```

### Health Check Integration

The `healthCheck()` method (lines 787-849) validates:

1. **System Health**: All dependencies initialized
2. **Cache Freshness**: Recent color updates
3. **Performance Status**: Update duration within thresholds
4. **Change Detection Efficiency**: Percentage of skipped updates
5. **Issue Detection**: Warnings for performance degradation

## Flow Timing Examples

### Scenario 1: Album Change (All Variables Change)

```
Time: 0ms     - ColorHarmonyEngine processes new album art
Time: 2ms     - updateWithAlbumColors() called with OKLAB colors
Time: 3ms     - Variable mapping (96 variables)
Time: 4ms     - Change detection (96 changes detected)
Time: 4ms     - batchSetVariables() with all 96 variables
Time: 8ms     - DOM update complete (96 setProperty calls)
Time: 9ms     - Event emission and cache update
Time: 10ms    - COMPLETE

Duration: ~10ms
Changes Applied: 96/96
Efficiency: 0% skipped (expected for new album)
```

### Scenario 2: Same Album Track Skip (No Color Change)

```
Time: 0ms     - ColorHarmonyEngine processes same album art
Time: 1ms     - updateWithAlbumColors() called with identical OKLAB colors
Time: 2ms     - Variable mapping (96 variables, same values)
Time: 3ms     - Change detection (0 changes detected)
Time: 3ms     - EARLY RETURN (no DOM update)

Duration: ~3ms
Changes Applied: 0/96
Efficiency: 100% skipped (optimization success)
Speedup: 3.3x faster than full update
```

### Scenario 3: Partial Color Change (Edge Case)

```
Time: 0ms     - ColorHarmonyEngine processes similar colors
Time: 2ms     - updateWithAlbumColors() called with slightly different colors
Time: 3ms     - Variable mapping (96 variables)
Time: 4ms     - Change detection (12 changes detected)
Time: 4ms     - batchSetVariables() with 12 changed variables
Time: 5ms     - DOM update complete (12 setProperty calls)
Time: 6ms     - Event emission and cache update
Time: 7ms     - COMPLETE

Duration: ~7ms
Changes Applied: 12/96
Efficiency: 87.5% skipped
Speedup: 1.4x faster than full update
```

## Critical Code References

### Change Detection Implementation
- **Location**: `src-js/utils/spicetify/SpicetifyColorBridge.ts:703-719`
- **Method**: `detectChangedVariables()`
- **Algorithm**: Value comparison against `lastAppliedVariables` cache

### Update Flow
- **Entry**: `SpicetifyColorBridge.ts:435` (updateWithAlbumColors)
- **Mapping**: Lines 437-620 (color variable generation)
- **Detection**: Lines 621-649 (change detection and early return)
- **Application**: Line 640 (cssController.batchSetVariables)
- **Metrics**: Lines 654-666 (performance tracking)
- **Events**: Lines 669-677 (system notification)

### Health Monitoring
- **Method**: `healthCheck()` at lines 787-849
- **Metrics Export**: Lines 796-820
- **Threshold Checks**: Lines 842-849

## Integration Points

### Upstream (Color Source)
- **ColorHarmonyEngine**: Provides OKLAB-processed colors
- **Contract**: `Record<string, string>` with 96 color keys
- **Trigger**: Album art change or track navigation

### Downstream (Color Consumers)
- **UnifiedCSSVariableManager**: Applies variables to DOM
- **Priority**: Critical (immediate processing)
- **Batching**: Single batch operation for efficiency

### Lateral (Event Subscribers)
- **Event**: `colors:applied` via UnifiedEventBus
- **Payload**: Full color set + accent colors + timestamp
- **Subscribers**: Visual effects systems, background controllers

## Architecture Benefits

### Phase 3 Optimizations

1. **Change Detection**
   - Eliminates redundant DOM updates
   - Expected ~90% efficiency during same-album playback
   - Reduces CSS variable write overhead

2. **Performance Monitoring**
   - Real-time update duration tracking
   - Rolling average for trend analysis
   - Health check integration with threshold warnings

3. **Efficiency Metrics**
   - Quantifiable optimization impact
   - Skip rate percentage calculation
   - Performance status categorization

### Overall Flow Benefits

1. **Modular Design**: Clear separation of concerns
2. **Performance-First**: Optimization at every layer
3. **Observable**: Rich metrics and health monitoring
4. **Maintainable**: Well-documented flow and metrics
5. **Scalable**: Efficient handling of frequent updates

## Future Optimization Opportunities

1. **Debouncing**: Add debounce for rapid track changes
2. **Priority Levels**: Variable-specific priority (accent vs. background)
3. **Diff Granularity**: Per-category change detection
4. **Lazy Propagation**: Defer non-critical variable updates
5. **Performance Budgets**: Adaptive quality based on device capabilities
