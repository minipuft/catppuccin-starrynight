# Catppuccin StarryNight - Local Workflow

## Build & Test Commands

### Build Pipeline

- `src-js/**/*.ts` → `theme.js` (ESBuild with tree-shaking, React/ReactDOM external)
- `src/**/*.scss` → `user.css` (SASS with PostCSS optimization)

### Essential Commands

- `npm run build` - Full development build (CSS + JS with sourcemap)
- `npm run build:dev` - Same as build (development mode)
- `npm run build:prod` - Production build with minification and PostCSS optimization
- `npm run build:fast` - Quick production build (compressed CSS + minified JS)
- `npm run build:js:dev` - TypeScript bundle with sourcemap
- `npm run build:js:prod` - Minified TypeScript bundle
- `npm run build:css:dev` - Expanded SCSS compilation
- `npm run build:css:prod` - Compressed SCSS with PostCSS optimization

### Validation Commands

- `npm run typecheck` - TypeScript compilation check
- `npm test` - Run Jest tests
- `npm run lint:js` - ESLint on TypeScript (strict mode, zero warnings)
- `npm run lint:js:fix` - Fix ESLint issues automatically
- `npm run lint:css` - Stylelint on SCSS files
- `npm run validate` - Complete validation (typecheck + lint + test)

### Testing Commands

- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:unit:audio` - Audio system unit tests
- `npm run test:unit:core` - Core system unit tests
- `npm run test:unit:visual` - Visual system unit tests
- `npm run test:unit:utils` - Utility function unit tests
- `npm run test:comprehensive` - Full test suite including performance tests

### CSS Development

- `npm run sass:watch` - Watch SCSS files for changes and auto-compile
- `npm run scan-css` - Scan SCSS files for tokens and variables
- `npm run diff-css` - Show differences between CSS token versions
- `npm run replace-css` - Replace CSS tokens using mapping
- `npm run generate-map` - Generate replacement mapping for CSS tokens
- `npm run prune-css` - Remove duplicate CSS declarations
- `npm run build:css:purgecss` - Build CSS with unused styles removed
- `npm run build:css:advanced` - Advanced CSS optimization build

### Installation & Release

- `npm run install` - Build and install theme (CI detection)
- `npm run install:force` - Force install with mocha flavor
- `npm run prepare:release` - Prepare files for release

## Runtime Environment

- **Target**: Chromium engine (Spotify's embedded browser)
- **React/ReactDOM**: Provided by Spicetify, marked as external in ESBuild
- **APIs**: `Spicetify.Player`, `Platform`, `colorExtractor`, `getAudioData`
- **Progressive Enhancement**: Graceful degradation when APIs unavailable

## Development Workflow

### File Navigation

- Use **Glob** tool for finding files by patterns: `**/*.ts`, `src-js/**/*`, `src/**/*.scss`
- Use **Grep** tool for code search: find implementations, interfaces, references
- Use **Read** tool to understand file contents before making changes
- **TypeScript Entry Point**: `src-js/theme.entry.ts` (compiles to `theme.js`)
- **SCSS Entry Point**: `app.scss` (imports from `src/`, compiles to `user.css`)

### Development Process

1. **Understand First**: Read relevant files and understand current architecture
2. **Search Thoroughly**: Use Grep to find all references before modifying interfaces
3. **Build After Changes**:
   - TypeScript changes: Run `npm run build:js:dev` to rebuild `theme.js`
   - SCSS changes: Run `npm run build:css:dev` to rebuild `user.css`
   - Full rebuild: Run `npm run build` for both
4. **Test Continuously**: Run `npm run typecheck` and `npm test` after changes
5. **Validate Performance**: Ensure changes don't break performance requirements
6. **Document Changes**: Update JSDoc comments for public API changes

**Critical**: Remember that Spicetify loads the compiled `theme.js` and `user.css` files, not the source files directly. Always rebuild after making changes to see them take effect.

### Common Tasks

- **Adding Visual Effects**: Extend `ServiceVisualSystemBase`, register with `VisualEffectsCoordinator`
- **Adding Infrastructure Systems**: Extend `ServiceSystemBase`, register with `InfrastructureSystemCoordinator`
- **Legacy Systems**: Still using `BaseVisualSystem` (14 systems pending migration to service composition)
- **Performance Optimization**: Use `SimplePerformanceCoordinator` integration, measure before/after
- **Color Processing**: Use `ColorHarmonyEngine` and OKLAB color space
- **Music Integration**: Integrate with `MusicSyncService` for audio-reactive features
- **Settings**: Use `TypedSettingsManager` singleton for persistent configuration

### Error Handling Patterns

- All Spicetify API calls must have try-catch blocks with fallback behavior
- Progressive enhancement when APIs are unavailable
- Graceful degradation maintaining core CSS-only functionality
- Health check methods for system diagnostics

## Performance Monitoring

- **Target**: 60fps with adaptive quality scaling
- **Memory**: Minimize heap usage, prevent leaks
- **Responsiveness**: UI interactions <100ms
- **Bundle Size**: Production builds with minification
- **Device Detection**: Hardware-aware optimization
