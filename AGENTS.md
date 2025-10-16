# Catppuccin StarryNight - Agent Quick Start

## Documentation Layers

| Layer             | Purpose                                                              | File               |
| ----------------- | -------------------------------------------------------------------- | ------------------ |
| Global quickstart | Minimal context you should load first; links to deeper layers        | `AGENTS.md`        |
| Domain rules      | Condensed architecture, workflows, and constraints for this codebase | `AGENTS.domain.md` |
| Local workflow    | Environment, build, and verification guidance tailored for this repo | `AGENTS.local.md`  |
| Claude deep dive  | Full reference used by Claude when you need exhaustive detail        | `CLAUDE.md`        |

## Core Stack

- **Languages**: TypeScript (strict mode) + SCSS
- **Build**: ESBuild for TypeScript, SASS for SCSS → producing `theme.js` and `user.css`
- **Architecture**: Modular TypeScript with service composition and unified lifecycle management
- **Entry points**: `src-js/theme.entry.ts` → `theme.js`, `app.scss` → `user.css`

## Essential Commands

- `npm run build` - Full development build (TS + SCSS)
- `npm run build:js:dev` - TypeScript rebuild with sourcemap (`src-js/` → `theme.js`)
- `npm run build:css:dev` - SCSS rebuild expanded (`src/` → `user.css`)
- `npm run validate` - Complete validation (typecheck + lint + test)

## Safe Coding Defaults

- **Edit sources only**: Never patch compiled artifacts (`theme.js`, `user.css`) directly
- **Performance first**: Guard 60fps target and memory budgets; highlight hot paths
- **Accessibility**: Respect `prefers-reduced-motion`, contrast requirements, fallbacks
- **Reversible changes**: Small increments, thorough interface searches, documented assumptions

## Development Workflow

1. **Investigate**: Use domain rules and search (`rg`) to understand impacted systems
2. **Plan**: Consider interfaces, lifecycle, and performance end-to-end before implementation
3. **Build & Validate**: Rebuild and test after changes, noting results in summary
4. **Performance**: Keep 60fps target and graceful degradation in mind during testing

## Next Steps

### Need Architecture/Domain Details?

→ Read `AGENTS.domain.md` for system hierarchy, interface patterns, and constraints

### Need Local Environment/Workflow?

→ Read `AGENTS.local.md` for environment setup, commands, and verification process

## Key References

- `docs/MASTER_ARCHITECTURE_OVERVIEW.md` - Complete system architecture
- `docs/API_REFERENCE.md` - Interface catalog and implementation examples
- `docs/VISUAL_EFFECTS_COORDINATION.md` - Visual system coordination guide
- `docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md` - Performance budgets and optimization
