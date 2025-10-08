# Color Diagnostics Testing Plan (Deferred)

**Status**: Completed – 2025-10-08
**Purpose**: Capture the follow-up work required to build automated coverage for the migrated color/diagnostics services once the architecture refactor settles.

## Context
- Phase A6 completed the services migration for UI + color orchestration.
- Diagnostics tooling will switch to service-based access in the current cycle; automated tests will follow in this future workstream.

## Outcome
- Added `tests/integration/color/ColorDiagnosticsService.integration.test.ts` to validate service resolution across the color/diagnostics pipeline, ensuring no fallbacks to `globalThis` remain.
- Manual scripts updated to avoid writing to `globalThis`; internal mocks demonstrate how to override `DefaultServiceFactory` services for future tests.
- Further documentation captured in `plans/current/visual-alignment-notes.md` Phase A6.2/A7 entries.
