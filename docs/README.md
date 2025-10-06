# Catppuccin StarryNight Documentation Index

## Core Guides
| Topic | File | Purpose |
| --- | --- | --- |
| Architecture Overview | `docs/ARCHITECTURE.md` | Lifecycle, coordinators, and system responsibilities matching the live code. |
| Build & Deployment | `docs/BUILD_AND_DEPLOY.md` | Build commands, validation workflow, install scripts, CI overview, troubleshooting. |
| Color & Audio Integration | `docs/COLOR_AND_AUDIO.md` | MusicSyncService, ColorHarmonyEngine, OKLAB/SCSS usage, and event flow. |
| Styling & Tokens | `docs/STYLING_AND_TOKENS.md` | Token taxonomy, naming policy, SCSS/TS patterns, governance rules. |

## Supporting References
| Topic | File |
| --- | --- |
| Visual effects coordination details | `docs/VISUAL_EFFECTS_COORDINATION.md` |
| Graceful degradation behavior | `docs/GRACEFUL_DEGRADATION_GUIDE.md` |
| Performance monitoring & quality scaling | `docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md` |

Legacy documentation now resides under `docs/legacy/` for historical reference only.

## Maintenance Notes
- Update the relevant guide (and log verification in `plans/documentation-cleanup.md`) whenever code changes affect lifecycle orchestration, build scripts, color/audio processing, or tokens.
- Add new docs to this index as they are created so contributors and assistants can quickly find reliable entry points.
