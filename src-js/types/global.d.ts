import { ThemeLifecycleCoordinator, Year3000System } from "../core/lifecycle/ThemeLifecycleCoordinator";

declare global {
  var year3000System: ThemeLifecycleCoordinator | undefined;
}

// This empty export is needed to treat this file as a module.
export {};
