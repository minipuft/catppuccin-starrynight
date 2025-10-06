# Catppuccin StarryNight Styling & Tokens

## Scope
Single source for the theme's design tokens, CSS usage patterns, and governance rules. Supersedes the legacy token governance/system/usage docs by distilling active guidance that matches the current codebase.

## System Overview
- Token store: `src/design-tokens/tokens.scss` (277 tokens after consolidation).
- Runtime managers: `CSSVariableWriter`, `CSSVariableBatcher`, `SpicetifyColorBridge`, and music/color services keep dynamic tokens (`--sn-dynamic-*`, `--sn-oklab-*`, `--sn-music-*`) in sync with visuals.
- Build integration: SASS/PostCSS preserves comments and ordering; TypeScript accesses tokens through CSS variables at runtime.

### Primary Categories
| Category | Prefix Examples | Purpose |
| -------- | ---------------- | ------- |
| Animation & Transitions | `--sn-anim-*`, `--sn-transition-*` | Durations, easings, breathing effects. |
| Color Palettes | `--sn-color-*`, `--sn-cosmic-*` | Base Catppuccin palette. |
| Dynamic/OKLAB | `--sn-dynamic-*`, `--sn-oklab-*`, `--sn-musical-oklab-*` | Music/album art driven colors. |
| Layout & Depth | `--sn-layout-*`, `--sn-visual-effects-*` | Spacing, radius, z-index, depth cues. |
| Music Sync | `--sn-music-*` | Realtime metrics exposed by `MusicSyncService`. |
| UI Systems | `--sn-ui-*`, `--sn-sidebar-*` | UI-specific styling knobs. |

## Naming & Governance
- Format: `--sn-{category}-{name}[-{variant}]` (e.g. `--sn-dynamic-accent-rgb`).
- Categories listed above; keep names semantic and reusable.
- Addition checklist:
  1. Search existing tokens (`rg "--sn-" src/design-tokens/tokens.scss`).
  2. Confirm reuse in 2+ places or runtime dependency.
  3. Document purpose, planned usage, and TypeScript interactions.
  4. Follow prefixes and provide example snippet in PR.
- Review requirements: maintainer approval, duplicate scan (`./scripts/validate-tokens.sh`), update `docs/STYLING_AND_TOKENS.md` if behavior changes.
- Deprecation: mark alias with comment, provide migration note, remove only in major release (see legacy migration history below).

## Usage Patterns
### SCSS
```scss
@use "../core/_design_tokens" as *;

.card {
  background: oklab-color('accent', 0.12);
  border-radius: var(--sn-layout-radius-lg);
  transition: transform var(--sn-transition-fast-duration) var(--sn-anim-easing-organic);
}
```
- Prefer helpers (`oklab-color`, mixins) over raw `var()` when available.
- Keep var chains <=2 levels; tokens already optimized for delegation.

### JavaScript / TypeScript
```ts
import { CSSVariableWriter } from "@/core/css/CSSVariableWriter";

CSSVariableWriter.getInstance().setVariables("visual-effects", {
  "--sn-dynamic-accent-rgb": palette.accent.rgb,
  "--sn-music-beat-pulse-intensity": beatState.intensity.toString(),
});
```
- Use `CSSVariableWriter`/`CSSVariableBatcher` for batched DOM updates.
- Music-driven values come from `MusicSyncService`, color harmonization from `ColorHarmonyEngine` (documented in `docs/COLOR_AND_AUDIO.md`).

## Migration Guidance
- When touching legacy code, update to the new prefix and document the change in the PR.
- Reference mapping lives in `docs/legacy/tokens/LEGACY_TOKEN_MIGRATION.md` for historical context.

## Tooling & Validation
- `npm run validate:tokens` (or `scripts/validate-tokens.sh`) checks for duplicate or missing tokens.
- `plans/token-governance/` (if present) tracks in-flight proposals-ensure this doc reflects approved changes.
- For CI lint/formatting, tokens are treated as regular CSS variables; ensure new tokens do not break minified outputs.

## Verification Notes (2025-10-06)
- Reviewed `docs/token-governance.md`, `token-system-architecture.md`, `token-usage-guide.md`, `LEGACY_TOKEN_MIGRATION.md`, and `src/design-tokens/tokens.scss` while drafting this document.

