# Phase 3: Dependency Injection Cleanup - Progress Tracker

**Status**: 🟡 In Progress
**Started**: 2025-01-05
**Estimated Completion**: 4-6 hours
**Current Progress**: 33%

---

## Overview

Phase 3 focuses on:
1. Establishing SystemCoordinator as single source of truth for dependencies
2. Consolidating cache checking logic (remove getCachedSystem duplication)
3. Removing performance monitoring wrapper overhead (opt-in pattern)
4. Simplifying dependency resolution flow

**Goal**: Reduce dependency checking from 3 layers to 1 layer, improve performance

---

## Task Breakdown

### 3.1 Establish SystemCoordinator as Single Source of Truth ✅

**Status**: COMPLETED
**File**: `src-js/core/integration/SystemCoordinator.ts`

**Problem**: Dependencies checked in 3 places:
1. Constructor injection → NonVisualSystemFacade receives deps
2. getCachedSystem() → Checks if dependency already exists
3. getSystem() → Checks again if dependency exists
4. Finally uses the dependency

**Solution**: SystemCoordinator owns all shared instances, single check

**Actions**:
- [x] Add `getSharedDependency<T>(key: string): T | null` method to SystemCoordinator (lines 2138-2177)
- [x] Update NonVisualSystemFacade.buildSharedDependencies() to query coordinator (lines 922-995)
- [x] Remove duplicate dependency checking logic (achieved via fallback pattern)
- [x] Verify all dependency types supported (all legacy aliases supported)

**Notes**:
- Implemented single switch statement pattern for all dependency types
- Maintained backward compatibility via fallback to instance fields
- Fixed EnhancedMasterAnimationCoordinator export for TypeScript compilation
- TypeScript compiles cleanly with zero errors

---

### 3.2 Consolidate Cache Checking Logic ⏳

**Status**: Not Started
**File**: `src-js/core/integration/NonVisualSystemFacade.ts`

**Problem**: getCachedSystem() and getSystem() duplicate cache checking logic

**Solution**: Merge into single getSystem() method with options parameter

**Actions**:
- [ ] Remove getCachedSystem() method (lines 655-717)
- [ ] Add options parameter to getSystem(): `{ cacheOnly?: boolean }`
- [ ] Merge cache checking logic into getSystem()
- [ ] Query SystemCoordinator for shared dependencies
- [ ] Update all callers of getCachedSystem()

**Notes**:
-

---

### 3.3 Remove Performance Monitoring Wrapper Overhead ⏳

**Status**: Not Started
**File**: `src-js/core/integration/NonVisualSystemFacade.ts` (lines 1059-1102)

**Problem**: Wraps every initialize() and updateAnimation() with performance tracking, adding overhead

**Solution**: Observer pattern (opt-in) - systems control their own monitoring

**Actions**:
- [ ] Create IMonitorableSystem interface in types/systems.ts
- [ ] Simplify integratePerformanceMonitoring() to check for opt-in
- [ ] Remove automatic wrapping of initialize() and updateAnimation()
- [ ] Update systems that need monitoring to implement enablePerformanceMonitoring()

**Notes**:
-

---

### 3.4 Run Validation Suite ⏳

**Status**: Not Started

**Validation Commands**:
- [ ] `npm run typecheck` - zero errors
- [ ] `npm run lint:js` - zero NEW errors
- [ ] `npm test` - all tests pass
- [ ] Dependencies resolve correctly
- [ ] No undefined references
- [ ] Systems initialize properly
- [ ] No performance regression

**Results**:
-

**Notes**:
-

---

## Issues Encountered

### Issue 1
**Description**:
**Resolution**:

---

## Completion Criteria

### Must Have ✅
- [ ] SystemCoordinator.getSharedDependency() implemented
- [ ] NonVisualSystemFacade queries coordinator for dependencies
- [ ] getCachedSystem() removed (merged into getSystem())
- [ ] Performance monitoring is opt-in (no automatic wrapping)
- [ ] TypeScript compiles with zero errors
- [ ] All tests passing
- [ ] Dependencies resolve correctly

### Should Have ✅
- [ ] Dependency checking reduced from 3 layers to 1
- [ ] Clear migration path for systems needing monitoring
- [ ] Code complexity reduced

### Nice to Have ✨
- [ ] Performance improvements measured
- [ ] Integration tests added

---

## Timeline

**Estimated**: 4-6 hours
**Actual**: TBD

**Breakdown**:
- Task 3.1 (Single Source): 1-2 hours
- Task 3.2 (Cache Consolidation): 1-2 hours
- Task 3.3 (Monitoring Opt-in): 1-2 hours
- Task 3.4 (Validation): 1 hour

---

## Next Steps

After Phase 3 completion:
1. Review and commit changes
2. Update main plan document
3. Consider Phase 4: Integration Validation & Testing

---

**Last Updated**: 2025-01-05
**Updated By**: Claude Code
