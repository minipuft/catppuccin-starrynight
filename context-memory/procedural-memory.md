# Procedural Memory

_This file follows the cognitive architecture defined in: /home/minipuft/.claude/context-engineering/memory-types.md_

## Procedure Categories

### Build & Deployment Procedures

#### Building the Theme
**Prerequisites**:
- Node.js 18+ installed
- npm dependencies installed (`npm install`)
- TypeScript 5.3+ available

**Steps**:
1. **Development Build**:
   ```bash
   npm run build
   ```
   - Uses ESBuild for fast compilation
   - Outputs to `theme.js`
   - Source maps included

2. **Production Build**:
   ```bash
   npm run build:prod
   ```
   - Minification enabled
   - Tree shaking aggressive
   - No source maps

3. **Watch Mode** (for development):
   ```bash
   npm run watch
   ```
   - Auto-rebuilds on file changes
   - Preserves console logs

**Post-Build Validation**:
- Check bundle size: `ls -lh theme.js` (target <1.5MB)
- Verify no TypeScript errors in output
- Test in Spotify immediately

#### SCSS Compilation
**Note**: SCSS compilation is manual (not in npm scripts)

**Steps**:
1. **Navigate to source**:
   ```bash
   cd src/
   ```

2. **Compile with Sass**:
   ```bash
   sass app.scss:../user.css --style=compressed --no-source-map
   ```

3. **Verify output**:
   - Check `user.css` exists in root
   - Verify no compilation warnings
   - Test visual appearance in Spotify

**Common Issues**:
- Missing imports: Check all `@import` paths
- Variable undefined: Ensure `_variables.scss` loaded first
- Deprecation warnings: Update syntax as needed

### Testing Procedures

#### Running Test Suite
**Full Test Suite**:
```bash
npm test
```

**With Coverage**:
```bash
npm test -- --coverage
```

**Watch Mode**:
```bash
npm test -- --watch
```

**Specific Test File**:
```bash
npm test -- src/visual/consciousness/EtherealBeautyEngine.test.ts
```

#### Writing New Tests
1. **Create test file**: `[Component].test.ts`
2. **Import testing utilities**:
   ```typescript
   import { renderHook, act } from '@testing-library/react-hooks';
   import { Year3000System } from '@/core/lifecycle/year3000System';
   ```

3. **Mock Spicetify APIs**:
   ```typescript
   global.Spicetify = {
     Player: { addEventListener: jest.fn() },
     Platform: { History: { push: jest.fn() } }
   };
   ```

4. **Test pattern**:
   ```typescript
   describe('ComponentName', () => {
     beforeEach(() => { /* setup */ });
     afterEach(() => { /* cleanup */ });
     
     it('should perform expected behavior', async () => {
       // Arrange
       // Act  
       // Assert
     });
   });
   ```

### Development Workflow Procedures

#### Starting New Feature Development
1. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Update working memory**:
   - Edit `context-memory/working-memory.md`
   - Document current task and context

3. **Run neural monitor** (optional):
   ```bash
   /home/minipuft/Applications/neural-workbench/scripts/neural-monitor.sh .
   ```

4. **Development cycle**:
   - Write code
   - Run tests frequently
   - Check TypeScript: `npm run typecheck`
   - Verify build: `npm run build`

5. **Before committing**:
   ```bash
   npm run validate  # Runs all checks
   ```

#### Implementing Comprehensive Phase (A/I/M)
**For major architectural changes**:

1. **Create phase structure**:
   ```bash
   scripts/create-comprehensive-phase.sh phase-name \
     -d "Description of the phase" \
     -t "Target metrics (e.g., 50% code reduction)"
   ```

2. **Analysis phase**:
   - Navigate to `plans/phase-name/analysis/`
   - Complete all analysis documents
   - Validate: `scripts/validate-phase-gating.sh phase-name analysis`
   - Progress: `scripts/progress-section.sh phase-name analysis implementation`

3. **Implementation phase**:
   - Navigate to `plans/phase-name/implementation/`
   - Develop unified controllers
   - Create backwards compatibility layer
   - Validate: `scripts/validate-phase-gating.sh phase-name implementation --strict`
   - Progress: `scripts/progress-section.sh phase-name implementation migration`

4. **Migration phase**:
   - Update integration points
   - Test thoroughly
   - Document metrics in `artifacts/`
   - Complete: `scripts/progress-section.sh phase-name migration`

### Performance Optimization Procedures

#### Profiling Performance Issues
1. **Enable debug mode**:
   ```javascript
   window.YEAR3000_CONFIG = { enableDebug: true };
   ```

2. **Access debug console**:
   ```javascript
   window.Y3K
   ```

3. **Check specific metrics**:
   ```javascript
   Y3K.performance.getMetrics()
   Y3K.performance.getBottlenecks()
   Y3K.systems.healthCheck()
   ```

4. **Chrome DevTools workflow**:
   - Performance tab → Record
   - Reproduce issue
   - Analyze flame graph
   - Check for long tasks (>50ms)

#### Implementing Performance Fix
1. **Measure baseline**:
   - Document current metrics
   - Take performance profile
   - Note specific bottlenecks

2. **Implement fix**:
   - Follow CSS Variable Batching pattern if DOM-related
   - Use requestAnimationFrame for animations
   - Consider device tier adaptations

3. **Validate improvement**:
   - Re-measure all metrics
   - Ensure no regressions
   - Test on low-end device

4. **Document pattern**:
   - If >20% improvement, add to semantic memory
   - Share via synaptic broadcast

### Integration Procedures

#### Adding New Visual System
1. **Create system class**:
   ```typescript
   export class NewSystem implements IManagedSystem {
     initialized = false;
     
     async initialize(): Promise<void> { }
     updateAnimation(deltaTime: number): void { }
     async healthCheck(): Promise<HealthCheckResult> { }
     destroy(): void { }
   }
   ```

2. **Register with facade**:
   - Add to `VisualSystemFacade.createSystem()`
   - Define system type in `types/systems.ts`

3. **Add initialization**:
   - Update `Year3000System.initialize()`
   - Add to appropriate initialization phase

4. **Test integration**:
   - Verify system initializes
   - Check health reporting
   - Ensure proper cleanup

#### Updating Spicetify APIs
1. **Check API availability**:
   ```typescript
   if (Spicetify.Platform?.History) {
     // Use API
   } else {
     // Fallback behavior
   }
   ```

2. **Add to API detection**:
   - Update `theme.entry.ts` detection logic
   - Document in semantic memory

3. **Test across scenarios**:
   - API available
   - API unavailable
   - API becomes available later

### Troubleshooting Procedures

#### Build Failures
1. **TypeScript errors**:
   ```bash
   npm run typecheck -- --listFiles
   ```
   - Check for missing types
   - Verify import paths
   - Look for circular dependencies

2. **Bundle too large**:
   ```bash
   npm run build -- --metafile=meta.json
   npx esbuild-visualizer meta.json
   ```
   - Identify large dependencies
   - Check for accidental includes
   - Verify tree shaking working

#### Runtime Issues
1. **White screen/no rendering**:
   - Check browser console for errors
   - Verify Spicetify APIs loaded
   - Check theme.js loaded successfully

2. **Performance degradation**:
   - Enable debug mode
   - Check system health
   - Look for error loops
   - Verify memory usage

3. **Consciousness features not working**:
   - Check MusicSyncService initialized
   - Verify audio data available
   - Check beat detection working
   - Validate color extraction

### Maintenance Procedures

#### Weekly Maintenance
1. **Update dependencies**:
   ```bash
   npm outdated
   npm update --save
   ```

2. **Run full validation**:
   ```bash
   npm run validate
   npm run test:comprehensive
   ```

3. **Check memory sizes**:
   ```bash
   du -h context-memory/*.md
   ```
   - Summarize if approaching limits

4. **Review patterns**:
   - Check neural workbench for new patterns
   - Update semantic memory with discoveries

#### Pattern Migration
1. **From plans/ to context-memory/**:
   - Extract patterns from phase documentation
   - Add to semantic-memory.md
   - Update procedural-memory.md if needed

2. **Broadcasting successful patterns**:
   ```bash
   /home/minipuft/Applications/neural-workbench/scripts/synaptic-broadcast.sh
   ```
   - Choose option 1 (Broadcast Success Pattern)
   - Provide pattern details
   - Specify source project

---

## Quick Reference Commands

### Essential Commands
```bash
# Build
npm run build               # Development
npm run build:prod         # Production

# Test
npm test                   # Run tests
npm run typecheck         # TypeScript check
npm run lint:js          # ESLint
npm run lint:css        # Stylelint

# Validate
npm run validate         # All checks

# Neural Workbench
neural-monitor.sh .     # Monitor project
synaptic-broadcast.sh   # Share patterns
```

### Debug Commands
```javascript
// In browser console
window.YEAR3000_CONFIG = { enableDebug: true }
window.Y3K.performance.getMetrics()
window.Y3K.systems.listAll()
window.Y3K.systems.healthCheck()
```

---

**Last Updated**: 2025-08-01
**Categories**: Build, Test, Development, Performance, Integration, Troubleshooting, Maintenance