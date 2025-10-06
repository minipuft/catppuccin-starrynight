# Catppuccin StarryNight - Codex Agent Guide

## Rule Layers

| Layer             | Purpose                                                              | File               |
| ----------------- | -------------------------------------------------------------------- | ------------------ |
| Global quickstart | Minimal context you should load first; links to deeper layers        | `AGENTS.md`        |
| Domain rules      | Condensed architecture, workflows, and constraints for this codebase | `AGENTS.domain.md` |
| Local workflow    | Environment, build, and verification guidance tailored for this repo | `AGENTS.local.md`  |
| Claude deep dive  | Full reference used by Claude when you need exhaustive detail        | `CLAUDE.md`        |

## Quick Start

- Core stack: TypeScript + SCSS with ESBuild and SASS pipelines producing `theme.js` and `user.css`.
- Entry point: `src-js/theme.entry.ts` bootstraps `AdvancedThemeSystem` that wires visual and service layers.
- Rebuild after changes: `npm run build:js:dev` (TS), `npm run build:css:dev` (SCSS), or `npm run build` for both.
- Validate often: `npm run typecheck`, `npm test`, `npm run lint:js`, `npm run lint:css`, `npm run validate`.

## Safe Coding Defaults

- Edit sources only; rebuild to update `theme.js` and `user.css`, never patch artifacts directly.
- Identify affected systems upfront and run targeted tests or builds before handoff; summarize results.
- Guard performance budgets (60fps target, low memory churn) and highlight introduced hot paths.
- Preserve accessibility defaults: respect `prefers-reduced-motion`, Catppuccin contrast, and fallback behavior.
- Keep changes reversible: small increments, thorough searches before interface edits, document assumptions.

## Workflow Pattern

- Investigate before editing: open modules referenced in the domain rules, rely on `rg` for search.
- Plan changes end-to-end (interfaces, lifecycle, performance) prior to implementation.
- Keep performance budgets in mind (60fps target, graceful degradation) and reflect that in testing.
- Rebuild and rerun relevant validation commands before sharing work; note results in your summary.

## When You Need More Detail

- Architecture, system responsibilities, constraints -> `AGENTS.domain.md`.
- Environment specifics, build outputs, execution tips -> `AGENTS.local.md`.
- Full Claude brief (long form, optional deep dive) -> `CLAUDE.md`.
- Feature specs and research notes live under `docs/`; link to them only when necessary.

## Reference Index

- `docs/MASTER_ARCHITECTURE_OVERVIEW.md` - full system design narrative.
- `docs/API_REFERENCE.md` - interface catalog with usage notes.
- `docs/VISUAL_EFFECTS_COORDINATION.md` - visual pipeline and coordinator detail.
- `docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md` - budgets, metrics, and tuning strategies.
- `.cursor/rules/*.mdc` - context-engineering playbooks for features, requirements, and flows.
