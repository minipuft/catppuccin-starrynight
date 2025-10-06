# Catppuccin StarryNight - Domain Rules

## Stack and Constraints
- Languages: TypeScript (strict, `@/` aliases) and SCSS composed through design tokens; no runtime CSS-in-JS.
- Tooling: ESBuild bundler, SASS/PostCSS pipeline, Jest/ts-jest for tests; keep configurations aligned with repo defaults.
- Performance: Target 60fps, minimal memory churn, and graceful degradation via device tier detection.
- Resilience: Wrap Spicetify API calls in try/catch with fallbacks to CSS-only behavior; maintain accessibility defaults (`prefers-reduced-motion`, Catppuccin contrast).
- Avoid: Heavy UI/animation libs (jQuery, GSAP, Three.js), alternative bundlers (Webpack/Rollup/Parcel), and tight DOM mutation loops.

## Project Architecture Snapshot
- `AdvancedThemeSystem` boots `SystemCoordinator`, linking `VisualSystemCoordinator` and `NonVisualSystemFacade`.
- Visual effects reside in `src-js/visual/` (WebGL renderer, effect controllers) paired with SCSS modules in `src/`.
- Audio and color services in `src-js/audio/` (`MusicSyncService`, `ColorHarmonyEngine`) feed shared state and drive visuals.
- Entry point `src-js/theme.entry.ts` negotiates Spicetify APIs progressively and manages lifecycle sequencing.
- Runtime systems implement `IManagedSystem` (`initialize`, `updateAnimation`, `healthCheck`, `destroy`, optional `forceRepaint`).

## Build Pipelines
- TypeScript: `src-js/**/*.ts` -> bundled `theme.js` via ESBuild (tree-shaken, React/ReactDOM treated as externals).
- SCSS: `src/**/*.scss` -> compiled `user.css` through SASS with PostCSS optimizers.
- Commands: `npm run build:js:dev` / `npm run build:js:prod`, `npm run build:css:dev` / `npm run build:css:prod`, or `npm run build` for both; only the generated `theme.js` and `user.css` are loaded by Spicetify.
- Treat build outputs as artifacts; never hand-edit them.

## System Responsibilities
- `src-js/core/` - coordinators, lifecycle orchestration, dependency wiring.
- `src-js/audio/` - beat detection, audio analysis, music-driven cues.
- `src-js/visual/` - effect modules, renderers, background systems.
- `src-js/utils/` / `src-js/config/` - shared helpers, configuration defaults, feature flags.
- `src/` SCSS structure mirrors systems (layout, components, systems) and hosts Catppuccin tokens.

## Quality Standards
- Performance features expose tuning hooks via `SettingsManager` and integrate with `PerformanceAnalyzer`.
- Extend tests under `tests/unit`, `tests/integration`, and `tests/performance`; keep subset commands (`npm run test:unit:*`) healthy.
- Update JSDoc/markdown references when altering public interfaces or workflows.

## Coding Practices
- Favor explicit interfaces over `any`; keep path aliases consistent with `tsconfig.json` and `jest.config.js`.
- Maintain naming conventions: classes PascalCase, utilities camelCase, SCSS mixins kebab-case, CSS vars prefixed `--sn-`.
- Register new systems with the appropriate coordinator/facade and implement the full `IManagedSystem` contract.

## Supporting References
- Full brief: `CLAUDE.md`.
- Visual coordination: `docs/VISUAL_EFFECTS_COORDINATION.md`.
- Performance playbook: `docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md`.
- Feature acceptance criteria: `.cursor/rules/features.mdc`.
