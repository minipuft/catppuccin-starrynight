# Visual Service Facade Overview

**Status**: Active (2025-10-08)

The Visual Service Facade replaces the legacy `BaseVisualSystem` inheritance model with service-based composition. This document summarises the responsibilities and integration points for the new architecture so teams can build visual systems without relying on globals.

## Goals
- Provide a single entry point (`DefaultVisualCoordinatorService`) for visual system orchestration.
- Expose shared dependencies (CSS writer, performance coordinator, music sync, theming) exclusively through the service container.
- Keep visual systems modular, testable, and decoupled from the `ThemeLifecycleCoordinator` internals.

## Key Components
- **ServiceVisualSystemBase** – foundational class that injects services declared in `SystemServices.ts`. All visual systems now extend or mirror this composition pattern.
- **DefaultServiceFactory** – constructs the full `ServiceContainer`, including `visualCoordinator`, `themingState`, `musicSyncLifecycle`, `settings`, and `themeLifecycle` services.
- **SystemIntegrationCoordinator** – registers facade/coordinator instances and publishes them into the service factory so downstream code never touches globals.
- **ThemeLifecycleCoordinator** – exposes read-only getters for diagnostics but defers operational responsibilities to the service layer.

## Usage Pattern
1. Declare required/optional services in your system (`getRequiredServices`, `getOptionalServices`).
2. Call into the injected services (`this.services.cssVariables`, `this.services.themeLifecycle`) instead of accessing `globalThis.year3000System`.
3. Use `DefaultServiceFactory.registerOverrides` during tests to supply mocks.

## Diagnostics
- Debug tools should query systems through `themeLifecycle.getFacadeCoordinator()` to keep health checks aligned with the facade.
- Legacy documents referencing `BaseVisualSystem` have been archived or updated; consult this overview for the canonical responsibilities.

## Further Reading
- `plans/current/service-architecture-master-plan.md` (Phase A6 / A7 sections)
- `plans/current/visual-alignment-notes.md` (Phase A6.* logs)
- `src-js/core/services/SystemServices.ts` for the full service contract

