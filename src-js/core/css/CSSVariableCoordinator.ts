import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";

export type VariablePriority = "low" | "normal" | "high" | "critical";

export class CSSVariableCoordinator {
  private controller: UnifiedCSSConsciousnessController | null;

  constructor(controller?: UnifiedCSSConsciousnessController | null) {
    this.controller =
      controller ?? UnifiedCSSConsciousnessController.getInstance?.() ?? null;
  }

  async batchSetVariables(
    caller: string,
    variables: Record<string, string>,
    priority: VariablePriority = "normal",
    source: string = "unknown"
  ): Promise<void> {
    if (this.controller) {
      this.controller.updateVariables(
        variables,
        priority,
        `${caller}:${source}`
      );
    } else {
      this.applyDirect(variables);
    }
  }

  async setVariable(
    caller: string,
    property: string,
    value: string,
    priority: VariablePriority = "normal",
    source: string = "unknown"
  ): Promise<void> {
    if (this.controller) {
      // Delegate single-variable updates via updateVariables to match controller API
      this.controller.updateVariables(
        { [property]: value },
        priority,
        `${caller}:${source}`
      );
    } else {
      this.applyDirect({ [property]: value });
    }
  }

  // -------------------------------------------------------------------------
  // Fallback when the main controller hasn’t been initialised
  // -------------------------------------------------------------------------
  private applyDirect(vars: Record<string, string>) {
    const root = document.documentElement;
    for (const [k, v] of Object.entries(vars)) {
      root.style.setProperty(k, v);
    }
  }
}

/**
 * Project-wide singleton for convenience injection.
 */
export const globalCSSVariableCoordinator = new CSSVariableCoordinator();
