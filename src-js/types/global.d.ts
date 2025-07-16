import { Year3000System } from "../core/lifecycle/year3000System";

declare global {
  var year3000System: Year3000System | undefined;
}

// This empty export is needed to treat this file as a module.
export {};
