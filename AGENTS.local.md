# Catppuccin StarryNight - Local Workflow

## Working Files

- Source of truth lives in `src-js/` (TypeScript) and `src/` (SCSS); rebuild to refresh `theme.js` and `user.css` and never hand-edit those artifacts.
- Distribution assets reside under `Extensions/`, install scripts (`install.sh`, `install-hybrid.sh`, `install.ps1`), and packaging helpers in `build/`; keep them aligned with the latest build outputs.
- Configuration inputs include `manifest.json`, `color.ini`, and files in `config/`; update them alongside code changes that affect packaging or metadata.

## Spicetify Touchpoints

- `install.sh`, `install-hybrid.sh`, and `install.ps1` deploy the generated theme files into the user's Spicetify directories; rerun them only after rebuilding artifacts.
- `Extensions/catppuccin-starrynight.js` is the extension entry that Spicetify loads; treat it as generated and refresh it via the build/install workflow.
- `build/` stores release bundles; use npm scripts to regenerate rather than manual edits.
- `runtime-state/` and `logs/` capture diagnostic output during development; review them when debugging install issues but avoid committing noise.

## Commands You Will Use Most

- `npm run build` for combined artifact refresh; prefer targeted `npm run build:js:dev` or `npm run build:css:dev` while iterating.
- Validation: `npm run typecheck`, `npm test`, `npm run lint:js`, `npm run lint:css`, `npm run validate`.
- Watchers: `npm run sass:watch` for live SCSS feedback when needed.

## Execution Tips

- Use `rg` and `sed` for navigation; avoid loading large docs unless the condensed guides are insufficient.
- Before modifying coordinators or interfaces, search for all implementations with commands like `rg 'ClassName'` to protect lifecycle contracts.
- Keep performance context handy; debug utilities and toggles sit in `src-js/debug/` and `src-js/config/advanced-system-config`.
- When introducing new settings or toggles, sync TypeScript config objects and SCSS tokens to maintain parity.

## Verification and Reporting

- Capture build/test outputs locally; summarize pass/fail status in final responses instead of pasting logs.
- Highlight any performance-sensitive areas touched and note whether additional profiling is required.
- Reference the relevant section from `AGENTS.domain.md` or deeper docs when explaining complex changes.

## Additional Notes

- `plans/` stores initiative write-ups that can inform large refactors; check `archive/` for historical context when needed.
